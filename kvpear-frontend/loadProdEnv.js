const fs = require('fs');

const envVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  SECRET: process.env.SECRET,
}

console.log('envVars', envVars);

// Create .env.production
fs.writeFileSync('./.env.production', Object.keys(envVars).map(key => `${key}=${envVars[key]}`).join('\n'));