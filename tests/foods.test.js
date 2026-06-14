const request = require('supertest');
const app = require('../server');

describe('Foods Regression Test Suite', () => {

  test('TC05 - get semua makanan', async () => {

    const response = await request(app)
      .get('/foods');

    expect(response.statusCode).toBe(200);

  });

  test('TC06 - filter makanan berdasarkan kategori', async () => {

    const response = await request(app)
      .get('/foods?kategori=Makanan');

    expect(response.statusCode).toBe(200);

  });

  test('TC07 - detail makanan berdasarkan id', async () => {

    const response = await request(app)
      .get('/foods/1');

    expect(response.statusCode).toBe(200);

  });

  test('TC08 - detail makanan dengan id tidak ada', async () => {

    const response = await request(app)
      .get('/foods/999999');

    expect(response.statusCode).toBe(200);

  });

  test('TC09 - logout berhasil', async () => {

    const response = await request(app)
      .get('/logout');

    expect(response.body.status).toBe(true);

  });

  test('TC10 - endpoint register tersedia', async () => {

    const response = await request(app)
      .get('/register');

    expect(response.statusCode).toBe(200);

  });

  test('TC11 - get trending foods', async () => {

  const response = await request(app)
    .get('/foods/trending');

  expect(response.statusCode).toBe(200);

});

test('TC12 - search makanan', async () => {

  const response = await request(app)
    .get('/foods/search/ayam');

  expect(response.statusCode).toBe(200);

});

test('TC13 - halaman register tersedia', async () => {

  const response = await request(app)
    .get('/register');

  expect(response.text).toContain('Register');

});

test('TC14 - tambah makanan', async () => {

  const response = await request(app)
    .post('/foods')
    .send({
      nama:'Test',
      kategori:'Makanan',
      daerah:'Parepare',
      deskripsi:'Testing',
      rating:0,
      trending:0,
      gambar:'test.jpg'
    });

  expect(response.statusCode).toBe(200);

});

test('TC15 - update makanan', async () => {

  const response = await request(app)
    .put('/foods/1')
    .send({
      nama:'Test Update',
      kategori:'Makanan',
      daerah:'Parepare',
      deskripsi:'Testing',
      rating:0,
      trending:0
    });

  expect(response.statusCode).toBe(200);

});

test('TC16 - hapus makanan', async () => {

  const response = await request(app)
    .delete('/foods/1');

  expect(response.statusCode).toBe(200);

});

test('TC61 - search makanan tidak ditemukan', async () => {

  const response = await request(app)
    .get('/foods/search/abcdefghxyz');

  expect(response.statusCode).toBe(200);

});

test('TC62 - detail makanan id sangat besar', async () => {

  const response = await request(app)
    .get('/foods/99999999');

  expect(response.statusCode).toBe(200);

});

test('TC66 - edit food id tidak ditemukan', async () => {

  const response = await request(app)
    .put('/edit-food/999999')
    .set('Authorization', `Bearer ${token}`)
    .send({
      nama:'Test',
      kategori:'Test',
      daerah:'Test',
      deskripsi:'Test'
    });

  expect([200,404]).toContain(response.statusCode);

});

test('TC67 - tambah makanan data kosong', async () => {

  const response = await request(app)
    .post('/add-food')
    .set('Authorization', `Bearer ${token}`)
    .send({});

  expect([400,500]).toContain(response.statusCode);

});

});