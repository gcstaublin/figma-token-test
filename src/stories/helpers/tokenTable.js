import { toCssVar, toScssVar, toTsConst } from './tokens.js';

const TABLE_STYLES = `
  <style>
    .token-table {
      width: 100%;
      border-collapse: collapse;
      font-family: ui-monospace, 'SF Mono', Menlo, monospace;
      font-size: 12px;
    }
    .token-table th {
      text-align: left;
      padding: 8px 12px;
      background: #f5f5f5;
      border-bottom: 2px solid #ddd;
      font-family: ui-sans-serif, system-ui, sans-serif;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #666;
    }
    .token-table td {
      padding: 8px 12px;
      border-bottom: 1px solid #eee;
      vertical-align: middle;
    }
    .token-table tr:last-child td { border-bottom: none; }
    .token-table tr:hover td { background: #fafafa; }
    .token-table code {
      background: #f0f0f0;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 11px;
      white-space: nowrap;
    }
    .token-preview-swatch {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      border: 1px solid rgba(0,0,0,0.1);
      display: inline-block;
    }
    .token-preview-space {
      height: 16px;
      background: #0070f3;
      border-radius: 2px;
      display: inline-block;
      min-width: 2px;
    }
    .token-preview-text {
      font-family: ui-sans-serif, system-ui, sans-serif;
      color: #333;
    }
    .token-section-heading {
      font-family: ui-sans-serif, system-ui, sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: #444;
      margin: 24px 0 4px;
      padding-bottom: 6px;
      border-bottom: 1px solid #eee;
      text-transform: capitalize;
    }
    .token-page { padding: 16px; }
    .token-value {
      color: #888;
      font-size: 11px;
    }
    .token-desc {
      font-family: ui-sans-serif, system-ui, sans-serif;
      font-size: 12px;
      color: #666;
      max-width: 260px;
    }
  </style>
`;

/**
 * Renders a full token table.
 * @param {Array} tokens - flat token array from flattenTokens()
 * @param {Function} renderPreview - (token) => HTML string for the preview cell
 * @param {Object} options
 * @param {boolean} [options.showDescription=true]
 * @param {boolean} [options.showValue=true]
 */
export function renderTokenTable(tokens, renderPreview, { showDescription = true, showValue = true } = {}) {
  const rows = tokens.map((token) => {
    const css = toCssVar(token.path);
    const scss = toScssVar(token.path);
    const ts = toTsConst(token.path);
    const preview = renderPreview(token);
    const desc = token.$description || '';

    return `
      <tr>
        <td>${preview}</td>
        <td><code>${css}</code></td>
        <td><code>${scss}</code></td>
        <td><code>${ts}</code></td>
        ${showValue ? `<td class="token-value">${formatValue(token.$value)}</td>` : ''}
        ${showDescription ? `<td class="token-desc">${desc}</td>` : ''}
      </tr>`;
  }).join('');

  return `
    ${TABLE_STYLES}
    <div class="token-page">
      <table class="token-table">
        <thead>
          <tr>
            <th>Preview</th>
            <th>CSS Variable</th>
            <th>SCSS Variable</th>
            <th>TypeScript</th>
            ${showValue ? '<th>Value</th>' : ''}
            ${showDescription ? '<th>Description</th>' : ''}
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

/**
 * Renders multiple token groups with section headings.
 * @param {Array<{heading: string, tokens: Array}>} groups
 * @param {Function} renderPreview
 * @param {Object} options
 */
export function renderGroupedTokenTable(groups, renderPreview, options = {}) {
  const sections = groups.map(({ heading, tokens }) => {
    if (!tokens.length) return '';
    const rows = tokens.map((token) => {
      const css = toCssVar(token.path);
      const scss = toScssVar(token.path);
      const ts = toTsConst(token.path);
      const preview = renderPreview(token);
      const desc = token.$description || '';
      return `
        <tr>
          <td>${preview}</td>
          <td><code>${css}</code></td>
          <td><code>${scss}</code></td>
          <td><code>${ts}</code></td>
          <td class="token-value">${formatValue(token.$value)}</td>
          <td class="token-desc">${desc}</td>
        </tr>`;
    }).join('');

    return `
      <h3 class="token-section-heading">${heading}</h3>
      <table class="token-table">
        <thead>
          <tr>
            <th>Preview</th>
            <th>CSS Variable</th>
            <th>SCSS Variable</th>
            <th>TypeScript</th>
            <th>Value</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }).join('');

  return `${TABLE_STYLES}<div class="token-page">${sections}</div>`;
}

function formatValue(val) {
  if (!val) return '—';
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val.hex) return val.hex;
  if (typeof val === 'object') return JSON.stringify(val).slice(0, 60);
  return String(val);
}
