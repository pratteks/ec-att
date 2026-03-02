/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import cardsStoryParser from './parsers/cards-story.js';

// TRANSFORMER IMPORTS
import attCleanupTransformer from './transformers/att-cleanup.js';
import attSectionsTransformer from './transformers/att-sections.js';

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  "name": "hub-page",
  "description": "Content hub or listing page with category navigation, article/story cards, and search or filter functionality",
  "urls": [
    "https://www.business.att.com/learn.html",
    "https://www.business.att.com/learn/customer-stories.html",
    "https://www.business.att.com/support.html"
  ],
  "blocks": [
    {
      "name": "hero-banner",
      "instances": [
        "div.marquee-heading.aem-GridColumn"
      ]
    },
    {
      "name": "cards-story",
      "instances": [
        "div.featured-issue.aem-GridColumn",
        "div.latest-filter-article.aem-GridColumn"
      ]
    }
  ],
  "sections": [
    {
      "id": "section-1",
      "name": "Hero Banner",
      "selector": "div.marquee-heading.aem-GridColumn",
      "style": null,
      "blocks": [
        "hero-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "section-2",
      "name": "Featured Article",
      "selector": "div.featured-issue.aem-GridColumn",
      "style": null,
      "blocks": [
        "cards-story"
      ],
      "defaultContent": [
        "div.featured-issue .welcome-bar"
      ]
    },
    {
      "id": "section-3",
      "name": "Article Listing",
      "selector": "div.latest-filter-article.aem-GridColumn",
      "style": null,
      "blocks": [
        "cards-story"
      ],
      "defaultContent": []
    },
    {
      "id": "section-4",
      "name": "Email Signup",
      "selector": "div.email-signup.aem-GridColumn",
      "style": "accent",
      "blocks": [],
      "defaultContent": [
        "div.email-signup"
      ]
    }
  ]
};

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'cards-story': cardsStoryParser,
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
