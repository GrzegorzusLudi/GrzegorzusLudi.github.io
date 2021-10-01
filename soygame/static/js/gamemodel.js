
class GameModel {
    constructor(){
        this.keypressed = {}
        this.elements = []
        
        this.soyak = new Soyak(this.elements,0,200)
        this.elements.push(this.soyak)
        this.elements.push(new Chud(this.elements,1800,50))
        this.elements.push(new Chud(this.elements,2000,50))
        
        this.elements.push(new Chud(this.elements,2630,50))
        this.elements.push(new Chud(this.elements,2650,50))
        this.elements.push(new Chud(this.elements,2650,100))
        this.elements.push(new Chud(this.elements,2670,50))
        
        
        this.elements.push(new Text(500,100,['nigga',"i'm nuts"]))
        this.elements.push(new BackgroundImage(550,0,'nigga.png',[0,0,100,100]))
        this.elements.push(new Text(0,200,['------->','EAT ZE',"BUGGERINOS",'MMMMM TASTY :Þ','------->']))
        this.elements.push(new Text(-800,200,["no, there's no",'eastereggerino, you','chudoslav','go back and','EAT THE BUGS']))
        this.elements.push(new Text(2000,300,['look at these chuds','I wonder who they',"would be if they didn't",'believe in nazis like glurbmph','and ate soylent at least','6 times a day','','press SPACE to DOWNVOTE THEM!!!!']))
        this.elements.push(new Text(1350,200,['MMMMMMMMMM',"TASTY"]))
        this.elements.push(new Text(2700,200,['sorry for being mean :c',"but in zese uncertain times",'we must kickstart','ze 4th industrial revolution']))
        this.elements.push(new BackgroundImage(2850,0,'szwab.png',[0,0,200,200]))
        
        this.elements.push(new Text(3760,250,['↓↓↓GET IN BASEDBOY FOR YOUR↓↓↓','↓↓↓GREAT ADVENTURE!!!!!↓↓↓']))
        
        this.elements.push(new Rectangle(3700,-3000,15,3150))
        this.elements.push(new Rectangle(3805,-3000,15,3150))
        this.elements.push(new Piperino(3700,-3000,120,3150))
        
        //borderinos
        this.elements.push(new Rectangle(-1000,-100,4700,100))
        this.elements.push(new Rectangle(3820,-100,1180,100))
        this.elements.push(new Rectangle(-1500,-500,500,1000))
        this.elements.push(new Rectangle(4000,-500,500,1000))
        
        this.elements.push(new Rectangle(200,0,150,100))
        this.elements.push(new Rectangle(500,200,300,40))
        this.elements.push(new Rectangle(900,0,150,100))
        this.elements.push(new Rectangle(1600,0,150,150))
        this.elements.push(new Rectangle(2300,0,150,100))
        
        this.elements.push(new Rectangle(1000,400,150,40))
        this.elements.push(new Buggerino(1075,490,6))
        this.elements.push(new Rectangle(1200,600,150,40))
        this.elements.push(new Buggerino(1275,690,6))
        this.elements.push(new Rectangle(1000,800,150,40))
        this.elements.push(new Soylent(1075,890))
        this.elements.push(new Rectangle(700,1000,150,40))
        this.elements.push(new Buggerino(775,1090,5))
        this.elements.push(new Rectangle(500,1200,150,40))
        this.elements.push(new Soylent(575,1290))
        this.elements.push(new Rectangle(700,1400,150,40))
        this.elements.push(new Mask(775,1490))
        this.elements.push(new Text(500,1490,['You forgot something, sir']))
        
        
        this.elements.push(new Soylent(300,400))
        this.elements.push(new Soylent(1300,300))
        this.elements.push(new Soylent(1400,300))
        this.elements.push(new Buggerino(300,200,1))
        this.elements.push(new Buggerino(200,200,4))
        this.elements.push(new Buggerino(400,400,2))
        this.elements.push(new Buggerino(500,400,5))
        this.elements.push(new Buggerino(600,400,5))
        
        
        this.elements.push(new Buggerino(-300,200,3))
        this.elements.push(new Buggerino(-200,200,3))
        this.elements.push(new Buggerino(-500,200,2))
        this.elements.push(new Buggerino(-600,200,2))
        
        this.elements.push(new Buggerino(1800,100,1))
        this.elements.push(new Buggerino(1900,100,3))
        this.elements.push(new Buggerino(2000,100,1))
        
        this.elements.push(new Buggerino(1200,100,5))
        this.elements.push(new Buggerino(1300,100,3))
        this.elements.push(new Buggerino(1400,100,3))
        this.elements.push(new Buggerino(1500,100,4))
    }
    addCanvas(canvas){
        this.canvas = canvas
        let t = this
        this.cam = this.canvas.camera
        this.run()
    }
    run(){
        for(var i in this.elements){
            //if(this.elements[i].active)
                this.elements[i].move()
        }
        for(var i in this.elements){
            if(this.elements[i].remove)
                this.elements.splice(i,1)// = this.elements.filter(x=>x.remove != true)
        }
        for(var i in this.elements){
            if(this.elements[i].active)
                this.elements[i].resetCollisions()
        }
        this.checkCollisions()
        this.checkSeeings()
        this.steer()
        this.moveCanvas()
        
        let t = this
        setTimeout(
                function(e){
                    t.run()
                    t.canvas.camera.setX(t.soyak.x)
                    t.canvas.camera.setY(t.soyak.y)
                    t.canvas.draw()
                }
                ,35)
        
    }
    checkCollisions(){
        var mobs = this.elements//.filter(x=>x.active)
        
        for(var i in mobs){
            var m = mobs[i]
            for(var j in this.elements){
                var e = this.elements[j]
                
                if(!m.active && !e.crashable)
                    continue
                if(i == j)
                    continue
                var mb = m.getBounds()
                var eb = e.getBounds()
                if(mb[2]+m.x-10 > eb[0]+e.x+10 && mb[0]+m.x+10 < eb[2]+e.x-10){
                    if(mb[3]+m.y > eb[1]+e.y && mb[3]+mb[1]+m.y*2 < eb[3]+eb[1]+e.y*2 && m.vy > e.vy){
                        if(e.touchable){
                            e.notifyCollision('down')
                            m.notifyCollision('up')
                            var diff = Math.min(mb[3]+m.y - eb[1]-e.y,20)
                            if(e.solid){
                                m.y -= diff
                            } else {
                                m.y -= diff/2
                                e.y += diff/2
                            }
                        } else {
                            m.tryTake(e)
                        }
                    }
                    if(mb[1]+m.y < eb[3]+e.y && mb[3]+mb[1]+m.y*2 > eb[3]+eb[1]+e.y*2 && m.vy < e.vy){
                        if(e.touchable){
                            m.notifyCollision('down')
                            e.notifyCollision('up')
                            var diff = Math.min(mb[1]+m.y - eb[3]-e.y,20)
                            if(e.solid){
                                m.y -= diff
                            } else {
                                m.y -= diff/2
                                e.y += diff/2
                            }
                        } else {
                            m.tryTake(e)
                        }
                    }
                }
                if(mb[3]+m.y-10 > eb[1]+e.y+10 && mb[1]+m.y+10 < eb[3]+e.y-10){
                    if(mb[2]+m.x > eb[0]+e.x && mb[2]+mb[0]+m.x*2 < eb[2]+eb[0]+e.x*2 && m.vx > e.vx){
                        if(e.touchable){
                            e.notifyCollision('right')
                            m.notifyCollision('left')
                            var diff = Math.min(mb[2]+m.x - eb[0]-e.x,20)
                            if(e.solid){
                                m.x -= diff
                            } else {
                                m.x -= diff/2
                                e.x += diff/2
                            }
                        } else {
                            m.tryTake(e)
                        }
                    }
                    if(mb[0]+m.x < eb[2]+e.x && mb[2]+mb[0]+m.x*2 > eb[2]+eb[0]+e.x*2 && m.vx < e.vx){
                        if(e.touchable){
                            m.notifyCollision('right')
                            e.notifyCollision('left')
                            var diff = Math.min(mb[0]+m.x - eb[2]-e.x,20)
                            if(e.solid){
                                m.x -= diff
                            } else {
                                m.x -= diff/2
                                e.x += diff/2
                            }
                        } else {
                            m.tryTake(e)
                        }
                    }
                }
            }
        }
        
    }
    checkSeeings(){
        var mobs = this.elements//.filter(x=>x.active)
        const MOB_SEEING_HORIZONTAL = 400
        const MOB_SEEING_VERTICAL = 400
        
        for(var i in mobs){
            var m = mobs[i]
            if(!m.active || m.dead)
                continue
            for(var j in this.elements){
                var e = this.elements[j]
                
                if(!e.active)
                    continue
                if(i == j)
                    continue
                    
                if(Math.abs(m.x-e.x) < MOB_SEEING_HORIZONTAL && Math.abs(m.y-e.y) < MOB_SEEING_VERTICAL){
                    e.trySee(m)
                    m.trySee(e)
                } else {
                    if(e.triggered == m)
                        e.triggered = null
                    if(m.triggered == e)
                        m.triggered = null
                }
            }
        }
        for(var i in mobs){
            mobs[i].see = mobs[i].newsee
            mobs[i].newsee = []
        }
    }
    steer(){
        if(this.soyak.dead)
            return
        if(this.keypressed["ArrowLeft"] ^ this.keypressed["ArrowRight"] != true){
            this.soyak.moving = 0
        } else {
            if(this.keypressed["ArrowLeft"] == true){
                this.soyak.moving = -10
            }
            if(this.keypressed["ArrowRight"] == true){
                this.soyak.moving = 10
            }
        }
        if(this.keypressed["ArrowUp"] == true){
            this.soyak.tryJump()
        }
        if(this.keypressed[" "] == true && this.soyak.throwing == 0){
            this.soyak.prepareToThrow("downvote",this.elements)
        }
        if(this.keypressed[" "] != true && this.soyak.throwing == 1){
            this.soyak.throw()
        }
    }
    moveCanvas(){
        var x = this.cam.getX()
        var y = this.cam.getY()
    }
    keydown(e){
        this.keypressed[e.key] = true
    }
    keyup(e){
        delete this.keypressed[e.key]
    }
    drawPanel(context){
        context.fillStyle = "#000"
        context.textAlign = "left"
        context.font = "18px Verdana"
        context.strokeStyle = "#000"
        context.lineWidth = 2
        
        context.fillText("Mental health points: "+this.soyak.hp+"/"+this.soyak.maxhp,10,20)
        context.fillText("Soy power: "+this.soyak.soypoints,10,40)
    }
}
class Thing {
    constructor(x,y){
        this.x = x
        this.y = y
        this.vx = 0
        this.vy = 0
        this.cached = null
        this.lastCollisions = {'left':0,'up':0,'right':0,'down':0}
        this.touchable = false
        this.crashable = false
    }
    resetCollisions(){
        this.lastCollisions['left'] = this.lastCollisions['left'] > 1 ? this.lastCollisions['left']-1 : 0
        this.lastCollisions['right'] = this.lastCollisions['right'] > 1 ? this.lastCollisions['right']-1 : 0
        this.lastCollisions['up'] = this.lastCollisions['up'] > 1 ? this.lastCollisions['up']-1 : 0
        this.lastCollisions['down'] = this.lastCollisions['down'] > 1 ? this.lastCollisions['down']-1 : 0
    }
    move(){
        this.x += this.vx
        this.y += this.vy
    }
    notifyCollision(direction){
        this.lastCollisions[direction] = 2
    }
    tryTake(thing){
        if(thing.taken)
            return
    }
    getBounds(){
        return this.bounds
    }
}
class Mob extends Thing {
    constructor(elementArray,x,y){
        super(x,y)
        this.elementArray = elementArray
        this.solid = false
        this.active = true
        this.friction = 0.3
        this.maxAirSpeed = 15
        this.touchable = true
        
        this.maxhp = 3
        this.hp = 3
        this.dead = false
        this.deading = 3
        
        this.newsee = []
        this.see = []
        
        this.triggered = null
        
        this.politicalposition = null
    }
    tryTake(thing){
        if(thing.taken)
            return
    }
    trySee(someone){
        if(this.seen(someone)){
            this.newsee.push(someone)
        }
    }
    seen(someone){
        return false
    }
    loot(){
        
    }
    move(){
        super.move()
        this.vy -= 1
        if(this.vy < -this.maxAirSpeed)
            this.vy = -this.maxAirSpeed
            
        if(this.hp <= 0 && !this.dead){
            this.hp = 0
            this.dead = true
            this.loot()
            this.cached = null
        }
        if(this.deading > 0){
            this.deading--
            this.cached = null
        }
        
        var oktrigger = false
        
        for(var i in this.newsee){
            if(this.triggered == this.newsee[i]){
                oktrigger = true;break
            }
        }
    }
    notifyCollision(direction){
        super.notifyCollision(direction)
        switch(direction){
            case "down":
                if(this.vy < 0)
                    this.vy = -this.vy*this.friction
                break
            case "up":
                if(this.vy > 0)
                    this.vy = -this.vy*this.friction
                break
            case "right":
                if(this.vx < 0)
                    this.vx = -this.vx*this.friction
                break
            case "left":
                if(this.vx > 0)
                    this.vx = -this.vx*this.friction
                break
        }
        if(Math.abs(this.vx) < -0.1)
            this.vx = 0
        if(Math.abs(this.vy) < -0.1)
            this.vy = 0
    }
}
class Human extends Mob {
    constructor(elementArray,x,y){
        super(elementArray,x,y)
        this.moving = 0
        this.friction = 0.1
        this.maxAirSpeed = 15
        this.sideLeft = false
        this.head = null
        this.throwing = 0
        this.deading = 5
        this.throwingObject = null
        
    }
    move(){
        super.move()
            
            
        var previousSL = this.sideLeft
        if(this.moving < 0)
            this.sideLeft = true
        else if(this.moving > 0)
            this.sideLeft = false
        if(this.sideLeft != previousSL)
            this.cached = null
            
        if(this.vx > this.moving){
            this.vx -= 1
        }
        if(this.vx < this.moving){
            this.vx += 1
        }
        if(this.moving == 0 && this.vx > -1 && this.vx < 1)
            this.vx = 0
            
        if(this.dead){
            this.moving = 0
            return
        }
        
        if(this.throwingObject != null){
            this.alignThrowingObject()
        } else if(this.throwing == 2){
            this.throwing = 0
            this.cached = null
        }
    }
    tryJump(){
        if(this.lastCollisions['down'] > 0)
            this.vy = 20
    }
    prepareToThrow(name,elementArray){
        var object = this.canThrow(name)
        if(object){
            elementArray.push(object)
            this.cached = null
            this.throwing = 1
            this.throwingObject = object
            this.alignThrowingObject()
        }
    }
    throw(){
        this.cached = null
        this.throwing = 2
        this.throwingObject.throw()
        this.throwingObject.y += 30
        this.throwingObject = null
    }
    alignThrowingObject(){
        this.throwingObject.x = this.x + (this.sideLeft ? 10 : -10)
        this.throwingObject.y = this.y-10
        this.throwingObject.cached = null
    }
    getThing(){
        if(this.cached == null){
            var body
            switch(this.throwing){
                case 0: body = 'normal.png'; break
                case 1: body = 'throwing.png'; break
                case 2: body = 'throwed.png'; break
            }
            if(!this.dead){
                this.cached = {
                    objs:[
                        {
                            type:'image',
                            src:body,
                            bounds:[-25 + (this.sideLeft ? 5 : -5),-50,25 + (this.sideLeft ? 5 : -5),50], 
                            flipped:this.sideLeft
                        },
                        {
                            type:'image',
                            src:this.head,
                            bounds:[-25 + (this.sideLeft ? 5 : -5),-13,25 + (this.sideLeft ? 5 : -5),50], 
                            flipped:this.sideLeft
                        },
                    ],
                }
            } else if(this.deading > 0){
                this.cached = {
                    objs:[
                        {
                            type:'image',
                            src:'deading.png',
                            bounds:[-25 + (this.sideLeft ? 5 : -5),-50,25 + (this.sideLeft ? 5 : -5),50], 
                            flipped:this.sideLeft
                        },
                        {
                            type:'image',
                            src:this.headdead,
                            bounds:[-25 + (this.sideLeft ? 5 : -5),-13,25 + (this.sideLeft ? 5 : -5),50], 
                            flipped:this.sideLeft
                        },
                    ],
                }
            } else {
                this.cached = {
                    objs:[
                        {
                            type:'image',
                            src:'dead.png',
                            bounds:[-25 + (this.sideLeft ? 5 : -5),-53,25 + (this.sideLeft ? 5 : -5),0], 
                            flipped:!this.sideLeft
                        },
                        {
                            type:'image',
                            src:(this.headdead ? this.headdead : this.head),
                            bounds:[-25 -(this.sideLeft ? 15 : -15),-43,25 - (this.sideLeft ? 15 : -15),15], 
                            flipped:this.sideLeft
                        },
                    ],
                }
            }
        }
        return this.cached
    }
}
class Soyak extends Human {
    constructor(elementArray,x,y){
        super(elementArray,x,y)
        this.bounds = [-25,-50,25,50]
        
        this.hp = 10
        this.maxhp = 10
        //this.proteinerino = 0
        this.soypoints = 0
        this.head = 'sojak.png'
        this.headdead = 'sojakdead.png'
        this.masked = false
        
        this.politicalposition = 'science'
    }
    canThrow(objectName){
        switch(objectName){
            case "downvote":
                if(this.getSoypoints(3)){
                    return new Downvote(0,0,this)
                }
                break
        }
        return null
    }
    getSoypoints(numbah){
        if(this.soypoints < numbah)
            return false
        this.soypoints -= numbah
        return true
    }
    tryTake(thing){
        super.tryTake(thing)
        if(thing.taken)
            return
        switch(thing.name){
            case "soylent":
            case "bug":
                if('hp' in thing)
                    this.hp = Math.min(this.maxhp,this.hp + thing.hp)
                if('soypoints' in thing)
                    this.soypoints += thing.soypoints
                thing.taken = true
                break
            case "mask":
                this.masked = true
                thing.remove = true
                break
            case "greentext":
                this.hp -= thing.slur == 'nigger' ? 2 : 1
                this.vx += thing.vx/2
                this.vy += 5
                thing.taken = true
                break
        }
        this.cached = null
    }
    getThing(){
        if(this.cached == null){
            this.cached = super.getThing()
            if(this.masked)
            this.cached.objs.push({
                type:'image',
                src:'mask.png',
                bounds:[-20 - (this.sideLeft ? 2 : -2),-15,20 - (this.sideLeft ? 2 : -2),20], 
            })
        }
        return this.cached
    }
    move(){
        super.move()
        if(this.dead){
            if(this.cached == null)
                this.bounds = [-25,-50,25,0]
            return
        }
    }
}

