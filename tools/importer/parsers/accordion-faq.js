/* eslint-disable */
/* global WebImporter */

/**
 * Parser: accordion-faq
 * Base block: accordion
 * Source: https://www.business.att.com/products/wireless-plans.html
 * Selector: div.accordion-panel.aem-GridColumn
 * DOM: div.list-item > button.accordion-cta > div.accordion-title-content (question)
 *      div.list-item > div.accordion-body > div.accordion-body-content (answer)
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.list-item, [itemtype*="Question"]'));
  const cells = [];

  items.forEach((item) => {
    const questionEl = item.querySelector('.accordion-title-content, [itemprop="name"]');
    const questionText = questionEl ? questionEl.textContent.trim() : '';
    const answerEl = item.querySelector('.accordion-body-content, [itemprop="text"]');

    if (questionText) {
      const titleCell = document.createDocumentFragment();
      titleCell.appendChild(document.createComment(' field:heading '));
      const questionP = document.createElement('p');
      questionP.textContent = questionText;
      titleCell.appendChild(questionP);

      const contentCell = document.createDocumentFragment();
      contentCell.appendChild(document.createComment(' field:body '));
      if (answerEl) {
        Array.from(answerEl.childNodes).forEach((child) => contentCell.appendChild(child.cloneNode(true)));
      }

      cells.push([titleCell, contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
