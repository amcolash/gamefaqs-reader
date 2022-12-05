import React from 'react';
import { useLoaderData, useLocation } from 'react-router-dom';

export async function GamesLoader() {
  const location = useLocation();
  console.log(location);

  const games = await fetch('https://jsonplaceholder.typicode.com/posts').then((response) => response.json());
  return { games };
}

export function Games() {
  const location = useLocation();
  const { games } = useLoaderData();

  return (
    <div>
      <h2>Games List</h2>
      <div>{JSON.stringify(location.state)}</div>
      <div>{JSON.stringify(games)}</div>
    </div>
  );
}
