import AbstractView from '../framework/view/abstract-view.js';
import {humanizePointDueDate, humanizePointDueTime, getDiffFromDates} from '../utils/utils.js';
import {POINT_EMPTY} from '../constants/constants.js';

function createCurrentOffer(pointOffers, offers) {
  return(
    pointOffers
      .filter((offer) => offers.includes(offer.id))
      .map((offer) => /*html*/`<li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </li>`)
      .join('')
  );
}


function createEventTemplate(point = POINT_EMPTY, pointDestination, pointOffers) {
  const { basePrice, dateFrom, dateTo, isFavorite, type, offers } = point;
  const { name } = pointDestination;

  return /*html*/ (`
    <li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dateFrom}">${humanizePointDueDate(dateFrom)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event ${type} icon">
      </div>
    <h3 class="event__title">${type} ${name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${dateFrom}">${humanizePointDueTime(dateFrom)}</time>
        —
        <time class="event__end-time" datetime="${dateTo}">${humanizePointDueTime(dateTo)}</time>
      </p>
      <p class="event__duration">
      ${getDiffFromDates(dateFrom, dateTo)}
      </p>
    </div>
    <p class="event__price">
      €&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>

    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    <li class="event__offer">
    ${createCurrentOffer(pointOffers, offers)}
    </li>
    </ul>
    <button class="event__favorite-btn ${isFavorite ? ' event__favorite-btn--active' : '' }" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>!
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
  </li>`);
}

export default class TripEventView extends AbstractView {
  #point = null;
  #pointDestination = null;
  #pointOffers = null;
  #onClickDown = null;
  #onfavoriteClick = null;

  constructor ({ point, pointDestination, pointOffers, onClickDown, onFavoriteClick }) {
    super();

    this.#point = point;
    this.#pointDestination = pointDestination;
    this.#pointOffers = pointOffers;

    this.#onClickDown = onClickDown;
    this.#onfavoriteClick = onFavoriteClick;


    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandlerDown);
    this.element.querySelector('.event__favorite-icon').addEventListener('click', this.#favoriteClick);
  }

  get template() {
    return createEventTemplate(this.#point, this.#pointDestination, this.#pointOffers);
  }

  #clickHandlerDown = (evt) => {
    evt.preventDefault();
    this.#onClickDown();
  };

  #favoriteClick = (evt) => {
    evt.preventDefault();
    this.#onfavoriteClick();
  };
}
