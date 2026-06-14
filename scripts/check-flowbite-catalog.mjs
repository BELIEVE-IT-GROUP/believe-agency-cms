import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const appRoot = path.join(root, 'flowbite-react-blocks-1.8.0-beta', 'app')
const catalogPath = path.join(root, 'src', 'flowbite', 'catalog.ts')
const registryPath = path.join(root, 'src', 'flowbite', 'registry.ts')

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(fullPath) : [fullPath]
  })
}

function getSourceFiles(content) {
  return [...content.matchAll(/sourceFile: '([^']+)'/g)].map((match) => match[1])
}

function fail(message, details = []) {
  console.error(`[check-flowbite] ${message}`)
  for (const detail of details.slice(0, 50)) {
    console.error(`- ${detail}`)
  }
  if (details.length > 50) {
    console.error(`- ...and ${details.length - 50} more`)
  }
  process.exit(1)
}

if (!fs.existsSync(appRoot)) {
  fail(`Flowbite catalog folder not found: ${appRoot}`)
}

const actual = walk(appRoot)
  .filter((file) => file.endsWith('.tsx'))
  .filter((file) => !file.endsWith('/page.tsx'))
  .filter((file) => !file.endsWith('/layout.tsx'))
  .map((file) => path.relative(appRoot, file))
  .sort()

const catalogSources = getSourceFiles(fs.readFileSync(catalogPath, 'utf8')).sort()
const registrySources = getSourceFiles(fs.readFileSync(registryPath, 'utf8')).sort()
const actualSet = new Set(actual)
const catalogSet = new Set(catalogSources)

const missingFromCatalog = actual.filter((source) => !catalogSet.has(source))
const brokenCatalogPaths = catalogSources.filter((source) => !actualSet.has(source))
const brokenRegistryPaths = registrySources.filter((source) => !actualSet.has(source))

if (missingFromCatalog.length) {
  fail('Catalog is missing Flowbite templates.', missingFromCatalog)
}

if (brokenCatalogPaths.length) {
  fail('Catalog contains sourceFile paths that do not exist.', brokenCatalogPaths)
}

if (brokenRegistryPaths.length) {
  fail('CMS registry contains sourceFile paths that do not exist.', brokenRegistryPaths)
}

console.log('[check-flowbite] OK')
console.log(`[check-flowbite] template files: ${actual.length}`)
console.log(`[check-flowbite] catalog entries: ${catalogSources.length}`)
console.log(`[check-flowbite] CMS registry options: ${registrySources.length}`)
