


class BoardElement {
    constructor(attributeSelect,boardElements,parent){
        this.subelements = []
        this.attributes = {}
        this.divElement = null
        this.haskellResolver = null
        this.attributeSelect = attributeSelect
        this.boardElements = boardElements
        this.parent = parent
        
        this.boardWidthReal = 500
        this.boardWidth = 100
    }
    constructAttributes(object){
        this.attributes = Object.assign(this.attributes, object)
    }
    getNewResolvers(resolvers){
        let t = this
        return t.haskellResolver ? resolvers.concat([t.haskellResolver]) : resolvers.slice()
    }
    constructLink(text,action){
        var link = document.createElement('a')
        link.href = '#'
        link.innerHTML = ' ['+text+']'
        link.onclick = action
        link.style.fontSize = '10pt'
        return link
    }
    renderList(){
        let t = this
        var div = document.createElement('div')
        var haskellResolverHTML = this.haskellResolver ? this.haskellResolver : '<i>no resolver</i>'
        div.innerHTML = this.typeName + ' : <span class="greentext">' + haskellResolverHTML + '</span>'
        div.appendChild(this.constructLink('edit resolver',()=>{t.editResolver()}))
        div.appendChild(this.constructLink('add attributes',()=>{t.addAttributes()}))
        if(this.parent != null){
            let removeButton = this.constructLink('remove',()=>{t.parent.removeChild(this)})
            removeButton.style.color = '#f00'
            div.appendChild(removeButton)
        }
        return div
    }
    removeChild(child){
        this.subelements = this.subelements.filter(x=>x!=child)
        this.boardElements.updateDiv()
    }
    renderAttribute(key){
        let t = this
        var div = document.createElement('div')
        div.style.color = '#dddddd'
        div.style.fontSize = '9pt'

        div.innerHTML = key + ' : ' + this.attributes[key]
        div.appendChild(this.constructLink('edit value',()=>{t.editAttribute(key)}))
        //div.appendChild(this.constructLink('edit resolver',()=>{alert()}))
        //div.appendChild(this.constructLink('add attributes',()=>{t.addAttributes()}))
        return div
    }
    editResolver(){
        var value = prompt('Put your resolver here:','')
        this.haskellResolver = value.trim().length == 0 ? null : value.trim()
        this.boardElements.updateDiv()
    }
    addAttributes(){
        this.attributeSelect.select(this)
    }
    addSubelement(key,attributeSelect){
        var newElement = this.getNewElements()[key]['construct'](attributeSelect)
        this.subelements.push(newElement)
    }
    tryAddCoords(coords){
        //TODO
        return []
    }
    createDiv(){
        var div = document.createElement('div')
        div.style.position = 'absolute'
        div.style.display = 'block'
        return div
    }
    getResolverExpression(resolvers){
        var resolverExpression = 'let state = init in '
        for(var i in resolvers){
            resolverExpression += 'let ' + resolvers[i] + ' in '
        }
        return resolverExpression
    }
}

class BlockElement extends BoardElement {
    constructor(attributeSelect,boardElements,parent){
        super(attributeSelect,boardElements,parent)
        this.typeName = "TextPlaceholder"
        this.constructAttributes({
            coords:[10,10,40,40]
        })
    }
    tryAddCoords(coords){
        if(!/^\s*(\s*[0-9]+\s*,){3}\s*[0-9]+\s*\s*$/.test(coords)){
            alert('not 4-element array')
            return
        }
        this.attributes['coords'] = JSON.parse('['+coords+']')
    }
    getAttributes(){
        let t = this
        return {
            coords:{action:(coords)=>{t.tryAddCoords(coords)}}
        }
    }
    editAttribute(key){
        var value = prompt('Insert value',this.attributes[key])
        if(value != undefined)
            this.getAttributes()[key]['action'](value)
        this.boardElements.updateDiv()
    }
    getNewElements(){
        return new Object()
    }
    render(board,resolvers){
        var div = this.createDiv()
        div.style.left = this.attributes['coords'][0] / this.boardWidth * this.boardWidthReal + 'px'
        div.style.top = this.attributes['coords'][1] / this.boardWidth * this.boardWidthReal + 'px'
        div.style.width = this.attributes['coords'][2] / this.boardWidth * this.boardWidthReal + 'px'
        div.style.height = this.attributes['coords'][3] / this.boardWidth * this.boardWidthReal + 'px'
        
        div.style.border = '1px solid white'
        
        board.appendChild(div)
    }
}

