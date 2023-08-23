
class ItemIrl extends GameObject {
    constructor(x,y,z,item){
        super(x,y,z,0)
        
        this.cache = null
        this.solid = false
        this.static = true
        this.hidable = false
        this.bounds = null
        
        this.item = item
    }
    move(){
        
    }
    generateBounds(){
        return [[-5,-5,0],[5,5,5]]
    }
    
    render(){
        
        return {
            x:this.x,
            y:this.y,
            z:this.z,
            rotation:this.rotation,
            objs:this.item.getDisplay()
        }
    }
    getTranslation(){
        return undefined
    }
}
class Item {
    constructor(){
        this.cache = null
    }
    getDisplay(){
        if(this.cache === null)
            this.cache = this.render()
        return this.cache
    }
    render(){
        return []
    }
}
class Slotable extends Item {
    constructor(slots){
        super()

        this.slots = slots
        this.items = []
        for(var i = 0;i<this.slots;i++){
            this.items.push(null)
        }
    }
}
class Inventory extends Slotable {
    constructor(slots){
        super(slots)
        this.pos = 0
    }
}

class Bearable extends Item {
    
}

class Axe extends Bearable {
    constructor(){
        super()
    }
    getTranslation(){
        return [-1,-3]
    }
    render(){
        var lt = 12
        
        var ah = 4
        var aw = 8
        var at = 1
        return [
        
            { type:"line", stroke:"#a00", fill:"#a00", coords:[[0,0,0], [0,0,lt]] },
            { type:"polygon", stroke:"#000", fill:"#aaa", coords:[[0,0,lt],[aw,0,lt+at],[aw,0,lt-ah-at],[0,0,lt-ah]] },
        /*
            { type:"polygon", stroke:"#000", fill:"#a00", coords:[[0,0,0], [wt,0,0],  [wt,0,lt], [0,0,lt]] },
            { type:"polygon", stroke:"#000", fill:"#a00", coords:[[0,wt,0],[wt,wt,0], [wt,wt,lt],[0,wt,lt]] },
            { type:"polygon", stroke:"#000", fill:"#a00", coords:[[0,0,0], [0,wt,0],  [0,wt,lt], [0,0,lt]] },
            { type:"polygon", stroke:"#000", fill:"#a00", coords:[[wt,0,0],[wt,wt,0], [wt,wt,lt],[wt,0,lt]] },
            ,
            { type:"polygon", stroke:"#000", fill:"#a00", coords:[[0,0,lt],[0,wt,lt],[0,wt,lt],[0,0,lt]] },
            { type:"polygon", stroke:"#000", fill:"#a00", coords:[[wt,0,lt],[wt,wt,lt],[wt,wt,lt],[wt,0,lt]] },
            
            { type:"polygon", stroke:"#000", fill:"#a00", coords:[[0,0,0],[0,wt,0],[wt,wt,0],[wt,0,0]] },
            { type:"polygon", stroke:"#000", fill:"#a00", coords:[[0,0,lt],[0,wt,lt],[wt,wt,lt],[wt,0,lt]] },
            
            { type:"polygon", stroke:"#000", fill:"#aaa", coords:[[wt,0,lt],[aw,wt/2,lt],[aw,wt/2,lt-ah],[wt,0,lt-ah]] },
            { type:"polygon", stroke:"#000", fill:"#aaa", coords:[[wt,wt,lt],[aw,wt/2,lt],[aw,wt/2,lt-ah],[wt,wt,lt-ah]] },*/
        ]
    }
}
