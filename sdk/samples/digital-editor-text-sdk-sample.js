(function () {
    /**
     * Sample of use of the Text Editor SDK part of the Studio Digital Editor
     */

    ContentStationSdk.showNotification({
        content: 'digital-editor-text-sdk-sample loaded',
    });

    var textEditor;
    var btnStartTransaction, btnCloseTransaction, btnCancelTransaction;

    // Register callback for when a Digital Article is opened.
    // This callback will receive an object with methods
    // to operate on the opened article and use the text editor.
    DigitalEditorSdk.onOpenArticle(function (article) {
        console.log('Digital Article opened', article);

        // Get the Text Editor API
        textEditor = article.getEditor();

        createSampleMenu(article);
        createTransactionMenu(article);
    });

    /**
     * Create toolbar items with some samples of edit actions
     */
    function createSampleMenu(article) {
        article.addToolbarButton({
            label: 'Test getting',
            onAction: sampleGetting,
        });
        article.addToolbarButton({
            label: 'Test selecting',
            onAction: sampleSelecting,
        });
        article.addToolbarButton({
            label: 'Test replacing',
            onAction: sampleReplacing,
        });
        article.addToolbarButton({
            label: 'Test canceling',
            onAction: sampleCanceling,
        });
    }

    /**
     * Creates a toolbar items to start, close or cancel a transaction
     */
    function createTransactionMenu(article) {
        // Transactions are used to prevent the editor to save versions during the time a transaction is active.
        // Also transactions can be canceled, to undo all changes made from the point the transaction was started.
        // It's not possible to start multiple transactions simultaneously.

        // Following action shows which states are available on the text editor
        article.addToolbarButton({
            label: 'State',
            onAction: function () {
                var msg = [
                    'isTextSelected ' + textEditor.isTextSelected(),
                    'canEditArticle: ' + textEditor.canEditArticle(),
                    'isInTransaction: ' + textEditor.isInTransaction(),
                ].join('\n');
                alert(msg);
            },
        });

        article.addToolbarButton({
            label: 'Start',
            onInit: function (button) {
                button.disabled = textEditor.isInTransaction();
                btnStartTransaction = button;
            },
            onAction: function (button) {
                textEditor.startTransaction();
                refreshTransactionState();
            },
        });
        article.addToolbarButton({
            label: 'Close',
            onInit: function (button) {
                button.disabled = !textEditor.isInTransaction();
                btnCloseTransaction = button;
            },
            onAction: function (button) {
                textEditor.closeTransaction();
                refreshTransactionState();
            },
        });
        article.addToolbarButton({
            label: 'Cancel',
            onInit: function (button) {
                button.disabled = !textEditor.isInTransaction();
                btnCancelTransaction = button;
            },
            onAction: function (button) {
                textEditor.cancelTransaction();
                refreshTransactionState();
            },
        });
    }

    /**
     * Refreshes disabled state of start/close and cancel transaction toolbar items.
     */
    function refreshTransactionState() {
        var isInTransaction = textEditor.isInTransaction();
        btnStartTransaction.disabled = isInTransaction;
        btnCloseTransaction.disabled = !isInTransaction;
        btnCancelTransaction.disabled = !isInTransaction;
    }

    /**
     * Sample of getting text using the sdk.
     */
    function sampleGetting() {
        var texts = textEditor.getTexts();
        if (!texts || !texts.length) {
            alert('There should be some text in the article');
            return;
        }

        // concat components using separation line
        var lines = texts.join([Array(10).join('-'), '\n'].join()).split('\n');

        // limit to max 20 lines of text, to be able to show it in a message box
        if (lines.length > 20) {
            lines
                .slice(0, 10)
                .concat(Array(10).join('.'))
                .concat(lines.slice(lines.length - 10));
        }

        // add separation lines at begin and end
        lines = [Array(10).join('=')].concat(lines).concat([Array(10).join('=')]);

        // show message box
        alert(['TEXT:'].concat(lines).join('\n'));
    }

    /**
     * Sample of selecting text using the sdk.
     */
    function sampleSelecting() {
        var searchString = prompt('Search', 'text');

        // prompt canceled
        if (searchString === null) {
            return;
        }
        if (!searchString || !searchString.length) {
            alert('Cannot search for empty string.');
            return;
        }
        var texts = textEditor.getTexts();
        if (!texts || !texts.length) {
            alert('There should be some text in the article');
            return;
        }
        var pos = searchText(texts, searchString);
        if (!pos) {
            alert('Could not find string "' + searchString + '"');
            return;
        }
        if (!textEditor.selectText(pos.index, pos.startPos, pos.endPos)) {
            var err = textEditor.getErrorMessage();
            if (err) {
                alert('Could not selectText due error ' + textEditor.getErrorMessage());
            } else {
                alert('Could not selectText');
            }
        }
    }

    /**
     * Sample of replacing text using the sdk.
     */
    function sampleReplacing() {
        var replaceString = '☺☺☺';
        var searchString = prompt('Search', 'text');

        // prompt canceled
        if (searchString === null) {
            return;
        }
        if (!searchString || !searchString.length) {
            alert('Cannot search for empty string.');
            return;
        }

        var texts = textEditor.getTexts();
        if (!texts || !texts.length) {
            alert('There should be some text in the article');
            return;
        }

        var pos = searchText(texts, searchString);
        if (!pos) {
            alert('Could not find string "' + searchString + '" in text');
            return;
        }

        if (!textEditor.replaceText(pos.index, pos.startPos, pos.endPos, replaceString)) {
            var err = textEditor.getErrorMessage();
            if (err) {
                alert('Could not replaceText due error ' + textEditor.getErrorMessage());
            } else {
                alert('Could not replaceText');
            }
            // } else {
            // select what's replaced
            // textEditor.selectText(pos.index, pos.startPos, pos.startPos + replaceString.length);
        }
    }

    function sampleCanceling() {
        var replaceString = '☺☺☺';
        var searchString = prompt('Search', 'text');

        // prompt canceled
        if (searchString === null) {
            return;
        }
        if (!searchString || !searchString.length) {
            alert('Cannot search for empty string.');
            return;
        }

        // Get the texts
        var texts = textEditor.getTexts();
        if (!texts || !texts.length) {
            alert('There should be some text in the article');
            return;
        }

        var pos = searchText(texts, searchString);
        if (!pos) {
            alert('Could not find string "' + searchString + '" in text');
            return;
        }

        // Start a transaction, so we can rollback to this point
        textEditor.startTransaction();

        if (!textEditor.replaceText(pos.index, pos.startPos, pos.endPos, replaceString)) {
            var err = textEditor.getErrorMessage();
            if (err) {
                alert('Could not replaceText due error ' + textEditor.getErrorMessage());
                textEditor.cancelTransaction();
                return;
            } else {
                alert('Could not replaceText');
                textEditor.cancelTransaction();
                return;
            }
        }

        // Give the editor some time to display the changed text before cancelling the transaction
        setTimeout(function () {
            // Rollback the changes in the transaction
            textEditor.cancelTransaction();

            // Give the editor some time to roll back the changes before checking again
            setTimeout(function () {
                // Now get texts again, to check if it is the same as before the transaction
                var newTexts = textEditor.getTexts();

                // compare texts.
                if (texts.length !== newTexts.length) {
                    alert('Text changes are not canceled correctly. Different number of components.');
                    return;
                }
                for (var index = 0; index < texts.length; index++) {
                    if (texts[index] !== newTexts[index]) {
                        alert(
                            'Text changes are not canceled correctly. Component[' +
                                index +
                                '] is different from initial text.',
                        );
                        return;
                    }
                }
            }, 1000);
        }, 1000);
    }

    /****************** HELPERS *******************/

    /**
     * Searches for a particular string in an array of strings
     * @returns either the position or undefined
     */
    function searchText(texts, searchString, from) {
        if (texts && searchString && searchString.length) {
            var index = from ? from.index : 0,
                pos;

            while (texts && index < texts.length) {
                pos = texts[index].indexOf(searchString, from ? from.endPos : 0);
                if (pos >= 0) {
                    return {
                        index: index,
                        startPos: pos,
                        endPos: pos + searchString.length,
                    };
                }
                index++;
            }
        }
    }
})();

//# sourceURL=digital-editor-text-sdk-sample.js
