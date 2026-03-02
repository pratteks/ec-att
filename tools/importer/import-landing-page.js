/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import cardsValueParser from './parsers/cards-value.js';
import cardsProductParser from './parsers/cards-product.js';
import columnsOfferParser from './parsers/columns-offer.js';
import accordionLinksParser from './parsers/accordion-links.js';

// TRANSFORMER IMPORTS
import attCleanupTransformer from './transformers/att-cleanup.js';
import attSectionsTransformer from './transformers/att-sections.js';

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  "name": "landing-page",
  "description": "Promotional or about landing page with hero, value propositions, feature highlights, and sales CTA",
  "urls": [
    "https://www.business.att.com/about/why-att-business.html",
    "https://www.business.att.com/offers/switch-to-att-business.html"
  ],
  "blocks": [
    {
      "name": "hero-banner",
      "instances": [
        "div.hero.aem-GridColumn:nth-of-type(1)",
        "div.hero.aem-GridColumn:nth-of-type(2)"
      ]
    },
    {
      "name": "cards-value",
      "instances": [
        "div.generic-list-value-prop.aem-GridColumn"
      ]
    },
    {
      "name": "cards-product",
      "instances": [
        "div.multi-tile-cards.aem-GridColumn:nth-of-type(1)",
        "div.multi-tile-cards.aem-GridColumn:nth-of-type(2)",
        "div.multi-tile-cards.aem-GridColumn:nth-of-type(3)"
      ]
    },
    {
      "name": "columns-offer",
      "instances": [
        "div.offer.aem-GridColumn"
      ]
    },
    {
      "name": "accordion-links",
      "instances": [
        "div.link-farm.aem-GridColumn"
      ]
    }
  ],
  "sections": [
    {
      "id": "section-1",
      "name": "Hero Banner",
      "selector": "div.hero.aem-GridColumn:nth-of-type(1)",
      "style": null,
      "blocks": [
        "hero-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "section-2",
      "name": "Value Propositions",
      "selector": "div.generic-list-value-prop.aem-GridColumn",
      "style": "accent",
      "blocks": [
        "cards-value"
      ],
      "defaultContent": []
    },
    {
      "id": "section-3",
      "name": "AT&T Difference Cards",
      "selector": "div.multi-tile-cards.aem-GridColumn:nth-of-type(1)",
      "style": null,
      "blocks": [
        "cards-product"
      ],
      "defaultContent": [
        "div.multi-tile-cards:nth-of-type(1) .eyebrow-heading-body"
      ]
    },
    {
      "id": "section-4",
      "name": "Guarantee Hero",
      "selector": "div.hero.aem-GridColumn:nth-of-type(2)",
      "style": null,
      "blocks": [
        "hero-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "section-5",
      "name": "Customer Stories Cards",
      "selector": "div.multi-tile-cards.aem-GridColumn:nth-of-type(2)",
      "style": null,
      "blocks": [
        "cards-product"
      ],
      "defaultContent": [
        "div.multi-tile-cards:nth-of-type(2) .eyebrow-heading-body"
      ]
    },
    {
      "id": "section-6",
      "name": "Award Banner",
      "selector": "div.offer.aem-GridColumn",
      "style": "grey",
      "blocks": [
        "columns-offer"
      ],
      "defaultContent": []
    },
    {
      "id": "section-7",
      "name": "CTA Cards",
      "selector": "div.multi-tile-cards.aem-GridColumn:nth-of-type(3)",
      "style": null,
      "blocks": [
        "cards-product"
      ],
      "defaultContent": [
        "div.multi-tile-cards:nth-of-type(3) .eyebrow-heading-body"
      ]
    },
    {
      "id": "section-8",
      "name": "Resource Links",
      "selector": "div.link-farm.aem-GridColumn",
      "style": "grey",
      "blocks": [
        "accordion-links"
      ],
      "defaultContent": []
    }
  ]
};

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'cards-value': cardsValueParser,
  'cards-product': cardsProductParser,
  'columns-offer': columnsOfferParser,
  'accordion-links': accordionLinksParser,
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
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
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

  console.log(`Found ${pageBlocks.length} block instances on page`);
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
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
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
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
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
