

function hashCode(string) {
  var hash = 0, i, chr;
  if (string.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr   = string.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
    function getArrayIfTrue(result){
        var acc = []
        while(result.type == "Data" && result.identifier == ':' && result.ptrs && result.ptrs.length == 2){
            acc.push(result.ptrs[0].dereference())
            result = result.ptrs[1].dereference()
        }
        if(result.identifier != '[]')
            return null
        else
            return acc
    }
    //showResult(haskell.interpreter.eval(haskell.parser.parse('{enemy White}').ast.expr,env))
    function showResult(result){
        if (result.type == "Data") {
            var str = result.identifier;
            var op = " ";

            if (str == "I#") {
                str = "";
            } else if (str == ":") {
                str = "";
                op = ":";
            }
            
            var array = getArrayIfTrue(result)

            if(array != null){
                var first = true;
                var str = '['
                for(var i in array){
                    if (first) {
                        var res = showResult(array[i]);
                        if (typeof res.str != "undefined") 
                            res = res.str;
                        first = false;
                        str += res
                    } else {
                        var res = showResult(array[i]);
                        if (typeof res.str != "undefined")
                            res = res.str;
                        str = str + ',' + res;
                    }
                }
                return { str: str + ']', isList: true }
            }
            if (result.ptrs) {
                var first = true;
                for (var i = 0; i < result.ptrs.length; i++) {
                    if (str.length == 0 && first) {
                    str = showResult(result.ptrs[i].dereference());
                    if (typeof str.str != "undefined") 
                        str = str.str;
                    first = false;
                    } else {
                    var res = showResult(result.ptrs[i].dereference());
                    if (typeof res.str != "undefined")
                        res = res.str;
                    str = str + op + res;
                    }
                }
                if(result.ptrs.length > 1)
                str = '(' + str + ')'
            }
            return { str: str, isList: op == "," };
        }
        if (result.force) {
            return result.force();
        } else if (result.ptrs) {
            return result.ptrs[0].dereference();
        } else {
            return result; 
        }
    }
    function showResult_(result) {
        if (result.type == "Data") {
            var str = result.identifier;
            var op = " ";
                
            console.log('A: '+str)
            if (str == "I#") {
                str = "";
            } else if (str == ":") {
                str = "";
                op = ",";
            }
                
            if (result.ptrs) {
                var first = true;
                for (var i = 0; i < result.ptrs.length; i++) {
                    if (str.length == 0 && first) {
                    str = showResult(result.ptrs[i].dereference());
                    if (typeof str.str != "undefined") 
                        str = str.str;
                    first = false;
                    } else {
                    var res = showResult(result.ptrs[i].dereference());
                    if (typeof res.str != "undefined")
                        res = res.str;
                    str = str + op + res;
                    }
                }
            }
            return { str: str, isList: op == "," };
        } if (result.force) {
            return result.force();
        } else if (result.ptrs) {
            return result.ptrs[0].dereference();
        } else {
            return result; 
        }
    }
    function evaluateHaskell(line, env)
    {
        var line_ = '{' + line + '}';
        ast = haskell.parser.parse(line_).ast;
        if (ast == undefined){
            return "Syntax Error";
        }
	if (ast.type == "DoExpr") {
	    ast = new haskell.ast.DoExpr(new haskell.ast.Application(new haskell.ast.VariableLookup("hijiOutputLine#"), ast.expr));
	}
	var doexpr  = new haskell.ast.Do([ast,
					  new haskell.ast.DoExpr(new haskell.ast.Primitive(
					       function(env) {
						   return new haskell.interpreter.Data("IO", [new haskell.interpreter.HeapPtr(env)]);
					       }
											   ))]);
        console.log("4444444");
        console.log("%o", doexpr);
        console.log("4444444");
        var res = haskell.interpreter.eval(doexpr, env);
        console.log(3);
        console.log(res);
	return res.ptrs[0].dereference();
    };
        // load a module
        function load_module(module){
            is_module_loaded = false;
            jQuery.ajax({
                async : false,
                url : module,
                success: function(prelude_data){
                    console.log(prelude_data);
                    try {
                            var ast = haskell.parser.parse(prelude_data);
                            console.log("%o", ast);
                            if (ast.ast == undefined) {
                                console.log("Syntax Error");
                            }
                        else {
                            haskell.interpreter.prepare(ast.ast, env);
                            is_module_loaded = true;
                        }
                    } catch(e) {
                        console.log("%o", e);
                   }
                }
            });
        }
    function load_text(text){
        is_module_loaded = false;
        try {
            var ast = haskell.parser.parse(text);
            console.log("%o", ast);
            if (ast.ast == undefined) {
                console.log("Syntax Error");
            }
            else {
                haskell.interpreter.prepare(ast.ast, env);
                is_module_loaded = true;
            }
        } catch(e) {
            console.log("%o", e);
        }
    }

    function init(){
        var moduleInput = document.getElementById('module-textarea')
        //var compileButton = document.getElementById('compile-button')
        var executeButton = document.getElementById('execute-button')
        var consoleInput = document.getElementById('console')
        var hiddenOutput = document.getElementById('hidden-output')
        var output = document.getElementById('output')
        
        printArea = output
        //compileButton.addEventListener('click',function(){
        //})
        hash = null
        var attributeSelect = new AttributeSelect(document.getElementById('attribute-select'))
        boardElements = new BoardElements(document.getElementById('structure'), document.getElementById('board'),attributeSelect)
        
        if(hash != hashCode(moduleInput.value)){
            env = new haskell.interpreter.RootEnv();
            haskell.primitives.init(env);
            haskell.primitives.initHiji(env);
            
            load_module('static/external-js/haskell-interpreter/hs/Prelude.hs');
            load_text(moduleInput.value);
            modules[0] = "Prelude";
            hash = hashCode(moduleInput.value)
            boardElements.updateDiv()
            boardElements.setHaskellFunction(function(code){
                return showResult(haskell.interpreter.eval(haskell.parser.parse('{'+code+'}').ast.expr,env))
            })
        }
        
        
        
        executeButton.addEventListener('click',function(){
            var command = consoleInput.value
            
            if(hash != hashCode(moduleInput.value)){
                env = new haskell.interpreter.RootEnv();
                haskell.primitives.init(env);
                haskell.primitives.initHiji(env);
                
                load_module('static/external-js/haskell-interpreter/hs/Prelude.hs');
                load_text(moduleInput.value);
                modules[0] = "Prelude";
                hash = hashCode(moduleInput.value)
                boardElements.updateDiv()
                boardElements.setHaskellFunction(function(code){
                    return showResult(haskell.interpreter.eval(haskell.parser.parse('{'+code+'}').ast.expr,env))
                })

            }
            try {
                //env = evaluateHaskell(command, env);
                console.log(command)
                
                var result = showResult(haskell.interpreter.eval(haskell.parser.parse('{'+command+'}').ast.expr,env))
                /*
                var i = 0
                while(result.type == 'Closure' && i<10){
                    result = result.force()
                    i++
                }
                console.log(result)*/
                //.force().force().ptrs[0].dereference()
        
                    /*var ast = haskell.parser.parse('{ '+command+' }').ast
                	var doexpr  = new haskell.ast.Do([ast,
					  new haskell.ast.DoExpr(new haskell.ast.Primitive(
					       function(env) {
						   return new haskell.interpreter.Data("IO", [new haskell.interpreter.HeapPtr(env)]);
					       }
											   ))]);
                var res = haskell.interpreter.eval(doexpr, env);
                var result = res.ptrs[0].dereference();
*/
                
        printArea.innerHTML = result.str

                console.log("%o", env);
            } catch(e){
                printArea.innerHTML = e.message
            }

            
        })
    }
    init()

