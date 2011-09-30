#!/usr/bin/env phantomjs
/*jshint asi:true, laxbreak:true*/
/*
    @author Thomas Aylott <thomas.aylott@sencha.com>
    @copyright 2011 Sencha Labs Foundation
*/

var logTypes = "log warn info error debug".toUpperCase().split(' ')

;(function(){

for (var i = logTypes.length; --i >= 0;){
    logTypes[logTypes[i]] = true;
}

}())


var LOG_LEVEL = 1, TIMEOUT = 1e3, EXITON = /^DONE!$/

setTimeout(function(){
    
    runPage(ArgOptions(phantom.args))
    
},0);

////////////////////////////////////////////////////////////////////////////////

function runPage(config){
    
    config.url = config.url || config[0] || '../extra-tools/lib/discover-loader-history.touch.html?Ext.Button'
    if (config.url.charAt(0) == '.') config.url = phantom.libraryPath + '/' + config.url
    if (config.url.indexOf('://') == -1) config.url = 'file://' + config.url
    
    if (config.debug) LOG_LEVEL = 4
    if (config.timeout) TIMEOUT = Number(config.timeout)
    if (config.exiton) EXITON = RegExp(config.exiton)
    
    var exitEventuallyTimer
    function ping(){
        // debug('ping')
        if (!onJSReady.fired && isJSReady()) onJSReady()
        clearTimeout(exitEventuallyTimer)
        exitEventuallyTimer = setTimeout(exit, TIMEOUT)
    }
    
    function isJSReady(){
        return page.evaluate(Function('return String(location)')) != 'about:blank'
    }
    
    function onJSReady(){
        onJSReady.fired = true
        debug('onJSReady')
        
        page.evaluate(function(){
            
            console._log = console.log
            
            console.log = function(){
                var data = {type:'LOG', data:arg(arguments)}
                if (typeof Ext == 'object' && Ext.getDisplayName) {
                    data.stack = []
                    var caller = arguments.callee
                    while (data.stack.length < 10 && caller && (caller = caller.caller)){
                        data.stack.unshift(Ext.getDisplayName(caller))
                        if (/(?:fireEvent|continueFireEvent)$/.test(data.stack[0])) data.stack.splice(1,0, Array.prototype.slice.call(caller.arguments)[0])
                        if (/^(?:layout|fireEvent|continueFireEvent)$/.test(data.stack[0].split('#')[1])) break
                    }
                    data.stack.reverse()
                    // data.stack = [
                    //     arguments.callee.caller.$owner && arguments.callee.caller.$owner.$className
                    //     // ,Ext.getDisplayName(arguments.callee.caller.caller.caller.caller)
                    //     ,Ext.getDisplayName(arguments.callee.caller.caller.caller)
                    //     ,Ext.getDisplayName(arguments.callee.caller.caller)
                    //     ,Ext.getDisplayName(arguments.callee.caller)
                    // ]
                }
                log(data)
            }
            console.warn = function(){
                log({type:'WARN', data:arg(arguments)})
            }
            console.error = function(){
                log({type:'ERROR', data:arg(arguments)})
            }
            
            function arg(args){
                if (args.length == 1) return args[0]
                return Array.prototype.slice.call(args)
            }
            
            function log(){
                var msg = arguments[0]
                if (arguments.length > 1) {
                    msg = Array.prototype.slice.call(arguments)
                }
                if (typeof msg != 'string') msg = JSON.stringify(msg)
                console._log(msg)
            }
            
        })
        
    }
    
    function exit(){
        if (!opened) {
            return;
        }
        debug('exit')
        phantom.exit()
    }
    
    ////////////////////////////////////////////////////////////////////////////////
    
    var page = new WebPage
    
    page.onLoadStarted = function(){
        debug('onLoadStarted')
        ping()
    }
    page.onConsoleMessage = function(){
        log.apply(this, arguments)
        ping()
    }
    page.onAlert = function(msg){
        log('[ALERT] ' + JSON.stringify(msg))
        ping()
    }
    page.onLoadFinished = function(){
        debug('onLoadFinished')
        ping()
    }
    page.onResourceRequested = function(req){
        debug('onResourceRequested: ' + req.url)
        ping()
    }
    page.onResourceReceived = function(req){
        debug('onResourceReceived: ' + req.url)
        ping()
    }
    
    var opened
    page.open(config.url, function(){
        opened = true
        debug('opened ' + config.url)
    })
}

////////////////////////////////////////////////////////////////////////////////

function log(msg, line, file){
    try {
        msg = JSON.parse(msg)
    } catch(e){}
    
    if (EXITON.test(msg) || EXITON.test(msg.data)) setTimeout(phantom.exit,0)
    
    if (logTypes[msg.type] && 'data' in msg && Object.keys(msg).length == 2) msg = msg.data
    
    if (typeof msg != 'string') msg = JSON.stringify(msg)
    if (line && file) msg += ' — '+ file +':'+ line
    
    console.log(msg)
}
function debug(msg){
    LOG_LEVEL >= 4 && log('[DEBUG] ' + JSON.stringify(msg))
}
function info(msg){
    LOG_LEVEL >= 3 && log('[INFO] ' + JSON.stringify(msg))
}
function warn(msg){
    LOG_LEVEL >= 2 && log('[WARN] ' + JSON.stringify(msg))
}
function error(msg){
    LOG_LEVEL >= 1 && log('[ERROR] ' + JSON.stringify(msg))
}

////////////////////////////////////////////////////////////////////////////////

function ArgOptions(args){
    /**
     * @author Thomas Aylott <thomas@subtlegradient.com> 
     * @copyright 2011 Sencha, Inc.
     */
    args = args.slice(0) // clone, for safety
    var argo = []
    var isArg = /^--?(no-)?(?=\w)(.*)$/i
    var lastArgKey, thisArgKey
    for (var index=0; index < args.length; index++) {
        
        if (thisArgKey = args[index].match(isArg)) {
            argo[thisArgKey[2]] = !thisArgKey[1]
        }
        else if (lastArgKey) {
            argo[lastArgKey] = args[index]
        }
        else {
            argo.push(args[index])
        }
        lastArgKey = thisArgKey && thisArgKey[2]
    }
    return argo
}
