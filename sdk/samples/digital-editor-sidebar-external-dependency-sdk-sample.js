((DigitalEditorSdk) => {
    class PanelService {
        constructor(article) {
            this.article = article;
        }

        create() {
            this.article.addSidebarPanel({
                onInit: (panel) => {
                    this.init(panel);
                },
                onDestroy: (panel) => {},
                button: {
                    icon: {
                        normal: '../sdk/samples/assets/properties.svg',
                        activated: '../sdk/samples/assets/properties-activated.svg',
                    },
                },
            });
        }

        async init(panel) {
            this.panel = panel;
            this.document = panel.window.document;
            await this.loadDependencies();
            this.drawPanel();
        }

        async addElement(tagName, attributes) {
            return new Promise((resolve, reject) => {
                // Use pure JS as we cannot assume jQuery is available.
                const element = this.document.createElement(tagName);
                element.onload = (event) => {
                    resolve(event);
                };
                element.onerror = (event) => {
                    reject(event);
                };
                for (let key in attributes) {
                    element.setAttribute(key, attributes[key]);
                }
                this.document.head.appendChild(element);
            });
        }

        async addScript(src, integrity, crossOrigin) {
            return this.addElement('script', {
                type: 'text/javascript',
                src: src,
                integrity: integrity,
                crossOrigin: crossOrigin,
            });
        }

        async addStyle(href, integrity, crossOrigin) {
            return this.addElement('link', {
                rel: 'stylesheet',
                href: href,
                integrity: integrity,
                crossOrigin: crossOrigin,
            });
        }

        async loadJQuery() {
            // Source: https://code.jquery.com/
            return this.addScript(
                'https://code.jquery.com/jquery-3.5.1.min.js',
                'sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=',
                'anonymous',
            );
        }

        async loadSelect2() {
            // Source: https://cdnjs.com/libraries/select2/4.0.11
            return Promise.all([
                this.addStyle(
                    'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.11/css/select2.min.css',
                    'sha512-nMNlpuaDPrqlEls3IX/Q56H36qvBASwb3ipuo3MxeWbsQB1881ox0cRv7UPTgBlriqoynt35KjEwgGUeUXIPnw==',
                    'anonymous',
                ),
                this.addScript(
                    'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.11/js/select2.min.js',
                    'sha512-SbUBli3ovy0gJxBH6XfIo9cs/Oq3FmyDAGdRGONsiCerYXIKUwtmstqfTHuxyNb3y9bvoe4/P9J0/E6U6RfjeQ==',
                    'anonymous',
                ),
            ]);
        }

        async loadDependencies() {
            // Load jQuery and the select2 jQuery plugin.
            await Promise.all([this.loadJQuery(), this.loadSelect2()]);

            // Provide easy access to our local jQuery instance.
            this.$ = this.panel.window.$;

            // Debug logging.
            console.log(`SDK panel jQuery version: ${this.$.fn.jquery}`);
            console.log(`SDK panel select2 available: ${this.$.fn.select2 !== undefined}`);
            console.log(jQuery ? `Digital Editor jQuery version: ${$.fn.jquery}` : 'No jQuery available in main app');
            console.log(`Digital Editor select2 available: ${jQuery && $.fn.select2 !== undefined}`); // Always false as the Digital Editor doesn't use select2.
        }

        drawPanel() {
            // We can do our magic using our local loaded jQuery version including select2.
            const body = this.$(this.document).find('body');
            body.append(`<h3>HTML created with jQuery</h3>
                <select class="select-test" style="width: 100%">
                    <option>Alaska</option>
                    <option>Hawaii</option>
                </select>`);
            this.$('.select-test').select2({
                multiple: true,
                placeholder: 'Select a state',
            });
        }
    }

    DigitalEditorSdk.onOpenArticle(function (article) {
        console.log("🟢 Digital editor SDK called");
        new PanelService(article).create();
    });
})(DigitalEditorSdk);

//# sourceURL=digital-editor-sidebar-external-dependency-sdk-sample.js
