import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.querySelector('strong') || div.querySelector('em') || div.querySelector('del')) {
        div.className = 'plan-comparison-card-header';
      } else {
        div.className = 'plan-comparison-card-body';
      }
    });
    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}
