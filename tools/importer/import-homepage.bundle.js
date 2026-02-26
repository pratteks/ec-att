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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
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

  // tools/importer/parsers/hero-dark.js
  function parse2(element, { document }) {
    const bgImage = element.querySelector(".bg-hero-panel img, .bg-art img");
    const mobileImage = element.querySelector(".hero-panel-image img, .visible-mobile");
    const eyebrow = element.querySelector('.eyebrow-lg-desktop, [class*="eyebrow-lg"]');
    const heading = element.querySelector("h1, h2, h3");
    const descriptionEls = Array.from(element.querySelectorAll(".wysiwyg-editor p, .type-base p"));
    const ctaLinks = Array.from(element.querySelectorAll("a.cta, a.btn, .cta-wrapper a"));
    const legalText = element.querySelector('.legal-text, .disclaimer, [class*="legal"]');
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
    descriptionEls.forEach((desc) => contentCell.appendChild(desc));
    if (legalText) contentCell.appendChild(legalText);
    ctaLinks.forEach((cta) => {
      const p = document.createElement("p");
      p.appendChild(cta);
      contentCell.appendChild(p);
    });
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-dark", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  function parse3(element, { document }) {
    const cards = Array.from(element.querySelectorAll(".tile-card, .swiper-slide"));
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".card-img img, img");
      const heading = card.querySelector("h3, h2, .js-heading-section");
      const description = card.querySelector(".tileSubheading p, .js-textBody-section p");
      const price = card.querySelector(".price-comp");
      const cta = card.querySelector("a.cta, a.btn, .cta-wrapper a");
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
      if (price) {
        const priceText = price.textContent.trim().replace(/\s+/g, " ");
        if (priceText) {
          const p = document.createElement("p");
          p.textContent = priceText;
          textCell.appendChild(p);
        }
      }
      if (cta) {
        const p = document.createElement("p");
        p.appendChild(cta);
        textCell.appendChild(p);
      }
      cells.push([imgCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-promo.js
  function parse4(element, { document }) {
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

  // tools/importer/parsers/cards-value.js
  function parse5(element, { document }) {
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

  // tools/importer/parsers/cards-story.js
  function parse6(element, { document }) {
    const cards = Array.from(element.querySelectorAll(".tile-card, .swiper-slide"));
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".card-img img, img");
      const eyebrow = card.querySelector('.type-eyebrow-md, .js-eyeBrow-section, [class*="eyebrow"]');
      const heading = card.querySelector("h3, h2, .js-heading-section");
      const description = card.querySelector(".tileSubheading p, .js-textBody-section p");
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
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-story", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-offer.js
  function parse7(element, { document }) {
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

  // tools/importer/parsers/carousel-industry.js
  function parse8(element, { document }) {
    const slides = Array.from(element.querySelectorAll('.ss-slide, [class*="slide"]'));
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector(".ss-image img, img");
      const heading = slide.querySelector('h3, h2, .ss-heading, [class*="heading"]');
      const description = slide.querySelector('.ss-body p, .type-base p, [class*="body"] p');
      const cta = slide.querySelector('a.cta, a.btn, .cta-wrapper a, a[class*="link"]');
      const imgCell = document.createDocumentFragment();
      if (img) {
        imgCell.appendChild(document.createComment(" field:image "));
        imgCell.appendChild(img);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (heading) {
        const h = document.createElement("h2");
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
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-industry", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-links.js
  function parse9(element, { document }) {
    const categories = Array.from(element.querySelectorAll('.link-farm-category, .lf-category, [class*="category"]'));
    const cells = [];
    if (categories.length > 0) {
      categories.forEach((cat) => {
        const title = cat.querySelector('h3, h2, h4, .lf-title, [class*="title"]');
        const links = Array.from(cat.querySelectorAll("a"));
        const titleCell = document.createDocumentFragment();
        titleCell.appendChild(document.createComment(" field:heading "));
        if (title) {
          titleCell.appendChild(document.createTextNode(title.textContent.trim()));
        }
        const contentCell = document.createDocumentFragment();
        contentCell.appendChild(document.createComment(" field:body "));
        if (links.length > 0) {
          const ul = document.createElement("ul");
          links.forEach((link) => {
            const li = document.createElement("li");
            li.appendChild(link);
            ul.appendChild(li);
          });
          contentCell.appendChild(ul);
        }
        cells.push([titleCell, contentCell]);
      });
    } else {
      const headings = Array.from(element.querySelectorAll("h2, h3, h4"));
      headings.forEach((heading) => {
        const titleCell = document.createDocumentFragment();
        titleCell.appendChild(document.createComment(" field:heading "));
        titleCell.appendChild(document.createTextNode(heading.textContent.trim()));
        const contentCell = document.createDocumentFragment();
        contentCell.appendChild(document.createComment(" field:body "));
        let sibling = heading.nextElementSibling;
        while (sibling && !sibling.matches("h2, h3, h4")) {
          const next = sibling.nextElementSibling;
          contentCell.appendChild(sibling);
          sibling = next;
        }
        cells.push([titleCell, contentCell]);
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-links", cells });
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

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "AT&T Business homepage with hero, product offerings, and promotional content",
    urls: [
      "https://www.business.att.com/"
    ],
    blocks: [
      {
        name: "hero-banner",
        instances: ["div.hero.aem-GridColumn:first-of-type"]
      },
      {
        name: "cards-product",
        instances: ["div.multi-tile-cards:first-of-type .multi-tile-section"]
      },
      {
        name: "cards-promo",
        instances: ["div.flex-cards .row-of-cards"]
      },
      {
        name: "cards-value",
        instances: ["div.generic-list-value-prop .generic-list-icon-vp-row"]
      },
      {
        name: "columns-offer",
        instances: ["div.offer.aem-GridColumn:nth-of-type(1)", "div.offer.aem-GridColumn:nth-of-type(2)"]
      },
      {
        name: "hero-dark",
        instances: ["div.hero.aem-GridColumn:nth-of-type(2)", "div.hero.aem-GridColumn:nth-of-type(3)"]
      },
      {
        name: "carousel-industry",
        instances: ["div.story-stack .storyStackSlider"]
      },
      {
        name: "cards-story",
        instances: ["div.multi-tile-cards:nth-of-type(2) .multi-tile-section"]
      },
      {
        name: "accordion-links",
        instances: ["div.link-farm.aem-GridColumn"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner",
        selector: "div.hero.aem-GridColumn:first-of-type",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Product Categories",
        selector: "div.multi-tile-cards.aem-GridColumn:first-of-type",
        style: null,
        blocks: ["cards-product"],
        defaultContent: ["div.multi-tile-cards:first-of-type .eyebrow-heading-body"]
      },
      {
        id: "section-3",
        name: "Promotional Offers",
        selector: "div.flex-cards.aem-GridColumn",
        style: null,
        blocks: ["cards-promo"],
        defaultContent: ["div.flex-cards .grid-col-10 h1"]
      },
      {
        id: "section-4",
        name: "Value Propositions",
        selector: "div.generic-list-value-prop.aem-GridColumn",
        style: null,
        blocks: ["cards-value"],
        defaultContent: ["div.generic-list-value-prop .grid-col-10"]
      },
      {
        id: "section-5",
        name: "Customer Satisfaction",
        selector: "div.offer.aem-GridColumn:nth-of-type(1)",
        style: "grey",
        blocks: ["columns-offer"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Dynamic Defense Hero",
        selector: "div.hero.aem-GridColumn:nth-of-type(2)",
        style: null,
        blocks: ["hero-dark"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "30-Day Trial Banner",
        selector: "div.micro-banner.aem-GridColumn",
        style: "accent",
        blocks: [],
        defaultContent: ["div.micro-banner.aem-GridColumn"]
      },
      {
        id: "section-8",
        name: "Switch to AT&T",
        selector: "div.offer.aem-GridColumn:nth-of-type(2)",
        style: null,
        blocks: ["columns-offer"],
        defaultContent: []
      },
      {
        id: "section-9",
        name: "Industry Solutions",
        selector: "div.story-stack.aem-GridColumn",
        style: null,
        blocks: ["carousel-industry"],
        defaultContent: ["div.story-stack .ss-masterHeader"]
      },
      {
        id: "section-10",
        name: "AT&T Guarantee Hero",
        selector: "div.hero.aem-GridColumn:nth-of-type(3)",
        style: null,
        blocks: ["hero-dark"],
        defaultContent: []
      },
      {
        id: "section-11",
        name: "Customer Stories",
        selector: "div.multi-tile-cards.aem-GridColumn:nth-of-type(2)",
        style: null,
        blocks: ["cards-story"],
        defaultContent: ["div.multi-tile-cards:nth-of-type(2) .eyebrow-heading-body", "div.multi-tile-cards:nth-of-type(2) .cta-section"]
      },
      {
        id: "section-12",
        name: "Contact Sales Form",
        selector: "div.rai-form.aem-GridColumn",
        style: "grey",
        blocks: [],
        defaultContent: ["div.rai-form .RAIHeader", "div.rai-form section.body-section"]
      },
      {
        id: "section-13",
        name: "Link Farm",
        selector: "div.link-farm.aem-GridColumn",
        style: "grey",
        blocks: ["accordion-links"],
        defaultContent: []
      }
    ]
  };
  var parsers = {
    "hero-banner": parse,
    "hero-dark": parse2,
    "cards-product": parse3,
    "cards-promo": parse4,
    "cards-value": parse5,
    "cards-story": parse6,
    "columns-offer": parse7,
    "carousel-industry": parse8,
    "accordion-links": parse9
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
  var import_homepage_default = {
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
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path: path || "/index",
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
