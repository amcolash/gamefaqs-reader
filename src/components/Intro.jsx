import React from 'react';

export function Intro(props) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 'calc(100% - 4rem)',
        height: 'calc(100% - 4rem)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 'var(--maxWidth)',
          overflow: 'hidden',
        }}
      >
        <h1>Welcome to GameFAQs Reader!</h1>
        <h3>
          This application lets you read game guides on the go. It even automatically saves them for offline use. To get started, just
          search for a game and select a guide.
        </h3>

        <h3>I recommend using the default steam "Templates -{'>'} Gamepad" configuration.</h3>

        <button style={{ marginTop: '5rem' }} onClick={() => props.setShowIntro(false)}>
          Get Started
        </button>
      </div>
    </div>
  );
}
