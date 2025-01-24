import React from 'react';

import X from '../icons/x-lg.svg';
import { GuideItem } from './Guides';

export function Recents(props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
      <h1>Recent Guides</h1>

      {props.recentGuides.map((g) => (
        <div
          key={g.id}
          style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', width: '100%', wordBreak: 'break-word' }}
        >
          <GuideItem
            className="recentGuide"
            guide={g}
            setGuide={props.setGuide}
            showGame={true}
            style={{ width: '100%' }}
          />

          <button
            className="error remove"
            style={{ height: 'unset', margin: '0.35rem 0' }}
            onClick={() => {
              let guides = [...props.recentGuides];
              guides = guides.filter((guide) => guide.id !== g.id);
              props.setRecentGuides(guides);

              window.electronAPI.removeGuide(g.gameId, g.id);
            }}
          >
            <X />
          </button>
        </div>
      ))}
    </div>
  );
}
