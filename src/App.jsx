import React, { useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { style } from 'typestyle';

import ArrowUp from './icons/arrow-up.svg';
import ArrowBarUp from './icons/arrow-bar-up.svg';
import ArrowBarDown from './icons/arrow-bar-down.svg';

import { debounce, lastGuide, lastScroll, lastZoom, mod, SERVER, useDebounce } from './util';

const zoomFactor = 0.2;

const debouncedScroll = debounce(() => localStorage.setItem(lastScroll, window.scrollY));

export function App() {
  const [files, setFiles] = useState([]);
  const [guide, setGuide] = useState(localStorage.getItem(lastGuide));

  const [guideContent, setGuideContent] = useState();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const [searchIndex, setSearchIndex] = useState(0);
  const [searchLength, setSearchLength] = useState(0);

  const previousZoom = localStorage.getItem(lastZoom) || '1';
  const [zoom, setZoom] = useState(Number.parseFloat(previousZoom));

  useEffect(() => {
    fetch(`${SERVER}/files`)
      .then((res) => res.json())
      .then((res) => setFiles(res));

    document.addEventListener('scroll', debouncedScroll);
  }, []);

  useEffect(() => {
    if (guide) {
      fetch(`${SERVER}/guides/${guide}`)
        .then((res) => res.text())
        .then((res) => setGuideContent(res))
        .then(() => {
          const scroll = localStorage.getItem(lastScroll);
          if (scroll) setTimeout(() => window.scrollTo(undefined, Number.parseInt(scroll)), 500);
        });

      localStorage.setItem(lastGuide, guide);
    } else {
      setGuideContent();
      setSearch('');
      localStorage.removeItem(lastScroll);
      localStorage.removeItem(lastGuide);
    }
  }, [guide, setGuideContent]);

  useEffect(() => {
    setTimeout(() => {
      const highlights = Array.from(document.querySelectorAll('mark'));
      if (highlights[0]) highlights[0].scrollIntoView({ behavior: 'smooth' });

      setSearchIndex(0);
      setSearchLength(highlights.length);
    }, 350);
  }, [debouncedSearch, setSearchIndex, setSearchLength]);

  useEffect(() => {
    const highlights = Array.from(document.querySelectorAll('mark'));
    if (highlights[searchIndex]) highlights[searchIndex].scrollIntoView({ behavior: 'smooth' });
  }, [searchIndex]);

  useEffect(() => localStorage.setItem(lastZoom, zoom), [zoom]);

  const content = style({
    fontFamily: 'monospace',
    whiteSpace: 'pre',
    zoom,
  });

  return (
    <div>
      {guideContent ? (
        <>
          <header
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: 'calc(100% - 1.5rem)',
              padding: '0.75rem',
              display: 'flex',
              justifyContent: 'space-between',
              background: 'var(--background)',
              borderBottom: '2px solid #33353d',
            }}
          >
            <button onClick={() => setGuide()}>Close</button>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', maxWidth: 'min(60%, 40vw)', width: '100%' }}>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Guide"
                style={{ flex: 1, minWidth: '7rem' }}
              />

              {searchLength > 0 && (
                <>
                  <span style={{ marginLeft: '0.5rem' }}>
                    {searchIndex + 1} / {searchLength}
                  </span>
                  <button onClick={() => setSearchIndex(mod(searchIndex - 1, searchLength))} style={{ padding: '0 1rem' }}>
                    <ArrowBarUp style={{ width: 20, height: 20 }} />
                  </button>
                  <button onClick={() => setSearchIndex(mod(searchIndex + 1, searchLength))} style={{ padding: '0 1rem' }}>
                    <ArrowBarDown style={{ width: 20, height: 20 }} />
                  </button>
                </>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {zoom.toFixed(1)}x
              <button disabled={zoom <= 1} onClick={() => setZoom(zoom - zoomFactor)} style={{ fontWeight: 'bold', padding: '0 1rem' }}>
                -
              </button>
              <button disabled={zoom >= 1.99} onClick={() => setZoom(zoom + zoomFactor)} style={{ fontWeight: 'bold', padding: '0 1rem' }}>
                +
              </button>
            </div>
          </header>

          <button
            style={{ position: 'fixed', bottom: '1rem', right: '1rem', padding: '0 1rem' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ArrowUp style={{ width: 20, height: 20 }} />
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem 2rem' }}>
            <Highlighter
              className={content}
              searchWords={debouncedSearch.length > 3 ? debouncedSearch.split(' ') : []}
              caseSensitive={false}
              autoEscape={true}
              textToHighlight={guideContent}
              activeIndex={searchIndex}
              activeStyle={{ background: 'orange' }}
            />
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
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
