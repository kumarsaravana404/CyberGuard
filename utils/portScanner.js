import net from 'net';

export async function scanPorts(host, startPort = 1, endPort = 1024) {
  const openPorts = [];
  const promises = [];

  for (let port = startPort; port <= endPort; port++) {
    const promise = new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(200); // Fast timeout

      socket.on('connect', () => {
        openPorts.push(port);
        socket.destroy();
        resolve();
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve();
      });

      socket.on('error', () => {
        socket.destroy();
        resolve();
      });

      socket.connect(port, host);
    });
    promises.push(promise);
  }

  await Promise.all(promises);
  return openPorts;
}
