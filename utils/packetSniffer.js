export function startSniffing(callback) {
  // Simulate traffic
  const protocols = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'DNS'];
  const sources = ['192.168.1.10', '192.168.1.15', '10.0.0.5'];
  const destinations = ['8.8.8.8', '1.1.1.1', '192.168.1.1'];

  const interval = setInterval(() => {
    const packet = {
      id: Math.floor(Math.random() * 10000),
      timestamp: new Date().toISOString(),
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      destination: destinations[Math.floor(Math.random() * destinations.length)],
      size: Math.floor(Math.random() * 1500)
    };
    callback(packet);
  }, 1000);

  return () => clearInterval(interval);
}
