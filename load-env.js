const fs = require('fs');
const dotenv = require('dotenv');

// Load .env file
const envConfig = dotenv.config().parsed || {};

// Create environment.ts file
const envFileContent = `
// Auto-generated from .env file
// Do not edit manually

export const environment = {
  apiUrl: '${envConfig.NG_APP_API_URL || 'http://localhost:3000/api'}',
}
`;

// Write to environments folder
const envPath = './src/environments/environment.ts';
fs.writeFileSync(envPath, envFileContent.trim());

console.log('✅ Environment file generated from .env');
