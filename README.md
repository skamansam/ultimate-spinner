# Ultimate Spinner

[![PR Checks](https://github.com/skamansam/ultimate-spinner/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/skamansam/ultimate-spinner/actions/workflows/pr-checks.yml)

A customizable, animated spinner component for Svelte applications.

## Demo
I put up a demo app for my son to use to make custom spinners for his schoolwork. You can try it out [here](https://rudeboy.dev/ultimate-spinner).

## Installation

```bash
npm install ultimate-spinner
# or
pnpm add ultimate-spinner
```

## Usage

```svelte
<script>
  import { Spinner } from 'ultimate-spinner';

  const items = ['Heads', 'Tails'];

  function handleValueChange({ title, value }) {
    console.log(`Spinner "${title}" landed on:`, value);
  }
</script>

<Spinner
  title="Coin Flip"
  items={items}
  spinDuration={3000}
  onValueChange={handleValueChange}
/>
```

### Props

- `items: string[]` – labels in the wheel. You can pass any number of items (including 1–2); the component adjusts its layout accordingly.
- `title: string` – optional title shown in the header above the wheel.
- `spinDuration: number` – duration of the spin animation in milliseconds.
- `onValueChange: ({ title: string; value: string | null }) => void` – called when the spin finishes with the item that landed at the top.
- `onDelete: () => void` – optional callback for the delete button in the header.
- `onConfigure: () => void` – optional callback for the configure button in the header.
- `onDuplicate: () => void` – optional callback for the duplicate button in the header.

### Behavior

- Uses a CSS‑driven “wheel of fortune” layout with smooth spin animation.
- Determines the winning value based on the segment that visibly lands at the top of the spinner.
- Handles small item counts (1–2–3 items) with special layouts so the wheel still looks good.
- Continues to produce a result even if the spinner is not currently visible in the viewport (e.g. off‑screen), by falling back to a random item.
- Click the wheel or press `Enter` while focused to trigger a spin (keyboard accessible).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Attribution Requirements

While this project is open source and free to use, we kindly request that you:

1. Keep the copyright notice and license in any copies or substantial portions of the Software
2. Provide attribution by linking back to this repository when using the library in your projects
3. If you modify the library, indicate that you've made changes and maintain the original attribution

## Author

Created by ["Skaman" Samuel C Tyler](https://github.com/skamansam)
