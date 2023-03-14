import React from 'react';

import { Error } from './Error';
import { Spinner } from './Spinner';

import ArrowLeft from '../icons/arrow-left.svg';

export function Guides(props) {
  const isLoading = true;
  const guides = [];
  const error = undefined;

  const guideItems = guides?.filter((g) => !g.html).map((g) => <GuideItem key={g.id} guide={g} setGuide={props.setGuide} />);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <h1 style={{ display: 'flex', width: '100%', position: 'relative' }}>
        <button onClick={() => props.setGame()} style={{ position: 'absolute' }}>
          <ArrowLeft className="icon" />
        </button>
        <div style={{ width: '100%', textAlign: 'center' }}>Guides for {props.game.title}</div>
      </h1>

      {error && <Error error={error} />}
      {isLoading && <Spinner />}
      {!isLoading && (guideItems.length > 0 ? guideItems : <h2>No Guides Found</h2>)}
    </div>
  );
}

export function GuideItem(props) {
  const guide = props.guide;

  return (
    <button
      key={guide.id}
      style={{ width: '100%', height: '4rem', justifyContent: 'space-between', padding: '0 4rem', ...props.style }}
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
  );
}
