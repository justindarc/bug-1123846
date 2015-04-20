setTimeout(function() {

if (window.location.href.startsWith('app://system')) {
  return;
}

var button = document.createElement('div');
button.textContent = 'Install Add-on (' + window.location.href + ')';
button.style.position = 'fixed';
button.style.left = '0';
button.style.top = '0';
button.style.right = '0';
button.style.height = '50px';
button.style.background = 'rgba(0, 0, 255, 0.5)';
button.style.color = 'white';
button.style.zIndex = '9999999';
document.body.appendChild(button);

button.addEventListener('click', generateAddon);

function generateAddon() {
  var id = 'addon' + Math.round(Math.random() * 100000000);

  var packageMetadata = {
    installOrigin: 'http://gaiamobile.org',
    manifestURL: 'app://' + id + '.gaiamobile.org/update.webapp',
    version: 1
  };
  var packageManifest = {
    name: id,
    package_path: '/application.zip'
  };
  var manifest = {
    name: id,
    role: 'addon',
    origin: 'app://' + id + '.gaiamobile.org'
  };

  var applicationZip = new JSZip();

  var script = `
    console.log('Hello!');
    document.body.style.background = "red !important";
  `

  applicationZip.file('manifest.webapp', JSON.stringify(manifest));
  applicationZip.file('main.js', script);

  var packageZip = new JSZip();
  packageZip.file('metadata.json', JSON.stringify(packageMetadata));
  packageZip.file('update.webapp', JSON.stringify(packageManifest));
  packageZip.file('application.zip', applicationZip.generate({ type: 'arraybuffer' }));

  var package = packageZip.generate({ type: 'arraybuffer' });

  var addonBlob = new Blob([package], {type: 'application/zip'});
  installAddon(addonBlob);
}

function installAddon(blob) {
  navigator.mozApps.mgmt.import(blob)
    .then(function(addon) {

      // Enable the addon by default.
      navigator.mozApps.mgmt.setEnabled(addon, true);
    })
    .catch(function(error) {
      console.error('Unable to install the addon', error, error && error.name);
    });
}

});
