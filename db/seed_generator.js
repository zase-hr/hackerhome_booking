const faker = require('faker');
const moment = require('moment');
const path = require('path');
const fs = require('fs');

// min and max included
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

// Random Bookings
function generateRandomBooking() {
  const randomCheckInOutDates = randomCheckInOutOnRoom();

  if (randomCheckInOutDates === null) {
    return null;
  }

  const booking = {
    email: faker.internet.email(),
    guests: {
      adults: randomIntFromInterval(1, 5),
      children: randomIntFromInterval(0, 5),
      infants: randomIntFromInterval(0, 5),
    },
    check_in: randomCheckInOutDates.check_in,
    check_out: randomCheckInOutDates.check_out,
    createdAt: moment(randomCheckInOutDates.check_in).subtract(randomIntFromInterval(0, 30), 'days').toDate(),
  };
  return booking;
}

function generateRandomBookings(num) {
  let book;
  const bookings = [];

  for (let i = 0; i < num; i += 1) {
    book = generateRandomBooking();
    if (book !== null) {
      bookings.push(book);
    }
  }
  return bookings;
}

const fileWriteStream = fs.createWriteStream(path.join(__dirname, 'seed_test.json'));
const roomNameAppendix = ['\'s Apartment', '\'s House', '\'s Loft', '\'s Condo'];

function generateRandomRoom() {
  const room = {
    roomname: faker.name.findName()
    + roomNameAppendix[randomIntFromInterval(0, roomNameAppendix.length - 1)],
    price: randomIntFromInterval(50, 200),
    cleaning_fee: 5,
    service_fee: 5,
    tax: 10,
    max_guest: {
      adults: randomIntFromInterval(1, 6),
      children: randomIntFromInterval(0, 4),
      infants: randomIntFromInterval(0, 2),
    },
    min_night: randomIntFromInterval(1, 2),
    max_night: randomIntFromInterval(2, 6),
    ratings: (Math.random() * (5.0 - 1.0) + 1.0).toFixed(1),
    num_reviews: randomIntFromInterval(0, 100),
    bookings: generateRandomBookings(randomIntFromInterval(0, 5)),
  };
  //console.log(room);
  return room;
}

function addRooms(i) {
  if (i % 100000 === 0) { console.log(i); }
  if (i <= 0) {
    console.log(moment().format('h:mm:ss a'));
    return;
  }

  const room = generateRandomRoom();
  const ableToWrite = fileWriteStream.write(`${JSON.stringify(room)}\n`);

  if (ableToWrite) {
    addRooms(i - 1);
  } else {
    fileWriteStream.once('drain', () => {
      addRooms(i - 1);
    });
  }
}

function writeToFile() {
  // fileWriteStream.write('[');
  console.log(moment().format('h:mm:ss a'));
  addRooms(1);

  // fileWriteStream.write(']');
}

writeToFile();
