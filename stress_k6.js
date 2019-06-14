import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 200,
  duration: '90s',
  rps: 300,
};

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function () {
  const randBook = randomIntFromInterval(1, 1000000);
  const randRoom = randomIntFromInterval(1, 10000000);

  http.get(`http://localhost:3003/bookings/${randBook}`);
  http.get(`http://localhost:3003/rooms/${randRoom}`);
  sleep(1);
}
