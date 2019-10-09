async function runCommand(command) {
    const tabs = await browser.tabs.query({ url: "https://*.spotify.com/*" });

    // Open a spotify tab if one does not exist yet.
    if (tabs.length === 0) {
        return;
    }

    // Apply command
    for (const tab of tabs) {
        let code = "";

        if (tab.url.startsWith("https://play.spotify.com")) {
            code = `document.getElementById('app-player').contentDocument.getElementById('${command}').click()`;
        } else if (tab.url.startsWith("https://open.spotify.com")) {
            switch (command) {
                case "play-pause":
                    code = "(document.querySelector('.spoticon-play-16') || document.querySelector('.spoticon-pause-16')).click()";
                    break;

                case "next":
                    code = "document.querySelector('.spoticon-skip-forward-16').click()";
                    break;

                case "previous":
                    code = "document.querySelector('.spoticon-skip-back-16').click()";
                    break;

                default:
                    console.error('Unknown command', command);
                    break;
            }
        }

        if (code.length)
            browser.tabs.executeScript(tab.id, { code: code });
        else
            console.error('No code to execute');
    }
}


function main() {
    const ws = new WebSocket('ws://localhost:8079', ['mpris-service']);

    ws.addEventListener('open', () => {
        ws.send('hello');
    });

    ws.addEventListener('message', event => {
        console.log(event.data);
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
}

main();
