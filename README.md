# Project Name

> Airbnb Booking module

## Related Projects

  - https://github.com/hacker-home/Airbnb-more-homes
  - https://github.com/hacker-home/Airbnb-info
  - https://github.com/hacker-home/Airbnb-reviews
  - https://github.com/hacker-home/Airbnb-photos

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage

> This module is for booking

## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 6.13.0
- etc

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```

## CRUD
### Create / POST
#### Book room
- Method: POST
- URL: ‘/bookings?roomId=1’
- Input: JSON object (email, check in/out, etc)
- Output: booking information (json array)

### Read / GET
#### Get booking information for a single booking
- Method: GET
- URL: ‘/bookings?roomId=1’
- Input: room_id (url query parameter, string)
- Output: booking information (json array)

#### Get booking information for all bookings
- Method: GET
- URL: ‘/bookings
- Input: none
- Output: an array of room objects

#### Get room information for a single room
- Method: GET
- URL: ‘/rooms?roomId=1’
- Input: room_id (url query parameter, string)
- Output: room information (json array)

#### Get room information for all rooms
- Method: GET
- URL: ‘/bookings
- Input: none
- Output: an array of room objects

### Update / PUT
#### Update information for a single room
- Method: PUT
- URL: ‘/rooms?id=1’
- Input: JSON object (roomid, max_stay, etc)
- Output: booking information (json array)

#### Update information for a single booking
- Method: PUT
- URL: ‘/bookings?id=1’
- Input: JSON object (email, check in/out, etc)
- Output: booking information (json array)

### Delete / DELETE
#### Delete a single room
NOTE: this will require deleting all related bookings!
- Method: DELETE
- URL: ‘/rooms?id=1’
- Input: JSON object with id
- Output: Confirmation

#### Delete a single booking
- Method: DELETE
- URL: ‘/bookings?id=1’
- Input: JSON object with id
- Output: Confirmation