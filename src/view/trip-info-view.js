import AbstractView from '../framework/view/abstract-view.js';

function createTripInfoTemplate() {
  return (/*html*/`
  <section class="trip-main__trip-info  trip-info">
  </section>`);
}

export default class TripEventInfoView extends AbstractView{

  get template() {
    return createTripInfoTemplate();
  }
}
