import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function createEventNewButton({ disabled }){
  return (
    /*html*/`<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" ${disabled ? 'disabled' : ''} type="button">New event</button>`
  );
}

export default class TripEventNewButton extends AbstractStatefulView {
  #handleNewPointCreateButton = null;

  constructor({onNewPointCreateButton, disabled = false}) {
    super();

    const el = document.querySelector('.trip-main__event-add-btn');
    el.remove();
    this._setState(TripEventNewButton.parseBtnStateToState({disabled}));
    this.#handleNewPointCreateButton = onNewPointCreateButton;
    this._restoreHandlers();
  }

  get template() {
    return createEventNewButton({
      disabled: this._state.disabled,
    });
  }

  _restoreHandlers() {
    this.element.addEventListener('click',this.#clickHandlerCreateButton);
  }

  setDisabled(disabled) {
    this.updateElement(TripEventNewButton.parseBtnStateToState({disabled}));
  }

  #clickHandlerCreateButton = (evt) => {
    evt.preventDefault();
    this.#handleNewPointCreateButton();
  };

  static parseBtnStateToState = ({disabled}) => ({disabled});
  static parseStatetoBtnState = (state) => (state.disabled);
}
