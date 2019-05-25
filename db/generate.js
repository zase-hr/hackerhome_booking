const faker = require('faker');
const moment = require('moment');
const db = require('./dataGenerator.js');

const roomNameAppendix = ['\'s Apartment', '\'s House', '\'s Loft', '\'s Condo'];

// roomname:
// price : 50 ~ 200
// cleaning fee: 5
// service fee: 5
// tax: 10
// max_guest: {adults: 5, children: 3, infants: 2}
//     random between 1-6 for adult, random between 0-4 kids
// min_night: 1
// max_night: random between 2-6
// ratings: random 0.0-5.0
// num_reviews: random 0-100

// min and max included
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const rooms = [];
const bookings = [];
const bookingsByRoom = {};


// Random Rooms
function generateRandomRooms(num) {
  for (let i = 0; i < num; i += 1) {
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
      min_night: 1,
      max_night: randomIntFromInterval(2, 6),
      ratings: (Math.random() * (5.0 - 1.0) + 1.0).toFixed(1),
      num_reviews: randomIntFromInterval(0, 100),
    };
    rooms.push(room);
  }
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function isNotOverlapWithOtherBookingDates(roomId, startDate, endDate) {
  const bookingsOnRoom = bookingsByRoom[`${roomId}`];
  if (bookingsOnRoom === undefined) {
    return true;
  }

  // Iterate all current bookings on room and then check new start and end date overlapping or not
  for (let i = 0; i < bookingsOnRoom.length; i += 1) {
    const booking = bookingsOnRoom[i];

    // Not overlapping condition
    // newCheckIn -- newCheckout  << booking.checkIn
    // (new checkin and checkout time both should be earlier than current booking's checkin)
    // booking.checkOut << newCheckIn -- newCheckOut
    // (new checkin and checkout time both should be later than current booking's checkout)

    // Below condition is checking it is overlapped -> then return false
    if (!((moment(startDate) < moment(booking.check_in)
    && moment(endDate) <= moment(booking.check_in))
    || (moment(startDate) >= moment(booking.check_out)
    && moment(endDate) > moment(booking.check_out)))) {
      return false;
    }
  }
  return true;
}

function randomCheckInOutOnRoom(roomId) {
  const room = rooms[`${roomId}`];

  let startDate = moment(randomDate(moment().toDate(), moment().add(2, 'months').toDate())).startOf('day').toDate();
  let endDate = moment(startDate).add(randomIntFromInterval(room.min_night, room.max_night), 'days').startOf('day').toDate();
  let trial = 0;

  while (!isNotOverlapWithOtherBookingDates(roomId, startDate, endDate)) {
    trial += 1;
    if (trial > 1) {
      return null;
    }
    startDate = moment(randomDate(moment().toDate(), moment().add(2, 'months').toDate())).startOf('day').toDate();
    endDate = moment(startDate).add(randomIntFromInterval(room.min_night, room.max_night), 'days').startOf('day').toDate();
  }

  return {
    check_in: startDate,
    check_out: endDate,
  };
}

// Random Bookings
function generateRandomBooking() {
  const roomId = randomIntFromInterval(0, rooms.length - 1);
  const room = rooms[roomId];

  const randomCheckInOutDates = randomCheckInOutOnRoom(roomId);

  if (randomCheckInOutDates === null) {
    return null;
  }

  const booking = {
    roomId,
    email: faker.internet.email(),
    guests: {
      adults: randomIntFromInterval(1, room.max_guest.adults),
      children: randomIntFromInterval(0, room.max_guest.children),
      infants: randomIntFromInterval(0, room.max_guest.infants),
    },
    check_in: randomCheckInOutDates.check_in,
    check_out: randomCheckInOutDates.check_out,
    createdAt: moment(randomCheckInOutDates.check_in).subtract(randomIntFromInterval(0, 30), 'days').toDate(),
  };
  return booking;
}


function generateRandomBookings(num) {
  let book;
  for (let i = 0; i < num; i += 1) {
    book = generateRandomBooking();
    if (book !== null) {
      bookings.push(book);
      if (bookingsByRoom[`${book.roomId}`] === undefined) {
        bookingsByRoom[`${book.roomId}`] = [];
      }
      bookingsByRoom[`${book.roomId}`].push(book);
    }
  }
}


generateRandomRooms(5);
generateRandomBookings(30);

const createBookingData = () => {
  for (let i = 0; i < bookings.length; i += 1) {
    bookings[i].guests = JSON.stringify(bookings[i].guests);
    bookings[i].roomId += 1;
  }

  bookings.forEach((data) => {
    db.Booking.create(data)
      .then(() => {
        console.log('success for booking');
      })
      .catch((err) => {
        throw err;
      });
  });
};

const createRoomData = () => {
  for (let i = 0; i < rooms.length; i += 1) {
    rooms[i].max_guest = JSON.stringify(rooms[i].max_guest);
  }


  rooms.forEach(data => (
    db.Room.create(data)
      .then(() => {
        console.log('success');
      })
      .catch((err) => {
        throw err;
      })
  ));
};

// createRoomData();
// setTimeout(createBookingData, 20000);



function createData() {
  for (let i = 0; i < rooms.length; i += 1) {
    rooms[i].max_guest = JSON.stringify(rooms[i].max_guest);
  }

  for (let i = 0; i < bookings.length; i += 1) {
    bookings[i].guests = JSON.stringify(bookings[i].guests);
    bookings[i].roomId += 1;
  }

  db.Room.bulkCreate(rooms, { returning: true }).then(() => {
    db.Booking.bulkCreate(bookings, { returning: true });
  })
    .then(() => {
      console.log('Complete');
    });
}

createData();