import lume from "@lumeland/lume";
import codeHighlight from "@lumeland/plugin-code-highlight";
import esbuild from "@lumeland/plugin-esbuild";
import eta from "@lumeland/plugin-eta";
import lightningCSS from "@lumeland/plugin-lightningcss";
import metas from "@lumeland/plugin-metas";
import minifyHTML from "@lumeland/plugin-minify-html";
import postcss from "@lumeland/plugin-postcss";
import readingInfo from "@lumeland/plugin-reading-info";
import sourceMaps from "@lumeland/plugin-source-maps";
import toml from "@lumeland/plugin-toml";

import mdAnchor from "markdown-it-anchor";
import mdFootnote from "markdown-it-footnote";

import lang_c from "highlight.js/lib/languages/c";
import lang_plaintext from "highlight.js/lib/languages/plaintext";
import lang_mcfunction from "./_highlightjs/mcfunction.js";

// this is set in package.json
const environment = process.env.NODE_ENV == "production" ? "production" : "development";
console.log(`environment: ${environment}`);

const site = lume(
    {
        location: new URL("https://mabi.land"),
    },
    {
        markdown: {
            options: {
                typographer: true,
            },
            plugins: [
                [mdAnchor, { level: 2, permalink: mdAnchor.permalink.headerLink() }],
                mdFootnote,
            ],
        },
    },
);

site.use(eta());
site.use(toml());
site.use(
    esbuild({
        options: {
            target: "es2022",
            format: "iife",
        },
    }),
);
site.use(postcss());

if (environment == "production") {
    site.use(lightningCSS());
}

if (environment == "development") {
    site.use(sourceMaps());
}

site.use(metas());
// I'm not going to be View Source'ing, the Inspector works just as well with this thing on
site.use(minifyHTML());

site.use(
    codeHighlight({
        // TODO: figure out if Highlight.js supports easy theme switching.
        // Or just use Shiki.
        theme: {
            name: "atom-one-dark",
            cssFile: "/styles/code-hljs.css",
        },
        languages: {
            c: lang_c,
            plaintext: lang_plaintext,
            mcfunction: lang_mcfunction,
        },
    }),
);
site.use(readingInfo());

site.copy("assets");
site.add("/");

export default site;
