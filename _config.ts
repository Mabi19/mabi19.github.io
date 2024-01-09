import lume from "lume/mod.ts";
import eta from "lume/plugins/eta.ts";
import toml from "lume/plugins/toml.ts";
import postcss from "lume/plugins/postcss.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import lightningCSS from "lume/plugins/lightningcss.ts";
import sourceMaps from "lume/plugins/source_maps.ts";

// this is set in deno.json
const environment = Deno.env.get("DENO_ENV") == "production" ? "production" : "development";
console.log(`environment: ${environment}`);

const site = lume(
    {
        location: new URL("https://mabi.land"),
    },
    {}
);

site.use(eta());

site.use(toml());

site.use(postcss());

if (environment == "production") {
    site.use(minifyHTML());
    site.use(lightningCSS());
}

if (environment == "development") {
    site.use(sourceMaps());
}

site.copy("assets");

export default site;
