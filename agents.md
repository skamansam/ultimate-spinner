# Agents Guide for `ultimate-spinner`

This document explains how to work on this repo as an AI agent (or future human), including project layout, Svelte 5 runes usage, testing, and conventions.

---

## 1. Project overview

- **Framework**: Svelte 5 + SvelteKit 2
- **Bundler/Dev**: Vite
- **Styling**: Tailwind CSS + some custom CSS
- **Tests**:
  - Unit tests: Vitest
  - E2E tests: Playwright
- **Deployment**: Static adapter (`@sveltejs/adapter-static`)
- **Package**: This repo also builds a distributable Svelte component package (`dist/`).

Key entry points:

- `src/routes/+page.svelte`
  - Main app page (the spinner UI, sidebar, tabs, dialogs, history, custom sets).
- `src/lib/Spinner.svelte`
  - Core spinner component with animation.
- `svelte.config.js`
  - SvelteKit config with static adapter and GitHub Pages base path.
- `package.json`
  - Scripts, devDependencies (SvelteKit, Vitest, Playwright, ESLint, Prettier, Tailwind).

---

## 2. Running, building, and testing

Use **pnpm** (see `packageManager` field).

### Dev server

```bash
pnpm dev
```

- Runs Vite dev server.
- Default URL: `http://localhost:5173/`.

### Build & preview

```bash
pnpm build
pnpm preview
```

- `build`: `vite build && npm run package`
- `preview`: serve the built app.

### Packaging the Svelte component

```bash
pnpm package
```

This runs:

- `svelte-kit sync`
- `svelte-package`
- `publint`

Output is in `dist/`, with `svelte` and `types` exports configured in `package.json`.

### Typecheck & lint

```bash
pnpm check       # svelte-check
pnpm lint        # prettier + eslint
pnpm format      # prettier --write
```

Use `pnpm check:watch` for live typechecking.

### Tests

```bash
pnpm test:unit   # Vitest
pnpm test:e2e    # Playwright
pnpm test        # unit + e2e
```

When adding features, prefer adding/adjusting Vitest unit tests and Playwright tests where appropriate.

---

## 3. Svelte 5 runes and code style

This repo uses Svelte 5 runes-like APIs (e.g. `$state`, `$effect`) but is written in **.svelte** with plain `<script>` and JSDoc for types.

### State

- Use `$state` for local component state:

  ```js
  /** @type {SpinnerConfig[]} */
  let spinners = $state([]);
  ```

- Do **not** mutate state in-place without reassigning if it breaks reactivity. Follow existing patterns:

  ```js
  spinners = [...spinners, newSpinner];
  ```

### Effects

- `$effect` is used for derived work and side-effects like `localStorage` persistence:

  ```js
  $effect(() => {
    const payload = { spinners, spinnerValues, activeTab, showStats, customSets, spinHistory };
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }
    } catch (_) {}
  });
  ```

- Keep effects idempotent and cheap; avoid heavy computations inside them.

### Types

- Types are documented via JSDoc typedefs at the top of `+page.svelte`:

  ```js
  /**
   * @typedef {Object} SpinnerConfig
   * @property {string} title
   * @property {string[]} items
   */
  ```

- When adding new structured state, add/extend typedefs and annotate variables with `/** @type {...} */`.

### UI conventions

- Tailwind is used heavily for layout and theming.
- Use existing patterns for cards, buttons, dialogs, and text sizes.
- Dark mode support should be preserved with `dark:` variants.

---

## 4. Main page (`src/routes/+page.svelte`)

### High-level responsibilities

- Manages **all spinner instances** (`spinners`) and their current values (`spinnerValues`).
- Renders main spinners grid and sidebar tabs:
  - Values
  - Results
  - Stats
  - Custom
  - Examples
- Handles:
  - Add/Edit/Delete/Duplicate spinner
  - Spin All
  - Spin history snapshots
  - Custom combination save/load/delete
  - JSON import/export of custom sets
  - Modals: spinner editor, save combination, import/export, changelog
  - `localStorage` persistence

### Important state

- `spinners: SpinnerConfig[]` – spinner definitions.
- `spinnerValues: SpinnerValue[]` – latest values per spinner.
- `spinHistory: SpinSnapshot[]` – history snapshots recorded on **Spin All**.
- `customSets: CustomSet[]` – saved custom combinations.
- `activeTab: 'values' | 'results' | 'stats' | 'custom' | 'examples'`.
- Dialog refs: `dialog`, `saveDialog`, `importDialog`, `exportDialog`, `changelogDialog`.

### Key flows

#### Adding / editing spinners

- `openModal()` opens the spinner dialog.
- `addSpinner(evt)` handles form submit:
  - If `editingSpinnerIndex >= 0`, updates an existing spinner.
  - Else, appends a new spinner built from `title` and `items` textarea.

#### Deleting / duplicating

