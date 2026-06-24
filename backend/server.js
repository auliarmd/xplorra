require("dotenv").config();

const express = require('express');
const mysql = require('mysql2');
const helmet = require('helmet');
const cors = require("cors");
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const app = express();

const limiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  max: 100,

  message: 'Terlalu banyak request, coba lagi nanti'

});

// app.use(limiter);
app.use('/register', limiter);
app.use('/login', limiter);

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const fs = require("fs");

console.log("DIRNAME:", __dirname);
console.log("UPLOAD EXISTS:", fs.existsSync(path.join(__dirname, "uploads")));

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://xplorra-git-main-asl-team.vercel.app",
    "https://xplorra.vercel.app"
  ],
  credentials: true
}));

app.use(
  '/uploads',
  express.static(path.join(__dirname,'uploads'))
);

const storage = multer.diskStorage({

  destination:(req,file,cb)=>{

  cb(null,'uploads/');

},


  filename:(req,file,cb)=>{

    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );

  }

});

const profileStorage = multer.diskStorage({

  destination:(req,file,cb)=>{

    cb(null,'uploads/');

  },

  filename:(req,file,cb)=>{

    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );

  }

});

const uploadProfile = multer({
  storage: profileStorage
});

const upload = multer({storage});

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

//Verifikasi Token JWT
function verifyToken(req,res,next){

  const authHeader = req.headers.authorization;

  if(!authHeader){
    return res.status(401).json({
      status:false,
      message:'Token tidak ada'
    });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token,'SECRET_KEY_XPLORRA',(err,decoded)=>{

    if(err){
      return res.status(403).json({
        status:false,
        message:'Token tidak valid'
      });
    }

    req.user = decoded;

    next();

  });

}

//database sql
const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MySQL Connected");
    connection.release();
  }
});

app.get('/register', (req,res)=>{
   res.send("Halaman Register API");
});

//Menerima
app.post('/register',
 [
   body('email')
     .isEmail()
     .withMessage('Format email tidak valid'),
   body('password')
     .isLength({ min: 6 })
     .withMessage('Password minimal 6 karakter'),
 ],

 (req, res) => {
 const { nama, email, password } = req.body;
 const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

 // VALIDASI FORM KOSONG
 if(!nama || !email || !password){
   return res.json({
     status:false,
     message:'Isi semua form terlebih dahulu'
   });
 }

 // VALIDASI NAMA
 if(nama.length < 3){
   return res.json({
     status:false,
     message:'Nama minimal 3 karakter'
   });
 }

 // VALIDASI EMAIL
 if(!email.includes('@')){
   return res.json({
     status:false,
     message:'Format email tidak valid'
   });
 }

 // VALIDASI PASSWORD
if(password.trim().length !== 6){
 return res.json({
   status:false,
   message:'Password harus tepat 6 karakter'
 });
}

 // CEK EMAIL SUDAH TERDAFTAR
 db.query(
   'SELECT * FROM users WHERE email=?',
   [email],
   (err, rows) => {
     if (err) return res.status(500).json(err);
     if (rows.length > 0) {
       return res.json({
         status:false,
         message:'Email sudah terdaftar'
       });
     }

     // SIMPAN USER BARU
     db.query(
       'INSERT INTO users(nama,email,password) VALUES (?,?,?)',
       [nama,email,password],
       (err,result)=>{
         if(err) return res.status(500).json(err);
         res.json({
           status:true,
           message:'Register berhasil'
         });
       }
     );
   }
 );
});

