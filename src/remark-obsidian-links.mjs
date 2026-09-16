import { existsSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const DOCS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), 'content/docs');

function visit(node, callback) {
  if (node == null || typeof node !== 'object') return;
  callback(node);
  if (!Array.isArray(node.children)) return;
  for (const child of node.children) visit(child, callback);
}

function normalizeBase(value) {
  if (typeof value !== 'string' || value === '/') return '';
  return `/${value.replace(/^\/+|\/+$/g, '')}`;
}

/**
 * Keep authored documentation links useful inside an Obsidian vault while
 * emitting Starlight's directory-style routes for the website.
 *
 * Author:  [Navigation](./navigation.md)
 * Website: /card-workspace/en/guides/navigation/
 */
export default function remarkObsidianLinks(options = {}) {
  const base = normalizeBase(options.base);

  return (tree, file) => {
    if (typeof file?.path !== 'string') return;
    const sourceDirectory = dirname(resolve(file.path));

    visit(tree, (node) => {
      if (node.type !== 'link' || typeof node.url !== 'string') return;

      const match = node.url.match(/^([^?#]+\.md)(\?[^#]*)?(#.*)?$/i);
      if (match == null || match[1].startsWith('/') || /^[a-z][a-z\d+.-]*:/i.test(match[1])) {
        return;
      }

      let sourceRelativeTarget;
      try {
        sourceRelativeTarget = decodeURIComponent(match[1]);
      } catch {
        throw new Error(`Invalid URL encoding in documentation link: ${node.url}`);
      }

      const targetPath = resolve(sourceDirectory, sourceRelativeTarget);
      const targetFromDocsRoot = relative(DOCS_ROOT, targetPath);
      if (
        targetFromDocsRoot === ''
        || targetFromDocsRoot === '..'
        || targetFromDocsRoot.startsWith(`..${sep}`)
        || isAbsolute(targetFromDocsRoot)
      ) {
        throw new Error(`Documentation link escapes src/content/docs: ${node.url}`);
      }
      if (!existsSync(targetPath)) {
        throw new Error(`Documentation link target does not exist: ${node.url}`);
      }

      const sourceSlug = targetFromDocsRoot.slice(0, -3).split(sep).join('/');
      const slug = sourceSlug === 'index'
        ? ''
        : sourceSlug.endsWith('/index')
          ? sourceSlug.slice(0, -6)
          : sourceSlug;
      const route = slug.length > 0 ? `${base}/${slug}/` : `${base}/`;
      node.url = `${route}${match[2] ?? ''}${match[3] ?? ''}`;
    });
  };
}
