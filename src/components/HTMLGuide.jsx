import React, { useState } from 'react';
import { style } from 'typestyle';

import { useApi } from '../hooks/useApi';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { lastZoom } from '../utils/util';
import { Error } from './Error';
import { Header } from './Header';
import { Spinner } from './Spinner';

export function HTMLGuide(props) {
  const [guidePage, setGuidePage] = useState();
  const [data, loading, error] = useApi(
    'htmlGuide',
    props.guide.gameId,
    props.guide.id + (guidePage ? `/${guidePage}` : '')
  );

  const [zoom, setZoom] = useLocalStorage(lastZoom, 1);
  const [zoomHide, setZoomHide] = useState(false);

  const guide = style({
    overflow: 'auto',
    zoom,

    $nest: {
      '& button': {
        margin: '0.25rem',
        padding: '0.25rem',
        fontSize: '1rem',
        display: 'inline-block',
      },

      '& table': {
        margin: '1rem 0',
      },

      '& table, tr, td': {
        border: '1px solid var(--table)',
        borderCollapse: 'collapse',
        verticalAlign: 'middle',
      },

      '& td': {
        padding: '0.25rem 0.5rem',
      },

      '& td > *, td > strong *': {
        verticalAlign: 'middle',
        //   display: 'flex',
        //   gap: '0.5rem',
        padding: '0.25rem',
      },

      '& blockquote': {
        margin: 0,
        padding: '0.25rem',
        border: '1px solid var(--table)',
      },

      '& h1, h2, h3, h4, h5, h6': {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        margin: '0.5rem',
      },

      '& .ftoc': {
        maxHeight: '20rem',
        overflow: 'auto',
      },
    },
  });

  // hook into window so the raw html from api can change the guide page
  window.setGuidePage = (url) => setGuidePage(url);

  return (
    <>
      <Header
        setGuide={props.setGuide}
        zoom={zoom}
        setZoom={(z) => {
          setZoomHide(true);
          setZoom(z);
          setTimeout(() => setZoomHide(false), 0);
        }}
        hideSearch
      />

      <div style={{ display: 'grid', padding: '6rem 2rem' }}>
        {error && <Error error={error} />}
        {!error && (loading || zoomHide) && <Spinner />}

        {data && <div className={guide} dangerouslySetInnerHTML={{ __html: data }} />}
      </div>
    </>
  );
}
