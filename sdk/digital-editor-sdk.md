# DigitalEditorSdk

DigitalEditorSdk can be used to extend the digital editor's functionality. The sdk provides tools to:

-   add buttons to the toolbar including custom actions. New buttons will be placed left of existing buttons in the header.
-   add buttons and accompanying panels to the sidebar.
-   create a full screen html element which can be used to show your own html.
-   retrieve the current article's metadata and content as [JSON](https://www.json.org/).
-   add callbacks to the article open and save events.
-   trigger saving of the article.
-   text manipulation operations
    -   retrieve text, select text and replace/insert text. The SDK does not work with text styles and as a result replacing text can impact styles applied on the impacted text.
    -   support for long transactions which prevents the editor from saving (multiple) versions of the article and adds the possibility to cancel/rollback multiple changes made in the transaction.

DigitalEditorSdk also exposes ContentStationSdk. Examples of all the SDK features can be found in the accompanying samples.

## Samples

Samples that show how the SDK can be used are located in:

-   `sdk/samples/digital-editor-sdk-sample.js`.
-   `sdk/samples/digital-editor-sidebar-sdk-sample.js`.
-   `sdk/samples/digital-editor-sidebar-external-dependency-sdk-sample.js`.
-   `sdk/samples/digital-editor-text-sdk-sample.js`.

## SDK API Description

### Interface `DigitalEditorSdk`

Main entry point for the SDK.

```javascript
{
    // ** DEPRECATED since 11.122, will be removed after 1 September 2023. Use SDKArticle.addToolbarButton instead. **
    // Adds a button to the top toolbar
    addToolbarButton(options: SdkToolbarButton): void;

    // ** DEPRECATED since 11.122, will be removed after 1 September 2023.  Use SDKArticle.addSidebarPanel instead. **
    // Adds a panel and button to the sidebar
    addSidebarPanel(options: SdkSidebarPanel): void;

    // ** DEPRECATED since 11.122, will be removed after 1 September 2023.  Use SDKArticle.createFullscreenDialog instead. **
    // Creates and displays a dialog overlay
    createFullscreenDialog(): SdkFullscreenDialog;

    // Registers a callback which will be called when an article has been opened
    onOpenArticle: (callback: (article: SDKArticle) => void) => void;

    // Registers a callback which will be called when an article is published
    onPublish: (callback: (channel: SdkChannel, articleIds: string[]) => Promise<boolean> | boolean) => void
}
```

#### `DigitalEditorSdk.addToolbarButton(options)`

** DEPRECATED since 11.122, will be removed after 1 September 2023. Use SDKArticle.addToolbarButton instead. **

Adds a button to the top toolbar left of the existing buttons.

-   param _options_ `SdkToolbarButton` — The button's properties

#### `DigitalEditorSdk.addSidebarPanel(options)`

** DEPRECATED since 11.122, will be removed after 1 September 2023. Use SDKArticle.addSidebarPanel instead. **

Adds a button below the last button in the sidebar and upon selection creates and shows a panel containing an iframe element. The options object contains lifecycle methods that allow the caller access to the iframe's window object and the ability to create content in it.

-   param _options_ `SdkSidebarPanel` — The panel and button's properties

The function returns the created SdkSidebarPanel which can be updated at any point.

#### `DigitalEditorSdk.createFullscreenDialog()`

** DEPRECATED since 11.122, will be removed after 1 September 2023. Use SDKArticle.createFullscreenDialog instead. **

