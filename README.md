# Project Name

> Airbnb Booking module

## Related Projects

To be revised.

## Table of Contents

1. [Usage](#Usage)
2. [Requirements](#requirements)
3. [Development](#development)
4. [Schema](#schema)
5. [CRUD operations](#crud-operations)


## Usage

To be revised.

## Requirements

To be revised.

## Development

### Installing Dependencies

To be revised when scripts are complete.

## Schema
### MongoDB
![image](/media/schema_mongo.png)
### Postgres
![image](/media/schema_postgres.png)

## CRUD operations
### Create / POST
#### Book room
This operation is part of the front end implementation.
- Method: POST
- URL: ‘/bookings?roomId=1’
- Input: JSON object (email, check in/out, etc)
- Output: booking information (json array)
```json
email: "ericdo.617@gmail.com"
guests: "{"adults":2,"children":2,"infants":0}"
check_in: "2019-06-06 07:00:00"
check_out: "2019-06-11 07:00:00"
roomId: "1"
```

### Read / GET
This operation *is* currently used in the front end implementation.
#### Get booking information for a single booking
- Method: GET
- URL: ‘/bookings?roomId=1’
- Input: room_id (url query parameter, string)
- Output: booking information (json array)

```json
check_in: "2019-06-29T07:00:00.000Z"
check_out: "2019-06-30T07:00:00.000Z"
createdAt: "2019-06-16T07:00:00.000Z"
email: "Ryann33@gmail.com"
guests: "{"adults":3,"children":1,"infants":0}"
id: 30
roomId: 1
updatedAt: "2019-06-04T02:46:46.000Z"
```

#### Get booking information for all bookings
This operation is **not** currently used in the frontend implementation.
- Method: GET
- URL: ‘/bookings
- Input: none
- Output: an array of room objects

#### Get room information for a single room
This operation *is* currently used in the front end implementation.
- Method: GET
- URL: ‘/rooms?roomId=1’
- Input: room_id (url query parameter, string)
- Output: room information (json array)

```json
cleaning_fee: 5
createdAt: "2019-06-04T02:46:30.000Z"
id: 1
max_guest: "{"adults":6,"children":3,"infants":0}"
max_night: 6
min_night: 1
num_reviews: 34
price: 187
ratings: "4.8"
roomname: "Reuben Emard's Apartment"
service_fee: 5
tax: 10
updatedAt: "2019-06-04T02:46:30.000Z"
```

#### Get booking information for all bookings
This operation is **not** currently used in the frontend implementation. 
- Method: GET
- URL: ‘/bookings
- Input: none
- Output: an array of room objects

### Update / PUT
#### Update information for a single room
This operation is **not** currently used in the frontend implementation. 
- Method: PUT
- URL: ‘/rooms?id=1’
- Input: JSON object (roomid, max_stay, etc)
- Output: booking information (json array)

#### Update information for a single booking
This operation is **not** currently used in the frontend implementation. 
- Method: PUT
- URL: ‘/bookings?id=1’
- Input: JSON object (email, check in/out, etc)
- Output: booking information (json array)

### Delete / DELETE
#### Delete a single room
This operation is **not** currently used in the frontend implementation. 
NOTE: this will require deleting all related bookings!
- Method: DELETE
- URL: ‘/rooms?id=1’
- Input: JSON object with id
- Output: Confirmation

#### Delete a single booking
This operation is **not** currently used in the frontend implementation. 
- Method: DELETE
- URL: ‘/bookings?id=1’
- Input: JSON object with id
- Output: Confirmation

