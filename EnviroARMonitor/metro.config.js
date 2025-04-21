// metro.config.js
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig();
  
  const { assetExts } = defaultConfig.resolver;
  
  return {
    resolver: {
      assetExts: [
        ...assetExts,
        'obj',
        'mtl',
        'fbx',
        'glb',
        'gltf',
        'bin',
        'arobject',
        'gif',
      ],
    },
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
  };
})();