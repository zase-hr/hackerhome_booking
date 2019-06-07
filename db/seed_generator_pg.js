/* eslint-disable camelcase */
/* MODULE IMPORTS */
const faker = require('faker');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');

/* FILE SYSTEM */
const gzipUsers = zlib.createGzip();
const gzipRooms = zlib.createGzip();
const gzipBookings = zlib.createGzip();
const gzipTransactions = zlib.createGzip();
const fileWriteStreamRooms = fs.createWriteStream(path.join(__dirname, '/postgres/rooms.csv.gz'));
const fileWriteStreamBookings = fs.createWriteStream(path.join(__dirname, '/postgres/bookings.csv.gz'));
const fileWriteStreamUsers = fs.createWriteStream(path.join(__dirname, '/postgres/users.csv.gz'));
const fileWriteStreamTransactions = fs.createWriteStream(path.join(__dirname, '/postgres/transactions.csv.gz'));
gzipUsers.pipe(fileWriteStreamUsers);
gzipRooms.pipe(fileWriteStreamRooms);
gzipBookings.pipe(fileWriteStreamBookings);
gzipTransactions.pipe(fileWriteStreamTransactions);

/* CONSTANTS */
const roomNameAppendix = ['\'s Apartment', '\'s House', '\'s Loft', '\'s Condo'];
const NUM_ROOMS = 10;
const NUM_USERS = 10;
const NUM_BOOKINGS = 5;

/* GLOBAL VARIABLES */
var ROOM_ID = 1;
var BOOKING_ID = 1;

/* RANDOM DATA HELPERS */
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

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

async function generateTransaction(price, payType) {
  if (!gzipTransactions.write(`${BOOKING_ID}, ${price}, ${payType}\n`)) {
    await new Promise(resolve => gzipTransactions.once('drain', resolve));
  }
}

/**
 * @param {integer} total - the total price of the booking
 * @returns - a booking object
 */
function generateRandomBooking(i) {
  // Base case
  if (i <= 0) {
    console.log(`Finishing bookings export: ${moment().format('h:mm:ss a')}`);
    return;
  }

  console.log(i);
  const paymentTypes = {
    1: 'visa',
    2: 'amex',
    3: 'mastercard',
    4: 'discover',
  };
  const randomCheckInOutDates = randomCheckInOutOnRoom();
  const price = randomIntFromInterval(100, 1000);
  const payType = paymentTypes[randomIntFromInterval(1, 4)];
  if (randomCheckInOutDates) {
    const booking = `${BOOKING_ID},`
      + `${ROOM_ID},`
      + `${randomIntFromInterval(1, NUM_USERS)},` // userID
      + `${randomIntFromInterval(1, 5)},` // max adults
      + `${randomIntFromInterval(0, 5)},` // max children
      + `${randomIntFromInterval(0, 5)},` // max infants
      + `${randomCheckInOutDates.check_in},` // check_in date
      + `${randomCheckInOutDates.check_out},` // check_out date
      + `${moment(randomCheckInOutDates.check_in).subtract(randomIntFromInterval(0, 30), 'days').toDate()}`; // createdAt date
    
    //generateTransaction(price, payType);

    BOOKING_ID += 1;
    const ableToWrite = gzipBookings.write(`${booking}\n`);
    fileWriteStreamBookings.on('error', (err) => {
      console.log('THERE WAS AN ERROR: ' + err);
    });
    
    if (ableToWrite) {
      generateRandomBooking(i - 1);
    } else {
      console.log('Draining booking stream');
      fileWriteStreamBookings.once('drain', () => {
        console.log('I am done draining');
        generateRandomBooking(i - 1);
      });
    }
  }
}

/**
 * @param {integer} num - the total number of random bookings to be generated
 * @param {total} total - the total price of a booking (tax + cleaning + service + base)
 */
function generateRandomBookings(num) {
  console.log('Generate ' + num + ' bookings');
  generateRandomBooking(num);
}

function exportBookings() {
  try {
    generateRandomBooking(NUM_BOOKINGS);
  } catch (e) {
    console.error('Could not export bookings', e);
  }
}

/**
 * This function generates a random room
 * @returns - a room object
 */
function generateRandomRoom(ownerID) {
  const price = randomIntFromInterval(50, 200);
  const cleaning_fee = 5;
  const service_fee = 5;
  const tax = 10;
  const total = cleaning_fee + service_fee + tax;
  const room = `${ROOM_ID},`
    + `${ownerID},`
    + `${faker.name.findName() // roomname
    + roomNameAppendix[randomIntFromInterval(0, roomNameAppendix.length - 1)]},`
    + `${price},`
    + `${cleaning_fee},`
    + `${service_fee},`
    + `${tax},`
    + `${randomIntFromInterval(1, 6)},` // number of adults
    + `${randomIntFromInterval(0, 4)},` // number of children
    + `${randomIntFromInterval(0, 2)},` // number of infants
    + `${randomIntFromInterval(1, 2)},` // min_nights
    + `${randomIntFromInterval(2, 6)},` // max_nights
    + `${(Math.random() * (5.0 - 1.0) + 1.0).toFixed(1)},` // ratings value
    + `${randomIntFromInterval(0, 100)}`; // number of reviews

  generateRandomBookings(randomIntFromInterval(0, 5));
  ROOM_ID += 1;
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
    console.log(`Finishing rooms/bookings/transactions export: ${moment().format('h:mm:ss a')}`);
    gzipRooms.end();
    gzipBookings.end(() => {
      console.log('ENDING BOOKINGS');
    });
    gzipTransactions.end();
    return;
  }
  const room = generateRandomRoom(i);
  const ableToWrite = gzipRooms.write(`${room}\n`);

  if (ableToWrite) {
    addRooms(i - 1);
  } else {
    gzipRooms.once('drain', () => {
      addRooms(i - 1);
    });
  }
}

function exportRooms() {
  addRooms(NUM_ROOMS);
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
    exportRooms();
    return;
  }
  const user = `${i.toString()},`
    + `${faker.internet.email().toString()},`
    + `${faker.name.firstName()}`
    + `${faker.name.lastName() + randomIntFromInterval(1, 999)},`
    + `${faker.internet.password()},`
    + `${faker.name.firstName()},`
    + `${faker.name.lastName()},`
    + `${faker.date.past()}`;

  const ableToWrite = gzipUsers.write(`${user}\n`);

  if (ableToWrite) {
    writeUsers(i - 1);
  } else {
    gzipUsers.once('drain', () => {
      writeUsers(i - 1);
    });
  }
}



function intializeTables() {
  gzipUsers.write(`_id,\
  email,\
  username,\
  password,\
  first_name,\
  last_name,\
  registration_date\n`);

  gzipRooms.write(`roomId,\
  ownerId,\
  roomname,\
  price,\
  cleaning_fee,\
  service_fee,\
  tax,\
  adults,\
  children,\
  infants,\
  min_night,\
  max_night,\
  ratings,\
  num_reviews\n`);

  gzipBookings.write(`bookingId,\
  roomId,\
  userId,\
  adults,\
  children,\
  infants,\
  check_in,\
  check_out,\
  createdAt\n`);

  gzipTransactions.write(`bookingId,\
  price,\
  payment_type\n`);
}

function beginExport() {
  console.log(`Starting users export: ${moment().format('h:mm:ss a')}`);
  intializeTables();
  writeUsers(NUM_USERS);
}
beginExport();
