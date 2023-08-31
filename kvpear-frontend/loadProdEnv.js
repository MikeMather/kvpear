const fs = require('fs');

// Workaround for Next not picking up system environment variables when deployed

const envVars = {
  DATABASE_URI: process.env.DATABASE_URI,
  SECRET: process.env.SECRET,
}

// Create .env.production
fs.writeFileSync('./.env.production', Object.keys(envVars).map(key => `${key}=${envVars[key]}`).join('\n'));