app.post('/login',(req,res)=>{

 const { nama,password } = req.body;

 // VALIDASI
 if(!nama || !password){
   return res.json({
     status:false,
     message:'Isi semua form terlebih dahulu'
   });
 }

 if(nama.trim().length < 3){
   return res.json({
     status:false,
     message:'Nama minimal 3 karakter'
   });
 }

 if(password.trim().length !== 6){
   return res.json({
     status:false,
     message:'Password harus tepat 6 karakter'
   });
 }

 // LOGIN DATABASE
 db.query(
   'SELECT * FROM users WHERE nama=? AND password=?',
   [nama,password],
   (err,rows)=>{

     if(err){
       return res.status(500).json({
         status:false,
         message:'Terjadi kesalahan server'
       });
     }

     // LOGIN BERHASIL
     if(rows.length > 0){

      // Membuat token JWT saat login 

       const token = jwt.sign(
        {
          id:rows[0].id,
          nama:rows[0].nama,
          email:rows[0].email,
          foto:rows[0].foto
        },
        'SECRET_KEY_XPLORRA',
        {
          expiresIn:'2h'
        }
        );

        return res.json({
        status:true,
        message:'Login berhasil',
        token,
        user:{
            id:rows[0].id,
            nama:rows[0].nama,
            email:rows[0].email
        }
        });


     }

     // LOGIN GAGAL
     return res.json({
       status:false,
       message:'Nama atau password salah'
     });

   }
 );

});

//middleware jwt untuk proteksi endpoint
app.get('/profile', verifyToken,(req,res)=>{

  db.query(

    'SELECT id,nama,email,foto FROM users WHERE id=?',

    [req.user.id],

    (err,rows)=>{

      if(err){
        return res.status(500).json(err);
      }

      res.json({
        status:true,
        user:rows[0]
      });

    }

  );

});

//recipe
app.get('/my-recipes', verifyToken,(req,res)=>{

  db.query(

    `
    SELECT
      f.*,
      (
        SELECT COUNT(*)
        FROM ratings r
        WHERE r.food_id = f.id
        AND r.komentar IS NOT NULL
        AND r.komentar <> ''
      ) AS total_komentar
    FROM foods f
    WHERE creator_id=?
    `,

    [req.user.id],

    (err,rows)=>{

      if(err){
        return res.status(500).json(err);
      }

      res.json(rows);

    }

  );

});

app.get('/my-bookmarks', verifyToken,(req,res)=>{

  db.query(

    `
    SELECT
      foods.*,

      (
        SELECT COUNT(*)
        FROM ratings r
        WHERE r.food_id = foods.id
        AND r.komentar IS NOT NULL
        AND r.komentar <> ''
      ) AS total_komentar

    FROM bookmarks

    JOIN foods
    ON bookmarks.food_id = foods.id

    WHERE bookmarks.user_id=?
    `,

    [req.user.id],

    (err,rows)=>{

      if(err){
        return res.status(500).json(err);
      }

      res.json(rows);

    }

  );

});

