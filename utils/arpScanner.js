export async function scanNetwork() {
  // Mock data for cloud/demo environment
  return [
    { ip: '192.168.1.1', mac: '00:11:22:33:44:55', vendor: 'Router Manufacturer' },
    { ip: '192.168.1.10', mac: 'AA:BB:CC:DD:EE:FF', vendor: 'Desktop PC' },
    { ip: '192.168.1.15', mac: '11:22:33:44:55:66', vendor: 'Smart Phone' },
    { ip: '192.168.1.20', mac: '66:55:44:33:22:11', vendor: 'IoT Device' }
  ];
}