class Chud extends Human {
    constructor(elementArray,x,y){
        super(elementArray,x,y)    
        this.moving = -5
        this.bounds = [-25,-50,25,50]
        this.head = 'czud.png'
        this.headdead = 'czuddead.png'
        
        this.triggered = null   //lmao, chuds are always triggered, so this is unreal unproven and not peer-reviewed
        
        this.throwthink = 0
        
        this.politicalposition = 'nazi'
    }
    canThrow(objectName){
        switch(objectName){
            case "transphobicslur":
                return new Greentext(0,0,this,"ywnbaw")
                break
            case "racistslur":
                return new Greentext(0,0,this,"nigger")
                break
            case "soyboy":
                return new Greentext(0,0,this,"soiboy")
                break
        }
        return null
    }
    move(){
        super.move()
        
        if(this.dead){
            if(this.cached == null)
                this.bounds = [-25,-50,25,0]
            return
        }
        
        if(this.triggered == null){
            if(this.lastCollisions['left'] > 1){
                this.moving = -5
            } else if(this.lastCollisions['right'] > 1){
                this.moving = 5
            }
        } else {
            if(this.lastCollisions['left'] > 1 || this.lastCollisions['right'] > 1){
                this.tryJump()
            }
            var lastside = this.sideLeft
            if(this.triggered.x < this.x - 80) {
                this.moving = -5
                this.sideLeft = true
            } else if(this.triggered.x > this.x + 80){
                this.moving = 5
                this.sideLeft = false
            } else {
                this.moving = 0
            }
            if(this.sideLeft != lastside)
                this.cached = null
            
            if(this.throwthink == 0 && this.throwing == 0){
                var slurtype = Math.random() < 0.33 ? "transphobicslur" : (Math.random() < 0.5 ? "racistslur" : "soyboy")
                this.prepareToThrow(slurtype,this.elementArray)
                this.throwthink = 10
            }
            if(this.throwthink > 0 && this.throwthink < 7 && this.throwing == 1){
                this.throw()
            }
        }
        
        if(this.throwthink > 0){
            this.throwthink--
        }
        
    }
    loot(){
        for(var i = 0;i<3;i++){
            var loot
            if(Math.random() < 0.1)
                loot = new Soylent(this.x,this.y)
            else
                loot = new Buggerino(this.x,this.y,Math.floor(Math.random()*6)+1)
            loot.vy = 16
            loot.vx = i*12-12
            this.elementArray.push(loot)
        }
    }
    seen(someone){
        if(this.sideLeft /* IMPOSSIBLE O_O */ && someone.x < this.x || !this.sideLeft && someone.x > this.x || this.triggered == someone)
            if(someone.politicalposition != 'nazi' && !someone.dead)
                this.triggered = someone
        
        if(this.triggered == someone && someone.dead == true)
            this.triggered = null
    }
    tryTake(thing){
        super.tryTake(thing)
        if(thing.taken)
            return
        switch(thing.name){
            case "downvote":
                this.hp -= 1
                this.vx += thing.vx/2
                this.vy += 5
                thing.taken = true
                break
        }
    }
}

