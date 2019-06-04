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
- URL: ‘/booking?roomId=1’
- Input: JSON object (email, check in/out, etc)
- Output: booking information (json array)

### Read / GET
#### Get booking information
- Method: GET
- URL: ‘/booking?roomId=1’
- Input: room_id (url query parameter, string)
- Output: booking information (json array)

#### Get room information
- Method: GET
- URL: ‘/room?roomId=1’
- Input: room_id (url query parameter, string)
- Output: room information (json array)

### Update / PUT

### Delete / DELETE