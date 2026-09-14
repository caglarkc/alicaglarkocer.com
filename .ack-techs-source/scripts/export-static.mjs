import { cp, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

const origin = (process.env.ACK_ORIGIN ?? 'http://127.0.0.1:8790').replace(/\/$/, '');
const outputDirectory = resolve(process.cwd(), '../ack-techs');
const routes = [
  '/ack-techs/',
  '/ack-techs/projeler/watchtower/',
  '/ack-techs/projeler/sentinel-coming/',
  '/ack-techs/projeler/demandrift/',
  '/ack-techs/projeler/ev-karnesi/',
  '/ack-techs/projeler/steward/',
  '/ack-techs/projeler/first-step-into-path/',
];

async function fetchPage(route) {
  const response = await fetch(`${origin}${route}`, {
    headers: { Accept: 'text/html' },
  });

  if (!response.ok) {
    throw new Error(`${route} could not be exported (${response.status}).`);
  }

  const relativeRoute = route.replace('/ack-techs/', '');
  const outputFile = relativeRoute
    ? join(outputDirectory, relativeRoute, 'index.html')
    : join(outputDirectory, 'index.html');

  await mkdir(dirname(outputFile), { recursive: true });
  await writeFile(outputFile, formatHtml(await response.text()));
}

function formatHtml(html) {
  // Preserve SSR whitespace so the React payload hydrates without differences.
  // Cached font URLs need public paths when these pages are hosted statically.
  return html.replace(/\/[^\s"'()<>]*\/\.vinext\/fonts\//g, '/ack-techs/fonts/');
}

await mkdir(outputDirectory, { recursive: true });
await cp(join(process.cwd(), 'dist/client/ack-techs'), outputDirectory, {
  recursive: true,
  force: true,
});
await cp(join(process.cwd(), 'dist/client/favicon.svg'), join(outputDirectory, 'favicon.svg'), {
  force: true,
});
await cp(join(process.cwd(), 'dist/client/og.png'), join(outputDirectory, 'og.png'), {
  force: true,
});

await cp(join(process.cwd(), 'public/profile-photos'), join(outputDirectory, 'profile-photos'), {
  recursive: true,
  force: true,
});

await cp(join(process.cwd(), '.vinext/fonts'), join(outputDirectory, 'fonts'), {
  recursive: true,
  force: true,
  filter: (source) => !source.endsWith('.css'),
});

for (const route of routes) {
  await fetchPage(route);
}

console.log(`Exported ${routes.length} ACK Techs pages to ${outputDirectory}`);
