import typographyCss from '../../../dist/css/typography.css?raw';

export default {
  title: 'Design Tokens/Typography Classes',
  parameters: { layout: 'fullscreen' },
};

/**
 * Parses typography.css into an array of { className, declarations[] } objects.
 * Each declaration is { property, value }.
 */
function parseTypographyClasses(css) {
  const classes = [];
  const blockRe = /\.(hds-[\w-]+)\s*\{([^}]+)\}/g;
  let match;
  while ((match = blockRe.exec(css)) !== null) {
    const className = match[1];
    const body = match[2];
    const declarations = [];
    for (const line of body.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.includes(':')) continue;
      const colonIdx = trimmed.indexOf(':');
      const property = trimmed.slice(0, colonIdx).trim();
      const value = trimmed.slice(colonIdx + 1).replace(/;$/, '').trim();
      declarations.push({ property, value });
    }
    if (declarations.length) classes.push({ className, declarations });
  }
  return classes;
}

const TABLE_STYLES = `
<style>
  .typo-page { padding: 16px; font-family: ui-sans-serif, system-ui, sans-serif; }
  .typo-filter { margin-bottom: 16px; display: flex; gap: 8px; flex-wrap: wrap; }
  .typo-filter-btn {
    padding: 4px 10px; border-radius: 4px; border: 1px solid #ddd;
    background: white; font-size: 12px; cursor: pointer; color: #333;
  }
  .typo-filter-btn.active { background: #333; color: white; border-color: #333; }
  .typo-card {
    margin-bottom: 24px; border: 1px solid #eee; border-radius: 6px; overflow: hidden;
  }
  .typo-card-header {
    padding: 10px 16px; background: #f5f5f5; border-bottom: 1px solid #eee;
    display: flex; align-items: baseline; gap: 16px;
  }
  .typo-class-name {
    font-family: ui-monospace, 'SF Mono', Menlo, monospace;
    font-size: 13px; font-weight: 600; color: #333;
  }
  .typo-sample {
    padding: 16px; border-bottom: 1px solid #eee; min-height: 48px;
  }
  .typo-props {
    width: 100%; border-collapse: collapse;
    font-family: ui-monospace, 'SF Mono', Menlo, monospace; font-size: 11px;
  }
  .typo-props td { padding: 6px 16px; border-bottom: 1px solid #f5f5f5; }
  .typo-props tr:last-child td { border-bottom: none; }
  .typo-props .prop-name { color: #666; width: 160px; }
  .typo-props .prop-value { color: #0070f3; }
  .typo-props .prop-var { color: #888; font-size: 10px; }
</style>`;

function renderCard({ className, declarations }) {
  const sampleText = 'The quick brown fox jumps over the lazy dog';
  const declRows = declarations.map(({ property, value }) => {
    const varMatch = value.match(/var\((--[\w-]+)\)/);
    const varName = varMatch ? varMatch[1] : null;
    return `<tr>
      <td class="prop-name">${property}</td>
      <td class="prop-value">${value}</td>
      ${varName ? `<td class="prop-var">${varName}</td>` : '<td></td>'}
    </tr>`;
  }).join('');

  return `
    <div class="typo-card" data-class="${className}">
      <div class="typo-card-header">
        <span class="typo-class-name">.${className}</span>
      </div>
      <div class="typo-sample">
        <span class="${className}">${sampleText}</span>
      </div>
      <table class="typo-props">
        <tbody>${declRows}</tbody>
      </table>
    </div>`;
}

const allClasses = parseTypographyClasses(typographyCss);

// Group by prefix segment (display, text, action, button, etc.)
function getGroup(className) {
  const withoutPrefix = className.replace(/^hds-/, '');
  return withoutPrefix.split('-')[0];
}

const groups = [...new Set(allClasses.map(c => getGroup(c.className)))].sort();

export const AllClasses = {
  name: 'All Classes',
  render: () => {
    const cards = allClasses.map(renderCard).join('');
    return `${TABLE_STYLES}<div class="typo-page">${cards}</div>`;
  },
};

// Generate one story per group
const groupStories = {};
for (const group of groups) {
  const groupClasses = allClasses.filter(c => getGroup(c.className) === group);
  groupStories[group] = {
    name: group.charAt(0).toUpperCase() + group.slice(1),
    render: () => {
      const cards = groupClasses.map(renderCard).join('');
      return `${TABLE_STYLES}<div class="typo-page">${cards}</div>`;
    },
  };
}

export const Display = groupStories['display'] ?? { render: () => '<p>No display classes found</p>' };
export const Text = groupStories['text'] ?? { render: () => '<p>No text classes found</p>' };
export const Action = groupStories['action'] ?? { render: () => '<p>No action classes found</p>' };
export const Button = groupStories['button'] ?? { render: () => '<p>No button classes found</p>' };
export const Alert = groupStories['alert'] ?? { render: () => '<p>No alert classes found</p>' };
