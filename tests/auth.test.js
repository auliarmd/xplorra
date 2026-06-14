const request = require('supertest');
const app = require('../server');

describe('Authentication Regression Test Suite', () => {

  test('TC01 - register gagal jika email tidak valid', async () => {

    const response = await request(app)
      .post('/register')
      .send({
        nama: 'Andi',
        email: 'andi.com',
        password: '123456'
      });

    expect(response.statusCode).toBe(400);

  });

  test('TC02 - register gagal jika password kurang dari 6 karakter', async () => {

    const response = await request(app)
      .post('/register')
      .send({
        nama: 'Andi',
        email: 'andi@gmail.com',
        password: '123'
      });

    expect(response.statusCode).toBe(400);

  });

  test('TC03 - login gagal jika data kosong', async () => {

    const response = await request(app)
      .post('/login')
      .send({});

    expect(response.body.status).toBe(false);

  });

  test('TC04 - login gagal jika password salah', async () => {

    const response = await request(app)
      .post('/login')
      .send({
        nama: 'andi',
        password: '999999'
      });

    expect(response.body.status).toBe(false);

  });

 test('TC58 - register dengan nama kosong', async () => {

  const response = await request(app)
    .post('/register')
    .send({
      nama:'',
      email:'test@gmail.com',
      password:'123456'
    });

  expect([200,400]).toContain(response.statusCode);

});

test('TC59 - register gagal jika password kosong', async () => {

  const response = await request(app)
    .post('/register')
    .send({
      nama:'tester',
      email:'test@gmail.com',
      password:''
    });

  expect(response.statusCode).toBe(400);

});

test('TC60 - login user tidak ditemukan', async () => {

  const response = await request(app)
    .post('/login')
    .send({
      nama:'user_tidak_ada_123',
      password:'123456'
    });

  expect(response.statusCode).toBe(200);

});

});