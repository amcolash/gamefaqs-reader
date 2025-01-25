import { useAutoAnimate } from '@formkit/auto-animate/react';
import React from 'react';

import { useApi } from '../hooks/useApi';
import { deviceTypes, useDeviceType } from '../hooks/useDeviceType';
import ArrowLeft from '../icons/arrow-left.svg';
import { Error } from './Error';
import { Spinner } from './Spinner';

export function Guides(props) {
  const [data, loading, error] = useApi('guides', props.game.id);
  const [animationParent] = useAutoAnimate();
  const deviceType = useDeviceType();

  const guideItems = data?.map((g) => <GuideItem key={g.id} guide={g} setGuide={props.setGuide} />) || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <h1 style={{ display: 'flex', width: '100%', position: 'relative' }}>
        {deviceType === deviceTypes.desktop && (
          <button onClick={() => props.setGame()} style={{ position: 'absolute' }}>
            <ArrowLeft className="icon" />
          </button>
        )}
        <div style={{ width: '100%', textAlign: 'center' }}>Guides for {props.game.title}</div>
      </h1>

      {error && <Error error={error} />}
      {loading && <Spinner />}
      <div ref={animationParent} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {!loading && !error && (guideItems.length > 0 ? guideItems : <h2>No Guides Found</h2>)}
      </div>
    </div>
  );
}

export function GuideItem(props) {
  const guide = props.guide;

  return (
    <div style={{ padding: '0.35rem 0', background: 'var(--background)', width: '100%' }}>
      <button
        className={props.className || 'guide'}
        key={guide.id}
        style={{
          justifyContent: 'space-between',
          padding: '0.5rem 4rem',
          overflow: 'hidden',
          width: '100%',
          ...props.style,
        }}
        onClick={() => props.setGuide(guide)}
      >
        <div style={{ textAlign: 'left' }}>
          {props.showGame && props.guide.gameTitle}
          {!props.showGame && guide.title} [{guide.platform}]
          <br />
          By: {guide.authors}
        </div>
        <div style={{ textAlign: 'right' }}>
          {guide.year && <span>({guide.year})</span>}
          <br />
          {guide.html && (
            <span style={{ background: 'var(--steamBlue)', padding: '0.15rem', margin: '0.25rem' }}>[HTML]</span>
          )}
          {guide.version}
        </div>
      </button>
    </div>
  );
}
