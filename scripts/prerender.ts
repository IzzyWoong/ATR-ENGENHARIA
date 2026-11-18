import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(projectRoot, 'dist/public');
const siteOrigin = 'https://atr.eng.br';

process.env.PORT ??= '22010';
process.env.BASE_PATH ??= '/';
process.env.NODE_ENV = 'production';

const vite = await createServer({
  configFile: path.join(projectRoot, 'vite.config.ts'),
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true },
  logLevel: 'error',
});

try {
  const [{ default: App }, { ErrorBoundary }] = await Promise.all([
    vite.ssrLoadModule('/src/App.tsx'),
    vite.ssrLoadModule('/src/components/error-boundary.tsx'),
  ]);
  const pageContent = renderToString(
    createElement(ErrorBoundary, null, createElement(App, { ssrPath: '/' })),
  );

  const htmlPath = path.join(publicDir, 'index.html');
  let html = await readFile(htmlPath, 'utf8');
  const rootPlaceholder = '<div id="root"></div>';
  if (!html.includes(rootPlaceholder)) {
    throw new Error('Could not find the empty app root in the built index.html.');
  }
  html = html.replace(rootPlaceholder, `<div id="root">${pageContent}</div>`);

  const canonicalUrl = siteOrigin ? `${siteOrigin}/` : '/';
  const socialImageUrl = siteOrigin
    ? `${siteOrigin}/atr-eng-compartilhamento.jpg`
    : '/atr-eng-compartilhamento.jpg';
  html = html.replace(
    /(<meta name="atr-public-site-url" content=")[^"]*(" \/>)/,
    `$1${siteOrigin ?? ''}$2`,
  );
  const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;
  if (/<link rel="canonical" href="[^"]*" \/>/.test(html)) {
    html = html.replace(/<link rel="canonical" href="[^"]*" \/>/, canonicalTag);
  } else {
    html = html.replace(
      '<script id="atr-structured-data"',
      `${canonicalTag}\n    <script id="atr-structured-data"`,
    );
  }
  html = html.replace(/(<meta property="og:url" content=")[^"]*(" \/>)/, `$1${canonicalUrl}$2`);
  html = html.replace(/(<meta property="og:image" content=")[^"]*(" \/>)/, `$1${socialImageUrl}$2`);
  html = html.replace(/(<meta name="twitter:image" content=")[^"]*(" \/>)/, `$1${socialImageUrl}$2`);

  const structuredDataMatch = html.match(
    /<script id="atr-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/,
  );
  if (!structuredDataMatch) {
    throw new Error('Structured data block is missing from the built index.html.');
  }
  const structuredData = JSON.parse(structuredDataMatch[1]);
  if (siteOrigin) {
    for (const entity of structuredData['@graph']) {
      const idFragment = String(entity['@id'] ?? '').split('#').pop();
      entity['@id'] = `${siteOrigin}/#${idFragment || 'entity'}`;
      entity.url = `${siteOrigin}/`;
    }
    structuredData['@graph'][0].logo = `${siteOrigin}/atr-eng-logo-atr-engenharia.png`;
    structuredData['@graph'][0].image = socialImageUrl;
    structuredData['@graph'][1].publisher['@id'] = `${siteOrigin}/#atr-engenharia`;
  }
  html = html.replace(structuredDataMatch[0], `<script id="atr-structured-data" type="application/ld+json">${JSON.stringify(structuredData)}</script>`);
  await writeFile(htmlPath, html);

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  const robotsPath = path.join(publicDir, 'robots.txt');
  const robotsContent = [
    'User-agent: *',
    'Allow: /',
    ...(siteOrigin ? ['', `Sitemap: ${siteOrigin}/sitemap.xml`] : []),
    '',
  ].join('\n');
  await writeFile(robotsPath, robotsContent);

  const sitemapContent = siteOrigin
    ? `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteOrigin}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n</urlset>\n`
    : '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n';
  await writeFile(sitemapPath, sitemapContent);

  console.log(`Pre-rendered ATR Engenharia homepage${siteOrigin ? ` for ${siteOrigin}` : ''}.`);
} finally {
  await vite.close();
}
