import React, { useCallback, useEffect, useState } from 'react';
import { style } from 'typestyle';

import { Guide } from './Guide';
import { Games } from './Games';
import { Guides } from './Guides';
import { Recents } from './Recents';

import { useLocalStorage } from '../hooks/useLocalStorage';
import { useOnline } from '../hooks/useOnline';
import { introKey, lastGame, lastGuide, recentGuideKey } from '../utils/util';

import OfflineIcon from '../icons/wifi-off.svg';
import { cleanupNavigation, initNavigation } from '../utils/nav';
import { Intro } from './Intro';
import { Dialog, dialogType } from './Dialog';
import { Footer } from './Footer';
import { deviceTypes, useDeviceType } from '../hooks/useDeviceType';
import { useInFocus } from '../hooks/useInFocus';

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
  }, [guide, recentGuides]);

  const escapeHandler = useCallback(
    (e) => {
      if (!focus) return;

      if (dialog) {
        setDialog(dialogType.None);
        return;
      }

      const active = document.activeElement;

      if (e.key === 'Escape' || e.key === 'Backspace') {
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
      if (e.detail.gamepad.index !== 0) return;

      // Button 1: B (A nintendo)
      if (e.detail.index === 1 && !document.querySelector('.keyboard')) escapeHandler({ key: 'Escape' });
    });

    return () => {
      cleanupNavigation();
      window.removeEventListener('keydown', escapeHandler);
      exitHandler.unsubscribe();
    };
  }, [focus, dialog]);

  useEffect(() => {
    document.body.style.overflow = dialog ? 'hidden' : 'initial';
  }, [dialog]);

  return (
    <div className={containerStyle}>
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
        <Guide guide={guide} setGuide={setGuide} />
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
