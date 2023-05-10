/** Routes for sample app. */

const express = require("express");

const db = require("./fakeDb");
const router = new express.Router();

/** GET /items: get list of shopping items */
router.get("/", function (req, res) {
  return res.json(db.items);
});

/** DELETE /items/[name]: delete item, return {message: Deleted} */
router.delete("/:name", function (req, res) {
  const deleteAtIndex = db.items.findIndex((item) =>
    item.name === req.params.name);

  db.items.splice(deleteAtIndex, 1);

  return res.json({ message: "Deleted" });
});

module.exports = router;
