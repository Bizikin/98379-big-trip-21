import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

const MSEC_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HOUR = 60;
const HOUR_IN_DAY = 24;

const MSEC_IN_HOUR = MIN_IN_HOUR * SEC_IN_MIN * MSEC_IN_SEC;
const MSEC_IN_DAY = HOUR_IN_DAY * MSEC_IN_HOUR;

dayjs.extend(duration);
dayjs.extend(relativeTime);

function formatStringToDate(date) {
  return dayjs(date).format('YYYY-MM-DD');
}

function formatStringToDateTime(date) {
  return dayjs(date).format('YYYY-MM-DDTHH:mm');
}

function formatStringToShortDate(date) {
  return dayjs(date).format('MMM DD');
}

function formatStringToTime(date) {
  return dayjs(date).format('HH:mm');
}

function getSheduleDate(date) {
  return dayjs(date).format('DD/MM/YY HH:mm');
}

function getPointDuration(dateFrom, dateTo) {
  const timeDiff = dayjs(dateTo).diff(dayjs(dateFrom));

  let pointDuration = 0;

  switch (true) {
    case (timeDiff >= MSEC_IN_DAY):
      pointDuration = dayjs.duration(timeDiff).format('DD[D] HH[H] mm[M]');
      break;
    case (timeDiff >= MSEC_IN_HOUR):
      pointDuration = dayjs.duration(timeDiff).format('HH[H] mm[M]');
      break;
    case (timeDiff < MSEC_IN_HOUR):
      pointDuration = dayjs.duration(timeDiff).format('mm[M]');
      break;
  }
  return pointDuration;
}

function isPointFuture(point) {
  return dayjs().isBefore(point.dateFrom);
}

function isPointPresent(point) {
  return (dayjs().isAfter(point.dateFrom) && dayjs().isBefore(point.dateTo));
}

function isPointPast(point) {
  return dayjs().isAfter(point.dateTo);
}

function getPointsDateDiff(pointA, pointB) {
  return new Date(pointB.dateFrom) - new Date(pointA.dateFrom);


}

function getPointsPriceDiff(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

function getPointsDurationDiff(pointA, pointB) {
  const durationA = new Date(pointA.dateTo) - new Date(pointB.dateFrom);
  const durationB = new Date(pointB.dateFrom) - new Date(pointB.dateTo);

  return durationB - durationA;
}
export {
  formatStringToDateTime,
  formatStringToShortDate,
  formatStringToTime,
  formatStringToDate,
  getPointDuration,
  getSheduleDate,
  isPointFuture,
  isPointPresent,
  isPointPast,
  getPointsDateDiff,
  getPointsPriceDiff,
  getPointsDurationDiff
};
