/* eslint-disable no-console */
declare global {
  interface Window {
    newrelic: { noticeError: (...args) => void };
  }
}

const isDevEnv = ['test', 'development'].includes(process.env.NODE_ENV);

class Logger {
  name: string;

  constructor(moduleName) {
    this.name = moduleName;
  }

  error(...message) {
    if (window.newrelic) {
      const client = localStorage.getItem('client');
      window.newrelic.noticeError(`${this.name}: ${message[0]}`, {
        error: message,
        page: this.name,
        client,
      });
    } else {
      console.error('newrelic is not initialized', this.name, ...message);
    }
    if (isDevEnv) {
      console.error(...message);
    }
  }

  info(...message) {
    if (isDevEnv) {
      console.info(this.name, ...message);
    }
  }

  debug(...message) {
    console.debug(this.name, ...message);
  }
}

export default Logger;
