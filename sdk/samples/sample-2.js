(() => {
    function onInit(config, selection) {
        // Disable when multiple items are selected.
        config.isDisabled = selection.length > 1;
    }

    function onAction(selection) {
        const filename = selection[0].Name;
        const wikiSearchUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(filename)}`;

        // Open modal dialog and keep the dialog id
        const dialogId = ContentStationSdk.openModalDialog({
            title: `Wikipedia search results for "${filename}"`,
            width: 1000,
            content: `<iframe src=${wikiSearchUrl} frameborder="0" style="margin: 0; padding: 0; height: 500px; width: 100%"></iframe>`,
            contentNoPadding: true,
            buttons: [
                /*
                 * Button defined as secondary with class 'pale'.
                 * Has no callback defined - will close the dialog.
                 */
                {
                    label: 'Close',
                    class: 'pale',
                },
                /*
                 * Button defined as normal/primary.
                 * On click will close the dialog with cached dialog id, and open new tab with iframeSrc url.
                 */

                {
                    label: 'Open in new tab',
                    callback: () => {
                        ContentStationSdk.closeModalDialog(dialogId);
                        window.open(wikiSearchUrl);
                    },
                },
            ],
        });
    }

    ContentStationSdk.createAction({
        title: 'Search Wikipedia...',
        onInit: onInit,
        onAction: onAction,
    });
})();

(() => {
    function getFormattedJson(obj) {
        if (!obj) {
            return 'no data';
        }
        return JSON.stringify(obj, null, 2);
    }

    function logData(obj) {
        document.getElementById('sampleLogArea').textContent = getFormattedJson(obj);
    }

    function addClickHandler(elementId, handler) {
        document.getElementById(elementId).addEventListener('click', handler);
    }

    function onAction(selection, dossier) {
        // Open modal dialog and keep the dialog id
        const dialogId = ContentStationSdk.openModalDialog({
            width: 1000,
            content: `<div style="height: 500px; position: relative">
                    <div style="height: 45px; padding: 10px">
                        <button id="sampleButtonInfo" class="cs-btn mr10">Log Info</button>
                        <button id="sampleButtonSelection" class="cs-btn mr10">Log Selection</button>
                        <button id="sampleButtonDossier" class="cs-btn mr10">Log Dossier</button>
                        <button id="sampleButtonPlatform" class="cs-btn mr20">Log platform</button>
                        <button id="sampleButtonClose" class="cs-btn pale">Close</button>
                    </div>
                    <pre id="sampleLogArea" style="height: calc(100% - 45px); background: lightgray; padding: 20px; margin: 0; width: 100%"></pre>
                </div>`,
            contentNoPadding: true,
        });

        // Attach click handlers that will log data info log area
        addClickHandler('sampleButtonInfo', () => {
            logData(ContentStationSdk.getInfo());
        });
        addClickHandler('sampleButtonSelection', () => {
            logData(selection);
        });
        addClickHandler('sampleButtonDossier', () => {
            logData(dossier);
        });
        addClickHandler('sampleButtonPlatform', () => {
            logData(platform);
        });
        addClickHandler('sampleButtonClose', () => {
            ContentStationSdk.closeModalDialog(dialogId);
        });
    }

    ContentStationSdk.createAction({
        title: 'Show all data in modal',
        onAction: onAction,
    });
})();

(() => {
    /**
     * Basic example of a custom application.
     * We defined name, title, chunk of html for content and one default button with simple callback in the top bar.
     */

    ContentStationSdk.registerCustomApp({
        name: 'sample-app-1',
        title: 'Custom App Sample 1',
        content: '<div style="padding: 30px"><h3 id="custom-app-sample-1-title">Hello, World!</h3></div>',
        buttons: [
            {
                label: 'Say hello',
                callback: () => {
                    alert('Hello!');
                },
            },
        ],
    });
})();

(() => {
    /**
     * Applications are allowed to change the state with set of parameters. Developers are advised not to change the url directly and rather use
     * the methods provided in SDK to hook into the Content Station's state change system.
     *
     * Applications that intend to work with state changes should be implemented in a way where all state changes are
     * requested with `SDK.changeCustomAppState(params)` and application's UI is changed when `onAppStateChanged(params)` callback is called.
     *
     * In this example we want to change the app state and write the parameters on the page.
     * The proposed way to do this is to request the state change from Content Station, and do the actual writing of parameters when Content Station
     * calls the `onAppStateChanged` callback provided in application configuration.
     * This way we have defined and streamlined process of changing the states, and also hook up into browser's history and have working back/forward buttons.
     */

    // Used to generate random new params
    const paramNamesArr = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa'];
    const paramValuesArr = [1, 'someValue', false, true, 5, 'otherValue', -10, 'value with space', -100];

    // Register a custom app
    ContentStationSdk.registerCustomApp({
        name: 'sample-app-2',
        title: 'Custom App Sample 2',
        icon: 'logo-symbol-only.svg',
        content: `<div id="custom-app-sample-2" style="padding: 30px">
                <h3 id="custom-app-sample-2-title">Custom App Sample 2</h3>
                <button id="custom-app-sample-2-button" class="cs-btn">Generate new params</button>
                <p>params:</p>
                <pre id="custom-app-sample-2-pre" style="padding: 20px; background-color: lightgoldenrodyellow"></pre>
            </div>`,
        onInit: onInit,
        onAppStateChanged: onAppStateChanged,
        buttons: [
            {
                /**
                 * Button in form of a label with callback that just puts 'updated' string on the end of page title whenever the button is clicked.
                 */
                label: 'Update title',
                type: 'label',
                callback: () => {
                    const title = document.getElementById('custom-app-sample-2-title');
                    title.textContent = `${title.textContent} updated`;
                },
            },
            {
                /**
                 * Button in form of secondary button with a bit of custom css and with callback that alerts 'Hello!'.
                 */
                label: 'Say hello',
                type: 'secondary',
                style: {
                    'font-weight': 'bold',
                    'text-transform': 'uppercase',
                    'border-color': 'orange',
                },
                callback: () => {
                    alert('Hello!');
                },
            },
        ],
    });

    /**
     * Generates random int from min to max range.
     * @param {Number} min
     * @param {Number} max
     * @returns {Number}
     */
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Generates random new params.
     * @returns {{}}
     */
    function generateNewParams() {
        const paramsObj = {};
        const numberOfParams = randomInt(1, 5);
        for (let i = 0; i < numberOfParams; i++) {
            paramsObj[paramNamesArr[randomInt(0, paramNamesArr.length - 1)]] =
                paramValuesArr[randomInt(0, paramValuesArr.length - 1)];
        }
        return paramsObj;
    }

    /**
     * Function called on custom app init.
     */
    function onInit() {
        console.log('[sample-app-2] INIT');
        document.getElementById('custom-app-sample-2-button').addEventListener('click', () => {
            // Generate params
            const newParams = generateNewParams();
            console.log('[sample-app-2] Requested params change to:', newParams);
            // Request the state change from Content Station
            ContentStationSdk.changeCustomAppState(newParams);
        });
    }

    /**
     * Function called on every state change.
     * @param {Object} params
     */
    function onAppStateChanged(params) {
        console.log('[sample-app-2] Detected params change:', params);
        /*
         * When Content Station changes the state, it calls the `onAppStateChanged` callback with `params` as function argument.
         * Here we write the `params` object on the custom app's page.
         */
        document.getElementById('custom-app-sample-2-pre').textContent = JSON.stringify(params, null, 2);
    }
})();
