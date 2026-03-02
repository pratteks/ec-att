/* Script to generate import-<template>.js files for each non-homepage template */
const fs = require('fs');
const path = require('path');

const templates = require('./page-templates.json').templates;

function toCamelCase(name) {
  return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) + 'Parser';
}

function generateImportScript(template) {
  const blockNames = [...new Set(template.blocks.map(b => b.name))];

  const parserImports = blockNames.map(b =>
    `import ${toCamelCase(b)} from './parsers/${b}.js';`
  ).join('\n');

  const parserRegistryEntries = blockNames.map(b =>
    `  '${b}': ${toCamelCase(b)},`
  ).join('\n');

  const templateConfig = JSON.stringify({
    name: template.name,
    description: template.description,
    urls: template.urls,
    blocks: template.blocks,
    sections: template.sections || [],
  }, null, 2);

  return `/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
${parserImports}

// TRANSFORMER IMPORTS
import attCleanupTransformer from './transformers/att-cleanup.js';
import attSectionsTransformer from './transformers/att-sections.js';

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = ${templateConfig};

// PARSER REGISTRY
const parsers = {
${parserRegistryEntries}
};

// TRANSFORMER REGISTRY
const transformers = [
  attCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [attSectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(\`Transformer failed at \${hookName}:\`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(\`Block "\${blockDef.name}" selector not found: \${selector}\`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(\`Found \${pageBlocks.length} block instances on page\`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(\`Failed to parse \${block.name} (\${block.selector}):\`, e);
        }
      } else {
        console.warn(\`No parser found for block: \${block.name}\`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const pathStr = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\\/$/, '').replace(/\\.html$/, ''),
    );

    return [{
      element: main,
      path: pathStr || '/index',
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
`;
}

// Generate for each non-homepage template
templates
  .filter(t => t.name !== 'homepage')
  .forEach(t => {
    const script = generateImportScript(t);
    const outPath = path.join(__dirname, `import-${t.name}.js`);
    fs.writeFileSync(outPath, script);
    console.log(`Generated: import-${t.name}.js`);
  });

console.log('Done!');
