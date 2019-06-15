module.exports = {
  apps: [{
    name: 'worker',
    script: 'server/index.js',
    exec_mode: 'cluster',
    instances: 0,
    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
  }],
};