- `deleteSpinner(index)` removes spinner and its value.
- `duplicateSpinner(index)` clones the config and current value and inserts right after.
- `Spinner.svelte` receives callbacks:

  ```svelte
  <Spinner
    bind:this={spinnerComponents[i]}
    title={spinner.title}
    items={[...spinner.items]}
    onDelete={() => deleteSpinner(i)}
    onConfigure={() => configureSpinner(i)}
    onDuplicate={() => duplicateSpinner(i)}
    onValueChange={(evt) => updateSpinnerValue(i, evt)}
  />
  ```

#### Spin All and history

- `spinAll()`:
  - Captures `currentResults = getSpinResults()` for the **current** values.
  - Builds a `SpinSnapshot` with `values` and `results` and prepends it to `spinHistory`.
  - Calls `spinnerComponents.forEach(spinner => spinner?.spin())` to animate all spinners.

- **Values tab**:
  - Shows current values per spinner.
  - Below, shows **Previous spins**:
    - Collapsed: comma-separated values in the snapshot.
    - Expanded: list of spinner titles and values.

- **Results tab**:
  - Top: current aggregated results via `getSpinResults()`.
  - Below: **Previous results** from each snapshot using `getResultsFromSnapshot(snapshot)` and formatted as `value` or `valuexN`.

When adjusting history behavior, keep `SpinSnapshot` and `spinHistory` consistent and update `localStorage` load/save accordingly.

#### Custom combinations & JSON import/export

- `saveCurrentAsCustom()` – snapshot `spinners` into `customSets` with a name.
- `loadCustomSet(i)` – replaces `spinners` with that set and resets `spinnerValues`.
- `importCustomFromJson()` – parses JSON from dialog textarea and merges into `customSets`.
- Export flow:
  - `isExportMode` toggles via the **Export** button.
  - Checkboxes appear only in export mode.
  - **Export as JSON** button builds JSON of selected sets and opens export dialog.

When adding new custom-set shapes or shortcuts, update both import and export logic.

#### Changelog

- A **Changelog** button next to the theme toggle opens a dialog showing a static summary derived from recent git history.
- When you add new features or change existing ones, run `git log` and update both this section of
  `agents.md` and the changelog dialog so users see an accurate summary of recent changes.

---

## 5. Spinner component (`src/lib/Spinner.svelte`)

### Props

- `items: string[]` – labels in the wheel.
- `spinDuration: number` – animation duration (ms).
- `title: string` – spinner title.
- `onDelete: () => void`
- `onConfigure: () => void`
- `onDuplicate: () => void`
- `onValueChange: (value: { title: string; value: string|null }) => void`

### Behavior

- Uses CSS transforms and animation to create a wheel.
- `spin()` function:
  - Cancels any existing animation.
  - Animates the list with a random extra rotation.
  - On `onfinish`, determines which item is at the top (using DOM geometry) and calls `onValueChange` with `{ title, value }`.

### Header controls

- Left: delete button.
- Center: title.
- Right: duplicate and configure buttons.

When changing item layout or animation, ensure `getResultsAtTop()` keeps returning the correct item.

---

## 6. Styling and Tailwind

- Tailwind is configured in the project (see `tailwind.config` and classes in `.svelte` files).
- Use existing patterns:
  - Cards: `rounded-lg bg-gray-50 dark:bg-gray-700 p-4`.
  - Buttons: `rounded-md bg-purple-600 ...` etc.
- Respect dark mode: `dark:` variants for background, text, borders.

Avoid introducing inline styles unless necessary; prefer Tailwind utilities.

---

## 7. Adding new features (guidelines)

1. **Decide where state lives**:
   - If it affects only one spinner, consider adding props/state in `Spinner.svelte`.
   - If it affects the whole app (e.g., history, presets), put it in `+page.svelte`.

2. **Wire through props/callbacks** rather than global state.

3. **Update typedefs** when adding new structured data.

4. **Persist where appropriate**:
   - Use `localStorage` for user-facing, long-lived settings/history.
   - Integrate new fields into both `onMount` load and `$effect` save.

5. **Add/adjust tests**:
   - For logic-heavy functions (e.g., history, imports), consider unit tests in Vitest.
   - For user flows (spin all, history expansion), consider Playwright tests.

6. **Keep UI consistent**:
   - Reuse button and card styles.
   - Add new dialogs following the existing modal structure.

---

## 8. Git and changelog

- Use concise, descriptive commit messages (the current log is used to populate the in-app changelog).
- When making significant changes, add a bullet under **Latest updates** and move older entries down as needed.

Example `git log -n 5 --oneline` is already used to drive the current changelog dialog.

---

## 9. Quick reference

- **Dev**: `pnpm dev`
- **Build**: `pnpm build`
- **Package**: `pnpm package`
- **Typecheck**: `pnpm check`
- **Lint**: `pnpm lint`
- **Format**: `pnpm format`
- **Unit tests**: `pnpm test:unit`
- **E2E tests**: `pnpm test:e2e`
- **Full test suite**: `pnpm test`

When in doubt, follow the existing patterns in `+page.svelte` and `Spinner.svelte` for state, UI, and persistence.
