<script>
	import Spinner from '$lib/Spinner.svelte';
	import ThemeToggle from '$lib/ThemeToggle.svelte';

	const defaultItems = 'item One\nitem Two\nitem Three\nitem Four';

	let title = $state('');
	let items = $state(defaultItems);
	let spinners = $state([]);

	/**
	 * @type {HTMLDialogElement}
	 */
	let dialog;

	function addSpinner() {
		spinners = [...spinners, { title, items: items.split('\n').map((s) => s.trim()) }];
		title = '';
		items = defaultItems;
		dialog?.close();
	}

	function openModal() {
		dialog?.showModal();
	}

	function closeModal() {
		dialog?.close();
	}

	function addTestSpinners() {
		const testItemTexts = [
				'item One',
				'item Two',
				'item Three',
				'item Four',
				'item Five',
				'item Six',
				'item Seven',
				'item Eight',
				'item Nine',
				'item Ten',
				'item Eleven',
				'item Twelve'
			];
		spinners = [...spinners, ... (new Array(12)).fill(0).map((_, i) => ({
			title: `New Spinner! ${i + 1}`,
			items: testItemTexts.slice(0, i + 1)
		})).flat().concat([{ title: "Test 1000!", items: (new Array(1000)).fill(0).map((_, i) => `item ${i + 1}`) }])];
	}
</script>

<div
	class="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-8 transition-colors dark:from-gray-900 dark:to-gray-800"
>
	<ThemeToggle />
	<div class="mx-auto space-y-8">
		<header class="space-y-4 text-center">
			<h1 class="text-4xl font-bold tracking-tight text-purple-600 dark:text-purple-400">
				Jacob's Dad's Ultimate Spinner!
			</h1>
			<p class="mx-auto max-w-4xl text-lg text-gray-600 dark:text-gray-300">
				This is an ad-free ultimate spinner page. You can use it for free! I did this because I hate
				all the ads on all the other spinner sites. This is also optimized with CSS, so it is faster than most of them.
			</p>
			<p class="mx-auto max-w-4xl text-lg text-gray-600 dark:text-gray-300">
				A very special thank you to Mads Stoumann for the awesome tutorial and code: <a class="underline" href="https://dev.to/madsstoumann/wheel-of-fortune-with-css-p-pi-1ne9">Wheel of Fortune with CSS</a>.
			</p>
		</header>

		<div class="flex flex-wrap justify-center gap-6">
			{#each spinners as spinner}
				<div
					class="w-full rounded-lg bg-white shadow-md transition-shadow duration-200 hover:shadow-lg dark:bg-gray-800 sm:w-[400px]"
				>
					<Spinner title={spinner.title} items={[...spinner.items]} />
				</div>
			{/each}
			<!-- Add Spinner Button -->
			<button
				on:click={openModal}
				aria-label="Add new spinner"
				class="group flex aspect-square w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white shadow-md transition-all duration-200 hover:border-purple-500 hover:shadow-lg dark:border-gray-600 dark:bg-gray-800 dark:hover:border-purple-400 sm:w-[400px]"
			>
				<svg
					class="h-16 w-16 text-gray-400 transition-colors duration-200 group-hover:text-purple-500 dark:text-gray-500 dark:group-hover:text-purple-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					/>
				</svg>
			</button>
		</div>
	</div>
</div>

<!-- Dialog Modal -->
<dialog
	bind:this={dialog}
	on:close={closeModal}
	class="w-full max-w-md rounded-lg bg-white p-0 shadow-xl backdrop:bg-black backdrop:bg-opacity-50 dark:bg-gray-800"
>
	<div class="relative">
		<!-- Close button -->
		<button
			on:click={closeModal}
			aria-label="Close modal"
			class="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
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

		<!-- Dialog content -->
		<div class="p-6">
			<h2 class="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100">Create New Spinner</h2>
			<form class="space-y-6" on:submit|preventDefault={addSpinner}>
				<div class="space-y-4">
					<label class="block" for="title">
						<span class="mb-1 block font-medium text-gray-700 dark:text-gray-300">Title (optional)</span>
						<input
							class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
							type="text"
							id="title"
							placeholder="Enter spinner title"
							autofocus
							bind:value={title}
						/>
					</label>
					<label class="block" for="items">
						<span class="mb-1 block font-medium text-gray-700 dark:text-gray-300"
							>Items (one on each line)</span
						>
						<textarea
							class="w-full min-h-[300px] rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
							id="items"
							placeholder={defaultItems}
							bind:value={items}
						></textarea>
					</label>
				</div>
				<button
					class="w-full transform rounded-md bg-purple-600 px-6 py-3 font-semibold text-white transition-colors duration-200 ease-in-out hover:scale-105 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
					type="submit"
				>
					Create Spinner
				</button>
			</form>
		</div>
	</div>
</dialog>

<style>
	/* Style the dialog backdrop */
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.5);
	}

	/* Remove default dialog styles */
	dialog {
		border: none;
		padding: 0;
	}
</style>
