import React, { useEffect, useState } from 'react';
import { SERVER } from './util';

import X from './icons/x-lg.svg';

export function Guides(props) {
  const [guides, setGuides] = useState([]);

  useEffect(() => {
    const url = `${SERVER}/guides/${props.game}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setGuides(data));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <h1 style={{ display: 'flex', width: '70%' }}>
        <button onClick={() => props.setGame()}>
          <X className="icon" />
        </button>
        <div style={{ width: '100%', textAlign: 'center' }}>Guides</div>
      </h1>

      {guides && guides.map((g) => <Guide {...g} setGuide={props.setGuide} />)}
    </div>
  );
}

function Guide(props) {
  return (
    <button
      key={props.id}
      style={{ width: '70%', height: '4rem', justifyContent: 'space-around' }}
      onClick={() => props.setGuide(props.id)}
    >
      <div style={{ textAlign: 'left' }}>
        {props.title} [{props.platform}]
        <br />
        By: {props.authors}
      </div>
      <div style={{ textAlign: 'right' }}>
        ({props.year})
        <br />
        {props.version}
      </div>
    </button>
  );
}
