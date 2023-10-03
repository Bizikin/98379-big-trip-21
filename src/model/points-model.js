export default class PointsModel {
  #points = null;
  #service = null;

  constructor(service) {
    this.#service = service;
    this.#points = this.#service.getPoints();
  }

  get() {
    return this.#points;
  }
}
