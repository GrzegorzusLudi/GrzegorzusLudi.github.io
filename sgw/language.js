

function initlanguage(){
	if(localStorage.getItem('language') == null){
		if(navigator.language == 'pl')
			localStorage.setItem('language','pl')
		else
			localStorage.setItem('language','en')
	}
	var lang = localStorage.getItem('language')
	setLanguage(lang)
}
function languagewise(object){
	var lang = localStorage.getItem('language')

	return object[lang]
}

function languageOfCode(content,lang){
	var newcontent = ''
	var parts = content.slice(1,-1).split('|')
	
	for(var i = 0;i<parts.length;i+=2){
		if(parts[i] == lang){
			newcontent = parts[i+1]
		}
	}
	return newcontent
}
function setLanguage(lang){
	localStorage.setItem('language',lang)
  const children = [] // Type: Node[]
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  var nodes = []
  while(walker.nextNode()){
	  var node = walker.currentNode
	  nodes.push(node)
  }
  for(var i in nodes){
	  var node = nodes[i]
	  var contents
		if(node.oldhtml == undefined){
			contents = node.data
			node.oldhtml = node.data
		} else {
			contents = node.oldhtml
		}
	  
	  
	  while(contents.match(/{[^}]+\|[^}]+(\|[^}]+\|[^}]+)*}/) != null){
		  var firstmatch = contents.match(/{[^}\|]+\|[^}\|]+(\|[^}\|]+\|[^}\|]+)*}/)[0]
		  
		  var newcontent = languageOfCode(firstmatch,lang)
		  contents = contents.replace(firstmatch,newcontent)
	  }
	  node.data = contents
  }
  const buttons = document.querySelectorAll("input[type=button], option");  
  for(var i in buttons){
	var button = buttons[i]
	  
	var contents 
	
		if(button.oldhtml == undefined){
			contents = button.value
			button.oldhtml = button.value
		} else {
			contents = button.oldhtml
		}
		
	if(contents != undefined){
		while(contents.match(/{[^}]+\|[^}]+(\|[^}]+\|[^}]+)*}/) != null){
			var firstmatch = contents.match(/{[^}\|]+\|[^}\|]+(\|[^}\|]+\|[^}\|]+)*}/)[0]
			
			var newcontent = languageOfCode(firstmatch,lang)
			contents = contents.replace(firstmatch,newcontent)
		}
		button.value = contents
	}

  }
}
