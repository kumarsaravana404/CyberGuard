import { analyzeText } from '../utils/scanner.js';

describe('Scanner Logic', () => {
  test('detects SQL Injection', () => {
    const result = analyzeText('SELECT * FROM users');
    expect(result.containsSQL).toBe(true);
    expect(result.riskScore).toBeGreaterThan(0);
  });

  test('detects XSS', () => {
    const result = analyzeText('<script>alert(1)</script>');
    expect(result.containsXSS).toBe(true);
    expect(result.riskScore).toBeGreaterThan(0);
  });

  test('detects safe text', () => {
    const result = analyzeText('Hello world');
    expect(result.containsSQL).toBe(false);
    expect(result.containsXSS).toBe(false);
    expect(result.riskScore).toBe(0);
  });
});
