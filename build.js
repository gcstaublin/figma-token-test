import StyleDictionary from 'style-dictionary';
import { usesReferences, getReferences } from 'style-dictionary/utils';

const prefix = 'hds';
const buildPath = 'dist/';

// Figma Variables exports colors as { colorSpace, components, alpha, hex }.
// Normalize to a plain hex string so the built-in color/css transform can process it.
StyleDictionary.registerTransform({
  name: 'color/figma',
  type: 'value',
  filter: (token) => token.$type === 'color',
  transform: (token) => {
    const val = token.$value;
    return val && typeof val === 'object' && val.hex ? val.hex : val;
  },
});

// After typography tokens are expanded, lineHeight sub-values may be math expressions
// like "32px * 1.2" (Figma's proportional line-height encoding). Wrap in calc() so
// the value is valid CSS. Runs transitive so refs are resolved to actual values before firing.
StyleDictionary.registerTransform({
  name: 'value/math-to-calc',
  type: 'value',
  transitive: true,
  filter: (token) => {
    const val = token.$value;
    return typeof val === 'string' && /\S+\s*\*\s*\S+/.test(val);
  },
  transform: (token) => `calc(${token.$value})`,
});

// outputReferences must return false for math expressions so the format uses the
// resolved calc() value instead of trying to re-expand var() references inline.
const outputReferencesFilter = (token) => {
  const orig = token.original?.$value ?? token.original?.value ?? '';
  if (typeof orig === 'string' && /\{[^}]+\}\s*\*/.test(orig)) return false;
  return true;
};

const CSS_TRANSFORMS = [
  'attribute/cti',
  'name/kebab',
  'color/figma',
  'color/css',
  'size/rem',
  'fontFamily/css',
  'cubicBezier/css',
  'value/math-to-calc',
  'strokeStyle/css/shorthand',
  'border/css/shorthand',
  'transition/css/shorthand',
  'shadow/css/shorthand',
];

StyleDictionary.registerTransformGroup({ name: 'css/figma', transforms: CSS_TRANSFORMS });
StyleDictionary.registerTransformGroup({ name: 'scss/figma', transforms: CSS_TRANSFORMS });

StyleDictionary.registerTransformGroup({
  name: 'ts/figma',
  transforms: ['attribute/cti', 'name/constant', 'color/figma', 'color/hex'],
});

// TypeScript ES6 constants with reference support.
// When outputReferences: true, referenced tokens use the constant name as the value
// (e.g. `export const HDS_COLOR_TEXT_DEFAULT = HDS_COLOR_OBSIDIAN;`)
// instead of resolving to the final value.
StyleDictionary.registerFormat({
  name: 'typescript/es6-references',
  format: ({ dictionary, options }) => {
    const header = '/**\n * Do not edit directly, this file was auto-generated.\n */\n\n';

    const lines = dictionary.allTokens.map((token) => {
      const comment = token.$description ? ` // ${token.$description}` : '';
      const originalValue = token.original.$value ?? token.original.value;

      if (options?.outputReferences && usesReferences(originalValue)) {
        const refs = getReferences(originalValue, dictionary.unfilteredTokens ?? dictionary.tokens);
        if (refs.length === 1) {
          return `export const ${token.name} = ${refs[0].name};${comment}`;
        }
      }

      const value = token.$value ?? token.value;
      return `export const ${token.name} = ${JSON.stringify(String(value))};${comment}`;
    });

    return header + lines.join('\n') + '\n';
  },
});

// Maps the kebab-cased suffix of an expanded typography token name to its CSS property.
// e.g. a token named 'hds-display-heading1-font-family' ends in 'font-family' → font-family.
const TYPOGRAPHY_PROP_MAP = {
  'font-family': 'font-family',
  'font-size': 'font-size',
  'font-weight': 'font-weight',
  'line-height': 'line-height',
  'font-style': 'font-style',
  'letter-spacing': 'letter-spacing',
  'text-decoration': 'text-decoration',
  'text-transform': 'text-transform',
  'paragraph-spacing': 'margin-bottom',
  'paragraph-indent': 'text-indent',
};

// Generates CSS utility classes from expanded typography tokens.
// Groups tokens by parent name (e.g. 'hds-display-heading1') and emits one class per group.
StyleDictionary.registerFormat({
  name: 'css/typography-classes',
  format: ({ dictionary }) => {
    const groups = new Map();

    for (const token of dictionary.allTokens) {
      for (const [suffix, cssProp] of Object.entries(TYPOGRAPHY_PROP_MAP)) {
        if (token.name.endsWith(`-${suffix}`)) {
          const parent = token.name.slice(0, -(suffix.length + 1));
          if (!groups.has(parent)) groups.set(parent, []);
          groups.get(parent).push({ cssProp, varName: token.name });
          break;
        }
      }
    }

    const header = '/**\n * Do not edit directly, this file was auto-generated.\n */\n\n';
    const blocks = [];

    for (const [className, props] of groups) {
      const declarations = props
        .map(({ cssProp, varName }) => `  ${cssProp}: var(--${varName});`)
        .join('\n');
      blocks.push(`.${className} {\n${declarations}\n}`);
    }

    return header + blocks.join('\n\n') + '\n';
  },
});


