const log = (level, event, details = {}) => {
  const entry = { timestamp: new Date().toISOString(), level, event, service: 'magranchal-api', ...details };
  (level === 'error' ? console.error : console.log)(JSON.stringify(entry));
};

module.exports = { log };
