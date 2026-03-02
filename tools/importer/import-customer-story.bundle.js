var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-customer-story.js
  var import_customer_story_exports = {};
  __export(import_customer_story_exports, {
    default: () => import_customer_story_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(".bg-hero-panel img, .bg-art img");
    const mobileImage = element.querySelector(".hero-panel-image img, .visible-mobile");
    const eyebrow = element.querySelector('.eyebrow-lg-desktop, [class*="eyebrow-lg"]');
    const heading = element.querySelector("h1, h2, h3");
    const description = element.querySelector(".wysiwyg-editor p, .type-base p");
    const ctaLinks = Array.from(element.querySelectorAll("a.cta, a.btn, .cta-wrapper a"));
    const cells = [];
    if (bgImage) {
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      imgFrag.appendChild(bgImage);
      cells.push([imgFrag]);
    } else if (mobileImage) {
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      imgFrag.appendChild(mobileImage);
      cells.push([imgFrag]);
    }
    const contentCell = document.createDocumentFragment();
    contentCell.appendChild(document.createComment(" field:text "));
    if (eyebrow) {
      const p = document.createElement("p");
      p.textContent = eyebrow.textContent.trim();
      contentCell.appendChild(p);
    }
    if (heading) contentCell.appendChild(heading);
    if (description) contentCell.appendChild(description);
    ctaLinks.forEach((cta) => contentCell.appendChild(cta));
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-value.js
  function parse2(element, { document }) {
    const items = Array.from(element.querySelectorAll('.generic-list-icon-vp, [class*="icon-vp"]'));
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector("img");
      const heading = item.querySelector('h3, h2, [class*="heading"]');
      const description = item.querySelector('.type-base p, .type-sm p, [class*="body"] p');
      const cta = item.querySelector('a.cta, a.btn, a[class*="link"]');
      const imgCell = document.createDocumentFragment();
      if (img) {
        imgCell.appendChild(document.createComment(" field:image "));
        imgCell.appendChild(img);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (heading) {
        const h = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = heading.textContent.trim();
        h.appendChild(strong);
        textCell.appendChild(h);
      }
      if (description) textCell.appendChild(description);
      if (cta) {
        const p = document.createElement("p");
        p.appendChild(cta);
        textCell.appendChild(p);
      }
      cells.push([imgCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-value", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-promo.js
  function parse3(element, { document }) {
    const cards = Array.from(element.querySelectorAll(".flex-card, .card"));
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("img");
      const eyebrow = card.querySelector('.type-eyebrow-md, [class*="eyebrow"]');
      const heading = card.querySelector('h2, h3, [class*="heading"]');
      const description = card.querySelector('.type-base p, .wysiwyg-editor p, [class*="body"] p');
      const cta = card.querySelector("a.cta, a.btn, .cta-wrapper a");
      const imgCell = document.createDocumentFragment();
      if (img) {
        imgCell.appendChild(document.createComment(" field:image "));
        imgCell.appendChild(img);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (eyebrow && eyebrow.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = eyebrow.textContent.trim();
        textCell.appendChild(p);
      }
      if (heading) {
        const h = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = heading.textContent.trim();
        h.appendChild(strong);
        textCell.appendChild(h);
      }
      if (description) textCell.appendChild(description);
      if (cta) {
        const p = document.createElement("p");
        p.appendChild(cta);
        textCell.appendChild(p);
      }
      cells.push([imgCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-offer.js
  function parse4(element, { document }) {
    const contentPanel = element.querySelector('.content-panel-text, [class*="content-panel"]');
    const imagePanel = element.querySelector(".hero-panel-image img, .offer-image img, img");
    const eyebrow = contentPanel ? contentPanel.querySelector('[class*="eyebrow"]') : null;
    const heading = contentPanel ? contentPanel.querySelector("h1, h2, h3") : element.querySelector("h1, h2, h3");
    const descriptions = contentPanel ? Array.from(contentPanel.querySelectorAll(".wysiwyg-editor p, .type-base p, .type-sm p")) : Array.from(element.querySelectorAll(".wysiwyg-editor p, .type-base p"));
    const list = contentPanel ? contentPanel.querySelector("ul") : element.querySelector("ul");
    const legalText = contentPanel ? contentPanel.querySelector('.legal-text, [class*="legal"], [class*="disclaimer"]') : element.querySelector('.legal-text, [class*="legal"]');
    const cta = contentPanel ? contentPanel.querySelector("a.cta, a.btn, .cta-wrapper a") : element.querySelector("a.cta, a.btn");
    const textCell = document.createDocumentFragment();
    if (eyebrow && eyebrow.textContent.trim()) {
      const p = document.createElement("p");
      p.textContent = eyebrow.textContent.trim();
      textCell.appendChild(p);
    }
    if (heading) textCell.appendChild(heading);
    descriptions.forEach((desc) => textCell.appendChild(desc));
    if (list) textCell.appendChild(list);
    if (legalText) textCell.appendChild(legalText);
    if (cta) {
      const p = document.createElement("p");
      p.appendChild(cta);
      textCell.appendChild(p);
    }
    const imgCell = document.createDocumentFragment();
    if (imagePanel) imgCell.appendChild(imagePanel);
    const cells = [[textCell, imgCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-offer", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/att-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#att-chat-wrapper",
        ".chat-widget",
        '[class*="cookie"]',
        ".modal",
        ".overlay"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".global-navigation",
        ".main-header-wrapper",
        ".global-footer",
        "footer",
        ".skip-to-content-link",
        ".breadcrumb",
        "aside",
        "iframe",
        "link",
        "noscript",
        ".segmentationSectionExcluded"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
        el.removeAttribute("data-analytics");
      });
    }
  }

  // tools/importer/transformers/att-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const template = payload && payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      const document = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionSelector = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of sectionSelector) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-customer-story.js
  var PAGE_TEMPLATE = {
    "name": "customer-story",
    "description": "Individual customer story with breadcrumbs, hero image, tabbed content (highlights, solutions, about), challenge/result/solution columns, and related product cards",
    "urls": [
      "https://www.business.att.com/learn/customer-stories/parkville.html"
    ],
    "blocks": [
      {
        "name": "hero-banner",
        "instances": [
          "div.marquee-heading.aem-GridColumn:nth-of-type(1)"
        ]
      },
      {
        "name": "cards-value",
        "instances": [
          "div.icon-list.aem-GridColumn"
        ]
      },
      {
        "name": "cards-promo",
        "instances": [
          "div.content-teaser.aem-GridColumn"
        ]
      },
      {
        "name": "columns-offer",
        "instances": [
          "div.image-text-business.aem-GridColumn"
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
        "name": "Hero Marquee",
        "selector": "div.marquee-heading.aem-GridColumn:nth-of-type(1)",
        "style": null,
        "blocks": [
          "hero-banner"
        ],
        "defaultContent": []
      },
      {
        "id": "section-3",
        "name": "Highlights",
        "selector": [
          "div.segment-heading.aem-GridColumn:nth-of-type(1)",
          "div.icon-list.aem-GridColumn"
        ],
        "style": null,
        "blocks": [
          "cards-value"
        ],
        "defaultContent": [
          "div.segment-heading:nth-of-type(1)"
        ]
      },
      {
        "id": "section-4",
        "name": "AT&T Solutions",
        "selector": [
          "div.segment-heading.aem-GridColumn:nth-of-type(2)",
          "div.content-teaser.aem-GridColumn"
        ],
        "style": null,
        "blocks": [
          "cards-promo"
        ],
        "defaultContent": [
          "div.segment-heading:nth-of-type(2)"
        ]
      },
      {
        "id": "section-5",
        "name": "About",
        "selector": [
          "div.segment-heading.aem-GridColumn:nth-of-type(3)",
          "div.image-text-business.aem-GridColumn"
        ],
        "style": null,
        "blocks": [
          "columns-offer"
        ],
        "defaultContent": [
          "div.segment-heading:nth-of-type(3)"
        ]
      },
      {
        "id": "section-6",
        "name": "Contact",
        "selector": "div.contact.aem-GridColumn",
        "style": null,
        "blocks": [],
        "defaultContent": [
          "div.contact"
        ]
      }
    ]
  };
  var parsers = {
    "hero-banner": parse,
    "cards-value": parse2,
    "cards-promo": parse3,
    "columns-offer": parse4
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_customer_story_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const pathStr = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path: pathStr || "/index",
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_customer_story_exports);
})();
