const testingDb = require("../services/dbTesting");
const ContentEvent = require("../models/contentEvent");
const contentMetricsRouter = require("../routes/contentMetricsRoutes");
const errorHandlerMiddleware = require("../middleware/errorHandler");

const request = require("supertest");
const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use("/contents", contentMetricsRouter);

app.use(errorHandlerMiddleware);

const testingEvents = [
  {
    action: "Creation",
    genre: "Jazz",
    tier: "Free",
    user: "1",
    album: "Californication",
    song: "Otherside",
  },
  {
    action: "Creation",
    genre: "Jazz",
    tier: "Free",
    user: "1",
    album: "Californication",
    song: "Otherside",
  },
  {
    action: "Listened",
    genre: "Electronic",
    tier: "Free",
    user: "1",
    album: "Californication",
    song: "Otherside",
  },
  {
    action: "Listened",
    genre: "Country",
    tier: "Premium",
    user: "2",
    album: "Californication",
    song: "Otherside",
  },
];

const createTestingUserEvents = async (userEvents) => {
  for (const event of userEvents) {
    const newEvent = new ContentEvent(event);
    await newEvent.save();
  }
};

beforeAll(async () => {
  await testingDb.setUpTestDb();
  await testingDb.dropTestDbCollections();
});

beforeEach(async () => {
  await testingDb.dropTestDbCollections();
  await createTestingUserEvents(testingEvents);
});

afterAll(async () => {
  await testingDb.dropTestDbDatabase();
});

describe("GET /contents/events/", () => {
  it("Get all events without filter", async () => {
    const response = await request(app).get("/contents/events/");

    expect(response.status).toEqual(200);
    expect(response.body.data).toHaveLength(4);
  });

  it("Get all events filtered by action", async () => {
    const response = await request(app)
      .get("/contents/events/")
      .query({ action: "Creation" });

    expect(response.status).toEqual(200);
    expect(response.body.data).toHaveLength(2);
  });

  it("Get all events filtered by genre", async () => {
    const response = await request(app)
      .get("/contents/events/")
      .query({ genre: "Country" });

    expect(response.status).toEqual(200);
    expect(response.body.data).toHaveLength(1);
  });
  it("Get all events filtered by tier", async () => {
    const response = await request(app)
      .get("/contents/events/")
      .query({ tier: "Free" });

    expect(response.status).toEqual(200);
    expect(response.body.data).toHaveLength(3);
  });
  it("Get all events filtered by user", async () => {
    const response = await request(app)
      .get("/contents/events/")
      .query({ user: "1" });

    expect(response.status).toEqual(200);
    expect(response.body.data).toHaveLength(3);
  });
});

describe("POST /contents/events/", () => {
  it("Create an event", async () => {
    const response = await request(app).post("/contents/events/").send({
      action: "Creation",
      genre: "Electronic",
      tier: "Premium",
      user: "3",
      album: "Californication",
      song: "Otherside",
    });

    expect(response.status).toEqual(201);
    const allEvents = await request(app).get("/contents/events/");
    expect(allEvents.body.data).toHaveLength(5);
  });
});
