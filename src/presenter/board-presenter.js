import TripEventListView from '../view/trip-events-list-view.js';
import TripEventInfoView from '../view/trip-info-view.js';
import TripEventSortView from '../view/trip-sort-view.js';
import {remove, render, RenderPosition} from '../framework/render.js';
import TripEventNoPointView from '../view/trip-no-point-view.js';
import PointPresenter from './point-presenter.js';
import {sort} from '../utils/sort.js';
import {filter} from '../utils/filter.js';
import {FilterTypes, SortTypes, UpdateType, UserAction} from '../constants/constants.js';
import NewPointPresenter from './new-point-presenter.js';
import TripEventNewButton from '../view/trip-event-new-button.js';
import TripEvevntMessageView from '../view/trip-event-message-view.js';
import TripEventLoadingComponent from '../view/trip-event-loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

export default class BoardPresenter {
  #tripMainContainer = null;
  #tripEventsContainer = null;

  #destinationsModel = null;
  #pointDestination = null;
  #pointOffers = null;
  #offersModel = null;
  #pointsModel = null;
  #filterModel = null;
  #points = null;

  #tripEventListComponent = new TripEventListView();
  #tripEventNoPointComponent = new TripEventNoPointView();

  #sortComponent = null;
  #currentSortType = SortTypes.DAY;

  #pointPresenters = new Map();
  #newPointPresenter = null;
  #newPointButton = null;
  #isCreating = false;
  #messageComponent = null;
  #isLoading = true;
  #loadingComponent = null;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ tripMainContainer, tripEventsContainer, destinationsModel, offersModel, pointsModel, filterModel }) {
    this.#tripMainContainer = tripMainContainer;
    this.#tripEventsContainer = tripEventsContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleFilterModelEvent);
  }

  get points() {
    const filterType = this.#filterModel.get();
    const filteredPoints = filter[filterType](this.#pointsModel.get());
    return sort[this.#currentSortType](filteredPoints);
  }

  init() {
    this.#newPointButton = new TripEventNewButton({ onNewPointCreateButton: this.#newPointButtonClickHandler });
    render(this.#newPointButton, this.#tripMainContainer);
    render(new TripEventInfoView(), this.#tripMainContainer, RenderPosition.AFTERBEGIN);
    this.#renderAllBoard();
    this.#renderNewPoint();
  }

  #onDataLoad() {
    this.#points = this.points;
    this.#points = sort[SortTypes.DAY]([...this.#pointsModel.get()]);
    this.#pointDestination = [...this.#destinationsModel.get()];
    this.#pointOffers = [...this.#offersModel.get()];

    this.#renderAllBoard();
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#tripEventNoPointComponent);
    remove(this.#messageComponent);
    remove(this.#loadingComponent);

    if (resetSortType) {
      this.#currentSortType = SortTypes.DAY;
      this.#renderSort();
    }
  }


  #handleViewAction = async (actonType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actonType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
          return Promise.reject();
        }
        break;

      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
          this.#uiBlocker.unblock();
          return Promise.reject();
        }
        break;

      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
          if (this.points.length === 0) {
            this.#renderMessage();
          }
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;

      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        this.#renderPoints(this.points);
        break;

      case UpdateType.MAJOR:
        this.#clearBoard({ resetRenderPointCount: true, resetSortType: true });
        this.#renderBoard();
        this.#renderPoints(this.points);
        break;

      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#onDataLoad();
        break;
    }
  };

  #handleFilterModelEvent = (filterType) => {
    this.#clearBoard({ resetSortType: true });
    const filteredPoints = filter[filterType](this.#pointsModel.get());
    this.#points = sort[this.#currentSortType](filteredPoints);

    this.#renderBoard();

    if (this.#points.length === 0) {
      this.#renderMessage();
    } else {
      this.#renderPoints(this.#points);
    }
  };

  #renderSort() {
    if (this.#sortComponent) {
      this.#sortComponent.element.remove();
      this.#sortComponent.removeElement();
    }
    this.#sortComponent = new TripEventSortView({
      sortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#tripEventsContainer);
  }

  #renderMessage() {
    this.#messageComponent = new TripEvevntMessageView({
      filterType: this.#filterModel.get()
    });

    render(this.#messageComponent, this.#tripEventsContainer);
  }

  #renderAllBoard() {
    if (this.#isLoading) {
      this.#renderLoading();

    } else {
      if (!this.#points.length && !this.#isCreating) {
        this.#renderNoPoint();
      } else {
        this.#renderSort();
        this.#renderBoard();
        this.#renderPoints(this.#points);
      }
    }
  }

  #renderLoading() {
    this.#loadingComponent = new TripEventLoadingComponent();
    render(this.#loadingComponent, this.#tripEventsContainer);
  }

  #renderBoard() {
    render(this.#tripEventListComponent, this.#tripEventsContainer);
  }

  #renderPoints(points) {
    points.forEach((point) => {
      const pointPresentor = new PointPresenter({
        tripEventListComponent: this.#tripEventListComponent.element,
        destinationsModel: this.#destinationsModel,
        offersModel: this.#offersModel,
        onModeChange: this.#handleModeChange,
        onDataChange: this.#handleViewAction
      });
      pointPresentor.init(point);
      this.#pointPresenters.set(point.id, pointPresentor);
    });
  }

  #renderNoPoint() {
    if (this.#points.length === 0 && !this.#isCreating) {
      this.#renderMessage();
    }
  }

  #renderNewPoint() {
    this.#newPointPresenter = new NewPointPresenter({
      buttonContainer: this.#tripMainContainer,
      container: this.#tripEventListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onClose: this.#newPointDestroyHandler
    });

  }

  #sortPoints = (sortType) => {
    this.#currentSortType = sortType;
    this.#points = sort[this.#currentSortType](this.#pointsModel.get());
  };


  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearBoard();
    this.#renderBoard();
    this.#renderPoints(this.#points);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presentor) => presentor.resetView());
    this.#newPointPresenter.destroy();
  };

  #newPointButtonClickHandler = () => {
    this.#isCreating = true;
    this.#currentSortType = SortTypes.DAY;
    this.#filterModel.setFilter(FilterTypes.EVERYTHING);
    this.#newPointButton.setDisabled(true);
    this.#newPointPresenter.init();
    remove(this.#messageComponent);
  };

  #newPointDestroyHandler = (isCanceled) => {
    this.#isCreating = false;
    this.#newPointButton.setDisabled(false);
    if (isCanceled && this.points.length === 0) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
      this.#renderMessage();
    }
  };
}
