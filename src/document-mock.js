// Mock next/document for server builds
// Payload admin internally imports <Html> from next/document which fails
// prerender of /404. This mock prevents that error.
import React from 'react'

export const Html = ({ children, lang, ...props }) =>
  React.createElement('html', { lang, ...props }, children)

export const Head = ({ children }) =>
  React.createElement('head', null, children)

export const Main = () => React.createElement('main', null)

export const NextScript = () => null

export default { Html, Head, Main, NextScript }
