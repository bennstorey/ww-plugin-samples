/**
 * A sample to add an action button in both the print- and digital-editor.
 */
(function () {
    if (typeof DigitalEditorSdk !== 'undefined') {
        // Digital Editor SDK
        DigitalEditorSdk.onOpenArticle(function (article) {
            DigitalEditorSdk.addToolbarButton({
                label: 'MyThing',
                onAction: function () {
                    doMyThing(article.getEditor());
                },
            });
        });
    }
    if (typeof EditorTextSdk !== 'undefined') {
        // Print Editor SDK
        var _myThingActionId = EditorUiSdk.createAction({
            label: 'MyThing',
            click: function () {
                doMyThing(EditorTextSdk);
            },
        });
    }

    // Sample Action
    function doMyThing(editorSdk) {
        alert('My Thing');
    }
})();

/**
 * Add menu item in Print Editor to open current session in new browser tab.
 * Simular like right mouse action in search list of Studio.
 * Handy to keep state of opened panels etc.
 */
(function () {
    EditorUiSdk.createAction({
        label: 'Open in new tab',
        click: openCurrentSessionInNewTabAction,
    });

    function openCurrentSessionInNewTabAction() {
        window.open(window.top.location.href, '_blank').focus();
    }
})();
