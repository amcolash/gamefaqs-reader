import React, { useCallback, useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { classes, style } from 'typestyle';

import { useDebounce } from '../hooks/useDebounce';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useApi } from '../hooks/useApi';
import { debounce, lastScroll, lastZoom, throttle } from '../utils/util';

import { Error } from './Error';
import { Header } from './Header';
import { Spinner } from './Spinner';

import ArrowUp from '../icons/arrow-up.svg';
import { deviceTypes, useDeviceType } from '../hooks/useDeviceType';

export function Guide(props) {
  const type = useDeviceType();

  const [data, loading, error] = useApi('guide', props.guide.gameId, props.guide.id);

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
  }, [data]);

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
          setTimeout(() => setZoomHide(false), 0);
        }}
      />

      {scrollTop && (
        <button
          style={{ position: 'fixed', bottom: type === deviceTypes.deck ? '4.5rem' : '1rem', right: '1rem', padding: '0.85rem' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp className="icon" />
        </button>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem 2rem' }}>
        {error && <Error error={error} />}
        {!error && (loading || zoomHide) && <Spinner />}

        {!zoomHide && (
          <Highlighter
            className={classes('guideContent', content)}
            searchWords={debouncedSearch.length > 3 ? debouncedSearch.split(' ') : []}
            caseSensitive={false}
            autoEscape={true}
            textToHighlight={data || ''}
            activeIndex={searchIndex}
            activeStyle={{ background: 'orange' }}
          />
        )}
      </div>
    </div>
  );
}
