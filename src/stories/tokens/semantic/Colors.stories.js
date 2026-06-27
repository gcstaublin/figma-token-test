import { tokenData } from '../../helpers/tokenData.js';
import { flattenTokens, getHex, toCssVar } from '../../helpers/tokens.js';
import { renderGroupedTokenTable } from '../../helpers/tokenTable.js';

export default {
  title: 'Design Tokens/Semantic/Colors',
  parameters: { layout: 'fullscreen' },
};

function colorPreview(token) {
  const hex = getHex(token.$value);
  const bg = hex ? hex : `var(${toCssVar(token.path)})`;
  return `<span class="token-preview-swatch" style="background:${bg}"></span>`;
}

const semColorGroups = Object.keys(tokenData.semantic.color.color ?? {}).map((role) => {
  const roleObj = tokenData.semantic.color.color[role];
  const tokens = flattenTokens(roleObj, ['color', role]);
  return { heading: role, tokens };
});

const darkGroups = Object.keys(tokenData.semantic.colorDark.color ?? {}).map((role) => {
  const roleObj = tokenData.semantic.colorDark.color[role];
  const tokens = flattenTokens(roleObj, ['color', role]);
  return { heading: role, tokens };
});

export const LightMode = {
  name: 'Light Mode',
  render: () => renderGroupedTokenTable(semColorGroups, colorPreview),
};

export const DarkMode = {
  name: 'Dark Mode',
  decorators: [(story) => `<div class="dark" style="background:#111;padding:16px;min-height:100vh">${story()}</div>`],
  render: () => renderGroupedTokenTable(darkGroups, colorPreview),
};
