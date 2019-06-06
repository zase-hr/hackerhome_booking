/* eslint-disable camelcase */
/* MODULE IMPORTS */
const faker = require('faker');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');

/* FILE SYSTEM SETUP */
const gzipUsers = zlib.createGzip();
const gzipRooms = zlib.createGzip();
const fileWriteStreamRooms = fs.createWriteStream(path.join(__dirname, '/mongo/rooms.json.gz'));
const fileWriteStreamUsers = fs.createWriteStream(path.join(__dirname, '/mongo/users.json.gz'));
gzipUsers.pipe(fileWriteStreamUsers);
gzipRooms.pipe(fileWriteStreamRooms);

/* CONSTANTS */
const roomNameAppendix = ['\'s Apartment', '\'s House', '\'s Loft', '\'s Condo'];
const NUM_ROOMS = 1e7;
const NUM_USERS = 1e6;

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Input: nothing
 * Output: object with checkin/checkout times
 */
function randomCheckInOutOnRoom() {
  const MIN_STAY = 1;
  const MAX_STAY = 5;
  const startDate = moment(randomDate(moment().toDate(), moment().add(2, 'months').toDate())).startOf('day').toDate();
  const endDate = moment(startDate).add(randomIntFromInterval(MIN_STAY, MAX_STAY), 'days').startOf('day').toDate();

  return {
    check_in: startDate,
    check_out: endDate,
  };
}

/**
 * @param {integer} total - the total price of the booking
 * @returns - a booking object
 */
function generateRandomBooking(total) {
  const paymentTypes = {
    1: 'visa',
    2: 'amex',
    3: 'mastercard',
    4: 'discover',
  };
  const randomCheckInOutDates = randomCheckInOutOnRoom();

  if (randomCheckInOutDates === null) {
    return null;
  }

  const booking = {
    userId: randomIntFromInterval(1, NUM_USERS),
    guests: {
      adults: randomIntFromInterval(1, 5),
      children: randomIntFromInterval(0, 5),
      infants: randomIntFromInterval(0, 5),
    },
    check_in: randomCheckInOutDates.check_in,
    check_out: randomCheckInOutDates.check_out,
    createdAt: moment(randomCheckInOutDates.check_in).subtract(randomIntFromInterval(0, 30), 'days').toDate(),
    transaction: {
      price: total,
      payment_type: paymentTypes[randomIntFromInterval(1, 4)],
    },
  };
  return booking;
}

/**
 * @param {integer} num - the total number of random bookings to be generated
 * @param {total} total - the total price of a booking (tax + cleaning + service + base)
 */
function generateRandomBookings(num, total) {
  let book;
  const bookings = [];

  for (let i = 0; i < num; i += 1) {
    book = generateRandomBooking(total);
    if (book !== null) {
      bookings.push(book);
    }
  }
  return bookings;
}

/**
 * This function generates a random room
 * @returns - a room object
 */
function generateRandomRoom() {
  const price = randomIntFromInterval(50, 200);
  const cleaning_fee = 5;
  const service_fee = 5;
  const tax = 10;
  const total = cleaning_fee + service_fee + tax;
  const room = {
    owner: randomIntFromInterval(1, NUM_USERS),
    roomname: faker.name.findName()
    + roomNameAppendix[randomIntFromInterval(0, roomNameAppendix.length - 1)],
    price,
    cleaning_fee,
    service_fee,
    tax,
    max_guest: {
      adults: randomIntFromInterval(1, 6),
      children: randomIntFromInterval(0, 4),
      infants: randomIntFromInterval(0, 2),
    },
    min_night: randomIntFromInterval(1, 2),
    max_night: randomIntFromInterval(2, 6),
    ratings: (Math.random() * (5.0 - 1.0) + 1.0).toFixed(1),
    num_reviews: randomIntFromInterval(0, 100),
    bookings: generateRandomBookings(randomIntFromInterval(0, 5), total),
  };
  return room;
}

/**
 * This function will generate i random rooms.
 * Each room gets written to a gzip'd JSON file.
 * @param {integer} i - the total number of rooms to be generated
 */
function addRooms(i) {
  if (i % 100000 === 0) { console.log(i); }
  if (i <= 0) {
    console.log(`Finishing rooms export: ${moment().format('h:mm:ss a')}`);
    gzipRooms.end();
    return;
  }

  const room = generateRandomRoom();
  const ableToWrite = gzipRooms.write(`${JSON.stringify(room)}\n`);

  if (ableToWrite) {
    addRooms(i - 1);
  } else {
    gzipRooms.once('drain', () => {
      addRooms(i - 1);
    });
  }
}

/**
 * This function will generate i random users.
 * Each user gets written to a gzip'd JSON file.
 * When all users have been created, we begin creating random rooms,
 * since room bookings are dependent on users.
 * @param {integer} i - the total number of rooms to be generated
 */
function writeUsers(i) {
  if (i % 100000 === 0) { console.log(i); }
  if (i <= 0) {
    console.log(`Finishing user export: ${moment().format('h:mm:ss a')}`);
    gzipUsers.end();
    console.log(`Starting rooms export: ${moment().format('h:mm:ss a')}`);
    addRooms(NUM_ROOMS);
    return;
  }
  const user = {
    _id: i,
    email: faker.internet.email(),
    username: faker.name.firstName() + faker.name.lastName() + randomIntFromInterval(1, 999),
    password: faker.internet.password(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    registration_date: faker.date.past(),
  };

  const ableToWrite = gzipUsers.write(`${JSON.stringify(user)}\n`);

  if (ableToWrite) {
    writeUsers(i - 1);
  } else {
    gzipUsers.once('drain', () => {
      writeUsers(i - 1);
    });
  }
}

function beginExport() {
  console.log(`Starting users export: ${moment().format('h:mm:ss a')}`);
  writeUsers(NUM_USERS);
}

beginExport();
