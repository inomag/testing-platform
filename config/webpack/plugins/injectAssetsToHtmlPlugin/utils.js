const { apps } = require('../../../app.config');

// eslint-disable-next-line class-methods-use-this, max-lines-per-function
const getHomeButton = () => `
<style>
    #open-btn {
        position: fixed;
        top: calc(100vh - 40px);
        left: calc(100vw - 40px);
        background-color: transparent;
        z-index: 1001;
        border: none;
        cursor: pointer;
        padding: 0;
    }

    #open-btn svg {
        width: 30px;
        height: 30px;
    }

    .tooltip {
        position: absolute;
        bottom: 50px;
        right: 10px;
        width: 200px;
        background-color: white;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 1002;
        display: none;
        flex-direction: column;
        align-items: center;
        padding: 10px;
    }

    .tooltip label {
        margin: 5px 0;
        font-size: 14px;
    }

    .tooltip .go-home-btn {
        background-color: #d31622;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px;
        margin-top: 10px;
        cursor: pointer;
        width: 100%;
    }

    .tooltip .go-home-btn:hover {
        opacity: 0.8;
    }
</style>
<script>
function toggleTooltip() {
    const tooltip = document.querySelector('.tooltip');
    tooltip.style.display = tooltip.style.display === 'none' || !tooltip.style.display ? 'flex' : 'none';

    // If tooltip is displayed, set up a click listener to hide it when clicking outside
    if (tooltip.style.display === 'flex') {
        document.addEventListener('click', handleOutsideClick);
    }
}

function handleOutsideClick(event) {
    const btn = document.getElementById('open-btn');
    const tooltip = document.querySelector('.tooltip');

    // If click happens outside of the FAB or tooltip, hide the tooltip
    if (!btn.contains(event.target) && !tooltip.contains(event.target)) {
        tooltip.style.display = 'none';
        document.removeEventListener('click', handleOutsideClick);
    }
}

function goToHome() {
    let baseUrl = (window.location.origin + window.location.pathname)
        .replace(new RegExp(/\\/(index\\.html)?$/), '')
        .split('/')
        .slice(0, -1)
        .join('/') + '/';
    location.href = baseUrl + 'index.html';
    localStorage.clear();
    sessionStorage.clear();
}

document.addEventListener("DOMContentLoaded", function() {
    const btn = document.getElementById("open-btn");
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    document.body.appendChild(tooltip);


    btn.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent click event from propagating to the document level
        const appLabel = window.APP || 'Unknown App';
        const clientIdLabel = window.portalId || 'Unknown Portal ID';

        tooltip.innerHTML = \`
            <label>App: \${appLabel}</label>
            <label>Portal ID: \${clientIdLabel}</label>
            <button class="go-home-btn" onclick="goToHome()">Go To Platform</button>
        \`;

        toggleTooltip();
    });

    let isDragging = false;
    
    btn.onmousedown = function(event) {
        event.preventDefault();
        isDragging = false;

        let shiftX = event.clientX - btn.getBoundingClientRect().left;
        let shiftY = event.clientY - btn.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            btn.style.left = pageX - shiftX + 'px';
            btn.style.top = pageY - shiftY + 'px';
            isDragging = true;
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        btn.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            btn.onmouseup = null;
        };
    };

    btn.ondragstart = function() {
        return false;
    };
});
</script>
<button id="open-btn">
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-home">
        <path d="M3 9L12 2l9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline fill="currentColor" points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
</button>
<div id="root">`;

const getPortalSelect = (app) => {
  const portalIds = apps.find(({ name }) => name === app)?.output?.clients;
  if (!portalIds) {
    // default to render the app without portal
    return `window.vymo?.default?.render?.()`;
  }

  return `if (!window?.opener?.selectedClientId && !sessionStorage.getItem('portalId')) {
    const styleTag = document.createElement('style');
        styleTag.innerHTML = \`
            .portal-dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            }
            .portal-dialog {
            background: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
            }
            .portal-select {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            }
            .portal-submit-btn {
             background-color: #d31622;
             color: #fff;
             border: none;
             border-radius: 5px;
             padding: 12px 20px;
             cursor: pointer;
             transition: background-color 0.2s;
            }
            .portal-submit-btn:hover {
             opacity: 0.8;
            }\`
        ;
        document.head.appendChild(styleTag);

        // dialog to ask the user for the portalId
        const portalDialog = document.createElement('div');
        portalDialog.classList.add('portal-dialog-overlay');
        portalDialog.innerHTML = \`
          <div class="portal-dialog">
            <label for="portal-select">Select Portal ID for ${app} App:</label>
            <select id="portal-select" class="portal-select">
                ${portalIds
                  .map((id) => `\n<option value="${id}">${id}</option>\n`)
                  .join('')}
            </select>
            <button id="submit-portal-id" class="portal-submit-btn">Submit</button>
          </div>
        \`;
        document.body.appendChild(portalDialog);
        document.getElementById('submit-portal-id').addEventListener('click', function() {
            const portalId = document.getElementById('portal-select').value;
            sessionStorage.setItem('portalId', portalId);
            window.vymo?.default?.render?.(portalId);
            document.querySelector('.portal-dialog-overlay').remove();
        });
      } else {
            if(!sessionStorage.getItem('portalId'))
            {   
                sessionStorage.setItem('portalId',window?.opener?.selectedClientId)
            }
            const portalId = sessionStorage.getItem('portalId');
            window.vymo?.default?.render?.(portalId);
      }`;
};

module.exports = {
  getHomeButton,
  getPortalSelect,
};
