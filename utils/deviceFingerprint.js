export function fingerprintDevice(userAgent, ip) {
  const os = /Windows/i.test(userAgent) ? 'Windows' :
             /Mac/i.test(userAgent) ? 'macOS' :
             /Linux/i.test(userAgent) ? 'Linux' :
             /Android/i.test(userAgent) ? 'Android' :
             /iOS/i.test(userAgent) ? 'iOS' : 'Unknown';

  const browser = /Chrome/i.test(userAgent) ? 'Chrome' :
                  /Firefox/i.test(userAgent) ? 'Firefox' :
                  /Safari/i.test(userAgent) ? 'Safari' : 'Unknown';

  return {
    ip,
    os,
    browser,
    userAgent
  };
}
