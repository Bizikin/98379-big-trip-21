import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizePointDueDateTime} from '../utils/utils.js';
import {PointType, PointTypeDescription, POINT_EMPTY} from '../constants/constants.js';
import {EditType} from '../constants/constants.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createEventType(type) {
  return (
    Object.values(PointType).map((pointType) => /*html*/`<div class="event__type-item">
    <input
      id="event--type-${pointType}-1"
      class="event__type-input visually-hidden"
      type="radio"
      name="event-type"
      value="${pointType}"
      ${pointType === type ? 'checked' : ''}>
    <label
      class="event__type-label event__type-label--${pointType}" for="event-type-${pointType}-1">
      ${PointTypeDescription[pointType]}</label>
      </div>`).join('')
  );
}

function createOffersByPointType(point, pointOffers) {
  return (
    pointOffers
      .map((offer, index) => /*html*/`<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden"
           id="event-offer-luggage-${index}"
           data-offer-id = "${offer.id}"
           type="checkbox"
           name="event-offer-luggage"
           ${(point.offers.includes(offer.id) ? 'checked' : '')}
           >
           <label class="event__offer-label" for="event-offer-luggage-${index}">
           <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`)
      .join('')
  );
}

function createDestinationBlock(pointDestination) {
  if (pointDestination) {
    const { description, pictures } = pointDestination;
    return (`
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
        ${createPicturiesOfDestination(pictures)}
        </div>
      </div>
    </section>`);
  }
  return '';
}

function createDestinationsCites(destinations) {
  return (
    destinations
      .map((dest) => `<option value="${dest.name}"></option>`)
      .join('')
  );
}

function createPicturiesOfDestination(pictures) {
  return (
    pictures.map((image) => /*html*/ `<img class="event__photo" src="${image.src}" alt="Event photo">`));
}

function createEventEditTemplate({ point, pointDestinations, pointOffers, isDeleting, isSaving }) {
  const { basePrice, dateFrom, dateTo, destination, type } = point;
  const pointDestination = pointDestinations.find((x) => x.id === destination);
  const saveButton = isSaving ? 'Saving...' : 'Save';
  const deleteButton = isDeleting ? 'Deleting...' : 'Delete';
  const currentOffers = pointOffers.find((pointOffer) => pointOffer.type === point.type).offers;

  const closeEventButton = `
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Close event</span>
    </button>
  `;


  return (/*html*/`
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__${type}-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event ${type}icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createEventType(type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">${type}</label>
          <input class="event__input  event__input--destination"
          id="event-destination-1"
          type="text"
          name="event-destination"
          value="${pointDestination?.name ?? ' '}"
          list="destination-list-1">
          <datalist id="destination-list-1">
          ${createDestinationsCites(pointDestinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time"
          id="event-start-time-1"
          type="text"
          name="event-start-time"
          value="${humanizePointDueDateTime(dateFrom)}">
          —
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input
          class="event__input  event__input--time"
          id="event-end-time-1"
          type="text"
          name="event-end-time"
          value="${humanizePointDueDateTime(dateTo)}">
        </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          €
        </label>
        <input class="event__input event__input--price" id="event-price-1" type="number" min="0", max="" name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn btn btn--blue"
      type="submit">
      ${isSaving ? saveButton : 'Save'}
      </button>

      <button
      class="event__reset-btn"
      type="reset">
      ${!point.id ? 'Cancel' : deleteButton}
      </button>

      ${!point.id ? '' : closeEventButton}
    </header>

    <section class="event__details">
    <section class="event__section  event__section--offers ${currentOffers.length
      === 0 ? 'visually-hidden' : '' }">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">

      ${createOffersByPointType(point, currentOffers)}


      </div>
    </section>

    ${createDestinationBlock(pointDestination)}
</section>

</form>`);
}

export default class TripEventEditView extends AbstractStatefulView {
  #datepickerFrom = null;
  #datepickerTo = null;
  #pointOffers = null;
  #handleClickUp = null;
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #handleResetClick = null;
  #type;

  constructor({ point = POINT_EMPTY, pointDestinations, pointOffers, onClickUp, onFormSubmit, onDeleteClick, onResetClick, type = EditType.EDITING }) {
    super();

    this.#pointOffers = pointOffers;
    this._setState(TripEventEditView.parsePointToState({ point, pointDestinations }));

    this.#handleClickUp = onClickUp;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleResetClick = onResetClick;
    this.#type = type;
    this._restoreHandlers();

  }

