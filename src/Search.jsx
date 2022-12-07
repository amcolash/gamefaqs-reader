import React from 'react';
import { Form, redirect, useSubmit } from 'react-router-dom';

export async function SearchAction({ request, params }) {
  const data = await request.formData();
  // console.log(request, data, params);

  const query = data.get('query');

  return redirect(`/games/${query}`);
}

export function Search() {
  // const submit = useSubmit();

  return (
    <Form method="post">
      {/* <form action="games"> */}
      <input name="query" type="text" placeholder="Search for a game" />
      <button type="submit" style={{ marginLeft: '1em' }}>
        Search
      </button>
      {/* </form> */}
    </Form>
  );
}
