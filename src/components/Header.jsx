import React from 'react';

import { Input } from './Input';

import ArrowBarUp from '../icons/arrow-bar-up.svg';
import ArrowBarDown from '../icons/arrow-bar-down.svg';
import X from '../icons/x-lg.svg';
import ZoomIn from '../icons/zoom-in.svg';
import ZoomOut from '../icons/zoom-out.svg';

import { mod } from '../utils/util';
import { deviceTypes, useDeviceType } from '../hooks/useDeviceType';

const zoomFactor = 0.2;

export function Header(props) {
  const type = useDeviceType();

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 3,
        width: 'calc(100% - 2rem)',
        padding: '1rem',
        background: 'var(--dark)',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ display: 'flex', width: '100%', maxWidth: 'var(--maxWidth)', justifyContent: 'space-between', alignItems: 'center' }}>
        {type === deviceTypes.desktop && (
          <button onClick={() => props.setGuide()} style={{ padding: '0.6rem' }}>
            <X className="icon" />
          </button>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', maxWidth: 'min(60%, 40vw)', width: '100%' }}>
          <Input
            type={type === deviceTypes.desktop ? 'search' : 'text'}
            value={props.search}
            onChange={(e) => props.setSearch(e.target.value)}
            placeholder="Search Guide"
            style={{ flex: 1, minWidth: '7rem' }}
            updateValue={(value) => props.setSearch(value)}
          />

          {props.searchLength > 0 && (
            <>
              <span style={{ margin: '0.5rem', whiteSpace: 'nowrap' }}>
                {props.searchIndex + 1} / {props.searchLength}
              </span>
              <button onClick={() => props.setSearchIndex(mod(props.searchIndex - 1, props.searchLength))} style={{ padding: '0.6rem' }}>
                <ArrowBarUp className="icon" />
              </button>
              <button onClick={() => props.setSearchIndex(mod(props.searchIndex + 1, props.searchLength))} style={{ padding: '0.6rem' }}>
                <ArrowBarDown className="icon" />
              </button>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {props.zoom.toFixed(1)}x
          <button
            disabled={props.zoom <= 1}
            onClick={() => props.setZoom(props.zoom - zoomFactor)}
            style={{ fontWeight: 'bold', padding: '0.6rem' }}
          >
            <ZoomOut className="icon" />
          </button>
          <button
            disabled={props.zoom >= 1.99}
            onClick={() => props.setZoom(props.zoom + zoomFactor)}
            style={{ fontWeight: 'bold', padding: '0.6rem' }}
          >
            <ZoomIn className="icon" />
          </button>
        </div>
      </div>
    </header>
  );
}
