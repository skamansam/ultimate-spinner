<script>

	let {
		items = ['item One', 'item Two', 'item Three', 'item Four'],
		spinDuration = 3000,
		title = 'New Spinner!',
		onDelete = () => console.warn('No handler provided for onDelete event'),
		onConfigure = () => console.warn('No handler provided for onConfigure event'),
		onValueChange = (value) => console.warn('No handler provided for onValueChange event', value)
	} = $props();

	/**
	 * @type {HTMLUListElement}
	 */
	let spinnerElement;

	/**
	 * @type {HTMLDivElement}
	 */
	let headerElement;

	/**
	 * @type {Animation}
	 */
	let animation;
	/**
	 * @type {number}
	 */
	let previousEndDegree = 0;

	/**
	 * @type {string|null}
	 */
	let currentValue = $state('');

	function getResultsAtTop() {
		if (!spinnerElement) return null;

		const rect = headerElement.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const topY = rect.top + rect.height + 30; // 30 pixels below the header
		const element = document.elementFromPoint(centerX, topY);
		if (element?.parentElement !== spinnerElement) return null;
		return element?.textContent?.trim() || null;
	}

	export function spin() {
		if (animation) {
			animation.cancel(); // Reset the animation if it already exists
		}

		const randomAdditionalDegrees = Math.random() * 360 + 1800;
		const newEndDegree = previousEndDegree + randomAdditionalDegrees;

		animation = spinnerElement.animate(
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

		animation.onfinish = () => {
			currentValue = getResultsAtTop();
			onValueChange({ title: title || 'New Spinner!', value: currentValue });
		};
	}
</script>

<div class="spinner">
	<div
		bind:this={headerElement}
		class="flex items-center justify-between px-4 py-2 text-gray-800 dark:text-gray-200"
	>
		<button
			class="p-1 transition-colors hover:text-red-500 dark:hover:text-red-400"
			aria-label="Delete spinner"
			onclick={onDelete}
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
				/>
			</svg>
		</button>
		<span>{title || 'New Spinner!'}</span>
		<button
			class="p-1 transition-colors hover:text-purple-500 dark:hover:text-purple-400"
			aria-label="Configure spinner"
			onclick={onConfigure}
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
				/>
			</svg>
		</button>
	</div>
	<ul
		bind:this={spinnerElement}
		style="--item-count: {items.length}; --spin-duration: {spinDuration}ms;"
		onclick={spin}
		onkeydown={(e) => e.key === 'Enter' && spin()}
		tabindex="0"
		role="button"
		aria-label="Spin the wheel"
		data-itemCount={items.length}
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
			&[data-itemCount='1'] {
				li {
					aspect-ratio: 1/1;
					display: block;
					rotate: 0;
					clip-path: none;
					width: 100cqi;
				}
			}
			&[data-itemCount='2'] {
				li {
					height: 100cqi;
					clip-path: none;
				}
			}
			&[data-itemCount='3'] {
				li {
					aspect-ratio: 1 / 2;
					clip-path: polygon(-35% -100%, 100% 50%, 0% 145%);
				}
			}
		}
	}
	:global(.dark) ul.spinner {
		--spinner-bg: rgb(126, 34, 206); /* purple-700 */
		--spinner-item-bg: rgb(168, 85, 247); /* purple-500 */
		--spinner-text-color: white;
	}
</style>
