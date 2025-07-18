const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// --- Conexión a MongoDB ---
// Usa una variable de entorno para la IP del servidor de DB, con un fallback para pruebas locales.
const dbConnectionString = process.env.DB_CONNECTION_STRING || "mongodb://localhost:27017/todolistDB";
mongoose.connect(dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });

// --- Modelo de Datos ---
const itemsSchema = {
  name: String
};
const Item = mongoose.model("Item", itemsSchema);

// --- Rutas de la Aplicación ---
app.get("/", function(req, res) {
  Item.find({}, function(err, foundItems) {
    res.render("index", { listTitle: "Hoy", newListItems: foundItems });
  });
});

app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function(err) {
    if (!err) {
      console.log("Borrado exitoso.");
      res.redirect("/");
    }
  });
});

// --- Iniciar Servidor ---
let port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`Servidor iniciado en el puerto ${port}`);
});