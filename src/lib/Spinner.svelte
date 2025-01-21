<script>
	import { createEventDispatcher } from 'svelte';
	
	let { items = ['item One', 'item Two', 'item Three', 'item Four'], spinDuration = 3000, title = 'New Spinner!' } = $props();

	/**
	 * @type {HTMLUListElement}
	 */
	let spinner;

	/**
	 * @type {Animation}
	 */
	let animation;
	/**
	 * @type {number}
	 */
	let previousEndDegree = 0;

	let currentValue = $state('');
	const dispatch = createEventDispatcher();

	function dispatchValue() {
		dispatch('valueChange', { title: title || "New Spinner!", value: currentValue });
	}

	function spin() {
		if (animation) {
			animation.cancel(); // Reset the animation if it already exists
		}

		const randomAdditionalDegrees = Math.random() * 360 + 1800;
		const newEndDegree = previousEndDegree + randomAdditionalDegrees;

		animation = spinner.animate(
			[
				{ transform: `rotate(${previousEndDegree}deg)` },
				{ transform: `rotate(${newEndDegree}deg)` }
			],
			{
				duration: spinDuration,
				direction: 'normal',
				easing: 'cubic-bezier(0.440, -0.205, 0.000, 1.130)',
				fill: 'forwards',
				iterations: 1
			}
		);

		previousEndDegree = newEndDegree;

		const normalizeAngle = (finalAngle) => {
			return (360 - finalAngle + 90) % 360;
		};

		const segment = 360 / items.length;
		const offset = 15;

		animation.onfinish = () => {
			const finalAngle = newEndDegree % 360;
			const normalizedAngle = normalizeAngle(finalAngle);
			const winner = Math.floor(((normalizedAngle + offset) % 360) / segment);
			const newValue = items[winner + 1];
			if (currentValue !== newValue) {
				currentValue = newValue;
				dispatchValue();
			}
			dispatch('result', { title: title || "New Spinner!", selectedItem: currentValue });
		};
	}
</script>

<div class="spinner">
		<div class="flex items-center justify-between px-4 py-2 text-gray-800 dark:text-gray-200">
			<button 
				class="p-1 hover:text-red-500 dark:hover:text-red-400 transition-colors" 
				aria-label="Delete spinner"
				on:click={() => dispatch('delete')}
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
				</svg>
			</button>
			<span>{title || "New Spinner!"}</span>
			<button 
				class="p-1 hover:text-purple-500 dark:hover:text-purple-400 transition-colors" 
				aria-label="Configure spinner"
				on:click={() => dispatch('configure')}
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
			</button>
		</div>
	<ul
		style="--item-count: {items.length}; --spin-duration: {spinDuration}ms;"
		on:click={spin}
		on:keydown={(e) => e.key === 'Enter' && spin()}
		tabindex="0"
		role="button"
		aria-label="Spin the wheel"
		bind:this={spinner}
	>
		{#each items as item, idx}
			<li class="item" style="--idx: {idx};">{item}</li>
		{/each}
	</ul>
</div>

<style>
	.spinner {
		all: unset;
		aspect-ratio: 1 / 1;
		container-type: inline-size;
		direction: ltr;
		display: grid;
		position: relative;
		width: 100%;
		&::after {
			aspect-ratio: 1 / cos(30deg);
			background-color: var(--spinner-arrow-color, crimson);
			clip-path: polygon(50% 100%, 100% 0, 0 0);
			content: '';
			height: 4cqi;
			position: absolute;
			place-self: start center;
			translate: 0px 10cqi;
			scale: 1.4;
		}
		ul {
			all: unset;
			box-sizing: border-box;
			font-family: system-ui, sans-serif;
			aspect-ratio: 1 / 1;
			background: var(--spinner-bg, rgb(147, 51, 234)); /* purple-600 */
			container-type: inline-size;
			direction: ltr;
			display: grid;
			place-content: center start;
			clip-path: inset(0 0 0 0 round 50%);

			& li {
				align-content: center;
				background: hsl(calc(360deg / var(--item-count) * calc(var(--idx))), 100%, 75%);
				clip-path: polygon(0% 0, 100% 50%, 0% 100%);
				display: grid;
				font-size: 5cqi;
				grid-area: 1 / -1;
				aspect-ratio: 1 / calc(2 * tan(180deg / var(--item-count)));
				list-style: none;
				padding-left: 1ch;
				rotate: calc(360deg / var(--item-count) * calc(var(--idx) - 1));
				transform-origin: center right;
				width: 50cqi;
			}
		}
	}
	:global(.dark) ul.spinner {
		--spinner-bg: rgb(126, 34, 206); /* purple-700 */
		--spinner-item-bg: rgb(168, 85, 247); /* purple-500 */
		--spinner-text-color: white;
	}
</style>
