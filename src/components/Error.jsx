import React from 'react';

export function Error(props) {
  const error = props.error;

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Error</h1>

      {typeof error === 'string' ? (
        <h4>{error}</h4>
      ) : (
        <>
          <h4>{error.message}</h4>
          <h4>{error.name}</h4>
          <h4>{error.stack}</h4>
          <h4>{error.status}</h4>
          <h4>{error.statusText}</h4>
        </>
      )}
    </div>
  );
}
