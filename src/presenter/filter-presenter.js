import TripEventFiltersView from '../view/trip-filters-view.js';
import {render, replace} from '../framework/render.js';
import {filter} from '../utils/filter.js';

export default class FilterPresenter {
  #container = null;
  #filterComponent = null;
  #pointsModel = null;
  #filterModel = null;

  #currentFilter = null;

  constructor({container, pointsModel, filterModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#pointsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  get filters() {
    const points = this.#pointsModel.get();

    return Object.entries(filter)
      .map(([filterType, filterPoints]) => ({
        type: filterType,
        hasPoints: filterPoints(points).length > 0
      }));
  }

  init() {
    this.#currentFilter = this.#filterModel.get();
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new TripEventFiltersView({
      filters: this.filters,
      currentFilter: this.#currentFilter,
      onFilterChange: this.#filterTypeChangeHandler
    });

    if(prevFilterComponent === null) {
      render(this.#filterComponent, this.#container);
    } else {
      replace(this.#filterComponent, prevFilterComponent);
    }
  }

  #modelEventHandler = () => {
    this.init();
  };

  #filterTypeChangeHandler = (filterType) => {
    if(this.#filterModel.get() === filterType) {
      return;
    }
    this.#filterModel.setFilter(filterType);
  };
}
