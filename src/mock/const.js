const CITIES = [
  'Chamonix',
  'Geneva',
  'Amsterdam',
  'Sochi',
  'Helsinki',
  'Oslo',
  'Kopengagen',
  'Den Haag',
  'Moscow',
  'Tokio',
  'Rio',
  'LA'
];

const TYPES = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant'
];

const DESTINATION_COUNT = 3;

const POINT_COUNT = 3;

const OFFER_COUNT = 3;

const DEFAULT_TYPE = 'flight';

const POINT_EMPTY = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: DEFAULT_TYPE
};

const DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

const Price = {
  MIN: 1,
  MAX: 1000
};

const Duration = {
  HOUR: 5,
  DAY: 5,
  MIN: 59
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const SortTypes = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

const SortTypesDescription = {
  [SortTypes.DAY]: 'day',
  [SortTypes.EVENT]: 'event',
  [SortTypes.TIME]: 'time',
  [SortTypes.PRICE]: 'price',
  [SortTypes.OFFER]: 'offers'
};


export {POINT_EMPTY,
  OFFER_COUNT,
  DEFAULT_TYPE,
  POINT_COUNT,
  DESTINATION_COUNT,
  CITIES, DESCRIPTION,
  Price,
  Duration,
  TYPES,
  FilterType,
  Mode,
  SortTypes,
  SortTypesDescription
};
