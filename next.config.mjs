/**
 * The host split, per glaze/proposal.md.
 *
 *   schulers.glazedweb.com/        -> the proposal
 *   schulers.glazedweb.com/demo    -> this site
 *   schulersrestaurant.com/        -> this site, with no proposal anywhere
 *
 * THE REWRITES MUST BE IN `beforeFiles`. A plain rewrites() array is
 * `afterFiles`, which only runs once Next has failed to find a page, and
 * app/page.js already answers "/", so the root rewrite would silently never
 * fire and the prospect would land on the demo instead of the pitch.
 *
 * Host scoping rather than basePath: "/demo", because basePath is global to a
 * build and would bury the real site under /demo the day the domain goes live.
 *
 * One accepted wart: links are root-relative, so the /demo prefix drops off
 * after the first click. Nothing 404s.
 */
const PITCH_HOST = "schulers.glazedweb.com";
const onPitchHost = [{ type: "host", value: PITCH_HOST }];

const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/pitch/schulers/index.html", has: onPitchHost },
        { source: "/demo", destination: "/", has: onPitchHost },
        { source: "/demo/:path*", destination: "/:path*", has: onPitchHost },
        // The proposal file lives in public/, so it is otherwise a real URL on
        // every host this project answers, including the client's own domain
        // once it is attached. The client's domain must have no proposal
        // anywhere. Anything under /pitch on any host that is NOT the pitch
        // host resolves to the 404 page instead.
        { source: "/pitch/:path*", destination: "/_not-found", missing: onPitchHost },
      ],
    };
  },

  async headers() {
    // Every path on the pitch host, plus the preview host, which is indexable
    // by default and is the same duplicate-content risk. The demo is a full
    // copy of the client's site and must never compete with them for their own
    // name.
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    return [
      { source: "/:path*", has: onPitchHost, headers: noindex },
      { source: "/:path*", has: [{ type: "host", value: "(.*)\\.vercel\\.app" }], headers: noindex },
    ];
  },
};

export default nextConfig;
