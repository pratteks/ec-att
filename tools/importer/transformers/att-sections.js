/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AT&T Business section breaks and section-metadata.
 * Processes sections from payload.template.sections in reverse order.
 * Inserts <hr> before each section (except first) and section-metadata blocks for styled sections.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const template = payload && payload.template;
    if (!template || !template.sections || template.sections.length < 2) return;

    const sections = template.sections;
    const document = element.ownerDocument;

    // Process sections in reverse order to avoid shifting indices
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionSelector = Array.isArray(section.selector)
        ? section.selector
        : [section.selector];

      let sectionEl = null;
      for (const sel of sectionSelector) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }
      if (!sectionEl) continue;

      // Add section-metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metaBlock);
      }

      // Add <hr> before section (except for the first section)
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
