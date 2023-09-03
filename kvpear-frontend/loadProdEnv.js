const fs = require('fs');

// Workaround for Next not picking up system environment variables when deployed

const envVars = {
  DATABASE_URI: process.env.DATABASE_URI,
  SECRET: process.env.SECRET,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
}

// Create .env.production
fs.writeFileSync('./.env.production', Object.keys(envVars).map(key => `${key}=${envVars[key]}`).join('\n'));