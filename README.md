# Elementor Breakout Sections

Bring back full-width breakout sections for Elementor Container layouts.

Elementor's classic Sections used to include a very useful **Stretch Section** option. With the introduction of Flexbox Containers, this option is no longer available in the same way.

This small plugin restores that workflow.

Add one CSS class to an outer Elementor container:

`breakout-section`

The container will then stretch to the full browser width, even when it is placed inside a boxed Elementor template or a boxed post content area.

## Features

- Restores full-width breakout behaviour for Elementor Container layouts
- Works inside boxed templates and post content areas
- Supports multiple breakout sections on the same page
- Prevents visible layout shift while positioning
- Works with Chrome, Firefox and Safari
- No settings
- No admin page
- No dependencies

## Usage

1. Install and activate the plugin.
2. Edit a page or post with Elementor.
3. Select an outer Container.
4. Go to **Advanced → CSS Classes**.
5. Add `breakout-section`.
6. Save the page.

The selected container will break out of the boxed layout and span the full viewport width.

## Notes

For best results, use the class on an outer Elementor Container.

The container may be set to either **Boxed** or **Full Width** in Elementor, although **Full Width** is usually the more logical choice.

## Why this plugin exists

Many WordPress sites use boxed page templates for regular content such as legal pages, privacy policies, blog posts or Gutenberg content.

At the same time, modern Elementor layouts often need selected full-width sections for visual emphasis, campaign blocks, calls to action or background areas.

This plugin makes that pattern possible again with Elementor Containers.

## License

MIT License

## Author

Built by [#dezemberundjuli](https://dezemberundjuli.ch).
