import TripEventInfoView from '../view/trip-info-view.js';
import {RenderPosition, render, remove, replace} from '../framework/render.js';

export default class TripInfoPresenter {
  #container = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #tripInfoComponent = null;

  constructor(container, destinationsModel, offersModel, pointsModel) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.pointsModel.addObserver(this.#modelEventHandler);
    this.#render();
  }

  #modelEventHandler = () => {
    this.init();
  };

  #render = () => {
    const prevTripInfoComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripEventInfoView({
      destinations: this.#destinationsModel.get(),
      offers: this.#offersModel.get(),
      points: this.#pointsModel.get()
    });

    if(prevTripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.prevTripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  };

}
