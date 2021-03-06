async function runCommand(command) {
  const tabs = await browser.tabs.query({ url: 'https://*.spotify.com/*' });

  // Open a spotify tab if one does not exist yet.
  if (tabs.length === 0) {
    return;
  }

  // Apply command
  for (const tab of tabs) {
    let code = '';

    if (tab.url.startsWith('https://play.spotify.com')) {
      code = `document.getElementById('app-player').contentDocument.getElementById('${command}').click()`;
    } else if (tab.url.startsWith('https://open.spotify.com')) {
      switch (command) {
        case 'play-pause':
          code =
            "(document.querySelector('.spoticon-play-16') || document.querySelector('.spoticon-pause-16')).click()";
          break;

        case 'next':
          code = "document.querySelector('.spoticon-skip-forward-16').click()";
          break;

        case 'previous':
          code = "document.querySelector('.spoticon-skip-back-16').click()";
          break;

        default:
          console.error('Unknown command', command);
          break;
      }
    }

    if (code.length) browser.tabs.executeScript(tab.id, { code: code });
    else console.error('No code to execute');
  }
}

function connect(port = 8079) {
  return new Promise((rs, rj) => {
    const ws = new WebSocket(`ws://localhost:${port}`, ['mpris-service']);

    ws.addEventListener('open', () => {
      console.log('Connected successfully');
      rs(ws);
    });

    ws.addEventListener('message', event => {
      const json = JSON.parse(event.data);

      switch (json.type) {
        case 'playpause':
          runCommand('play-pause');
          break;

        default:
          runCommand(json.type);
          break;
      }
    });

    ws.addEventListener('error', e => {
      rj(e);
    });
  });
}

async function main() {
  try {
    const ws = await connect();
    const handleError = e => {
      console.log('Something happend:', e);
      ws.removeEventListener('error', handleError);
      main();
    };
    ws.addEventListener('error', handleError);
  } catch (e) {
    console.log('Failed', e);
    setTimeout(() => {
      main();
    }, 5000);
  }
}

main();
