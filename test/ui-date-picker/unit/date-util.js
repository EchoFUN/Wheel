describe('date utils test suit', function () {
  it('should be have 31 days at January', function() {
    expect(31).toBe(daysOfMonth(0));
  });

  it('should be have 28 days at February', function() {
    expect(28).toBe(daysOfMonth(1));
  });

  it('should be have 29 days in a leap year at February', function() {
    expect(29).toBe(daysOfMonth(2012, 1));
  });

  it('should be have 31 days at March', function() {
    expect(31).toBe(daysOfMonth(2));
  });

  it('should be have 30 days at April', function() {
    expect(30).toBe(daysOfMonth(3));
  });
});