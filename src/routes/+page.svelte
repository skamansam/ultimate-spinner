<script>
	import Spinner from '$lib/Spinner.svelte';
	import ThemeToggle from '$lib/ThemeToggle.svelte';

	/**
	 * @typedef {Object} SpinnerValue
	 * @property {string} title - The title of the spinner
	 * @property {string|null} value - The current value selected by the spinner
	 */

	/**
	 * @typedef {Object} SpinnerConfig
	 * @property {string} title - The title of the spinner
	 * @property {string[]} items - The list of items in the spinner
	 */

	/**
	 * @typedef {Object} SpinSnapshot
	 * @property {string} id - Unique identifier for the snapshot
	 * @property {string} timestamp - ISO timestamp when the snapshot was recorded
	 * @property {{ title: string, value: string|null }[]} values - Spinner titles and values at that moment
	 * @property {[string, number][]} results - Aggregated results list as shown in the Results tab at that time
	 */

	/**
	 * @typedef {Object} CustomSet
	 * @property {string} name - Display name of the custom combination
	 * @property {SpinnerConfig[]} spinners - Spinners included in the combination
	 */

	const defaultItems = 'item One\nitem Two\nitem Three\nitem Four';
	const STORAGE_KEY = 'ultimate-spinner-state-v1';

	/** Used to temporarily store the title and items when editing a spinner
	 * @type {string}
	 */
	let title = $state('');
	/**
	 * @type {string}
	 */
	let items = $state(defaultItems);

	/**
	 * @type {SpinnerConfig[]}
	 */

	/** @type {SpinnerConfig[]} */
	let spinners = $state([]);
	let editingSpinnerIndex = $state(-1);
	/** @type {SpinnerValue[]} */
	let spinnerValues = $state([]);
	let showStats = $state(false);
	let activeTab = $state('values');
	/** @type {CustomSet[]} */
	let customSets = $state([]);
	let customSetName = $state('');
	let importJson = $state('');
	let exportJson = $state('');
	let customSelection = $state([]);
	let isExportMode = $state(false);
	/** @type {SpinSnapshot[]} */
	let spinHistory = $state([]);
	let expandedHistoryIndex = $state(null);

	/** @type {HTMLDialogElement} */
	let dialog;
	/** @type {HTMLDialogElement} */
	let importDialog;
	/** @type {HTMLDialogElement} */
	let exportDialog;
	/** @type {HTMLDialogElement} */
	let saveDialog;

	/** @type {import('$lib/Spinner.svelte').default[]} */
	let spinnerComponents = [];

	/**
	 * Adds a new spinner to the list
	 * @param {SubmitEvent} evt
	 */
	function addSpinner(evt) {
		evt.preventDefault();
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

	/**
	 * Deletes a spinner at the specified index
	 * @param {number} index - Index of the spinner to delete
	 */
	function deleteSpinner(index) {
		spinners = spinners.filter((_, i) => i !== index);
		spinnerValues = spinnerValues.filter((_, i) => i !== index);
	}

	/**
	 * Duplicates a spinner at the specified index
	 * @param {number} index - Index of the spinner to duplicate
	 */
	function duplicateSpinner(index) {
		const original = spinners[index];
		if (!original) return;
		const clonedSpinner = {
			title: original.title,
			items: [...original.items]
		};
		spinners = [
			...spinners.slice(0, index + 1),
			clonedSpinner,
			...spinners.slice(index + 1)
		];
		const originalValue = spinnerValues[index] ?? null;
		spinnerValues = [
			...spinnerValues.slice(0, index + 1),
			originalValue,
			...spinnerValues.slice(index + 1)
		];
	}

	/**
	 * Opens the modal to configure an existing spinner
	 * @param {number} index - Index of the spinner to configure
	 */
	function configureSpinner(index) {
		const spinner = spinners[index];
		title = spinner.title;
		items = spinner.items.join('\n');
		editingSpinnerIndex = index;
		dialog?.showModal();
	}

	/**
	 * Updates the spinner value at the specified index
	 * @param {number} index - Index of the spinner to update
	 * @param {{ title: string, value: string }} event - Event containing the new value
	 */
	function updateSpinnerValue(index, event) {
		const { title, value } = event;
		spinnerValues[index] = { title, value };
	}

	/**
	 * Opens the modal for adding/editing a spinner
	 */
	function openModal() {
		dialog?.showModal();
	}

	/**
	 * Closes the modal and resets its state
	 */
	function closeModal() {
		title = '';
		items = defaultItems;
		editingSpinnerIndex = -1;
		dialog?.close();
	}

	/**
	 * Spins all spinners simultaneously
	 */
	function spinAll() {
		if (spinners.length > 0) {
			// Capture the current aggregated results exactly as shown in the Results tab
			const currentResults = getSpinResults();
			const snapshotValues = spinners.map((spinner, index) => ({
				title: spinner.title || 'New Spinner!',
				value: spinnerValues[index]?.value ?? null
			}));
			const snapshot = {
				id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
				timestamp: new Date().toISOString(),
				values: snapshotValues,
				results: currentResults
			};
			spinHistory = [snapshot, ...spinHistory];
		}
		spinnerComponents.forEach(spinner => spinner?.spin());
	}

	/**
	 * Toggles the visibility of statistics
	 */
	function toggleStats() {
		showStats = !showStats;
	}

	/**
	 * Gets the summary of all spin results
	 * @returns {[string, number][]} Array of [value, count] pairs
	 */
	function getSpinResults() {
		return Object.entries(spinnerValues.reduce((acc, val) => {
			if (val?.value) acc[val.value] = (acc[val.value] || 0) + 1;
			return acc;
		}, {})).sort((a, b) => b[1] - a[1]);
	}

	/**
	 * Gets the numeric values of all spin results
	 * @returns {number[]} Array of numeric values
	 */
	function getNumericValues() {
		return spinnerValues
			.filter(v => v?.value && !isNaN(Number(v.value)))
			.map(v => Number(v.value));
	}

	/**
	 * Computes spin results for a given snapshot
	 * @param {SpinSnapshot} snapshot
	 * @returns {[string, number][]}
	 */
	function getResultsFromSnapshot(snapshot) {
		// Prefer stored results if available (they were captured from getSpinResults at the time)
		if (Array.isArray(snapshot.results) && snapshot.results.length > 0) {
			return snapshot.results;
		}
		// Fallback for older snapshots that don't have a results field
		const acc = {};
		for (const entry of snapshot.values) {
			if (!entry?.value) continue;
			acc[entry.value] = (acc[entry.value] || 0) + 1;
		}
		return Object.entries(acc).sort((a, b) => b[1] - a[1]);
	}

	/**
	 * Adds test spinners to the list
	 */
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

	/**
	 * Adds fruit spinners to the list
	 */
	function addFruitSpinners() {
		spinners = [
			{ title: 'Fruits', items: ['Apple', 'Banana', 'Orange', 'Grape', 'Mango'] },
			{ title: 'Colors', items: ['Red', 'Blue', 'Green', 'Yellow', 'Purple'] },
			{ title: 'Animals', items: ['Lion', 'Tiger', 'Bear', 'Eagle', 'Wolf'] }
		];
		spinnerValues = new Array(spinners.length).fill(null);
	}

	/**
	 * Adds random number spinners to the list
	 */
	function addRandomNumberSpinners() {
		const numSpinners = Math.floor(Math.random() * 5) + 3; // 3-7 spinners
		const spinnerList = [];
		
		for (let i = 0; i < numSpinners; i++) {
			const numItems = Math.floor(Math.random() * 8) + 4; // 4-11 items
			const items = Array.from({ length: numItems }, (_, idx) => 
				(Math.floor(Math.random() * 100) + 1).toString()
			);
			spinnerList.push({
				title: `Number Spinner ${i + 1}`,
				items: [...new Set(items)] // Remove any duplicates
			});
		}
		
		spinners = spinnerList;
		spinnerValues = new Array(spinners.length).fill(null);
	}

	/**
	 * Adds large item spinners to the list
	 */
	function addLargeItemSpinners() {
		const months = [
			'January', 'February', 'March', 'April', 'May', 'June', 
			'July', 'August', 'September', 'October', 'November', 'December'
		];
		
		const cards = Array.from({ length: 52 }, (_, i) => {
			const suits = ['♠', '♥', '♦', '♣'];
			const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
			const suit = suits[Math.floor(i / 13)];
			const value = values[i % 13];
			return `${value}${suit}`;
		});

		const letters = Array.from({ length: 26 }, (_, i) => 
			String.fromCharCode(65 + i)
		);

		spinners = [
			{ title: 'Calendar Spinner', items: months },
			{ title: 'Card Deck', items: cards },
			{ title: 'Alphabet', items: letters }
		];
		spinnerValues = new Array(spinners.length).fill(null);
	}

	/**
	 * Adds mixed examples to the list
	 */
	function addMixedExamples() {
		spinners = [
			{ 
				title: 'Decision Maker',
				items: ['Yes', 'No', 'Maybe', 'Ask Again', 'Definitely', 'No Way']
			},
			{
				title: 'Lunch Picker',
				items: ['Pizza', 'Sushi', 'Salad', 'Burger', 'Tacos', 'Sandwich', 'Pasta']
			},
			{
				title: 'Break Timer',
				items: ['5 mins', '10 mins', '15 mins', '20 mins', '30 mins']
			},
			{
				title: 'Team Roles',
				items: ['Leader', 'Timekeeper', 'Note Taker', 'Presenter']
			}
		];
		spinnerValues = new Array(spinners.length).fill(null);
	}

	/**
	 * Saves the current set of spinners as a named custom combination
	 */
	function saveCurrentAsCustom() {
		if (!spinners.length) return;
		const name = customSetName.trim() || `Custom Set ${customSets.length + 1}`;
		const snapshot = spinners.map((s) => ({
			title: s.title,
			items: [...s.items]
		}));
		customSets = [...customSets, { name, spinners: snapshot }];
		customSetName = '';
		if (saveDialog) {
			saveDialog.close();
		}
	}

	/**
	 * Loads a previously saved custom combination, replacing current spinners
	 * @param {number} index
	 */
	function loadCustomSet(index) {
		const set = customSets[index];
		if (!set) return;
		spinners = set.spinners.map((s) => ({
			title: s.title,
			items: [...s.items]
		}));
		spinnerValues = new Array(spinners.length).fill(null);
		activeTab = 'values';
	}

	/**
	 * Deletes a saved custom combination
	 * @param {number} index
	 */
	function deleteCustomSet(index) {
		customSets = customSets.filter((_, i) => i !== index);
	}

	function importCustomFromJson() {
		if (!importJson.trim()) return;
		try {
			const parsed = JSON.parse(importJson);
			const rawSets = Array.isArray(parsed) ? parsed : [parsed];
			const imported = rawSets
				.filter((s) => s)
				.map((s, idx) => {
					let name;
					let rawSpinners;

					if (Array.isArray(s)) {
						name = `Imported Set ${customSets.length + idx + 1}`;
						rawSpinners = s;
					} else {
						name =
							typeof s.name === 'string' && s.name.trim().length > 0
								? s.name
								: `Imported Set ${customSets.length + idx + 1}`;
						rawSpinners = Array.isArray(s.spinners) ? s.spinners : [];
					}

					const normalizedSpinners = (rawSpinners || [])
						.filter((sp) => sp && typeof sp === 'object')
						.map((sp) => ({
							title: typeof sp.title === 'string' ? sp.title : '',
							items: Array.isArray(sp.items) ? sp.items.map((it) => String(it)) : []
						}))
						.filter((sp) => sp.items.length > 0);

					if (!normalizedSpinners.length) return null;
					return { name, spinners: normalizedSpinners };
				})
				.filter((s) => s !== null);

			if (imported.length > 0) {
				customSets = [...customSets, ...imported];
				importJson = '';
				if (importDialog) {
					importDialog.close();
				}
			}
		} catch (e) {}
	}

	function openImportDialog() {
		importDialog?.showModal();
	}

	function openSaveDialog() {
		if (!spinners.length) return;
		customSetName = '';
		saveDialog?.showModal();
	}

	function toggleCustomSelection(index, value) {
		customSelection[index] = value;
	}

	function openExportDialog() {
		const selected = customSets.filter((_, i) => customSelection[i]);
		if (!selected.length) return;
		exportJson = JSON.stringify(selected, null, 2);
		exportDialog?.showModal();
	}

	import { onMount } from 'svelte';

	onMount(() => {
		try {
			if (typeof localStorage !== 'undefined') {
				const raw = localStorage.getItem(STORAGE_KEY);
				if (raw) {
					const parsed = JSON.parse(raw);
					if (Array.isArray(parsed.spinners) && Array.isArray(parsed.spinnerValues)) {
						spinners = parsed.spinners.map((s) => ({
							title: typeof s?.title === 'string' ? s.title : '',
							items: Array.isArray(s?.items) ? s.items.map((it) => String(it)) : []
						}));
						spinnerValues = parsed.spinnerValues.map((v) =>
							v && typeof v === 'object'
								? {
									title: typeof v.title === 'string' ? v.title : '',
									value: v.value ?? null
								}
								: null
						);
						if (typeof parsed.activeTab === 'string') {
							activeTab = parsed.activeTab;
						}
						if (typeof parsed.showStats === 'boolean') {
							showStats = parsed.showStats;
						}
					}
					if (Array.isArray(parsed.customSets)) {
						customSets = parsed.customSets
							.filter((s) => s && typeof s === 'object')
							.map((s, idx) => ({
								name:
									typeof s.name === 'string' && s.name.trim().length > 0
											? s.name
											: `Custom Set ${idx + 1}`,
								spinners: Array.isArray(s.spinners)
									? s.spinners.map((sp) => ({
											title: typeof sp?.title === 'string' ? sp.title : '',
											items: Array.isArray(sp?.items)
												? sp.items.map((it) => String(it))
												: []
										}))
									: []
							}));
					}
					if (Array.isArray(parsed.spinHistory)) {
						spinHistory = parsed.spinHistory
							.filter((s) => s && typeof s === 'object' && Array.isArray(s.values))
							.map((s) => ({
								id: typeof s.id === 'string' ? s.id : String(Date.now()),
								timestamp: typeof s.timestamp === 'string' ? s.timestamp : new Date().toISOString(),
								values: s.values
									.filter((v) => v && typeof v === 'object')
									.map((v) => ({
										title: typeof v.title === 'string' ? v.title : '',
										value: v.value ?? null
									})),
								results: Array.isArray(s.results) ? s.results : []
							}));
					}
				}
			}
		} catch (e) {}
		if (spinners.length === 0) {
			activeTab = 'examples';
		}
	});

	$effect(() => {
		// Keep selection array in sync with customSets length
		customSets;
		customSelection = new Array(customSets.length).fill(false);
	});

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

	$effect(() => {
		const payload = {
			spinners,
			spinnerValues,
			activeTab,
			showStats,
			customSets,
			spinHistory
		};
		try {
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
			}
		} catch (e) {}
	});
