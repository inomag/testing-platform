// graphFull tends to perform better when we have large number of file changes
const STRATEGY_USED = 'graphFull'; // graphFull | graphReach

// eslint-disable-next-line import/no-dynamic-require
const { getAffectedModulesAndApps } = require(`./${STRATEGY_USED}`);

module.exports = {
  getAffectedModulesAndApps,
};
