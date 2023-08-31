const fs = require('fs');

const envVars = {
  DATABASE_URI: process.env.DATABASE_URI,
  SECRET: process.env.SECRET,
}

console.log('envVars', envVars);

// Create .env.production
fs.writeFileSync('./.env.production', Object.keys(envVars).map(key => `${key}=${envVars[key]}`).join('\n'));