Creates and displays a dialog overlay with an iframe element that covers the entire editor. It returns an object which provides access to the [Window](https://developer.mozilla.org/en-US/docs/Web/API/Window) object of the created iframe and contains functions to destroy the overlay and to check if the overlay still exists.

-   returns `SdkFullscreenDialog` — The dialog

#### `DigitalEditorSdk.onOpenArticle(callback)`

Registers a callback which will be called when an article has been opened.

-   param _callback_ — Callback function with prototype `(article: SDKArticle) => void`

#### `DigitalEditorSdk.onPublish(callback)`

Registers a callback which will be called when articles are being published.

-   param _callback_ — Callback function with prototype `(channel: Channel, articleIds: string[]) => boolean|Promise<boolean>`

The channel argument contains the following properties:

-   `id: string` - channel identifier
-   `version: number` - version number of channel definition
-   `type: string` - type of channel
-   `properties: any` - object with channel specific properties. Content differs per channel type. Most channel types have a name property.

The callback should return a `boolean` value or a `Promise<boolean>`.

-   Returning a `true` will _continue_ the publishing and `false` will _cancel_ it.
    The cancel is silent, there is no notification. It's preferable the plugin script calls `ContentStationSdk.showNotification()` to explain why the publish is canceled.
-   Return a Promise to hold publishing until an async script is done.

    ```javascript
    return new Promise(function (resolve, reject) {
        resolve(true);
    });
    ```

Resolving with a `true` will _continue_ the publishing and a `false` will _cancel_ it.
Rejecting the promise, will cancel the publishing and show the error in a critical notification. For example:

```javascript
reject(new Error('Oops'));
```

In case of multiple registered callbacks, the publishing waits until all returned promises are resolved. When one of the callbacks returns `false` or resolves with `false`, the publish is canceled without a notification. When one of the callbacks rejects the publish is aborted with an error notification.

### Interface `SdkToolbarButton`

The toolbar button's options, all properties are optional.

```javascript
{
    // Button's label
    label?: string;

    // Button's disabled state
    disabled?: boolean;

    // Button's hidden state
    hidden?: boolean;

    // Button's order state. A higher number shows the button later in the list. Defaults to 0.
    order?: number;

    // A callback which is triggered on initialization of the button's html element
    onInit?: (config: SdkToolbarButton) => any;

    // A callback which is triggered when pressing the button
    onAction?: (config: SdkToolbarButton) => any;

    // Additional items that can be used in the callbacks
    [key: string]: any;
}
```

### Interface `SdkSidebarPanel`

The sidebar panel options, all properties are optional.

```javascript
{
    // A lifecycle method which is triggered on initialization of the panel. Use it to build the
    // the panel's content or to set the location of the iframe's window
    onInit?: (panel: SdkSidebarPanel) => void;

    // A lifecycle method called right before the panel and its iframe are destroyed.
    // The panel will be destroyed when the user switches to a different panel.
    onDestroy?: (panel: SdkSidebarPanel) => void;

     // Points to the window of the iframe in the panel. The property is valid between
     // calls to onInit and onDestroy.
    window: Window

    // The button in the sidebar to activate the panel. Its properties can also be updated
    // when the panel itself is not visible.
    button: {
        // Tooltip shown when hovering the sidebar button
        tooltip?: string;

        // Sidebar button overlay. Can be used to attract the user's attention
        badge?: string;

        // Indicate to the sidebar that the button and panel should be not be shown.
        hide?: boolean;

        // Paths to SVG icons that should be used for the sidebar button.
        icon?: {
            normal: string;
            activated: string;
        }
    }

    // Additional items that can be used in the callbacks
    [key: string]: any;
}
```

### Interface `SdkFullscreenDialog`

The fullscreen dialog object.

```javascript
{
    // Returns a Window object (https://developer.mozilla.org/en-US/docs/Web/API/Window)
    getWindow: () => Window;

    // Destroys the dialog overlay
    destroy: () => void;

    // Checks whether the dialog overlay still exists
    isPresent: () => boolean;
}
```

### Interface `SDKArticle`

Represents an opened article.

```javascript
{
    // Adds a button to the top toolbar
    addToolbarButton(options: SdkToolbarButton): void;

    // Adds a panel and button to the sidebar
    addSidebarPanel(options: SdkSidebarPanel): void;

    // Creates and displays a dialog overlay
    createFullscreenDialog(): SdkFullscreenDialog;

    // Registers an onSave callback. The callback is called each time an article has been saved
    onSave: (callback: () => void) => void;

    // Checks the server for the latest metadata of the article and returns it
    checkMetadata: () => Promise<EnterpriseObject>;

    // Return article's content. The SDK implementation will call the callback and
    // pass JSON data to it when data is ready.
    getJson: (callback: (json) => void ) => void;

    // Triggers article saving and calls callback after saving. In case the saving fails
    // the error will be passed to the callback, otherwise null will be passed.
    // With the optional unlock argument the article can be directly unlocked in this call.
    // The article will not be unlocked when server feature ContentStationDigitalEditorLockWhenOpen is enabled.
    // (See ContentStation ManagementConsole on Enterprise Server: Keep the article checked-out as long as it is opened)
    //
    // This function can also be used when the article is already saved and needs to be unlocked.
    // Using the unlock option, the callback will be called after the article is unlocked.
    save: (callback: (error|null) => void, unlock?: boolean ) => void;

    // Returns the interface for text editor actions.
    getEditor: () => SDKTextEditor;

    // Set the article in editor readonly, saves and unlocks the current article changes
    // and calls callback when previous is all done.
    // When the save or unlock fails, an error message is passed as argument to the callback.
    // When callback returns a true value, the article editor is closed and
    // browser navigated back to ContentStation. On the moment the editor is closed,
    // all digital editor plugin scripts are stopped.
    // When callback does not return a true value, the editor will not close. Article
    // still is in readonly mode and plugin script stays running.
    // Callback can do it's own navigation, for example:
    //   window.top.location.href = 'http://www.my-url.com/contentstation';
    close: (callback: (error|null) => boolean) => void;
}
```

### Interface `EnterpriseObject`

Enterprise metadata object. See the [Enterprise Server Workflow interface](../../sdk/doc/interfaces/Workflow.htm#Object) for a full description.

```javascript
{
    MetaData: {
        BasicMetaData: BasicMetaData;
        ContentMetaData: ContentMetaData;
        ExtraMetaData: ExtraMetaData[];
        RightsMetaData: RightsMetaData;
        SourceMetaData: SourceMetaData;
        WorkflowMetaData: WorkflowMetaData;
    }
}
```

### Interface `SDKTextEditor`

```javascript
{
    // Indicates whether an article has been loaded in the editor
    isArticleLoaded() => boolean;

    // Indicates whether an article can be edited/changed
    canEditArticle() => boolean;

    // Get the article texts per article text field.
    getTexts: () => string[];

    // Indicates if there is currently text selected in the editor.
    isTextSelected: () => boolean;

    // Selects a component and puts the focus in one of its editable fields.
    focusComponent: ({
        componentId: string;
        field: string;
    }) => boolean;

    // Select text in the editor. If `startPos` equals `endPos`, only the cursor is positioned.
    selectText: (textFieldIndex: number, startPos: number, endPos: number) => boolean;

    // Replace text in given selection with replacement string.
    // If `startPos` equals `endPos`, text will be inserted.
    replaceText: (textFieldIndex: number, startPos: number, endPos: number, replacement: string) => boolean;

    // Indicates whether a transaction has been started
    isInTransaction() => boolean;

    // Start a transaction pausing the lock/unlock/save processes
    startTransaction() => boolean;

    // Finalize a transaction. Normal lock/unlock/save operations will resume.
    closeTransaction() => boolean;

    // Cancel a transaction. The text in the editor will be rolled back to before the transaction was started.
    cancelTransaction() => boolean;

    // Returns the last error message, or null in case there hasn't been an error yet.
    getErrorMessage: () => string;
}
```

#### `SDKTextEditor.getTexts()`

Get the article texts per article text field.
Will be successful when `isArticleLoaded` equals `true`

-   returns `string[]`

#### `SDKTextEditor.isTextSelected()`

Indicates if there is currently text selected in the editor.
Will be successful when `isArticleLoaded` equals `true`

-   returns `boolean`

#### `SDKTextEditor.focusComponent()`

`focusComponent` selects the component and puts the cursor in the requested (editable) field. If not provided the cursor will be put in the first editable field. In case the component does not contain any editable fields, the component is just selected and scrolled into view.

-   params object
    -   _componentId_ `string` - id of the component to select and focus.
    -   _field_ `string` - key of the field within the component that needs to receive the focus.
-   returns `Promise<boolean>`

#### `SDKTextEditor.selectText()`

Select text in the editor. If `startPos` equals `endPos`, only the cursor is positioned.
Will be successful when `isArticleLoaded` equals `true`

-   param _textFieldIndex_ `number` — index of the text field to select in
-   param _startPos_ `number` — character position in the text.
-   param _endPos_ `number` — character position in the text.
-   returns `boolean` — `true` when the editor could select the text

#### `SDKTextEditor.replaceText()`

Replace text in given selection with replacement string. If `startPos` equals `endPos`, text will be inserted.
Will be successful when `canEditArticle` equals `true`

-   param _textFieldIndex_ `number` — index of the text field to select in
-   param _startPos_ `number` — character position in the text.
-   param _endPos_ `number` — character position in the text.
-   param _replacement_ `string` — the replacement or insertion text
-   returns `boolean` — `true` when the editor could replace or insert the text

#### `SDKTextEditor.getErrorMessage()`

Error message occurred during last action on the service. When the last sdk call was successful this will return `null`.

-   returns `string`

#### `SDKTextEditor.isArticleLoaded()`

Indicates if an article is loaded in the editor.

-   returns `boolean`

#### `SDKTextEditor.canEditArticle()`

Indicates whether article can be the edited/changed. This depends on whether:

1. the article is loaded in the editor
2. the article is not locked by someone else
3. the editor is not in readonly mode

-   returns `boolean`

#### `SDKTextEditor.isInTransaction()`

Indicates if a transaction is started.

-   returns `boolean`

#### `SDKTextEditor.startTransaction()`

Start a transaction. This is only possible when not already in a transaction and `canEditArticle` is truthy.
The editor's state machine is paused by this, which results in disabling automatics saves and refreshes while the transaction lasts.
When failing, `false` is returned. The reason for this failure can be retrieved with `getErrorMessage`.

-   returns `boolean`

#### `SDKTextEditor.closeTransaction()`

Close a transaction. Detects changes made during the transaction and marks the article as changed.
Editor's state machine will be resumed after this.
When failing, `false` is returned. The reason for this failure can be retrieved with `getErrorMessage`.

-   returns `boolean`

#### `SDKTextEditor.cancelTransaction()`

Cancel a transaction. Will rollback changes made during transaction and resumes the editor's state machine.
When failing, `false` is returned. The reason for this failure can be retrieved with `getErrorMessage`.

-   returns `boolean`
