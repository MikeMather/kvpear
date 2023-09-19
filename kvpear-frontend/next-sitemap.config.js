/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https:kvpear.dev',
  generateRobotsTxt: true,
  exclude: [
    '/account',
    '/api-keys',
    '/app',
    '/buckets',
    '/usage',
    '/layout',
    '/docs/docs',
    '/guides',
    '/docs/guides/form-submissions'
  ]
}