// ----------------------------------------
// All tokens — light mode (Base + Semantic, excluding dark mode overrides)
// Typography tokens are expanded into individual sub-property tokens.
// ----------------------------------------
const sdAll = new StyleDictionary({
  usesDtcg: true,
  expand: { include: ['typography'] },
  log: { errors: { brokenReferences: 'warn' } },
  source: [
    'figma-tokens/Base/*.json',
    'figma-tokens/Semantic/*.json',
    '!figma-tokens/Semantic/color-dark.json',
  ],
  platforms: {
    css: {
      prefix,
      transformGroup: 'css/figma',
      buildPath,
      files: [
        {
          destination: 'css/variables.css',
          format: 'css/variables',
          options: { outputReferences: outputReferencesFilter },
        },
        {
          destination: 'css/typography.css',
          format: 'css/typography-classes',
        },
      ],
    },
    scss: {
      prefix,
      transformGroup: 'scss/figma',
      buildPath,
      files: [{
        destination: 'scss/variables.scss',
        format: 'scss/variables',
        options: { outputReferences: true },
      }],
    },
    ts: {
      prefix,
      transformGroup: 'ts/figma',
      buildPath,
      files: [{
        destination: 'ts/variables.ts',
        format: 'typescript/es6-references',
        options: { outputReferences: true },
      }],
    },
  },
});


// ----------------------------------------
// Dark mode overrides — outputs as .dark { ... }
// ----------------------------------------
const sdDark = new StyleDictionary({
  usesDtcg: true,
  source: [
    'figma-tokens/Base/*.json',
    'figma-tokens/Semantic/color-dark.json',
  ],
  platforms: {
    css: {
      prefix,
      transformGroup: 'css/figma',
      buildPath,
      files: [{
        destination: 'css/variables-dark.css',
        format: 'css/variables',
        filter: (token) => token.filePath.includes('color-dark'),
        options: {
          outputReferences: true,
          selector: '.dark',
        },
      }],
    },
    scss: {
      prefix,
      transformGroup: 'scss/figma',
      buildPath,
      files: [{
        destination: 'scss/variables-dark.scss',
        format: 'scss/variables',
        filter: (token) => token.filePath.includes('color-dark'),
        options: { outputReferences: true },
      }],
    },
    ts: {
      prefix,
      transformGroup: 'ts/figma',
      buildPath,
      files: [{
        destination: 'ts/variables-dark.ts',
        format: 'typescript/es6-references',
        filter: (token) => token.filePath.includes('color-dark'),
        options: { outputReferences: true },
      }],
    },
  },
});


// ----------------------------------------
// Base layer only
// ----------------------------------------
const sdBase = new StyleDictionary({
  usesDtcg: true,
  source: ['figma-tokens/Base/*.json'],
  platforms: {
    css: {
      prefix,
      transformGroup: 'css/figma',
      buildPath: `${buildPath}layers/`,
      files: [{
        destination: 'css/base.css',
        format: 'css/variables',
        options: { outputReferences: true },
      }],
    },
    scss: {
      prefix,
      transformGroup: 'scss/figma',
      buildPath: `${buildPath}layers/`,
      files: [{
        destination: 'scss/base.scss',
        format: 'scss/variables',
        options: { outputReferences: true },
      }],
    },
    ts: {
      prefix,
      transformGroup: 'ts/figma',
      buildPath: `${buildPath}layers/`,
      files: [{
        destination: 'ts/base.ts',
        format: 'typescript/es6-references',
        options: { outputReferences: true },
      }],
    },
  },
});


// ----------------------------------------
// Semantic layer only (references Base)
// Typography tokens expanded into individual sub-property tokens.
// ----------------------------------------
const sdSemantic = new StyleDictionary({
  usesDtcg: true,
  expand: { include: ['typography'] },
  log: { errors: { brokenReferences: 'warn' } },
  source: [
    'figma-tokens/Base/*.json',
    'figma-tokens/Semantic/*.json',
    '!figma-tokens/Semantic/color-dark.json',
  ],
  platforms: {
    css: {
      prefix,
      transformGroup: 'css/figma',
      buildPath: `${buildPath}layers/`,
      files: [{
        destination: 'css/semantic.css',
        format: 'css/variables',
        filter: (token) => token.filePath.includes('Semantic'),
        options: { outputReferences: outputReferencesFilter },
      }],
    },
    scss: {
      prefix,
      transformGroup: 'scss/figma',
      buildPath: `${buildPath}layers/`,
      files: [{
        destination: 'scss/semantic.scss',
        format: 'scss/variables',
        filter: (token) => token.filePath.includes('Semantic'),
        options: { outputReferences: true },
      }],
    },
    ts: {
      prefix,
      transformGroup: 'ts/figma',
      buildPath: `${buildPath}layers/`,
      files: [{
        destination: 'ts/semantic.ts',
        format: 'typescript/es6-references',
        filter: (token) => token.filePath.includes('Semantic'),
        options: { outputReferences: true },
      }],
    },
  },
});


await sdAll.buildAllPlatforms();
await sdDark.buildAllPlatforms();
await sdBase.buildAllPlatforms();
await sdSemantic.buildAllPlatforms();
