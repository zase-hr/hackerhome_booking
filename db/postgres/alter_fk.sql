ALTER TABLE bookings.rooms
ADD FOREIGN KEY (OWNERID) REFERENCES bookings.users(ID);

ALTER TABLE bookings.bookings
ADD FOREIGN KEY (ROOMID) REFERENCES bookings.rooms(ID),
ADD FOREIGN KEY (USERID) REFERENCES bookings.users(ID);

ALTER TABLE bookings.transactions
ADD FOREIGN KEY (BOOKINGID) REFERENCES bookings.bookings(ID);