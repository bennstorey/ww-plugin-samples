(function () {
    /**
     * Sample to use for the CS10 editor ui SDK: EditorUiSdk
     */

    var asyncSubMenuId; // variable to remember action

    createNonClickableItems();
    createSimpleClickableAction();
    createActionAndChangeItWhenClicked();
    createVisibilityActionToggle();
    createSubMenu();
    createAsyncSubMenu();
    createCloseEditorAction();

    /**
     * This function demonstrates how to create static items.
     */
    function createNonClickableItems() {
        if (EditorUiSdk.hasActions()) {
            // create separator if there are already actions added to the dropdown menu
            EditorUiSdk.createAction(); // by not passing icon or label the item will be a separator
            // This also works for sub menus, for example: EditorUiSdk.createSubAction(parentActionId);
        }

        // Create an item with only icon and label.
        // There is no click handler and no sub menu. So it's not clickable.
        // Label and icon properties are optional. It's possible to show only a label or only an icon.
        EditorUiSdk.createAction({
            label: 'UI SDK - Sample',
            icon: 'sdk/samples/woodwing.svg',
        });
    }

    /**
     * This function demonstrates how to create a simple action
     */
    function createSimpleClickableAction() {
        // Create an item with icon, label and a click handler
        EditorUiSdk.createAction({
            label: 'Click Me!',
            icon: 'sdk/samples/woodwing.svg',
            click: function () {
                // When the action is clicked, this function is called.
                alert('Hello');
            },
        });
    }

    function createActionAndChangeItWhenClicked() {
        var mode = 0;
        var id = EditorUiSdk.createAction({
            label: 'Try Me!',
            icon: 'sdk/samples/woodwing.svg',
            click: function () {
                switch (mode) {
                    case 0:
                        // first step is changing the label
                        mode = 1;
                        EditorUiSdk.changeAction(id, {
                            label: 'Click to disable!',
                        });
                        break;
                    case 1:
                        // second step is disabling it for 5 seconds
                        mode = 2;
                        EditorUiSdk.changeAction(id, {
                            label: 'Disabled, please wait...', // it's not mandatory to change label when disabling
                            disabled: true,
                        });
                        // The action is disabled and can't be clicked anymore.
                        // It can be enabled again from code, like call in the following timeout
                        setTimeout(function () {
                            mode = 0;
                            EditorUiSdk.changeAction(id, {
                                label: 'Try Again!',
                                disabled: false,
                            });
                        }, 5000); // 5 seconds timeout
                        break;
                }
            },
        });
    }
    function createVisibilityActionToggle() {
        var visId1 = EditorUiSdk.createAction({
            label: 'Click to show another',
            icon: 'sdk/samples/woodwing.svg',
            click: function () {
                EditorUiSdk.changeAction(visId1, {
                    visible: false,
                });
                EditorUiSdk.changeAction(visId2, {
                    visible: true,
                });
            },
        });

        var visId2 = EditorUiSdk.createAction({
            visible: false,
            label: 'Click to show ORIGINAL',
            click: function () {
                EditorUiSdk.changeAction(visId1, {
                    visible: true,
                });
                EditorUiSdk.changeAction(visId2, {
                    visible: false,
                });
            },
        });
    }

    /**
     * Create a sub menu with actions.
     */
    function createSubMenu() {
        // Create the main action to put the sub menu on. Get this actionId to add sub items to.
        var subMenuId = EditorUiSdk.createAction({
            label: 'Normal Sub Menu',
        });

        // Create a sub action, by passing the parent action Id.
        EditorUiSdk.createSubAction(subMenuId, {
            label: 'No action label',
        });

        // Sample of updating label with current time (by using interval)
        var intervalId;
        var counterActionId = EditorUiSdk.createSubAction(subMenuId, {
            label: 'Start timer',
            click: function () {
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = false;
                    EditorUiSdk.changeAction(counterActionId, {
                        label: 'Start timer',
                    });
                } else {
                    EditorUiSdk.changeAction(counterActionId, {
                        label: 'Time: ' + new Date().toLocaleTimeString(),
                    });
                    intervalId = setInterval(function () {
                        EditorUiSdk.changeAction(counterActionId, {
                            label: 'Time: ' + new Date().toLocaleTimeString(),
                        });
                    }, 1000);
                }
            },
        });

        // separator in sub-menu
        EditorUiSdk.createSubAction(subMenuId);

        // some simple clickable actions
        EditorUiSdk.createSubAction(subMenuId, {
            label: 'Label only',
            click: function () {
                alert('Only a label, no icon.');
            },
        });
        EditorUiSdk.createSubAction(subMenuId, {
            label: 'Icon & Label',
            icon: 'sdk/samples/woodwing.svg',
            click: function () {
                alert('An icon and a label.');
            },
        });
        EditorUiSdk.createSubAction(subMenuId, {
            icon: 'sdk/samples/woodwing.svg',
            click: function () {
                alert('Only an icon, no label.');
            },
        });
    }

    /**
     * Create an action with creating a sub menu asynchronous.
     * This can be handy to delay loading extra files or data until it's actual needed.
     */
    function createAsyncSubMenu() {
        // Create the main action to put the sub menu on. Get this actionId to add sub items to.
        asyncSubMenuId = EditorUiSdk.createAction({
            label: 'Async. Sub Menu',
            click: onAsyncSubMenu, // when clicked, this function will be called.
        });

        // The parent can show a loading animation until the first sub action is added.
        // The loading state can be shown by:
        EditorUiSdk.clearSubActions(asyncSubMenuId, true);
    }

    /**
     * Called when clicking the action[asyncSubMenuId].
     * It waits 2 seconds and then creates sub actions.
     */
    function onAsyncSubMenu() {
        // Remove this click action from main menu item
        EditorUiSdk.changeAction(asyncSubMenuId, {
            click: null,
        });

        // Using timeout to simulate async action
        setTimeout(function () {
            EditorUiSdk.createSubAction(asyncSubMenuId, {
                label: 'Alert Action',
                icon: 'sdk/samples/woodwing.svg',
                click: function () {
                    alert('Hello');
                },
            });
            // separator in sub-menu
            EditorUiSdk.createSubAction(asyncSubMenuId);

            EditorUiSdk.createSubAction(asyncSubMenuId, {
                label: 'Reset sub menu',
                icon: 'sdk/samples/woodwing.svg',
                click: function () {
                    EditorUiSdk.clearSubActions(asyncSubMenuId, true); // clear and show loading animation
                    EditorUiSdk.changeAction(asyncSubMenuId, {
                        click: onAsyncSubMenu,
                    });
                },
            });
        }, 2000);
    }

    /**
     * This function demonstrates how to create a close editor action
     */
    function createCloseEditorAction() {
        // Create an item with icon, label and a click handler
        EditorUiSdk.createAction({
            label: 'Close',
            icon: 'sdk/samples/woodwing.svg',
            click: function () {
                // When the action is clicked, this function is called.
                EditorUiSdk.close(function (error) {
                    if (!error) {
                        console.log('It was closed successfully');
                        return;
                    }
                    console.error('There was an error on editor closing:', error);
                });
            },
        });
    }
})();
