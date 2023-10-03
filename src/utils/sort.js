import {SortTypes} from '../constants/constants.js';
import {getPointsPriceDiff, getPointsDurationDiff, getPointsDateDiff} from './point.js';

if(!Array.prototype.toSorted) {
  Array.prototype.toSorted = function(fn) {
    return[...this].sort(fn);
  };
}

const sort = {
  [SortTypes.DAY]: (points) => points.toSorted(getPointsDateDiff),
  [SortTypes.PRICE]: (points) => points.toSorted(getPointsPriceDiff),
  [SortTypes.TIME]: (points) => points.toSorted(getPointsDurationDiff),
  [SortTypes.EVENT]: () => {
    throw new Error(`Sort by ${SortTypes.EVENT} is not implemented`);
  },
  [SortTypes.OFFERS]: () => {
    throw new Error(`Sort by ${SortTypes.OFFERS} is not implemented`);
  }
};

export {sort};
