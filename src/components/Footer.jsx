import React from 'react';
import { dialogType } from './Dialog';

export function Footer(props) {
  const additionalItems = [];

  if (props.guide) {
    additionalItems.push({ label: 'Page Up', icon: './gamepad/l2.png', onClick: () => window.scrollBy(0, -window.innerHeight * 0.75) });
    additionalItems.push({ label: 'Page Down', icon: './gamepad/r2.png', onClick: () => window.scrollBy(0, window.innerHeight * 0.75) });
  }

  if (props.dialog === dialogType.None) additionalItems.push({ label: 'Scroll', icon: './gamepad/right-stick.png' });

  const items = [
    ...additionalItems,

    { label: 'Spacer', spacer: true },

    { label: 'Select', icon: './gamepad/a.png' },
    { label: 'Back', icon: './gamepad/b.png', onClick: props.escapeHandler },
  ];

  return (
    <footer
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        zIndex: 3,
        display: 'flex',
        justifyContent: 'flex-end',
        alignContent: 'center',
        gap: '0.5rem',
        padding: '0.65rem',
        width: 'calc(100% - 1.3rem)',
        background: '#050505',
        textTransform: 'uppercase',
        fontSize: '0.85rem',
      }}
    >
      {items.map((item) =>
        item.spacer ? (
          <div key={item.label} style={{ width: '100%' }}></div>
        ) : (
          <div
            key={item.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: item.onClick ? 'pointer' : undefined,
              padding: '0.5rem',
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}
            onClick={item.onClick}
          >
            <img src={item.icon} />
            <label style={{ cursor: item.onClick ? 'pointer' : undefined }}>{item.label}</label>
          </div>
        )
      )}
    </footer>
  );
}
