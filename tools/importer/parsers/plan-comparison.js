/* eslint-disable */
/* global WebImporter */

/**
 * Parser: plan-comparison
 * Base block: plan-comparison (custom)
 * Source: https://www.business.att.com/products/wireless-plans.html
 * Selector: div.tab-cmp.aem-GridColumn
 * DOM: .swiper-slide > .plan-card-container per plan card
 *   - .js-best-plan-section p (badge, optional)
 *   - .js-heading-section (plan name)
 *   - .price-multifieldItem.active (featured price)
 *   - .card-item-features .flex-items-top p (feature list)
 *   - .wrapper-signature (savings banner, optional)
 *
 * Output: one row per plan card, 2 columns:
 *   Column 1 (header): badge + plan name + price
 *   Column 2 (body): features + savings
 */
export default function parse(element, { document }) {
  const slides = Array.from(element.querySelectorAll('.swiper-slide'));
  const cells = [];

  slides.forEach((slide) => {
    const container = slide.querySelector('.plan-card-container');
    if (!container) return;

    // --- Column 1: Header (badge + name + price) ---
    const headerCell = document.createDocumentFragment();
    headerCell.appendChild(document.createComment(' field:header '));

    // Badge (optional, e.g. "New! Turbo for Business")
    const badgeEl = container.querySelector('.js-best-plan-section p');
    if (badgeEl) {
      const badgeP = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = badgeEl.textContent.trim();
      badgeP.appendChild(em);
      headerCell.appendChild(badgeP);
    }

    // Plan name
    const nameEl = container.querySelector('.js-heading-section');
    if (nameEl) {
      const nameP = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = nameEl.textContent.trim();
      nameP.appendChild(strong);
      headerCell.appendChild(nameP);
    }

    // Price - use the active/default price item
    const activePrice = container.querySelector('.price-multifieldItem.active, .price-multifieldItem:first-child');
    if (activePrice) {
      const strikethrough = activePrice.querySelector('.strikethrough, .js-price-strikethrough-section');

      if (strikethrough) {
        const sP = document.createElement('p');
        const s = document.createElement('s');
        s.textContent = strikethrough.textContent.trim();
        sP.appendChild(s);
        headerCell.appendChild(sP);
      }

      // Simplified price text
      const priceText = activePrice.textContent.trim().replace(/\s+/g, ' ');
      // Extract the main price pattern like "$ 45 /mo. per line for 36 mos."
      const priceMatch = priceText.match(/\$\s*(\d+)\s*\/mo\.\s*per line/);
      if (priceMatch) {
        const priceP = document.createElement('p');
        priceP.textContent = '$' + priceMatch[1] + '/mo. per line';
        headerCell.appendChild(priceP);
      }

      // Price note (e.g., "When you get 5 lines")
      const noteMatch = priceText.match(/(When you get \d+ lines?)/i);
      if (noteMatch) {
        const noteP = document.createElement('p');
        noteP.textContent = noteMatch[1];
        headerCell.appendChild(noteP);
      }
    }

    // --- Column 2: Body (features + savings) ---
    const bodyCell = document.createDocumentFragment();
    bodyCell.appendChild(document.createComment(' field:body '));

    // Features
    const featureEls = container.querySelectorAll('.card-item-features .flex-items-top');
    featureEls.forEach((feat) => {
      const p = feat.querySelector('p');
      if (p) {
        const featureP = document.createElement('p');
        const text = p.textContent.trim().replace(/\s+/g, ' ');
        if (text) {
          featureP.textContent = text;
          bodyCell.appendChild(featureP);
        }
      }
    });

    // Savings banner (optional)
    const savingsContainer = container.querySelector('.wrapper-signature .signature-section-container');
    if (savingsContainer) {
      const savingsText = savingsContainer.textContent.trim().replace(/\s+/g, ' ');
      if (savingsText) {
        const savingsP = document.createElement('p');
        const em = document.createElement('em');
        em.textContent = savingsText;
        savingsP.appendChild(em);
        bodyCell.appendChild(savingsP);
      }
    }

    cells.push([headerCell, bodyCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'plan-comparison', cells });
  element.replaceWith(block);
}
