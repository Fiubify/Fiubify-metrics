const testingDb = require("../services/dbTesting");
const UserEvent = require("../models/userEvent");
const userMetricsRouter = require("../routes/userMetricsRoutes");
const errorHandlerMiddleware = require("../middleware/errorHandler");

const request = require("supertest");
const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use("/users", userMetricsRouter);

app.use(errorHandlerMiddleware);

const testingEvents = [
  {
    action: "Login",
    type: "Federated",
  },
  {
    action: "Login",
    type: "Email",
  },
  {
    action: "Login",
    type: "Email",
  },
  {
    action: "Signup",
    type: "Federated",
  },
  {
    action: "Signup",
    type: "Email",
  },
  {
    action: "Signup",
    type: "Email",
  },
];

const createTestingUserEvents = async (userEvents) => {
  for (const event of userEvents) {
    const newEvent = new UserEvent(event);
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

describe("GET /users/events/", () => {
  it("Get all events without filter", async () => {
    const response = await request(app).get("/users/events/");

    expect(response.status).toEqual(200);
    expect(response.body.data).toHaveLength(6);
  });

  it("Get all events filtered by action", async () => {
    const response = await request(app)
      .get("/users/events/")
      .query({ action: "Login" });

    expect(response.status).toEqual(200);
    expect(response.body.data).toHaveLength(3);
  });

  it("Get all events filtered by type", async () => {
    const response = await request(app)
      .get("/users/events/")
      .query({ type: "Email" });

    expect(response.status).toEqual(200);
    expect(response.body.data).toHaveLength(4);
  });
});

describe("POST /users/events/", () => {
  it("Create an event", async () => {
    const response = await request(app).post("/users/events/").send({
      action: "Signup",
      type: "Email",
    });

    expect(response.status).toEqual(201);
    const allEvents = await request(app).get("/users/events");
    expect(allEvents.body.data).toHaveLength(7);
  });
});