</script>

<svelte:head>
	<title>Jacob's Dad's Ultimate Spinner!</title>
</svelte:head>

<div
	class="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 transition-colors dark:from-gray-900 dark:to-gray-800"
>
	<div class="absolute left-4 top-4">
		<ThemeToggle />
	</div>
	<div class="flex min-h-screen bg-white dark:bg-gray-900">
		<main class="flex-1 p-6">
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
								onDelete={() => deleteSpinner(i)}
								onConfigure={() => configureSpinner(i)}
								onDuplicate={() => duplicateSpinner(i)}
								onValueChange={(evt) => updateSpinnerValue(i, evt)}
							/>
						</div>
					{/each}
					<!-- Add Spinner Button -->
					<button
						onclick={openModal}
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
		<aside class="w-96 flex-none border-l border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-lg font-semibold text-gray-900 dark:text-white">Current Values</h2>
				<div class="flex gap-2">
					{#if spinners.length > 0}
						<button
							onclick={spinAll}
							class="rounded-md bg-purple-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-500 dark:hover:bg-purple-600"
						>
							Spin All
						</button>
					{/if}
				</div>
			</div>

			<!-- Tab Bar -->
			<div class="border-b border-gray-200 dark:border-gray-700 mb-4">
				<nav class="-mb-px flex space-x-4" aria-label="Tabs">
					<button
						onclick={() => activeTab = 'values'}
						class="whitespace-nowrap px-1 py-2 text-sm font-medium {activeTab === 'values' ? 'border-b-2 border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400' : 'text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}"
					>
						Values
					</button>
					<button
						onclick={() => activeTab = 'results'}
						class="whitespace-nowrap px-1 py-2 text-sm font-medium {activeTab === 'results' ? 'border-b-2 border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400' : 'text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}"
					>
						Results
					</button>
					<button
						onclick={() => activeTab = 'stats'}
						class="whitespace-nowrap px-1 py-2 text-sm font-medium {activeTab === 'stats' ? 'border-b-2 border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400' : 'text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}"
					>
						Stats
					</button>
					<button
						onclick={() => activeTab = 'custom'}
						class="whitespace-nowrap px-1 py-2 text-sm font-medium {activeTab === 'custom' ? 'border-b-2 border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400' : 'text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}"
					>
						Custom
					</button>
					<button
						onclick={() => activeTab = 'examples'}
						class="whitespace-nowrap px-1 py-2 text-sm font-medium {activeTab === 'examples' ? 'border-b-2 border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400' : 'text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}"
					>
						Examples
					</button>
				</nav>
			</div>

			{#if activeTab === 'values'}
				{#if spinners.length === 0}
					{#if activeTab !== 'examples'}
						<p class="text-gray-500 dark:text-gray-400">No spinners added yet. Add a spinner to see its value here!</p>
					{/if}
				{:else}
					<div class="space-y-6">
						<div class="space-y-3">
							{#each spinners as spinner, i}
								<div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
									<h3 class="font-medium text-gray-900 dark:text-white">{spinner.title || "New Spinner!"}</h3>
									<p class="text-sm text-gray-600 dark:text-gray-300">
										{spinnerValues[i]?.value || 'Not spun yet'}
									</p>
								</div>
							{/each}
						</div>

						<div class="space-y-2">
							<h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100">Previous spins</h3>
							{#if spinHistory.length === 0}
								<p class="text-xs text-gray-500 dark:text-gray-400">No previous spins recorded yet. Use "Spin All" to record a snapshot.</p>
							{:else}
								<ul class="space-y-2 max-h-64 overflow-y-auto pr-1">
									{#each spinHistory as snapshot, i}
										<li class="rounded-md border border-gray-200 bg-white p-2 text-xs dark:border-gray-700 dark:bg-gray-800">
											<button
												type="button"
												onclick={() => expandedHistoryIndex = expandedHistoryIndex === i ? null : i}
												class="flex w-full items-center justify-between gap-2 text-left"
											>
												<span class="truncate text-gray-800 dark:text-gray-100">
													{#if snapshot.values.filter(v => v.value).length > 0}
														{snapshot.values
															.filter(v => v.value)
															.map(v => v.value)
															.join(', ')}
													{:else}
														(No values)
													{/if}
												</span>
												<span class="ml-2 flex-shrink-0 text-[10px] text-gray-500 dark:text-gray-400">
													{new Date(snapshot.timestamp).toLocaleTimeString()}
													</span>
											</button>
											{#if expandedHistoryIndex === i}
												<ul class="mt-2 space-y-1">
													{#each snapshot.values as entry}
														<li class="flex justify-between text-[11px] text-gray-700 dark:text-gray-200">
															<span class="mr-2 truncate font-medium">{entry.title}</span>
															<span class="truncate">{entry.value ?? 'Not spun'}</span>
														</li>
													{/each}
												</ul>
											{/if}
										</li>
									{/each}
								</ul>
							{/if}
						</div>
					</div>
				{/if}
			{/if}

			{#if activeTab === 'results'}
				{#if spinners.length === 0}
					<p class="text-gray-500 dark:text-gray-400">No spinners added yet. Add a spinner to see results here!</p>
				{:else}
					<div class="space-y-6">
						<div class="max-h-[calc(100vh-300px)] space-y-1 overflow-y-auto">
							{#each getSpinResults() as [value, count]}
								<div class="flex items-center justify-between rounded-md bg-gray-50 px-3 py-1.5 text-sm dark:bg-gray-700">
									<span class="text-gray-700 dark:text-gray-300">{value}</span>
									<span class="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600 dark:bg-purple-900/50 dark:text-purple-300">
										{count} {count === 1 ? 'time' : 'times'}
									</span>
								</div>
							{:else}
								<p class="text-sm text-gray-500 dark:text-gray-400">No results yet</p>
							{/each}
						</div>

						<div class="space-y-2">
							<h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100">Previous results</h3>
							{#if spinHistory.length === 0}
								<p class="text-xs text-gray-500 dark:text-gray-400">No previous results recorded yet.</p>
							{:else}
								<ul class="space-y-1 max-h-48 overflow-y-auto pr-1 text-xs">
									{#each spinHistory as snapshot}
										{@const results = getResultsFromSnapshot(snapshot)}
										<li class="rounded-md bg-gray-50 px-2 py-1 dark:bg-gray-800">
											<span class="text-gray-800 dark:text-gray-100">
												{#if results.length > 0}
													{results.map(([value, count]) => `${value}${count > 1 ? "x" + count : ""}`).join(', ')}
												{:else}
													(No results)
												{/if}
											</span>
										</li>
									{/each}
								</ul>
							{/if}
						</div>
					</div>
				{/if}
			{/if}

			{#if activeTab === 'stats'}
				{#if spinners.length === 0}
					<p class="text-gray-500 dark:text-gray-400">No spinners added yet. Add a spinner to see statistics here!</p>
				{:else}
					<div class="space-y-4">
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
						<div class="space-y-2">
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
						{#if showStats}
							<div data-testid="stats-panel" class="mt-4">
								<h3 class="text-lg font-semibold mb-2">Spin Results:</h3>
								<ul class="space-y-1">
									{#each getSpinResults() as [value, count]}
										<li data-testid="spin-result" class="flex justify-between">
											<span>{value}</span>
											<span class="text-gray-600 dark:text-gray-400">{count} times</span>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>
				{/if}
			{/if}

			{#if activeTab === 'custom'}
				<div class="space-y-4">
					<div class="flex flex-wrap items-center justify-between gap-2">
						<div class="flex flex-wrap gap-2">
							<button
								onclick={openImportDialog}
								class="rounded-md bg-purple-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-500 dark:hover:bg-purple-600"
							>
								Import
							</button>
							<button
								onclick={openSaveDialog}
								class="rounded-md bg-green-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-500 dark:hover:bg-green-600"
							>
								Save combination
							</button>
							<button
								onclick={() => {
									isExportMode = !isExportMode;
									if (!isExportMode) {
										customSelection = new Array(customSets.length).fill(false);
									}
								}}
								class="rounded-md bg-gray-200 px-3 py-2 text-xs font-medium text-gray-800 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
							>
								{isExportMode ? 'Cancel export' : 'Export'}
							</button>
						</div>
						{#if isExportMode}
							<button
								onclick={openExportDialog}
								class="rounded-md bg-purple-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-500 dark:hover:bg-purple-600"
							>
								Export as JSON
							</button>
						{/if}
					</div>

					<div class="space-y-2">
						{#if customSets.length === 0}
							<p class="text-sm text-gray-500 dark:text-gray-400">
								No custom combinations saved yet.
							</p>
						{:else}
							{#each customSets as custom, i}
								<div class="flex items-center justify-between rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-700">
									{#if isExportMode}
										<div class="mr-3">
											<input
												type="checkbox"
												checked={customSelection[i] || false}
												onchange={(e) => toggleCustomSelection(i, e.currentTarget.checked)}
											/>
										</div>
									{/if}
									<div class="flex-1">
										<p class="font-medium text-gray-900 dark:text-white">{custom.name}</p>
										<p class="text-xs text-gray-600 dark:text-gray-300">{custom.spinners.length} spinners</p>
									</div>
									<div class="flex gap-2">
										<button
											onclick={() => loadCustomSet(i)}
											class="rounded-md bg-purple-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-500 dark:hover:bg-purple-600"
										>
											Load
										</button>
										<button
											onclick={() => deleteCustomSet(i)}
											class="rounded-md bg-gray-200 px-2 py-1 text-xs font-medium text-gray-800 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
										>
											Delete
										</button>
									</div>
								</div>
							{/each}
						{/if}
					</div>
				</div>
			{/if}

			{#if activeTab === 'examples'}
				<div class="space-y-4">
					<div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
						<h3 class="mb-3 font-medium text-gray-900 dark:text-white">Test Examples</h3>
						<button
							onclick={addTestSpinners}
							class="mb-2 w-full rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-500 dark:hover:bg-purple-600"
						>
							Load Test Spinners
						</button>
						<p class="text-sm text-gray-600 dark:text-gray-300">
							Adds a bunch of spinners used for testing
						</p>
					</div>
					<div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
						<h3 class="mb-3 font-medium text-gray-900 dark:text-white">Basic Examples</h3>
						<button
							onclick={addFruitSpinners}
							class="mb-2 w-full rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-500 dark:hover:bg-purple-600"
						>
							Load Fruit Spinners
						</button>
						<p class="text-sm text-gray-600 dark:text-gray-300">
							Adds three spinners with fruits, colors, and animals
						</p>
					</div>

					<div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
						<h3 class="mb-3 font-medium text-gray-900 dark:text-white">Number Spinners</h3>
						<button
							onclick={addRandomNumberSpinners}
							class="mb-2 w-full rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-500 dark:hover:bg-purple-600"
						>
							Generate Random Number Spinners
						</button>
						<p class="text-sm text-gray-600 dark:text-gray-300">
							Creates 3-7 spinners with random numbers from 1-100
						</p>
					</div>

					<div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
						<h3 class="mb-3 font-medium text-gray-900 dark:text-white">Large Item Sets</h3>
						<button
							onclick={addLargeItemSpinners}
							class="mb-2 w-full rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-500 dark:hover:bg-purple-600"
						>
							Load Large Item Spinners
						</button>
						<p class="text-sm text-gray-600 dark:text-gray-300">
							Adds spinners with months, playing cards, and alphabet
						</p>
					</div>

					<div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
						<h3 class="mb-3 font-medium text-gray-900 dark:text-white">Mixed Examples</h3>
						<button
							onclick={addMixedExamples}
							class="mb-2 w-full rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-500 dark:hover:bg-purple-600"
						>
							Load Mixed Examples
						</button>
						<p class="text-sm text-gray-600 dark:text-gray-300">
							Adds practical spinners for decision making, lunch picking, and more
						</p>
					</div>
				</div>
			{/if}
		</aside>
	</div>
</div>

<!-- Dialog Modal -->
<dialog
	bind:this={dialog}
	onclose={closeModal}
	class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl backdrop:bg-black backdrop:bg-opacity-50 dark:bg-gray-800"
>
	<div class="relative">
		<!-- Close button -->
		<button
			onclick={closeModal}
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
		<form class="space-y-6 " onsubmit={addSpinner}>
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

<dialog
	bind:this={saveDialog}
	class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl backdrop:bg-black backdrop:bg-opacity-50 dark:bg-gray-800"
>
	<div class="relative">
		<button
			onclick={() => saveDialog?.close()}
			aria-label="Close save combination dialog"
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
		<h2 class="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">Save Current Combination</h2>
		<p class="mb-3 text-sm text-gray-600 dark:text-gray-300">
			Give this set of spinners a name so you can reuse it later from the Custom tab.
		</p>
		<div class="space-y-4">
			<input
				class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
				type="text"
				placeholder="Custom set name (optional)"
				autofocus={true}
				bind:value={customSetName}
			/>
			<div class="flex justify-end gap-2">
				<button
					onclick={() => saveDialog?.close()}
					class="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
				>
					Cancel
				</button>
				<button
					onclick={saveCurrentAsCustom}
					class="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-500 dark:hover:bg-purple-600"
				>
					Save Combination
				</button>
			</div>
		</div>
	</div>
</dialog>

<dialog
	bind:this={importDialog}
	class="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl backdrop:bg-black backdrop:bg-opacity-50 dark:bg-gray-800"
>
	<div class="relative">
		<button
			onclick={() => importDialog?.close()}
			aria-label="Close import dialog"
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
		<h2 class="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">Import Custom Presets</h2>
		<p class="mb-3 text-sm text-gray-600 dark:text-gray-300">
			Paste JSON for a single custom set, an array of custom sets, or an array of spinner arrays.
		</p>
		<textarea
			class="w-full min-h-[250px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
			placeholder='Example: &#123;"name":"My Set","spinners":[&#123;"title":"Spinner","items":["A","B"]&#125;]&#125;'
			bind:value={importJson}
		></textarea>
		<div class="mt-4 flex justify-end gap-2">
			<button
				onclick={() => importDialog?.close()}
				class="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
			>
				Cancel
			</button>
			<button
				onclick={importCustomFromJson}
				class="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-500 dark:hover:bg-purple-600"
			>
				Import
			</button>
		</div>
	</div>
</dialog>

<dialog
	bind:this={exportDialog}
	class="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl backdrop:bg-black backdrop:bg-opacity-50 dark:bg-gray-800"
>
	<div class="relative">
		<button
			onclick={() => exportDialog?.close()}
			aria-label="Close export dialog"
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
		<h2 class="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">Export Custom Presets</h2>
		<p class="mb-3 text-sm text-gray-600 dark:text-gray-300">
			Copy this JSON to share or reuse the selected custom presets.
		</p>
		<textarea
			class="w-full min-h-[250px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
			readonly
			bind:value={exportJson}
		></textarea>
		<div class="mt-4 flex justify-end">
			<button
				onclick={() => exportDialog?.close()}
				class="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-500 dark:hover:bg-purple-600"
			>
				Close
			</button>
		</div>
	</div>
</dialog>
