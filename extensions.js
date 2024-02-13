import { basename, dirname, isAbsolute, resolve, extname } from 'path';
import * as fs from 'fs';

function isFile ( file ) {
  try {
    return fs.statSync( file ).isFile();
  } catch ( err ) {
    return false;
  }
}

function isDir ( path ) {
  try {
    return fs.statSync(path).isDirectory();
  } catch (err) {
    return false;
  }
}

function removeSuffix (str, suffix) {
  return str.slice(0, - suffix.length);
}

function addExtensionIfNecessary ( file, extensions ) {
  try {
    let name = basename( file );
    const files = fs.readdirSync( dirname( file ) );

    if ( ~files.indexOf( name ) && isFile( file ) ) return file;
    const ext = extname( file );
    if (extensions.includes(ext) ) {
      name = removeSuffix(name, ext);
      file = removeSuffix(file, ext);
    }

    for ( const ext of extensions ) {
      if ( ~files.indexOf( `${name}${ext}` ) && isFile( `${file}${ext}` ) ) {
        return `${file}${ext}`;
      }
    }

    if (isDir(file)) {
      return addExtensionIfNecessary(`${file}/index`, extensions);
    }
  } catch ( err ) {
    // noop
  }

  return null;
}

// allows importing
// 1. without extension
// 2. with mismatched extensions
// 3. index.js by just specifying folder name
// E.g. if there is a file: src/abcd/index.ts
//   1. import {} from 'abcd/index';
//   2. import {} from 'abcd/index.js';
//   3. import {} from 'abcd';

export default function extensions ({extensions}) {
  if (!extensions || !extensions.length) {
    throw new Error( `Must specify { extensions: [..] } as non-empty array!` );
  }

  return {
    name: 'extensions',

    resolveId ( importee, importer ) {
      // absolute paths are left untouched
      if ( isAbsolute( importee ) ) {
        return addExtensionIfNecessary( resolve( importee ), extensions );
      }

      // if this is the entry point, resolve against cwd
      if ( importer === undefined ) {
        return addExtensionIfNecessary( resolve( process.cwd(), importee ), extensions );
      }

      // external modules are skipped at this stage
      if ( importee[0] !== '.' ) return null;

      return addExtensionIfNecessary( resolve( dirname( importer ), importee ), extensions );
    }
  };
}
