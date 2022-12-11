import React, { useEffect } from 'react';

import { Guide } from './Guide';
import { Games } from './Games';
import { Guides } from './Guides';

import { useLocalStorage } from './utils/hooks';
import { lastGame, lastGuide, lastScroll, recentGuideKey } from './utils/util';

import { Recents } from './Recents';
import { style } from 'typestyle';

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
    } else localStorage.removeItem(lastScroll);
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
