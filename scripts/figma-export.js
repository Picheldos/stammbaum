#!/usr/bin/env node

/**
 * Figma → local design export
 *
 * Usage:
 *   node scripts/figma-export.js "https://www.figma.com/design/FILE_KEY/..."
 *
 * Requires:
 *   FIGMA_ACCESS_TOKEN in .env
 */

require('dotenv').config();

const fs = require('fs');
const path = require('path');

const FIGMA_API = 'https://api.figma.com/v1';

const input = process.argv[2];

if (!input) {
  console.error('\n❌ Укажи ссылку на Figma-файл:\n');
  console.error(
    'node scripts/figma-export.js "https://www.figma.com/design/FILE_KEY/..."'
  );
  process.exit(1);
}

const token = process.env.FIGMA_ACCESS_TOKEN;

if (!token) {
  console.error('\n❌ FIGMA_ACCESS_TOKEN не найден в .env\n');
  process.exit(1);
}

function extractFileKey(url) {
  // https://www.figma.com/design/:key/...
  // https://www.figma.com/file/:key/...
  const match = url.match(/figma\.com\/(?:design|file)\/([a-zA-Z0-9]+)(?:\/|$)/);

  if (!match) {
    throw new Error(
      'Не удалось извлечь Figma file key из ссылки.'
    );
  }

  return match[1];
}

const fileKey = extractFileKey(input);

const outputDir = path.resolve(
  process.cwd(),
  'docs',
  'figma-export'
);

const rawDir = path.join(outputDir, 'raw');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(file, data) {
  fs.writeFileSync(
    file,
    JSON.stringify(data, null, 2),
    'utf8'
  );
}

async function figmaRequest(endpoint) {
  const response = await fetch(`${FIGMA_API}${endpoint}`, {
    headers: {
      'X-Figma-Token': token,
      Accept: 'application/json',
    },
  });

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `Figma API вернул не JSON (${response.status}): ${text.slice(0, 500)}`
    );
  }

  if (!response.ok) {
    throw new Error(
      `Figma API ${response.status}: ${
        data.message || JSON.stringify(data)
      }`
    );
  }

  return data;
}

function walk(node, callback) {
  callback(node);

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      walk(child, callback);
    }
  }
}

function collectNodes(document) {
  const nodes = [];

  walk(document, (node) => {
    nodes.push(node);
  });

  return nodes;
}

function simplifyNode(node) {
  return {
    id: node.id,
    name: node.name,
    type: node.type,

    visible: node.visible !== false,

    absoluteBoundingBox: node.absoluteBoundingBox,
    size: node.size,

    relativeTransform: node.relativeTransform,

    layoutMode: node.layoutMode,
    primaryAxisSizingMode: node.primaryAxisSizingMode,
    counterAxisSizingMode: node.counterAxisSizingMode,

    primaryAxisAlignItems: node.primaryAxisAlignItems,
    counterAxisAlignItems: node.counterAxisAlignItems,

    itemSpacing: node.itemSpacing,

    paddingLeft: node.paddingLeft,
    paddingRight: node.paddingRight,
    paddingTop: node.paddingTop,
    paddingBottom: node.paddingBottom,

    layoutGrow: node.layoutGrow,
    layoutAlign: node.layoutAlign,

    constraints: node.constraints,

    fills: node.fills,
    strokes: node.strokes,
    strokeWeight: node.strokeWeight,
    strokeTopWeight: node.strokeTopWeight,
    strokeRightWeight: node.strokeRightWeight,
    strokeBottomWeight: node.strokeBottomWeight,
    strokeLeftWeight: node.strokeLeftWeight,

    cornerRadius: node.cornerRadius,
    rectangleCornerRadii: node.rectangleCornerRadii,

    effects: node.effects,

    opacity: node.opacity,

    blendMode: node.blendMode,

    backgroundColor: node.backgroundColor,

    style: node.style,

    styles: node.styles,

    boundVariables: node.boundVariables,

    componentId: node.componentId,
    componentProperties: node.componentProperties,

    characters: node.characters,

    children: node.children
      ? node.children.map(simplifyNode)
      : undefined,
  };
}

function collectTypography(nodes) {
  const result = [];

  for (const node of nodes) {
    if (node.type !== 'TEXT') continue;

    result.push({
      id: node.id,
      name: node.name,
      characters: node.characters,

      style: node.style
        ? {
            fontFamily: node.style.fontFamily,
            fontPostScriptName: node.style.fontPostScriptName,
            fontWeight: node.style.fontWeight,
            fontSize: node.style.fontSize,
            lineHeightPx: node.style.lineHeightPx,
            lineHeightPercent: node.style.lineHeightPercent,
            lineHeightUnit: node.style.lineHeightUnit,
            letterSpacing: node.style.letterSpacing,
            textCase: node.style.textCase,
            textDecoration: node.style.textDecoration,
            italic: node.style.italic,
            textAutoResize: node.style.textAutoResize,
          }
        : null,

      styles: node.styles,
      boundVariables: node.boundVariables,
    });
  }

  return result;
}

