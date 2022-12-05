import React from 'react';
import { Form } from 'react-router-dom';

export async function SearchAction() {
  // const navigate = useNavigate();
  // navigate('/games', { state: { query: search } });
  // setSearch('');
}

export function Search() {
  return (
    <Form method="post">
      <input name="query" type="text" placeholder="Search for a game" />
      <button style={{ marginLeft: '1em' }}>Search</button>
    </Form>
  );
}
