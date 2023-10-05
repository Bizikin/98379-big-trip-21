import TripEventView from '../view/trip-event-view.js';
import TripEventEditView from '../view/trip-event-edit-view.js';
import {replace, render, remove} from '../framework/render.js';
import {Mode, UpdateType, UserAction} from '../constants/constants.js';

export default class PointPresenter {
  #tripEventListComponent = null;
  #tripEventViewComponent = null;
  #tripEventViewEditComponent = null;
  #point = null;
  #destinationsModel = null;
  #offersModel = null;

  #mode = Mode.DEFAULT;
  #onDataChange = null;
  #handleModeChange = null;

  constructor({ tripEventListComponent, destinationsModel, offersModel, onDataChange, onModeChange }) {
    this.#tripEventListComponent = tripEventListComponent;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#onDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#tripEventViewComponent;
    const prevPointEditComponent = this.#tripEventViewEditComponent;

    this.#tripEventViewComponent = new TripEventView({
      point: this.#point,
      pointDestination: this.#destinationsModel.getById(point.destination),
      pointOffers: this.#offersModel.getByType(point.type),
      onClickDown: this.#pointEditClickHandlerDown,
      onFavoriteClick: this.#favoriteClickHandler
    });

    this.#tripEventViewEditComponent = new TripEventEditView({
      point: this.#point,
      pointDestinations: this.#destinationsModel.get(),
      pointOffers: this.#offersModel.get(),
      onClickUp: this.#pointEditClickHandlerUp,
      onFormSubmit: this.#pointSubmitHandler,
      onDeleteClick: this.#pointDeleteClickHandler
    });

    if(prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#tripEventViewComponent, this.#tripEventListComponent);
      return;
    }

    if(this.#mode === Mode.DEFAULT) {
      replace(this.#tripEventViewComponent, prevPointComponent);
    }

    if(this.#mode === Mode.EDITING) {
      replace(this.#tripEventViewEditComponent, prevPointEditComponent);
    }
    remove(prevPointComponent);
    remove (prevPointEditComponent);
  }

  resetView = () => {
    if(this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  };

  destroy() {
    remove(this.#tripEventViewComponent);
    remove(this.#tripEventViewEditComponent);
  }

  #replacePointToForm = () => {
    replace(this.#tripEventViewEditComponent, this.#tripEventViewComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    this.#tripEventViewEditComponent.updateElement({
      point: this.#point
    });

    replace(this.#tripEventViewComponent, this.#tripEventViewEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Ecs') {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #favoriteClickHandler = () => {
    this.#onDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {
        ...this.#point,
        isFavorite: !this.#point.isFavorite
      },);
  };

  #pointEditClickHandlerDown = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #pointEditClickHandlerUp = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #pointSubmitHandler = (point) => {
    this.#onDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {
        ...this.#point,
        ...point
      })
      .then(this.#replaceFormToPoint)
      .catch();
  };

  #pointDeleteClickHandler = (point) => {
    this.#onDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#tripEventViewEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#tripEventViewEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#tripEventViewComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#tripEventViewEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this.#tripEventViewEditComponent.shake(resetFormState);
  }
}