  get template() {
    return createEventEditTemplate({
      point: this._state.point,
      pointDestinations: this._state.pointDestinations,
      pointOffers: this.#pointOffers,
      isDeleting: this._state.isDeleting,
      isSaving: this._state.isSaving
    });
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerTo.destroy();
    }

    if (this.#datepickerTo) {
      this.#datepickerFrom = null;
      this.#datepickerTo = null;
    }
  }

  reset = (point) => this.updateElement({ point });

  _restoreHandlers = () => {
    if (this.#type === EditType.EDITING) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#rollupButtonClickHadnler);

      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#deleteButtonClickHandler);
    }

    if (this.#type === EditType.CREATING) {
      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#resetButtonClickHander);
    }

    this.element
      .addEventListener('submit', this.#formSumbitHandler);

    this.element
      .querySelector('.event__type-group')
      .addEventListener('click', this.#typeInputhandler);

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationInputChangeHandler);

    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#priceInputChange);

    const offerBlock = this.element
      .querySelector('.event__available-offers');

    if (offerBlock) {
      offerBlock.addEventListener('change', this.#offerClickHandler);
    }

    this.#setDatePicker();
  };

  #rollupButtonClickHadnler = (evt) => {
    evt.preventDefault();
    this.#handleClickUp();
  };

  #formSumbitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this._state.point);
  };

  #dateFromChangeHandler = ([userDate]) => {
    if (userDate) {
      this._setState({
        point: {
          ...this._state.point,
          dateFrom: userDate
        }
      });
      this.#datepickerTo.set('minDate', this._state.point.dateFrom);
    }
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateTo: userDate
      }
    });
    this.#datepickerFrom.set('maxDate', this._state.point.dateTo);
  };


  #typeInputhandler = (evt) => {
    evt.preventDefault();
    const type = evt.target.previousElementSibling ? evt.target.previousElementSibling.value : null;

    if (!type) {
      return;
    }

    this.updateElement({
      point: {
        ...this._state.point,
        type,
        offers: []
      }
    });
  };

  #destinationInputChangeHandler = (evt) => {
    evt.preventDefault();
    const selectedDestination = this._state.pointDestinations
      .find((pointDestination) => pointDestination.name === evt.target.value);

    if (!selectedDestination) {
      return;
    }

    const selectedDestinationId = selectedDestination.id;

    this.updateElement({
      point: {
        ...this._state.point,
        destination: selectedDestinationId
      }
    });

  };

  #offerClickHandler = (evt) => {
    evt.preventDefault();

    const checkboxBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));

    this._setState({
      point: {
        ...this._state.point,
        offers: checkboxBoxes.map((element) => element.dataset.offerId)
      }
    });
  };

  #priceInputChange = (evt) => {
    evt.preventDefault();

    this._setState({
      point: {
        ...this._state.point,
        basePrice: evt.target.valueAsNumber

      }
    });
  };

  #setDatePicker = () => {
    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');

    this.#datepickerFrom = flatpickr(
      dateFromElement,
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.point.dateFrom,
        onClose: this.#dateFromChangeHandler,
        enableTime: true,
        minDate: new Date(),
        maxDate: this._state.point.dateTo,
        locale: {
          firstDayOfWeak: 1,
        },
        'time_24hr': true
      }
    );

    this.#datepickerTo = flatpickr(
      dateToElement,
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.point.dateTo,
        onClose: this.#dateToChangeHandler,
        enableTime: true,
        minDate: this._state.point.dateFrom || new Date(),
        locale: {
          firstDayOfWeak: 1,
        },
        'time_24hr': true
      }
    );
  };

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();

    this.#handleDeleteClick(TripEventEditView.parseStatetoPoint(this._state.point));
  };


  #resetButtonClickHander = (evt) => {
    evt.preventDefault();
    this.#handleResetClick(TripEventEditView.parseStatetoPoint(this._state.point));
  };


  static parsePointToState = ({ point, pointDestinations }) => ({
    point,
    pointDestinations,
    isDisabled: false,
    isSaving: false,
    isDeleting: false
  });

  static parseStatetoPoint = (point) => {
    delete point.isSaving;
    delete point.isDeleting;
    delete point.isDisabled;

    return (point);
  };
}
