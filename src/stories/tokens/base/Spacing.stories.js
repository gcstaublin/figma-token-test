import { tokenData } from '../../helpers/tokenData.js';
import { flattenTokens } from '../../helpers/tokens.js';
import { renderTokenTable } from '../../helpers/tokenTable.js';

export default {
  title: 'Design Tokens/Base/Spacing',
  parameters: { layout: 'fullscreen' },
};

const tokens = flattenTokens(tokenData.base.space);

function spacePreview(token) {
  const val = token.$value;
  const px = typeof val === 'string' && val.endsWith('px') ? val : `${val}px`;
  return `<span class="token-preview-space" style="width:${px}"></span>`;
}

export const AllSpacing = {
  name: 'All Spacing',
  render: () => renderTokenTable(tokens, spacePreview),
};
