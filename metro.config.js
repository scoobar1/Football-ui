// Metro + tslib ≥2.8 "exports" can resolve to ESM without a proper default export,
// breaking code that expects `tslib.default.__extends`. Force the CJS build.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const tslibCjsPath = require.resolve('tslib/tslib.js');
const upstreamResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (ctx, moduleName, platform) => {
  if (moduleName === 'tslib') {
    return { type: 'sourceFile', filePath: tslibCjsPath };
  }
  if (upstreamResolveRequest) {
    return upstreamResolveRequest(ctx, moduleName, platform);
  }
  return ctx.resolveRequest(ctx, moduleName, platform);
};

module.exports = config;
