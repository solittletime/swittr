var fs = require('fs');

var files = ['/index.html'];

fs.readFile('sw.js', 'utf-8', function (err, bufsw) {
  if (err) console.log(err);

  fs.readFile('build/asset-manifest.json', 'utf-8', function (err, buf) {
    if (err) console.log(err);

    var manifest = JSON.parse(buf.toString())
    for (var prop in manifest) {
      files.push(manifest[prop]);
    }

    var data = "var urlsToCache = " +
      JSON.stringify(files) + ';\r\n'
      + bufsw.toString();

    fs.writeFile('build/service-worker.js', data, function (err, data) {
      if (err) console.log(err);
      console.log("Successfully added service worker.");
    });
  });
});
