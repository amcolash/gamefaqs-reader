import React, { useContext, useEffect } from 'react';
import { style } from 'typestyle';

import { Guide } from './Guide';
import { Games } from './Games';
import { Guides } from './Guides';
import { Recents } from './Recents';

import { useLocalStorage } from '../hooks/localStorage';
import { lastGame, lastGuide, recentGuideKey } from '../utils/util';

export function App() {
  const [game, setGame] = useLocalStorage(lastGame);
  const [guide, setGuide] = useLocalStorage(lastGuide);
  const [recentGuides, setRecentGuides] = useLocalStorage(recentGuideKey, []);

  const containerStyle = style({
    padding: '1rem',
    width: guide ? undefined : '85%',
    maxWidth: 'var(--maxWidth)',
  });

  useEffect(() => {
    if (guide) {
      let recent = [...recentGuides];
      recent = recent.filter((g) => guide.id !== g.id);
      recent.unshift(guide);
      if (recent.length > 5) recent.pop();

      setRecentGuides(recent);
    }
  }, [guide]);

  return (
    <div className={containerStyle}>
      {guide ? (
        <Guide guide={guide} setGuide={setGuide} />
      ) : !guide && game ? (
        <Guides game={game} setGuide={setGuide} setGame={setGame} />
      ) : (
        <div>
          <Games setGame={setGame} />
          {recentGuides.length > 0 && <Recents setGuide={setGuide} recentGuides={recentGuides} setRecentGuides={setRecentGuides} />}
        </div>
      )}
    </div>
  );
}
