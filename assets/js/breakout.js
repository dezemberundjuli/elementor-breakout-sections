/**
 * Elementor Breakout Sections
 *
 * Restores full-width breakout behaviour for Elementor Container layouts.
 * Add the class "breakout-section" to an outer Elementor container.
 */

(function () {
	'use strict';

	let scheduled = false;
	let isUpdating = false;

	function getViewportWidth() {
		return document.documentElement.clientWidth || window.innerWidth;
	}

	function stretchBreakouts() {
		const breakouts = document.querySelectorAll('.breakout-section');

		if (!breakouts.length) {
			return;
		}

		const viewportWidth = getViewportWidth();

		isUpdating = true;

		breakouts.forEach((breakout) => {
			breakout.style.position = 'relative';
			breakout.style.setProperty('width', viewportWidth + 'px', 'important');
			breakout.style.setProperty('max-width', viewportWidth + 'px', 'important');
			breakout.style.marginLeft = '0';
			breakout.style.marginRight = '0';
			breakout.style.boxSizing = 'border-box';
			breakout.style.zIndex = '1';

			/**
			 * Instead of resetting left to 0 first, calculate the natural
			 * offset from the current rendered position and the current left value.
			 * This avoids visible jumps during recalculation.
			 */
			const rect = breakout.getBoundingClientRect();
			const currentLeft = parseFloat(
				breakout.style.left || window.getComputedStyle(breakout).left
			) || 0;

			const naturalLeft = rect.left - currentLeft;

			breakout.style.left = `-${naturalLeft}px`;
			breakout.classList.add('breakout-ready');
		});

		window.requestAnimationFrame(() => {
			isUpdating = false;
		});
	}

	function scheduleStretchBreakouts() {
		if (scheduled) {
			return;
		}

		scheduled = true;

		window.requestAnimationFrame(() => {
			scheduled = false;
			stretchBreakouts();
		});
	}

	function observeBreakoutChanges() {
		if (!document.body) {
			return;
		}

		const observer = new MutationObserver((mutations) => {
			if (isUpdating) {
				return;
			}

			for (const mutation of mutations) {
				if (mutation.type === 'childList') {
					scheduleStretchBreakouts();
					return;
				}

				if (
					mutation.type === 'attributes' &&
					mutation.attributeName === 'class' &&
					mutation.target instanceof Element
				) {
					if (
						mutation.target.classList.contains('breakout-section') ||
						mutation.target.closest('.breakout-section')
					) {
						scheduleStretchBreakouts();
						return;
					}
				}
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class'],
		});
	}

	window.addEventListener('load', scheduleStretchBreakouts);
	window.addEventListener('resize', scheduleStretchBreakouts);

	document.addEventListener('DOMContentLoaded', () => {
		observeBreakoutChanges();
		scheduleStretchBreakouts();
	});

	if (document.readyState !== 'loading') {
		observeBreakoutChanges();
		scheduleStretchBreakouts();
	}
})();
