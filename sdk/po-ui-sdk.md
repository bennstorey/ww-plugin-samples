# PoUiSdk

PoUiSdk can be used in external plugin javascript files to add actions to the Publication Overview's user interface.
These actions will appear in a drop-down menu at the top right of the Publication Overview (triple dot button).
It's also possible to create sub-menu's by adding sub-actions to another action and to use Content Station SDK functionality.

Actions and sub-actions can have an icon (path to image file) and/or a label. If none of both provided,
the action will show as a separator line. Icons and labels can be changed after creation.
There is also a disabled state, which can be changed. Providing a callback function to the click event,
will bind external defined actions when menu item is clicked.

## Samples

Samples that show how the SDK can be used are provided in the 'sdk/samples' folder.

-   `sdk/samples/po-ui-sdk-sample.js` how this sdk can be used.
-   This [script](https://github.com/WoodWing/CSHTML-PublicationOverviewMenuActions) will help to convert old-style (CS9 and older) ContentStation `<PublicationOverviewActions>` to CS11 Publication-Overview actions.

## SDK API Description

### `PoUiSdk.hasActions()`

Indicates if there are actions added

-   returns `boolean`

### `PoUiSdk.createAction(props)`

Create and add a new action to show in actions drop-down menu

-   param _props_ `ISdkUiActionProps` Object containing properties (See interface `ISdkUiActionProps`)
-   returns `string` The action id, used as reference when changing or creating sub actions.

### `PoUiSdk.createSubAction(parentActionId, props)`

-   param _parentActionId_ `string` The action id of the sub menu parent
-   param _props_ `ISdkUiActionProps` Object containing properties (See interface `ISdkUiActionProps`)
-   returns `string` The action id, used as reference when changing.

### `PoUiSdk.clearSubActions(parentActionId, showLoading)`

Clear/remove actions in the sub menu of action identified by parentActionId
Optional argument showLoading adds the possibility to show a loading state with an animation until
a new sub menu action is added.

-   param _parentActionId_ `string` The action id of the sub menu parent
-   param _showLoading_ `boolean` Optional argument to indicate a loading animation needs to be shown until the sub action is added.

### `PoUiSdk.changeAction(actionId, props)`

Change one or more properties of an action or sub-action.

-   param _actionId_ `string` Identifies the action to change the properties of
-   param _props_ `ISdkUiActionProps` The properties to change (See interface `ISdkUiActionProps`)

### Interface `ISdkUiActionProps`

Interface defining properties on action menu items. All of these properties are optional.

    {
        // To set or change an icon displayed in the user interface.
        // It's a string to an image file (.ico, .jpg, .png, .gif, .svg)
        // Icons will be shown in a 16x16 pixel box.
        icon?: string;
        // To set or change the label displayed in the user interface
        label?: string;
        // To set or change the disabled state in the user interface
        disabled?: boolean;
        // To set or change the visibility state in the user interface
        visible?: boolean;
        // By setting the 'forceSeparator' property to 'true'
        // a starting separator can forcedly be made.
        forceSeparator?: boolean;
        // To handle or change a click event in the user interface
        click?: (event: EventTarget) => void;
        // The callback function invoked when, if specified, the menu item is opened in the menu.
        onOpen?: () => void;
        // An symbol/icon in front of action menu entry
        symbol?: SdkUiActionSymbol;
    }

### `PoUiSdk.currentSelectedPage()`

Get information about the currently selected page in the Publication Overview.
NOTE: This function exposes the IPage interface. Be carefull when changing the IPage interface for it might break the customers scripts.

-   Returns `Page meta data | null`.

### `PoUiSdk.currentFilterSetting()`

Get information about the currently filter setting of the Publication Overview.
NOTE: This function exposes the IPOFilterSetting interface. Be carefull when changing the IPOFilterSetting interface for it might break the customers scripts.

-   Returns `Object<IPOFilterSetting>`.

          {
              brandId: string;    // The ID of the currently selected Brand.
              categoryId: string; // The ID of the currently selected Category.
              issueId: string;    // The ID of the currently selected Issue.
              editionId: string;  // The ID of the currently selected Edition.
              stateId: string;    // The ID of the currently selected Status.
          }

### ContentStationSdk support

The PoUiSdk API also exposes the ContentStationSdk API. This API adds additional functionality to the file management of Content Station which is useable in Publication Overview plugins.

The ContentStationSdk is documented in:

-   `content-station-10-sdk.md`
