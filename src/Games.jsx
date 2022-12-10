import React, { useEffect, useState } from 'react';
import { SERVER, useDebounce } from './util';

export function Games(props) {
  const [search, setSearch] = useState('');
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

      {games && games.map((g) => <Game key={g.id} {...g} setGame={props.setGame} />)}
    </div>
  );
}

function Game(props) {
  return (
    <button style={{ width: '70%' }} onClick={() => props.setGame(props.id)}>
      {props.title} ({props.year})
    </button>
  );
}
