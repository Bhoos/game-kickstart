import http from 'http';
import fs from 'fs';
import path from 'path';
import * as rollup from 'rollup';
import rollupConfig from './rollup.config.js';

/// FILE SERVER
http.createServer(function (request, response) {
  console.log(Date.now() + ' -- ', request.url);

  var filePath = './out/' + request.url;
  if (filePath == './')
    filePath = './index.html';

  var extname = path.extname(filePath);
  var contentType = 'text/html';
  switch (extname) {
  case '.js':
    contentType = 'text/javascript';
    break;
  case '.json':
    contentType = 'application/json';
    break;
  }

  fs.readFile(filePath, function(error, content) {
    if (error) {
      response.writeHead(500);
      response.end(`Failed to server file ${request.url}; code: ${error.code}\n`);
    }
    else {
      response.writeHead(200, { 'Content-Type': contentType });
      response.end(content, 'utf-8');
    }
  });

}).listen(8000);
console.log('Server running at http://127.0.0.1:8000/');

/// ROLLUP WATCH

const watcher = rollup.watch(rollupConfig);

watcher.on('event', event => {
  // event.code can be one of:
  //   START        — the watcher is (re)starting
  //   BUNDLE_START — building an individual bundle
  //                  * event.input will be the input options object if present
  //                  * event.output contains an array of the "file" or
  //                    "dir" option values of the generated outputs
  //   BUNDLE_END   — finished building a bundle
  //                  * event.input will be the input options object if present
  //                  * event.output contains an array of the "file" or
  //                    "dir" option values of the generated outputs
  //                  * event.duration is the build duration in milliseconds
  //                  * event.result contains the bundle object that can be
  //                    used to generate additional outputs by calling
  //                    bundle.generate or bundle.write. This is especially
  //                    important when the watch.skipWrite option is used.
  //                  You should call "event.result.close()" once you are done
  //                  generating outputs, or if you do not generate outputs.
  //                  This will allow plugins to clean up resources via the
  //                  "closeBundle" hook.
  //   END          — finished building all bundles
  //   ERROR        — encountered an error while bundling
  //                  * event.error contains the error that was thrown
  //                  * event.result is null for build errors and contains the
  //                    bundle object for output generation errors. As with
  //                    "BUNDLE_END", you should call "event.result.close()" if
  //                    present once you are done.
  // If you return a Promise from your event handler, Rollup will wait until the
  // Promise is resolved before continuing.
  if (event.code === 'BUNDLE_START') {
    console.log('\x1B[2J');
  } else if (event.code === 'BUNDLE_END') {
    console.log('Bundling Complete');
  } else if (event.code === 'ERROR') {
    console.error('Error:', event.error);
  }
});

// This will make sure that bundles are properly closed after each run
watcher.on('event', ({ result }) => {
  if (result) {
    result.close();
  }
});
