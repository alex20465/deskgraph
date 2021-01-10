import * as selfsigned from 'selfsigned';
import * as mkdirp from 'mkdirp';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';

interface GeneratedSelfSignedResult {
  privateKey: string;
  publicKey: string;
  cert: string;
  fingerprint: string;
  clientPrivate: string;
  clientPublic: string;
  clientCert: string;
}

function getFingerprint(cert: string) {
  const baseString = cert.match(
    /-----BEGIN CERTIFICATE-----\s*([\s\S]+?)\s*-----END CERTIFICATE-----/i,
  );

  const rawCert = Buffer.from(baseString[1], 'base64');
  const sha256sum = crypto.createHash('sha256').update(rawCert).digest('hex');
  return sha256sum.toUpperCase().replace(/(.{2})(?!$)/g, '$1:');
}

export function generate(): GeneratedSelfSignedResult {
  const result = selfsigned.generate(null, {
    clientCertificate: true,
  });

  return {
    privateKey: result.private,
    publicKey: result.public,
    cert: result.cert,
    fingerprint: getFingerprint(result.cert),
    clientPrivate: result.clientprivate,
    clientPublic: result.clientpublic,
    clientCert: result.clientcert,
  } as GeneratedSelfSignedResult;
}

export function get(): GeneratedSelfSignedResult {
  const configDir = path.join(os.homedir(), '.config', 'deskgraph');
  const selfsignedFile = path.join(
    os.homedir(),
    '.config',
    'deskgraph',
    'selfsigned',
  );
  if (fs.existsSync(configDir) === false) {
    fs.mkdirSync(configDir);
  }

  if (fs.existsSync(selfsignedFile) === false) {
    const result = generate();
    fs.writeFileSync(selfsignedFile, JSON.stringify(result, null, 4), {
      encoding: 'ascii',
    });
  }

  const res = fs.readFileSync(selfsignedFile, {
    encoding: 'ascii',
  });

  return JSON.parse(res);
}
