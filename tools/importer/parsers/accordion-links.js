/* eslint-disable */
/* global WebImporter */

/**
 * Parser: accordion-links
 * Base block: accordion
 * Source: https://www.business.att.com/
 * Target: 2 columns per row (title | content). Each row = one accordion category.
 * Selector: div.link-farm.aem-GridColumn
 */
export default function parse(element, { document }) {
  const categories = Array.from(element.querySelectorAll('.link-farm-category, .lf-category, [class*="category"]'));
  const cells = [];

  if (categories.length > 0) {
    categories.forEach((cat) => {
      const title = cat.querySelector('h3, h2, h4, .lf-title, [class*="title"]');
      const links = Array.from(cat.querySelectorAll('a'));

      // Column 1: Title
      const titleCell = document.createDocumentFragment();
      titleCell.appendChild(document.createComment(' field:heading '));
      if (title) {
        titleCell.appendChild(document.createTextNode(title.textContent.trim()));
      }

      // Column 2: Links content
      const contentCell = document.createDocumentFragment();
      contentCell.appendChild(document.createComment(' field:body '));
      if (links.length > 0) {
        const ul = document.createElement('ul');
        links.forEach((link) => {
          const li = document.createElement('li');
          li.appendChild(link);
          ul.appendChild(li);
        });
        contentCell.appendChild(ul);
      }

      cells.push([titleCell, contentCell]);
    });
  } else {
    // Fallback: look for details/summary pattern or heading+list pairs
    const headings = Array.from(element.querySelectorAll('h2, h3, h4'));
    headings.forEach((heading) => {
      const titleCell = document.createDocumentFragment();
      titleCell.appendChild(document.createComment(' field:heading '));
      titleCell.appendChild(document.createTextNode(heading.textContent.trim()));

      const contentCell = document.createDocumentFragment();
      contentCell.appendChild(document.createComment(' field:body '));
      let sibling = heading.nextElementSibling;
      while (sibling && !sibling.matches('h2, h3, h4')) {
        const next = sibling.nextElementSibling;
        contentCell.appendChild(sibling);
        sibling = next;
      }

      cells.push([titleCell, contentCell]);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-links', cells });
  element.replaceWith(block);
}
