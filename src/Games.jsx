import React from 'react';
import { useLoaderData, useLocation, useParams } from 'react-router-dom';
import { searchGames } from './parser';

export async function GamesLoader({ params }) {
  const { query } = params;
  const games = await searchGames(query);

  return games;
}

export function Games() {
  // const location = useLocation();
  const games = useLoaderData();
  const { query } = useParams();

  return (
    <div>
      <h2>Games List</h2>
      {/* <div>{JSON.stringify(location.state)}</div> */}
      {query}
      <div>{JSON.stringify(games)}</div>
    </div>
  );
}
