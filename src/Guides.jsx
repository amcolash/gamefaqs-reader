import React, { useEffect, useState } from 'react';
import { SERVER } from './util';

import ArrowLeft from './icons/arrow-left.svg';

export function Guides(props) {
  const [guides, setGuides] = useState([]);

  useEffect(() => {
    const url = `${SERVER}/guides/${props.game.id}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setGuides(data));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <h1 style={{ display: 'flex', width: '100%' }}>
        <button onClick={() => props.setGame()}>
          <ArrowLeft className="icon" />
        </button>
        <div style={{ width: '100%', textAlign: 'center' }}>Guides</div>
      </h1>

      {guides && guides.map((g) => <GuideItem key={g.id} guide={g} setGuide={props.setGuide} />)}
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