function collectComponents(nodes) {
  return nodes
    .filter(
      (node) =>
        node.type === 'COMPONENT' ||
        node.type === 'COMPONENT_SET' ||
        node.type === 'INSTANCE'
    )
    .map((node) => ({
      id: node.id,
      name: node.name,
      type: node.type,
      componentId: node.componentId,
      componentProperties: node.componentProperties,
      size: node.size,
      absoluteBoundingBox: node.absoluteBoundingBox,
      layoutMode: node.layoutMode,
      itemSpacing: node.itemSpacing,
      paddingLeft: node.paddingLeft,
      paddingRight: node.paddingRight,
      paddingTop: node.paddingTop,
      paddingBottom: node.paddingBottom,
      fills: node.fills,
      strokes: node.strokes,
      effects: node.effects,
      cornerRadius: node.cornerRadius,
      style: node.style,
      styles: node.styles,
      boundVariables: node.boundVariables,
    }));
}

function collectStyles(nodes) {
  const styles = new Map();

  for (const node of nodes) {
    if (!node.styles) continue;

    for (const [property, styleId] of Object.entries(node.styles)) {
      if (!styles.has(styleId)) {
        styles.set(styleId, {
          id: styleId,
          properties: [],
        });
      }

      styles.get(styleId).properties.push({
        nodeId: node.id,
        nodeName: node.name,
        property,
      });
    }
  }

  return [...styles.values()];
}

function collectColors(nodes) {
  const colors = [];

  function addPaints(node, property, paints) {
    if (!Array.isArray(paints)) return;

    for (const paint of paints) {
      if (!paint.color) continue;

      colors.push({
        nodeId: node.id,
        nodeName: node.name,
        property,
        type: paint.type,
        color: paint.color,
        opacity: paint.opacity,
        visible: paint.visible !== false,
        boundVariables: paint.boundVariables,
      });
    }
  }

  for (const node of nodes) {
    addPaints(node, 'fills', node.fills);
    addPaints(node, 'strokes', node.strokes);
  }

  return colors;
}

function collectSpacing(nodes) {
  const values = new Set();

  for (const node of nodes) {
    const candidates = [
      node.itemSpacing,
      node.paddingLeft,
      node.paddingRight,
      node.paddingTop,
      node.paddingBottom,
    ];

    for (const value of candidates) {
      if (typeof value === 'number') {
        values.add(value);
      }
    }
  }

  return [...values].sort((a, b) => a - b);
}

function collectRadii(nodes) {
  const values = new Set();

  for (const node of nodes) {
    if (typeof node.cornerRadius === 'number') {
      values.add(node.cornerRadius);
    }

    if (Array.isArray(node.rectangleCornerRadii)) {
      for (const value of node.rectangleCornerRadii) {
        if (typeof value === 'number') {
          values.add(value);
        }
      }
    }
  }

  return [...values].sort((a, b) => a - b);
}

function collectEffects(nodes) {
  return nodes
    .filter(
      (node) =>
        Array.isArray(node.effects) &&
        node.effects.length > 0
    )
    .map((node) => ({
      nodeId: node.id,
      nodeName: node.name,
      effects: node.effects,
    }));
}

function createMarkdownSummary({
  file,
  nodes,
  typography,
  components,
  colors,
  spacing,
  radii,
  effects,
}) {
  const pages = file.document.children || [];

  const lines = [];

  lines.push('# Figma Design Export');
  lines.push('');
  lines.push(`**File:** ${file.name}`);
  lines.push(`**Last modified:** ${file.lastModified}`);
  lines.push(`**Version:** ${file.version}`);
  lines.push('');
  lines.push('## Pages');
  lines.push('');

  for (const page of pages) {
    lines.push(
      `- **${page.name}** — ${page.children?.length || 0} top-level nodes`
    );
  }

  lines.push('');
  lines.push('## Statistics');
  lines.push('');
  lines.push(`- Total nodes: ${nodes.length}`);
  lines.push(`- Text nodes: ${typography.length}`);
  lines.push(`- Components / instances: ${components.length}`);
  lines.push(`- Color usages: ${colors.length}`);
  lines.push(`- Unique spacing values: ${spacing.length}`);
  lines.push(`- Unique radius values: ${radii.length}`);
  lines.push(`- Nodes with effects: ${effects.length}`);

  lines.push('');
  lines.push('## Typography');
  lines.push('');

  const typographyMap = new Map();

  for (const item of typography) {
    const style = item.style;
    if (!style) continue;

    const key = [
      style.fontFamily,
      style.fontSize,
      style.fontWeight,
      style.lineHeightPx,
      style.letterSpacing,
    ].join('|');

    if (!typographyMap.has(key)) {
      typographyMap.set(key, {
        ...style,
        usages: [],
      });
    }

    typographyMap
      .get(key)
      .usages.push(item.name);
  }

  for (const item of typographyMap.values()) {
    lines.push(
      `- **${item.fontFamily}** ${item.fontSize}px / ${item.fontWeight} — line-height ${item.lineHeightPx}px — letter-spacing ${item.letterSpacing}px`
    );

    const usages = [...new Set(item.usages)].slice(0, 10);

    if (usages.length) {
      lines.push(`  - Usage: ${usages.join(', ')}`);
    }
  }

  lines.push('');
  lines.push('## Spacing');
  lines.push('');
  lines.push(spacing.join(', '));

  lines.push('');
  lines.push('## Border Radius');
  lines.push('');
  lines.push(radii.join(', '));

  lines.push('');
  lines.push('## Components');
  lines.push('');

  for (const component of components) {
    lines.push(
      `- ${component.type}: **${component.name}** (${component.id})`
    );
  }

  return lines.join('\n');
}

