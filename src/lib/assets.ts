// Bundled asset URLs keyed by repo-relative path (e.g. "src/assets/logo.svg"), so data files
// can reference assets by path. Missing files simply resolve to undefined.
const modules = import.meta.glob<string>('../assets/*', {
  eager: true,
  query: '?url',
  import: 'default',
});

const byPath = new Map(
  Object.entries(modules).map(([key, url]) => [key.replace(/^\.\.\//, 'src/'), url]),
);

export const assetUrl = (path: string): string | undefined => byPath.get(path);
