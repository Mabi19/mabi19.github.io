import lume from "lume/mod.ts";

const site = lume({
    location: new URL("https://mabi.tmpinc.io"),
});

site.copy("assets");

export default site;
