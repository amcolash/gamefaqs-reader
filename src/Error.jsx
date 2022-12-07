import React from 'react';
import { useRouteError } from 'react-router-dom';

export function Error() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: 'min(80vw, 70rem)', overflow: 'hidden' }}>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <i>{error.statusText || error.message}</i>
        <pre style={{ overflow: 'auto' }}>{error.stack}</pre>
      </div>
    </div>
  );
}
