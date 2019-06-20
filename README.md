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

### Instances
- Proxy: http://ec2-54-149-66-169.us-west-2.compute.amazonaws.com:3030
- Nginx: http://ec2-54-213-134-51.us-west-2.compute.amazonaws.com/
- Service 1: http://ec2-34-222-46-128.us-west-2.compute.amazonaws.com
- Service 2: http://ec2-52-88-132-91.us-west-2.compute.amazonaws.com:3003
- Database: http://ec2-34-215-33-164.us-west-2.compute.amazonaws.com:5432

### Helpful Linux commands
sudo -u postgres psql
sudo vim /var/lib/pgsql9/data/pg_hba.conf
sudo /etc/init.d/postgresql restart / sudo service postgresql restart

### Install NGINX
EC2: https://medium.com/@nishankjaintdk/setting-up-a-node-js-app-on-a-linux-ami-on-an-aws-ec2-instance-with-nginx-59cbc1bcc68c
```
> sudo service nginx restart
```

### Install Redis
EC2: https://medium.com/@feliperohdee/installing-redis-to-an-aws-ec2-machine-2e2c4c443b68
OSX: https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298

### Install Postgres DB
EC2: https://github.com/snowplow/snowplow/wiki/Setting-up-PostgreSQL
OSX: https://gist.github.com/ibraheem4/ce5ccd3e4d7a65589ce84f2a3b7c23a3

### Additional configurations on EC2
This will be needed for when you run files from command line, e.g. psql -d airbnb -a -f db/postgres/schema_pg.sql.
```
postgres=# ALTER USER "ec2-user" WITH SUPERUSER;
```

### Create import file
```
> cd db/postgres
> mkdir import_files
> cd ..
> node seed_generator_pg.js
```

### Seed DB
1. Run schema
```
> postgres=# CREATE DATABASE airbnb;
> psql -d airbnb -a -f db/postgres/schema_pg.sql
```

Amazon EC2 only: 
- Move all import files to /tmp
- Make sure import script is updated to reflect path to tmp
```
[ec2-user@ip-172-31-18-194 import_files]$ mv bookings.csv.gz /tmp/bookings.csv.gz
[ec2-user@ip-172-31-18-194 import_files]$ mv rooms.csv.gz /tmp/rooms.csv.gz
[ec2-user@ip-172-31-18-194 import_files]$ mv transations.csv.gz /tmp/transactions.csv.gz
[ec2-user@ip-172-31-18-194 import_files]$ mv transactions.csv.gz /tmp/transactions.csv.gz
[ec2-user@ip-172-31-18-194 import_files]$ mv users.csv.gz /tmp/users.csv.gz
```

```
[ec2-user@ip-172-31-20-48 import_files]$ zcat bookings.csv.gz > bookings.csv
[ec2-user@ip-172-31-20-48 import_files]$ zcat rooms.csv.gz > rooms.csv
[ec2-user@ip-172-31-20-48 import_files]$ zcat transactions.csv.gz > transactions.csv
[ec2-user@ip-172-31-20-48 import_files]$ zcat users.csv.gz > users.csv
```

Then import files
```
> psql -d airbnb -a -f db//postgres/import.sql
```
4. Modify schema with indexes and foreign keys
```
> psql -d airbnb -a -f db/postgres/alter_fk.sql
```

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
This operation **is** part of the front end implementation.
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
This operation **SHOULD NOT** be implemented. We don't want to return 10 million rows of data.
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
This operation **SHOULD NOT** be implemented. We don't want to return 10 million rows of data. 
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

