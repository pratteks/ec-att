/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-industry
 * Base block: carousel
 * Source: https://www.business.att.com/
 * Target: 2 columns per row (image | text). Each row = one slide.
 * Selector: div.story-stack .storyStackSlider
 */
export default function parse(element, { document }) {
  const slides = Array.from(element.querySelectorAll('.ss-slide, [class*="slide"]'));
  const cells = [];

  slides.forEach((slide) => {
    const img = slide.querySelector('.ss-image img, img');
    const heading = slide.querySelector('h3, h2, .ss-heading, [class*="heading"]');
    const description = slide.querySelector('.ss-body p, .type-base p, [class*="body"] p');
    const cta = slide.querySelector('a.cta, a.btn, .cta-wrapper a, a[class*="link"]');

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
      const h = document.createElement('h2');
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-industry', cells });
  element.replaceWith(block);
}