class TextPlaceholder extends BlockElement {
    constructor(attributeSelect,boardElements,parent){
        super(attributeSelect,boardElements,parent)
        this.typeName = "TextPlaceholder"
        this.constructAttributes({
            text:'Sample text',
            codeValue:null
        })
    }
    tryChangeCodeValue(text){
        this.attributes['codeValue'] = text.trim()
    }
    tryChangeText(text){
        this.attributes['text'] = text.trim()
    }
    getAttributes(){
        let t = this
        return Object.assign(super.getAttributes(),{
            text:{action:(text)=>{t.tryChangeText(text)}},
            codeValue:{action:(text)=>{t.tryChangeCodeValue(text)}},
        })
    }
    editAttribute(key){
        var value = prompt('Insert value',this.attributes[key])
        if(value != undefined)
            this.getAttributes()[key]['action'](value)
        this.boardElements.updateDiv()
    }
    getNewElements(){
        return new Object()
    }
    render(board,resolvers){
        var div = this.createDiv()
        div.style.left = this.attributes['coords'][0] / this.boardWidth * this.boardWidthReal + 'px'
        div.style.top = this.attributes['coords'][1] / this.boardWidth * this.boardWidthReal + 'px'
        div.style.width = this.attributes['coords'][2] / this.boardWidth * this.boardWidthReal + 'px'
        div.style.height = this.attributes['coords'][3] / this.boardWidth * this.boardWidthReal + 'px'
        
        div.style.border = '1px solid white'
        div.style.textAlign = 'center'
        
        var centralText = document.createElement('div')
        //centralText.style.textAnchor = 'middle'
        //centralText.style.position = 'absolute'
        centralText.style.marginTop = (this.attributes['coords'][3]/2 / this.boardWidth * this.boardWidthReal)-10 + 'px'
        
        var result = null
        if(this.attributes['codeValue']){
            var haskellCondition = this.getResolverExpression(resolvers) + this.attributes['codeValue']
            result = this.boardElements.func(haskellCondition)

        }

        if(result){
            centralText.innerHTML = result.str
        } else {
            centralText.innerHTML = this.attributes['text']
        }
        div.appendChild(centralText)
        
        board.appendChild(div)
    }
}
class Grid extends BlockElement {
    constructor(attributeSelect,boardElements,parent){
        super(attributeSelect,boardElements,parent)
        this.typeName = "Grid"
        this.constructAttributes({
            x:8,
            y:8
        })
    }
    tryChangeX(x){
        if(!/^[0-9]+$/.test(x) || x < 0 || x > 100){
            alert('wrong value')
            return
        }
        this.attributes['x'] = Number(x)
    }
    tryChangeY(y){
        if(!/^[0-9]+$/.test(y) || y < 0 || y > 100){
            alert('wrong value')
            return
        }
        this.attributes['y'] = Number(y)
    }
    getAttributes(){
        let t = this
        return Object.assign(super.getAttributes(),{
            x:{action:(x)=>{t.tryChangeX(x)}},
            y:{action:(y)=>{t.tryChangeY(y)}}
        })
    }
    editAttribute(key){
        var value = prompt('Insert value',this.attributes[key])
        if(value != undefined)
            this.getAttributes()[key]['action'](value)
        this.boardElements.updateDiv()
    }
    getNewElements(){
        return new Object()
    }
    render(board,resolvers){
        var div = this.createDiv()
        div.style.left = this.attributes['coords'][0] / this.boardWidth * this.boardWidthReal + 'px'
        div.style.top = this.attributes['coords'][1] / this.boardWidth * this.boardWidthReal + 'px'
        div.style.width = this.attributes['coords'][2] / this.boardWidth * this.boardWidthReal + 'px'
        div.style.height = this.attributes['coords'][3] / this.boardWidth * this.boardWidthReal + 'px'
        
        div.style.border = '1px solid white'
        
        var table = document.createElement('table')
        for(var i = 0;i<this.attributes['y'];i++){
            var tr = document.createElement('tr')
            for(var j = 0;j<this.attributes['x'];j++){
                var td = document.createElement('td')
                td.style.border = "1px solid white"
                tr.appendChild(td)
            }
            table.appendChild(tr)
        }
        table.style.width = "100%"
        table.style.height = "100%"
        div.appendChild(table)
        board.appendChild(div)
    }
}
class Container extends BlockElement {
    constructor(attributeSelect,boardElements,parent){
        super(attributeSelect,boardElements,parent)
        this.typeName = "Container"
    }
    getNewElements(){
        let t = this
        return {
            'Grid': {construct:() => {return new Grid(t.attributeSelect,t.boardElements,t)}},
            'Condition': {construct:() => {return new Condition(t.attributeSelect,t.boardElements,t)}},
            'TextPlaceholder': {construct:() => {return new TextPlaceholder(t.attributeSelect,t.boardElements,t)}},
            'Container': {construct:() => {return new Container(t.attributeSelect,t.boardElements,t)}}
        }
    }
    render(board,resolvers){
        var div = this.createDiv()
        div.style.left = this.attributes['coords'][0] / this.boardWidth * this.boardWidthReal + 'px'
        div.style.top = this.attributes['coords'][1] / this.boardWidth * this.boardWidthReal + 'px'
        div.style.width = this.attributes['coords'][2] / this.boardWidth * this.boardWidthReal + 'px'
        div.style.height = this.attributes['coords'][3] / this.boardWidth * this.boardWidthReal + 'px'
        
        div.style.border = '1px solid white'
        for(var i in this.subelements){
            this.subelements[i].render(div,this.getNewResolvers(resolvers))
        }
        board.appendChild(div)
    }
}
class Equality extends BoardElement {
    constructor(attributeSelect,boardElements,parent){
        super(attributeSelect,boardElements,parent)
        this.typeName = "Equality"
        this.attributes = {
            value:null
        }
    }
    getAttributes(){
        let t = this
        return {
            value:{action:(value)=>{t.tryChangeValue(value)}},
        }
    }
    tryChangeValue(value){
        this.attributes['value'] = value.trim().length == 0 ? null : value.trim()
    }
    editAttribute(key){
        var value = prompt('Insert value',this.attributes[key])
        if(value != undefined)
            this.getAttributes()[key]['action'](value)
        this.boardElements.updateDiv()
    }
    getNewElements(){
        let t = this
        return {
            'Grid': {construct:() => {return new Grid(t.attributeSelect,t.boardElements,t)}},
            'Condition': {construct:() => {return new Condition(t.attributeSelect,t.boardElements,t)}},
            'TextPlaceholder': {construct:() => {return new TextPlaceholder(t.attributeSelect,t.boardElements,t)}},
            'Container': {construct:() => {return new Container(t.attributeSelect,t.boardElements,t)}}
        }
    }
    test(value){
        if(this.attributes['value'] == null)
            return false
        return value == this.attributes['value']
    }
    render(board,resolvers){
        var div = this.createDiv()
        div.style.left = 0
        div.style.top = 0
        div.style.width = '100%'
        div.style.height = '100%'
        
        for(var i in this.subelements){
            this.subelements[i].render(div,this.getNewResolvers(resolvers))
        }
        board.appendChild(div)
    }
}
class Condition extends BoardElement {
    constructor(attributeSelect,boardElements,parent){
        super(attributeSelect,boardElements,parent)
        this.typeName = "Condition"
        this.attributes = {
            condition:null
        }
    }
    getAttributes(){
        let t = this
        return {
            condition:{action:(condition)=>{t.tryChangeCondition(condition)}},
        }
    }
    tryChangeCondition(condition){
        this.attributes['condition'] = condition.trim().length == 0 ? null : condition.trim()
    }
    editAttribute(key){
        var value = prompt('Insert value',this.attributes[key])
        if(value != undefined)
            this.getAttributes()[key]['action'](value)
        this.boardElements.updateDiv()
    }
    getNewElements(){
        let t = this
        return {
            'Equality': {construct:() => {return new Equality(t.attributeSelect,t.boardElements,t)}}
        }
    }
    render(board,resolvers){
        var div = this.createDiv()
        div.style.left = 0
        div.style.top = 0
        div.style.width = '100%'
        div.style.height = '100%'
        
        var haskellCondition = this.getResolverExpression(resolvers) + this.attributes['condition']
        
        var result = null
        if(this.attributes['condition'] != null){
            result = this.boardElements.func(haskellCondition)
        }
        if(result != null){
            for(var i in this.subelements){
                var subelement = this.subelements[i]
                if(subelement.attributes['value'] == null)
                    continue
                if(subelement.test(result.str)){
                    this.subelements[i].render(div,this.getNewResolvers(resolvers))
                    break
                }

            }
        }
        board.appendChild(div)
        
        //this.subelements = 
    }
}
class State extends BoardElement {
    constructor(attributeSelect,boardElements,parent){
        super(attributeSelect,boardElements,parent)
        this.typeName = "State"
        
        this.haskellResolver = 'state = state'
    }
    getAttributes(){
        return new Object()
    }
    getNewElements(){
        let t = this
        return {
            'Grid': {construct:() => {return new Grid(t.attributeSelect,t.boardElements,t)}},
            'Condition': {construct:() => {return new Condition(t.attributeSelect,t.boardElements,t)}},
            'TextPlaceholder': {construct:() => {return new TextPlaceholder(t.attributeSelect,t.boardElements,t)}},
            'Container': {construct:() => {return new Container(t.attributeSelect,t.boardElements,t)}}
        }
    }
    render(board,resolvers){
        var boardElem = this.createDiv()
        boardElem.style.position = 'relative'
        boardElem.style.width = '100%'
        boardElem.style.height = '100%'
        board.appendChild(boardElem)
        for(var i in this.subelements){
            this.subelements[i].render(boardElem,this.getNewResolvers(resolvers))
        }
    }
}

