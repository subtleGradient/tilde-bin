function ArgOptions(args){
    /**
     * @author Thomas Aylott <thomas@subtlegradient.com> 
     * @copyright 2011 Sencha Labs Foundation
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

////////////////////////////////////////////////////////////////////////////////
// TEST

var argv = []
var argo = ArgOptions(argv)
console.assert(Object.keys(argo).length == 0)

argv = ['--key','value']
argo = ArgOptions(argv)
console.assert(!!argo.key, 'should set key')
console.assert(argo.key == 'value', 'should set value')

argv = ['howdy','--key','value']
argo = ArgOptions(argv)
console.assert(!!argo.key, 'should set key')
console.assert(argo.key == 'value', 'should set value')
console.assert(argo[0] == 'howdy', 'should keep other args')

argv = ['--key','value','howdy','-y']
argo = ArgOptions(argv)
console.assert(!!argo.key, 'should set key')
console.assert(argo.key == 'value', 'should set value')
console.assert(argo[0] == 'howdy', 'should keep other args')
console.assert(argo.y == true, 'should set booleans')

argv = ['--key','value','howdy','--no-y']
argo = ArgOptions(argv)
console.assert(argo.y == false, 'should allow false booleans')

argv = ['--key','value','howdy','-y','--no-y']
argo = ArgOptions(argv)
console.assert(argo.y == false, 'should override multiple')



