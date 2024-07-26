import lume from "lume/mod.ts";
import esbuild from "lume/plugins/esbuild.ts";
import eta from "lume/plugins/eta.ts";
import lightningCSS from "lume/plugins/lightningcss.ts";
import metas from "lume/plugins/metas.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import postcss from "lume/plugins/postcss.ts";
import readingInfo from "lume/plugins/reading_info.ts";
import sourceMaps from "lume/plugins/source_maps.ts";
import toml from "lume/plugins/toml.ts";

// this is set in deno.json
const environment = Deno.env.get("DENO_ENV") == "production" ? "production" : "development";
console.log(`environment: ${environment}`);

const site = lume(
    {
        location: new URL("https://mabi.land"),
    },
    {}
);

site.use(metas());

site.use(eta());
site.use(toml());
site.use(postcss());
site.use(
    esbuild({
        options: {
            target: "es2022",
        },
    })
);

if (environment == "production") {
    site.use(minifyHTML());
    site.use(lightningCSS());
}

if (environment == "development") {
    site.use(sourceMaps());
}

site.use(readingInfo());

site.copy("assets");
site.copyRemainingFiles();

export default site;
