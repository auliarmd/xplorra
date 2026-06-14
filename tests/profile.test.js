const request = require('supertest');
const app = require('../server');

describe('Protected Endpoint Test', () => {

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

  test('TC17 - profile berhasil diakses', async () => {

    const response = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

  });

  test('TC18 - my recipes', async () => {

    const response = await request(app)
      .get('/my-recipes')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

  });

  test('TC19 - my bookmarks', async () => {

    const response = await request(app)
      .get('/my-bookmarks')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

  });

  test('TC20 - my likes', async () => {

    const response = await request(app)
      .get('/my-likes')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

  });

  test('TC21 - notifications', async () => {

    const response = await request(app)
      .get('/notifications')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

  });

  test('TC22 - my rating', async () => {

    const response = await request(app)
        .get('/my-rating/1')
        .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    });

    test('TC23 - bookmark resep', async () => {

    const response = await request(app)
        .post('/bookmark/1')
        .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    });

    test('TC24 - like resep', async () => {

    const response = await request(app)
        .post('/like/1')
        .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    });

    test('TC25 - feedback gagal jika data kosong', async () => {

    const response = await request(app)
        .post('/feedback')
        .set('Authorization', `Bearer ${token}`)
        .send({});

    expect(response.statusCode).toBe(400);

    });

    test('TC26 - feedback berhasil dikirim', async () => {

    const response = await request(app)
        .post('/feedback')
        .set('Authorization', `Bearer ${token}`)
        .send({
        kepuasan:'Puas',
        kategori:'Fitur',
        pesan:'Testing Jest'
        });

    expect(response.statusCode).toBe(200);

    });

    test('TC37 - profile tanpa token', async () => {

    const response = await request(app)
        .get('/profile');

    expect(response.statusCode).toBe(401);

    });

    test('TC38 - profile token tidak valid', async () => {

    const response = await request(app)
        .get('/profile')
        .set('Authorization', 'Bearer token_salah');

    expect(response.statusCode).toBe(403);

    });

    test('TC39 - my recipes tanpa token', async () => {

    const response = await request(app)
        .get('/my-recipes');

    expect(response.statusCode).toBe(401);

    });

    test('TC40 - notifications tanpa token', async () => {

    const response = await request(app)
        .get('/notifications');

    expect(response.statusCode).toBe(401);

    });

    test('TC63 - bookmark id tidak ada', async () => {

  const response = await request(app)
    .post('/bookmark/999999')
    .set('Authorization', `Bearer ${token}`);

  expect(response.statusCode).toBe(200);

});

test('TC64 - like id tidak ada', async () => {

  const response = await request(app)
    .post('/like/999999')
    .set('Authorization', `Bearer ${token}`);

  expect(response.statusCode).toBe(200);

});

test('TC65 - rating id tidak ada', async () => {

  const response = await request(app)
    .post('/rating/999999')
    .set('Authorization', `Bearer ${token}`)
    .send({
      star:5
    });

  expect([200,400]).toContain(response.statusCode);

});

});