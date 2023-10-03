import AbstractView from '../framework/view/abstract-view.js';

function createFilterItem(filter, currentFilter) {
  const {type, hasPoints} = filter;

  return (
    /*html*/`
    <div class="trip-filters__filter">
      <input
      id="filter-${type}"
      class="trip-filters__filter-input  visually-hidden" type="radio"
      name="trip-filter"
      value="${type}"
      ${type === currentFilter ? 'checked' : ''}
      ${hasPoints === 0 ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`
  );
}

function createFiltersTemplate({filters, currentFilter}) {
  return (
    /*html*/`
    <form class="trip-filters" action="#" method="get">
      ${filters.map((filter) => createFilterItem(filter, currentFilter))
      .join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`);
}

export default class TripEventFiltersView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #onFilterChange = null;

  constructor({filters, currentFilter, onFilterChange}) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
    this.#onFilterChange = onFilterChange;
    this.element.addEventListener('change', this.#onChange);
  }

  get template() {
    return createFiltersTemplate({
      filters: this.#filters,
      currentFilter:this.#currentFilter
    });
  }

  #onChange = (evt) => {
    this.#onFilterChange(evt.target.value);
  };
}
