import React, { useEffect, useState } from 'react';
import { useDebounce } from './hooks';
import { SERVER } from './util';

export function Games(props) {
  const [search, setSearch] = useState('chrono trigger');
  const debouncedSearch = useDebounce(search, 500);

  const [games, setGames] = useState([]);

  useEffect(() => {
    if (debouncedSearch) {
      const url = `${SERVER}/games/${debouncedSearch}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => setGames(data));
    } else {
      setGames([]);
    }
  }, [debouncedSearch]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <h1>Games</h1>

      <div style={{ width: '70%' }}>
        <label>Game Search</label>
        <br />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Games"
          style={{ width: '100%', marginTop: '0.5rem', marginBottom: '3rem' }}
        />
      </div>

      {games && games.map((g) => <Game key={g.id} game={g} setGame={props.setGame} />)}
    </div>
  );
}

function Game(props) {
  const game = props.game;

  return (
    <button style={{ width: '70%' }} onClick={() => props.setGame(game)}>
      {game.title} ({game.year})
    </button>
  );
}
