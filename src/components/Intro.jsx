import React from 'react';

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
          textAlign: 'center',
          maxWidth: 'var(--maxWidth)',
          overflow: 'auto',
          padding: '0.5rem',
        }}
      >
        <h1>Welcome to GameFAQs Reader!</h1>
        <h3>
          This application lets you read game guides on the go. It even automatically saves them for offline use. To get started, just
          search for a game and select a guide.
        </h3>

        <h3>
          This application supports controller input out of the box. I would recommend using the default steam controller template
          ("Templates -{'>'} Gamepad") for this application.
        </h3>

        <h4>General</h4>
        <ul style={{ textAlign: 'left' }}>
          <li>Cross (Playstation) / A (Xbox) / B (Nintendo) - Confirm</li>
          <li>Circle (Playstation) / B (Xbox) / A (Nintendo) - Back / Exit</li>

          <li>D-Pad / Left Stick - Navigate Items</li>
          <li>Right Stick - Scroll</li>

          <li>Left Trigger - Page Up</li>
          <li>Right Trigger - Page Down</li>
        </ul>

        <h4>Onscreen Keyboard</h4>
        <ul style={{ textAlign: 'left' }}>
          <li>Cross (Playstation) / A (Xbox) / B (Nintendo) - Select Letter / Open Keyboard</li>
          <li>Square (Playstation) / X (Xbox) / Y (Nintendo) - Backspace</li>
          <li>Circle (Playstation) / B (Xbox) / A (Nintendo) - Close Keyboard / Clear Text</li>

          <li>D-Pad / Left Stick - Navigate Keys</li>

          <li>Left Bumper - Move Cursor Back</li>
          <li>Right Bumper - Move Cursor Forwards</li>
        </ul>

        <button style={{ marginTop: '2rem' }} onClick={() => props.setShowIntro(false)}>
          Get Started
        </button>
      </div>
    </div>
  );
}
