import { type PageData, html } from "../_includes/utils.ts";

export const layout = "simple.vto";
export const head_extra = `<link rel="stylesheet" href="/styles/blog.css">`;

const postList = (posts: PageData[]) => html`
    <ol class="post-list">
        ${posts.map(
            (post) => html`<li>
                <div class="heading">
                    <a href="${post.url}" class="title">${post.title}</a>
                    <span class="date">(${post.date.toISOString().split("T")[0]})</span>
                </div>
                ${post.description
                    ? html`<span class="description">${post.description}</span>`
                    : ""}
            </li>`
        )}
    </ol>
`;

// TODO: also provide direct links to every year
const yearNav = (current: number, years: Set<number>) =>
    years.size > 1
        ? html`
              <nav class="page-nav">
                  ${years.has(current + 1) ? html`<a>&laquo; ${current + 1}</a>` : ""}${years.has(
                      current - 1
                  )
                      ? html`<a>${current - 1} &raquo;</a>`
                      : undefined}
              </nav>
          `
        : undefined;

export default function* (data: Lume.Data) {
    const { search } = data;

    const postsByYear: { year: number; posts: PageData[] }[] = [];

    for (const post of search.pages("post !blog-nav", "date=desc")) {
        const year = post.date.getUTCFullYear();
        if (postsByYear.length == 0) {
            postsByYear.push({ year, posts: [] });
        }

        postsByYear.at(-1)!.posts.push(post);
    }

    const latestYear = postsByYear[0]?.year;
    const availableYears = new Set(postsByYear.map((postList) => postList.year));

    for (const { year, posts } of postsByYear) {
        if (year == latestYear) {
            yield {
                url: "/blog/",
                layout: "simple.vto",
                title: "Blog",
                tags: ["blog-nav"],
                content: html`
                    <h1>Blog</h1>
                    ${postList(posts)} ${yearNav(year, availableYears)}
                `,
            };
        }

        yield {
            url: `/blog/${year}/`,
            layout: "simple.vto",
            title: `Blog posts from ${year}`,
            tags: ["blog-nav"],
            content: html`
                <h1>Posts from ${year}</h1>
                ${postList(posts)} ${yearNav(year, availableYears)}
            `,
        };
    }
}
