#!/usr/bin/env node

// each object in the array consists of a key which refers to the source and
// the value which is the destination.

var filestocopy = [{
    "../resources/android/notification/drawable-hdpi/ic_notification.png":
    "../platforms/android/res/drawable-hdpi/ic_notification.png"
}, {
    "../resources/android/notification/drawable-mdpi/ic_notification.png":
    "../platforms/android/res/drawable-mdpi/ic_notification.png"
}, {
    "../resources/android/notification/drawable-xhdpi/ic_notification.png":
    "../platforms/android/res/drawable-xhdpi/ic_notification.png"
}, {
    "../resources/android/notification/drawable-xxhdpi/ic_notification.png":
    "../platforms/android/res/drawable-xxhdpi/ic_notification.png"
}, {
    "../resources/android/notification/drawable-xxxhdpi/ic_notification.png":
    "../platforms/android/res/drawable-xxxhdpi/ic_notification.png"
}, {
    "../resources/android/notification/drawable/ic_notification.png":
    "../platforms/android/res/drawable/ic_notification.png"
// splash screens
}, {
    "../resources/android/splash/drawable-land-hdpi-screen.png":
    "../platforms/android/res/drawable-land-hdpi/screen.png"
}, {
    "../resources/android/splash/drawable-land-ldpi-screen.png":
    "../platforms/android/res/drawable-land-ldpi/screen.png"
}, {
    "../resources/android/splash/drawable-land-mdpi-screen.png":
    "../platforms/android/res/drawable-land-mdpi/screen.png"
}, {
    "../resources/android/splash/drawable-land-xhdpi-screen.png":
    "../platforms/android/res/drawable-land-xhdpi/screen.png"
}, {
    "../resources/android/splash/drawable-land-xxhdpi-screen.png":
    "../platforms/android/res/drawable-land-xxhdpi/screen.png"
}, {
    "../resources/android/splash/drawable-land-xxxhdpi-screen.png":
    "../platforms/android/res/drawable-land-xxxhdpi/screen.png"
}, {
    "../resources/android/splash/drawable-port-hdpi-screen.png":
    "../platforms/android/res/drawable-port-hdpi/screen.png"
}, {
    "../resources/android/splash/drawable-port-ldpi-screen.png":
    "../platforms/android/res/drawable-port-ldpi/screen.png"
}, {
    "../resources/android/splash/drawable-port-mdpi-screen.png":
    "../platforms/android/res/drawable-port-mdpi/screen.png"
}, {
    "../resources/android/splash/drawable-port-xhdpi-screen.png":
    "../platforms/android/res/drawable-port-xhdpi/screen.png"
}, {
    "../resources/android/splash/drawable-port-xxhdpi-screen.png":
    "../platforms/android/res/drawable-port-xxhdpi/screen.png"
}, {
    "../resources/android/splash/drawable-port-xxxhdpi-screen.png":
    "../platforms/android/res/drawable-port-xxxhdpi/screen.png"
}, ];

var fs = require('fs');
var path = require('path');

// no need to configure below
var rootdir = process.argv[2];

var checkDirectorySync = function(directory) {  
  try {
    fs.statSync(directory);
  } catch(e) {
    fs.mkdirSync(directory);
  }
}

filestocopy.forEach(function(obj) {
    Object.keys(obj).forEach(function(key) {
        var val = obj[key];
        var srcfile = path.join(rootdir, key);
        var destfile = path.join(rootdir, val);
        console.log("copying "+srcfile+" to "+destfile);
        var destdir = path.dirname(destfile);
        checkDirectorySync(destdir);
        if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
            fs.createReadStream(srcfile).pipe(
               fs.createWriteStream(destfile));
        }
    });
});


/*
*/