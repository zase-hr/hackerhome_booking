TRUNCATE bookings.users CASCADE;
COPY bookings.users(
             id,
             email,
             username,
             password,
             first_name,
             last_name,
             registration_date) 
FROM '/tmp/users.csv' 
      DELIMITER ',' CSV HEADER;

TRUNCATE bookings.rooms CASCADE;
COPY bookings.rooms(
             id,
             ownerId,
             roomname,
             price,
             cleaning_fee,
             service_fee,
             tax,
             adults,
             children,
             infants,
             min_night,
             max_night,
             ratings,
             num_reviews) 
FROM '/tmp/rooms.csv' 
      DELIMITER ',' CSV HEADER;

TRUNCATE bookings.bookings CASCADE;
COPY bookings.bookings(
             id,
             roomId,
             userId,
             adults,
             children,
             infants,
             check_in,
             check_out,
             createdAt) 
FROM '/tmp/bookings.csv' 
      DELIMITER ',' CSV HEADER;

TRUNCATE bookings.transactions CASCADE;
COPY bookings.transactions(
             bookingId,
             price,
             payment_type) 
FROM '/tmp/transactions.csv' 
      DELIMITER ',' CSV HEADER;
