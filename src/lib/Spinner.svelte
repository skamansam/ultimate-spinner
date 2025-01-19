<script>
	export let items = ["item One", "item Two", "item Three"];
	export let spinDuration = 3000;
	export let title = "New Spinner!";
</script>

{#if title}
	<div class="text-gray-800 dark:text-gray-200" style="grid-column: 1 / -1; text-align: center;">{title}</div>
{/if}
<ul class="spinner" style="--item-count: ${items.length}; --spin-duration: ${spinDuration}ms;">
	{#each items as item, idx}
		<li class="item" style="--idx: ${idx};">{item}</li>
	{/each}
</ul>

<style>
	ul.spinner {
		all: unset;
		aspect-ratio: 1 / 1;
		background: var(--spinner-bg, rgb(147, 51, 234));  /* purple-600 */
		container-type: inline-size;
		direction: ltr;
		display: grid;
		place-content: center start;
	}
	ul.spinner li {
		align-content: center;
		background: var(--spinner-item-bg, rgb(216, 180, 254));  /* purple-300 */
		display: grid;
		font-size: 5cqi;
		grid-area: 1 / -1;
		list-style: none;
		padding-left: 1ch;
		transform-origin: center right;
		width: 50cqi;
		rotate: calc(360deg / var(--item-count) * calc(var(--idx) - 1));
		color: var(--spinner-text-color, rgb(88, 28, 135));  /* purple-800 */
	}

	:global(.dark) ul.spinner {
		--spinner-bg: rgb(126, 34, 206);  /* purple-700 */
		--spinner-item-bg: rgb(168, 85, 247);  /* purple-500 */
		--spinner-text-color: white;
	}
</style>
