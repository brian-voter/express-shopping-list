const request = require("supertest");

const app = require("./app");
const db = require("./fakeDb");
const { describe } = require("node:test");

const testItems = [
    { name: "popsicle", price: 1.45 },
    { name: "cheerios", price: 3.40 }
];

beforeEach(function () {
    // replace db contents with a copy of our testItems
    db.items.splice(0, db.items.length, ...testItems.slice());
});

afterAll(function () {

});

describe("GET /items", function () {
    test("matches test items", async function () {
        const resp = await request(app).get("/items");
        expect(resp.body).toEqual({ items: testItems });
    });
});

describe("GET /item", function () {
    test("GET /items/<name>", async function () {
        const resp = await request(app).get("/items/popsicle");
        expect(resp.body).toEqual({ name: "popsicle", price: 1.45 });
    });

    test("GET /items/<invalid_name>", async function () {
        const resp = await request(app).get("/items/an_invalid_item");
        expect(resp.body).toEqual({
            error: {
                message: "Not Found",
                status: 404,
            }
        });
    });
});

describe("DELETE /items", function () {

    test("DELETE /items/<name>", async function () {
        expect(db.items.length).toEqual(2);
        const resp = await request(app).delete("/items/popsicle");
        expect(resp.body).toEqual({ message: "Deleted" });
        expect(db.items.length).toEqual(1);
    });

    test("DELETE /items/<invalid_name>", async function () {
        expect(db.items.length).toEqual(2);
        const resp = await request(app).delete("/items/invalid_item");
        expect(resp.body).toEqual({
            error: {
                message: "Not Found",
                status: 404,
            }
        });
        expect(db.items.length).toEqual(2);
    });

});

describe("POST /items", function () {
    test("POST /items/", async function () {
        expect(db.items.length).toEqual(2);

        const resp = await request(app).post("/items")
            .send({
                name: "oreos",
                price: "7.00"
            });

        expect(resp.body).toEqual({
            added: {
                name: "oreos",
                price: "7.00"
            }
        });
        expect(db.items.length).toEqual(3);
    });
});


describe("PATCH /items", function () {
    test("PATCH /items/cheerios", async function () {
        expect(db.items.length).toEqual(2);

        const resp = await request(app).patch("/items/cheerios")
            .send({
                name: "cheerios",
                price: "999.00"
            });

        expect(resp.body).toEqual({
            updated: {
                name: "cheerios",
                price: "999.00"
            }
        });
        expect(db.items.length).toEqual(2);
    });
});

test("PATCH /items/cheerios", async function () {
    expect(db.items.length).toEqual(2);

    console.log("\n\n\nITEMS: ", db.items)

    const resp = await request(app).patch("/items/popsicle")
        .send({
            name: "lucky charms",
        });

    expect(resp.body).toEqual({
        updated: {
            name: "lucky charms",
            price: 1.45
        }
    });
    expect(db.items.length).toEqual(2);
});