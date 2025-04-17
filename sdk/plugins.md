# Content Station 11 plug-ins

Additional functionality can be added to Content Station 11 by loading Javascript files that have been created based on the Content Station 11 SDK.

Examples of this additional functionality can be found in the sdk/samples folder.

## Config

The plug-ins can be configured in the config file of Content Station:

    contentstation/config.js

Content Station hosts 'child applications' such as the Print editor. Each child application has its own SDK, and its plug-ins are defined separately.
Add plug-in entries to the config file as follows:

    window.csConfig = {
      plugins: {
        contentStation: [
          'sdk/samples/sample-1.js',
          'sdk/samples/sample-2.js',
          'sdk/samples/external-dependency-sample.js'
        ],
        printEditor: [
          'sdk/samples/print-editor-text-sdk-sample.js',
          'sdk/samples/print-editor-ui-sdk-sample.js'
        ],
        digitalEditor: [
          'sdk/samples/digital-editor-sdk-sample.js',
          'sdk/samples/digital-editor-sidebar-sdk-sample.js',
          'sdk/samples/digital-editor-sidebar-external-dependency-sdk-sample.js',
          'sdk/samples/digital-editor-text-sdk-sample.js'
        ],
        publicationOverview: [
          'sdk/samples/po-ui-sdk-sample.js'
        ]
      }
    };

## Managing external dependencies

Your plugin might require external dependencies like jQuery. When relying on external dependencies always ensure you manage these dependencies within the plugin itself. External dependencies included in Content Station are NOT part of the Content Station SDK. WoodWing can upgrade or completely remove dependencies without notice. As a result, plugin code should never depend on it nor any other external libraries used by Content Station.

There are two samples available that correctly shows how to manage external dependencies without conflicting with any dependencies already active in Content Station:

-   `sdk/samples/external-dependency-sample.js` shows how to use jQuery and lodash for plugins that run in context of the main Content Station application.
-   `sdk/samples/digital-editor-sidebar-external-dependency-sdk-sample.js` shows how to use jQuery and a jQuery plugin (select2) for plugins that run in an iframe.

## APIs

### ContentStationSdk

This API adds additional functionality to the file management of Content Station.

It is documented in:

-   `content-station-11-sdk.md`

Samples of usage:

-   `sdk/samples/sample-1.js`
-   `sdk/samples/sample-2.js`
-   `sdk/samples/external-dependency-sample.js`

### EditorUISdk & EditorTextSdk

These APIs add additional functionality to the Print editor.

They are documented in:

-   `print-editor-ui-sdk.md`
-   `print-editor-text-sdk.md`

Samples of usage:

-   `sdk/samples/print-editor-ui-sdk-sample.js`
-   `sdk/samples/print-editor-text-sdk-sample.js`

### DigitalEditorSdk

This API adds additional functionality to the Digital editor.

It is documented in:

-   `digital-editor-sdk.md`

Sample of usage:

-   `sdk/samples/digital-editor-sdk-sample.js`
-   `sdk/samples/digital-editor-sidebar-sdk-sample.js`
-   `sdk/samples/digital-editor-sidebar-external-dependency-sdk-sample.js`
-   `sdk/samples/digital-editor-text-sdk-sample.js`

### PoUiSdk

This API adds additional functionality to the Publication Overview.

It is documented in:

-   `po-ui-sdk.md`

Sample of usage:

-   `sdk/samples/po-ui-sdk-sample.js`
