/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.titas-sukanya-for.life',
  generateRobotsTxt: true,
  exclude: [
    '/invitation/maker',
    '/updates/maker',
    '/invitation/maker/*',
    '/updates/maker/*',
    '/admin', // just in case
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/invitation/maker', '/updates/maker'],
      },
    ],
  },
}
