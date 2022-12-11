import React from 'react';
import useFetch from 'react-fetch-hook';

import { Error } from './Error';
import { Spinner } from './Spinner';

import { SERVER } from './util';

import ArrowLeft from './icons/arrow-left.svg';

export function Guides(props) {
  const { isLoading, data: guides, error } = useFetch(`${SERVER}/guides/${props.game.id}`);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <h1 style={{ display: 'flex', width: '100%', position: 'relative' }}>
        <button onClick={() => props.setGame()} style={{ position: 'absolute' }}>
          <ArrowLeft className="icon" />
        </button>
        <div style={{ width: '100%', textAlign: 'center' }}>Guides</div>
      </h1>

      <Error error={error} />
      {isLoading && <Spinner />}
      {!isLoading && guides && guides.map((g) => <GuideItem key={g.id} guide={g} setGuide={props.setGuide} />)}
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
