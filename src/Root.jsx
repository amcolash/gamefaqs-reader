import React from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from './Header';

export function Root() {
  return (
    <div style={{ padding: '1em' }}>
      <Header />
      <Outlet />
    </div>
  );
}
