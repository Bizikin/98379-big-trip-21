import AbstractView from '../framework/view/abstract-view.js';

function createEventNoPointTemplate () {
  return (/*html*/`
  <p class="trip-events__msg">
    Click New Event to create your first point
  </p>`
  );
}

export default class TripEventNoPointView extends AbstractView{
  get template() {
    return createEventNoPointTemplate ();
  }
}
