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
      Recent changes to Jacob's Dad's Ultimate Spinner, derived from git history.
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
            <span class="ml-2">Preserve aggregated results at time of spin in history snapshots</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">021bd3e</span>
            <span class="ml-2 font-semibold">2025-11-17</span>
            <span class="ml-2">Add spin history tracking with expandable snapshots and previous results display</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">bcc7a8a</span>
            <span class="ml-2 font-semibold">2025-11-17</span>
            <span class="ml-2">Add spinner duplication, custom combinations, and JSON import/export</span>
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
            <span class="ml-2">Fix issue of spinners not displaying properly with fewer than 3 items</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">4c295c2</span>
            <span class="ml-2 font-semibold">2025-01-25</span>
            <span class="ml-2">Calculate spinner value based on the element at the top of the spinner</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">5e5c974</span>
            <span class="ml-2 font-semibold">2025-01-25</span>
            <span class="ml-2">Add a real page title</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">6ab9b00</span>
            <span class="ml-2 font-semibold">2025-01-25</span>
            <span class="ml-2">Add examples to the sidebar</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">9b50eb1</span>
            <span class="ml-2 font-semibold">2025-01-25</span>
            <span class="ml-2">Change algorithm to calculate results first, then spin to that place</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">8bd7676</span>
            <span class="ml-2 font-semibold">2025-01-25</span>
            <span class="ml-2">Use tabs in the sidebar for values, results, stats, custom, examples</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">b7cab2c</span>
            <span class="ml-2 font-semibold">2025-01-25</span>
            <span class="ml-2">Add stats section to sidebar</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">2af858f</span>
            <span class="ml-2 font-semibold">2025-01-21</span>
            <span class="ml-2">Add a Spin All button</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">97a99e7</span>
            <span class="ml-2 font-semibold">2025-01-21</span>
            <span class="ml-2">Add sidebar with all the values in them</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">0d10a17</span>
            <span class="ml-2 font-semibold">2025-01-21</span>
            <span class="ml-2">Add delete and configure buttons to the spinner</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">ce04f7f</span>
            <span class="ml-2 font-semibold">2025-01-21</span>
            <span class="ml-2">Add text and fix duration</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">211a82c</span>
            <span class="ml-2 font-semibold">2025-01-20</span>
            <span class="ml-2">Add determination of winning item</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">43ed0ad</span>
            <span class="ml-2 font-semibold">2025-01-20</span>
            <span class="ml-2">Add a bunch of demo spinners</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">3686afd</span>
            <span class="ml-2 font-semibold">2025-01-20</span>
            <span class="ml-2">Make the spinner spin!</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">b81304a</span>
            <span class="ml-2 font-semibold">2025-01-19</span>
            <span class="ml-2">Add a bunch of test spinners</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">e6c5049</span>
            <span class="ml-2 font-semibold">2025-01-19</span>
            <span class="ml-2">Use purple instead of blue</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">8a82c90</span>
            <span class="ml-2 font-semibold">2025-01-19</span>
            <span class="ml-2">Create dark mode and center the spinners properly</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">cfacc02</span>
            <span class="ml-2 font-semibold">2025-01-19</span>
            <span class="ml-2">Start serious work on the spinner</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">602b457</span>
            <span class="ml-2 font-semibold">2025-01-19</span>
            <span class="ml-2">Add the main page</span>
          </li>
          <li>
            <span class="font-mono text-[11px] text-gray-500 dark:text-gray-400">8dd0d1d</span>
            <span class="ml-2 font-semibold">2024-12-23</span>
            <span class="ml-2">First commit</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</dialog>
