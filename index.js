const express = require("express")
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set("view engine", "ejs")
app.use(express.static("public"))

// Multer config for file uploading
//-------------------------------------------------------------------------
const multer = require("multer")
// app.use(upload)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images")
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
  },
})

const upload = multer({ storage }).single("image") //single archivo, name="image" en input

app.get("/", (req, res) => {
  res.render("index", { path: "/" })
})

// GET all products
//------------------------`Single prod id: ${req.params.id}`--------------------
app.get("/products", (req, res) => {
  res.render("products", { path: "/products" })
})

// Render Form to add product
//--------------------------------------------
app.get("/products/add", (req, res) => {
  res.render("add-product-form", { path: "/products/add" })
})

// GET single product
//--------------------------------------------
app.get("/products/:id", (req, res) => {
  res.json({ msg: `Single prod id: ${req.params.id}` })
})
// POST create a product
//--------------------------------------------
app.post("/products", upload, (req, res) => {
  console.log(req.body)
  console.log(req.file)
  res.render("index")
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
