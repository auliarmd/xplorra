const request = require('supertest');
const path = require('path');
const app = require('../server');

describe('Owner Feature Test', () => {

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

  test('TC32 - edit resep milik sendiri', async () => {

    const response = await request(app)
      .put('/edit-food/13')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nama: 'Rendang Testing',
        kategori: 'Makanan Berat',
        daerah: 'Padang',
        deskripsi: 'Testing Edit',
        bahan: 'Daging',
        langkah: 'Masak'
      });

    expect(response.statusCode).toBe(200);

  });

  test('TC33 - lihat detail resep creator', async () => {

    const response = await request(app)
      .get('/resep/13')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

  });

  test('TC34 - rating ulang resep', async () => {

    const response = await request(app)
      .post('/rating/13')
      .set('Authorization', `Bearer ${token}`)
      .send({
        star: 4
      });

    expect(response.statusCode).toBe(200);

  });

  test('TC35 - bookmark toggle', async () => {

    const response = await request(app)
      .post('/bookmark/13')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

  });

  test('TC36 - like toggle', async () => {

    const response = await request(app)
      .post('/like/13')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

  });

  test('TC45 - upload profile berhasil', async () => {

    const response = await request(app)
        .post('/upload-profile')
        .set('Authorization', `Bearer ${token}`)
        .attach(
        'foto',
        path.join(__dirname, '../uploads/1780507576861.jpg')
        );

    expect(response.statusCode).toBe(200);

    });

    test('TC46 - upload profile tanpa file', async () => {

    const response = await request(app)
        .post('/upload-profile')
        .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);

    });

    test('TC47 - delete food creator', async () => {

    const response = await request(app)
        .delete('/delete-food/22')
        .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    });

    test('TC56 - delete food yang tidak ada', async () => {

    const response = await request(app)
        .delete('/delete-food/999999')
        .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    });

});
