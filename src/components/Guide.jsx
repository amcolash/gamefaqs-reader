import React, { useCallback, useEffect, useState } from 'react';
import useFetch from 'react-fetch-hook';
import Highlighter from 'react-highlight-words';
import { style } from 'typestyle';

import { useDebounce } from '../hooks/debounce';
import { useLocalStorage } from '../hooks/localStorage';
import { debounce, lastScroll, lastZoom, SERVER } from '../utils/util';

import { Error } from './Error';
import { Header } from './Header';
import { Spinner } from './Spinner';

import ArrowUp from '../icons/arrow-up.svg';

export function Guide(props) {
  const {
    isLoading,
    data: guideContent,
    error,
  } = useFetch(`${SERVER}/guide/${props.guide.gameId}/${props.guide.id}`, { formatter: (response) => response.text() });

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const [searchIndex, setSearchIndex] = useState(0);
  const [searchLength, setSearchLength] = useState(0);

  const [zoom, setZoom] = useLocalStorage(lastZoom, 1);
  const [zoomHide, setZoomHide] = useState(false);

  const [scrollPositions, setScrollPositions] = useLocalStorage(lastScroll, {});
  const [scrollTop, setScrollTop] = useState(false);

  const debouncedScroll = useCallback(
    debounce(() => {
      let scroll = { ...scrollPositions };

      scroll[props.guide.gameId + '/' + props.guide.id] = window.scrollY;

      setScrollPositions(scroll);
      setScrollTop(window.scrollY > 300);
    }),
    [setScrollTop]
  );

  useEffect(() => {
    const scroll = scrollPositions[props.guide.gameId + '/' + props.guide.id];
    if (scroll) setTimeout(() => window.scrollTo(undefined, Number.parseInt(scroll)), 350);

    document.addEventListener('scroll', debouncedScroll);

    return () => document.removeEventListener('scroll', debouncedScroll);
  }, [guideContent]);

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
        setZoom={(z) => {
          setZoomHide(true);
          setZoom(z);
          setTimeout(() => setZoomHide(false), 100);
        }}
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
        {error && <Error error={error} />}
        {(isLoading || zoomHide) && <Spinner />}

        {!zoomHide && (
          <Highlighter
            className={content}
            searchWords={debouncedSearch.length > 3 ? debouncedSearch.split(' ') : []}
            caseSensitive={false}
            autoEscape={true}
            textToHighlight={guideContent || ''}
            activeIndex={searchIndex}
            activeStyle={{ background: 'orange' }}
          />
        )}
      </div>
    </div>
  );
}
