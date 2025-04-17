(function () {
    /**
     * Sample to use for the Studio Print Editor Text Sdk: EditorTextSdk
     */

    var transactionStartId, transactionCloseId, transactionCancelId;

    var getFunctionsLookup = {
        article: EditorTextSdk.getTexts,
        table: EditorTextSdk.getTextsInTable,
    };
    var selectFunctionsLookup = {
        article: EditorTextSdk.selectText,
        table: EditorTextSdk.selectTextInCell,
    };
    var replaceFunctionsLookup = {
        article: EditorTextSdk.replaceText,
        table: EditorTextSdk.replaceTextInCell,
    };

    createSampleMenu();
    createTransactionMenu();

    /**
     * Create sub menu with some samples of edit actions
     */
    function createSampleMenu() {
        if (EditorUiSdk.hasActions()) {
            // create separator if there are already actions added to the dropdown menu
            EditorUiSdk.createAction();
        }
        var subMenuId = EditorUiSdk.createAction({
            label: 'Text Sdk - Tests',
            icon: 'sdk/samples/woodwing.svg',
        });

        var articleSubMenuId = EditorUiSdk.createSubAction(subMenuId, {
            label: 'Article - Tests',
            icon: 'sdk/samples/woodwing.svg',
        });

        // Article Editor actions
        EditorUiSdk.createSubAction(articleSubMenuId, {
            label: 'Test getting',
            click: sampleGetting.bind(null, ['article']),
        });
        EditorUiSdk.createSubAction(articleSubMenuId, {
            label: 'Test selecting',
            click: sampleSelecting.bind(null, ['article']),
        });
        EditorUiSdk.createSubAction(articleSubMenuId, {
            label: 'Test replacing',
            click: sampleReplacing.bind(null, ['article']),
        });
        EditorUiSdk.createSubAction(articleSubMenuId, {
            label: 'Test canceling',
            click: sampleCanceling.bind(null, ['article']),
        });

        // Table Editor actions
        var tableSubMenuId = EditorUiSdk.createSubAction(subMenuId, {
            label: 'Table - Tests',
            icon: 'sdk/samples/woodwing.svg',
        });

        EditorUiSdk.createSubAction(tableSubMenuId, {
            label: 'Table - getTextsInTable',
            click: sampleGetting.bind(null, ['table']),
        });
        EditorUiSdk.createSubAction(tableSubMenuId, {
            label: 'Table - selectTextInCell',
            click: sampleSelecting.bind(null, ['table']),
        });
        EditorUiSdk.createSubAction(tableSubMenuId, {
            label: 'Table - replaceTextInCell',
            click: sampleReplacing.bind(null, ['table']),
        });
        EditorUiSdk.createSubAction(tableSubMenuId, {
            label: 'Table - canceling',
            click: sampleCanceling.bind(null, ['table']),
        });
        EditorUiSdk.createSubAction(tableSubMenuId, {
            label: 'Table - getTableGuid',
            click: sampleGetTableGuid,
        });
        EditorUiSdk.createSubAction(tableSubMenuId, {
            label: 'Table - getTableDimensions',
            click: sampleGetTableDimensions,
        });

        var textVariablesSubMenuId = EditorUiSdk.createSubAction(subMenuId, {
            label: 'Text Variables - Tests',
            icon: 'sdk/samples/woodwing.svg',
        });
        EditorUiSdk.createSubAction(textVariablesSubMenuId, {
            label: 'Get all text variables',
            click: sampleGetTextVariables,
        });
        EditorUiSdk.createSubAction(textVariablesSubMenuId, {
            label: 'Insert text variable',
            click: sampleInsertTextVariable,
        });

        EditorUiSdk.createSubAction(textVariablesSubMenuId, {
            label: 'Update value of text variable',
            click: sampleUpdateTextVariable,
        });

        EditorUiSdk.createSubAction(textVariablesSubMenuId, {
            label: 'Rename a text variable',
            click: sampleRenameTextVariable,
        });

        EditorUiSdk.createSubAction(textVariablesSubMenuId, {
            label: 'Get selected text variables',
            click: sampleGetSelectedTextVariables,
        });

        EditorUiSdk.createSubAction(textVariablesSubMenuId, {
            label: 'Change all text variable values to ☺☺☺',
            click: sampleSmileyTextVariables,
        });
    }

    /**
     * Creates a sub menu to start, close or cancel a transaction
     */
    function createTransactionMenu() {
        // Transactions are used to prevent the editor to save versions during the time a transaction is active.
        // Also transactions can be canceled, to undo all changes made from the point the transaction was started.
        // It's not possible to start multiple transactions simultaneously.

        var subMenuId = EditorUiSdk.createAction({
            label: 'Text Sdk - Transaction',
            icon: 'sdk/samples/woodwing.svg',
        });

        // Following action shows which states are available on the EditorTextSdk
        EditorUiSdk.createSubAction(subMenuId, {
            label: 'State',
            click: function () {
                var msg = [
                    'isArticleLoaded:' + EditorTextSdk.isArticleLoaded(),
                    'canEditArticle:' + EditorTextSdk.canEditArticle(),
                    'isInTransaction:' + EditorTextSdk.isInTransaction(),
                ].join('\n');
                alert(msg);
            },
        });
        // separator
        EditorUiSdk.createSubAction(subMenuId);

        transactionStartId = EditorUiSdk.createSubAction(subMenuId, {
            label: 'Start',
            click: function () {
                EditorTextSdk.startTransaction();
                refreshTransactionState();
            },
        });
        transactionCloseId = EditorUiSdk.createSubAction(subMenuId, {
            label: 'Close',
            click: function () {
                EditorTextSdk.closeTransaction();
                refreshTransactionState();
            },
        });
        transactionCancelId = EditorUiSdk.createSubAction(subMenuId, {
            label: 'Cancel',
            click: function () {
                EditorTextSdk.cancelTransaction();
                refreshTransactionState();
            },
        });
        refreshTransactionState();
    }

    /**
     * Refreshes disabled state of start/close and cancel transaction actions.
     */
    function refreshTransactionState() {
        var isInTransaction = EditorTextSdk.isInTransaction();
        EditorUiSdk.changeAction(transactionStartId, {
            disabled: isInTransaction,
        });
        EditorUiSdk.changeAction(transactionCloseId, {
            disabled: !isInTransaction,
        });
        EditorUiSdk.changeAction(transactionCancelId, {
            disabled: !isInTransaction,
        });
    }

    /**
     * Sample of getting text using the sdk.
     */
    function sampleGetting(type) {
        var texts = getFunctionsLookup[type]();
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
    function sampleSelecting(type) {
        var searchString = prompt('Search', 'text');

        // prompt canceled
        if (searchString === null) {
            return;
        }
        if (!searchString || !searchString.length) {
            alert('Cannot search for empty string.');
            return;
        }
        var texts = getFunctionsLookup[type]();
        if (!texts || !texts.length) {
            alert('There should be some text in the article');
            return;
        }
        var pos = searchText(texts, searchString);
        if (!pos) {
            return Promise.reject('Could not find string "' + searchString + '"');
        }
        if (!selectFunctionsLookup[type](pos.index, pos.startPos, pos.endPos)) {
            var err = EditorTextSdk.getErrorMessage();
            if (err) {
                return Promise.reject('Could not selectText due error ' + EditorTextSdk.getErrorMessage());
            } else {
                return Promise.reject('Could not selectText');
            }
        }
    }

    /**
     * Sample of replacing text using the sdk.
     */
    function sampleReplacing(type) {
        var replaceString = '☺☺☺';
        var searchString = prompt('Search', 'text');

        if (!searchString || !searchString.length) {
            alert('Cannot search for empty string.');
            return;
        }

        var texts = getFunctionsLookup[type]();
        if (!texts || !texts.length) {
            alert('There should be some text in the article');
            return;
        }

        var pos = searchText(texts, searchString);
        if (!pos) {
            alert('Could not find string "' + searchString + '" in text');
            return;
        }

        if (!replaceFunctionsLookup[type](pos.index, pos.startPos, pos.endPos, replaceString)) {
            var err = EditorTextSdk.getErrorMessage();
            if (err) {
                alert('Could not replaceText due error ' + EditorTextSdk.getErrorMessage());
            } else {
                alert('Could not replaceText');
            }
            // } else {
            // select what's replaced
            // EditorTextSdk.selectText(pos.index, pos.startPos, pos.startPos + replaceString.length);
        }
    }

    /**
     * Sample of canceling a transaction using the sdk which replaces text.
     */
    function sampleCanceling(type) {
        var replaceString = '☺☺☺';
        var searchString = prompt('Search', 'text');

        if (!searchString || !searchString.length) {
            alert('Cannot search for empty string.');
            return;
        }

        // Get the texts
        var texts = getFunctionsLookup[type]();
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
        EditorTextSdk.startTransaction();

        if (!replaceFunctionsLookup[type](pos.index, pos.startPos, pos.endPos, replaceString)) {
            var err = EditorTextSdk.getErrorMessage();
            if (err) {
                alert('Could not replaceText due error ' + EditorTextSdk.getErrorMessage());
                EditorTextSdk.cancelTransaction();
                return;
            } else {
                alert('Could not replaceText');
                EditorTextSdk.cancelTransaction();
                return;
            }
        }

        // Rollback the changes in the transaction
        EditorTextSdk.cancelTransaction();

        // Cancel transaction needs a bit of time to rollback changes. Therefore we setTimeout 0 to check results.
        // This gives the browser a chance to finish doing some non-JavaScript things that have been waiting to finish
        // before attending to this new piece of JavaScript.
        setTimeout(function () {
            // Now get texts again, to check if it is the same as before the transaction
            var newTexts = getFunctionsLookup[type]();

            // compare texts.
            if (texts.length != newTexts.length) {
                alert('Text changes are not canceled correctly. Different number of components.');
                return;
            }
            for (var index = 0; index < texts.length; index++) {
                if (texts[index] !== newTexts[index]) {
                    alert(
                        'Text changes are not canceled correctly. Component[' +
                            index +
                            '] is different from initial text.'
                    );
                    return;
                }
            }
        });
    }

    /**
     * Sample of getting the GUID of the currently opened table using the sdk.
     */
    function sampleGetTableGuid() {
        var guid = EditorTextSdk.getTableGuid();
        if (!guid) {
            alert('No table guid found');
            return;
        }

        alert('Table guid: ' + guid);
    }

    /******************** Tables *******************/
    /**
     * Sample of getting the dimensions of the currently opened table using the sdk.
     */
    function sampleGetTableDimensions() {
        var dimensions = EditorTextSdk.getTableDimensions();
        if (!dimensions) {
            alert('No table dimensions found');
            return;
        }

        var output = '\nNumber of rows: ' + dimensions.rows;
        output += '\nNumber of columns: ' + dimensions.columns;
        output += '\nNumber of cells: ' + dimensions.cells;

        alert('Table dimensions: ' + output);
    }

    /******************* Text Variables ******************/

    /**
     * Sample for getting text variables in artice, using the sdk.
     */
    function sampleGetTextVariables() {
        try {
            var textVariables = EditorTextSdk.getTextVariables();
            alert('Text variables: ' + JSON.stringify(textVariables, null, '    '));
        } catch (e) {
            alert(e);
        }
    }

    /**
     * Sample of inserting a text variable at the current cursor position, using the sdk.
     */
    function sampleInsertTextVariable() {
        var name = prompt('Text variable name');
        var value = prompt('Text variable value');
        try {
            EditorTextSdk.insertTextVariable(name, value);
        } catch (e) {
            alert(e);
        }
    }

    /**
     * Sample of update a text variable value, using the sdk.
     */
    function sampleUpdateTextVariable() {
        var name = prompt('Name of existing text variable');
        var value = prompt('New value of existing text variable');
        try {
            EditorTextSdk.updateTextVariable(name, value);
        } catch (e) {
            alert(e);
        }
    }

    /**
     * Sample of renaming a text variable, using the sdk.
     */
    function sampleRenameTextVariable() {
        var oldName = prompt('Old name of text variable');
        var newName = prompt('New name of text variable');
        try {
            EditorTextSdk.renameTextVariable(oldName, newName);
        } catch (e) {
            alert(e);
        }
    }
    /**
     * Sample for getting text variables within current selection, using the sdk.
     */
    function sampleGetSelectedTextVariables() {
        try {
            var textVariables = EditorTextSdk.getSelectedTextVariables();
            alert('Text variables: ' + JSON.stringify(textVariables, null, '    '));
        } catch (e) {
            alert(e);
        }
    }

    /**
     * Sample for updating all text variable values in a transaction, using the sdk.
     */
    function sampleSmileyTextVariables() {
        try {
            var textVariables = EditorTextSdk.getTextVariables();
            EditorTextSdk.startTransaction();
            textVariables.forEach(function (textVariable) {
                EditorTextSdk.updateTextVariable(textVariable.name, '☺☺☺');
            });
            EditorTextSdk.closeTransaction();
        } catch (e) {
            EditorTextSdk.cancelTransaction();
            alert(e);
        }
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
