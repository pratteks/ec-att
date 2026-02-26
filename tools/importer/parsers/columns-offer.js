/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-offer
 * Base block: columns
 * Source: https://www.business.att.com/
 * Columns blocks: NO field hints per xwalk rules
 * Target: 2 columns per row. Column 1 = text, Column 2 = image (or vice versa).
 * Selector: div.offer.aem-GridColumn:nth-of-type(1), div.offer.aem-GridColumn:nth-of-type(2)
 */
export default function parse(element, { document }) {
  // Find the two column areas in the offer layout
  const contentPanel = element.querySelector('.content-panel-text, [class*="content-panel"]');
  const imagePanel = element.querySelector('.hero-panel-image img, .offer-image img, img');

  // Extract text content elements
  const eyebrow = contentPanel ? contentPanel.querySelector('[class*="eyebrow"]') : null;
  const heading = contentPanel ? contentPanel.querySelector('h1, h2, h3') : element.querySelector('h1, h2, h3');
  const descriptions = contentPanel
    ? Array.from(contentPanel.querySelectorAll('.wysiwyg-editor p, .type-base p, .type-sm p'))
    : Array.from(element.querySelectorAll('.wysiwyg-editor p, .type-base p'));
  const list = contentPanel ? contentPanel.querySelector('ul') : element.querySelector('ul');
  const legalText = contentPanel
    ? contentPanel.querySelector('.legal-text, [class*="legal"], [class*="disclaimer"]')
    : element.querySelector('.legal-text, [class*="legal"]');
  const cta = contentPanel
    ? contentPanel.querySelector('a.cta, a.btn, .cta-wrapper a')
    : element.querySelector('a.cta, a.btn');

  // Build text column content
  const textCell = document.createDocumentFragment();
  if (eyebrow && eyebrow.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = eyebrow.textContent.trim();
    textCell.appendChild(p);
  }
  if (heading) textCell.appendChild(heading);
  descriptions.forEach((desc) => textCell.appendChild(desc));
  if (list) textCell.appendChild(list);
  if (legalText) textCell.appendChild(legalText);
  if (cta) {
    const p = document.createElement('p');
    p.appendChild(cta);
    textCell.appendChild(p);
  }

  // Build image column content
  const imgCell = document.createDocumentFragment();
  if (imagePanel) imgCell.appendChild(imagePanel);

  // Row: [text | image]
  const cells = [[textCell, imgCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-offer', cells });
  element.replaceWith(block);
}
