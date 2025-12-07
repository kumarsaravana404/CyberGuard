export function checkFirewallRules(rules) {
  const issues = [];
  
  rules.forEach((rule, index) => {
    if (rule.action === 'ALLOW' && rule.port === 'ANY' && rule.source === 'ANY') {
      issues.push({
        id: index,
        severity: 'HIGH',
        message: 'Rule allows ANY traffic on ANY port from ANY source. Highly insecure.'
      });
    }
    if (rule.action === 'ALLOW' && rule.port === 23) {
       issues.push({
        id: index,
        severity: 'MEDIUM',
        message: 'Telnet (port 23) is allowed. Use SSH instead.'
      });
    }
  });

  return issues;
}
