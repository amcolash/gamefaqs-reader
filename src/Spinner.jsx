import React from 'react';
import { cssRaw } from 'typestyle';

cssRaw(`.loader {
  width: 48px;
  height: 48px;
  border: 5px solid var(--secondary);
  border-bottom-color: var(--primary);
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}`);

export function Spinner() {
  return <div className="loader"></div>;
}
