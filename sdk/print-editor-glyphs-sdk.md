# Configuring Glyphs in the Print Editor

In the Print Editor it is possible to insert predefined glyphs into the article. These glyphs are displayed in the text tools panel of the Print Editor and can be configured in a javascript config file located at `contentstation/config-glyphs.js`.

NOTE: It is best to use a JavaScript code editor to edit this file since a code editor will indicate small code-format errors.
A few free to use code editors are: [MS Visual Studio Code](https://code.visualstudio.com/), [Atom](https://atom.io/) and [Sublime](https://www.sublimetext.com/).

When opening the glyphs config file you should find the following structure:

```js
// the following 2 lines are required to load the glyphs config (so don't edit them)
window.peGlyphs = {
    groups: [
        (…)
    ]
}
```

## Adding a group

To add a group to the groups array we need to create an object. For example:

```js
{
    groupName: 'your custom group name',
    glyphs: [
        (…)
    ]
}
```

> The groupName is the name of the group shown in the glyphs panel.

To add groups: create multiple group objects and comma separate them as below.

```js
{
    groupName: 'your custom group name1',
    glyphs: []
},
{
    groupName: 'your custom group name2',
    glyphs: []
}
```

The glyphs config should now look something like this:

```js
window.peGlyphs = {
    groups: [
        {
            groupName: 'your custom group name1',
            glyphs: [],
        },
        {
            groupName: 'your custom group name2',
            glyphs: [],
        },
    ],
};
```

In the groups we can add an array of glyphs. For example:

```js
{
    name: 'Dollar',
    unicode: 'U+0024'
}
```

> **_A unicode will always start with ’U+’ followed by 4 hexadecimal digits, for example the Euro sign: `U+20AC`_**
>
> The name is displayed in a tooltip.
>
> The unicode defines the symbol/character to be inserted in the article when pressing the glyph in the side panel.

When combining all steps above it will look like this:

```js
window.peGlyphs = {
    groups: [
        {
            groupName: 'Valuta',
            glyphs: [
                {
                    name: 'Dollar',
                    unicode: 'U+0024',
                },
                {
                    name: 'Euro',
                    unicode: 'U+20AC',
                },
            ],
        },
        {
            groupName: 'Punctuation',
            glyphs: [
                {
                    name: 'Inverted exclamation mark',
                    unicode: 'U+00A1',
                },
                {
                    name: 'Inverted question mark',
                    unicode: 'U+00BF',
                },
            ],
        },
    ],
};
```
