// Where each experience lives.
//
// Locally (and on a single host) these are relative paths, so the in-page
// toggle just navigates between routes. On deploy you can point each theme at
// its own subdomain by setting the env vars below — e.g.
//   NEXT_PUBLIC_RESUME_URL=https://resume.yourdomain.com
//   NEXT_PUBLIC_CLI_URL=https://resume-cli.yourdomain.com
// The middleware also maps a `resume-cli.*` host to the terminal route, so the
// CLI subdomain root serves the terminal experience without any path.

export const RESUME_URL = process.env.NEXT_PUBLIC_RESUME_URL || "/";
export const CLI_URL = process.env.NEXT_PUBLIC_CLI_URL || "/terminal";
