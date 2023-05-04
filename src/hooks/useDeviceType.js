import { useEffect, useState } from 'react';
import { useWindowSize } from './useWindowSize';

import { deckSize } from '../utils/util';

export const deviceTypes = {
  desktop: 'desktop',
  deck: 'deck',
};

export function useDeviceType() {
  const [deviceType, setDeviceType] = useState(deviceTypes.desktop);
  const size = useWindowSize();

  useEffect(() => {
    const type = (size.width || 0) <= deckSize ? deviceTypes.deck : deviceTypes.desktop;
    setDeviceType(type);
  }, [size]);

  return deviceType;
}
