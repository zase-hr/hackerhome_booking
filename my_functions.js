'use strict';

module.exports = {
  generateRandomData
};

// Make sure to "npm install faker" first.
const Faker = require('faker');

function generateRandomData(userContext, events, done) {
  // generate data with Faker:
  const first_name = Faker.name.firstName();
  const last_name = Faker.name.lastName();
  const email = Faker.internet.email();
  const password = Faker.internet.password();
  const username = `${Faker.name.firstName()}${Faker.name.lastName()}`;
  const roomId = Faker.random.number({
    'min': 1,
    'max': 10000,
  });
  const adults = Faker.random.number({
    'min': 1,
    'max': 5,
  });
  const children = Faker.random.number({
    'min': 0,
    'max': 5,
  });
  const infants = Faker.random.number({
    'min': 0,
    'max': 5,
  });
  const check_in = Faker.date.future(2);
  const check_out = Faker.date.future(2);
  // add variables to virtual user's context:
  userContext.vars.first_name = first_name;
  userContext.vars.last_name = last_name;
  userContext.vars.email = email;
  userContext.vars.username = username;
  userContext.vars.password = password;
  userContext.vars.roomId = roomId;
  userContext.vars.adults = adults;
  userContext.vars.children = children;
  userContext.vars.infants = infants;
  userContext.vars.check_in = check_in;
  userContext.vars.check_out = check_out;
  // continue with executing the scenario:
  return done();
}