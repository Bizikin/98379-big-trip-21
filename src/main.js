import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointService from './service/point-api-service.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';


const tripMainContainer = document.querySelector('.trip-main');
const tripEventsContainer = document.querySelector('.trip-events');
const tripFilterContainer = document.querySelector('.trip-controls__filters');

const AUTHORIZATION = 'Basic gS25fS4dwcl1s32j';
const END_POINT = 'https://21.objects.pages.academy/big-trip';

const pointApiService = new PointService(END_POINT, AUTHORIZATION);

const destinationsModel = new DestinationsModel({
  service:  pointApiService
});
const offersModel = new OffersModel({
  service:  pointApiService
});
const pointsModel = new PointsModel({
  service:  pointApiService,
  destinationsModel,
  offersModel
});

const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  container: tripFilterContainer,
  pointsModel,
  filterModel,
});

const boardPresenter = new BoardPresenter({
  tripMainContainer,
  tripEventsContainer,
  destinationsModel,
  offersModel,
  pointsModel,
  filterModel,
});

pointsModel.init();
filterPresenter.init();
boardPresenter.init();
