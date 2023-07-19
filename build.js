const StyleDictionary = require('style-dictionary');
const {
  registerTransforms,
  transforms,
} = require('@tokens-studio/sd-transforms');





// ----------------------------------------
// Variables
// ----------------------------------------
const prefix = "Hds";
const base = prefix + "Base";
const semantic = prefix + "Semantic";
const buildFolder = "dist/";
const buildFolderAll = "dist/all/";
const buildFolderCategory = "dist/categories/";
const buildFolderLayers = "dist/layers/";


// sd-transforms, 2nd parameter for options can be added
// See docs: https://github.com/tokens-studio/sd-transforms
registerTransforms(StyleDictionary, {
  expand: { composition: true, typography: true, border: false, shadow: false },
  excludeParentKeys: false,
});



// ----------------------------------------
// Custom Transforms
// ----------------------------------------

// .filter(transform => transform !== 'ts/descriptionToComment')

StyleDictionary.registerTransformGroup({
  name: 'custom-ts',
  transforms: [...transforms, 'name/cti/constant', 'attribute/cti'],
});

StyleDictionary.registerTransformGroup({
  name: 'custom-css',
  transforms: [...transforms, 'name/cti/kebab', 'attribute/cti'],
});

StyleDictionary.registerTransformGroup({
  name: 'custom-scss',
  transforms: [...transforms, 'name/cti/kebab', 'attribute/cti'],
});

// ----------------------------------------
// Custom Filters
// ----------------------------------------
// StyleDictionary.registerFilter({
//   name: 'base-layer-filter',
//   matcher: (token) => {
//     // console.log(token.attributes)
//     if (token.attributes.filePath === 'tokens/base tokens/color.json') {
//       return token
//     } else if (token.attributes.filePath === 'tokens/base tokens/fontFamily.json') {
//       return token
//     } else if (token.attributes.filePath === 'tokens/base tokens/fontSize.json') {
//       return token
//     }
//   }
// });

StyleDictionary.registerFilter({
  name: 'semantic-layer-filter',
  matcher: (token) => {
    // console.log(token.attributes)
    if (token.attributes.filePath === 'tokens/semantic-tokens/color.json') {
      console.log(token);
      // return token
    }
  }
});


StyleDictionary.registerFilter({
  name: 'base-layer-filter',
  matcher: (token) => {
    switch (token.attributes.filePath) {
      case 'figma-tokens/base-tokens/color.json':
        return token
      case 'figma-tokens/base-tokens/fontFamily.json':
        return token
      case 'figma-tokens/base-tokens/fontSize.json':
        return token
      case 'figma-tokens/base-tokens/fontWeight.json':
        return token
      case 'figma-tokens/base-tokens/lineHeight.json':
        return token
      case 'figma-tokens/base-tokens/space.json':
        return token
      case 'figma-tokens/base-tokens/textTransform.json':
        return token
      default:
        console.log('All out of base layer files');
    }
  }
});


StyleDictionary.registerFilter({
  name: 'semantic-layer-filter',
  matcher: (token) => {
    switch (token.attributes.filePath) {
      case 'figma-tokens/semantic-tokens/color.json':
        return token
      case 'figma-tokens/semantic-tokens/fontWeight.json':
        return token
      case 'figma-tokens/semantic-tokens/lineHeight.json':
        return token
      case 'figma-tokens/semantic-tokens/typeScale.json':
        return token
      default:
        console.log('All out of semantic layer files');
    }
  }
});



StyleDictionary.registerFilter({
  name: 'color-filter',
  matcher: (token) => {
    // console.log(token.attributes)
    return token.attributes.type === 'color';
  }
});

StyleDictionary.registerFilter({
  name: 'lineHeights-filter',
  matcher: (token) => {
    // console.log(token.attributes)
    return token.attributes.type === 'lineHeights';
  }
});

StyleDictionary.registerFilter({
  name: 'fontWeights-filter',
  matcher: (token) => {
    // console.log(token.attributes)
    return token.attributes.type === 'fontWeights';
  }
});


StyleDictionary.registerFilter({
  name: 'fontFamily-filter',
  matcher: (token) => {
    // console.log(token.attributes)
    return token.attributes.type === 'fontFamilies';
  }
});

StyleDictionary.registerFilter({
  name: 'fontSize-filter',
  matcher: (token) => {
    // console.log(token.attributes)
    return token.attributes.type === 'fontSizes';
  }
});

StyleDictionary.registerFilter({
  name: 'textTransform-filter',
  matcher: (token) => {
    // console.log(token.attributes)
    return token.attributes.type === 'textCase';
  }
});


StyleDictionary.registerFilter({
  name: 'body-typography-filter',
  matcher: (token) => {
    // console.log(token.attributes)
    return token.attributes.category === 'text';
  }
});


StyleDictionary.registerFilter({
  name: 'display-typography-filter',
  matcher: (token) => {
    // console.log(token.attributes)
    return token.attributes.category === 'display';
  }
});


