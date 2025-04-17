# EditorUiSdk

EditorUiSdk can be used in external plugin javascript files to add actions to the editor's user interface.
These actions will appear in a drop-down menu at the top right of the editor (triple dot button).
It's also possible to create sub-menu's by adding sub-actions to another action.

Actions and sub-actions can have an icon (path to image file) and/or a label. If none of both provided,
the action will show as a separator line. Icons and labels can be changed after creation.
There is also a disabled state, which can be changed. Providing a callback function to the click event,
will bind external defined actions when menu item is clicked.

## Sample

Have a look in file `sdk/samples/print-editor-ui-sdk-sample.js` how this sdk can be used.

## SDK API Description

### `EditorUiSdk.hasActions()`

Indicates if there are actions added

-   returns `boolean`

### `EditorUiSdk.createAction(props)`

Create and add a new action to show in actions drop-down menu

-   param _props_ `ISdkUiActionProps` — Object containing properties (See interface `ISdkUiActionProps`)
-   returns `string` The action id, used as reference when changing or creating sub actions.

### `EditorUiSdk.createSubAction(parentActionId, props)`

-   param _parentActionId_ `string` — The action id of the sub menu parent
-   param _props_ `ISdkUiActionProps` — Object containing properties (See interface `ISdkUiActionProps`)
-   returns `string` The action id, used as reference when changing.

### `EditorUiSdk.clearSubActions(parentActionId, showLoading)`

Clear/remove actions in the sub menu of action identified by parentActionId
Optional argument showLoading adds the possibility to show a loading state with an animation until a new sub menu action is added.

-   param _parentActionId_ `string` — The action id of the sub menu parent
-   param _showLoading_ `boolean` — Optional argument to indicate a loading animation needs to be shown until the sub action is added.

### `EditorUiSdk.changeAction(actionId, props)`

Change one or more properties of an action or sub-action.

-   param _actionId_ `string` — Identifies the action to change the properties of
-   param _props_ `ISdkUiActionProps` — The properties to change (See interface `ISdkUiActionProps`)

### `EditorUiSdk.close(callback)`

Closes the editor and goes back to content station.

-   param _callback_ `function` — An optional callback function parameter which is called when the closing finishes. It passes _null_ if it has been closed successfully and an error string in case of failing.

### Interface `ISdkUiActionProps`

Interface defining properties on action menu items. All of these properties are optional.

    {
      // To set or change an icon displayed in the user interface.
      // It's a string containing a path to an image file (.ico, .jpg, .png, .gif, .svg).
      // Icons will be shown in a 16x16 pixel box.
      icon?: string;
      // To set or change the label displayed in the user interface.
      label?: string;
      // To set or change the disabled state in the user interface.
      disabled?: boolean;
      // To handle or change a click event in the user interface.
      click?: (event: EventTarget) => void;
    }
