var webdriverio = require('webdriverio');
var options = {
    desiredCapabilities: {
        browserName: 'firefox'
    }
};

webdriverio
    .remote(options)
    .init()
    .url('https://www.google.com')
    .getTitle().then(function(title) {
    console.log('Title was: ' + title);
})
    .end()
    .catch(function(err) {
        console.log(err);
    });