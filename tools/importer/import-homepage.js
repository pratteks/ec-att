/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import heroDarkParser from './parsers/hero-dark.js';
import cardsProductParser from './parsers/cards-product.js';
import cardsPromoParser from './parsers/cards-promo.js';
import cardsValueParser from './parsers/cards-value.js';
import cardsStoryParser from './parsers/cards-story.js';
import columnsOfferParser from './parsers/columns-offer.js';
import carouselIndustryParser from './parsers/carousel-industry.js';
import accordionLinksParser from './parsers/accordion-links.js';

// TRANSFORMER IMPORTS
import attCleanupTransformer from './transformers/att-cleanup.js';
import attSectionsTransformer from './transformers/att-sections.js';

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'AT&T Business homepage with hero, product offerings, and promotional content',
  urls: [
    'https://www.business.att.com/',
  ],
  blocks: [
    {
      name: 'hero-banner',
      instances: ['div.hero.aem-GridColumn:first-of-type'],
    },
    {
      name: 'cards-product',
      instances: ['div.multi-tile-cards:first-of-type .multi-tile-section'],
    },
    {
      name: 'cards-promo',
      instances: ['div.flex-cards .row-of-cards'],
    },
    {
      name: 'cards-value',
      instances: ['div.generic-list-value-prop .generic-list-icon-vp-row'],
    },
    {
      name: 'columns-offer',
      instances: ['div.offer.aem-GridColumn:nth-of-type(1)', 'div.offer.aem-GridColumn:nth-of-type(2)'],
    },
    {
      name: 'hero-dark',
      instances: ['div.hero.aem-GridColumn:nth-of-type(2)', 'div.hero.aem-GridColumn:nth-of-type(3)'],
    },
    {
      name: 'carousel-industry',
      instances: ['div.story-stack .storyStackSlider'],
    },
    {
      name: 'cards-story',
      instances: ['div.multi-tile-cards:nth-of-type(2) .multi-tile-section'],
    },
    {
      name: 'accordion-links',
      instances: ['div.link-farm.aem-GridColumn'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: 'div.hero.aem-GridColumn:first-of-type',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Product Categories',
      selector: 'div.multi-tile-cards.aem-GridColumn:first-of-type',
      style: null,
      blocks: ['cards-product'],
      defaultContent: ['div.multi-tile-cards:first-of-type .eyebrow-heading-body'],
    },
    {
      id: 'section-3',
      name: 'Promotional Offers',
      selector: 'div.flex-cards.aem-GridColumn',
      style: null,
      blocks: ['cards-promo'],
      defaultContent: ['div.flex-cards .grid-col-10 h1'],
    },
    {
      id: 'section-4',
      name: 'Value Propositions',
      selector: 'div.generic-list-value-prop.aem-GridColumn',
      style: null,
      blocks: ['cards-value'],
      defaultContent: ['div.generic-list-value-prop .grid-col-10'],
    },
    {
      id: 'section-5',
      name: 'Customer Satisfaction',
      selector: 'div.offer.aem-GridColumn:nth-of-type(1)',
      style: 'grey',
      blocks: ['columns-offer'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Dynamic Defense Hero',
      selector: 'div.hero.aem-GridColumn:nth-of-type(2)',
      style: null,
      blocks: ['hero-dark'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: '30-Day Trial Banner',
      selector: 'div.micro-banner.aem-GridColumn',
      style: 'accent',
      blocks: [],
      defaultContent: ['div.micro-banner.aem-GridColumn'],
    },
    {
      id: 'section-8',
      name: 'Switch to AT&T',
      selector: 'div.offer.aem-GridColumn:nth-of-type(2)',
      style: null,
      blocks: ['columns-offer'],
      defaultContent: [],
    },
    {
      id: 'section-9',
      name: 'Industry Solutions',
      selector: 'div.story-stack.aem-GridColumn',
      style: null,
      blocks: ['carousel-industry'],
      defaultContent: ['div.story-stack .ss-masterHeader'],
    },
    {
      id: 'section-10',
      name: 'AT&T Guarantee Hero',
      selector: 'div.hero.aem-GridColumn:nth-of-type(3)',
      style: null,
      blocks: ['hero-dark'],
      defaultContent: [],
    },
    {
      id: 'section-11',
      name: 'Customer Stories',
      selector: 'div.multi-tile-cards.aem-GridColumn:nth-of-type(2)',
      style: null,
      blocks: ['cards-story'],
      defaultContent: ['div.multi-tile-cards:nth-of-type(2) .eyebrow-heading-body', 'div.multi-tile-cards:nth-of-type(2) .cta-section'],
    },
    {
      id: 'section-12',
      name: 'Contact Sales Form',
      selector: 'div.rai-form.aem-GridColumn',
      style: 'grey',
      blocks: [],
      defaultContent: ['div.rai-form .RAIHeader', 'div.rai-form section.body-section'],
    },
    {
      id: 'section-13',
      name: 'Link Farm',
      selector: 'div.link-farm.aem-GridColumn',
      style: 'grey',
      blocks: ['accordion-links'],
      defaultContent: [],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'hero-dark': heroDarkParser,
  'cards-product': cardsProductParser,
  'cards-promo': cardsPromoParser,
  'cards-value': cardsValueParser,
  'cards-story': cardsStoryParser,
  'columns-offer': columnsOfferParser,
  'carousel-industry': carouselIndustryParser,
  'accordion-links': accordionLinksParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  attCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [attSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
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

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
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
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path: path || '/index',
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
