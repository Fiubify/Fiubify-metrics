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
    userUId: "729852938nsn2222",
  },
  {
    action: "Login",
    type: "Email",
    userUId: "729852938nsn2221",
  },
  {
    action: "Login",
    type: "Email",
    userUId: "729852938nsn2221",
  },
  {
    action: "Signup",
    type: "Federated",
    userUId: "729852938nsn2222",
  },
  {
    action: "Signup",
    type: "Email",
    userUId: "729852938nsn2221",
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
    expect(response.body.data).toHaveLength(testingEvents.length);
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
    expect(response.body.data).toHaveLength(3);
  });

  it("Get all events filtered by userUId", async () => {
    const response = await request(app)
        .get("/users/events/")
        .query({ userUId: "729852938nsn2222" });

    expect(response.status).toEqual(200);
    expect(response.body.data).toHaveLength(2);
  });
});

describe("POST /users/events/", () => {
  it("Create an event", async () => {
    const response = await request(app).post("/users/events/").send({
      action: "Signup",
      type: "Email",
      userUId: "729852938nsn2223",
    });

    expect(response.status).toEqual(201);
    const allEvents = await request(app).get("/users/events");
    expect(allEvents.body.data).toHaveLength(testingEvents.length + 1);
  });
});
