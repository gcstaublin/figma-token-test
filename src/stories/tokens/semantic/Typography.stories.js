import { tokenData } from '../../helpers/tokenData.js';
import { flattenTokens } from '../../helpers/tokens.js';
import { renderGroupedTokenTable } from '../../helpers/tokenTable.js';

export default {
  title: 'Design Tokens/Semantic/Typography',
  parameters: { layout: 'fullscreen' },
};

function typographyPreview(token) {
  const label = token.path[token.path.length - 1];
  return `<span class="token-preview-text" style="font-size:13px;font-weight:600">${label}</span>`;
}

const typo = tokenData.semantic.typography;

const displayGroups = flattenTokens(typo.display, ['display']).reduce((acc, token) => {
  const parent = token.path[1];
  let group = acc.find(g => g.heading === parent);
  if (!group) { group = { heading: parent, tokens: [] }; acc.push(group); }
  group.tokens.push(token);
  return acc;
}, []);

const textGroups = flattenTokens(typo.text, ['text']).reduce((acc, token) => {
  const parent = token.path[1];
  let group = acc.find(g => g.heading === parent);
  if (!group) { group = { heading: parent, tokens: [] }; acc.push(group); }
  group.tokens.push(token);
  return acc;
}, []);

export const DisplayStyles = {
  name: 'Display Styles',
  render: () => renderGroupedTokenTable(displayGroups, typographyPreview),
};

export const TextStyles = {
  name: 'Text Styles',
  render: () => renderGroupedTokenTable(textGroups, typographyPreview),
};