class Solid extends Thing {
    constructor(x,y){
        super(x,y)
        this.solid = true
        this.touchable = true
    }
    tryTake(thing){
        if(thing.crashable)
            thing.taken = true
    }
}
class Rectangle extends Solid {
    constructor(x,y,width,height){
        super(x,y)
        this.width = width
        this.height = height
        this.bounds = [0,0,this.width,this.height]
    }
    getThing(){
        if(this.cached == null)
        this.cached = {
            objs:[
                {
                    type:'polygon',
                    coords:[
                        [0,0],
                        [this.width,0],
                        [this.width,this.height],
                        [0,this.height],
                    ],
                    stroke:'#000000',
                    fill:'#888888',
                }
            ],
        }
        return this.cached
    }
}

class Untouchable extends Thing {
    constructor(x,y){
        super(x,y)
        this.solid = false
        this.active = false
        this.name = null
    }
    move(){
        super.move()
        if(this.taken){
            this.cached = null
            this.alpha -= 5
        }
        if(this.alpha <= 0)
            this.remove = true
            
    }
}

class Lootable extends Untouchable {
    constructor(x,y){
        super(x,y)
    }
    move(){
        super.move()
        if(this.vx >= 1){
            this.vx -= 1
        } else if(this.vx <= -1){
            this.vx += 1
        } else {
            this.vx = 0
        }
        
        if(this.vy >= 1){
            this.vy -= 1 
        } else if(this.vy <= -1){
            this.vy += 1
        } else {
            this.vy = 0
        }
    }
}

