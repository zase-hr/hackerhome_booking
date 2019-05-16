const faker = require('faker');
const moment = require('moment');
const db = require('./dataGenerator.js');

roomNameAppendix = ['\'s Apartment', '\'s House', '\'s Loft', '\'s Condo'];

// roomname: 
// price : 50 ~ 200
// cleaning fee: 5
// service fee: 5
// tax: 10
// max_guest: {adults: 5, children: 3, infants: 2} random between 1-6 for adult, random between 0-4 kids
// min_night: 1
// max_night: random between 2-6
// ratings: random 0.0-5.0
// num_reviews: random 0-100


// Random Rooms
function generateRandomRooms(num) {
    for (var i = 0 ; i < num ; i++) {
        var room = {
            roomname: faker.name.findName() + roomNameAppendix[randomIntFromInterval(0, roomNameAppendix.length-1)],
            price: randomIntFromInterval(50, 200),
            cleaning_fee: 5,
            service_fee: 5,
            tax: 10,
            max_guest: {
                adults: randomIntFromInterval(1, 6),
                children: randomIntFromInterval(0, 4),
                infants: randomIntFromInterval(0, 2)
            },
            min_night: 1,
            max_night: randomIntFromInterval(2,6),
            ratings: (Math.random() * (5.0 - 1.0) + 1.0).toFixed(1),
            num_reviews: randomIntFromInterval(0, 100)
        };
        rooms.push(room);
    }
}

function randomIntFromInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

// Random Bookings
function generateRandomBookings(num) {
    for (var i = 0 ; i < num ; i++) {
        var book = generateRandomBooking();
        if (book === null) {
            continue;
        }

        bookings.push(book);
        if (bookingsByRoom[`${book.room_id}`] === undefined) {
            bookingsByRoom[`${book.room_id}`] = [];
        }
        bookingsByRoom[`${book.room_id}`].push(book);
    }
}


function generateRandomBooking() {

    var room_id = randomIntFromInterval(0, rooms.length-1);

    var room = rooms[room_id];
    
    var randomCheckInOutDates = randomCheckInOutOnRoom(room_id);

    if (randomCheckInOutDates === null) {
        return null;
    }

    var booking = {
        room_id: room_id,
        email: faker.internet.email(),
        guests: {
            adults: randomIntFromInterval(1, room.max_guest.adults),
            children: randomIntFromInterval(0, room.max_guest.children),
            infants: randomIntFromInterval(0, room.max_guest.infants)
        },
        check_in: randomCheckInOutDates.check_in,
        check_out: randomCheckInOutDates.check_out,
        createdAt: moment(randomCheckInOutDates.check_in).subtract(randomIntFromInterval(0, 30), 'days').toDate()
    };

    return booking;
}

function randomCheckInOutOnRoom(room_id) {
    var room = rooms[`${room_id}`];

    var startDate = moment(randomDate(moment().toDate(), moment().add(2, 'months').toDate())).startOf('day').toDate();
    var endDate = moment(startDate).add(randomIntFromInterval(room.min_night, room.max_night), 'days').startOf('day').toDate();
    
    var trial = 0;

    while (!isNotOverlapWithOtherBookingDates(room_id, startDate, endDate)) {
        if (trial++ > 1) {
            return null;
        }
        startDate = moment(randomDate(moment().toDate(), moment().add(2, 'months').toDate())).startOf('day').toDate();
        endDate = moment(startDate).add(randomIntFromInterval(room.min_night, room.max_night), 'days').startOf('day').toDate();
    }

    return {
        check_in: startDate,
        check_out: endDate
    };
}

function isNotOverlapWithOtherBookingDates(room_id, startDate, endDate) {
    var bookingsOnRoom = bookingsByRoom[`${room_id}`];
    if (bookingsOnRoom === undefined) {
        return true;
    }

    // Iterate all current bookings on room and then check new start and end date overlapping or not
    for (var i = 0 ; i < bookingsOnRoom.length ; i++) {
        var booking = bookingsOnRoom[i];

        // Not overlapping condition
        // newCheckIn -- newCheckout  << booking.checkIn (new checkin and checkout time both should be earlier than current booking's checkin)
        // booking.checkOut << newCheckIn -- newCheckOut (new checkin and checkout time both should be later than current booking's checkout)

        //Below condition is checking it is overlapped -> then return false
        if (!((moment(startDate) < moment(booking.check_in) && moment(endDate) <= moment(booking.check_in)) || (moment(startDate) >= moment(booking.check_out) && moment(endDate) > moment(booking.check_out)))) {
            return false;
        }

    }

    return true;
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}



var rooms = [];
generateRandomRooms(1);
console.log(rooms);

var bookings = [];
var bookingsByRoom = {};

generateRandomBookings(5);

// console.log(bookings);
// console.log(bookings.length);

let createBookingData = () => {
    bookings.map((data) => {
        data.guests = JSON.stringify(data.guests)
    });

    bookings.forEach((data) => {
        db.Booking.create(data)
            .then(() => {
                console.log('success')
            })
            .catch((err) => {
                console.log(err)
            })
    });
};

let createRoomData = () => {
    rooms.map((data) => {
        data.max_guest = JSON.stringify(data.max_guest)
    });

    rooms.forEach((data) => {
        db.Room.create(data)
            .then(() => {
                console.log('success')
            })
            .catch((err) => {
                console.log(err)
            })
    });
};

createRoomData();
createBookingData();