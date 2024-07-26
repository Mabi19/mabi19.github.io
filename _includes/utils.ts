export const html = (str: TemplateStringsArray, ...vals: unknown[]): string =>
    String.raw(
        { raw: str },
        ...vals.map((val) => {
            if (Array.isArray(val)) {
                return val.join("");
            } else if (val === undefined) {
                return "";
            } else {
                return val;
            }
        })
    );

import type { Data as RawPageData } from "lume/core/file.ts";

export type PageData = RawPageData & { description?: string };
