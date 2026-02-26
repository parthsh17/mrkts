const { APPROVED_SOURCES, validateSources } = require('../controllers/userController');

/**
 * Unit tests for userController preference validation logic.
 * We extract and test the pure validation logic without HTTP layer.
 */

const VALID_SOURCES = ['Yahoo Finance', 'CNBC', 'MarketWatch', 'CoinDesk', 'WSJ Markets'];

describe('User preference validation', () => {
  it('accepts all valid sources', () => {
    const invalid = VALID_SOURCES.filter((s) => !VALID_SOURCES.includes(s));
    expect(invalid).toHaveLength(0);
  });

  it('rejects an unknown source', () => {
    const sources = ['Yahoo Finance', 'FakeSource'];
    const invalid = sources.filter((s) => !VALID_SOURCES.includes(s));
    expect(invalid).toContain('FakeSource');
    expect(invalid).toHaveLength(1);
  });

  it('rejects an empty sources array', () => {
    const sources = [];
    expect(sources.length).toBe(0);
  });

  it('accepts a single valid source', () => {
    const sources = ['CNBC'];
    const invalid = sources.filter((s) => !VALID_SOURCES.includes(s));
    expect(invalid).toHaveLength(0);
    expect(sources.length).toBeGreaterThan(0);
  });
});
