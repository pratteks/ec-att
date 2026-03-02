/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import cardsPromoParser from './parsers/cards-promo.js';
import cardsProductParser from './parsers/cards-product.js';
import cardsValueParser from './parsers/cards-value.js';
import heroDarkParser from './parsers/hero-dark.js';
import columnsOfferParser from './parsers/columns-offer.js';
import accordionLinksParser from './parsers/accordion-links.js';

// TRANSFORMER IMPORTS
import attCleanupTransformer from './transformers/att-cleanup.js';
import attSectionsTransformer from './transformers/att-sections.js';

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  "name": "portfolio-page",
  "description": "Product portfolio landing page with hero, feature grid, solution modules, AT&T Guarantee section, sales contact form, and related links",
  "urls": [
    "https://www.business.att.com/portfolios/mobility.html",
    "https://www.business.att.com/portfolios/business-internet.html",
    "https://www.business.att.com/portfolios/collaboration.html",
    "https://www.business.att.com/portfolios/cybersecurity.html",
    "https://www.business.att.com/portfolios/networking.html",
    "https://www.business.att.com/portfolios/internet-of-things.html"
  ],
  "blocks": [
    {
      "name": "hero-banner",
      "instances": [
        "div.hero.aem-GridColumn:first-of-type"
      ]
    },
    {
      "name": "cards-promo",
      "instances": [
        "div.flex-cards .row-of-cards"
      ]
    },
    {
      "name": "cards-product",
      "instances": [
        "div.multi-tile-cards .multi-tile-section"
      ]
    },
    {
      "name": "cards-value",
      "instances": [
        "div.generic-list-value-prop .generic-list-icon-vp-row"
      ]
    },
    {
      "name": "hero-dark",
      "instances": [
        "div.hero.aem-GridColumn:nth-of-type(2)"
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
      "selector": "div.hero.aem-GridColumn:first-of-type",
      "style": null,
      "blocks": [
        "hero-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "section-2",
      "name": "Product Cards",
      "selector": "div.flex-cards.aem-GridColumn",
      "style": null,
      "blocks": [
        "cards-promo"
      ],
      "defaultContent": [
        "div.flex-cards .grid-col-10 h2"
      ]
    },
    {
      "id": "section-3",
      "name": "Device Tiles",
      "selector": "div.multi-tile-cards.aem-GridColumn",
      "style": null,
      "blocks": [
        "cards-product"
      ],
      "defaultContent": [
        "div.multi-tile-cards .eyebrow-heading-body"
      ]
    },
    {
      "id": "section-4",
      "name": "Mobility Solutions",
      "selector": "div.generic-list-value-prop.aem-GridColumn",
      "style": "accent",
      "blocks": [
        "cards-value"
      ],
      "defaultContent": [
        "div.generic-list-value-prop .grid-col-10"
      ]
    },
    {
      "id": "section-5",
      "name": "AT&T Guarantee Hero",
      "selector": "div.hero.aem-GridColumn:nth-of-type(2)",
      "style": null,
      "blocks": [
        "hero-dark"
      ],
      "defaultContent": []
    },
    {
      "id": "section-6",
      "name": "Enterprise Mobility Leader",
      "selector": "div.offer.aem-GridColumn",
      "style": null,
      "blocks": [
        "columns-offer"
      ],
      "defaultContent": []
    },
    {
      "id": "section-7",
      "name": "Contact Sales Form",
      "selector": "div.rai-form.aem-GridColumn",
      "style": "grey",
      "blocks": [],
      "defaultContent": [
        "div.rai-form .RAIHeader",
        "div.rai-form section.body-section"
      ]
    },
    {
      "id": "section-8",
      "name": "Link Farm",
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
  'cards-promo': cardsPromoParser,
  'cards-product': cardsProductParser,
  'cards-value': cardsValueParser,
  'hero-dark': heroDarkParser,
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
