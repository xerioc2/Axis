const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add 'txt' to asset extensions
config.resolver.assetExts.push('txt');

// Disable package.json exports field feature to resolve compatibility issues with Supabase and ws
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
