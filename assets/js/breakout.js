/**
 * Elementor Breakout Sections
 *
 * Restores full-width breakout behaviour for Elementor Container layouts.
 * Add the class "breakout-section" to an outer Elementor container.
 */

(function () {
	'use strict';

	const styleProperties = [
		'position',
		'width',
		'max-width',
		'left',
		'margin-left',
		'margin-right',
		'box-sizing',
		'z-index',
	];

	let scheduled = false;
	let observerStarted = false;
	let editorFallbackStarted = false;

	const originalInlineStyles = new WeakMap();
	const processedElements = new Set();

	function getViewportWidth() {
		return document.documentElement.clientWidth || window.innerWidth;
	}

	function rememberOriginalInlineStyles(element) {
		if (originalInlineStyles.has(element)) {
			return;
		}

		const original = {};

		styleProperties.forEach((property) => {
			original[property] = element.style.getPropertyValue(property);
		});

		originalInlineStyles.set(element, original);
	}

	function restoreOriginalInlineStyles(element) {
		const original = originalInlineStyles.get(element);

		if (!original) {
			return;
		}

		styleProperties.forEach((property) => {
			if (original[property]) {
				element.style.setProperty(property, original[property]);
			} else {
				element.style.removeProperty(property);
			}
		});

		element.classList.remove('breakout-ready');
		originalInlineStyles.delete(element);
		processedElements.delete(element);
	}

	function stretchBreakout(element) {
		if (!element.classList.contains('breakout-section')) {
			return;
		}

		rememberOriginalInlineStyles(element);
		processedElements.add(element);

		const viewportWidth = getViewportWidth();

		element.style.setProperty('position', 'relative');
		element.style.setProperty('width', viewportWidth + 'px', 'important');
		element.style.setProperty('max-width', viewportWidth + 'px', 'important');
		element.style.setProperty('margin-left', '0');
		element.style.setProperty('margin-right', '0');
		element.style.setProperty('box-sizing', 'border-box');
		element.style.setProperty('z-index', '1');

		/**
		 * Important:
		 * Do not reset left to 0 on every run.
		 *
		 * The Elementor editor fallback may run repeatedly. Resetting left first
		 * would cause visible flickering. Instead, calculate the natural offset
		 * based on the current rendered position and current left value.
		 */
		const rect = element.getBoundingClientRect();
		const currentLeft = parseFloat(window.getComputedStyle(element).left) || 0;
		const naturalLeft = rect.left - currentLeft;
		const targetLeft = -naturalLeft;

		if (Math.abs(currentLeft - targetLeft) > 0.5) {
			element.style.setProperty('left', targetLeft + 'px');
		}

		element.classList.add('breakout-ready');
	}

	function cleanupRemovedBreakouts() {
		processedElements.forEach((element) => {
			if (!document.documentElement.contains(element)) {
				processedElements.delete(element);
				return;
			}

			if (!element.classList.contains('breakout-section')) {
				restoreOriginalInlineStyles(element);
			}
		});
	}

	function stretchBreakouts() {
		cleanupRemovedBreakouts();

		const breakouts = document.querySelectorAll('.breakout-section');

		if (!breakouts.length) {
			return;
		}

		breakouts.forEach(stretchBreakout);
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
		if (observerStarted || !document.body) {
			return;
		}

		observerStarted = true;

		const observer = new MutationObserver((mutations) => {
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
						processedElements.has(mutation.target) ||
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

	function isElementorEditMode() {
		if (
			window.elementorFrontend &&
			typeof window.elementorFrontend.isEditMode === 'function' &&
			window.elementorFrontend.isEditMode()
		) {
			return true;
		}

		if (
			document.body &&
			document.body.classList.contains('elementor-editor-active')
		) {
			return true;
		}

		return false;
	}

	function startEditorFallback() {
		if (editorFallbackStarted || !isElementorEditMode()) {
			return;
		}

		editorFallbackStarted = true;

		/**
		 * Elementor editor fallback.
		 *
		 * Elementor does not always expose live CSS-class changes as predictable
		 * DOM mutations inside the preview iframe. While editing, recalculate
		 * periodically so newly added or removed breakout sections update without
		 * a page reload.
		 */
		window.setInterval(scheduleStretchBreakouts, 500);
	}

	function initBreakouts() {
		observeBreakoutChanges();
		scheduleStretchBreakouts();
		startEditorFallback();
	}

	window.addEventListener('load', initBreakouts);
	window.addEventListener('resize', scheduleStretchBreakouts);

	document.addEventListener('DOMContentLoaded', initBreakouts);

	window.addEventListener('elementor/frontend/init', () => {
		initBreakouts();
		window.requestAnimationFrame(startEditorFallback);
	});

	if (document.readyState !== 'loading') {
		initBreakouts();

		window.setTimeout(startEditorFallback, 500);
		window.setTimeout(startEditorFallback, 1500);
	}
})();
