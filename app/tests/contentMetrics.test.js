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
    userUId: "1",
    albumName: "Californication",
    albumId: "66623874wndwnjj221111",
    songName: "Otherside",
    songId: "77723874wndwnjj2211ssa",
  },
  {
    action: "Creation",
    genre: "Jazz",
    tier: "Free",
    userUId: "1",
    albumName: "Californication",
    albumId: "66623874wndwnjj221111",
    songName: "Otherside",
    songId: "77723874wndwnjj2211ssa",
  },
  {
    action: "Listened",
    genre: "Electronic",
    tier: "Free",
    userUId: "1",
    albumName: "Californication",
    albumId: "55523874wndwnjj221111",
    songName: "Otherside",
    songId: "77723874wndwnjj2211ssa",
  },
  {
    action: "Listened",
    genre: "Country",
    tier: "Premium",
    userUId: "2",
    albumName: "Californication",
    albumId: "66623874wndwnjj221111",
    songName: "Otherside",
    songId: "77723874wndwnjj2211ssa",
  },
  {
    action: "Listened",
    genre: "Folklore",
    tier: "Free",
    userUId: "3",
    albumName: "Tango Latino",
    albumId: "77723874wndwnjj221111",
    songName: "Muchachos Esta Noche Me Emborracho",
    songId: "55523874wndwnjj2211ssa",
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
    expect(response.body.data).toHaveLength(5);
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
    expect(response.body.data).toHaveLength(4);
  });

  it("Get all events filtered by user", async () => {
    const response = await request(app)
      .get("/contents/events/")
      .query({ userUId: "1" });

    expect(response.status).toEqual(200);
    expect(response.body.data).toHaveLength(3);
  });
});

describe("GET /contents/events/agg_by_song", () => {
  it("Get qty of times every song was listened", async () => {
    const response = await request(app)
        .get("/contents/events/agg_by_song/");

    expect(response.status).toEqual(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0].count).toEqual(2);
    expect(response.body.data[0]._id.songId).toEqual("77723874wndwnjj2211ssa");
    expect(response.body.data[1].count).toEqual(1);
    expect(response.body.data[1]._id.songName).toEqual("Muchachos Esta Noche Me Emborracho");
  });
});

describe("GET /contents/events/agg_by_album", () => {
  it("Get qty of times every album was listened", async () => {
    const response = await request(app)
        .get("/contents/events/agg_by_album/");

    expect(response.status).toEqual(200);
    expect(response.body.data).toHaveLength(3);
    expect(response.body.data[0].count).toEqual(1);
    expect(response.body.data[1].count).toEqual(1);
    expect(response.body.data[2].count).toEqual(1);
  });
});

describe("POST /contents/events/", () => {
  it("Create an event", async () => {
    const response = await request(app).post("/contents/events/").send({
      action: "Creation",
      genre: "Electronic",
      tier: "Premium",
      userUId: "3",
      albumName: "Tango Latino",
      albumId: "54723874w45gwnjj221111",
      songName: "Muchachos Esta Noche Me Emborracho",
      songId: "09723874wndwnjj2211ssa",
    });

    expect(response.status).toEqual(201);
    const allEvents = await request(app).get("/contents/events/");
    expect(allEvents.body.data).toHaveLength(testingEvents.length + 1);
  });

  it("Create an event without song throw error", async () => {
    const response = await request(app).post("/contents/events/").send({
      action: "Creation",
      genre: "Electronic",
      tier: "Premium",
      user: "3",
      album: "Californication",
    });

    expect(response.status).toEqual(400);
    const allEvents = await request(app).get("/contents/events/");
    expect(allEvents.body.data).toHaveLength(testingEvents.length);
  });
});
