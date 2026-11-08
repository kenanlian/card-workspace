---
title: Quick input and templates
description: Capture ideas in quick input windows, create notes that inherit the current view, and reuse templates.
tags: [card-workspace, guides/capture, features/quick-input]
workflow: [capture]
---

Card Workspace gives you three ways to start a note: the toolbar **New** button for the view you are in, **quick input** for a thought you want to get down right now, and **templates** for notes you write again and again.

## New notes

**New** on the toolbar creates a note named **Untitled** in the current folder, including the vault root, and opens it.

- Selected tags and active text, number, or boolean property filters are written into the new note’s frontmatter. If several values of one property are selected, the first value in navigation order is used.
- In a [card box](./card-boxes.md#create-notes-in-a-box), the note is saved in **Folder for new notes in card boxes** (vault root by default), inherits the box’s active filters, and is added to the box.
- In a [linked-note source](./linked-notes.md), the note goes to the folder you visited last, without the paused filters.

New notes start blank. To start with an empty `tags` property instead, change **New note content** under **Settings → Card Workspace → New notes and templates**.

## Quick input

Select the paper-plane button at the right of the navigation header, or run **Open quick input** from the command palette. Each opening creates a new blank draft.

On desktop, every draft is its own small window with a colored frame. Several drafts can stay open at once, even while the main Obsidian window is minimized. Drag the three-dot grip at the top to move a draft, and drag its edges or corners to resize it. The pin button at the bottom left keeps that window on top; it starts on for every new draft. Clicking elsewhere keeps the draft; **Cancel** discards it.

### Before you start

Desktop quick input needs **Obsidian frame** or **Hidden** under **Settings → Appearance → Window frame style**. After changing it, fully restart Obsidian. With the system’s native frame, quick input explains what to change instead of opening; the plugin never changes this setting for you.

### Write and send

Type the note body; Enter inserts a new line and **Ctrl/Cmd+Enter** sends. Input-method composition never sends by accident. The draft can also have:

- **Title** — optional; it only sets the filename. Leave it empty to use a timestamp name such as `quick-note 2026-10-17 14-30-05.md`.
- **Folder** — where the note is saved. Folder suggestions search every folder in the vault.
- **Card boxes** — choose one or more boxes; the note is added to all of them when sent. Existing memberships are never removed.
- **Add tags** and **Add property** — edit frontmatter with Obsidian’s own Properties editor. **Ctrl+;** adds a property even when its button is hidden. Properties left completely empty are not saved.

All five controls are shown by default. Hide the ones you do not need under **Settings → Card Workspace → Quick input → Input fields**; hiding a control does not disable its keyboard shortcut. Changes apply to drafts opened afterwards.

After a successful send, the draft closes and shows where the note was saved, without opening it. If sending fails, the draft is kept exactly as it was so you can try again. Drafts live only in memory: they do not survive closing the window through the operating system, quitting Obsidian, or restarting.

### When a note with that title exists

**When the title already exists** decides what happens if the title matches a note in the chosen folder:

- **Ask each time** — default; choose on send, or cancel to keep editing
- **Append to the existing note** — add the draft body to that note; its own properties stay as they are, and the send button reads **Append**
- **Create a new note with a number** — for example `Title 1.md`

**Append position** chooses the start of the body (after the properties) or the end of the note, which is the default.

### Window and global shortcut

Under **Settings → Card Workspace → Quick input** you can set each new draft’s width and height (default 480 × 400 pixels), corner radius, and frame color. **Random** picks a theme color different from the previous draft; you can also pick the accent color, a theme background, or one fixed color.

**Global quick input shortcut** is empty by default. Press a key combination or type an Electron accelerator such as `Control+Shift+Q`, then select **Apply**. The shortcut opens a new draft from any app without bringing the main window forward. An invalid or conflicting combination leaves the previous shortcut in place. **Clear** removes it.

### On phones and tablets

Quick input opens as an Obsidian dialog: full screen on phones, centered on tablets. There is one draft at a time. Closing a changed draft asks for confirmation. Window size, color, and the global shortcut are desktop-only settings.

## Templates

The **Templates** section in navigation lists your templates. It appears below Links by default.

### Create a template

1. Select the **+** button on the **Templates** header, or right-click the header and choose **New template**.
2. Enter a template name and the folder where notes created from it are saved. The name only appears in navigation and template choices.
3. The template opens for editing with its title selected. Replace the title: it becomes the filename of every note created from the template. The body starts with a short guidance quote; edit or delete it, because it is real template content.

To use a Markdown file you already have, or one synced from another device, right-click it in Obsidian’s file explorer or on a Card Workspace card and choose **Set as template**. This appears for files inside the template storage folder that are not registered yet. The file keeps its name and content.

### Use a template

Click a template in navigation. If no note with the template’s title exists in its folder, a new note is created from the full template. If one exists, the template body is inserted into it and its properties and text are kept; **Insert position in an existing note** in the template’s menu chooses the start of the body or the end of the note (default). The note opens in editing mode with the cursor at the end of the inserted text.

Each click reads the latest version of the template, including unsaved edits.

### Dates and times

`{{date}}` and `{{time}}` in the title or body insert the current date and time, using the formats chosen in the template’s menu. To use another format at one spot, write `{{date:YYYY-MMMM-DD}}` or `{{time:HH:mm}}`, as in Obsidian’s Templates plugin. All variables in one note use the same moment. Characters that cannot appear in filenames become `-`, so date slashes never create folders.

### Manage templates

The template’s menu edits the file, renames the template, changes its note folder or date and time formats, and deletes it. **Delete template** uses Obsidian’s normal delete flow; cancelling keeps the template.

All template files live in **Template storage folder** under **Settings → Card Workspace → New notes and templates**, `Card Workspace Templates` by default. Choose another folder and select **Apply** to move every template there, keeping filenames and content. A missing folder is created; if a file is missing or a name conflicts, nothing is overwritten and the move stops. Template files are ordinary Markdown notes, so they also appear in cards, search, and Obsidian’s file explorer.

Quick input does not use templates.
