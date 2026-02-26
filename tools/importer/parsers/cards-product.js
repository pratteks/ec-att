/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-product
 * Base block: cards (container)
 * Source: https://www.business.att.com/
 * Model fields per card: image (reference), text (richtext)
 * Target: 2 columns per row (image | text). Each row = one card.
 * Selector: div.multi-tile-cards:first-of-type .multi-tile-section
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.tile-card, .swiper-slide'));
  const cells = [];

  cards.forEach((card) => {
    const img = card.querySelector('.card-img img, img');
    const heading = card.querySelector('h3, h2, .js-heading-section');
    const description = card.querySelector('.tileSubheading p, .js-textBody-section p');
    const price = card.querySelector('.price-comp');
    const cta = card.querySelector('a.cta, a.btn, .cta-wrapper a');

    // Column 1: Image (field: image)
    const imgCell = document.createDocumentFragment();
    if (img) {
      imgCell.appendChild(document.createComment(' field:image '));
      imgCell.appendChild(img);
    }

    // Column 2: Text content (field: text)
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (heading) {
      const h = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = heading.textContent.trim();
      h.appendChild(strong);
      textCell.appendChild(h);
    }
    if (description) textCell.appendChild(description);
    if (price) {
      const priceText = price.textContent.trim().replace(/\s+/g, ' ');
      if (priceText) {
        const p = document.createElement('p');
        p.textContent = priceText;
        textCell.appendChild(p);
      }
    }
    if (cta) {
      const p = document.createElement('p');
      p.appendChild(cta);
      textCell.appendChild(p);
    }

    cells.push([imgCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
