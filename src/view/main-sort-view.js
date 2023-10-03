import AbstractView from '../framework/view/abstract-view.js';
import {SortTypes} from '../mock/const.js';

const enabledSortType = {
  [SortTypes.DAY]: true,
  [SortTypes.EVENT]: false,
  [SortTypes.TIME]: true,
  [SortTypes.PRICE]: true,
  [SortTypes.OFFERS]: false
};

function createEventSortItem(sortItem) {
  return(
    /*html*/`<div class="trip-sort__item  trip-sort__item--${sortItem.type}">
    <input
      id="sort-${sortItem.type}"
      class="trip-sort__input  visually-hidden"
      type="radio"
      name="trip-sort"
      value="sort-${sortItem.type}"
      ${sortItem.isChecked ? 'checked' : ''}
      ${sortItem.isDisabled ? 'disabled' : ''}
      data-sort-type ="${sortItem.type}"
      >
    <label
      class="trip-sort__btn"
      for="sort-${sortItem.type}">${sortItem.type}</label>
  </div>`
  );
}

function createEventSortTemplate(sortMap) {
  return (
    /*html*/ `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortMap.map((sortItem) => createEventSortItem(sortItem)).join('')}
    </form>`);
}

function createSortMap(sortType) {
  return (
    Object.values(SortTypes)
      .map((type) => ({
        type,
        isChecked: (type === sortType),
        isDisabled: !enabledSortType[type]
      }))
  );
}

export default class SortView extends AbstractView{
  #sortMap = null;
  #handleSortTypeChange = null;

  constructor({sortType, onSortTypeChange}) {
    super();

    this.#sortMap = createSortMap (sortType);

    this.#handleSortTypeChange = onSortTypeChange;
    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createEventSortTemplate(this.#sortMap);
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();

    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}