StyleDictionary.registerFilter({
  name: 'space-filter',
  matcher: (token) => {
    // console.log(token.attributes)
    return token.attributes.category === 'space';
  }
});





// Build Configs
// ------------------------------
const sd = StyleDictionary.extend({
  source: ['figma-tokens/**/*.json'],
  platforms: {
    SCSS: {
      prefix: prefix,
      transformGroup: 'custom-scss',
      buildPath: buildFolder,
      files: [{
        destination: 'scss/all-variables.scss',
        format: 'scss/variables',
        "options": {
          "outputReferences": true
        }
      }]
    },



    css: {
      prefix: prefix,
      transformGroup: 'custom-css',
      buildPath: buildFolder,
      files: [{
        destination: 'css/all-variables.css',
        format: 'css/variables',
        "options": {
          "outputReferences": true
        }
      }]
    },



    "baseTS": {
      prefix: prefix,
      "transformGroup": "custom-ts",
      buildPath: buildFolderLayers,
      "files": [
        {
          "format": "javascript/es6",
          "destination": "typescript/base-variables.ts",
          filter: 'base-layer-filter'
        },
      ]
    },


    "semanticTS": {
      prefix: prefix,
      "transformGroup": "custom-ts",
      buildPath: buildFolderLayers,
      "files": [
        {
          "format": "javascript/es6",
          "destination": "typescript/semantic-variables.ts",
          filter: 'semantic-layer-filter'
        },
      ]
    },


    "ts": {
      prefix: prefix,
      "transformGroup": "custom-ts",
      buildPath: buildFolder,
      "files": [
        {
          "format": "javascript/es6",
          "destination": "typescript/all-variables.ts"
        },
      ]
    },

    "colorTS": {
      prefix: prefix,
      "transformGroup": "custom-ts",
      buildPath: buildFolder,
      "files": [
        {
          "format": "javascript/es6",
          "destination": "typescript/color-variables.ts",
          filter: 'color-filter'
        },
      ]
    },

    "fontFamilyTS": {
      prefix: prefix,
      "transformGroup": "custom-ts",
      buildPath: buildFolder,
      "files": [
        {
          "format": "javascript/es6",
          "destination": "typescript/fontFamily-variables.ts",
          filter: 'fontFamily-filter'
        },
      ]
    },

    "fontSizeTS": {
      prefix: prefix,
      "transformGroup": "custom-ts",
      buildPath: buildFolder,
      "files": [
        {
          "format": "javascript/es6",
          "destination": "typescript/fontSize-variables.ts",
          filter: 'fontSize-filter'
        },
      ]
    },

    "fontWeightTS": {
      prefix: prefix,
      "transformGroup": "custom-ts",
      buildPath: buildFolder,
      "files": [
        {
          "format": "javascript/es6",
          "destination": "typescript/fontWeight-variables.ts",
          filter: 'fontWeights-filter'
        },
      ]
    },


    "lineHeightTS": {
      prefix: prefix,
      "transformGroup": "custom-ts",
      buildPath: buildFolder,
      "files": [
        {
          "format": "javascript/es6",
          "destination": "typescript/lineHeights-variables.ts",
          filter: 'lineHeights-filter'
        },
      ]
    },


    "textTransformTS": {
      prefix: prefix,
      "transformGroup": "custom-ts",
      buildPath: buildFolder,
      "files": [
        {
          "format": "javascript/es6",
          "destination": "typescript/textTransform-variables.ts",
          filter: 'textTransform-filter'
        },
      ]
    },


    "spaceTS": {
      prefix: prefix,
      "transformGroup": "custom-ts",
      buildPath: buildFolder,
      "files": [
        {
          "format": "javascript/es6",
          "destination": "typescript/space-variables.ts",
          filter: 'space-filter'
        },
      ]
    },


    "bodyTypographyTS": {
      prefix: prefix,
      "transformGroup": "custom-ts",
      buildPath: buildFolder,
      "files": [
        {
          "format": "javascript/es6",
          "destination": "typescript/typography-body-variables.ts",
          filter: 'body-typography-filter'
        },
      ]
    },


    "displayTypographyTS": {
      prefix: prefix,
      "transformGroup": "custom-ts",
      buildPath: buildFolder,
      "files": [
        {
          "format": "javascript/es6",
          "destination": "typescript/typography-display-variables.ts",
          filter: 'display-typography-filter'
        },
      ]
    },

    "bodyTypographyLayersTS": {
      prefix: prefix,
      "transformGroup": "custom-ts",
      buildPath: buildFolderLayers,
      "files": [
        {
          "format": "javascript/es6",
          "destination": "typescript/semantic-typography-body-variables.ts",
          filter: 'body-typography-filter'
        },
      ]
    },

    "displayTypographyLayersTS": {
      prefix: prefix,
      "transformGroup": "custom-ts",
      buildPath: buildFolderLayers,
      "files": [
        {
          "format": "javascript/es6",
          "destination": "typescript/semantic-typography-display-variables.ts",
          filter: 'display-typography-filter'
        },
      ]
    }

  }
});

sd.buildAllPlatforms();