app.get('/foods', (req, res) => {

  console.log("=== FOODS HIT ===");

  const { kategori, daerah, search } = req.query;

  let sql = `
    SELECT 
      f.id,
      f.nama,
      f.creator_id,
      f.kategori,
      f.daerah,
      f.deskripsi,
      f.rating,
      f.likes,
      f.gambar,
      f.creator,
      (
        SELECT COUNT(*)
        FROM ratings r
        WHERE r.food_id = f.id
        AND r.komentar IS NOT NULL
        AND r.komentar <> ''
      ) AS total_komentar
    FROM foods f
    WHERE 1=1
  `;

  let params = [];

  if(kategori){
    sql += ' AND f.kategori=?';
    params.push(kategori);
  }

  if(daerah){
    sql += ' AND f.daerah=?';
    params.push(daerah);
  }

  if(search){
    sql += ' AND f.nama LIKE ?';
    params.push(`%${search}%`);
  }

  db.query(sql, params, (err, rows) => {

    if(err){
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(rows);

  });

});

app.get('/foods/search/:keyword',(req,res)=>{

 const keyword = req.params.keyword;

 db.query(
 'UPDATE foods SET search_count = search_count + 1 WHERE nama LIKE ?',
 [`%${keyword}%`]
 );

 db.query(
 'SELECT * FROM foods WHERE nama LIKE ?',
 [`%${keyword}%`],
 (err,rows)=>{

   if(err) return res.status(500).json(err);

   res.json(rows);

 });

});

app.get('/foods/trending', (req, res) => {

  db.query(
    `
    SELECT 
      f.id,
      f.nama,
      f.kategori,
      f.daerah,
      f.deskripsi,
      f.rating,
      f.likes,
      f.gambar,
      f.creator,
      (
          SELECT COUNT(*)
          FROM ratings r
          WHERE r.food_id = f.id
          AND r.komentar IS NOT NULL
          AND r.komentar <> ''
        ) AS total_komentar
    FROM foods f
    ORDER BY f.likes DESC, f.rating DESC
    LIMIT 2
    `,
    (err, rows) => {

      if(err){

        console.log(err);

        return res.status(500).json({
          status:false,
          message:'Gagal mengambil trending'
        });

      }

      res.json(rows);

    }
  );

});

app.get('/foods/:id',(req,res)=>{
 db.query('SELECT * FROM foods WHERE id=?',[req.params.id],(err,rows)=>{
   if(err) return res.status(500).json(err);
   res.json(rows[0]);
 });
});

app.get('/resep/:id', verifyToken, (req,res)=>{

  const id = req.params.id;

  // =========================
  // AMBIL DATA RESEP
  // =========================
  db.query(

  `
  SELECT

  foods.*,

  users.nama AS creator,

  users.foto AS creator_foto

  FROM foods

  JOIN users
  ON foods.creator_id = users.id

  WHERE foods.id=?
  `,

  [id],

    (err,rows)=>{

      if(err){

        return res.status(500).json(err);

      }

      if(rows.length === 0){

        return res.json({
          status:false,
          message:'Resep tidak ditemukan'
        });

      }

      // =========================
      // AMBIL KOMENTAR
      // =========================
      db.query(

        `
        SELECT
          ratings.komentar,
          ratings.star,
          ratings.created_at,
          users.nama,
          users.foto
        FROM ratings
        JOIN users
        ON ratings.user_id = users.id
        WHERE ratings.food_id=?
        AND ratings.komentar IS NOT NULL
        AND ratings.komentar <> ''
        ORDER BY ratings.id DESC
        `,
          
        [id],

        (err2, komentar) => {

          if(err2){

            return res.status(500).json(err2);

          }

          console.log("HASIL QUERY:", komentar);

          res.json({

            status:true,

            user:req.user.nama,

            resep:rows[0],

            komentar:komentar

          });

        }
      );

    }

  );

});

app.post('/bookmark/:id', verifyToken,(req,res)=>{

  const food_id = req.params.id;
  const user_id = req.user.id;

  db.query(
    'SELECT creator_id FROM foods WHERE id=?',
    [food_id],
    (errFood, foodRows) => {

      if(errFood){
        return res.status(500).json(errFood);
      }

      if(foodRows[0].creator_id === user_id){

        return res.json({
          status:false,
          message:'Tidak dapat menyimpan resep sendiri'
        });

      }

  db.query(

    'SELECT * FROM bookmarks WHERE user_id=? AND food_id=?',

    [user_id, food_id],

    (err,result)=>{

      if(err){

        return res.status(500).json(err);

      }

      // =====================
      // JIKA SUDAH DISIMPAN
      // =====================
      if(result.length > 0){

        db.query(

          'DELETE FROM bookmarks WHERE user_id=? AND food_id=?',

          [user_id, food_id],

          (err2)=>{

            if(err2){

              return res.status(500).json(err2);

            }

            res.json({
              status:true,
              bookmarked:false,
              message:'Bookmark dibatalkan'
            });

          }

        );

      }

      // =====================
      // JIKA BELUM DISIMPAN
      // =====================
      else{

        db.query(

          'INSERT INTO bookmarks (user_id, food_id) VALUES (?,?)',

          [user_id, food_id],

          (err3)=>{

            if(err3){

              return res.status(500).json(err3);

            }

            res.json({
              status:true,
              bookmarked:true,
              message:'Resep disimpan'
            });

          }
          

        );

      }

    }

  );

   } 

  ); 

});

app.get('/my-likes', verifyToken,(req,res)=>{

  db.query(

    'SELECT food_id FROM likes WHERE user_id=?',

    [req.user.id],

    (err,result)=>{

      if(err){

        return res.status(500).json(err);

      }

      res.json(result);

    }

  );

});

app.post('/like/:id', verifyToken, (req,res)=>{

  const food_id = req.params.id;

  const user_id = req.user.id;

  // cek apakah sudah like
  db.query(

    'SELECT * FROM likes WHERE user_id=? AND food_id=?',

    [user_id, food_id],

    (err,result)=>{

      if(err){

        return res.status(500).json(err);

      }

      // =========================
      // UNLIKE
      // =========================
      if(result.length > 0){

        db.query(

          'DELETE FROM likes WHERE user_id=? AND food_id=?',

          [user_id, food_id],

          (err2)=>{

            if(err2){

              return res.status(500).json(err2);

            }

            // kurangi jumlah likes
            db.query(

              'UPDATE foods SET likes = likes - 1 WHERE id=?',

              [food_id]

            );

            res.json({
              status:true,
              liked:false,
              message:'Like dibatalkan'
            });

          }

        );

      }

      // =========================
      // LIKE
      // =========================
      else{

        db.query(

          'INSERT INTO likes(user_id, food_id) VALUES (?,?)',

          [user_id, food_id],

          (err3)=>{

            if(err3){

              return res.status(500).json(err3);

            }

            // tambah likes
            db.query(
              'UPDATE foods SET likes = likes + 1 WHERE id=?',
              [food_id]
            );

            db.query(
              `
              SELECT creator_id,nama
              FROM foods
              WHERE id=?
              `,
              [food_id],
              (errFood, foodRows)=>{

                if(foodRows.length > 0){

                  const ownerId = foodRows[0].creator_id;
                  const namaResep = foodRows[0].nama;

                  if(ownerId !== req.user.id){

                    db.query(
                      `
                      INSERT INTO notifications
                      (
                        user_id,
                        from_user,
                        food_id,
                        recipe_name,
                        message,
                        foto
                      )
                      VALUES (?,?,?,?,?,?)
                      `,
                      [
                        ownerId,
                        req.user.nama,
                        food_id,
                        namaResep,
                        `menyukai resep`,
                        req.user.foto
                      ]
                    );

                  }

                }

              }
            );

            res.json({
              status:true,
              liked:true,
              message:'Resep disukai'
            });

          }

        );

      }

    }

  );

});

app.get('/my-rating/:id', verifyToken, (req,res)=>{

  const food_id = req.params.id;

  db.query(

    `
    SELECT star
    FROM ratings
    WHERE user_id=? AND food_id=?
    `,

    [req.user.id, food_id],

    (err,result)=>{

      if(err){

        return res.status(500).json(err);

      }

      if(result.length > 0){

        return res.json({
          status:true,
          star:result[0].star
        });

      }

      res.json({
        status:false,
        star:0
      });

    }

  );

});

app.post('/foods',(req,res)=>{
 const {nama,kategori,daerah,deskripsi,rating,trending,gambar}=req.body;
 db.query('INSERT INTO foods(nama,kategori,daerah,deskripsi,rating,trending,gambar) VALUES (?,?,?,?,?,?,?)',[nama,kategori,daerah,deskripsi,rating,trending,gambar],(err)=>{
 if(err) return res.status(500).json(err);
 res.json({message:'Berhasil tambah makanan'});
 });
});

app.put('/foods/:id',(req,res)=>{
 const {nama,kategori,daerah,deskripsi,rating,trending}=req.body;
 db.query('UPDATE foods SET nama=?,kategori=?,daerah=?,deskripsi=?,rating=?,trending=? WHERE id=?',[nama,kategori,daerah,deskripsi,rating,trending,req.params.id],(err)=>{
 if(err) return res.status(500).json(err);
 res.json({message:'Berhasil update'});
 });
});

app.delete('/foods/:id',(req,res)=>{
 db.query('DELETE FROM foods WHERE id=?',[req.params.id],(err)=>{
 if(err) return res.status(500).json(err);
 res.json({message:'Berhasil hapus'});
 });
});

app.get('/logout',(req,res)=>{

  res.json({
    status:true,
    message:'Logout berhasil'
  });

});

app.post(
  '/add-food',
  verifyToken,
  upload.single('gambar'),
  (req,res)=>{

    const nama = req.body.nama;
    const kategori = req.body.kategori;
    const daerah = req.body.daerah;
    const deskripsi = req.body.deskripsi;

    const bahan = req.body.bahan;
    const langkah = req.body.langkah;

    const rating = 0;
    const trending = 0;

    const gambar = req.file
      ? req.file.filename
      : null;

    db.query(
    `
    INSERT INTO foods
    (
    nama,
    kategori,
    daerah,
    deskripsi,
    rating,
    trending,
    gambar,
    bahan,
    langkah,
    creator,
    creator_id
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
    `,
    [
      nama,
      kategori,
      daerah,
      deskripsi,
      rating,
      trending,
      gambar,
      bahan,
      langkah,
      req.user.nama,
      req.user.id
    ],
    (err,result)=>{

      if(err){

        console.log(err);

        return res.status(500).json(err);

      }

      res.json({
        status:true,
        message:'Resep berhasil ditambahkan'
      });

    });

});

app.put(
  '/edit-food/:id',
  verifyToken,
  upload.single('gambar'),
  (req,res)=>{

    const foodId = req.params.id;

    const {
      nama,
      kategori,
      daerah,
      deskripsi,
      bahan,
      langkah
    } = req.body;

    let sql = `
      UPDATE foods
      SET
      nama=?,
      kategori=?,
      daerah=?,
      deskripsi=?,
      bahan=?,
      langkah=?
    `;

    let params = [
      nama,
      kategori,
      daerah,
      deskripsi,
      bahan,
      langkah
    ];

    if(req.file){

      sql += `,
      gambar=?
      `;

      params.push(req.file.filename);

    }

    sql += `
      WHERE id=? AND creator_id=?
    `;

    params.push(
      foodId,
      req.user.id
    );

    db.query(
      sql,
      params,
      (err,result)=>{

        if(err){

          console.log(err);

          return res.status(500).json(err);

        }

        res.json({
          status:true,
          message:'Resep berhasil diupdate'
        });

      }
    );

});

app.post(
  '/komentar/:id',
  verifyToken,
  (req,res)=>{

    const food_id = req.params.id;

    const komentar = req.body.komentar;

    db.query(

      `
      INSERT INTO ratings
      (
        food_id,
        user_id,
        komentar,
        star
      )
      VALUES (?,?,?,?)
      `,

      [
        food_id,
        req.user.id,
        komentar,
        5
      ],

      (errFood,foodResult)=>{

        if(errFood){

          console.log(errFood);

          return res.status(500).json(errFood);

        }

        db.query(

          `
          SELECT creator_id,nama
          FROM foods
          WHERE id=?
          `,

          [food_id],

          (errFood,foodResult)=>{

            if(foodResult.length > 0){

              const ownerId = foodResult[0].creator_id;

              const namaResep = foodResult[0].nama;

              // jangan notif diri sendiri
              if(ownerId !== req.user.id){

                db.query(

                  `
                  INSERT INTO notifications
                  (
                    user_id,
                    from_user,
                    food_id,
                    recipe_name,
                    message,
                    foto
                  )
                  VALUES (?,?,?,?,?,?)
                  `,

                  [
                    ownerId,
                    req.user.nama,
                    food_id,
                    namaResep,
                    `mengomentari resep`,
                    req.user.foto
                  ]

                );

              }

            }

          }

        );

        const komentarBaru = {

          nama:req.user.nama,

          foto:req.user.foto,

          komentar

        };

        res.json({
          status:true,
          komentarBaru
        });

      }

    );

});

app.post('/rating/:id', verifyToken,(req,res)=>{

  const food_id = req.params.id;

  const user_id = req.user.id;

  const star = req.body.star;

  // cek apakah user sudah pernah rating
  db.query(

    'SELECT * FROM ratings WHERE user_id=? AND food_id=?',

    [user_id, food_id],

    (err,result)=>{

      if(err){

        return res.status(500).json(err);

      }

      // ==========================
      // UPDATE RATING
      // ==========================
      if(result.length > 0){

        db.query(

          'UPDATE ratings SET star=? WHERE user_id=? AND food_id=?',

          [star, user_id, food_id],

          (err2)=>{

            if(err2){

              return res.status(500).json(err2);

            }

            updateAverageRating();

          }

        );

      }

      // ==========================
      // INSERT RATING BARU
      // ==========================
      else{

        db.query(

          `
          INSERT INTO ratings
          (
            food_id,
            user_id,
            komentar,
            star
          )
          VALUES (?,?,?,?)
          `,

          [
            food_id,
            user_id,
            '',
            star
          ],

          (err3)=>{

            if(err3){

              return res.status(500).json(err3);

            }

            updateAverageRating();

          }

        );

      }

    }

  );

  // ==========================
  // HITUNG RATA-RATA
  // ==========================
  function updateAverageRating(){

    db.query(

      `
      SELECT AVG(star) AS avgRating
      FROM ratings
      WHERE food_id=?
      `,

      [food_id],

      (err4,result2)=>{

        if(err4){

          return res.status(500).json(err4);

        }

        const avgRating = parseFloat(
          result2[0].avgRating
        ).toFixed(1);

        // update foods.rating
        db.query(

          'UPDATE foods SET rating=? WHERE id=?',

          [avgRating, food_id],

          (err5)=>{

            if(err5){

              return res.status(500).json(err5);

            }

            db.query(
              `
              SELECT creator_id,nama
              FROM foods
              WHERE id=?
              `,
              [food_id],
              (errFood, foodRows)=>{

                if(foodRows.length > 0){

                  const ownerId = foodRows[0].creator_id;
                  const namaResep = foodRows[0].nama;

                  if(ownerId !== req.user.id){

  db.query(

    `
    SELECT *
    FROM notifications
    WHERE
      from_user=?
      AND food_id=?
      AND message LIKE 'memberi rating%'
    `,

    [
      req.user.nama,
      food_id
    ],

    (errNotif, notifRows)=>{

      if(notifRows.length === 0){

        db.query(
          `
          INSERT INTO notifications
          (
            user_id,
            from_user,
            food_id,
            recipe_name,
            message,
            foto
          )
          VALUES (?,?,?,?,?,?)
          `,
          [
            ownerId,
            req.user.nama,
            food_id,
            namaResep,
            `memberi rating ${star}`,
            req.user.foto
          ]
        );

      }

    }

  );

}

                }

              }
            );

            res.json({
              status:true,
              rating:avgRating
            });

          }

        );

      }

    );

  }

});

app.delete('/delete-food/:id', verifyToken, (req,res)=>{

  const foodId = req.params.id;

  // hapus bookmark
  db.query(
    'DELETE FROM bookmarks WHERE food_id=?',
    [foodId]
  );

  // hapus rating
  db.query(
    'DELETE FROM ratings WHERE food_id=?',
    [foodId]
  );

  // hapus resep
  db.query(

    'DELETE FROM foods WHERE id=? AND creator_id=?',

    [foodId, req.user.id],

    (err,result)=>{

      if(err){

        return res.status(500).json(err);

      }

      res.json({
        status:true,
        message:'Resep berhasil dihapus'
      });

    }

  );

});

app.get('/notifications', verifyToken, (req,res)=>{

  db.query(

    `
    SELECT DISTINCT
      notifications.*,
      users.foto,
      foods.nama AS recipe_name
    FROM notifications
    JOIN users
      ON notifications.from_user = users.nama
    LEFT JOIN foods
      ON notifications.food_id = foods.id
    WHERE notifications.user_id=?
    ORDER BY notifications.created_at DESC
    `,

    [req.user.id],

    (err,rows)=>{

      if(err){

        return res.status(500).json(err);

      }

      res.json(rows);

    }

  );

});

app.put('/notifications/read/:id', verifyToken, (req,res)=>{

  db.query(
    'UPDATE notifications SET is_read=1 WHERE id=?',
    [req.params.id],
    (err)=>{

      if(err){
        return res.status(500).json(err);
      }

      res.json({
        status:true
      });

    }
  );

});

app.post(
  '/feedback',
  verifyToken,
  (req,res)=>{

    const {
      kepuasan,
      kategori,
      pesan
    } = req.body;

    if(!kepuasan || !kategori || !pesan){

      return res.status(400).json({
        message:'Isi semua form'
      });

    }

    db.query(

      `
      INSERT INTO feedbacks
      (
        user_id,
        kepuasan,
        kategori,
        pesan
      )
      VALUES (?,?,?,?)
      `,

      [
        req.user.id,
        kepuasan,
        kategori,
        pesan
      ],

      (err,result)=>{

        if(err){

          return res.status(500).json(err);

        }

        res.json({
          status:true,
          message:'Feedback berhasil dikirim'
        });

      }

    );

  }
);

app.post(
  '/upload-profile',
  verifyToken,
  uploadProfile.single('foto'),

  (req,res)=>{

    if(!req.file){

      return res.status(400).json({
        status:false,
        message:'Foto tidak ditemukan'
      });

    }

    const foto = req.file.filename;

    db.query(

      'UPDATE users SET foto=? WHERE id=?',

      [foto, req.user.id],

      (err,result)=>{

        if(err){

          return res.status(500).json(err);

        }

        res.json({

          status:true,

          foto

        });

      }

    );

  }
);

app.put(
  '/reset-password',

  (req,res)=>{

    const {
      nama,
      passwordBaru
    } = req.body;

    db.query(

      `
      UPDATE users
      SET password=?
      WHERE nama=?
      `,

      [
        passwordBaru,
        nama
      ],

      (err,result)=>{

        if(err){

          return res.status(500)
          .json({
            message:'Server error'
          });

        }

        if(
          result.affectedRows === 0
        ){

          return res.json({
            message:
            'User tidak ditemukan'
          });

        }

        res.json({
          message:
          'Password berhasil diubah'
        });

      }

    );

  }
);

app.delete(
  "/profile-photo",
  verifyToken,
  (req,res)=>{
    db.query(

      "UPDATE users SET foto='' WHERE id=?", 
      [req.user.id],
      (err)=>{
        if(err){
          console.log("Error Hapus Foto:", err); 
          return res.status(500).json(err);
        }
        res.json({
          status:true,
          message:"Foto berhasil dihapus"
        });

      }

    );

  }
);
app.put(
  "/update-name",
  verifyToken,
  (req,res)=>{

    const { nama } = req.body;

    if(!nama || nama.trim().length < 3){

      return res.json({
        status:false,
        message:"Nama minimal 3 karakter"
      });

    }

    db.query(

      "UPDATE users SET nama=? WHERE id=?",

      [
        nama,
        req.user.id
      ],

      (err,result)=>{

        if(err){

          return res.status(500).json(err);

        }

        res.json({
          status:true,
          message:"Nama berhasil diubah"
        });

      }

    );

  }
);

app.put(
  "/change-password",
  verifyToken,
  (req, res) => {

    console.log("CHANGE PASSWORD DIPANGGIL");

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.json({
        status: false,
        message: "Isi semua form"
      });
    }

    db.query(
      "SELECT * FROM users WHERE id=?",
      [req.user.id],
      (err, rows) => {

        if (err) {
          return res.status(500).json(err);
        }

        if (rows.length === 0) {
          return res.json({
            status: false,
            message: "User tidak ditemukan"
          });
        }

        if (rows[0].password !== oldPassword) {
          return res.json({
            status: false,
            message: "Password lama salah"
          });
        }

        db.query(
          "UPDATE users SET password=? WHERE id=?",
          [newPassword, req.user.id],
          (err2) => {

            if (err2) {
              return res.status(500).json(err2);
            }

            res.json({
              status: true,
              message: "Password berhasil diubah"
            });

          }
        );

      }
    );

  }
);


const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("XpLorra Backend Running 🚀");
});
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});