import React from 'react';

import { Input } from './Input';

import ArrowBarUp from '../icons/arrow-bar-up.svg';
import ArrowBarDown from '../icons/arrow-bar-down.svg';
import Dash from '../icons/dash-lg.svg';
import Plus from '../icons/plus-lg.svg';
import X from '../icons/x-lg.svg';

import { mod } from '../utils/util';

const zoomFactor = 0.2;

export function Header(props) {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1,
        width: 'calc(100% - 2rem)',
        padding: '1rem',
        background: 'var(--background)',
        borderBottom: '2px solid #33353d',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ display: 'flex', width: '100%', maxWidth: 'var(--maxWidth)', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => props.setGuide()} style={{ padding: '0.6rem' }}>
          <X className="icon" />
        </button>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', maxWidth: 'min(60%, 40vw)', width: '100%' }}>
          <Input
            type="search"
            value={props.search}
            onChange={(e) => props.setSearch(e.target.value)}
            placeholder="Search Guide"
            style={{ flex: 1, minWidth: '7rem' }}
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
            <Dash className="icon" />
          </button>
          <button
            disabled={props.zoom >= 1.99}
            onClick={() => props.setZoom(props.zoom + zoomFactor)}
            style={{ fontWeight: 'bold', padding: '0.6rem' }}
          >
            <Plus className="icon" />
          </button>
        </div>
      </div>
    </header>
  );
}
