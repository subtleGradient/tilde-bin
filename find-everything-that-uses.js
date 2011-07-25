#!/usr/bin/env node
/*jshint asi:true */
/**
 * @author Thomas Aylott <thomas@subtlegradient.com>
 * @copyright 2011 Sencha, Inc.
 * @url https://gist.github.com/977391f357d547670b20
 */

// Find everything that uses something
// e.g. search-for-everything-that-uses Ext.Sheet

var fs = require('fs')
var ROOT = fs.realpathSync(process.env.EXT_SDK_ROOT)
var CLASS = process.argv[2]// || 'Ext.util.Observable'
var manifest = process.argv[3], PROJECT

if (!ROOT) {
    console.error('You must define the environment variable EXT_SDK_ROOT as the root path of your Ext SDK')
    process.exit(1)
}
if (!CLASS) {
    console.error('Usage: \n\t' + process.argv[1].split('/').reverse()[0] + ' Ext.util.Observable\n')
    process.exit(1)
}

var results = {
    is: function(classManifest){
        // console.log('# '+ classManifest.className +' id '+ CLASS)
        console.log(ROOT + '/' + PROJECT + '/' + classManifest.source)
    },
    extend: function(classManifest){
        // console.log('# '+ classManifest.className +' extends '+ CLASS)
        console.log(ROOT + '/' + PROJECT + '/' + classManifest.source)
    },
    requires: function(classManifest){
        // console.log('# '+ classManifest.className +' requires '+ CLASS)
        console.log(ROOT + '/' + PROJECT + '/' + classManifest.source)
    },
    mixins: function(classManifest){
        // console.log('# '+ classManifest.className +' mixes-in '+ CLASS)
        console.log(ROOT + '/' + PROJECT + '/' + classManifest.source)
    }
}

try{
    PROJECT = manifest.match('platform|extjs|touch')[0]
    manifest = JSON.parse(fs.readFileSync(manifest))
}catch(e){try{
    manifest = JSON.parse(fs.readFileSync(ROOT + '/touch/build/touch-manifest.json'))
    PROJECT = 'touch'
}catch(e){try{
    manifest = JSON.parse(fs.readFileSync(ROOT + '/extjs/build/extjs-manifest.json'))
    PROJECT = 'extjs'
}catch(e){try{
    manifest = JSON.parse(fs.readFileSync(ROOT + '/extjs/build/Ext4-manifest.json'))
    PROJECT = 'extjs'
}catch(e){
}}}}

if (!manifest) {
    console.error('You need to build your manifest.json file')
    process.exit(1)
}
console.error(PROJECT)

manifest.forEach(function(classManifest){
    if (classManifest.className == CLASS) {
        results.is(classManifest)
    }
    if (classManifest.extend == CLASS) {
        results.extend(classManifest)
    }
    if (values(classManifest.mixins).indexOf(CLASS) != -1) {
        results.mixins(classManifest)
    }
    if (classManifest.requires && classManifest.requires.indexOf(CLASS) != -1) {
        results.requires(classManifest)
    }
})

function values(object){
    var values_ = []
    for (var property in object) {
        if (object.hasOwnProperty(property))
            values_.push(object[property])
    }
    return values_
}
