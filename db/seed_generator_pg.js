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
const NUM_ROOMS = 1000;
const NUM_USERS = 1000;

/* GLOBAL VARIABLES */
let ROOM_ID = 1;
let NUM_BOOKINGS = 1;

/* RANDOM DATA HELPERS */
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function incrementBookingId() {
  NUM_BOOKINGS += 1;
}

function getNumBookings() {
  return NUM_BOOKINGS;
}

function incrementRoomId() {
  ROOM_ID += 1;
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

function writeTransactions(num) {
  if (num % 50000 === 0) { console.log(`Transaction: ${num}`); }
  if (num <= 0) {
    console.log(`Finishing transactions export: ${moment().format('h:mm:ss a')}`);
    gzipTransactions.end();
    return;
  }
  const paymentTypes = {
    1: 'visa',
    2: 'amex',
    3: 'mastercard',
    4: 'discover',
  };
  const price = randomIntFromInterval(100, 1000);
  const payType = paymentTypes[randomIntFromInterval(1, 4)];
  const transaction = `${num},`
    + `${price},`
    + `${payType}\n`;

  const ableToWrite = gzipTransactions.write(`${transaction}`);
  if (ableToWrite) {
    writeTransactions(num - 1);
  } else {
    gzipTransactions.once('drain', () => {
      writeTransactions(num - 1);
    });
  }
}

/**
 * @param {integer} total - the total price of the booking
 * @returns - a booking object
 */
function generateRandomBooking(roomId) {
  const randomCheckInOutDates = randomCheckInOutOnRoom();
  let booking = null;
  if (randomCheckInOutDates) {
    booking = `${getNumBookings()},` // bookingId
      + `${roomId},` // roomId
      + `${randomIntFromInterval(1, NUM_USERS)},` // userID
      + `${randomIntFromInterval(1, 5)},` // max adults
      + `${randomIntFromInterval(0, 5)},` // max children
      + `${randomIntFromInterval(0, 5)},` // max infants
      + `${randomCheckInOutDates.check_in},` // check_in date
      + `${randomCheckInOutDates.check_out},` // check_out date
      + `${moment(randomCheckInOutDates.check_in).subtract(randomIntFromInterval(0, 30), 'days').toDate()}`; // createdAt date
  }
  incrementBookingId();
  return booking;
}

/**
 * @param {integer} roomId - the total number of random bookings to be generated
 * @param {total} total - the total price of a booking (tax + cleaning + service + base)
 */
function writeBookings(roomId) {
  if (roomId <= 0) {
    console.log(`Finishing bookings export: ${moment().format('h:mm:ss a')}`);
    gzipBookings.end();
    writeTransactions(getNumBookings() - 1); // Transactions has a 1:1 relationship with bookings
    return;
  }
  const bookingArray = [];
  let ableToWrite = true;

  const bookCount = randomIntFromInterval(0, 5);
  if (bookCount > 0) {
    for (let i = 0; i < bookCount; i += 1) {
      bookingArray.push(generateRandomBooking(roomId));
    }
    console.log(`Writing ${bookCount} bookings to Room ${roomId}`);
    ableToWrite = gzipBookings.write(`${bookingArray.join('\n')}\n`);
  }

  if (ableToWrite) {
    writeBookings(roomId - 1);
  } else {
    gzipBookings.once('drain', () => {
      writeBookings(roomId - 1);
    });
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

  incrementRoomId();
  return room;
}

/**
 * This function will generate i random rooms.
 * Each room gets written to a gzip'd JSON file.
 * @param {integer} i - the total number of rooms to be generated
 */
function writeRooms(i) {
  if (i % 50000 === 0) { console.log(`Room: ${i}`); }
  if (i <= 0) {
    console.log(`Finishing rooms export: ${moment().format('h:mm:ss a')}`);
    gzipRooms.end();
    return;
  }
  const room = generateRandomRoom(i);
  const ableToWrite = gzipRooms.write(`${room}\n`);

  if (ableToWrite) {
    writeRooms(i - 1);
  } else {
    gzipRooms.once('drain', () => {
      writeRooms(i - 1);
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
  if (i % 50000 === 0) { console.log(`User: ${i}`); }
  if (i <= 0) {
    console.log(`Finishing user export: ${moment().format('h:mm:ss a')}`);
    gzipUsers.end();
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
  gzipUsers.write('_id,'
   + 'email,'
   + 'username,'
   + 'password,'
   + 'first_name,'
   + 'last_name,'
   + 'registration_date\n');

  gzipRooms.write('roomId,'
    + 'ownerId,'
    + 'roomname,'
    + 'price,'
    + 'cleaning_fee,'
    + 'service_fee,'
    + 'tax,'
    + 'adults,'
    + 'children,'
    + 'infants,'
    + 'min_night,'
    + 'max_night,'
    + 'ratings,'
    + 'num_reviews\n');

  gzipBookings.write('bookingId,'
    + 'roomId,'
    + 'userId,'
    + 'adults,'
    + 'children,'
    + 'infants,'
    + 'check_in,'
    + 'check_out,'
    + 'createdAt\n');

  gzipTransactions.write('bookingId,'
    + 'price,'
    + 'payment_type\n');
}

function beginExport() {
  console.log(`Starting export: ${moment().format('h:mm:ss a')}`);
  intializeTables();
  writeUsers(NUM_USERS);
  writeRooms(NUM_ROOMS);   
  writeBookings(NUM_ROOMS); // The number of bookings is dependent on number of rooms
}

beginExport();
