import lume from "lume/mod.ts";
import toml from "lume/plugins/toml.ts";
import postcss from "lume/plugins/postcss.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import lightningCSS from "lume/plugins/lightningcss.ts";

// this is set in deno.json
const environment = Deno.env.get("DENO_ENV") == "production" ? "production" : "development";

const site = lume({
    location: new URL("https://mabi.tmpinc.io"),
});

site.use(toml());

site.use(postcss());

if (environment == "production") {
    site.use(minifyHTML());
    site.use(lightningCSS());
}

site.copy("assets");

export default site;
