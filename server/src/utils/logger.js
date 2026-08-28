const logger = {
  info: (msg, meta = '') => {
    console.log(`[INFO] [${new Date().toISOString()}] ${msg}`, meta ? JSON.stringify(meta) : '');
  },
  warn: (msg, meta = '') => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${msg}`, meta ? JSON.stringify(meta) : '');
  },
  error: (msg, error = '') => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${msg}`, error?.stack || error || '');
  }
};

module.exports = logger;
