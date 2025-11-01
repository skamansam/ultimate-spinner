# Ultimate Spinner
[![PR Checks](https://github.com/skamansam/ultimate-spinner/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/skamansam/ultimate-spinner/actions/workflows/pr-checks.yml)
A customizable, animated spinner component for SvelteKit applications.

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
</script>

<Spinner 
  items={['Item 1', 'Item 2', 'Item 3']}
  spinDuration={3000}
  title="My Spinner"
/>
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Attribution Requirements

While this project is open source and free to use, we kindly request that you:

1. Keep the copyright notice and license in any copies or substantial portions of the Software
2. Provide attribution by linking back to this repository when using the library in your projects
3. If you modify the library, indicate that you've made changes and maintain the original attribution

## Author

Created by [Sam](https://github.com/skamansam)
