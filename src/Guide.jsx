import React, { useCallback, useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { style } from 'typestyle';

import { debounce, lastGuide, lastScroll, lastZoom, SERVER, useDebounce } from './util';

import ArrowUp from './icons/arrow-up.svg';
import { Header } from './Header';

export function Guide(props) {
  const guide = props.guide;

  const [guideContent, setGuideContent] = useState();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const [searchIndex, setSearchIndex] = useState(0);
  const [searchLength, setSearchLength] = useState(0);

  const previousZoom = localStorage.getItem(lastZoom) || '1';
  const [zoom, setZoom] = useState(Number.parseFloat(previousZoom));

  const [scrollTop, setScrollTop] = useState(false);

  const debouncedScroll = useCallback(
    debounce((e) => {
      setScrollTop(window.scrollY > 300);
      localStorage.setItem(lastScroll, window.scrollY);
    }),
    [setScrollTop]
  );

  useEffect(() => {
    const getGuide = async () => {
      const url = `${SERVER}/guide/${props.game}/${props.guide}`;

      const cache = await caches.open('guide-cache');
      const match = await cache.match(url);

      let content;
      if (match) {
        content = await match.text();
      } else {
        content = await fetch(url).then((res) => res.text());
        cache.add(url, content);
      }

      setGuideContent(content);

      const scroll = localStorage.getItem(lastScroll);
      if (scroll) setTimeout(() => window.scrollTo(undefined, Number.parseInt(scroll)), 500);
    };

    document.addEventListener('scroll', debouncedScroll);
    getGuide();

    return () => document.removeEventListener('scroll', debouncedScroll);
  }, []);

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
      <Header
        setGuide={props.setGuide}
        search={search}
        setSearch={setSearch}
        searchLength={searchLength}
        searchIndex={searchIndex}
        setSearchIndex={setSearchIndex}
        zoom={zoom}
        setZoom={setZoom}
      />

      {scrollTop && (
        <button
          style={{ position: 'fixed', bottom: '1rem', right: '1rem', padding: '0 1rem' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp className="icon" />
        </button>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem 2rem' }}>
        <Highlighter
          className={content}
          searchWords={debouncedSearch.length > 3 ? debouncedSearch.split(' ') : []}
          caseSensitive={false}
          autoEscape={true}
          textToHighlight={guideContent || ''}
          activeIndex={searchIndex}
          activeStyle={{ background: 'orange' }}
        />
      </div>
    </div>
  );
}
