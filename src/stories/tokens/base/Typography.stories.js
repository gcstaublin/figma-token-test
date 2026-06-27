import { tokenData } from '../../helpers/tokenData.js';
import { flattenTokens } from '../../helpers/tokens.js';
import { renderGroupedTokenTable } from '../../helpers/tokenTable.js';

export default {
  title: 'Design Tokens/Base/Typography',
  parameters: { layout: 'fullscreen' },
};

function fontFamilyPreview(token) {
  const val = typeof token.$value === 'string' ? token.$value : String(token.$value);
  return `<span class="token-preview-text" style="font-family:${val}">Aa</span>`;
}

function fontSizePreview(token) {
  return `<span class="token-preview-text" style="font-size:${token.$value};line-height:1">Ag</span>`;
}

function fontWeightPreview(token) {
  return `<span class="token-preview-text" style="font-weight:${token.$value}">Ag</span>`;
}

function lineHeightPreview(token) {
  return `<span class="token-preview-text" style="font-size:12px">${token.$value}</span>`;
}

export const FontFamilies = {
  render: () => renderGroupedTokenTable(
    [{ heading: 'Font Families', tokens: flattenTokens(tokenData.base.fontFamily) }],
    fontFamilyPreview,
  ),
};

export const FontSizes = {
  render: () => renderGroupedTokenTable(
    [{ heading: 'Font Sizes', tokens: flattenTokens(tokenData.base.fontSize) }],
    fontSizePreview,
  ),
};

export const FontWeights = {
  render: () => renderGroupedTokenTable(
    [{ heading: 'Font Weights', tokens: flattenTokens(tokenData.base.fontWeight) }],
    fontWeightPreview,
  ),
};

export const LineHeights = {
  render: () => renderGroupedTokenTable(
    [{ heading: 'Line Heights', tokens: flattenTokens(tokenData.base.lineHeight) }],
    lineHeightPreview,
  ),
};
