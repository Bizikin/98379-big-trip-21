import dayjs from 'dayjs';
import {Duration} from './const.js';

function getRandomInteger(a = 0, b = 1) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
}

function getRandomValue(items) {
  return items[getRandomInteger(0, items.length - 1)];
}

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item)
}

let date = dayjs().subtract(getRandomInteger(0, Duration.DAY), 'day').toDate();

function getDate({next}) {
  const minsGap = getRandomInteger(0, Duration.MIN);
  const hoursGap = getRandomInteger(1, Duration.HOUR);
  const daysGap = getRandomInteger(0, Duration.DAY);

  if(next) {
    date = dayjs(date)
      .add(minsGap, 'minute')
      .add(hoursGap, 'hour')
      .add(daysGap, 'day')
      .toDate();
  }

  return date;
}

export {getDate, getRandomInteger, getRandomValue, updateItem};
