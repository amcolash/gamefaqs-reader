import React, { useEffect } from 'react';

import { lastGame, lastGuide, lastScroll } from './util';
import { Guide } from './Guide';
import { Games } from './Games';
import { Guides } from './Guides';
import { useLocalStorage } from './hooks';

export function App() {
  const [game, setGame] = useLocalStorage(lastGame);
  const [guide, setGuide] = useLocalStorage(lastGuide);

  useEffect(() => {
    if (!guide) localStorage.removeItem(lastScroll);
  }, [guide]);

  return (
    <div style={{ padding: '1rem' }}>
      {!game ? (
        <Games setGame={setGame} />
      ) : !guide ? (
        <Guides game={game} setGuide={setGuide} setGame={setGame} />
      ) : (
        <Guide guide={guide} setGuide={setGuide} />
      )}
    </div>
  );
}
