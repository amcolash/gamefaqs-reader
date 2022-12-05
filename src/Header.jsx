import React from 'react';
import { Search } from './Search';

export function Header() {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1 style={{ margin: 0 }}>Game Guides</h1>
      <div>
        <Search />
      </div>
    </header>
  );
}
