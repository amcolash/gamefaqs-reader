import React from 'react';

import ArrowRightIcon from '../icons/arrow-right.svg';

export function Intro(props) {
  return (
    <div
      className="intro"
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
          alignItems: 'center',
          textAlign: 'justify',
          maxWidth: '1100px',
          overflow: 'auto',
          padding: '0.5rem',
        }}
      >
        <div style={{ maxWidth: '485px', marginBottom: '3rem' }}>
          <h1>Welcome to GameFAQs Reader!</h1>
          <h3>
            This application lets you read game guides and automatically saves them for offline use on the go. To get started, just search
            for a game and select a guide.
          </h3>

          <h3>
            This application supports controller input out of the box. I recommend using the default steam controller template (Templates
            <ArrowRightIcon style={{ margin: '0 0.5rem' }} />
            Gamepad) for the default button mapping.
          </h3>
        </div>

        <img src="./gamepad/gamepad.png" style={{ maxWidth: '100%' }} />

        <button style={{ marginTop: '3rem' }} onClick={() => props.setShowIntro(false)}>
          Get Started
        </button>
      </div>
    </div>
  );
}
