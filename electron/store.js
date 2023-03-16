import { app } from 'electron';
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

// Based on code from https://cameronnokes.com/blog/how-to-store-user-data-in-electron/
class Store {
  constructor(opts) {
    const userDataPath = app.getPath('userData');
    this.path = join(userDataPath, opts.configName + '.json');

    console.log(this.path);

    this.data = parseDataFile(this.path, opts.defaults);
  }

  has(key) {
    return this.data[key] !== undefined;
  }

  get(key) {
    return this.data[key];
  }

  set(key, val) {
    this.data[key] = val;
    writeFileSync(this.path, JSON.stringify(this.data));
  }

  remove(key) {
    this.set(key);
  }

  size() {
    return Object.keys(this.data).length;
  }

  entries() {
    return Object.entries(this.data);
  }
}

function parseDataFile(filePath, defaults) {
  // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
  // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
  try {
    return JSON.parse(readFileSync(filePath).toString());
  } catch (error) {
    // if there was some kind of error, return the passed in defaults instead.
    return defaults || {};
  }
}

export const cookieKey = 'cookie';
export const guideKey = 'guides';

// First instantiate the class
export const store = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'user-preferences',
  defaults: {
    [cookieKey]: undefined,
  },
});

export const guideCache = new Store({
  configName: 'guide-cache',
});
