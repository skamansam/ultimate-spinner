<script>
	import Spinner from '$lib/Spinner.svelte';
	import ThemeToggle from '$lib/ThemeToggle.svelte';

	const defaultItems = 'item One\nitem Two\nitem Three\nitem Four';

	let title = $state('');
	let items = $state(defaultItems);
	let spinners = $state([]);
	let editingSpinnerIndex = $state(-1);
	let spinnerValues = $state([]);
	let showStats = $state(false);

	/**
	 * @type {HTMLDialogElement}
	 */
	let dialog;

	/**
	 * @type {import('$lib/Spinner.svelte').default[]}
	 */
	let spinnerComponents = [];

	function addSpinner() {
		if (editingSpinnerIndex >= 0) {
			spinners[editingSpinnerIndex] = { 
				title, 
				items: items.split('\n').map((s) => s.trim()) 
			};
			editingSpinnerIndex = -1;
		} else {
			spinners = [...spinners, { 
				title, 
				items: items.split('\n').map((s) => s.trim()) 
			}];
		}
		title = '';
		items = defaultItems;
		dialog?.close();
	}

	function deleteSpinner(index) {
		spinners = spinners.filter((_, i) => i !== index);
		spinnerValues = spinnerValues.filter((_, i) => i !== index);
	}

	function configureSpinner(index) {
		const spinner = spinners[index];
		title = spinner.title;
		items = spinner.items.join('\n');
		editingSpinnerIndex = index;
		dialog?.showModal();
	}

	function updateSpinnerValue(index, event) {
		const { title, value } = event.detail;
		spinnerValues[index] = { title, value };
		// spinnerValues = [...spinnerValues];
	}

	function openModal() {
		dialog?.showModal();
	}

	function closeModal() {
		title = '';
		items = defaultItems;
		editingSpinnerIndex = -1;
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

	function spinAll() {
		spinnerComponents.forEach(spinner => spinner?.spin());
	}

	function toggleStats() {
		showStats = !showStats;
	}

	$effect(() => {
		// Calculate stats whenever spinnerValues changes
		if (showStats && spinnerValues.length > 0) {
			const numericValues = getNumericValues();
			if (numericValues.length > 0) {
				const total = numericValues.reduce((a, b) => a + b, 0);
				console.log('Total of numeric values:', total);
			}
		}
	});

	function getSpinResults() {
		return Object.entries(spinnerValues.reduce((acc, val) => {
			if (val?.value) acc[val.value] = (acc[val.value] || 0) + 1;
			return acc;
		}, {})).sort((a, b) => b[1] - a[1]);
	}

	function getNumericValues() {
		return spinnerValues
			.filter(v => v?.value && !isNaN(Number(v.value)))
			.map(v => Number(v.value));
	}
</script>

<div
	class="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 transition-colors dark:from-gray-900 dark:to-gray-800"
>
	<div class="absolute left-4 top-4">
		<ThemeToggle />
	</div>
	<div class="flex">
		<!-- Main Content -->
		<main class="flex-1 p-8">
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
					{#each spinners as spinner, i}
						<div
							class="w-full rounded-lg bg-white shadow-md transition-shadow duration-200 hover:shadow-lg dark:bg-gray-800 sm:w-[400px]"
						>
							<Spinner 
								bind:this={spinnerComponents[i]}
								title={spinner.title} 
								items={[...spinner.items]} 
								on:delete={() => deleteSpinner(i)}
								on:configure={() => configureSpinner(i)}
								on:valueChange={(evt) => updateSpinnerValue(i, evt)}
							/>
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
		</main>

		<!-- Results Sidebar -->
		<aside class="w-80 border-l border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-lg font-semibold text-gray-900 dark:text-white">Current Values</h2>
				<div class="flex gap-2">
					{#if spinners.length > 0}
						<button
							on:click={toggleStats}
							class="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
						>
							{showStats ? 'Hide' : 'Show'} Stats
						</button>
						<button
							on:click={spinAll}
							class="rounded-md bg-purple-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-500 dark:hover:bg-purple-600"
						>
							Spin All
						</button>
					{/if}
				</div>
			</div>

			{#if spinners.length === 0}
				<p class="text-gray-500 dark:text-gray-400">No spinners added yet. Add a spinner to see its value here!</p>
			{:else}
				<div class="space-y-3">
					{#each spinners as spinner, i}
						<div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
							<h3 class="font-medium text-gray-900 dark:text-white">{spinner.title || "New Spinner!"}</h3>
							<p class="text-sm text-gray-600 dark:text-gray-300">
								{spinnerValues[i]?.value || 'Not spun yet'}
							</p>
						</div>
					{/each}

					{#if showStats}
						<div class="mt-6 border-t border-gray-200 pt-6 dark:border-gray-600">
							<h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Statistics</h3>
							
							<!-- Numeric Stats -->
							{#if getNumericValues().length > 0}
								{@const values = getNumericValues()}
								<div class="space-y-2">
									<div class="flex justify-between text-sm">
										<span class="text-gray-600 dark:text-gray-300">Total:</span>
										<span class="font-medium text-gray-900 dark:text-white">{values.reduce((a, b) => a + b, 0)}</span>
									</div>
									<div class="flex justify-between text-sm">
										<span class="text-gray-600 dark:text-gray-300">Average:</span>
										<span class="font-medium text-gray-900 dark:text-white">{(values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)}</span>
									</div>
									<div class="flex justify-between text-sm">
										<span class="text-gray-600 dark:text-gray-300">Min:</span>
										<span class="font-medium text-gray-900 dark:text-white">{Math.min(...values)}</span>
									</div>
									<div class="flex justify-between text-sm">
										<span class="text-gray-600 dark:text-gray-300">Max:</span>
										<span class="font-medium text-gray-900 dark:text-white">{Math.max(...values)}</span>
									</div>
								</div>
							{:else}
								<p class="text-sm text-gray-500 dark:text-gray-400">No numeric values to calculate stats</p>
							{/if}

							<!-- General Stats -->
							<div class="mt-4 space-y-2">
								<div class="flex justify-between text-sm">
									<span class="text-gray-600 dark:text-gray-300">Total Spinners:</span>
									<span class="font-medium text-gray-900 dark:text-white">{spinners.length}</span>
								</div>
								<div class="flex justify-between text-sm">
									<span class="text-gray-600 dark:text-gray-300">Spun Spinners:</span>
									<span class="font-medium text-gray-900 dark:text-white">{spinnerValues.filter(v => v?.value).length}</span>
								</div>
								<div class="flex justify-between text-sm">
									<span class="text-gray-600 dark:text-gray-300">Unspun Spinners:</span>
									<span class="font-medium text-gray-900 dark:text-white">{spinners.length - spinnerValues.filter(v => v?.value).length}</span>
								</div>
							</div>
							<div class="mt-6 border-t border-gray-200 pt-4 dark:border-gray-600">
								<h4 class="mb-3 font-medium text-gray-900 dark:text-white">Results Summary</h4>
								<div class="max-h-48 space-y-1 overflow-y-auto">
									{#each getSpinResults() as [value, count]}
										<div class="flex items-center justify-between rounded-md bg-gray-50 px-3 py-1.5 text-sm dark:bg-gray-700">
											<span class="text-gray-700 dark:text-gray-300">{value}</span>
											<span class="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600 dark:bg-purple-900/50 dark:text-purple-300">
												{count} {count === 1 ? 'time' : 'times'}
											</span>
										</div>
									{/each}
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</aside>
	</div>
</div>

<!-- Dialog Modal -->
<dialog
	bind:this={dialog}
	on:close={closeModal}
	class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl backdrop:bg-black backdrop:bg-opacity-50 dark:bg-gray-800"
>
	<div class="relative">
		<!-- Close button -->
		<button
			on:click={closeModal}
			aria-label="Close modal"
			class="absolute right-0 top-1  text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
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
		<div>
			<h2 class="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100">
				{editingSpinnerIndex >= 0 ? 'Edit' : 'Add'} Spinner
			</h2>
		</div>
		<form class="space-y-6 " on:submit|preventDefault={addSpinner}>
			<div class="space-y-4">
				<label class="block" for="title">
					<span class="mb-1 block font-medium text-gray-700 dark:text-gray-300">Title (optional)</span>
					<input
						class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
						type="text"
						id="title"
						placeholder="My Spinner"
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
				type="submit"
				class="w-full rounded-md bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-500 dark:hover:bg-purple-600"
			>
				{editingSpinnerIndex >= 0 ? 'Update' : 'Add'} Spinner
			</button>
		</form>
	</div>
</dialog>
