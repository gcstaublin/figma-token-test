import { tokenData } from '../../helpers/tokenData.js';
import { flattenTokens } from '../../helpers/tokens.js';
import { renderGroupedTokenTable } from '../../helpers/tokenTable.js';

export default {
  title: 'Design Tokens/Base/Border',
  parameters: { layout: 'fullscreen' },
};

const allBorder = flattenTokens(tokenData.base.border);

const radiusTokens = allBorder.filter(t => t.path.some(p => p === 'radius'));
const widthTokens = allBorder.filter(t => t.path.some(p => p === 'width'));
const otherTokens = allBorder.filter(t => !t.path.some(p => p === 'radius' || p === 'width'));

function borderPreview(token) {
  const pathStr = token.path.join('.');
  if (pathStr.includes('radius')) {
    const val = token.$value;
    return `<span style="display:inline-block;width:32px;height:32px;border:2px solid #333;border-radius:${val}"></span>`;
  }
  if (pathStr.includes('width')) {
    const val = token.$value;
    return `<span style="display:inline-block;width:32px;height:0;border-top:${val} solid #333"></span>`;
  }
  return `<span style="font-size:11px;color:#888">${JSON.stringify(token.$value).slice(0, 40)}</span>`;
}

export const AllBorder = {
  name: 'All Border',
  render: () => renderGroupedTokenTable(
    [
      { heading: 'Border Radius', tokens: radiusTokens },
      { heading: 'Border Width', tokens: widthTokens },
      { heading: 'Other', tokens: otherTokens },
    ],
    borderPreview,
  ),
};