class Soylent extends Lootable {
    constructor(x,y){
        super(x,y)
        this.solid = false
        this.active = false
        this.name = "soylent"
        this.bounds = [-20,-50,20,50]
        this.taken = false
        this.alpha = 100
        this.soypoints = 10
        this.hp = 5
    }
    getThing(){
        if(this.cached == null)
        this.cached = {
            objs:[
                {
                    type:'image',
                    src:'pychota1.png',
                    bounds:[-20,-50,20,50],
                    alpha:this.alpha
                }
            ],
        }
        return this.cached
    }
}


class Buggerino extends Lootable {
    constructor(x,y,bugnumber){
        super(x,y)
        this.solid = false
        this.active = false
        this.bugnumber = bugnumber
        this.name = "bug"
        this.bounds = [-30,-30,30,30]
        this.taken = false
        this.alpha = 100
        this.soypoints = 2
        this.hp = 1
    }
    getThing(){
        if(this.cached == null)
        this.cached = {
            objs:[
                {
                    type:'image',
                    src:'robal'+this.bugnumber+'.png',
                    bounds:[-30,-30,30,30],
                    alpha:this.alpha
                }
            ],
        }
        return this.cached
    }
}


class Mask extends Untouchable {
    constructor(x,y){
        super(x,y)
        this.solid = false
        this.active = false
        this.name = "mask"
        this.bounds = [-30,-30,30,30]
        this.taken = false
        this.alpha = 100
    }
    getThing(){
        if(this.cached == null)
        this.cached = {
            objs:[
                {
                    type:'image',
                    src:'mask.png',
                    bounds:[-30,-30,30,30],
                    alpha:this.alpha
                }
            ],
        }
        return this.cached
    }
}


