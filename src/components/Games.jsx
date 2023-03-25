import React, { useEffect, useState } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';

import { useDebounce } from '../hooks/useDebounce';
import { useApi } from '../hooks/useApi';

import { Error } from './Error.jsx';
import { Input } from './Input';
import { Spinner } from './Spinner';

export function Games(props) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 1000);
  const [data, loading, error] = useApi('games', debouncedSearch);
  const [version, setVersion] = useState();
  const [animationParent] = useAutoAnimate();

  useEffect(() => {
    window.electronAPI.version().then((v) => setVersion(v));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <div>
        <h1 style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
          <img src="./logo_v13.png" alt="GameFAQS logo" style={{ marginTop: '0.25rem', marginRight: '0.5rem' }} /> Reader
        </h1>
        <div style={{ textAlign: 'right', fontSize: 7, marginTop: '-2.15rem' }}>{version}</div>
      </div>

      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--background)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <label>Game Search</label>
        <Input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            props.setSearch(e.target.value);
          }}
          placeholder="Search Games"
          style={{ width: '100%', marginTop: '0.5rem', marginBottom: '1.5rem' }}
        />
      </div>

      {error && <Error error={error} />}
      {loading && <Spinner />}
      <div ref={animationParent} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {debouncedSearch.length > 0 && !error && data && data.map((g) => <GameItem key={g.id} game={g} setGame={props.setGame} />)}
      </div>
    </div>
  );
}

function GameItem(props) {
  const game = props.game;

  return (
    <div style={{ padding: '0.35rem 0', background: 'var(--background)' }}>
      <button onClick={() => props.setGame(game)} style={{ width: '100%' }}>
        {game.title} ({game.year})
      </button>
    </div>
  );
}
