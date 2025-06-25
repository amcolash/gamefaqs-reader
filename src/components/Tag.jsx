import React from 'react';

export function Tag(props) {
  return (
    <span
      style={{
        border: '2px solid var(--header)',
        borderRadius: '0.25rem',
        margin: '0 0.5rem',
        padding: '0.15rem 0.25rem',
      }}
    >
      {props.children}
    </span>
  );
}
