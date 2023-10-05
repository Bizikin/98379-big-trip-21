import {EditType} from '../constants/constants.js';

const ButtonLabel = {
  [EditType.EDITING]:  'Delete',
  [EditType.CREATING]: 'Cancel'
};

function createDeleteButtonTemplate({type}) {
  return /*html*/ `<button class="event__reset-btn" type="reset">${ButtonLabel[type]}</button>`;
}

function createRollUpButtonTemplate() {
  return /*html*/`
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`;
}

function createPointEditControlsTemplate({type}) {
  return `
     <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    ${createDeleteButtonTemplate({type})}
    ${(type !== EditType.CREATING) ? createRollUpButtonTemplate() : ''}
    `;
}

export {createPointEditControlsTemplate};
