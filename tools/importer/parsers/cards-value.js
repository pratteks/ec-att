/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-value
 * Base block: cards (container)
 * Source: https://www.business.att.com/
 * Model fields per card: image (reference), text (richtext)
 * Target: 2 columns per row (image | text). Each row = one value prop item.
 * Selector: div.generic-list-value-prop .generic-list-icon-vp-row
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.generic-list-icon-vp, [class*="icon-vp"]'));
  const cells = [];

  items.forEach((item) => {
    const img = item.querySelector('img');
    const heading = item.querySelector('h3, h2, [class*="heading"]');
    const description = item.querySelector('.type-base p, .type-sm p, [class*="body"] p');
    const cta = item.querySelector('a.cta, a.btn, a[class*="link"]');

    // Column 1: Image/Icon (field: image)
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
    if (cta) {
      const p = document.createElement('p');
      p.appendChild(cta);
      textCell.appendChild(p);
    }

    cells.push([imgCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-value', cells });
  element.replaceWith(block);
}
