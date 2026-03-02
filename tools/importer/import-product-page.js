/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import cardsProductParser from './parsers/cards-product.js';
import cardsValueParser from './parsers/cards-value.js';
import heroDarkParser from './parsers/hero-dark.js';
import columnsOfferParser from './parsers/columns-offer.js';
import accordionFaqParser from './parsers/accordion-faq.js';

// TRANSFORMER IMPORTS
import attCleanupTransformer from './transformers/att-cleanup.js';
import attSectionsTransformer from './transformers/att-sections.js';

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  "name": "product-page",
  "description": "Individual product page with hero, pricing/plan comparison, feature highlights, awards, bundle offers, FAQ accordion, and sales contact form",
  "urls": [
    "https://www.business.att.com/products/wireless-plans.html",
    "https://www.business.att.com/products/business-fiber-internet.html",
    "https://www.business.att.com/products/att-dynamic-defense.html",
    "https://www.business.att.com/products/sd-wan.html"
  ],
  "blocks": [
    {
      "name": "hero-banner",
      "instances": [
        "div.hero.aem-GridColumn:nth-of-type(1)"
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
      "name": "cards-value",
      "instances": [
        "div.generic-list-value-prop.aem-GridColumn:nth-of-type(1)",
        "div.generic-list-value-prop.aem-GridColumn:nth-of-type(2)"
      ]
    },
    {
      "name": "hero-dark",
      "instances": [
        "div.hero.aem-GridColumn:nth-of-type(2)",
        "div.hero.aem-GridColumn:nth-of-type(3)",
        "div.hero.aem-GridColumn:nth-of-type(4)"
      ]
    },
    {
      "name": "columns-offer",
      "instances": [
        "div.offer.aem-GridColumn"
      ]
    },
    {
      "name": "accordion-faq",
      "instances": [
        "div.accordion-panel.aem-GridColumn"
      ]
    }
  ],
  "sections": [
    {
      "id": "section-1",
      "name": "Sub Navigation",
      "selector": "div.headband-baem.aem-GridColumn",
      "style": null,
      "blocks": [],
      "defaultContent": [
        "div.headband-baem"
      ]
    },
    {
      "id": "section-2",
      "name": "Trial Banner",
      "selector": "div.micro-banner.aem-GridColumn",
      "style": "accent",
      "blocks": [],
      "defaultContent": [
        "div.micro-banner"
      ]
    },
    {
      "id": "section-3",
      "name": "Hero Banner",
      "selector": "div.hero.aem-GridColumn:nth-of-type(1)",
      "style": null,
      "blocks": [
        "hero-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "section-4",
      "name": "Plan Comparison",
      "selector": "div.tab-cmp.aem-GridColumn",
      "style": "grey",
      "blocks": [],
      "defaultContent": [
        "div.tab-cmp"
      ]
    },
    {
      "id": "section-5",
      "name": "Plan Features",
      "selector": "div.generic-list-value-prop.aem-GridColumn:nth-of-type(1)",
      "style": null,
      "blocks": [
        "cards-value"
      ],
      "defaultContent": [
        "div.generic-list-value-prop:nth-of-type(1) h3"
      ]
    },
    {
      "id": "section-6",
      "name": "Award Banner",
      "selector": "div.hero.aem-GridColumn:nth-of-type(2)",
      "style": null,
      "blocks": [
        "hero-dark"
      ],
      "defaultContent": []
    },
    {
      "id": "section-7",
      "name": "Security Offer",
      "selector": "div.offer.aem-GridColumn",
      "style": null,
      "blocks": [
        "columns-offer"
      ],
      "defaultContent": []
    },
    {
      "id": "section-8",
      "name": "Deal Cards",
      "selector": "div.multi-tile-cards.aem-GridColumn:nth-of-type(1)",
      "style": "accent",
      "blocks": [
        "cards-product"
      ],
      "defaultContent": [
        "div.multi-tile-cards:nth-of-type(1) .eyebrow-heading-body"
      ]
    },
    {
      "id": "section-9",
      "name": "Bundle Hero",
      "selector": "div.hero.aem-GridColumn:nth-of-type(3)",
      "style": null,
      "blocks": [
        "hero-dark"
      ],
      "defaultContent": []
    },
    {
      "id": "section-10",
      "name": "Guarantee Hero",
      "selector": "div.hero.aem-GridColumn:nth-of-type(4)",
      "style": null,
      "blocks": [
        "hero-dark"
      ],
      "defaultContent": []
    },
    {
      "id": "section-11",
      "name": "Add-on Cards",
      "selector": "div.multi-tile-cards.aem-GridColumn:nth-of-type(2)",
      "style": "accent",
      "blocks": [
        "cards-product"
      ],
      "defaultContent": [
        "div.multi-tile-cards:nth-of-type(2) .eyebrow-heading-body"
      ]
    },
    {
      "id": "section-12",
      "name": "Device Cards",
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
      "id": "section-13",
      "name": "Help Section",
      "selector": "div.generic-list-value-prop.aem-GridColumn:nth-of-type(2)",
      "style": "accent",
      "blocks": [
        "cards-value"
      ],
      "defaultContent": [
        "div.generic-list-value-prop:nth-of-type(2) h3"
      ]
    },
    {
      "id": "section-14",
      "name": "FAQ Accordion",
      "selector": "div.accordion-panel.aem-GridColumn",
      "style": null,
      "blocks": [
        "accordion-faq"
      ],
      "defaultContent": []
    },
    {
      "id": "section-15",
      "name": "Contact Sales Form",
      "selector": "div.rai-form.aem-GridColumn",
      "style": "grey",
      "blocks": [],
      "defaultContent": [
        "div.rai-form .RAIHeader",
        "div.rai-form section.body-section"
      ]
    }
  ]
};

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'cards-product': cardsProductParser,
  'cards-value': cardsValueParser,
  'hero-dark': heroDarkParser,
  'columns-offer': columnsOfferParser,
  'accordion-faq': accordionFaqParser,
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
