---
date: 2024-07-27
layout: blog.vto
title: Playable tic-tac-toe in a font
description: "The newest innovation in font technology: OpenType as a game engine"
mergedKeys:
    head_extra: stringArray
head_extra:
    - <script src="./demo.js" defer></script>
    - <link rel="stylesheet" href="./demo.css">
---

After making the [Bad Apple Font](https://www.youtube.com/watch?v=Oub__07I4X8), I wanted to go bigger.
6549 ligatures is not nearly enough. I was also dissatisfied with the compatibility, as that font only worked with some renderers.

My newest creation uses OpenType as a game engine. This font is interactive, allowing you to play tic-tac-toe in **any text editor** that supports ligatures.
It contains a total of ***594,936*** ligatures (90x as many as Bad Apple!), though not as many unique characters (5478 instead of 6562).

## How it works

The boards are characters in the Unicode Private Use Area starting at U+F0000.
I generated them with [opentype.js](https://github.com/opentypejs/opentype.js) and a lot of typing in path coordinates by hand (NOTE: not fun!)

The interesting part is connecting them to actually make the font interactive. To do that, I used another script to put each chain of moves in the font as a [ligature](https://en.wikipedia.org/wiki/Ligature_\(writing\)) to the corresponding result board.
Ligatures are a feature that allows replacing a sequence of characters with a single glyph, like f&#8288;i &rarr; fi, usually for enhancing visual clarity (but I prefer to use them for shenanigans)

## How to play

To move, players in turn put a digit corresponding to the position on the number pad where they would like to move (make sure to have Num Lock enabled).
That is, pressing 5 will put an X in the middle, then pressing 3 will put an O in the lower right, then pressing 8 will put an X in the upper middle and so on.

Note that the font only includes digits and the necessary ligatures; putting in letters will display them as normal, and making illegal moves will start another game.
I recommend deleting finished playthroughs or putting a space between them to make them not interfere with each other, though.

## Live demo

<tic-tac-toe-font-demo>You need JavaScript enabled for the demo to work.</tic-tac-toe-font-demo>

## Download

Two versions are available:
<a href="https://mega.nz/file/hB8DjRhK#TU-CAVgaFSCyICTAVYKxCx6u6QnIowbWEdwWSWEohfw">a plain OTF, which should be compatible with most software (12 MB)</a>
or <a href="./tic-tac-toe.woff2" download>a WOFF2 file for web browsers (700 KB)</a>.
Turns out paths constructed from premade bits and lists of u16's with only nine distinct values compress really well!

You can also [view the scripts that generated the fonts on GitHub](https://github.com/Mabi19/tic-tac-toe-font).