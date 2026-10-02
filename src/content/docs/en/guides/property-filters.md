---
title: Property filters
description: Choose useful frontmatter properties, filter folder cards, and group cards by property values.
tags: [card-workspace, guides/navigation, features/properties]
workflow: [gather, organize]
---

The **Properties** navigation section turns a small set of frontmatter keys into browsable facets. It is intentionally empty until you choose which properties matter, so a large vault does not become a wall of metadata.

## Choose visible properties

Right-click the **Properties** header and choose **Choose visible properties**. Search the vault-wide list, enable the keys you want, and select **Done**. Newly enabled keys open immediately to show the values found in the current card source.

The documentation vault includes a small `workflow` property with the values `gather`, `organize`, and `reframe`, which makes a useful first example after [Getting started](./getting-started.md).

## Filter by values

Click a value to make it the only active property filter. Click it again when it is the sole active value to clear the filter. Ctrl-click on Windows/Linux, Cmd-click on macOS, or press Space to add or remove values without replacing the rest.

- Values inside one property use **OR**: `workflow = gather OR organize`.
- Different properties use **AND**: `workflow = gather AND status = active`.
- **Unassigned** matches notes without a supported value for that key.

Activating a non-empty property filter clears the current tag filters, and activating a tag filter clears property filters. Ctrl/Cmd-click or Space still adds values and other property conditions within property filtering. Use [card-box rules](./card-boxes.md) to preserve tag and property views.

Text, finite numbers, booleans, and arrays containing those scalar values are supported. Keys come only from top-level Markdown frontmatter; nested objects are not expanded into dotted properties. Non-Markdown cards have no property values and therefore match only an active **Unassigned** choice.

## Group by a property

1. Enable a key such as `status` in **Choose visible properties**.
2. Open **Sort & group → Group by → Property** on the toolbar and choose that key.
3. Cards form groups by the complete set of values. For example, `status: [draft, review]` and `status: draft` form different groups; array order does not affect membership.

Headers show the property name, values, and card count. Text, numbers, and booleans keep their type distinctions; cards without supported values enter **Unassigned**.

Property grouping works in folder, card-box, and linked-note sources, even though the latter two cannot use temporary property filters. Hiding a property used for grouping resets the affected global or card-box arrangement to **None**.

## Counts and navigation search

Property facets are calculated from the unfiltered source, so choosing one value does not erase its siblings. Turn on navigation counts in [Settings](../reference/settings.md) to show how many source cards contribute to each key and value.

**Filter navigation…** matches both enabled property names and their displayed values. A matching value temporarily expands its property, making it useful in a longer property list.

## Availability by source

Property filters are available only in folder sources.

They are unavailable in card boxes and [linked-note sources](./linked-notes.md).

Existing folder property clauses stay dormant there, show a paused-filter hint when applicable, and resume when you return to a folder.

A card box’s membership rules can still include property clauses; those rules determine its members rather than acting as a temporary browse filter.

When you save or add a folder view to a [card box](./card-boxes.md), its active property clauses become part of the new rule together with the folder and tags.

Right-click the Properties header to clear all property filters. Hiding a property also removes its expansion state and active browse clauses, and clears grouping by that key. Property conditions in card-box membership rules remain intact.
