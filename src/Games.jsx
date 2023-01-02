import React, { useState } from 'react';
import useFetch from 'react-fetch-hook';

import { useDebounce } from './utils/hooks';
import { SERVER } from './utils/util';

import { Error } from './Error.jsx';
import { Input } from './Input';
import { Spinner } from './Spinner';

export function Games(props) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 1000);
  const { isLoading, data: games, error } = useFetch(`${SERVER}/games/${debouncedSearch}`, { depends: [!!debouncedSearch] });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <h1>Games</h1>

      <div style={{ width: '100%' }}>
        <label>Game Search</label>
        <br />
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Games"
          style={{ width: '100%', marginTop: '0.5rem', marginBottom: '3rem' }}
        />
      </div>

      {error && <Error error={error} />}
      {isLoading && <Spinner />}
      {debouncedSearch.length > 0 && games && games.map((g) => <GameItem key={g.id} game={g} setGame={props.setGame} />)}
    </div>
  );
}

function GameItem(props) {
  const game = props.game;

  return (
    <button onClick={() => props.setGame(game)} style={{ width: '100%' }}>
      {game.title} ({game.year})
    </button>
  );
}
