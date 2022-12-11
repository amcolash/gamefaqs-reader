import React from 'react';

import { GuideItem } from './Guides';

import X from './icons/x-lg.svg';

export function Recents(props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
      <h1>Recent Guides</h1>

      {props.recentGuides.map((g) => (
        <div key={g.id} style={{ display: 'flex', width: '70%', justifyContent: 'center', gap: '0.75rem' }}>
          <GuideItem guide={g} setGuide={props.setGuide} showGame={true} style={{ width: '100%' }} />

          <button
            style={{ height: 'unset' }}
            onClick={() => {
              let guides = [...props.recentGuides];
              guides = guides.filter((guide) => guide.id !== g.id);
              props.setRecentGuides(guides);
            }}
          >
            <X />
          </button>
        </div>
      ))}
    </div>
  );
}
