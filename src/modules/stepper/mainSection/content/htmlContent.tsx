import React, { useEffect } from 'react';
import { updateInlineScripts } from './queries';
import styles from './index.module.scss';

function HTMLContent({ htmlContent, actionCategory }) {
  useEffect(() => {
    const extractAndLoadScripts = (html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const scripts = Array.from(doc.querySelectorAll('script'));
      const bodyContent = doc.body.innerHTML;

      // Inject body content
      const container = document.getElementById('html-container');
      if (container) {
        container.innerHTML = bodyContent;
      }

      const loadScript = (src) =>
        new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });

      const inlineScripts = scripts.filter((script) => !script.src);
      const externalScripts = scripts.filter((script) => script.src);

      // Load external scripts in order
      const loadScriptsSequentially = (scriptsArr, index = 0) => {
        if (index >= scriptsArr.length) {
          return Promise.resolve();
        }
        return loadScript(scriptsArr[index].src).then(() =>
          loadScriptsSequentially(scriptsArr, index + 1),
        );
      };

      loadScriptsSequentially(externalScripts)
        .then(() => {
          inlineScripts.forEach((script) => {
            const modifiedScript = updateInlineScripts(script, actionCategory);
            document.body.appendChild(modifiedScript);
          });
        })
        // eslint-disable-next-line no-console
        .catch((error) => console.error('Error loading scripts:', error));
    };

    extractAndLoadScripts(htmlContent);
  }, [htmlContent, actionCategory]);

  return <div id="html-container" className={styles.htmlContentContainer} />;
}

export default HTMLContent;
