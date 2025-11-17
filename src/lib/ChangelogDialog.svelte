<script>
  /** @type {HTMLDialogElement} */
  let dialog;

  export function open() {
    dialog?.showModal();
  }

  export function close() {
    dialog?.close();
  }
</script>

<dialog
  bind:this={dialog}
  class="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl backdrop:bg-black backdrop:bg-opacity-50 dark:bg-gray-800"
>
  <div class="relative">
    <button
      onclick={close}
      aria-label="Close changelog dialog"
      class="absolute right-0 top-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
    <h2 class="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">Changelog</h2>
    <p class="mb-4 text-sm text-gray-600 dark:text-gray-300">
      Recent changes to Jacob's Dad's Ultimate Spinner, derived from git history. When new
      features are added or existing ones change, this list should be updated to reflect them.
    </p>
    <div class="max-h-[60vh] space-y-3 overflow-y-auto pr-1 text-sm">
      <div>
        <h3 class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Latest updates
        </h3>
        <ul class="space-y-1 text-gray-800 dark:text-gray-100">
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">d86afac</span>
            <span class="ml-2 font-semibold">2025-11-17</span>
            <span class="ml-2">Spin history now shows exactly the results as they were when you spun.</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">021bd3e</span>
            <span class="ml-2 font-semibold">2025-11-17</span>
            <span class="ml-2">Added a Previous Spins section with expandable details for each spin.</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">bcc7a8a</span>
            <span class="ml-2 font-semibold">2025-11-17</span>
            <span class="ml-2">You can now duplicate spinners, save custom setups, and import or export them as JSON.</span>
          </li>
        </ul>
      </div>
      <hr class="border-gray-200 dark:border-gray-700" />
      <div>
        <h3 class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Earlier changes
        </h3>
        <ul class="space-y-1 text-gray-800 dark:text-gray-100">

          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">d85a719</span>
            <span class="ml-2 font-semibold">2025-01-26</span>
            <span class="ml-2">Spinners now render correctly even when they have fewer than three items.</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">4c295c2</span>
            <span class="ml-2 font-semibold">2025-01-25</span>
            <span class="ml-2">Spinner results are calculated based on the item that visibly lands at the top.</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">5e5c974</span>
            <span class="ml-2 font-semibold">2025-01-25</span>
            <span class="ml-2">Gave the page a proper title in the browser tab.</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">6ab9b00</span>
            <span class="ml-2 font-semibold">2025-01-25</span>
            <span class="ml-2">Added ready-made example spinners to quickly try out different setups.</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">9b50eb1</span>
            <span class="ml-2 font-semibold">2025-01-25</span>
            <span class="ml-2">Improved the spin algorithm so results are chosen first and the wheel spins to match.</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">8bd7676</span>
            <span class="ml-2 font-semibold">2025-01-25</span>
            <span class="ml-2">Organized the sidebar into tabs for values, results, stats, custom sets, and examples.</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">b7cab2c</span>
            <span class="ml-2 font-semibold">2025-01-25</span>
            <span class="ml-2">Added a stats view so you can see totals, averages, and other summary numbers.</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">2af858f</span>
            <span class="ml-2 font-semibold">2025-01-21</span>
            <span class="ml-2">Introduced a Spin All button to spin every spinner at once.</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">97a99e7</span>
            <span class="ml-2 font-semibold">2025-01-21</span>
            <span class="ml-2">Added a sidebar listing the current value of each spinner.</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">0d10a17</span>
            <span class="ml-2 font-semibold">2025-01-21</span>
            <span class="ml-2">Added delete and configure buttons directly on each spinner.</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">ce04f7f</span>
            <span class="ml-2 font-semibold">2025-01-21</span>
            <span class="ml-2">Tweaked spinner text and timing so spins feel better.</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">211a82c</span>
            <span class="ml-2 font-semibold">2025-01-20</span>
            <span class="ml-2">Improved how the winning item is chosen when the spinner stops.</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">43ed0ad</span>
            <span class="ml-2 font-semibold">2025-01-20</span>
            <span class="ml-2">Added several demo spinners so you can explore different setups quickly.</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">3686afd</span>
            <span class="ml-2 font-semibold">2025-01-20</span>
            <span class="ml-2">Hooked up the core animation to actually make the wheel spin.</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">b81304a</span>
            <span class="ml-2 font-semibold">2025-01-19</span>
            <span class="ml-2">Added a collection of test spinners used while building the app.</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">e6c5049</span>
            <span class="ml-2 font-semibold">2025-01-19</span>
            <span class="ml-2">Switched the theme to purple to better fit the spinner vibe.</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">8a82c90</span>
            <span class="ml-2 font-semibold">2025-01-19</span>
            <span class="ml-2">Added dark mode and centered the spinners on the page.</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">cfacc02</span>
            <span class="ml-2 font-semibold">2025-01-19</span>
            <span class="ml-2">Started building out the full spinner experience.</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">602b457</span>
            <span class="ml-2 font-semibold">2025-01-19</span>
            <span class="ml-2">Created the main page that hosts the spinner interface.</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">8dd0d1d</span>
            <span class="ml-2 font-semibold">2024-12-23</span>
            <span class="ml-2">Initial commit for Jacob's Dad's Ultimate Spinner.</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</dialog>
