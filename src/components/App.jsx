import React, { useCallback, useEffect, useState } from 'react';
import { style } from 'typestyle';

import { deviceTypes, useDeviceType } from '../hooks/useDeviceType';
import { useInFocus } from '../hooks/useInFocus';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useOnline } from '../hooks/useOnline';
import OfflineIcon from '../icons/wifi-off.svg?react';
import { cleanupNavigation, initNavigation } from '../utils/nav';
import { cleanupTouchScrolling, initTouchScrolling } from '../utils/touch';
import { introKey, lastGame, lastGuide, recentGuideKey } from '../utils/util';
import { Dialog, dialogType } from './Dialog';
import { Footer } from './Footer';
import { Games } from './Games';
import { Guide } from './Guide';
import { Guides } from './Guides';
import { HTMLGuide } from './HTMLGuide';
import { Intro } from './Intro';
import { Recents } from './Recents';

export function App() {
  const online = useOnline();
  const type = useDeviceType();
  const focus = useInFocus();
  const [search, setSearch] = useState(); // Keep track of search for ui
  const [game, setGame] = useLocalStorage(lastGame);
  const [guide, setGuide] = useLocalStorage(lastGuide);
  const [recentGuides, setRecentGuides] = useLocalStorage(recentGuideKey, []);
  const [showIntro, setShowIntro] = useLocalStorage(introKey, true);
  const [dialog, setDialog] = useState(dialogType.None);

  const containerStyle = style({
    padding: '1rem',
    width: guide ? undefined : '85%',
    maxWidth: 'var(--maxWidth)',
  });

  useEffect(() => {
    window.electronAPI.onUpdateDownloaded((_event, value) => {
      console.log('renderer: update downloaded', value);
      setDialog(dialogType.Update);
    });
  }, []);

  // Add in touch scrolling for steam deck (since it doesn't seem like touch events are happening properly)
  useEffect(() => {
    if (type === deviceTypes.deck) initTouchScrolling();
    return () => cleanupTouchScrolling();
  }, [type]);

  useEffect(() => {
    if (guide) {
      let recent = [...recentGuides];
      recent = recent.filter((g) => guide.id !== g.id);
      recent.unshift(guide);
      if (recent.length > 7) {
        const removed = recent.pop();
        window.electronAPI.removeGuide(removed.gameId, removed.id);
      }

      setRecentGuides(recent);
    }
  }, [guide]);

  const escapeHandler = useCallback(
    (e) => {
      if (!focus) return;

      const active = document.activeElement;

      if (type === deviceTypes.desktop && e.key === 'Backspace' && active) {
        if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) return;
      }

      if (e.key === 'Escape' || e.key === 'Backspace') {
        if (dialog) {
          setDialog(dialogType.None);
          return;
        }

        if (active && active !== document.body) {
          active.blur();
          return;
        }

        if (!active || active === document.body) {
          if (guide) setGuide();
          else if (game) {
            setGame();
            setSearch();
          } else setDialog(dialogType.Exit);
        }
      }
    },
    [dialog, guide, game, focus]
  );

  useEffect(() => {
    initNavigation();

    window.addEventListener('keydown', escapeHandler);

    const exitHandler = window.joypad.on('button_press', (e) => {
      if (!focus) return;

      // Button 1: B (A nintendo)
      if (e.detail.index === 1 && !document.querySelector('.keyboard')) escapeHandler({ key: 'Escape' });
    });

    return () => {
      cleanupNavigation();
      window.removeEventListener('keydown', escapeHandler);
      exitHandler.unsubscribe();
    };
  }, [dialog, guide, game, focus]);

  useEffect(() => {
    document.body.style.overflow = dialog ? 'hidden' : 'initial';
  }, [dialog]);

  return (
    <div className={containerStyle} style={{ paddingBottom: type === deviceTypes.deck ? '5rem' : undefined }}>
      {dialog === dialogType.Exit && (
        <Dialog
          title="Exit"
          message="Are you sure?"
          buttons={[
            { label: 'Confirm', action: () => window.electronAPI.exit(), focus: true },
            { label: 'Cancel', action: () => setDialog(dialogType.None) },
          ]}
        />
      )}

      {dialog === dialogType.Update && (
        <Dialog
          title="Update Installed"
          message="A new update has been downloaded and will be installed the next time you start this app."
          buttons={[{ label: 'Ok', action: () => setDialog(dialogType.None), focus: true }]}
        />
      )}

      {showIntro ? (
        <Intro setShowIntro={setShowIntro} />
      ) : guide ? (
        guide.html ? (
          <HTMLGuide guide={guide} setGuide={setGuide} />
        ) : (
          <Guide guide={guide} setGuide={setGuide} />
        )
      ) : !guide && game && online ? (
        <Guides game={game} setGuide={setGuide} setGame={setGame} />
      ) : (
        <div>
          {!online && (
            <h1 style={{ textAlign: 'center' }}>
              Device Offline <OfflineIcon className="icon" />
            </h1>
          )}
          {online && <Games setGame={setGame} setSearch={setSearch} />}
          {(!search || search.trim().length === 0) && recentGuides.length > 0 && (
            <Recents setGuide={setGuide} recentGuides={recentGuides} setRecentGuides={setRecentGuides} />
          )}
        </div>
      )}

      {type === deviceTypes.deck && (
        <Footer escapeHandler={() => escapeHandler({ key: 'Escape' })} guide={guide} game={game} dialog={dialog} />
      )}
    </div>
  );
}
