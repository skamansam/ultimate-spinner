<script>
	export let items = ["item One", "item Two", "item Three"];
	export let spinDuration = 3000;
	export let title = "New Spinner!";
</script>

{#if title}
	<div style="grid-column: 1 / -1; text-align: center;">{title}</div>
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
		background: crimson;
		container-type: inline-size;
		direction: ltr;
		display: grid;
		place-content: center start;
	}
	ul.spinner li {
		align-content: center;
		background: deepskyblue;
		display: grid;
		font-size: 5cqi;
		grid-area: 1 / -1;
		list-style: none;
		padding-left: 1ch;
		transform-origin: center right;
		width: 50cqi;
		rotate: calc(360deg / var(--item-count) * calc(var(--idx) - 1));
	}
</style>
