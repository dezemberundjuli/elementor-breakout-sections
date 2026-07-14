/**
 * Elementor Breakout Sections
 *
 * Restores full-width breakout behaviour for Elementor Container layouts.
 * Add the class "breakout-section" to an outer Elementor container.
 */

(function () {
	'use strict';

	function getViewportWidth() {
		return document.documentElement.clientWidth || window.innerWidth;
	}

	function stretchBreakouts() {
		const breakouts = document.querySelectorAll('.breakout-section');

		if (!breakouts.length) {
			return;
		}

		const viewportWidth = getViewportWidth();

		breakouts.forEach((breakout) => {
			breakout.classList.remove('breakout-ready');

			breakout.style.position = 'relative';
			breakout.style.setProperty('width', viewportWidth + 'px', 'important');
			breakout.style.setProperty('max-width', viewportWidth + 'px', 'important');
			breakout.style.left = '0';
			breakout.style.marginLeft = '0';
			breakout.style.marginRight = '0';
			breakout.style.boxSizing = 'border-box';
			breakout.style.zIndex = '1';
		});

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
