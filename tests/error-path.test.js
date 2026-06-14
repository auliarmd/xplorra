const request = require('supertest');
const app = require('../server');

describe('Error Path Coverage', () => {

  test('TC41 - profile token invalid', async () => {

    const response = await request(app)
      .get('/profile')
      .set('Authorization', 'Bearer salah');

    expect(response.statusCode).toBe(403);

  });

  test('TC42 - bookmark tanpa token', async () => {

    const response = await request(app)
      .post('/bookmark/13');

    expect(response.statusCode).toBe(401);

  });

  test('TC43 - like tanpa token', async () => {

    const response = await request(app)
      .post('/like/13');

    expect(response.statusCode).toBe(401);

  });

  test('TC44 - my-rating tanpa token', async () => {

    const response = await request(app)
      .get('/my-rating/13');

    expect(response.statusCode).toBe(401);

  });

  test('TC48 - resep tanpa token', async () => {

  const response = await request(app)
    .get('/resep/13');

  expect(response.statusCode).toBe(401);

});

test('TC49 - feedback tanpa token', async () => {

  const response = await request(app)
    .post('/feedback')
    .send({
      kepuasan:'Puas',
      kategori:'Fitur',
      pesan:'Test'
    });

  expect(response.statusCode).toBe(401);

});

test('TC50 - upload profile tanpa token', async () => {

  const response = await request(app)
    .post('/upload-profile');

  expect(response.statusCode).toBe(401);

});

test('TC51 - delete food tanpa token', async () => {

  const response = await request(app)
    .delete('/delete-food/13');

  expect(response.statusCode).toBe(401);

});

const request = require('supertest');
const app = require('../server');

describe('Additional Validation Coverage', () => {

  let token = '';

  beforeAll(async () => {

    const login = await request(app)
      .post('/login')
      .send({
        nama: 'auliaaa',
        password: 'PASSWORD_ANDA'
      });

    token = login.body.token;

  });

  test('TC55 - upload profile token invalid', async () => {

    const response = await request(app)
      .post('/upload-profile')
      .set('Authorization', 'Bearer token_salah');

    expect(response.statusCode).toBe(403);

  });

});

});