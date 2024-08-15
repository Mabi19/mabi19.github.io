---
date: 2024-08-15
layout: blog.vto
title: How I made Connect 4 with HTMX on a static host
description: "Also including 120 kB of CSS!"
draft: true
---

After I [put tic-tac-toe in a font](/blog/tic-tac-toe-font/), I wanted to go bigger.
But the limits of fonts meant that a more complex game like Connect 4 isn't feasible.
Luckily, I had recently started experimenting with [HTMX](https://htmx.org),
and it seemed like a nice challenge to try and make a game with it.

I quickly realized that to make it actually challenging, I needed restrictions; after some deliberation, here's what I decided on:

- Static host: turn-based games are trivial if you can do what HTMX is supposed to do
- The only JavaScript is that of HTMX (obviously)
- Other non-JS assets are allowed (especially CSS, since I didn't expect to implement everything with only HTMX)
- No expansive build step: not being able to generate lots of files makes this more interesting. I did use Sass for repetitive CSS rules, though.

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

<!-- TODO: #status, victory, drop region hover colors -->

[^1]: Note that there is no JavaScript registering these as custom elements! They're just regular invalid tags, which browsers interpret as `div`s (but distinct for CSS).
