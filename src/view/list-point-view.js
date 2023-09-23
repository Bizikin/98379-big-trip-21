import AbstractView from '../framework/view/abstract-view.js';
import {POINT_EMPTY} from '../mock/const.js';
import {formatStringToShortDate, formatStringToDate, formatStringToDateTime, formatStringToTime, getPointDuration} from '../utils/point.js';

function returnOffers(pointOffers) {
  const offersTitle = [];
  const offersPrice = [];

  for (const object of pointOffers) {
    offersTitle.push(object.offers);
    offersPrice.push(object.price);
  }

  return offersTitle.map((element, index) =>
    `<li class="event__offer">
    <span class="event__offer-title">${element}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offersPrice[index]}</span>
    </li>`).join(' ');
}


function createPointTemplate(item) {
  const {point, pointDestinations, pointOffers} = item;
  return `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${formatStringToDate(point.dateFrom)}">${formatStringToShortDate(point.dateFrom).toUpperCase()}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${point.type} ${pointDestinations.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${formatStringToDateTime(point.dateFrom)}">${formatStringToTime(point.dateFrom)}</time>
            &mdash;
            <time class="event__end-time" datetime="${formatStringToDateTime(point.dateTo)}">${formatStringToTime(point.dateTo)}</time>
          </p>
          <p class="event__duration">${getPointDuration(point.dateFrom, point.dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
        ${returnOffers(pointOffers)}
        </ul>
        <button class="event__favorite-btn event__favorite-btn--active" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
}


export default class PointView extends AbstractView {
  //#point = null;

  constructor({point = POINT_EMPTY, pointDestinations, pointOffers, onEditClick}) {
    super();
    this.point = point;
    this.pointDestinations = pointDestinations;
    this.pointOffers = pointOffers;
    this.onEditClick = onEditClick;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.pointEditClickHandler);
  }

  get template() {
    return createPointTemplate({
      point: this.point,
      pointDestinations: this.pointDestinations,
      pointOffers: this.pointOffers
    });
  }

  pointEditClickHandler = (evt) => {
    evt.preventDefault();
    this.onEditClick();
  };
}

