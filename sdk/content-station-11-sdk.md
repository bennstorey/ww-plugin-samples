# Content Station 11 SDK

The Content Station 11 SDK can be used for creating Javascript plug-ins that add custom functionality to Content Station.
This functionality is accessible through:

-   The context menu of a file that is viewed in the search results. Submenus can be created by adding subactions to another action.
-   Custom applications that are accessed from the Applications menu and that are run in a regular Content Station 11 page

The Content Station 11 SDK also gives general information about the current session, hooks into the notifications and modal dialog
systems, and provides useful util methods such as downloading.

## Samples

Samples that show how the SDK can be used are provided in the 'sdk/samples' folder.

-   sample-1.js contains a collection of different and quick SDK usages.
-   sample-2.js is an example of a more robust usage, and can be seen as a general guide for how to write the plug-in; one IIFE per action definition.
-   external-dependency-sample.js shows how to use external dependencies like jquery and lodash ensuring there are no conflicts with dependencies used by the main CS application.
-   This [script](https://github.com/WoodWing/CSHTML-context-menu-actions) will help to convert old-style (CS9 and older) ContentStation ObjectContextMenuActions to CS11 ContextActions.

## Custom Actions API

All created custom actions are added to the context menu of a file that is viewed in the search results.
Actions are added to the bottom of the menu, below the standard actions.

Custom actions are defined by the 'createAction()' method which accepts the `Object<ActionConfig>` config object.
Every action can have a submenu: an array of the same `Object<ActionConfig>` objects.

Note that actions that have submenus should not have the 'onAction' property defined.
When both 'onAction' and 'submenu' are defined, the complete 'submenu' will be ignored.

The action can be changed with 'changeAction(actionId, config)' (changes are also available in init phase),
or removed with 'removeAction(actionId)'.

### ContentStationSdk.createAction(config)

Creates an action in the context menu of a file viewed in search results.

-   returns `String` - action id
-   param _config_ `Object<ActionConfig>` - All properties are optional - for missing properties the defaults will be applied.

          {
              // {Boolean} Is context menu action a horizontal line
              // If true, other properties will be ignored except 'onInit'
              isLine?: false,
              // {Boolean} Is context menu action disabled
              isDisabled?: false,
              // {Boolean} Is context menu action removed, invisible
              isRemoved?: false,
              // {String} Title
              title?: 'Context menu item',
              // {Array<ActionConfig>} Array of submenu items
              submenu?: null,
              // {Function} Handler that is called before the context menu is generated
              // * Read more below
              onInit?: null,
              // {Function} Handler that is called when context menu action is clicked/tapped
              // * Read more below
              onAction?: null
          }

#### Function `Object<ActionConfig>.onInit(config, selection, dossier)`

Handler that is called before the context menu is generated and after the selection is performed and the context menu is triggered.
Three parameters are available: 'config', 'selection' and 'dossier'.

This makes it possible to update the 'config' object based on the information from 'selection' and 'dossier'.
Note that the original 'config' object is passed to every 'onInit', meaning that changes are not shared between init phases.

Parameters:

-   param _config_ `Object<ActionConfig>` --- The same 'config' object passed to 'createAction()'
-   param _selection_ `Array<MetaDataFlat>` - Array of selected objects in search results.
    Available in flattened structure of metaData: all properties are in the root.
-   param _dossier_ `Object<MetaDataFlat>` - Dossier object, available when the context menu is triggered within a Dossier.

Examples:

-   _"Action should be enabled only in single-selection (disabled in multi-selection)."_

          ContentStationSdk.createAction({
              title: 'Custom Action',
              onInit: function(config, selection, dossier){
                  config.isDisabled = selection.length > 1;
              }
          });

-   _"Action should be enabled only in single-selection and only for objects of type 'Image'."_

          ContentStationSdk.createAction({
              title: 'Custom Action',
              onInit: function(config, selection, dossier){
                  config.isDisabled = selection.length > 1 || selection[0].Type !== 'Image';
              }
          });

-   _"Action should be visible only in a Dossier, and removed from normal search results."_

          ContentStationSdk.createAction({
              title: 'Custom Action in Dossier',
              onInit: function(config, selection, dossier){
                  config.isRemoved = typeof dossier === 'undefined';
              }
          });

##### Function `Object<ActionConfig>.onAction(selection, dossier, config)`

Handler that is called when the context menu action is clicked.
Three parameters are available: 'selection', 'dossier' and 'config', the same as for the `Object<ActionConfig>.onInit()` handler,
only in different order.

Examples:

-   We can update the second example from above - "_Action should be visible only in a Dossier, and on click it should notify 'Hello from <Dossier_Name>'._"

          ContentStationSdk.createAction({
              title: 'Custom Action in Dossier',
              onInit: function(config, selection, dossier){
                  config.isRemoved = typeof dossier === 'undefined';
              },
              onAction: function(selection, dossier, config){
                  ContentStationSdk.showNotification({
                      content: 'Hello from ' + dossier.Name
                  });
              }
          });

### ContentStationSdk.changeAction(actionId, newConfig)

Changes the action configuration. Parameter 'newConfig' does not have to be the complete `Object<ActionConfig>`
object: it can have only some properties populated, and others will be used from the previous 'config' object.

Note that 'changeAction()' will permanently change the original 'config'.

-   param _actionId_ `String` - id of an action to be changed
-   param _newConfig_ `Object<ActionConfig>` - new config object

### ContentStationSdk.removeAction(actionId)

Removes the action.

-   param _actionId_ `String` - id of an action to be removed

## Custom Applications API

Custom Applications run in a regular Content Station 11 page and are accessed from the Applications menu. They are added to the menu below all applications defined in the `config.js` file.

Custom Applications are allowed to change states through the use of parameters. Developers are advised **not** to change the URL directly but instead use
the methods provided in the SDK to hook into the state change system of Content Station 11.

Custom Applications that intend to work with state changes should be implemented in a way where all state changes are
requested with `SDK.changeCustomAppState(params)` and the application's UI is changed when the `onAppStateChanged(params)` callback is called.
For more information, see examples in `sample-2.js`.

### ContentStationSdk.registerCustomApp(config)

Registers a Custom Application defined with the 'config' object.

-   param _config_ `Object<CustomAppConfig>`

          {
              name: String                   // A unique name of the Custom Application
              title?: String                 // The name of the Custom Application as shown in Apps menu and at the top of the page
              icon?: String                  // The name of the icon for the Custom Application, as added in the ~/assets/third-party-icons/ folder
              iconUrl?: String               // The path to the icon file.
              content?: String|jQueryObject  // The content that will be shown in the container of the Custom Application
              onInit?: Function              // * see below for more information
              onAppStateChanged?: Function   // * see below for more information
              buttons?: Array                // * see below for more information
          }

#### Function `Object<CustomAppConfig>.onInit()`

(Optional parameter) A function that will be called on app initialization, immediately after the content is injected in the DOM.

#### Function `Object<CustomAppConfig>.onAppStateChanged(params)`

(Optional parameter) A function that will be called on every parameter change in the URL of the Web browser when this Custom Application is active.
It will be called once, immediately after `onInit()` to ensure that the Custom Application can adjust itself according to the parameters.

-   param _params_ `Object` - literal with all available parameters

##### Function `Object<CustomAppConfig>.buttons<Array<CustomAppButtonConfig>>`

(Optional parameter) An array of buttons that will be added to the top bar.

    [
        {
            label: String       // The label for the button
            type?: String       // Predefined buttons. Choose from: 'default', 'secondary' and 'label'
            style?: Object      // Custom css
            callback: Function  // The function that will be called when the button is clicked
        },
        // ...
    ]

### ContentStationSdk.changeCustomAppState(params)

Changes the state parameters of the active Custom Application.

-   param _params_ `Object` - literal with parameters to change the app state to

## Utils API

### ContentStationSdk.getInfo()

Returns all available information about the current session.

-   returns `Object<Info>`

          {
              CurrentUser: Object     // Information about the signed-in user
              FeatureProfiles: Array  // Access Rights (@deprecated It will be removed from the object)
              Membership: Array       // Groups that the signed-in user belongs to (@deprecated It will be removed from the object)
              ServerInfo: Object      // Information about the server
              UserGroups: Array       // All user groups (@deprecated It will be removed from the object)
              Users: Array            // All users (@deprecated It will be removed from the object)
          }

### ContentStationSdk.showNotification(config)

Shows a notification in the bottom left corner of Content Station.

-   param _config_ `Object<NotificationConfig>` - all properties are optional with the exception of the 'content' property. When properties are missing, their default values will be applied.

          {
              // {String} Notification title
              // If omitted, the title and an empty line below it will be removed
              title?: '',
              // {String/HTML | jQuery element} Notification content
              content: '',
              // {Boolean} Show X (close button) on the right side
              showX?: true,
              // {Boolean} If notification is persistent (no auto-remove)
              persistent?: false,
              // {Number} Auto-remove timeout in milliseconds
              timeout?: 5000,
              // {String} Visual style
              // Possible values: 'default', 'error', 'info'
              type?: 'default',
              // {String} Icon on left side
              // Possible values: null (no icon), 'check', 'info', 'error', 'trash'
              icon?: null
          }

### ContentStationSdk.download(url)

Downloads the file from the given URL.

-   params _url_ `String` - URL from which the file will be downloaded.

### ContentStationSdk.openModalDialog(config)

Opens the modal dialog that can be used as a placeholder for various functionalities.
The width of the dialog is defined from the config object ('width' property), but the height is defined by the content that is
loaded into the dialog. The width and height of the dialog will not exceed the window size.

To hide the dialog header and/or footer, leave out the properties 'title' and/or 'buttons'.
This provides a plain modal placeholder for custom functionality.

-   returns `Number` - dialog id. Identifies which dialog to close with `ContentStationSdk.closeModalDialog(dialogId)`.
-   param _config_ `Object<ModalDialogConfig>`

          Object<ModalDialogConfig>
          {
              // {String/HTML} Dialog title
              // If omitted, the dialog header will be removed
              title?: 'Content Station',
              // {String/HTML} Dialog subtitle
              subtitle?: null,
              // {String/HTML | jQuery element} Content of the dialog
              content?: null,
              // {Boolean} Should default padding on content div be set to 0
              contentNoPadding?: false
              // {Number} Width of the modal dialog in pixels
              width?: 500
              // {Boolean} Show close button ('X') in top right corner in dialog header
              showX?: true
              // {String} CSS class that will be added on dialog
              cssClass?: ''
              // {Object<ButtonConfig>} Definition of buttons
              // If omitted/empty, dialog footer with buttons will be removed
              buttons?: []
          }

          Object<ButtonConfig>
          {
              // {String} Button label
              label: ''
              // {String} CSS class to be added to button
              // Buttons are primary (orange) by default
              // You can add 'pale' class to make button apear secondary (white), or define your own class
              class?: ''
              // {Function} Handler that will be invoked when the button is clicked
              // If no callback is provided, the button will act as a close ('X') button
              callback?:
          }

### ContentStationSdk.closeModalDialog(dialogId)

Used to close the modal dialog that was previously opened with 'ContentStationSdk.openModalDialog()'

-   param _dialogId_ `Number` - the id returned by `ContentStationSdk.openModalDialog()`

### ContentStationSdk.hasAccessRight(accessRightName[, publicationId, categoryId, stateId])

Determines if the signed-in user has the Access Rights to use a certain feature.
The method accepts 'accessRightName' as a mandatory parameter, and 'publicationId', 'categoryId' and 'stateId' as optional parameters.

Method returns 'boolean' or 'undefined':

-   it will return 'true' if the user has rights to access the feature
-   it will return 'false' if the user has no rights to access the feature for the currently passed parameters
    ('publicationId', 'categoryId' and 'stateId'), but has rights to access for a different set of parameters
-   it will return 'undefined' if the user cannot access the feature regardless of the set of optional parameters

Examples:

-   _"Disable the action if the user has no right to download the original file."_

          {
              ContentStationSdk.createAction({
                  title: 'Download original',
                  onInit: function(config, selection){
                      var selectedFile = selection[0];
                      config.isDisabled = ContentStationSdk.hasAccessRight(
                          'Download_Original',
                          selectedFile.PublicationId,
                          selectedFile.CategoryId,
                          selectedFile.StateId
                      );
                  }
              });
          }

-   _"Can the user access the Publication Overview?"_

          ContentStationSdk.hasAccessRight('Publication_Overview');

### ContentStationSdk.openFile(selectedFile)

Opens the file that is provided as an argument. It provides the same functionality as a double-click action on the row or thumbnail in the search results.
Depending on the file type and format, it will open the article in the internal editor, list files contained in the Dossier or, for others, check-out the file
and trigger the download process.

-   param _selectedFile_ `Object<MetaDataFlat>` - flattens the metadata structure
    (one of the objects from 'selection' array parameter available in 'onInit' and 'onAction' handlers)

### ContentStationSdk.refreshCurrentSearch()

Refreshes the search results, both regular search view and all search sub-views: Dossier, checked-out files, all named queries, Inbox and parameterized search.

### ContentStationSdk.refreshObjects(ids)

For a given array of object ids, it will pull the latest data from the server for the corresponding object and perform UI updates for the current tab and all other opened tabs.

-   param _ids_ `Array<String>` - array of ids

### ContentStationSdk.injectObjectsInDossier(dossierId, objects)

When object information is already available (for example: from a server response), the developer can inject those objects into the search results of the Dossier instead of calling a refresh method from the SDK.

-   param _dossierId_ `String` - id of a Dossier in which objects are injected. Usually an ID from a Dossier that is already available in 'onInit' and 'onAction' methods
-   param _objects_ `Array<EnterpriseObject>` - array of (Enterprise) objects (for example: objects from GetObjects response)

### ContentStationSdk.addDossierToolbarButton(config)

Creates a button on the dossier view page.

-   param _config_ `Object<ButtonConfig>` - All properties are optional - for missing properties the defaults will be applied.

          {
              // {String} A label
              label?: false,
              // {Boolean} Is a button disabled
              isDisabled?: false,
              // {Boolean} Is a button removed/hidden
              isRemoved?: false,
              // {Function} Handler that is called before the button is generated
              onInit?: null,
              // {Function} Handler that is called when a button is clicked/tapped
              onAction?: null
              // {Any} any other pair of a key and a value can be added
              [key]: value
          }

#### Function `Object<ButtonConfig>.onInit(config, selection, dossier)`

Handler that is called before the button is generated and after each time the selection is changed.
Three parameters are available: 'config', 'selection' and 'dossier'.

This makes it possible to update the 'config' object based on the information from 'selection' and 'dossier'.

Parameters:

-   param _config_ `Object<ButtonConfig>` - The same 'config' object passed to 'addDossierToolbarButton()'
-   param _selection_ `Array<MetaDataFlat>` - Array of selected objects in search results.
    Available in flattened structure of metaData: all properties are in the root.
-   param _dossier_ `Object<MetaDataFlat>` - Dossier object, available when the button is going to be rendered within a Dossier.

Examples:

-   _"Button should be enabled only in single-selection (disabled in multi-selection or no selection at all)."_

          ContentStationSdk.addDossierToolbarButton({
              label: 'Custom Button 1',
              onInit: function(config, selection, dossier){
                  config.isDisabled = selection.length !== 1;
              }
          });

-   _"Button should be enabled only in single-selection and only for objects of type 'Image'."_

          ContentStationSdk.addDossierToolbarButton({
              label: 'Custom Button 2',
              onInit: function(config, selection, dossier){
                  config.isDisabled = selection.length !== 1 || selection[0].Type !== 'Image';
              }
          });

-   _"Button should be visible only if an object of type Image is selected"_

          ContentStationSdk.addDossierToolbarButton({
              label: 'Custom Button 3',
              onInit: function(config, selection, dossier){
                  config.isRemoved = selection.length !== 1 || selection[0].Type !== 'Image';
              }
          });

##### Function `Object<ButtonConfig>.onAction(config, selection, dossier)`

Handler that is called when the button is clicked.
Three parameters are available: 'config', 'selection', 'dossier', the same as for the `Object<ButtonConfig>.onInit()` handler.

Examples:

-   We can update the second example from above - "_Button should be visible only if an object of type Image is selected, and on click it should notify 'Hello from <Dossier_Name> and <Image_Name>'._"

          ContentStationSdk.addDossierToolbarButton({
              label: 'Custom Button 4',
              onInit: function(config, selection, dossier){
                  config.isRemoved = selection.length !== 1 || selection[0].Type !== 'Image';
              },
              onAction: function(config, selection, dossier){
                  ContentStationSdk.showNotification({
                      content: 'Hello from ' + dossier.Name + ' and ' + selection[0].Name
                  });
              }
          });

## Available global objects and libraries

### Deprecation and removal notice

**As of Studio 11.72, plugins should no longer access global libraries managed by the main Studio application. As of Studio 11.177, global libraries have been removed from Print Editor and Publication Overview. In future versions of Studio, global libraries may be updated in or completely removed from other parts of the application, which may lead to incorrectly functioning plugins. In `plugins.md`, you will find more information on managing libraries locally in a plugin including references to sample code.**

### Globals

A global 'platform' object is available for reading information about the device, platform and Web browser that Content Station is accessed with.

-   Platform info: `platform`
