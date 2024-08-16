---
date: 2024-08-16
layout: blog.vto
title: How I made Connect 4 with HTMX on a static host
description: "Also including 120 kB of CSS!"
draft: true
---

After I [put tic-tac-toe in a font](/blog/tic-tac-toe-font/), I wanted to go bigger.
But the limits of fonts meant that a more complex game like Connect 4 isn't feasible.
Luckily, I had recently started experimenting with [HTMX](https://htmx.org),
and it seemed like a nice challenge to try and make a game with it. You can [play the result here](/static-htmx-connect-4/).

I quickly realized that to make it actually challenging, I needed restrictions; after some deliberation, here's what I decided on:

- Static host: turn-based games are trivial if you can do what HTMX is supposed to do
- The only JavaScript is that of HTMX (obviously)
- Other non-JS assets are allowed (especially CSS, since I didn't expect to implement everything with only HTMX)
- No expansive build step: I thought that not being able to generate lots of files makes this more interesting. I did use Sass for repetitive CSS rules, though.

In practice, I perhaps ended up relying on CSS a little *too much*. I ended up using only 8 HTML files, though!

## The board

The board is a CSS grid with 7 columns and 6 rows. Normally I'd use nested flexboxes for this, but due to complications with win detection I couldn't have any nested containers in there.

Adding new tokens is accomplished via HTMX. Initially the board contains seven drop regions, one for each column, that would `hx-get` the corresponding token element and put it in there.
They are overlaid atop the board via `position: absolute`.

```html
<div id="board" hx-target="#first-drop-region" hx-swap="beforebegin" hx-sync="#board:drop">
    <div class="drop-region col1" id="first-drop-region" hx-trigger="click" hx-get="./token-1.html"></div>
    <div class="drop-region col2" hx-trigger="click" hx-get="./token-2.html"></div>
    <div class="drop-region col3" hx-trigger="click" hx-get="./token-3.html"></div>
    <div class="drop-region col4" hx-trigger="click" hx-get="./token-4.html"></div>
    <div class="drop-region col5" hx-trigger="click" hx-get="./token-5.html"></div>
    <div class="drop-region col6" hx-trigger="click" hx-get="./token-6.html"></div>
    <div class="drop-region col7" hx-trigger="click" hx-get="./token-7.html"></div>
</div>
```

The `token-?.html` files look like this:
```html
<token-1 class="token col1"></token-1>
```
Notice that the DOM nodes for both players are exactly the same! They are distinguished with `:nth-child(odd)` for yellow and `:nth-child(even)` for red.
In retrospect, I probably should've made different HTML snippets for each player's token and swapped the drop regions along with adding the new token,
though that would've required adding a lot more HTML files and making them larger.

Because all the tokens are jumbled in one div, positioning them was tricky. That is why they use custom tag names[^1]:
`grid-column` is set by the `.col?` class, but `grid-row` is set by `:nth-of-type(?)` for each digit from 1 to 6.

## The status message and hover colors

When a game is in progress, the status bar reflects the current player to move. It's an empty div just under the board; the actual messages are in its `::after`.
To get the actual information of whose turn it is out of the board, CSS rules like `.token:nth-child(odd) + #first-drop-region` are used;
that is, a token with the specified parity must be directly adjacent to `#first-drop-region`.
Since new tokens are inserted just before the first drop region, `.token + #first-drop-region` will always be the last token!
Inserting the messages is a matter of using another sibling selector and some `:has`:
```css
#board:has(.token:nth-child(odd) + #first-drop-region) + #status::after {
    content: "Red to move";
}
```
This is also how the hover colors on the drop regions work. There's a complication in that we need to match all the drop regions past the first one,
so we also need to use the `~` (any sibling after this) combinator.
```css
.token:nth-child(odd) + #first-drop-region,
.token:nth-child(odd) + #first-drop-region ~ .drop-region {
    --drop-bg: rgba(255, 0, 0, 0.3);
}
```

## Win detection

As far as I know, HTMX by itself could never really be used for win detection.
I ended up generating CSS rules for each possible way to win with Sass.
Matching a specific player's token looks like `.token:nth-child(#{$parity}):nth-child(#{$row} of .col#{$column})`.
You may not have seen the `:nth-child(n of selector)` syntax; it simply filters which elements are counted ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child#the_of_selector_syntax)).
Due to how Connect 4 works, the nth element in a column is always in the nth row from the bottom.

### Other effects of finishing the game

Highlighting the four winning tokens is not the only effect of a won game!
Finishing the game also disables all the drop regions to prevent any further moves and changes the status message[^2].
Changing the status message is very similar to how placing tokens does it, except the board is tested for a win instead of for the last token's parity.

However, disabling the drop regions is tricky, since HTMX doesn't know about the victory.
Instead, winning sets `pointer-events: none` ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events)) on them,
which disables their handling of click events.

This is also how the drop regions are disabled when their corresponding columns are full.
```css
.token.col1:nth-of-type(6) ~ .drop-region.col1 {
    pointer-events: none;
}
```

## That's pretty much it!
If you're curious about anything else, check out [the full source code on GitHub](https://github.com/Mabi19/static-htmx-connect-4).

[^1]: Note that there is no JavaScript registering these as custom elements! They're just regular invalid tags, which browsers interpret as `div`s (but distinct for CSS).
[^2]: Note that the game can also end in a draw. That is tested by checking for a 42nd token in the board (there are 42 total spaces).
