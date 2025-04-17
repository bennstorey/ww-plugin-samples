(function () {
    // Listen to Digital Articles being opened.
    // See digital-editor-sdk.md interface SDKArticle for the article editor api.
    DigitalEditorSdk.onOpenArticle(function (article) {
        console.log('Digital Article opened', article);

        // Register callback for when the Digital Article is saved.
        article.onSave(function () {
            console.log('Digital Article was saved');
        });

        // Perform a save
        // Directly calls back when there is nothing to save. article.onSave won't be called in this case.
        // On errors, the first argument is set to a string describing the failure.
        article.save(function (err) {
            if (err) {
                console.error('Error occurred while saving: ', err);
            } else {
                console.log('Article was saved successfully!');
            }
        });

        // Get json data
        // Before creating the json data the editor renders the article,
        // during that some of directives (editor's components' elements) may request additional data.
        // For example the social components request html embed code.
        // Such additional data is merged with main article's data and returned as a result.
        article.getJson(function (json) {
            console.log('Article JSON data', json);
        });

        /**
         * Buttons - set label on initialization and on action
         */
        article.addToolbarButton({
            order: 1000, // Show the Dynamic Label button at the end of the toolbar
            onInit: function (button) {
                button.label = 'Dynamic label';
            },
            onAction: function (button) {
                button.label = 'Dynamic label(' + (Math.floor(Math.random() * 98) + 1) + ')';
            },
        });

        /**
         * Buttons - disable property
         */
        article.addToolbarButton({
            label: 'Disabled',
            disabled: true,
        });

        /**
         * Buttons - hidden property
         */
        article.addToolbarButton({
            label: 'Hidden',
            hidden: true,
            onInit: function (button) {
                // show button on initialization
                button.hidden = false;
            },
            onAction: function (button) {
                // hide button on click
                button.hidden = true;
            },
        });

        /**
         * Buttons - dynamically add new
         */
        article.addToolbarButton({
            label: 'Add',
            onAction: function (button) {
                this.addToolbarButton({
                    label: 'New(' + (Math.floor(Math.random() * 98) + 1) + ')',
                    onAction: function (newButton) {
                        newButton.hidden = true;
                    },
                });
            },
        });

        /**
         * Fullscreen dialog
         */
        article.addToolbarButton({
            label: 'Fullscreen',
            onAction: function (button) {
                // create fullscreen dialog and get the element
                const dialog = this.createFullscreenDialog();
                const iframeWindow = dialog.getWindow();

                // write content into iframe
                iframeWindow.document.open();
                iframeWindow.document.write('<center><h2>Hello world!</h2></center>');
                iframeWindow.document.close();

                // add elements using native createElement
                const center = iframeWindow.document.createElement('center');
                const closeButton = iframeWindow.document.createElement('button');
                closeButton.innerHTML = 'Close Me';
                closeButton.onclick = function () {
                    dialog.destroy();
                };
                center.appendChild(closeButton);
                const iframeBody = iframeWindow.document.body;
                iframeBody.appendChild(center);

                // close by timer
                const span = iframeWindow.document.createElement('span');
                const p = iframeWindow.document.createElement('p');
                p.innerHTML = 'It will be closed in ';
                p.style.margin = '40px 0 0 0';
                p.style.textAlign = 'center';
                p.appendChild(span);
                p.appendChild(iframeWindow.document.createTextNode('.'));
                iframeBody.appendChild(p);
                // run timer to close the dialog in 100 seconds
                countHelper(
                    100,
                    function () {
                        dialog.destroy();
                    },
                    function (time) {
                        if (dialog.isPresent()) {
                            span.innerHTML = time;
                            return true;
                        }
                        return false;
                    },
                );
            },
        });

        // Show button to save and unlock the current article.
        // The unlock is done by calling the save function on the SDKArticle with an extra unlock argument value set to true.
        // The callback will be called when article is saved and unlocked.
        article.addToolbarButton({
            onInit: function (button) {
                button.label = 'Save&Unlock';
            },
            onAction: function (button) {
                article.save(function (err) {
                    console.log('Save&Unlock', err || 'ok');
                    if (err) {
                        alert(err);
                    }
                }, true); // <<< Added unlock = true
            },
        });

        // Show button to set editor to readonly, save, unlock and then close the current article editor.
        // Similar functionality as the editor 'Go Back' button (in top left of browser under the Studio logo).
        article.addToolbarButton({
            onInit: function (button) {
                button.label = 'Close';
            },
            onAction: function (button) {
                // Set editor to readonly, save and unlock article. Then call callback function.
                article.close(function (err) {
                    console.log('Close', err || 'ok');
                    if (err) {
                        // Show error in prompt and do not close editor.
                        alert(err);
                    } else {
                        // When callback returns true, the editor will be closed and plugin script will end.
                        // After editor closes ContentStation will be visible again.
                        return true;
                    }
                });
            },
        });

        // Show button to get the latest metadata of the article
        // This function will always contact the server for the metadata because someone else
        // might have changed it and the article did not receive those changes
        article.addToolbarButton({
            onInit: function (button) {
                button.label = 'CheckMetadata';
            },
            onAction: function (button) {
                article.checkMetadata().then((enterpriseObject) => {
                    console.log('Enterprise Object Metadata', enterpriseObject.MetaData);
                });
            },
        });
    });

    // Access to ContentStationSdk
    ContentStationSdk.showNotification({
        content: 'Studio SDK is available too.',
    });

    // Registers a callback which will be called when articles are been published.
    DigitalEditorSdk.onPublish(function (channel, articleIds) {
        // Only handle email channels in this sample
        if (channel.type === 'email') {
            // As sample we show a notification with publish info in ContentStation.
            ContentStationSdk.showNotification({
                content: [
                    "Email articles id's",
                    '[' + articleIds.join(', ') + ']',
                    'to',
                    channel.properties.name,
                    'channel with id:',
                    channel.id,
                ].join(' '),
            });

            // Simply "return true;" will continue publishing and "return false;" will cancel it.
            // When publish is canceled, no notification is given. In this case it's possible to show
            // a custom notification by using ContentStationSdk.showNotification(). See sdk/content-station-11.sdk.md.
            // When the publishing needs to wait for a async action, return a Promise.
            // More info about Promises:
            //   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
            // Our sample:
            return new Promise(function (resolve, reject) {
                // Call the resolve or the eject function when the async action is ended.
                // Use resolve(false) to cancel publish action and resolve(true) to continue it.
                // Use reject(new Error('My error')) to prevent publishing and notify the critical error.
                // None critical errors can best be handled using resolve(false) and ContentStationSdk.showNotification().

                // As sample of an async action we use a setTimeout of 1 second.
                setTimeout(function () {
                    resolve(true);
                }, 1000);
            });
        }
        // It's not an email channel, return true to let publishing continue.
        return true;
    });

    /* Additional helpers */
    function countHelper(time, callback, tickCallback, tick) {
        if (!tick) {
            tick = 1000;
        }
        if (time > 0) {
            if (!tickCallback || tickCallback(time)) {
                setTimeout(function () {
                    countHelper(time - 1, callback, tickCallback, tick);
                }, tick);
            }
        } else {
            if ((!tickCallback || tickCallback(time)) && callback) {
                callback();
            }
        }
    }
})();

//# sourceURL=digital-editor-sdk-sample.js
