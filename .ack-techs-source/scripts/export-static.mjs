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
  const placeholders = [];
  const stash = (match) => {
    placeholders.push(match);
    return `___PLACEHOLDER_${placeholders.length - 1}___`;
  };

  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, stash);
  html = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, stash);

  const voidTags = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
    'meta', 'param', 'source', 'track', 'wbr',
  ]);
  const tokens = html.split(/(<[^>]+>)/);
  const lines = [];
  let indent = 0;

  for (const token of tokens) {
    if (!token) continue;
    if (token.startsWith('<')) {
      const nameMatch = token.match(/^<\/?([a-zA-Z0-9:-]+)/);
      const name = nameMatch?.[1]?.toLowerCase() ?? '';
      const isClose = token.startsWith('</');
      const isComment = token.startsWith('<!--');
      const isDoctype = token.toLowerCase().startsWith('<!doctype');
      const selfClosing =
        token.endsWith('/>') || voidTags.has(name) || isComment || isDoctype;
      if (isClose) indent = Math.max(0, indent - 1);
      lines.push(`${'  '.repeat(indent)}${token}`);
      if (!isClose && !selfClosing) indent += 1;
      continue;
    }

    const text = token.trim();
    if (text) lines.push(`${'  '.repeat(indent)}${text}`);
  }

  let formatted = `${lines.join('\n')}\n`;
  const leaf =
    /(<(title|a|p|h1|h2|h3|h4|h5|h6|span|strong|em|small|label|button)([^>]*)>)\n\s+([^<\n]{1,160})\n\s+(<\/\2>)/g;
  const empty = /(<([a-zA-Z0-9:-]+)([^>]*)>)\n\s+(<\/\2>)/g;
  let previous;
  do {
    previous = formatted;
    formatted = formatted.replace(leaf, '$1$4$5').replace(empty, '$1$4');
  } while (previous !== formatted);

  for (const [index, block] of placeholders.entries()) {
    formatted = formatted.replace(`___PLACEHOLDER_${index}___`, block);
  }

  return formatted.replaceAll('</script><script', '</script>\n    <script');
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

for (const route of routes) {
  await fetchPage(route);
}

console.log(`Exported ${routes.length} ACK Techs pages to ${outputDirectory}`);