class Text extends Thing {
    constructor(x,y,lines){
        super(x,y)
        this.solid = false
        this.lines = lines
        this.cached = null
        this.bounds = [-100,0,100,25*lines.length]
    }
    getThing(){
        if(this.cached == null){
            this.cached = {
                objs:[]
            }
            for(var i in this.lines){
                this.cached.objs.push({
                    type:'text',
                    text:this.lines[i],
                    x:0,
                    y:this.lines.length-i*25-1,
                    fill:'#000'
                })
            }
        }
        return this.cached
    }
}

class BackgroundImage extends Thing {
    constructor(x,y,src,bounds){
        super(x,y)
        this.solid = false
        this.cached = null
        this.src = src
        this.bounds = bounds
    }
    getThing(){
        if(this.cached == null)
        this.cached = {
            objs:[
                {
                    type:'image',
                    src:this.src,
                    bounds:this.bounds,
                }
            ],
        }
        return this.cached
    }
}

class Throwable extends Untouchable {
    constructor(x,y,owner){
        super(x,y)
        this.name = null
        this.crashable = false
    }
    throw(){
        this.crashable = true
        this.vx = this.owner.sideLeft ? -20 : 20
    }
    move(){
        super.move()
        if(this.taken)
            this.remove = true
    }
    
}
class Downvote extends Throwable {
    constructor(x,y,owner){
        super(x,y,owner)
        this.cached = null
        this.bounds = [-10,-10,10,10]
        this.name = "downvote"
        this.owner = owner
    }
    getThing(){
        if(this.cached == null)
        this.cached = {
            objs:[
                {
                    type:'image',
                    src:'downvote.png',
                    bounds:this.bounds,
                    flipped:this.owner.sideLeft,
                }
            ],
        }
        return this.cached
    }
}

