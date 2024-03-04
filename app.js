import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import env from "dotenv";

const app = express();
const port = 3000;

env.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

////////////////RENDERING ALL BOOKS IN THE LIBRARY IN THE HOME PAGE/////////////
app.get("/", async (req, res) => {
  try {
    const books = await db.query("SELECT * FROM books");
    console.log(books.rows);
    if (books.rows.length > 0) {
      res.render("index.ejs", { library: books.rows });
    } else res.render("index.ejs");
  } catch (error) {
    res.json({ massage: "could not get the image" });
  }
});

////////////////RENDERING THE ADDING FORM TO A NEW BOOK/////////////////
app.get("/add", (req, res) => {
    res.render("modify.ejs");
});

///////////////GETTING A BOOK FROM THE DB TO BE UPDATED/////////////////
app.get("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const book = await db.query("SELECT * FROM books WHERE id = $1", [id]);
    res.render("modify.ejs", { book: book.rows[0] });
  } catch (error) {
    res.json({ massage: "couldn't get the book's data" });
  }
});

///////////////DELETING A BOOK FROM DB//////////////////
app.get("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const response = await db.query("DELETE FROM books WHERE id = $1", [id]);
    res.redirect("/");
  } catch (error) {
    res.json({massage: "error in deleting this book"});
  }
});

//////////////ADDING A NEW BOOK IN THE DATABASE/////////////
app.post("/add", async (req, res) => {
  try {
    const { title, url, review, comment } = req.body;
    const image = await axios.get("https://" + url + ".json");
    console.log(image.data);
    const imageURL = image.data.source_url;
    const response = await db.query(
      "INSERT INTO books (title, url, review, comment, imageurl) VALUES ($1, $2 ,$3, $4, $5)",
      [title, url, review, comment, imageURL]
    );
    res.redirect("/");
  } catch (error) {
    res.json({ massage: "error in adding your book to my library" });
  }
});

///////////////UPDATING A BOOK IN THE DATABASE////////////////////
app.post("/edit/:id", async (req, res) => {
  try {
    const { title, url, review, comment } = req.body;
    const id = req.params.id;
    const image = await axios.get("https://" + url + ".json");
    console.log(image.data);
    const imageURL = image.data.source_url;
    const response = db.query(
      "UPDATE books SET (title, url, review, comment, imageurl) = ($1, $2, $3, $4, $5) WHERE id = $6",
      [title, url, review, comment, imageURL, id]
    );
    res.redirect("/");
  } catch (error) {
    res.json({ massage: "error in editing your book data" });
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

// {
//     id: 12547191,
//     category_id: 1,
//     olid: 'OL35615701M',
//     filename: 'covers_0012/covers_0012_54.zip',
//     author: '/people/ScarTissue',
//     ip: '207.241.232.201',
//     source_url: 'https://images-na.ssl-images-amazon.com/images/I/61cjc9PLvGL.jpg',
//     source: null,
//     isbn: null,
//     created: '2022-01-11T16:28:18.223108',
//     last_modified: '2022-01-11T16:28:18.223108',
//     archived: true,
//     failed: false,
//     width: 907,
//     height: 1360,
//     filename_s: 's_covers_0012/s_covers_0012_54.zip',
//     filename_m: 'm_covers_0012/m_covers_0012_54.zip',
//     filename_l: 'l_covers_0012/l_covers_0012_54.zip',
//     isbn13: null,
//     uploaded: true,
//     deleted: false
//   }