class BoardElements {
    constructor(htmlElement, board, attributeSelect){
        this.htmlElement = htmlElement
        this.board = board
        this.attributeSelect = attributeSelect
        this.attributeSelect.addParent(this)
        this.func = null
        
        this.root = new State(attributeSelect,this,null)
        this.updateDiv()
    }
    
    updateDiv(){
        this.htmlElement.innerHTML = ""
        this.renderAttributeSelect(this.root,0)
        this.renderBoard(this.root)
    }
    renderAttributeSelect(element,level){
        var MARGIN = 10
        var elem = element.renderList()
        elem.style.marginLeft = level*MARGIN + 'px'
        this.htmlElement.appendChild(elem)
        for(var key in element.attributes){
            var elem = element.renderAttribute(key)
            elem.style.marginLeft = (level+1)*MARGIN + 'px'

            this.htmlElement.appendChild(elem)
        }
        for(var key in element.subelements){
            this.renderAttributeSelect(element.subelements[key],level+1)
        }
    }
    renderBoard(element){
        this.board.innerHTML = ""
        
        this.root.render(this.board,[])
    }
    setHaskellFunction(func){
        this.func = func
    }
}

class AttributeSelect {
    constructor(element){
        this.element = element
        this.selecting = false
    }
    addParent(parent){
        this.parent = parent
    }
    select(element){
        if(!this.selecting){
            this.selecting = true
            this.element.style.display = 'block'
            
            this.fillHTML(element)
        } else {
            this.selecting = false
            this.element.style.display = 'none'
        }
    }
    fillHTML(element){
        let t = this
        this.element.innerHTML = "New attribute:"
        var table = document.createElement('table')
        var ga = element.getAttributes()
        for(var key in ga){
            var tr = document.createElement('tr')
            tr.appendChild(document.createElement('rd'))
            var keyTd = document.createElement('td')
            keyTd.innerHTML = '<a href="#">' + key + '</a>'
            keyTd.onclick = () => {
                alert(key)
            }
            tr.appendChild(keyTd)
            table.appendChild(tr)
        }
       this.element.appendChild(table)
        
        var table = document.createElement('table')
        this.element.innerHTML += "New element:"
        var gne = element.getNewElements()
        for(let key in gne){
            let tr = document.createElement('tr')
            tr.appendChild(document.createElement('rd'))
            let keyTd = document.createElement('td')
            keyTd.innerHTML = '<a href="#">' + key + '</a>'
            keyTd.onclick = () => {
                element.addSubelement(key,t)
                t.parent.updateDiv()
                t.selecting = false
                t.element.style.display = 'none'
            }
            tr.appendChild(keyTd)
            table.appendChild(tr)
        }
       this.element.appendChild(table)
        
    }
}






