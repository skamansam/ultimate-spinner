<script>
	import Spinner from '$lib/Spinner.svelte'
    import ThemeToggle from '$lib/ThemeToggle.svelte'
    import { onMount } from 'svelte';
    import { theme } from '$lib/stores/theme.js';

    let title = '';
	let items = ['item One', 'item Two', 'item Three'];
	let spinners = [{title: "New Spinner!", items: ['item One', 'item Two', 'item Three']}];
    let dialog;

	function handleSubmit() {
		spinners = [...spinners, { title, items: items.split(',').map(s => s.trim()) }];
		title = '';
		items = '';
        dialog?.close();
	}

    function openModal() {
        dialog?.showModal();
    }

    function closeModal() {
        dialog?.close();
    }
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-8 transition-colors">
    <ThemeToggle />
    <div class="max-w-4xl mx-auto space-y-8">
        <header class="text-center space-y-4">
            <h1 class="text-4xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">Jacob's Dad's Ultimate Spinner!</h1>
            <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                This is an ad-free ultimate spinner page. You can use it for free! I did this because I hate all 
                the ads on all the other spinner sites. This is also optimized with CSS, so it is as fast as possible.
            </p>
        </header>

        <div class="flex flex-wrap justify-center gap-6">
            {#each spinners as spinner}
                <div class="w-full sm:w-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                    <Spinner title={spinner.title} items={[...spinner.items]} />
                </div>
            {/each}
            <!-- Add Spinner Button -->
            <button 
                on:click={openModal}
                aria-label="Add new spinner"
                class="w-full sm:w-[400px] aspect-square flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 group"
            >
                <svg 
                    class="w-16 h-16 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200" 
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
    class="p-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full backdrop:bg-black backdrop:bg-opacity-50"
>
    <div class="relative">
        <!-- Close button -->
        <button 
            on:click={closeModal}
            aria-label="Close modal"
            class="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <!-- Dialog content -->
        <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Create New Spinner</h2>
            <form class="space-y-6" on:submit|preventDefault={handleSubmit}>
                <div class="space-y-4">
                    <label class="block" for="title">
                        <span class="text-gray-700 dark:text-gray-300 font-medium mb-1 block">Title</span>
                        <input 
                            class="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            type="text" 
                            id="title" 
                            placeholder="Enter spinner title"
                            autofocus
                            bind:value={title} 
                        />
                    </label>
                    <label class="block" for="items">
                        <span class="text-gray-700 dark:text-gray-300 font-medium mb-1 block">Items (comma-separated)</span>
                        <input 
                            class="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            type="text" 
                            id="items" 
                            placeholder="Item 1, Item 2, Item 3"
                            bind:value={items} 
                        />
                    </label>
                </div>
                <button 
                    class="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200 ease-in-out transform hover:scale-105"
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
