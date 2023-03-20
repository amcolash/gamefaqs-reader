import React, { useEffect, useState } from 'react';
import { style } from 'typestyle';

import { Guide } from './Guide';
import { Games } from './Games';
import { Guides } from './Guides';
import { Recents } from './Recents';

import { useLocalStorage } from '../hooks/useLocalStorage';
import { useOnline } from '../hooks/useOnline';
import { lastGame, lastGuide, recentGuideKey } from '../utils/util';

import OfflineIcon from '../icons/wifi-off.svg';
import { cleanupNavigation, initNavigation } from '../utils/nav';

export function App() {
  const online = useOnline();
  const [search, setSearch] = useState(); // Keep track of search for ui
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
      if (recent.length > 7) {
        const removed = recent.pop();
        window.electronAPI.removeGuide(removed.gameId, removed.id);
      }

      setRecentGuides(recent);
    }
  }, [guide]);

  useEffect(() => {
    initNavigation();

    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        if (guide) setGuide();
        else if (game) setGame();
      }
    };

    window.addEventListener('keydown', escapeHandler);

    return () => {
      cleanupNavigation();
      window.removeEventListener('keydown', escapeHandler);
    };
  }, [guide, game]);

  return (
    <div className={containerStyle}>
      {guide ? (
        <Guide guide={guide} setGuide={setGuide} />
      ) : !guide && game && online ? (
        <Guides game={game} setGuide={setGuide} setGame={setGame} />
      ) : (
        <div>
          {!online && (
            <h1 style={{ textAlign: 'center' }}>
              Device Offline <OfflineIcon className="icon" />
            </h1>
          )}
          {online && <Games setGame={setGame} setSearch={setSearch} />}
          {(!search || search.length === 0) && recentGuides.length > 0 && (
            <Recents setGuide={setGuide} recentGuides={recentGuides} setRecentGuides={setRecentGuides} />
          )}
        </div>
      )}
    </div>
  );
}
