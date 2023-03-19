import React from 'react';

import { Error } from './Error';
import { Spinner } from './Spinner';

import { useApi } from '../hooks/useApi';

import ArrowLeft from '../icons/arrow-left.svg';
import { useAutoAnimate } from '@formkit/auto-animate/react';

export function Guides(props) {
  const [data, loading, error] = useApi('guides', props.game.id);
  const [animationParent] = useAutoAnimate();

  const guideItems = data?.filter((g) => !g.html).map((g) => <GuideItem key={g.id} guide={g} setGuide={props.setGuide} />) || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <h1 style={{ display: 'flex', width: '100%', position: 'relative' }}>
        <button onClick={() => props.setGame()} style={{ position: 'absolute' }}>
          <ArrowLeft className="icon" />
        </button>
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
    <div style={{ padding: '0.35rem 0', background: 'var(--background)' }}>
      <button
        key={guide.id}
        style={{ width: '100%', height: '4rem', justifyContent: 'space-between', padding: '0 4rem', overflow: 'hidden', ...props.style }}
        onClick={() => props.setGuide(guide)}
      >
        <div style={{ textAlign: 'left' }}>
          {props.showGame && props.guide.gameTitle}
          {!props.showGame && guide.title} [{guide.platform}]
          <br />
          By: {guide.authors}
        </div>
        <div style={{ textAlign: 'right' }}>
          ({guide.year})
          <br />
          {guide.version}
        </div>
      </button>
    </div>
  );
}
