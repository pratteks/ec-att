/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-banner
 * Base block: hero
 * Source: https://www.business.att.com/
 * Model fields: image (reference), imageAlt (collapsed), text (richtext)
 * Target structure: Row 1 = background image, Row 2 = text content (heading, description, CTAs)
 */
export default function parse(element, { document }) {
  // Extract background image from .bg-hero-panel img
  const bgImage = element.querySelector('.bg-hero-panel img, .bg-art img');
  // Fallback: mobile image
  const mobileImage = element.querySelector('.hero-panel-image img, .visible-mobile');

  // Extract text content
  const eyebrow = element.querySelector('.eyebrow-lg-desktop, [class*="eyebrow-lg"]');
  const heading = element.querySelector('h1, h2, h3');
  const description = element.querySelector('.wysiwyg-editor p, .type-base p');
  const ctaLinks = Array.from(element.querySelectorAll('a.cta, a.btn, .cta-wrapper a'));

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
  if (description) contentCell.appendChild(description);
  ctaLinks.forEach((cta) => contentCell.appendChild(cta));
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
