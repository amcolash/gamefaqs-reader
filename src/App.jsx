import React, { useEffect, useState } from 'react';

import { lastGame, lastGuide, lastScroll } from './util';
import { Guide } from './Guide';
import { Games } from './Games';
import { Guides } from './Guides';

export function App() {
  const [game, setGame] = useState(localStorage.getItem(lastGame));
  const [guide, setGuide] = useState(localStorage.getItem(lastGuide));

  useEffect(() => {
    if (guide) {
      localStorage.setItem(lastGuide, guide);
    } else {
      localStorage.removeItem(lastScroll);
      localStorage.removeItem(lastGuide);
    }
  }, [guide]);

  useEffect(() => {
    if (game) {
      localStorage.setItem(lastGame, game);
    } else {
      localStorage.removeItem(lastGame);
    }
  }, [game]);

  return (
    <div style={{ padding: '1rem' }}>
      {!game ? (
        <Games setGame={setGame} />
      ) : !guide ? (
        <Guides game={game} setGuide={setGuide} setGame={setGame} />
      ) : (
        <Guide game={game} guide={guide} setGuide={setGuide} />
      )}
    </div>
  );
}
