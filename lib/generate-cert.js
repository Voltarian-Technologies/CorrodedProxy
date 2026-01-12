// This script generates a self-signed certificate and key for local HTTPS development
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const certDir = path.join(__dirname, '../certs');
const certPath = path.join(certDir, 'cert.pem');
const keyPath = path.join(certDir, 'key.pem');

if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir);
}

try {
  // Try to use Node's crypto module (v19.0.0+)
  const { generateKeyPairSync, createSign, createCertificate } = require('crypto');
  if (generateKeyPairSync && createCertificate) {
    // Node.js 19+ API
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });
    const cert = createCertificate({
      publicKey,
      privateKey,
      subject: { CN: 'localhost' },
      issuer: { CN: 'localhost' },
      days: 365,
    });
    fs.writeFileSync(certPath, cert.cert);
    fs.writeFileSync(keyPath, cert.key);
    console.log('Certificate and key generated using Node.js crypto.');
    process.exit(0);
  }
} catch (e) {
  // Fallback to selfsigned package
}

// Fallback: use selfsigned npm package
try {
  const selfsigned = require('selfsigned');
  const attrs = [{ name: 'commonName', value: 'localhost' }];
  const pems = selfsigned.generate(attrs, {
    days: 365,
    algorithm: 'sha256',
    extensions: [{
      name: 'subjectAltName',
      altNames: [
        { type: 2, value: 'localhost' }, // DNS name
        { type: 7, ip: '127.0.0.1' }    // IP address
      ]
    }]
  });
  fs.writeFileSync(certPath, pems.cert);
  fs.writeFileSync(keyPath, pems.private);
  console.log('Certificate and key generated using selfsigned package with SAN for localhost.');
} catch (e) {
  console.error('Please install the selfsigned package: npm install selfsigned');
  process.exit(1);
}
