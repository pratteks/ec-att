/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-promo
 * Base block: cards (container)
 * Source: https://www.business.att.com/
 * Model fields per card: image (reference), text (richtext)
 * Target: 2 columns per row (image | text). Each row = one promo card.
 * Selector: div.flex-cards .row-of-cards
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.flex-card, .card'));
  const cells = [];

  cards.forEach((card) => {
    const img = card.querySelector('img');
    const eyebrow = card.querySelector('.type-eyebrow-md, [class*="eyebrow"]');
    const heading = card.querySelector('h2, h3, [class*="heading"]');
    const description = card.querySelector('.type-base p, .wysiwyg-editor p, [class*="body"] p');
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
    if (eyebrow && eyebrow.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = eyebrow.textContent.trim();
      textCell.appendChild(p);
    }
    if (heading) {
      const h = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = heading.textContent.trim();
      h.appendChild(strong);
      textCell.appendChild(h);
    }
    if (description) textCell.appendChild(description);
    if (cta) {
      const p = document.createElement('p');
      p.appendChild(cta);
      textCell.appendChild(p);
    }

    cells.push([imgCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-promo', cells });
  element.replaceWith(block);
}
