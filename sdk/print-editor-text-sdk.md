# EditorTextSdk

EditorTextSdk can be used in external plugin javascript files to manipulate text in the editor.
It's possible to get text, select text and replace/insert text.

The SDK does not work with text styles. So replacing text can impact styles applied on the impacted text.

Text is handled in character strings per article component in Content Station.
Making selections across multiple components and replacing text is not possible.

There is support for long transactions. This prevents the editor saving (multiple) versions of the article and
adds the possibility to cancel/rollback multiple changes made in the transaction.

## Sample

Have a look in file `sdk/samples/print-editor-text-sdk-sample.js` how this sdk can be used.

## SDK API Description

### `EditorTextSdk.getErrorMessage()`

Error message occurred during last action on the service. When the last sdk call was successful this will return `null`.

-   returns `string`

### `EditorTextSdk.isArticleLoaded()`

Indicates if an article is loaded in the editor.

-   returns `boolean`

### `EditorTextSdk.canEditArticle()`

Indicates if the article can be the edited/changed. This depends on:

1. the article is loaded in the editor
1. the article is not locked by someone else
1. the editor is not in readonly mode

-   returns `boolean`

### `EditorTextSdk.getTexts()`

Get the article texts per article component.
Will be successful when `isArticleLoaded` equals `true`

-   returns `string[]`

### `EditorTextSdk.getTextsInTable()`

Get the texts per cell for the opened table
Will be successful when `isArticleLoaded` equals `true`

-   returns `string[]`

### `EditorTextSdk.isTextSelected()`

Indicates if there is currently text selected in the editor.
Will be successful when `isArticleLoaded` equals `true`

-   returns `boolean`

### `EditorTextSdk.selectText()`

Select text in the editor. If `startPos` equals `endPos`, only the cursor is positioned.
Will be successful when `isArticleLoaded` equals `true`

-   param _componentIndex_ `number` — index of the component to select in
-   param _startPos_ `number` — character position in the text.
-   param _endPos_ `number` — character position in the text.
-   returns `boolean` — `true` when the editor could select the text

### `EditorTextSdk.selectTextInCell()`

Select text in the table cell. If `startPos` equals `endPos`, only the cursor is positioned.
Will be successful when `isArticleLoaded` equals `true`

-   param _cellIndex_ `number` — index of the cell to select in
-   param _startPos_ `number` — character position in the text.
-   param _endPos_ `number` — character position in the text.
-   returns `boolean` — `true` when the editor could select the text

### `EditorTextSdk.replaceText()`

Replace text in given selection with replacement string. If `startPos` equals `endPos`, text will be inserted.
Will be successful when `canEditArticle` equals `true`

-   param _componentIndex_ `number` — index of the component to select in
-   param _startPos_ `number` — character position in the text.
-   param _endPos_ `number` — character position in the text.
-   param _replacement_ `string` — the replacement or insertion text
-   returns `boolean` — `true` when the editor could replace or insert the text

### `EditorTextSdk.replaceTextInCell()`

Replace text in given selection with replacement string. If `startPos` equals `endPos`, text will be inserted.
Will be successful when `canEditArticle` equals `true`

-   param _cellIndex_ `number` — index of the cell to select in
-   param _startPos_ `number` — character position in the text.
-   param _endPos_ `number` — character position in the text.
-   param _replacement_ `string` — the replacement or insertion text
-   returns `boolean` — `true` when the editor could replace or insert the text

### `EditorTextSdk.getTableGuid()`

Returns the GUID of the table that is currently opened inside the Table Editor.

-   returns `string`

### `EditorTextSdk.getTableDimensions()`

Returns the dimensions of the table that is currently opened inside the Table Editor.

-   returns `Object<TableDimensions>`

### `EditorTextSdk.isInTransaction()`

Indicates if a transaction is started.

-   returns `boolean`

### `EditorTextSdk.startTransaction()`

Start a transaction. This is only possible when not already in a transaction and `canEditArticle` is truthy.
The editor's state machine is paused by this, which results in disabling automatic saves and refreshes while the transaction lasts.
When failing, `false` is returned. The reason for this failure can be retrieved with `getErrorMessage`.

-   returns `boolean`

### `EditorTextSdk.closeTransaction()`

Close a transaction. Detects changes made during the transaction and marks the article as changed.
Editor's state machine will be resumed after this.
When failing, `false` is returned. The reason for this failure can be retrieved with `getErrorMessage`.

-   returns `boolean`

### `EditorTextSdk.cancelTransaction()`

Cancel a transaction. Will rollback changes made during the transaction and resumes the editor's state machine.
When failing, `false` is returned. The reason for this failure can be retrieved with `getErrorMessage`.

-   returns `boolean`
