<?php
/**
 * Plugin Name: Elementor Breakout Sections
 * Description: Bring back full-width breakout sections for Elementor Container layouts.
 * Version: 0.1.1
 * Author: #dezemberundjuli
 * Author URI: https://dezemberundjuli.ch
 * License: MIT
 * Text Domain: elementor-breakout-sections
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'dj_BREAKOUT_SECTIONS_VERSION', '0.1.0' );
define( 'dj_BREAKOUT_SECTIONS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

function dj_breakout_sections_enqueue_assets() {
	wp_enqueue_style(
		'dj-breakout-sections',
		dj_BREAKOUT_SECTIONS_PLUGIN_URL . 'assets/css/breakout.css',
		array(),
		dj_BREAKOUT_SECTIONS_VERSION
	);

	wp_enqueue_script(
		'dj-breakout-sections',
		dj_BREAKOUT_SECTIONS_PLUGIN_URL . 'assets/js/breakout.js',
		array(),
		dj_BREAKOUT_SECTIONS_VERSION,
		true
	);
}
add_action( 'wp_enqueue_scripts', 'dj_breakout_sections_enqueue_assets' );
