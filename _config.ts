import lume from "lume/mod.ts";
import postcss from "lume/plugins/postcss.ts";
import toml from "lume/plugins/toml.ts";

const site = lume({
    location: new URL("https://mabi.tmpinc.io"),
});

site.use(postcss());
site.use(toml());

site.copy("assets");

export default site;
