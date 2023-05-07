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
import { Dialog } from './Dialog';
import { deviceTypes, useDeviceType } from '../hooks/useDeviceType';
import { Footer } from './Footer';

export function App() {
  const online = useOnline();
  const type = useDeviceType();
  const [search, setSearch] = useState(); // Keep track of search for ui
  const [game, setGame] = useLocalStorage(lastGame);
  const [guide, setGuide] = useLocalStorage(lastGuide);
  const [recentGuides, setRecentGuides] = useLocalStorage(recentGuideKey, []);
  const [showIntro, setShowIntro] = useLocalStorage(introKey, true);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  const containerStyle = style({
    padding: '1rem',
    width: guide ? undefined : '85%',
    maxWidth: 'var(--maxWidth)',
  });

  useEffect(() => {
    window.electronAPI.onUpdateDownloaded((_event, value) => {
      console.log('renderer: update downloaded', value);
      setShowUpdateDialog(true);
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
  }, [guide]);

  const escapeHandler = useCallback(
    (e) => {
      const active = document.activeElement;

      if (e.key === 'Escape' || e.key === 'Backspace') {
        if (active && active !== document.body) {
          active.blur();
          return;
        }

        if (!active || active === document.body) {
          if (showExitDialog) setShowExitDialog(false);
          else if (guide) setGuide();
          else if (game) {
            setGame();
            setSearch();
          } else setShowExitDialog(true);
        }
      }
    },
    [showExitDialog, guide, game]
  );

  useEffect(() => {
    initNavigation();

    window.addEventListener('keydown', escapeHandler);

    const exitHandler = window.joypad.on('button_press', (e) => {
      if (e.detail.gamepad.index !== 0) return;

      // Button 1: B (A nintendo)
      if (e.detail.index === 1 && !document.querySelector('.keyboard')) escapeHandler({ key: 'Escape' });
    });

    return () => {
      cleanupNavigation();
      window.removeEventListener('keydown', escapeHandler);
      exitHandler.unsubscribe();
    };
  }, [guide, game, showExitDialog]);

  useEffect(() => {
    document.body.style.overflow = showExitDialog ? 'hidden' : 'initial';
  }, [showExitDialog]);

  return (
    <div className={containerStyle}>
      {showExitDialog && (
        <Dialog
          title="Are you sure you want to exit?"
          buttons={[
            { label: 'Cancel', action: () => setShowExitDialog(false) },
            { label: 'Ok', action: () => window.electronAPI.exit(), focus: true },
          ]}
        />
      )}

      {showUpdateDialog && (
        <Dialog
          title={`A new update has been downloaded.\nWould you like to restart the app and update now?`}
          buttons={[
            { label: 'Update Later', action: () => setShowUpdateDialog(false) },
            { label: 'Update Now', action: () => window.electronAPI.update(), focus: true },
          ]}
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

      {type === deviceTypes.deck && <Footer escapeHandler={() => escapeHandler({ key: 'Escape' })} guide={guide} game={game} />}
    </div>
  );
}
