<script>
	export let items = ['item One', 'item Two', 'item Three', 'item Four'];
	export let spinDuration = 3000;
	export let title = 'New Spinner!';

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
				duration: 4000,
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
			console.log(items[winner]);
		};
	}
</script>

<div class="spinner">
	{#if title}
		<div class="text-gray-800 dark:text-gray-200" style="grid-column: 1 / -1; text-align: center;">
			{title}
		</div>
	{/if}
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
			translate: 0px 6cqi;
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
