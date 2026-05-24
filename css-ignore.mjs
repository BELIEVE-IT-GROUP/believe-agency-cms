// Custom Node.js ESM loader that ignores CSS files
// Used via NODE_OPTIONS='--import /app/css-ignore.mjs' to prevent
// Node.js from failing on CSS imports in @payloadcms/ui dependencies

import { register } from 'module'
import { pathToFileURL } from 'url'

register(
  'data:text/javascript,\
export function resolve(specifier, context, next) {\
  if (specifier.endsWith(".css")) {\
    return { shortCircuit: true, url: "data:text/javascript," };\
  }\
  return next(specifier, context);\
}\
export function load(url, context, next) {\
  if (url === "data:text/javascript,") {\
    return { format: "module", shortCircuit: true, source: "" };\
  }\
  return next(url, context);\
}',
  pathToFileURL(process.cwd() + '/')
)
