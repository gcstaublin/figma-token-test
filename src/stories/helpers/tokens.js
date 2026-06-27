const PREFIX = 'hds';

/**
 * Recursively flattens a DTCG token JSON object into a flat array.
 * Each item has { path, $type, $value, $description }.
 */
export function flattenTokens(obj, path = []) {
  const tokens = [];
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    if (val && typeof val === 'object' && '$value' in val) {
      tokens.push({ path: [...path, key], $type: val.$type, $value: val.$value, $description: val.$description });
    } else if (val && typeof val === 'object') {
      tokens.push(...flattenTokens(val, [...path, key]));
    }
  }
  return tokens;
}

function segmentToKebab(s) {
  return s.replace(/\s+/g, '-').toLowerCase();
}

function segmentToConstant(s) {
  return s.replace(/[\s-]+/g, '_').toUpperCase();
}

export function toCssVar(path) {
  return `--${PREFIX}-${path.map(segmentToKebab).join('-')}`;
}

export function toScssVar(path) {
  return `$${PREFIX}-${path.map(segmentToKebab).join('-')}`;
}

export function toTsConst(path) {
  return `${PREFIX.toUpperCase()}_${path.map(segmentToConstant).join('_')}`;
}

/** Extracts a hex string from a Figma color value (object or plain string). */
export function getHex(val) {
  if (!val) return null;
  if (typeof val === 'string') return val.startsWith('#') ? val : null;
  if (typeof val === 'object' && val.hex) return val.hex;
  return null;
}

/** Returns true if a value is a token reference ({...}). */
export function isReference(val) {
  return typeof val === 'string' && val.startsWith('{') && val.endsWith('}');
}
