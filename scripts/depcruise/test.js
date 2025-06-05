const { getAffectedModulesAndApps } = require('./index');

(async () => {
  const {
    appsAffected: appsToCompile,
    modulesAffected,
    atomsAffected,
    blocksAffected,
    componentsAffected,
  } = await getAffectedModulesAndApps();
  console.log(
    appsToCompile,
    modulesAffected,
    atomsAffected,
    blocksAffected,
    componentsAffected,
  );
})();

// graph command
// npx depcruise src --focus . --do-not-follow null --output-type dot | dot -T svg > dependency-graph.svg;
