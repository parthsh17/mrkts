const request = require('supertest');

// ── Mocks ──────────────────────────────────────────────────────────────────
// All jest.mock() calls MUST come before any require() to be hoisted correctly.

// Mock connect-mongo (no real MongoDB session store)
jest.mock('connect-mongo', () => {
  const store = {};
  return { default: { create: () => store }, create: () => store };
});

// Mock mongoose with a full Schema stub so Article.js model loads cleanly.
// The Schema *instance* needs pre(), index(), virtual(), set() methods.
jest.mock('mongoose', () => {
  const schemaMock = {
    pre: jest.fn().mockReturnThis(),
    index: jest.fn().mockReturnThis(),
    virtual: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    static: jest.fn().mockReturnThis(),
  };
  const SchemaCtor = jest.fn(() => schemaMock);
  SchemaCtor.Types = {
    ObjectId: 'ObjectId',
    Mixed: 'Mixed',
    String,
    Boolean,
  };

  return {
    connect: jest.fn().mockResolvedValue({}),
    connection: { on: jest.fn(), once: jest.fn() },
    Schema: SchemaCtor,
    model: jest.fn(() => ({
      find: jest.fn(),
      findById: jest.fn(),
    })),
  };
});

// Mock session middleware (no real store needed in tests)
jest.mock('express-session', () =>
  jest.fn(() => (req, res, next) => next())
);

// Mock Passport (no real OAuth config needed)
jest.mock('../config/passport', () => ({
  initialize: () => (req, res, next) => next(),
  session: () => (req, res, next) => next(),
}));

// Mock the ingestion worker (no cron jobs in tests)
jest.mock('../workers/ingestionWorker', () => ({
  getLastEnrichedAt: jest.fn().mockReturnValue(null),
}));

const app = require('../app');

// ── Tests ──────────────────────────────────────────────────────────────────

describe('GET /api/health', () => {
  it('returns 200 with success message', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('mrkts API is running.');
    expect(res.body.timestamp).toBeDefined();
  });
});

describe('GET /api/unknown-route', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
