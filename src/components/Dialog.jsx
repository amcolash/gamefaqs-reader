import React from 'react';
import { useAutoFocus } from '../hooks/useAutoFocus';

export function Dialog(props) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        backdropFilter: 'blur(3px)',
      }}
    >
      <div
        className="dialog"
        style={{
          background: 'var(--dark)',
          border: '3px solid var(--header)',
          borderRadius: 3,
          width: props.buttons.length === 1 ? 750 : 980,
          maxWidth: 'calc(85% - 4rem)',
          padding: '2rem',
        }}
      >
        <h3 style={{ fontSize: '2rem', margin: 0, marginBottom: '1.5rem', padding: 0, whiteSpace: 'pre-wrap' }}>{props.title}</h3>
        <div style={{ fontSize: '1.5rem', marginBottom: '2rem', whiteSpace: 'pre-wrap' }}>{props.message}</div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          {props.buttons.map((b) => {
            const focus = b.focus ? useAutoFocus() : () => {};

            return (
              <button
                key={b.label}
                className={b.focus ? 'blue' : undefined}
                onClick={b.action}
                style={{ width: '100%', height: '3.5rem' }}
                ref={focus}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
