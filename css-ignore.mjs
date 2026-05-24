// Custom Node.js ESM loader — ignores CSS/SCSS/SASS/LESS imports
// Used via NODE_OPTIONS='--import /app/css-ignore.mjs' to prevent
// Node.js from failing on style imports in @payloadcms/ui dependencies

import { register } from 'module'
import { pathToFileURL } from 'url'

register(
  'data:text/javascript,\
export function resolve(specifier, context, next) {\
  if (/\\.(css|scss|sass|less|styl|stylus)$/.test(specifier)) {\
    return { shortCircuit: true, url: "data:text/javascript,export default {}" };\
  }\
  return next(specifier, context);\
}\
export function load(url, context, next) {\
  if (url.startsWith("data:text/javascript,export default {}")) {\
    return { format: "module", shortCircuit: true, source: "export default {}" };\
  }\
  return next(url, context);\
}',
  pathToFileURL(process.cwd() + '/')
)
