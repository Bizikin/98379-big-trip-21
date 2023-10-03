import dayjs from 'dayjs';
import { DATA_TIME, DATA_NUMBER_MONTH, DATA_HOUR_MINUTE, MSEC_IN_DAY, MSEC_IN_HOUR, DAY_HOUR_MIN, HOUR_MIN, MIN } from '../constants/constants.js';

import duration from 'dayjs/plugin/duration.js';
dayjs.extend(duration);

function humanizePointDueDateTime (dueDate) {
  return dueDate ? dayjs(dueDate).format(DATA_TIME) : '';
}

function humanizePointDueDate (dueDate) {
  return dueDate ? dayjs(dueDate).format(DATA_NUMBER_MONTH) : '';
}

function humanizePointDueTime (dueDate) {
  return dueDate ? dayjs(dueDate).format(DATA_HOUR_MINUTE) : '';
}

function getDiffFromDates (dateFrom, dateTo) {
  const timeDiff = dayjs(dateTo).diff(dayjs(dateFrom));

  let pointDuration = 0;

  switch (true) {
    case(timeDiff >= MSEC_IN_DAY):
      pointDuration = dayjs.duration(timeDiff).format(DAY_HOUR_MIN);
      break;
    case(timeDiff >= MSEC_IN_HOUR):
      pointDuration = dayjs.duration(timeDiff).format(HOUR_MIN);
      break;
    case(timeDiff < MSEC_IN_HOUR):
      pointDuration = dayjs.duration(timeDiff).format(MIN);
      break;
  }

  return pointDuration;
}

export {humanizePointDueDateTime,
  humanizePointDueDate,
  humanizePointDueTime,
  getDiffFromDates};
