import http from 'k6/http';

export const options = {

  stages: [

    { duration: '2m', target: 50 },

    { duration: '2m', target: 100 },

    { duration: '2m', target: 150 },

    { duration: '2m', target: 200 },

    { duration: '1m', target: 0 },

  ],

};

export default function () {

  http.get('http://localhost:5000/foods');

}