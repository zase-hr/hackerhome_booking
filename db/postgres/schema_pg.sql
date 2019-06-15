DROP SCHEMA IF EXISTS bookings CASCADE;
CREATE SCHEMA bookings;

DROP TABLE IF EXISTS bookings.users CASCADE;
CREATE TABLE bookings.users (
  ID                 SERIAL          NOT NULL,
  EMAIL              VARCHAR (255)    NOT NULL,
  USERNAME           VARCHAR (30)     NOT NULL,
  PASSWORD           VARCHAR (40)     NOT NULL,
  FIRST_NAME         VARCHAR (30)     NOT NULL,
  LAST_NAME          VARCHAR (30)     NOT NULL,
  REGISTRATION_DATE  TIMESTAMPTZ      NOT NULL, -- DEFAULT CURRENT_DATE,
  PRIMARY KEY (ID)
);

DROP TABLE IF EXISTS bookings.rooms CASCADE;
CREATE TABLE bookings.rooms (
  ID                 SERIAL          NOT NULL,
  OWNERID            INTEGER          NOT NULL, -- REFERENCES bookings.users(ID),
  ROOMNAME           VARCHAR (255)    NOT NULL,
  PRICE              SMALLINT         NOT NULL,
  CLEANING_FEE       SMALLINT         NOT NULL,
  SERVICE_FEE        SMALLINT         NOT NULL,
  TAX                SMALLINT         NOT NULL,
  ADULTS             SMALLINT         NOT NULL DEFAULT 1,
  CHILDREN           SMALLINT         NOT NULL DEFAULT 0,
  INFANTS            SMALLINT         NOT NULL DEFAULT 0,
  MIN_NIGHT          SMALLINT         NOT NULL DEFAULT 1,
  MAX_NIGHT          SMALLINT         NOT NULL DEFAULT 10,
  RATINGS            NUMERIC          NOT NULL,
  NUM_REVIEWS        SMALLINT         NOT NULL,
  PRIMARY KEY (ID)
);

DROP TABLE IF EXISTS bookings.bookings CASCADE;
CREATE TABLE bookings.bookings (
  ID                 SERIAL          NOT NULL,
  ROOMID             INTEGER          NOT NULL, -- REFERENCES bookings.rooms(ID),
  USERID             INTEGER          NOT NULL, -- REFERENCES bookings.users(ID),
  ADULTS             SMALLINT         NOT NULL,
  CHILDREN           SMALLINT         NOT NULL,
  INFANTS            SMALLINT         NOT NULL,
  CHECK_IN           TIMESTAMPTZ      NOT NULL,
  CHECK_OUT          TIMESTAMPTZ      NOT NULL,
  CREATEDAT          TIMESTAMPTZ      NOT NULL DEFAULT CURRENT_DATE,
  PRIMARY KEY (ID)
);  

DROP TABLE IF EXISTS bookings.transactions CASCADE;
CREATE TABLE bookings.transactions (
  ID                 SERIAL           NOT NULL,
  BOOKINGID          INTEGER          NOT NULL, -- REFERENCES bookings.bookings(ID),
  PRICE              INTEGER          NOT NULL,
  PAYMENT_TYPE       VARCHAR(255)     NOT NULL,
  PRIMARY KEY (ID)
);