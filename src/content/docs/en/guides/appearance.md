---
title: Appearance and icons
description: Choose a card style, background colors, font size, and density, and give folders, tags, and cards their own icons.
tags: [card-workspace, guides/appearance, features/icons]
workflow: [organize]
---

Card Workspace follows your Obsidian theme, and lets you adjust how dense the panel feels, how each card is framed, and which icon marks each folder, tag, or note.

## Card style

Open **Settings → Card Workspace → Interface appearance** and choose **Card style**:

- **Default cards** — the standard card frame
- **Minimal outline** — a light outline around each card
- **List** — rows separated by lines; rows in the same line keep the same height, so separators align across columns
- **Flat** — flat color blocks
- **Accent bar** — a colored bar along the left edge

**Card corner radius** chooses **Compact**, **Softer**, or **Rounded** (default). It is hidden for the List style.

## Background colors

**Default card background color** sets the color of every card without its own color. **Follow theme** is the default; the eight presets — red, orange, yellow, green, cyan, blue, purple, and pink — adapt to light and dark themes.

To color individual cards, right-click a card and choose **Background color**, or select cards in bulk mode and use **Background color** on the toolbar. **Follow default** removes the card’s own color. Card colors are stored in the plugin’s settings and sync with the vault; they are never written into notes.

## Font size and density

- **Font size** scales the text in cards, the toolbar, and navigation relative to Obsidian’s interface font size: **Small**, **Default**, **Large**, or **Extra large**.
- **Density** adjusts the spacing between and inside cards, and the height of navigation rows and the search box: **Compact**, **Default**, or **Comfortable**.

**Preview lines**, card images, and hover preview size are under **Cards and previews**; see [Browsing cards](./browsing-cards.md).

## Custom icons

Click the icon of a navigation entry or a card title to open the icon picker. You can also right-click the entry or card and choose **Change icon**. Clicking an icon never opens, filters, or selects anything, and it does not start a drag.

- The **Icons** tab lists recently used icons, suggestions for that kind of entry, and every Lucide icon Obsidian provides. Search accepts words in any order and common Chinese keywords.
- The **Emoji** tab has a category bar and a remembered skin-tone choice. It contains the full Unicode Emoji 17.0 set with English and Chinese names, and works offline. Paste a single emoji into the search box and press Enter to use it.
- **No icon** shows the entry as plain text.

Choosing an icon saves it and closes the picker; Escape or clicking outside closes it without changes. **Remove custom icon** in the context menu restores the default. On phones, the picker opens as a bottom sheet.

Icons can be set for folders (including the vault root), tags, property names and values, card boxes, the Backlinks and Outgoing links entries, templates, and cards. A card’s icon belongs to its file, so it is the same in every folder, box, and link view. Favorites show the icon of the original entry. Parent folders and tags do not pass their icon to children.

### Default icons

**Settings → Card Workspace → Default icons** sets an icon for each kind of entry: folders, tags, property names, property values, card boxes, backlinks, outgoing links, and templates in navigation; and Markdown, Base, Canvas, Excalidraw, image, PDF, audio, video, and other file cards. A category can also use **No icon**. The order is: the entry’s own icon, then the category default, then the built-in icon. The reset button next to a category restores the built-in icon.

Icons follow files and folders when you move or rename them inside Obsidian, and tag icons follow tag renames made in Card Workspace.
