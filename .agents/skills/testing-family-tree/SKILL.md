---
name: testing-family-tree
description: How to drive the family-tree page (/tree) end-to-end — LocalStorage keys, relation inspection, layout invariants to check, and the window.prompt new-tree workaround. Use when exercising anything under src/components/sections/FamilyTree or lib/family.
---

# Testing the family-tree feature

The family-tree feature is gated by `<AuthGuard>` and stores everything in LocalStorage — there is no backend. To test it you need a logged-in user; everything else can be observed from the DevTools console.

## Logging in

The login flow lives in `src/pages/login.tsx` and writes `localStorage.stammbaum_session = { username, email, token }`. For local testing you can register `testuser / Password1` on `/login` once and reuse it.

The quickest way to confirm auth is wired is to delete the session and reload:

```js
localStorage.removeItem('stammbaum_session');
location.href = '/tree';
// should redirect to /login?next=%2Ftree
```

> Known quirk: `AuthGuard` re-encodes `router.asPath` without stripping a pre-existing `next=`, so visiting `/tree` repeatedly while logged out produces a nested `/login?next=%2Flogin%3Fnext%3D…` URL. The gate still works — just don't be alarmed by the URL.

## LocalStorage shape

Four keys are involved (plus the session key above):

| Key | Shape |
|---|---|
| `stammbaum_trees` | `Array<{ id, userId, name, rootPersonId, createdAt, updatedAt }>` |
| `stammbaum_persons` | `Array<Person>` (note: every person has a `treeId` — filter by it) |
| `stammbaum_relations` | `Array<{ id, type, fromId, toId }>` where `type ∈ 'spouse' \| 'parent' \| 'sibling'` |
| `stammbaum_user_persons` | `Array<{ userId, personId, isOwner, isRoot, isHidden, canEdit }>` |

Symmetric relations (`spouse`, `sibling`) are stored once with the smaller id in `fromId` (see `sortPair` in `lib/family/storage.ts`). Directional `parent` relations have parent in `fromId` and child in `toId`.

## Inspecting state from the DevTools console

Drop this in the console to get a quick summary scoped to the active tree:

```js
(() => {
  const trees = JSON.parse(localStorage.stammbaum_trees || '[]');
  const persons = JSON.parse(localStorage.stammbaum_persons || '[]');
  const relations = JSON.parse(localStorage.stammbaum_relations || '[]');
  return trees.map(t => ({
    name: t.name,
    root: persons.find(p => p.id === t.rootPersonId)?.firstName,
    persons: persons.filter(p => p.treeId === t.id).map(p => p.firstName),
    relations: relations
      .filter(r => persons.find(p => p.id === r.fromId)?.treeId === t.id)
      .map(r => ({
        type: r.type,
        from: persons.find(p => p.id === r.fromId)?.firstName,
        to: persons.find(p => p.id === r.toId)?.firstName,
      })),
  }));
})();
```

Use this for every layout/relation assertion — it surfaces orphan edges that the rendered tree silently swallows.

## Sibling rules (subtle)

- A sibling added to a person **with parents** creates `parent` rows from the shared parents to the new person. **No `sibling` row is written.** This is intentional so the new person integrates with the layout via shared parents.
- A sibling added to a person **with no recorded parents** writes a single `sibling` row.
- `getSiblings()` returns the union of (shared-parent siblings) and (explicit sibling edges), so retrofitting parents later keeps the old explicit sibling visible too.

If you ever see both a `sibling` row and shared parents between the same two people, that's a bug worth flagging.

## Layout invariants that have bitten us before

`lib/family/layout.ts` is the riskiest file. Two distinct bugs have already shipped against it; when changing it, eyeball the following after building a small tree:

1. **No row overlap.** Compute the bounding rects of every `PersonNode` for a given generation and verify the intervals are disjoint. Has broken once for siblings of the focus person when the focus has a spouse — the fallback was using `slotWidth` (1 node + gap) instead of the rendered couple width.
2. **Parents centred over shared children.** A couple's midpoint x should be within ±20 px of the midpoint of their joint children's row. If parents fan out to one side, suspect the seen-set in `buildAncestors` (a previous bug pre-seeded it with the root members and short-circuited the recursion).
3. **Spouse line is dashed, parent line is solid.** Check `stroke-dasharray` in the SVG.

## Driving the "New tree" flow programmatically

`TreeSidebar` → *New tree* calls `window.prompt` to ask for the name. Native prompts are hard to drive with screenshot-based browser automation — the dialog can be dismissed by the screenshot tool itself. Workaround: override the prompt from the console before opening the sidebar.

```js
window.prompt = () => 'Family 2'; // any non-empty string
```

Then click the burger → *New tree* and the prompt resolves instantly. Verify the new tree was created with the console snippet above.

## Reset between test runs

```js
localStorage.removeItem('stammbaum_trees');
localStorage.removeItem('stammbaum_persons');
localStorage.removeItem('stammbaum_relations');
localStorage.removeItem('stammbaum_user_persons');
location.reload();
// keep stammbaum_session and stammbaum_users so you stay logged in
```

With those cleared the empty-state CTA *Add information about yourself* appears in the centre of the canvas, which is the natural starting point for any new test.
