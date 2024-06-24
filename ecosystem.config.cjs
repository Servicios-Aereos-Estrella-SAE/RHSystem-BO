
module.exports = {
  apps: [
    {
      name: 'RHSystem',
      port: 3010,
      exec_mode: 'cluster',
      instances: 1,
      script: './.output/server/index.mjs',
    }
  ]
}
