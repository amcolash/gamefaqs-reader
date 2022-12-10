import React, { useEffect, useState } from 'react';

import { lastGuide, lastScroll, SERVER } from './util';
import { Guide } from './Guide';

export function App() {
  const [files, setFiles] = useState([]);
  const [guide, setGuide] = useState(localStorage.getItem(lastGuide));

  useEffect(() => {
    fetch(`${SERVER}/files`)
      .then((res) => res.json())
      .then((res) => setFiles(res));
  }, []);

  useEffect(() => {
    if (!guide) {
      localStorage.removeItem(lastScroll);
      localStorage.removeItem(lastGuide);
    }
  }, [guide]);

  return (
    <div>
      {guide ? (
        <Guide guide={guide} setGuide={setGuide} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem', padding: '2rem' }}>
          <h1>Guides</h1>
          {files.map((f) => (
            <button onClick={() => setGuide(f)} key={f}>
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
