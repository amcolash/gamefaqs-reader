import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, { useState } from 'react';

import { useApi } from '../hooks/useApi';
import { deviceTypes, useDeviceType } from '../hooks/useDeviceType';
import ArrowLeft from '../icons/arrow-left.svg?react';
import { Error } from './Error';
import { Spinner } from './Spinner';
import { Tag } from './Tag';

export function Guides(props) {
  const [data, loading, error] = useApi('guides', props.game.id);
  const [platform, setPlatform] = useState('All');
  const [animationParent] = useAutoAnimate();
  const deviceType = useDeviceType();

  const platforms = Array.from(['All', ...new Set(data?.map((g) => g.platform) || [])]).sort();
  const guideItems =
    data
      ?.filter((g) => platform === 'All' || g.platform === platform)
      .map((g) => <GuideItem key={g.id} guide={g} setGuide={props.setGuide} />) || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <h1 style={{ display: 'flex', width: '100%', position: 'relative' }}>
        {deviceType === deviceTypes.desktop && (
          <button onClick={() => props.setGame()} style={{ position: 'absolute' }}>
            <ArrowLeft className="icon" />
          </button>
        )}
        <div style={{ width: '100%', textAlign: 'center', paddingLeft: '4.5rem' }}>Guides for {props.game.title}</div>
        {platforms.length > 1 && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ fontSize: '1.5rem' }}>Platform</label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
              {platforms.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        )}
      </h1>

      {error && <Error error={error} />}
      {loading && <Spinner />}
      <div ref={animationParent} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {!loading &&
          !error &&
          (guideItems.length > 0 ? guideItems : <h2 style={{ textAlign: 'center' }}>No Guides Found</h2>)}
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
          <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
            {props.showGame && props.guide.gameTitle}
            {!props.showGame && guide.title}
            <Tag>{guide.platform}</Tag>
            {guide.html && <Tag>HTML</Tag>}
          </div>
          <br />
          By: {guide.authors}
        </div>
        <div style={{ textAlign: 'right' }}>
          {guide.year && <span>({guide.year})</span>}
          <br />
          {guide.version}
        </div>
      </button>
    </div>
  );
}
