const request = require('supertest');
const app = require('../server');

describe('Advanced Coverage Test', () => {

  let token = '';

  beforeAll(async () => {

    const login = await request(app)
      .post('/login')
      .send({
        nama: 'auliaaa',
        password: '123456'
      });

    token = login.body.token;

  });

  test('TC27 - detail resep', async () => {

    const response = await request(app)
      .get('/resep/13')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

  });

  test('TC28 - kirim komentar', async () => {

    const response = await request(app)
      .post('/komentar/13')
      .set('Authorization', `Bearer ${token}`)
      .send({
        komentar: 'Komentar dari Jest'
      });

    expect(response.statusCode).toBe(200);

  });

  test('TC29 - kirim rating', async () => {

    const response = await request(app)
      .post('/rating/13')
      .set('Authorization', `Bearer ${token}`)
      .send({
        star: 5
      });

    expect(response.statusCode).toBe(200);

  });

  test('TC30 - bookmark resep lagi', async () => {

    const response = await request(app)
      .post('/bookmark/13')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

  });

  test('TC31 - like resep lagi', async () => {

    const response = await request(app)
      .post('/like/13')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

  });

  test('TC57 - detail resep tidak ditemukan', async () => {

  const response = await request(app)
    .get('/resep/999999')
    .set('Authorization', `Bearer ${token}`);

  expect(response.statusCode).toBe(200);

});

});