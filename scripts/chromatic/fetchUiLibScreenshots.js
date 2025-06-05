/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const puppeteer = require('puppeteer');
const _ = require('lodash');
const { appPath } = require('../../config/paths');

// Paths
const imagesDir = path.resolve(appPath, 'public/images/components');
const storybookStaticDir = path.resolve(appPath, 'storybook-static');

// Ensure the images directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Function to extract title and first story name from stories file
function parseStoriesFile(storyFilePath) {
  try {
    const storyFileContent = fs.readFileSync(storyFilePath, 'utf-8');

    // Extract title (e.g., `title: 'atoms/Text'`)
    const titleMatch = storyFileContent.match(/title:\s*['"]([^'"]+)['"]/);
    const title = titleMatch ? titleMatch[1] : null;

    // Extract the first story name (e.g., `export const Default = ...`)
    const storyMatch = storyFileContent.match(/export\s+const\s+(\w+)\s*:/);
    const storyName = storyMatch ? _.kebabCase(storyMatch[1]) : 'default';
    return { title, storyName };
  } catch (err) {
    console.error(`Error reading or parsing story file: ${storyFilePath}`, err);
    return { title: null, storyName: 'default' };
  }
}

// Function to generate image for the component
async function generateImageForComponent(componentId, storyName = 'default') {
  const browser = await puppeteer.launch({
    args: ['--disable-web-security', '--allow-file-access-from-files'],
  });
  const page = await browser.newPage();

  // Set a fixed viewport size that matches uiBuilder left pane
  await page.setViewport({
    width: 800,
    height: 600,
    deviceScaleFactor: 1,
  });

  const storybookUrl = `file:///${path.join(
    storybookStaticDir,
    'iframe.html',
  )}?id=${componentId}--${storyName}`;

  try {
    await page.goto(storybookUrl, { waitUntil: 'networkidle0' });

    // Add CSS to center the component and add padding
    await page.evaluate(() => {
      const style = document.createElement('style');
      style.textContent = `
        #root {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          min-height: 100vh !important;
          padding: 40px !important;
          box-sizing: border-box !important;
        }
        #root > * {
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
      `;
      document.head.appendChild(style);
    });

    // Wait for the root element and its children
    await page.waitForSelector('#root');
    await page.waitForSelector('#root > *');

    const componentName =
      componentId.split('-')[componentId.split('-').length - 1];

    // Take a centered screenshot
    await page.screenshot({
      path: path.join(imagesDir, `${componentName}.png`),
      fullPage: true,
    });

    console.log(`Image generated for ${componentId} at ${imagesDir}`);
  } catch (err) {
    console.error(`Error generating image for ${componentId}:`, err);
  } finally {
    await browser.close();
  }
}

async function generateImagesForComponentsInUi() {
  const uiDir = path.resolve(appPath, 'src/@vymo/ui');
  const componentCategories = ['atoms', 'blocks', 'molecules'];

  console.log('Generating images for components in src/@vymo/ui...');

  for (const category of componentCategories) {
    const categoryDir = path.join(uiDir, category);

    if (!fs.existsSync(categoryDir)) {
      console.warn(`Category folder not found: ${category}`);
      // eslint-disable-next-line no-continue
      continue;
    }

    const components = fs.readdirSync(categoryDir).filter((file) => {
      const fullPath = path.join(categoryDir, file);
      return fs.lstatSync(fullPath).isDirectory();
    });

    for (const componentName of components) {
      const storyFilePath = path.join(
        categoryDir,
        componentName,
        'index.stories.tsx',
      );
      if (!fs.existsSync(storyFilePath)) {
        console.warn(
          `Story file not found for ${category}/${componentName}. Skipping.`,
        );
        // eslint-disable-next-line no-continue
        continue;
      }

      const { title, storyName } = parseStoriesFile(storyFilePath);

      if (!title) {
        console.warn(
          `Title not found in story file for ${category}/${componentName}. Skipping.`,
        );
        continue;
      }

      const componentId = title.toLowerCase().replace(/\//g, '-');
      const imagePath = path.join(imagesDir, `${componentId}.png`);

      if (fs.existsSync(imagePath)) {
        console.log(`Image for ${componentId} already exists. Skipping.`);
        continue;
      }

      console.log(`Generating image for ${title} with story ${storyName}...`);

      try {
        await generateImageForComponent(componentId, storyName);
      } catch (error) {
        console.error(`Error generating image for ${title}:`, error);
      }
    }
  }

  console.log('Image generation for components complete.');
}

// Function to start Storybook if not already built
function ensureStorybookBuilt(callback) {
  if (!fs.existsSync(storybookStaticDir)) {
    console.log('Storybook static folder not found. Building Storybook...');
    exec('yarn build-storybook', (error) => {
      if (error) {
        console.error(`Error during Storybook build: ${error}`);
        return;
      }

      console.log('Storybook built successfully.');
      callback();
    });
  } else {
    callback();
  }
}

// Watch src/@vymo/ui for changes
chokidar
  .watch('src/@vymo/ui/**/*.{jsx,tsx,js,ts}', { ignored: /node_modules/ })
  .on('change', (changedFile) => {
    console.log(`File changed: ${changedFile}`);

    const componentName = path.basename(changedFile, path.extname(changedFile));
    const storyFilePath = path.resolve(
      path.dirname(changedFile),
      'index.stories.tsx',
    );
    const { title, storyName } = fs.existsSync(storyFilePath)
      ? parseStoriesFile(storyFilePath)
      : { title: null, storyName: 'default' };

    if (!title) {
      console.warn(
        `Title not found in story file for ${componentName}. Skipping.`,
      );
      return;
    }

    const componentId = title.toLowerCase().replace(/\//g, '-');
    const imagePath = path.join(imagesDir, `${componentId}.png`);

    if (fs.existsSync(imagePath)) {
      console.log(`Image for ${componentId} already exists. Skipping.`);
      return;
    }

    console.log(`Image for ${componentId} not found. Generating...`);

    ensureStorybookBuilt(() => {
      generateImageForComponent(componentId, storyName).catch(console.error);
    });
  });

// Initial tasks
ensureStorybookBuilt(() => {
  generateImagesForComponentsInUi().catch(console.error);
});