class Greentext extends Throwable {
    constructor(x,y,owner,slur){
        super(x,y,owner)
        this.cached = null
        this.bounds = [-10,-10,10,10]
        this.name = "greentext"
        this.slur = slur
        this.owner = owner
    }
    getThing(){
        if(this.cached == null)
        this.cached = {
            objs:[
                {
                    type:'text',
                    font:'16px sans-serif',
                    text:'>' + this.slur,
                    x:0,
                    y:0,
                    fill:'#789922'
                }
            ],
        }
        return this.cached
    }
    
}

class Piperino extends Thing {
    constructor(x,y,width,height){
        super(x,y)
        this.solid = false
        this.cached = null
        this.width = width
        this.height = height
        this.bounds = [0,0,width,height]
    }
    getThing(){
        if(this.cached == null)
        this.cached = {
            objs:[
                {
                    type:'polygon',
                    coords:[
                        [0,0],
                        [this.width,0],
                        [this.width,this.height],
                        [0,this.height],
                    ],
                    stroke:"#000",
                    fill:"#0a0"
                },
                {
                    type:'polygon',
                    coords:[
                        [-20,0],
                        [this.width+20,0],
                        [this.width+20,50],
                        [-20,50],
                    ],
                    stroke:"#000",
                    fill:"#0a0"
                },
                {
                    type:'polygon',
                    coords:[
                        [-20,this.height-50],
                        [this.width+20,this.height-50],
                        [this.width+20,this.height],
                        [-20,this.height],
                    ],
                    stroke:"#000",
                    fill:"#0a0"
                }
            ],
        }
        return this.cached
    }
    
}