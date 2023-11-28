import lume from "lume/mod.ts";
import postcss from "lume/plugins/postcss.ts";

const site = lume({
    location: new URL("https://mabi.tmpinc.io"),
});

site.use(postcss());

site.copy("assets");

export default site;
