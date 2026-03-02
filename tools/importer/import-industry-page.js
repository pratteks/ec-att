/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import cardsValueParser from './parsers/cards-value.js';
import columnsOfferParser from './parsers/columns-offer.js';
import cardsPromoParser from './parsers/cards-promo.js';

// TRANSFORMER IMPORTS
import attCleanupTransformer from './transformers/att-cleanup.js';
import attSectionsTransformer from './transformers/att-sections.js';

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  "name": "industry-page",
  "description": "Industry or sector landing page with hero, tabbed navigation, solution cards, case studies, insights section, and sales CTA",
  "urls": [
    "https://www.business.att.com/industries/healthcare.html",
    "https://www.business.att.com/industries/retail.html",
    "https://www.business.att.com/industries/hospitality.html",
    "https://www.business.att.com/industries/finance.html",
    "https://www.business.att.com/industries/transportation.html",
    "https://www.business.att.com/industries/manufacturing.html",
    "https://www.business.att.com/industries/public-sector.html",
    "https://www.business.att.com/small-business.html"
  ],
  "blocks": [
    {
      "name": "hero-banner",
      "instances": [
        "div.marquee-heading.aem-GridColumn"
      ]
    },
    {
      "name": "cards-value",
      "instances": [
        "div.icon-grid.aem-GridColumn"
      ]
    },
    {
      "name": "columns-offer",
      "instances": [
        "div.image-text-business.aem-GridColumn"
      ]
    },
    {
      "name": "cards-promo",
      "instances": [
        "div.content-teaser.aem-GridColumn:nth-of-type(1)",
        "div.content-teaser.aem-GridColumn:nth-of-type(2)"
      ]
    }
  ],
  "sections": [
    {
      "id": "section-1",
      "name": "Breadcrumb",
      "selector": "div.breadcrumb.aem-GridColumn",
      "style": null,
      "blocks": [],
      "defaultContent": [
        "div.breadcrumb"
      ]
    },
    {
      "id": "section-2",
      "name": "Award Banner",
      "selector": "div.text.parbase.aem-GridColumn:first-of-type",
      "style": null,
      "blocks": [],
      "defaultContent": [
        "div.text.parbase:first-of-type"
      ]
    },
    {
      "id": "section-3",
      "name": "Hero Marquee",
      "selector": "div.marquee-heading.aem-GridColumn",
      "style": null,
      "blocks": [
        "hero-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "section-4",
      "name": "Solutions Heading",
      "selector": "div.segment-heading.aem-GridColumn:nth-of-type(1)",
      "style": null,
      "blocks": [],
      "defaultContent": [
        "div.segment-heading:nth-of-type(1)"
      ]
    },
    {
      "id": "section-5",
      "name": "Solutions Description",
      "selector": "div.text.parbase.aem-GridColumn:nth-of-type(2)",
      "style": null,
      "blocks": [],
      "defaultContent": [
        "div.text.parbase:nth-of-type(2)"
      ]
    },
    {
      "id": "section-6",
      "name": "Solutions Icon Grid",
      "selector": "div.icon-grid.aem-GridColumn",
      "style": null,
      "blocks": [
        "cards-value"
      ],
      "defaultContent": []
    },
    {
      "id": "section-7",
      "name": "In Action Heading",
      "selector": "div.segment-heading.aem-GridColumn:nth-of-type(2)",
      "style": null,
      "blocks": [],
      "defaultContent": [
        "div.segment-heading:nth-of-type(2)"
      ]
    },
    {
      "id": "section-8",
      "name": "Featured Story",
      "selector": "div.image-text-business.aem-GridColumn",
      "style": null,
      "blocks": [
        "columns-offer"
      ],
      "defaultContent": []
    },
    {
      "id": "section-9",
      "name": "Case Study Cards",
      "selector": "div.content-teaser.aem-GridColumn:nth-of-type(1)",
      "style": null,
      "blocks": [
        "cards-promo"
      ],
      "defaultContent": []
    },
    {
      "id": "section-10",
      "name": "Insights Heading",
      "selector": "div.segment-heading.aem-GridColumn:nth-of-type(4)",
      "style": null,
      "blocks": [],
      "defaultContent": [
        "div.segment-heading:nth-of-type(4)"
      ]
    },
    {
      "id": "section-11",
      "name": "Insights Cards",
      "selector": "div.content-teaser.aem-GridColumn:nth-of-type(2)",
      "style": null,
      "blocks": [
        "cards-promo"
      ],
      "defaultContent": []
    },
    {
      "id": "section-12",
      "name": "Why AT&T Banner",
      "selector": "div.image-heading.aem-GridColumn",
      "style": null,
      "blocks": [],
      "defaultContent": [
        "div.image-heading"
      ]
    },
    {
      "id": "section-13",
      "name": "Contact Info",
      "selector": "div.contact.aem-GridColumn",
      "style": null,
      "blocks": [],
      "defaultContent": [
        "div.contact"
      ]
    },
    {
      "id": "section-14",
      "name": "Contact Form",
      "selector": "div.rai-form.aem-GridColumn",
      "style": "grey",
      "blocks": [],
      "defaultContent": [
        "div.rai-form"
      ]
    }
  ]
};

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'cards-value': cardsValueParser,
  'columns-offer': columnsOfferParser,
  'cards-promo': cardsPromoParser,
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
