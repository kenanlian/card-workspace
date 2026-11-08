---
title: Phones and tablets
description: How Card Workspace works on Android, iPhone, and iPad, including navigation, menus, insertion, and device settings.
tags: [card-workspace, guides/mobile]
workflow: [gather, reframe]
---

Card Workspace runs on Android and iOS/iPadOS with Obsidian 1.11.4 or later. Folders, card boxes, linked notes, search, quick input, and templates work as on desktop; the layout and a few interactions adapt to touch.

## Open the view

Tap the ribbon icon or run **Open Card Workspace view** from the command palette. On mobile the view opens as a page in the main workspace, and later openings reuse the same page. Enabling the plugin does not open a page by itself. On startup, Card Workspace restores the last folder you browsed.

## Phone layout

Phones show one card column. Navigation opens in a dialog; choosing a folder, box, or link direction closes it. Obsidian’s page header shows the current source and its active tag and property filters in place of the toolbar’s scope line.

With Obsidian’s **Auto full screen** setting turned on, scrolling the cards hides the header, bottom navigation, and toolbar, just as it does for notes. Scroll up or tap to bring them back.

## Tablet layout

Tablets show the source in the toolbar. They use two panes when the view is at least 640 pixels wide and leaves room for the saved navigation width plus 320 pixels of cards; otherwise they use a single pane like a phone. Rotating the device, using split view, or showing the keyboard updates the layout without reloading the cards.

## Menus and long press

Each card and navigation row has a menu button for the actions you would right-click on desktop. A 500 ms long press opens the same menu; moving more than 8 pixels or scrolling cancels it. Pins, bulk selection, and manual ordering use the same actions as on desktop.

## Insert and copy card content

There is no editor to drop a card into on a phone, so the card menu offers insertion and copying instead: link, embed, content, or title and content, with the same file-type rules and heading sections as desktop drops.

1. Open the Markdown note you want to write in and place the cursor.
2. Open Card Workspace and use a card’s menu. The menu names the note it will insert into.
3. Choose an insert action. The text goes in at the cursor you left, without replacing selected text.

If you edit, close, switch, or rename that note in the meantime, insertion is refused; go back to the note and open the cards again. Copying is always available, and if the clipboard fails, the text is shown so you can select and copy it yourself.

## Drag on touch screens

Long-press a card or a sortable navigation row for 500 ms to start dragging. Moving or scrolling before then keeps ordinary scrolling. On a single-pane layout, dragging a card opens the navigation dialog so you can drop it on a folder, tag, property value, or card box; the dialog closes when the drag ends. A second finger cancels the drag.

## Quick input

Quick input opens as a full-screen dialog on phones and a centered dialog on tablets, with one draft at a time. It supports title, folder, card boxes, tags, and properties like the desktop windows. Closing a changed draft asks for confirmation, and a draft that is still sending cannot be closed. See [Quick input and templates](./quick-input-and-templates.md#on-phones-and-tablets).

## Back and forward

Switching between folders, boxes, and link directions is recorded in Obsidian’s view history. Use Obsidian’s own back and forward controls to return to an earlier source and its reading position; Card Workspace adds no back button of its own and does not intercept Android’s system Back.

## Settings on each device

Display and workspace preferences, such as card style, font size, density, image layout, navigation sections, and sorting, are stored on each device, so a phone can use a denser layout than a desktop. Card boxes, favorites, pins, templates, icons, background colors, manual sort orders, and search history sync with the vault. See [Device-local settings](../reference/limits-and-privacy.md#device-local-settings).

Phones and tablets use smaller memory and cache budgets for previews, search, and thumbnails than desktop, and lower size limits for original images.
