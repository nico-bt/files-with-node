fs = require("fs")
const express = require("express")
const app = express()
const port = 3000

// Make DELETE method available in a form
const methodOverride = require("method-override")
// override with POST having ?_method=DELETE
app.use(methodOverride("_method"))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.static("images"))

let dummy_Database = [
  {
    email: "hugo@mail.com",
    productName: "Robot",
    imgFilename: "image-1687482403440-BasicRobot.jpg",
  },
  {
    email: "paco@mail.com",
    productName: "Robotazo",
    imgFilename: "image-1687483524104-SuperRobot.jpg",
  },
]

// MULTER CONFIG FOR FILE UPLOADING
//*****************************************************************************/
const multer = require("multer")

// Where to store files and how to choose filenames
//-----------------------------------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images")
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
  },
})

// Filter by file extension
//-----------------------------------------------------
function fileFilter(req, file, cb) {
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    // To accept the file pass `true`, like so:
    cb(null, true)
  } else {
    // To reject this file pass `false`, like so:
    req.file = "wrong extension"
    cb(null, false)
  }
  // You can always pass an error if something goes wrong:
  // cb(new Error("Error with Multer!"))
}

//single archivo, name="image" en input
// Esta funcion es el middleware a poner en cada ruta o gral en app.use()
const upload = multer({ storage, fileFilter }).single("image")

// ROUTES
//*****************************************************************************/
app.get("/", (req, res) => {
  res.render("index", { path: "/" })
})

// GET all products
//--------------------------------------------
app.get("/products", (req, res) => {
  res.render("products", { path: "/products", dummy_Database })
})

// Render Form to add product
//--------------------------------------------
app.get("/products/add", (req, res) => {
  res.render("add-product-form", { path: "/add", error: "" })
})

// POST create a product
//--------------------------------------------
app.post("/products", upload, (req, res) => {
  const { email, productName } = req.body

  // Multer parsea el file en req.file
  // console.log(req.file)

  if (req.file === "wrong extension") {
    return res.render("add-product-form", {
      path: "/add",
      error: "Archivos válidos: .jpg .jpeg .png",
    })
  }

  if (!email || !productName || !req.file) {
    return res.render("add-product-form", {
      path: "/add",
      error: "Completar todos los campos",
    })
  }
  const newItem = { email, productName, imgFilename: req.file.filename }
  dummy_Database.push(newItem)

  res.render("products", { path: "/products", dummy_Database })
})

// DELETE a product and its respective file
//--------------------------------------------
app.delete("/products/:id", (req, res) => {
  dummy_Database = dummy_Database.filter((item) => item.imgFilename !== req.params.id)
  fs.unlink("./images/" + req.params.id, () => {})

  res.redirect("/products")
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