async function main() {
  console.log('\n🎨 Figma Design Export');
  console.log('────────────────────────────');
  console.log(`File key: ${fileKey}`);

  ensureDir(outputDir);
  ensureDir(rawDir);

  console.log('\n1/8 Получаю файл...');

  const file = await figmaRequest(
    `/files/${fileKey}?geometry=paths`
  );

  writeJson(
    path.join(rawDir, 'file.json'),
    file
  );

  console.log(`   ✓ ${file.name}`);

  console.log('\n2/8 Анализирую nodes...');

  const nodes = collectNodes(file.document);

  writeJson(
    path.join(rawDir, 'nodes.json'),
    nodes.map(simplifyNode)
  );

  console.log(`   ✓ ${nodes.length} nodes`);

  console.log('\n3/8 Извлекаю typography...');

  const typography = collectTypography(nodes);

  writeJson(
    path.join(outputDir, 'typography.json'),
    typography
  );

  console.log(`   ✓ ${typography.length} text nodes`);

  console.log('\n4/8 Извлекаю components...');

  const components = collectComponents(nodes);

  writeJson(
    path.join(outputDir, 'components.json'),
    components
  );

  console.log(`   ✓ ${components.length} components / instances`);

  console.log('\n5/8 Извлекаю colors и styles...');

  const colors = collectColors(nodes);
  const styles = collectStyles(nodes);

  writeJson(
    path.join(outputDir, 'colors.json'),
    colors
  );

  writeJson(
    path.join(outputDir, 'styles.json'),
    styles
  );

  console.log(`   ✓ ${colors.length} color usages`);
  console.log(`   ✓ ${styles.length} styles`);

  console.log('\n6/8 Извлекаю spacing / radius...');

  const spacing = collectSpacing(nodes);
  const radii = collectRadii(nodes);

  writeJson(
    path.join(outputDir, 'spacing.json'),
    spacing
  );

  writeJson(
    path.join(outputDir, 'radii.json'),
    radii
  );

  console.log(`   ✓ ${spacing.length} spacing values`);
  console.log(`   ✓ ${radii.length} radius values`);

  console.log('\n7/8 Извлекаю effects...');

  const effects = collectEffects(nodes);

  writeJson(
    path.join(outputDir, 'effects.json'),
    effects
  );

  console.log(`   ✓ ${effects.length} nodes with effects`);

  console.log('\n8/8 Создаю summary...');

  const summary = createMarkdownSummary({
    file,
    nodes,
    typography,
    components,
    colors,
    spacing,
    radii,
    effects,
  });

  fs.writeFileSync(
    path.join(outputDir, 'design-spec.md'),
    summary,
    'utf8'
  );

  fs.writeFileSync(
    path.join(outputDir, 'README.md'),
    `# Figma Export

Automatically generated from:

${input}

File:
**${file.name}**

Generated:
${new Date().toISOString()}

## Files

- \`design-spec.md\` — human/AI-readable summary
- \`typography.json\` — all text nodes and typography
- \`components.json\` — components and instances
- \`colors.json\` — color usages
- \`styles.json\` — style references
- \`spacing.json\` — spacing scale discovered from nodes
- \`radii.json\` — border-radius values
- \`effects.json\` — effects
- \`raw/file.json\` — complete Figma API response
- \`raw/nodes.json\` — normalized node tree

The raw Figma response is intentionally preserved so the
export can be reprocessed later without another Figma API request.
`,
    'utf8'
  );

  console.log('\n────────────────────────────');
  console.log('✅ EXPORT COMPLETE');
  console.log('────────────────────────────');

  console.log(`\nSaved to:`);
  console.log(outputDir);

  console.log('\nFiles:');
  console.log('  ✓ raw/file.json');
  console.log('  ✓ raw/nodes.json');
  console.log('  ✓ typography.json');
  console.log('  ✓ components.json');
  console.log('  ✓ colors.json');
  console.log('  ✓ styles.json');
  console.log('  ✓ spacing.json');
  console.log('  ✓ radii.json');
  console.log('  ✓ effects.json');
  console.log('  ✓ design-spec.md');
  console.log('  ✓ README.md');

  console.log('\n');
}

main().catch((error) => {
  console.error('\n❌ Export failed:\n');
  console.error(error.message);
  process.exit(1);
});