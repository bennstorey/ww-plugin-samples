(function () {
    /**
     * Sample to use for the CS10 Publication Overview ui SDK: PoUiSdk
     */

    var asyncSubMenuId; // variable to remember action

    /**
     *  Basic menu manipulation.
     */
    createStartingSeparator();
    createNonClickableItems();
    createSimpleClickableAction();
    createActionAndChangeItWhenClicked();
    createVisibilityActionToggle();
    createSubMenu();
    createAsyncSubMenu();

    /**
     *  Content Station relay calls.
     *  Only a few examples are shown here; all Content Station SDK
     *  functionality is reachable.
     */
    createGetInfoAction();
    createShowNotificationAction();
    createOpenAndCloseDialogAction();

    /**
     * Publication Overview calls.
     */
    createGetSelectedPageMetaDataAction();
    createGetCurrentFilterSettingsAction();
    menuItemInitialChange();

    /**
     *  Creates an initial separator.
     *  By default a separator can not be the first item in the action menu list
     *  for there have to be previous actions to separate from any next.
     *  By setting the 'forceSeparator' property to 'true' a starting separator
     *  can be forcedly made.
     */
    function createStartingSeparator() {
        var id = PoUiSdk.createAction({
            //forceSeparator: true
        });

        PoUiSdk.changeAction(id, {
            forceSeparator: true,
        });
    }

    /**
     * This function demonstrates how to create static items.
     */
    function createNonClickableItems() {
        if (PoUiSdk.hasActions()) {
            // create separator if there are already actions added to the dropdown menu
            PoUiSdk.createAction(); // by not passing icon or label the item will be a separator
            // This also works for sub menus, for example: PoUiSdk.createSubAction(parentActionId);
        }

        // Create an item with only icon and label.
        // There is no click handler and no sub menu. So it's not clickable.
        // Label and icon properties are optional. It's possible to show only a label or only an icon.
        PoUiSdk.createAction({
            label: 'UI SDK - Sample',
            icon: 'sdk/samples/woodwing.svg',
        });
    }

    /**
     * This function demonstrates how to create a simple action
     */
    function createSimpleClickableAction() {
        // Create an item with icon, label and a click handler
        PoUiSdk.createAction({
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
        var id = PoUiSdk.createAction({
            label: 'Try Me!',
            icon: 'sdk/samples/woodwing.svg',
            click: function () {
                switch (mode) {
                    case 0:
                        // first step is changing the label
                        mode = 1;
                        PoUiSdk.changeAction(id, {
                            label: 'Click to disable!',
                        });
                        break;
                    case 1:
                        // second step is disabling it for 5 seconds
                        mode = 2;
                        PoUiSdk.changeAction(id, {
                            label: 'Disabled, please wait...', // it's not mandatory to change label when disabling
                            disabled: true,
                        });
                        // The action is disabled and can't be clicked anymore.
                        // It can be enabled again from code, like call in the following timeout
                        setTimeout(function () {
                            mode = 0;
                            PoUiSdk.changeAction(id, {
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
        var visId1 = PoUiSdk.createAction({
            label: 'Click to show another',
            icon: 'sdk/samples/woodwing.svg',
            click: function () {
                PoUiSdk.changeAction(visId1, {
                    visible: false,
                });
                PoUiSdk.changeAction(visId2, {
                    visible: true,
                });
            },
        });

        var visId2 = PoUiSdk.createAction({
            visible: false,
            label: 'Click to show ORIGINAL',
            click: function () {
                PoUiSdk.changeAction(visId1, {
                    visible: true,
                });
                PoUiSdk.changeAction(visId2, {
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
        var subMenuId = PoUiSdk.createAction({
            label: 'Normal Sub Menu',
        });

        // Create a sub action, by passing the parent action Id.
        PoUiSdk.createSubAction(subMenuId, {
            label: 'No action label',
        });

        // Sample of updating label with current time (by using interval)
        var intervalId;
        var counterActionId = PoUiSdk.createSubAction(subMenuId, {
            label: 'Start timer',
            click: function () {
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = false;
                    PoUiSdk.changeAction(counterActionId, {
                        label: 'Start timer',
                    });
                } else {
                    PoUiSdk.changeAction(counterActionId, {
                        label: 'Time: ' + new Date().toLocaleTimeString(),
                    });
                    intervalId = setInterval(function () {
                        PoUiSdk.changeAction(counterActionId, {
                            label: 'Time: ' + new Date().toLocaleTimeString(),
                        });
                    }, 1000);
                }
            },
        });

        // separator in sub-menu
        PoUiSdk.createSubAction(subMenuId);

        // some simple clickable actions
        PoUiSdk.createSubAction(subMenuId, {
            label: 'Label only',
            click: function () {
                alert('Only a label, no icon.');
            },
        });
        PoUiSdk.createSubAction(subMenuId, {
            label: 'Icon & Label',
            icon: 'sdk/samples/woodwing.svg',
            click: function () {
                alert('An icon and a label.');
            },
        });
        PoUiSdk.createSubAction(subMenuId, {
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
        asyncSubMenuId = PoUiSdk.createAction({
            label: 'Async. Sub Menu',
            click: onAsyncSubMenu, // when clicked, this function will be called.
        });

        // The parent can show a loading animation until the first sub action is added.
        // The loading state can be shown by:
        PoUiSdk.clearSubActions(asyncSubMenuId, true);
    }

    /**
     * Called when clicking the action[asyncSubMenuId].
     * It waits 2 seconds and then creates sub actions.
     */
    function onAsyncSubMenu() {
        // Remove this click action from main menu item
        PoUiSdk.changeAction(asyncSubMenuId, {
            click: null,
        });

        // Using timeout to simulate async action
        setTimeout(function () {
            PoUiSdk.createSubAction(asyncSubMenuId, {
                label: 'Alert Action',
                icon: 'sdk/samples/woodwing.svg',
                click: function () {
                    alert(PoUiSdk.testAction());
                },
            });
            // separator in sub-menu
            PoUiSdk.createSubAction(asyncSubMenuId);

            PoUiSdk.createSubAction(asyncSubMenuId, {
                label: 'Reset sub menu',
                icon: 'sdk/samples/woodwing.svg',
                click: function () {
                    PoUiSdk.clearSubActions(asyncSubMenuId, true); // clear and show loading animation
                    PoUiSdk.changeAction(asyncSubMenuId, {
                        click: onAsyncSubMenu,
                    });
                },
            });
        }, 2000);
    }

    /**
     *  An example of the use of the Content Station SDK
     *  to get the current session info.
     */
    function createGetInfoAction() {
        // Create a separator.
        PoUiSdk.createAction();

        PoUiSdk.createAction({
            label: 'Get Session Info',
            click: function () {
                var csInfo = ContentStationSdk.getInfo();
                alert(JSON.stringify(csInfo));
            },
        });
    }

    /**
     *  An example of the use of the Content Station SDK
     *  to show a notification to the user.
     */
    function createShowNotificationAction() {
        PoUiSdk.createAction({
            label: 'Show notification',
            click: function () {
                // Notification config object.
                var notificationConfigObj = {
                    title: 'This is a notification title',
                    content: 'This is notification content',
                    showX: true,
                    persistent: false,
                    timeout: 5000,
                    type: 'default',
                    icon: null,
                };
                // Show the notification.
                ContentStationSdk.showNotification(notificationConfigObj);
            },
        });
    }

    /**
     *  An example of the use of the Content Station SDK
     *  to open a modal dialog and close it after 5 seconds.
     */
    function createOpenAndCloseDialogAction() {
        PoUiSdk.createAction({
            label: 'Open dialog',
            click: function () {
                // Dialog config object.
                var dialogConfigObj = {
                    title: 'Dialog Title',
                    subtitle: 'Dialog subtitle',
                    content: 'Dialog content',
                    contentNoPadding: false,
                    width: 500,
                    showX: false,
                    cssClass: '',
                    buttons: [{ label: 'Button label', class: '' }],
                };
                // Open the dialog and get the ID op the dialog to close it.
                var dlgId = ContentStationSdk.openModalDialog(dialogConfigObj);
            },
        });
    }

    /**
     *  Example of how to get information about the currently selected
     *  page in the Publication Overview.
     */
    function createGetSelectedPageMetaDataAction() {
        // Create a separator.
        PoUiSdk.createAction();

        PoUiSdk.createAction({
            label: 'Get selected page metadata',
            click: function () {
                alert(JSON.stringify(PoUiSdk.currentSelectedPage()));
            },
        });
    }

    /**
     *  Example of how to get information about the currently filter
     *  setting of the Publication Overview.
     */
    function createGetCurrentFilterSettingsAction() {
        PoUiSdk.createAction({
            label: 'Get current filter setting',
            click: function () {
                alert(JSON.stringify(PoUiSdk.currentFilterSetting()));
            },
        });
    }

    /**
     *  Exmaple of how to change appearance and/or functionality of a menu item
     *  given a prerequisite before showing or opening the menu.
     */
    function menuItemInitialChange() {
        var id = PoUiSdk.createAction({
            label: 'Enabled for this Brand',
            click: function () {
                alert(JSON.stringify(PoUiSdk.currentFilterSetting()));
            },
            onOpen: function () {
                // On openening the menu item, the properties can be changed.
                PoUiSdk.changeAction(id, {
                    label:
                        PoUiSdk.currentFilterSetting().brandId === '1'
                            ? 'Disabled for this Brand (WW News)'
                            : 'Enabled for this Brand',
                    // enabled: (PoUiSdk.currentFilterSetting().brandId === '1'),
                    visible: PoUiSdk.currentFilterSetting().brandId !== '1',
                });
            },
        });
    }
})();
