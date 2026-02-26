/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AT&T Business site-wide cleanup
 * Selectors from captured DOM at https://www.business.att.com/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent, chat widgets, modals from captured DOM
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#att-chat-wrapper',
      '.chat-widget',
      '[class*="cookie"]',
      '.modal',
      '.overlay',
    ]);
  }
  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable content from captured DOM
    // Global navigation: .global-navigation, .main-header-wrapper
    // Footer: .global-footer, footer
    // Skip-to-content: .skip-to-content-link
    // Breadcrumbs, sidebars, iframes, links
    WebImporter.DOMUtils.remove(element, [
      '.global-navigation',
      '.main-header-wrapper',
      '.global-footer',
      'footer',
      '.skip-to-content-link',
      '.breadcrumb',
      'aside',
      'iframe',
      'link',
      'noscript',
      '.segmentationSectionExcluded',
    ]);
    // Clean tracking attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-analytics');
    });
  }
}
