#!/usr/bin/env node

// each object in the array consists of a key which refers to the source and
// the value which is the destination.


/*
var filestocopy = [{
    "../resources/android/notification/drawable-hdpi/ic_stat_ic_notification.png":
    "../platforms/android/res/drawable-hdpi/ic_stat_ic_notification.png"
}, {
    "../resources/android/notification/drawable-hdpi-v11/ic_stat_ic_notification.png":
    "../platforms/android/res/drawable-hdpi-v11/ic_stat_ic_notification.png"
}, {
    "../resources/android/notification/drawable-mdpi/ic_stat_ic_notification.png":
    "../platforms/android/res/drawable-mdpi/ic_stat_ic_notification.png"
}, {
    "../resources/android/notification/drawable-mdpi-v11/ic_stat_ic_notification.png":
    "../platforms/android/res/drawable-mdpi-v11/ic_stat_ic_notification.png"
}, {
    "../resources/android/notification/drawable-xhdpi/ic_stat_ic_notification.png":
    "../platforms/android/res/drawable-xhdpi/ic_stat_ic_notification.png"
}, {
    "../resources/android/notification/drawable-xhdpi-v11/ic_stat_ic_notification.png":
    "../platforms/android/res/drawable-xhdpi-v11/ic_stat_ic_notification.png"
}, {
    "../resources/android/notification/drawable-xxhdpi/ic_stat_ic_notification.png":
    "../platforms/android/res/drawable-xxhdpi/ic_stat_ic_notification.png"
}, {
    "../resources/android/notification/drawable-xxhdpi-v11/ic_stat_ic_notification.png":
    "../platforms/android/res/drawable-xxhdpi-v11/ic_stat_ic_notification.png"
}, {
    "../resources/android/notification/drawable-xxxhdpi/ic_stat_ic_notification.png":
    "../platforms/android/res/drawable-xxxhdpi/ic_stat_ic_notification.png"
}, {
    "../resources/android/notification/drawable-xxxhdpi-v11/ic_stat_ic_notification.png":
    "../platforms/android/res/drawable-xxxhdpi-v11/ic_stat_ic_notification.png"
}, ];
*/
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