import SortView from '../view/main-sort-view.js';
import EventsList from '../view/main-events-list-view.js';
import EmptyList from '../view/list-empty.js';

//import NewPointView from '../view/list-new-point-form-view.js';

import {replace, remove, render} from '../framework/render.js';
import PointPresenter from './point-presenter.js';

import {updateItem} from '../mock/utils.js';
import {sort} from '../utils/sort.js';
import {SortTypes, SortTypesDescription} from '../mock/const.js';

export default class EventsPresenter {
  #container = null;

  #sortComponent = null;
  #eventsListComponent = null;

  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;

  #points = [];
  #currentSortType = SortTypes.DAY;

  #pointPresenters = new Map();


  constructor({container, destinationsModel, offersModel, pointsModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#points = ([...this.#pointsModel.get()]);
  }

  init() {
    this.#renderBoard();
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      container: this.#eventsListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#pointChangeHandler,
      onModeChange: this.#modeChangeHandler
    });

    pointPresenter.init(point);

    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #sortPoints = (sortType) => {
    this.#currentSortType = sortType;
    this.#points = sort[this.#currentSortType](this.#points);
  };

  #renderPoints = () => {
    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #clearPoints = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  };

  #renderSort() {
    if (this.#sortComponent) {
      this.#sortComponent.element.remove();
      this.#sortComponent.removeElement();
    }
    this.#sortComponent = new SortView({
      sortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#eventsListComponent);
  }

  #renderPointContainer = () => {
    this.#eventsListComponent = new EventsList();
    render(this.#eventsListComponent, this.#container);
  };

  #renderBoard = () => {
    if(this.#points.length === 0) {
      render(new EmptyList(), this.#container);
      return;
    }

    this.#renderSort();
    this.#renderPointContainer();
    this.#renderPoints();
  };

  #pointChangeHandler = (updatePoint) => {
    this.#points = updateItem(this.#points, updatePoint);
    this.#pointPresenters.get(updatePoint.id).init(updatePoint);
  };

  #handleSortTypeChange = (sortType) => {
    this.#sortPoints(sortType);
    this.#clearPoints();
    this.#renderSort();
    this.#renderPoints();
  };

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
