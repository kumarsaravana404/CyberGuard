export function analyzeText(text) {
  const sqlPatterns = /(select\s|drop\s|insert\s|update\s|delete\s|union\s|--|;)/i;
  const xssPatterns = /<script>|javascript:|on\w+=/i;
  const suspiciousSymbols = /[{}$><]/;

  const containsSQL = sqlPatterns.test(text);
  const containsXSS = xssPatterns.test(text);
  const containsSuspiciousSymbols = suspiciousSymbols.test(text);

  let riskScore = 0;
  if (containsSQL) riskScore += 40;
  if (containsXSS) riskScore += 40;
  if (containsSuspiciousSymbols) riskScore += 20;
  
  // Cap risk score at 100
  riskScore = Math.min(100, riskScore);

  return {
    length: text.length,
    containsSQL,
    containsXSS,
    containsSuspiciousSymbols,
    riskScore
  };
}
