import React from 'react';

export function Tag(props) {
  return (
    <span
      style={{
        border: '2px solid var(--header)',
        borderRadius: '0.25rem',
        padding: '0.1rem 0.25rem',
        ...props.style,
      }}
    >
      {props.children}
    </span>
  );
}
