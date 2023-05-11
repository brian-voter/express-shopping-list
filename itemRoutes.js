/** Routes for sample app. */

const express = require("express");

const db = require("./fakeDb");
const router = new express.Router();

const { BadRequestError, NotFoundError } = require("./expressError");

/** GET /items: get list of shopping items */
router.get("/", function (req, res) {
  return res.json({ items: db.items });
});

/** DELETE /items/[name]: delete item, return {message: Deleted} */
router.delete("/:name", function (req, res) {
  const deleteAtIndex = db.items.findIndex((item) =>
    item.name === req.params.name);

  if (deleteAtIndex === -1) {
    throw new NotFoundError();
  }

  db.items.splice(deleteAtIndex, 1);

  return res.json({ message: "Deleted" });
});

/** POST /items/  add item, return {added: added} */
router.post("/", function (req, res) {
  if (req.body === undefined) {
    throw new BadRequestError();
  }
  let input = req.body;
  db.items.push(input);


  return res.json({ added: input });
});

/** GET /items/:name: return single item { item: item } */
router.get("/:name", function (req, res) {

  let response = db.items.find(item => item.name === req.params.name);

  if (!response) {
    throw new NotFoundError();
  }

  return res.json(response);
});

/** PATCH /items/:name: accept JSON body, modify item, return it */
router.patch("/:name", function (req, res) {
  if (req.body === undefined) {
    throw new BadRequestError();
  }

  const patchItem = db.items.find(item => item.name === req.params.name);

  patchItem.name = req.body.name || patchItem.name;
  patchItem.price = req.body.price || patchItem.price;

  return res.json({ updated: patchItem });

});

module.exports = router;
