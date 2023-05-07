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
        textAlign: 'center',
        background: 'rgba(0, 0, 0, 0.75)',
        zIndex: 2,
      }}
    >
      <div className="dialog" style={{ border: '1px solid var(--header)' }}>
        <h3 style={{ margin: 0, padding: '0.5rem 1.25rem', background: 'var(--header)', whiteSpace: 'pre' }}>{props.title}</h3>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {props.buttons.map((b) => {
            const focus = b.focus ? useAutoFocus() : () => {};

            return (
              <button key={b.label} onClick={b.action} style={{ width: '100%', border: '1px solid var(--header)' }} ref={focus}>
                {b.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
