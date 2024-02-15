import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { argv, exit } from 'process';

function hashFile(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const sha265 = crypto.createHash('sha256');
  sha265.update(fileBuffer);
  return sha265.digest('hex');
}

function addQualifiedHash(prev, qualifier, hash) {
  if (typeof prev === 'string') {
    return {
      'default': prev,
      [qualifier]: hash
    }
  } else if (!prev) {
    if (!qualifier) {
      return hash;
    } else {
      return {
        [qualifier]: hash
      }
    }
  } else {
    prev[qualifier] = hash;
    return prev;
  }
}

function computeAssetsManifest(assetsSrc, assetsDst) {
  const hashes = {};
  function rec(src, prefix) {
    const files = fs.readdirSync(src, { withFileTypes : true });
    for(const file of files) {
      if (file.isSymbolicLink()) continue;

      const filePath = path.resolve(src, file.name);
      if (file.isDirectory()) {
        const fileName = prefix + '/' + file.name;
        rec(filePath, fileName);
      } else {
        const hash = hashFile(filePath);
        fs.copyFileSync(filePath, path.resolve(assetsDst, hash));

        const ext = path.extname(file.name);
        let fileName = path.basename(file.name, ext);
        let qualifier = '';
        if (fileName.includes('@')) {
           const split = fileName.split('@');
          fileName = split[0]
          qualifier = split[1]
        }
        hashes[prefix + '/' + fileName] = addQualifiedHash(hashes[prefix + '/' + fileName], qualifier, hash)
      }
    }
  }

  rec(assetsSrc, '');

  return Object.entries(hashes).map(([key, val]) => {
    return [key, val];
  })
}

const src = argv.length > 2 && argv[2];
const dest = argv.length > 3 && argv[3];
if (!src) {
  console.error('Specify assets directory as first argument');
  exit(1);
}

if (!dest) {
  console.error('Specify bundle output directory as second argument');
  exit(1);
}

const manifest = computeAssetsManifest(src, path.join(dest, 'assets'));
console.log(JSON.stringify(manifest, null, 2));
