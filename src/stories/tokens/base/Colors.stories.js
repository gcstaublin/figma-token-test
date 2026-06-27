import { tokenData } from '../../helpers/tokenData.js';
import { flattenTokens, getHex, toCssVar } from '../../helpers/tokens.js';
import { renderGroupedTokenTable } from '../../helpers/tokenTable.js';

export default {
  title: 'Design Tokens/Base/Colors',
  parameters: { layout: 'fullscreen' },
};

const colorJson = tokenData.base.color;

function colorPreview(token) {
  const hex = getHex(token.$value);
  const bg = hex ? hex : `var(${toCssVar(token.path)})`;
  return `<span class="token-preview-swatch" style="background:${bg}"></span>`;
}

const colorGroups = Object.keys(colorJson.color ?? colorJson).map((groupName) => {
  const raw = (colorJson.color ?? colorJson)[groupName];
  const tokens = flattenTokens(raw, ['color', groupName]);
  return { heading: groupName, tokens };
});

export const All = {
  name: 'All Colors',
  render: () => renderGroupedTokenTable(colorGroups, colorPreview),
};

export const Lorax = {
  render: () => renderGroupedTokenTable(
    [{ heading: 'lorax', tokens: flattenTokens(colorJson.color.lorax, ['color', 'lorax']) }],
    colorPreview,
  ),
};

export const Calypso = {
  render: () => renderGroupedTokenTable(
    [{ heading: 'calypso', tokens: flattenTokens(colorJson.color.calypso, ['color', 'calypso']) }],
    colorPreview,
  ),
};

export const Neutral = {
  render: () => renderGroupedTokenTable(
    [{ heading: 'neutral', tokens: flattenTokens(colorJson.color.neutral, ['color', 'neutral']) }],
    colorPreview,
  ),
};

export const Obsidian = {
  render: () => renderGroupedTokenTable(
    [{ heading: 'obsidian', tokens: flattenTokens(colorJson.color.obsidian, ['color', 'obsidian']) }],
    colorPreview,
  ),
};
