/**
 * Elementor Breakout Sections
 *
 * Restores full-width breakout behaviour for Elementor Container layouts.
 * Add the class "breakout-section" to an outer Elementor container.
 */

(function () {
	'use strict';

	/**
	 * Stretch all breakout sections to the full viewport width.
	 *
	 * Each section measures its own current position and shifts itself
	 * left by exactly that amount. This makes the solution robust even
	 * when multiple breakout sections appear directly after each other.
	 */
	function stretchBreakouts() {
		const breakouts = document.querySelectorAll('.breakout-section');

		if (!breakouts.length) {
			return;
		}

		breakouts.forEach((breakout) => {
			// Reset first so the browser can calculate the natural position.
			breakout.classList.remove('breakout-ready');

			breakout.style.position = 'relative';
			breakout.style.width = '100vw';
			breakout.style.maxWidth = '100vw';
			breakout.style.left = '0';
			breakout.style.marginLeft = '0';
			breakout.style.marginRight = '0';
			breakout.style.boxSizing = 'border-box';
			breakout.style.zIndex = '1';
		});

		// Measure in the next frame after Firefox and other browsers
		// have recalculated the layout.
		window.requestAnimationFrame(() => {
			breakouts.forEach((breakout) => {
				const rect = breakout.getBoundingClientRect();

				breakout.style.left = `-${rect.left}px`;
				breakout.classList.add('breakout-ready');
			});
		});
	}

	window.addEventListener('load', stretchBreakouts);
	window.addEventListener('resize', stretchBreakouts);

	document.addEventListener('DOMContentLoaded', () => {
		window.requestAnimationFrame(stretchBreakouts);
	});
})();
