import { useEffect, useState } from 'react';

export const deviceTypes = {
  desktop: 'desktop',
  deck: 'deck',
};

export function useDeviceType() {
  const [deviceType, setDeviceType] = useState(deviceTypes.desktop);

  useEffect(() => {
    window.electronAPI.steamdeck().then((deck) => (deck ? setDeviceType(deviceTypes.deck) : setDeviceType(deviceTypes.desktop)));
  }, []);

  return deviceType;
}
