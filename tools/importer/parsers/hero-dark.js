/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-dark
 * Base block: hero
 * Source: https://www.business.att.com/
 * Model fields: image (reference), imageAlt (collapsed), text (richtext)
 * Target structure: Row 1 = background image, Row 2 = text content
 * Instances: div.hero.aem-GridColumn:nth-of-type(2), div.hero.aem-GridColumn:nth-of-type(3)
 */
export default function parse(element, { document }) {
  // Extract background image
  const bgImage = element.querySelector('.bg-hero-panel img, .bg-art img');
  const mobileImage = element.querySelector('.hero-panel-image img, .visible-mobile');

  // Extract text content
  const eyebrow = element.querySelector('.eyebrow-lg-desktop, [class*="eyebrow-lg"]');
  const heading = element.querySelector('h1, h2, h3');
  const descriptionEls = Array.from(element.querySelectorAll('.wysiwyg-editor p, .type-base p'));
  const ctaLinks = Array.from(element.querySelectorAll('a.cta, a.btn, .cta-wrapper a'));
  const legalText = element.querySelector('.legal-text, .disclaimer, [class*="legal"]');

  const cells = [];

  // Row 1: Background image (field: image)
  if (bgImage) {
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    imgFrag.appendChild(bgImage);
    cells.push([imgFrag]);
  } else if (mobileImage) {
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    imgFrag.appendChild(mobileImage);
    cells.push([imgFrag]);
  }

  // Row 2: Text content (field: text)
  const contentCell = document.createDocumentFragment();
  contentCell.appendChild(document.createComment(' field:text '));
  if (eyebrow) {
    const p = document.createElement('p');
    p.textContent = eyebrow.textContent.trim();
    contentCell.appendChild(p);
  }
  if (heading) contentCell.appendChild(heading);
  descriptionEls.forEach((desc) => contentCell.appendChild(desc));
  if (legalText) contentCell.appendChild(legalText);
  ctaLinks.forEach((cta) => {
    const p = document.createElement('p');
    p.appendChild(cta);
    contentCell.appendChild(p);
  });
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-dark', cells });
  element.replaceWith(block);
}
