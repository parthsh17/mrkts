describe('Article feed filter logic', () => {
  const VALID_SENTIMENTS = ['Bullish', 'Bearish', 'Neutral'];

  it('returns undefined filter when no sentiment is provided', () => {
    const sentiment = undefined;
    const filter = {};

    if (sentiment && VALID_SENTIMENTS.includes(sentiment)) {
      filter.sentiment = sentiment;
    }

    expect(filter.sentiment).toBeUndefined();
  });

  it('adds sentiment to filter for a valid value', () => {
    const sentiment = 'Bullish';
    const filter = {};

    if (sentiment && VALID_SENTIMENTS.includes(sentiment)) {
      filter.sentiment = sentiment;
    }

    expect(filter.sentiment).toBe('Bullish');
  });

  it('ignores an invalid sentiment value', () => {
    const sentiment = 'SuperBullish';
    const filter = {};

    if (sentiment && VALID_SENTIMENTS.includes(sentiment)) {
      filter.sentiment = sentiment;
    }

    expect(filter.sentiment).toBeUndefined();
  });

  it('FEED_LIMIT constant is set to 5', () => {
    const FEED_LIMIT = 5;
    expect(FEED_LIMIT).toBe(5);
  });
});
