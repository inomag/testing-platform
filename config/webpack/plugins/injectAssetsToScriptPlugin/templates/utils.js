const { writeFileSync, existsSync, mkdirSync, readFileSync } = require('fs');

/* eslint-disable max-lines-per-function */
// eslint-disable-next-line class-methods-use-this
function getScriptContent(allFiles, appName, isProductionEnv) {
  const packageJson = JSON.parse(readFileSync('package.json'));
  const homepage = packageJson.homepage || '';

  const cssFiles = allFiles
    .filter((file) => file.endsWith('.css'))
    .map((file) => (isProductionEnv ? `${homepage}/${file}` : `/${file}`));

  const jsFiles = allFiles
    .filter(
      (file) => file.endsWith('.js') && file.indexOf('hot-update.js') === -1,
    )
    .map((file) => (isProductionEnv ? `${homepage}/${file}` : `/${file}`));

  return `

// Load the JavaScript file
// Function to fetch script content
async function fetchScript(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(\`Failed to fetch \${url}: \${response.statusText}\`);
        }
        return await response.text();
    } catch (error) {
        console.error(error);
        return null;
    }
}


// Function to load scripts sequentially
function loadScriptsSequentially(scripts, callback) {
  let index = 0;

  function loadNext() {
    if (index < scripts.length) {
      const scriptSrc = scripts[index];

      if (scriptSrc) {
        const script = document.createElement('script');
        script.src = scriptSrc;

        script.onload = () => {
          console.log(\`Script loaded successfully: \${scripts[index]}\`);
          index++;
          loadNext(); // Load the next script after the current one is loaded
        };

        script.onerror = () => {
          console.error(\`Failed to load script: \${scripts[index]}\`);
        };

        document.head.appendChild(script);
      } else {
        console.error(\`Script content is empty: \${scripts[index]}\`);
        index++;
        loadNext();
      }
    } else if (callback) {
      callback(); // All scripts are loaded, call the callback function
    }

   
  }
     loadNext();
}

// Function to load CSS files
function loadCSS(styles) {
    styles.forEach(path => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = path;
        document.head.appendChild(link);
    });
}



loadCSS(${JSON.stringify(cssFiles)});

loadScriptsSequentially(${JSON.stringify(jsFiles)}, () => {
    if (window.vymo) {
        window.initializePage();
        window.APP = "${appName}";
    } else {
        console.error('window.vymo is not defined');
    }
});
`;
}

const getClientIdsPerAppConfig = (appBuildPages = []) =>
  appBuildPages.reduce((acc, { name, output }) => {
    acc[name] = output?.clients ?? [];
    return acc;
  }, {});

const writeFileForWebpack = ({
  compilation,
  fileData,
  outputDir,
  appName,
  fileName,
  isEnvProduction = false,
}) => {
  if (isEnvProduction) {
    const appDirectory = `${outputDir}/${appName}`;
    if (!existsSync(appDirectory)) {
      mkdirSync(appDirectory);
    }
    const filePath = `${appDirectory}/${fileName}`;
    writeFileSync(filePath, fileData);
  } else {
    const compileFilePath = `${appName}/${fileName}`;
    compilation.assets[compileFilePath] = {
      source: () => fileData,
      size: () => fileData.length,
    };
  }
};

module.exports = {
  getScriptContent,
  getClientIdsPerAppConfig,
  writeFileForWebpack,
};
