
class Camera {
    constructor(oldCamera){
        this.x = 0
        this.y = 0
        this.z = 0
        this.skewed = 0.5
        this.rotation = 60 * Math.PI / 180
        this.magnification = 3
        
        this.dummyBounds = [[0,0,0],[0,0,0]]
        if(oldCamera !== undefined){
            if(oldCamera.x)
                this.x = oldCamera.x
            if(oldCamera.y)
                this.y = oldCamera.y
            if(oldCamera.magnification)
                this.magnification = oldCamera.magnification
        }
        
        this.moving = false
        this.pixelSize = 1/this.magnification
    }
    
    getX(){ return this.x }
    setX(x){ this.x = x }
    
    getY(){ return this.y }
    setY(y){ this.y = y }
    
    getZ(){ return this.z }
    setZ(z){ this.z = z }
    
    getRotation(){ return this.rotation / Math.PI * 180 }
    setRotation(r){ this.rotation = r * Math.PI / 180 }
    
    getSkewed(){ return this.skewed }
    getAntiSkewed(){ return Math.sqrt(1 - this.skewed * this.skewed) }
    setSkewed(skewed){ this.skewed = Math.min(Math.max(skewed,-1),1) }
    
    getMouseX() { return this.mouseX }
    getMouseY() { return this.mouseY }
    setMousePosition(x,y) { this.mouseX = x; this.mouseY = y}
    
    degreesToPixels(x,y,bounds,getx,z){
        if(z === undefined)
            z = 0
        var rotx = (this.x-x) * Math.cos(this.rotation) - (this.y-y) * Math.sin(this.rotation)
        var roty = (this.x-x) * Math.sin(this.rotation) + (this.y-y) * Math.cos(this.rotation)
        return getx 
                ? 
            (/*this.x + */rotx) * this.magnification + bounds.width/2
                :
            (/*this.y + */roty * this.skewed  + (this.z-z)*this.getAntiSkewed()) * this.magnification + bounds.height/2
    }
    getAbsoluteX(x,y,bounds,additionalRotation){
        var additionalRotation = 0
        var rotx = (this.x-x) * Math.cos(this.rotation+additionalRotation) - (this.y-y) * Math.sin(this.rotation+additionalRotation)
        return rotx * this.magnification + bounds.width/2
    }
    getAbsoluteY(x,y,bounds,additionalRotation){
        var additionalRotation = 0
        var roty = (this.x-x) * Math.sin(this.rotation+additionalRotation) + (this.y-y) * Math.cos(this.rotation+additionalRotation)
        return (roty * this.skewed) * this.magnification + bounds.height/2
    }
    getRelativeY(x,y,additionalRotation){
        
        var roty = (x) * Math.sin(this.rotation-additionalRotation) + (y) * Math.cos(this.rotation-additionalRotation)
        
        return (roty) * this.magnification
    }

    checkIfFits(objwithXandY,bounds){
        var padding = 10
        var objbounds = objwithXandY.getBounds()
        
        var translatedx = [
            this.degreesToPixels(objwithXandY.x+objbounds[0][0],objwithXandY.y+objbounds[0][1],bounds,true,objwithXandY.z+objbounds[0][2]),
            this.degreesToPixels(objwithXandY.x+objbounds[0][0],objwithXandY.y+objbounds[1][1],bounds,true,objwithXandY.z+objbounds[0][2]),
            this.degreesToPixels(objwithXandY.x+objbounds[0][0],objwithXandY.y+objbounds[0][1],bounds,true,objwithXandY.z+objbounds[1][2]),
            this.degreesToPixels(objwithXandY.x+objbounds[0][0],objwithXandY.y+objbounds[1][1],bounds,true,objwithXandY.z+objbounds[1][2]),
            this.degreesToPixels(objwithXandY.x+objbounds[1][0],objwithXandY.y+objbounds[0][1],bounds,true,objwithXandY.z+objbounds[0][2]),
            this.degreesToPixels(objwithXandY.x+objbounds[1][0],objwithXandY.y+objbounds[1][1],bounds,true,objwithXandY.z+objbounds[0][2]),
            this.degreesToPixels(objwithXandY.x+objbounds[1][0],objwithXandY.y+objbounds[0][1],bounds,true,objwithXandY.z+objbounds[1][2]),
            this.degreesToPixels(objwithXandY.x+objbounds[1][0],objwithXandY.y+objbounds[1][1],bounds,true,objwithXandY.z+objbounds[1][2]),
        ]
        var translatedy = [
            this.degreesToPixels(objwithXandY.x+objbounds[0][0],objwithXandY.y+objbounds[0][1],bounds,false,objwithXandY.z+objbounds[0][2]),
            this.degreesToPixels(objwithXandY.x+objbounds[0][0],objwithXandY.y+objbounds[1][1],bounds,false,objwithXandY.z+objbounds[0][2]),
            this.degreesToPixels(objwithXandY.x+objbounds[0][0],objwithXandY.y+objbounds[0][1],bounds,false,objwithXandY.z+objbounds[1][2]),
            this.degreesToPixels(objwithXandY.x+objbounds[0][0],objwithXandY.y+objbounds[1][1],bounds,false,objwithXandY.z+objbounds[1][2]),
            this.degreesToPixels(objwithXandY.x+objbounds[1][0],objwithXandY.y+objbounds[0][1],bounds,false,objwithXandY.z+objbounds[0][2]),
            this.degreesToPixels(objwithXandY.x+objbounds[1][0],objwithXandY.y+objbounds[1][1],bounds,false,objwithXandY.z+objbounds[0][2]),
            this.degreesToPixels(objwithXandY.x+objbounds[1][0],objwithXandY.y+objbounds[0][1],bounds,false,objwithXandY.z+objbounds[1][2]),
            this.degreesToPixels(objwithXandY.x+objbounds[1][0],objwithXandY.y+objbounds[1][1],bounds,false,objwithXandY.z+objbounds[1][2]),
        ]
        
        //if(Math.random()<0.0001)
        //var y = this.degreesToPixels(objwithXandY.x,objwithXandY.y,bounds,false,objwithXandY.z)
        return translatedx.reduce((a,b)=>Math.max(a,b)) > -padding+bounds.left && translatedy.reduce((a,b)=>Math.max(a,b)) > -padding+bounds.top && translatedx.reduce((a,b)=>Math.min(a,b)) < bounds.width+padding && translatedy.reduce((a,b)=>Math.min(a,b)) < bounds.height+padding
    }
    
    /*
    pixelsToDegrees(x,y,bounds,getx,z){
        //var derotx = x * Math.cos(-this.rotation) + y * Math.sin(-this.rotation)
        //var deroty = -x * Math.sin(-this.rotation) + y * Math.cos(-this.rotation)
        return getx 
                ?
            (x - bounds.width/2) / this.magnification - this.x
                :
            (-(y - bounds.height/2) / this.magnification - this.y)/this.skewed
    }*/
    
    getPixelSize(){
        this.pixelSize = 1 / this.magnification
        return this.pixelSize
    }
    
    // (number of pixels)/1degree, not incremented, but multiplied by a factor
    getMagnification(){ return this.magnification }
    setMagnification(magnification){ 
        var MIN_MAGNIFICATION = 0.05
        var MAX_MAGNIFICATION = 10
        if(magnification < MIN_MAGNIFICATION)
            this.magnification = MIN_MAGNIFICATION
        else if(magnification > MAX_MAGNIFICATION)
            this.magnification = MAX_MAGNIFICATION
        else
            this.magnification = magnification
    }
    
    startMoving(movx,movy){
        this.startx = this.x
        this.starty = this.y
        this.startmovx = movx
        this.startmovy = movy
        this.movx = movx
        this.movy = movy
        this.moving = true
    }
    actualizeMoving(movx,movy){
        this.movx = movx
        this.movy = movy
        
        this.x = this.startx + (this.movx-this.startmovx) / this.magnification
        this.y = this.starty - (this.movy-this.startmovy) / this.magnification
    }
    stopMoving(){
        this.moving = false
    }
    getDegrees(){
        
    }
    
}
class AbstractCanvas {
    constructor(canvasElement,parentDiv,gameModel){
        this.canvasElement = canvasElement
        this.parentDiv = parentDiv
        this.gameModel = gameModel 
        this.bounds = null
        
        this.styles = {
            lineWidth: 1,
            strokeStyle: "#000",
            fillStyle: "#000",
            textSize: 16,
            font: "Helvetica",
        }
        
        this.camera = new Camera()
        this.cameratimeout = undefined
        this.rerendertimeout = undefined
        
        this.additional = []
        

        this.actualizeBounds()
        
        this.staticObjectOrder = {'-1':{'-1':{objects:[],objbounds:[]},'1':{objects:[],objbounds:[]}},'1':{'-1':{objects:[],objbounds:[]},'1':{objects:[],objbounds:[]}}}
        this.prepareStatic()

    }
    setStyle(styles){
        for(var style in styles){
            this.styles[style] = styles[style]
        }
        for(var style in styles){
            this.setParticularStyle(style)
        }
    }
    
    mouseMove(e){
        var x = e.clientX - this.bounds.left
        var y = e.clientY - this.bounds.top
    
        
        if(this.camera.moving){
            //this.camera.actualizeMoving(x,y)
            
            var t = this
            if(!this.cameratimeout)
                this.cameratimeout = setTimeout(
                function(ev){
                    t.draw()
                    t.cameratimeout = undefined
                }
                ,50)
        }
        
        this.camera.setMousePosition(x,y)
        
    }
    mouseDown(e){
        var x = e.clientX - this.bounds.left
        var y = e.clientY - this.bounds.top
        
        //this.camera.startMoving(x,y)
    }
    mouseUp(e){
        var x = e.clientX - this.bounds.left
        var y = e.clientY - this.bounds.top
    
        //this.camera.stopMoving(x,y)
        
        var t = this
        clearTimeout(this.rerendertimeout)
        this.rerendertimeout = setTimeout(
            function(ev){
                var bounds = t.getDegreeBounds()
                var pixelSize = t.camera.getPixelSize()
                t.draw()
            }
            ,50)
    }
    wheel(e){/*
        var delta = event.deltaY

        var magnification = this.camera.getMagnification()
        
        this.camera.setMagnification(magnification / (1 + delta * 0.1 ))
        
        this.draw()
        var t = this
        clearTimeout(this.rerendertimeout)
        this.rerendertimeout = setTimeout(
            function(ev){
                var bounds = t.getDegreeBounds()
                var pixelSize = t.camera.getPixelSize()
                t.draw()
            }
            ,500)*/
    }
    
    actualizeBounds(){
        var bounds = this.parentDiv.getBoundingClientRect()
        this.bounds = bounds
        
        this.initializeContext()
        
        this.setStyle(this.styles)
        this.draw()
    }
    prepareStatic(){
        for(var x_dir = -1;x_dir<=1;x_dir+=2){
            for(var y_dir = -1;y_dir<=1;y_dir+=2){
                
                var sortedFromLeft = this.gameModel.elements.filter(x=>x.static)
                var centers = {}
                var objbounds = []
                for(var i in sortedFromLeft){
                    centers[i] = sortedFromLeft[i].getCenter(this.camera,this.bounds)
                    objbounds[i] = sortedFromLeft[i].getBounds()
                }
                
                for(var i = 0;i<sortedFromLeft.length;i++){
                    for(var j = i+1;j<sortedFromLeft.length;j++){
                        if(
                           this.relation(i,j,sortedFromLeft,objbounds,x_dir,y_dir)
                        ){
                            var aux = sortedFromLeft[i]
                            sortedFromLeft[i] = sortedFromLeft[j]
                            sortedFromLeft[j] = aux
                            
                            aux = objbounds[i]
                            objbounds[i] = objbounds[j]
                            objbounds[j] = aux
                        }
                    }
                }
                
                this.staticObjectOrder[x_dir][y_dir].objects = sortedFromLeft
                this.staticObjectOrder[x_dir][y_dir].objbounds = objbounds
                
            }
        }
    }
    relation(i,j,sortedFromLeft,objbounds,x_dir,y_dir){
        return (this.relationZ(sortedFromLeft[i],sortedFromLeft[j],objbounds[i],objbounds[j]) == -1 && 
                            this.relationY(sortedFromLeft[i],sortedFromLeft[j],objbounds[i],objbounds[j]) == 0 && 
                            this.relationX(sortedFromLeft[i],sortedFromLeft[j],objbounds[i],objbounds[j]) == 0
                            ) || 
                            (this.relationY(sortedFromLeft[i],sortedFromLeft[j],objbounds[i],objbounds[j]) == y_dir && this.relationX(sortedFromLeft[i],sortedFromLeft[j],objbounds[i],objbounds[j]) == 0 || 
                                this.relationX(sortedFromLeft[i],sortedFromLeft[j],objbounds[i],objbounds[j]) == x_dir && this.relationY(sortedFromLeft[i],sortedFromLeft[j],objbounds[i],objbounds[j]) == 0
                            )
    }
    actualizeElementSize(){
        var bounds = this.parentDiv.getBoundingClientRect()
        
        this.canvasElement.width = bounds.width
        this.canvasElement.height = bounds.height-5
        
        this.bounds = bounds
    }
    
    drawPanel(){
        var y = this.bounds.height-100
        var x = this.bounds.width/2
    }
    
    draw(){
        this.clear()
        this.setStyle({strokeStyle:"#000",fillStyle:"#ddffdd",lineWidth:this.camera.magnification/2})
        this.drawGrid()
        this.drawThings()
        this.drawPanel()
        for(var i in this.additional){
            var add = this.additional[i]
            
            this.context.strokeStyle = '#08f'
            this.context.beginPath()
            this.context.moveTo(add[0],add[2])
            this.context.moveTo(add[1],add[3])
            this.context.lineTo(add[0],add[2])
            this.context.lineTo(add[1],add[3])
            this.context.stroke()
            this.context.closePath()
        }
        this.additional = []
    }
    getDegreeBounds(){
        return {
            left: this.degreeBoundsLeft,
            right: this.degreeBoundsRight,
            top: this.degreeBoundsTop,
            bottom: this.degreeBoundsBottom,
        }
    }
    compareWithCamera(a){
        var ac = a.getCenter(this.camera,this.bounds)
        var bc = [0,0,0,0,this.camera.z,this.camera.z]
        if(ac[5]-5 <= bc[4] || bc[5]-5 <= ac[4])
            return (ac[4] + ac[5] - bc[4] - bc[5])/2
        if(ac[3] < bc[2] || bc[3] < ac[2])
            return (ac[0] + ac[1] - bc[0] - bc[1])/2
        else {
            return (ac[0] + ac[1] - bc[0] - bc[1])/2
        }
    }
    objectsInZPlane(a,b){
        var objBoundsA = a.getBounds()
        var objBoundsB = b.getBounds()

        var ptsA = [ a.x+objBoundsA[0][0],a.x+objBoundsA[1][0],a.y+objBoundsA[0][1], a.y+objBoundsA[1][1] ] 
        var ptsB = [ b.x+objBoundsB[0][0],b.x+objBoundsB[1][0],b.y+objBoundsB[0][1], b.y+objBoundsB[1][1] ] 

        return ptsA[1] >= ptsB[0] && ptsB[1] >= ptsA[0] && ptsA[3] >= ptsB[2] && ptsB[3] >= ptsA[2]
    }
    objectsIntersect(a,b,ac,bc,aob,bob){
        return a.z+aob[1][2] > b.z+bob[0][2] && b.z+bob[1][2] > a.z+aob[0][2] && 
            a.x+aob[1][0] > b.x+bob[0][0] && b.x+bob[1][0] > a.x+aob[0][0] && 
            a.y+aob[1][1] > b.y+bob[0][1] && b.y+bob[1][1] > a.y+aob[0][1]
    }
    relationZ(a,b,aob,bob){
        if(a.z+aob[1][2] <= b.z+bob[0][2]){
            return 1
        }
        if(b.z+bob[1][2] <= a.z+aob[0][2]){// && this.objectsInZPlane(a,b)){// && ac[7] >= bc[6] && ac[7] >= bc[6]){
            return -1
        }
        return 0
    }
    relationX(a,b,aob,bob){
        if(a.x+aob[1][0] <= b.x+bob[0][0]){
            return 1
        }
        if(b.x+bob[1][0] <= a.x+aob[0][0]){// && this.objectsInZPlane(a,b)){// && ac[7] >= bc[6] && ac[7] >= bc[6]){
            return -1
        }
        return 0
    }
    relationY(a,b,aob,bob){
        if(a.y+aob[1][1] <= b.y+bob[0][1]){
            return 1
        }
        if(b.y+bob[1][1] <= a.y+aob[0][1]){// && this.objectsInZPlane(a,b)){// && ac[7] >= bc[6] && ac[7] >= bc[6]){
            return -1
        }
        return 0
    }
    objectAbove(a,b,ac,bc,aob,bob){
        /*
        if( a.z+aob[1][2] > b.z+bob[0][2] && b.z+bob[1][2] > a.z+aob[0][2] && 
            a.x+aob[1][0] > b.x+bob[0][0] && b.x+bob[1][0] > a.x+aob[0][0] && 
            a.y+aob[1][1] > b.y+bob[0][1] && b.y+bob[1][1] > a.y+aob[0][1])
                return 0
        */
        
        if(a.z+aob[1][2] <= b.z+bob[0][2]){// && this.objectsInZPlane(a,b)){// && ac[7] >= bc[6] && ac[7] >= bc[6]){
            return -(a.z+aob[1][2]) + (b.z+bob[0][2])
        }
        if(b.z+bob[1][2] <= a.z+aob[0][2]){// && this.objectsInZPlane(a,b)){// && ac[7] >= bc[6] && ac[7] >= bc[6]){
            return (b.z+bob[1][2]) - (a.z+aob[0][2])
        }
        
        var rot = (this.camera.getRotation() + 360) % 360
        //if(Math.random()<0.001)
        //    console.log(rot)
        
        var x_dir,y_dir
        if(rot >= 0 && rot < 90){
            x_dir = 1
            y_dir = 1
        } else if(rot >= 90 && rot < 180){
            x_dir = 1
            y_dir = -1
        } else if(rot >= 270 && rot < 360){
            x_dir = -1
            y_dir = 1
        } else {
            x_dir = -1
            y_dir = -1
        }
        
        var res_y = 0
        var res_x = 0
        if((a.y+aob[1][1]) * y_dir >= (b.y+bob[0][1]) * y_dir){// && this.objectsInZPlane(a,b)){// && ac[7] >= bc[6] && ac[7] >= bc[6]){
            res_y = (a.y+aob[1][1]) * y_dir - (b.y+bob[0][1]) * y_dir
        }
        if((b.y+bob[1][1]) * y_dir >= (a.y+aob[0][1]) * y_dir){// && this.objectsInZPlane(a,b)){// && ac[7] >= bc[6] && ac[7] >= bc[6]){
            res_y = -(b.y+bob[1][1]) * y_dir + (a.y+aob[0][1]) * y_dir
        }
        
        if((a.x+aob[1][0]) * x_dir >= (b.x+bob[0][0]) * x_dir){// && this.objectsInZPlane(a,b)){// && ac[7] >= bc[6] && ac[7] >= bc[6]){
            res_x = (a.x+aob[1][0]) * x_dir + (b.x+bob[0][0]) * x_dir
        }
        if((b.x+bob[1][0]) * x_dir >= (a.x+aob[0][0]) * x_dir){// && this.objectsInZPlane(a,b)){// && ac[7] >= bc[6] && ac[7] >= bc[6]){
            res_x = -(b.x+bob[1][0]) * x_dir + (a.x+aob[0][0]) * x_dir
        }
        
        return res_y > res_x
        /*
        return 0
        
        var pt_a_w = Math.abs(-aob[0][0]+aob[1][0])
        var pt_a_h = Math.abs(-aob[0][1]+aob[1][1])
        
        var pt_b_w = Math.abs(-bob[0][0]+bob[1][0])
        var pt_b_h = Math.abs(-bob[0][1]+bob[1][1])
        
        var axis_a_x = pt_a_w > pt_a_h + 0.001
        var axis_a_y = !axis_a_x && pt_a_h > pt_a_w + 0.001
        
        var axis_b_x = pt_b_w > pt_b_h + 0.001
        var axis_b_y = !axis_b_x && pt_b_h > pt_b_w + 0.001
                
        //if(Math.random()<0.001)
        //    console.log([axis_a_x && axis_b_x || axis_a_x && !axis_b_y || !axis_a_y && axis_a_x])
            
        if(axis_a_x && axis_b_x || axis_a_x && !axis_b_y || !axis_a_y && axis_b_x){
            //this.additional.push( [ ac[0],bc[0],ac[2],bc[2] ])
            return a.y * y_dir < b.y * y_dir
        }
        if(axis_a_y && axis_b_y || axis_a_y && !axis_b_x || !axis_a_x && axis_b_y){
            //this.additional.push( [ ac[0],bc[0],ac[2],bc[2] ])
            return a.x * x_dir < b.x * x_dir
        }/*
        if(axis_a_x && axis_b_y){
            return ac[2]+ac[3] < bc[2]+bc[3]
        }
        if(axis_a_y && axis_b_x){
            return ac[2]+bc[3] < bc[2]+bc[3]
        }*/
        /*
        if(axis_b_x && axis_a_y){
            //this.additional.push( [ ac[0],bc[0],ac[2],bc[2] ])

            if(b.y > a.y ){
                if(b.x < a.x){
                    return -b.y + (a.y + aob[1][1]) < -(b.x + bob[0][1]) + a.x
                } else {
                    return false
                }
            } else {
                if(b.x  < a.x ){
                    return true
                } else {
                    return -b.y + (a.y + aob[0][1]) < -(b.x + bob[1][1]) + a.x
                }
            }
        }
        
        if(axis_a_x && axis_b_y){
            //this.additional.push( [ ac[0],bc[0],ac[2],bc[2] ])

            if(a.y > b.y ){
                if(a.x  < b.x ){
                    return -a.y + (b.y + bob[1][1]) < -(a.x + aob[0][1]) + b.x
                } else {
                    return true
                }
            } else {
                if(a.x  < b.x ){
                    return false
                } else {
                    return -a.y + (b.y + bob[0][1]) < -(a.x + aob[1][1]) + b.x
                }
            }
        }
        
        
        if(!axis_a_x && !axis_a_y && !axis_b_x && !axis_b_y)
            return ac[2]+bc[3] < bc[2]+bc[3]// * y_dir > b.y * y_dir
        
        return null*/
    }
    objectBefore(a,b,ac,bc){/*
        if(ac[11] < bc[10] && ac[10] < bc[10] && ac[11] < bc[11] && ac[10] < bc[11]){
            return true
        }
        if(bc[11] < ac[10] && bc[10] < ac[10] && bc[11] < ac[11] && bc[10] < ac[11]){
            return false
        }*/
                    
        var alin_a = (ac[10]-ac[11]) / (ac[0]-ac[1])
        var alin_b = (ac[10] - alin_a * ac[0])
        
        
        //this.additional.push( [ ac[0],ac[1],ac[2],ac[3] ])
        
        var blin_a = (bc[10]-bc[11]) / (bc[0]-bc[1])
        var blin_b = (bc[10] - blin_a * bc[0])
        
        var przy_x,przy_y
        if(Math.abs(ac[0]-ac[1])<0.01 && Math.abs(bc[0]-bc[1])<0.01){
            return 0
        } else if(Math.abs(ac[0]-ac[1])<0.01){
            przy_y = (ac[0]+ac[1])/2
            przy_x = (przy_y - blin_b) / blin_a
        } else if(Math.abs(bc[0]-bc[1])<0.01){
            przy_y = (bc[0]+bc[1])/2
            przy_x = (przy_y - alin_b) / alin_a
        } else {
            przy_x = (alin_b - blin_b) / (blin_a - alin_a)
            przy_y = blin_a * przy_x + blin_b
        }
        //this.additional.push( [ przy_x,przy_x+10,przy_y,przy_y ])
        /*
        var win_a = (bc[0]-bc[1]) != 0 && (ac[10] > blin_a * ac[0] + blin_b && ac[11] > blin_a * ac[1] + blin_b 
            || bc[10] <= alin_a * bc[0] + alin_b && bc[11] <= alin_a * bc[1] + alin_b)
            
        var win_b = (ac[0]-ac[1]) != 0 && (bc[10] > alin_a * bc[0] + alin_b && bc[11] > alin_a * bc[1] + alin_b
            || ac[10] <= blin_a * ac[0] + blin_b && ac[11] <= blin_a * ac[1] + blin_b)
          */
        
        //if(a instanceof Cube && b instanceof Cube)
        //    this.additional.push( [ ac[0],bc[0],ac[2],bc[2] ])
        
        //var win_a = (ac[10] > przy_y && ac[11] > przy_y || bc[10] < przy_y && bc[11] < przy_y)
        //var win_b = (bc[10] > przy_y && bc[11] > przy_y || ac[10] < przy_y && ac[11] < przy_y)
                        
        
        if(Math.abs(alin_a - blin_a) < 0.01){

            if(alin_b < blin_b)
                return 1
            if(alin_b > blin_b)
                return -1
            
        }
            

        var poz_a = Math.min(przy_x - ac[0], ac[1] - przy_x)
        var poz_b = Math.min(przy_x - bc[0], bc[1] - przy_x)
        
        if(poz_a < 0 && poz_b > 0)
            return -1
        if(poz_a > 0 && poz_b < 0)
            return 1
        
        
        
        /*if(win_b && !win_a)
            return true
        if(!win_b && win_a)
            return false
            
        if(win_a && win_b){
            if(this.dist(przy_x,przy_y, bc[0],bc[10]) < this.dist(przy_x,przy_y, ac[0],ac[10]) && 
                this.dist(przy_x,przy_y, bc[0],bc[10]) < this.dist(przy_x,przy_y, ac[1],ac[11]) ||
                this.dist(przy_x,przy_y, bc[1],bc[11]) < this.dist(przy_x,przy_y, ac[0],ac[10]) && 
                this.dist(przy_x,przy_y, bc[1],bc[11]) < this.dist(przy_x,przy_y, ac[1],ac[11]))
                    return true
            if(this.dist(przy_x,przy_y, bc[0],bc[10]) > this.dist(przy_x,przy_y, ac[0],ac[10]) && 
                this.dist(przy_x,przy_y, bc[1],bc[11]) > this.dist(przy_x,przy_y, ac[0],ac[10]) ||
                this.dist(przy_x,przy_y, bc[0],bc[10]) > this.dist(przy_x,przy_y, ac[1],ac[11]) && 
                this.dist(przy_x,przy_y, bc[1],bc[11]) > this.dist(przy_x,przy_y, ac[1],ac[11]))
                    return false
        }*//*
        this.additional.push( [ ac[0],ac[1],ac[2],ac[3] ])
        this.additional.push( [ bc[0],bc[1],bc[2],bc[3] ])
        */
        /*
        
        if(ac[5] > bc[4])
            return true
        if(bc[5] < ac[4])
            return false*/
        return 0//bc[11] > ac[11]
    }
    dist(p10,p11,p20,p21){
        return Math.sqrt(Math.pow(p10 - p20,2) + Math.pow(p11 - p21,2))
    }
    compareTwoObjects(a,b,ac,bc){
        //var ac = a.getCenter(this.camera,this.bounds)
        //var bc = b.getCenter(this.camera,this.bounds)
        
        var awon = -1
        var bwon = 1
        //this.additional.push( [ac[0],ac[1],ac[2],ac[3] ])
                
        //if(ac[5]-20 <= bc[4] || bc[5]-20 <= ac[4])
        //    return (ac[4] + ac[5] - bc[4] - bc[5])/2
        
            
        if(ac[5]-5 < bc[4])// && bc[5]-5 > ac[4])
            return bwon
        if(bc[5]-5 < ac[4])// && ac[5]-5 > bc[4])
            return awon

        //return ac[3] - bc[3]
        
        var apoint = Math.abs(ac[0] - ac[1])<5 && Math.abs(ac[2] - ac[3])<5// || (ac[1] < bc[0] || bc[1] < ac[0]) && (ac[3] < bc[2] || bc[3] < ac[2])
        var bpoint = Math.abs(bc[0] - bc[1])<5 && Math.abs(bc[2] - bc[3])<5// || (ac[1] < bc[0] || bc[1] < ac[0]) && (ac[3] < bc[2] || bc[3] < ac[2])
        
        //return (ac[2] + ac[3]) / 2 > (bc[2] + bc[3]) / 2 ? awon : bwon
        if(apoint && bpoint){
            if(ac[2] < bc[2])
                return bwon
            else
                return awon
        }
        
        //if(ac[1]+20 < bc[0] && bc[1] > ac[0] || bc[1]+20 < ac[0] && ac[1] > bc[0])
        //    return ac[2] > bc[2] ? awon : bwon
            
        if(apoint && !bpoint){
            //this.additional.push( [ bc[0],bc[1],bc[2]-4,bc[3] ])
            var blin_a = (bc[2]-bc[3]) / (bc[0]-bc[1])
            var blin_b = (bc[2] - blin_a * bc[0])
            if(ac[2] < blin_a * ac[0] + blin_b)
                return bwon
            else
                return awon
            
        }
        if(bpoint && !apoint){
            //this.additional.push( [ ac[0],ac[1],ac[2]-4,ac[3] ])
            var alin_a = (ac[2]-ac[3]) / (ac[0]-ac[1])
            var alin_b = (ac[2] - alin_a * ac[0])
            if(bc[2] < alin_a * bc[0] + alin_b){
                return awon
            } else
                return bwon
            
        } 
        if(!apoint && !bpoint){
            var alin_a = (ac[2]-ac[3]) / (ac[0]-ac[1])
            var alin_b = (ac[2] - alin_a * ac[0])
            
            this.additional.push( [ ac[0],ac[1],alin_a*ac[0] + alin_b,alin_a*ac[1] + alin_b ])
            
            var blin_a = (bc[2]-bc[3]) / (bc[0]-bc[1])
            var blin_b = (bc[2] - blin_a * bc[0])
            
            if(Math.abs(alin_a - blin_a) < 0.001){
                //this.additional.push( [ ac[0],bc[0],ac[2],bc[2] ])
                //this.additional.push( [ ac[0],ac[1],ac[2]-4,ac[3] ])
                
                if(alin_b > blin_b)
                    return awon
                if(alin_b < blin_b)
                    return bwon
            }

            var prz_x = (alin_b - blin_b) / (blin_a - alin_a)
            var prz_y = blin_a * prz_x + blin_b
            
            
            var win_a = ac[2] >= prz_y && ac[3] >= prz_y || bc[2] < prz_y && bc[3] < prz_y
            var win_b = bc[2] >= prz_y && bc[3] >= prz_y || ac[2] < prz_y && ac[3] < prz_y
            
            if(win_a && !win_b)
                return awon
                
            if(win_b && !win_a)
                return bwon
        }
        return ac[2] > bc[2] ? awon : bwon
        /*if(ac[3] < bc[2] || bc[3] < ac[2])
            return (ac[0] + ac[1] - bc[0] - bc[1])/2
        else {
            return (ac[0] + ac[1] - bc[0] - bc[1])/2
        }*/
        /*
        if(ac[2] <= bc[2] && ac[2] <= bc[3] && ac[3] <= bc[2] && ac[3] <= bc[3]){
            return awon
        }
        if(bc[2] <= ac[2] && bc[2] <= ac[3] && bc[3] <= ac[2] && bc[3] <= ac[3]){
            return bwon
        }*//*
        var awon_possible = 0
        var bwon_possible = 0
        
        if(Math.abs(ac[0] - ac[1]) >= 1){
            var alin_a = (ac[2]-ac[3]) / (ac[0]-ac[1])
            var alin_b = (ac[2] - alin_a * ac[0])
            
            //this.additional.push( [ bc[0],bc[1],bc[0] * alin_a + alin_b,bc[1] * alin_a + alin_b ])
            
            if(bc[0] * alin_a + alin_b <= bc[2] && bc[1] * alin_a + alin_b <= bc[3]){
                bwon_possible = 1
            }
        }
        
        if(Math.abs(bc[0] - bc[1]) >= 1){
            var alin_a = (bc[2]-bc[3]) / (bc[0]-bc[1])
            var alin_b = (bc[2] - alin_a * bc[0])
            
            //this.additional.push( [ ac[0],ac[1],ac[0] * alin_a + alin_b,ac[1] * alin_a + alin_b ])
            if(ac[0] * alin_a + alin_b <= ac[2] && ac[1] * alin_a + alin_b <= ac[3]){
                awon_possible = 1
            }
        }
        if(awon_possible - bwon_possible == 0){
            if(ac[2] > bc[2] && ac[2] > bc[3])
                return awon
            if(ac[3] > bc[2] && ac[3] > bc[3])
                return awon
            if(bc[2] > ac[2] && bc[2] > ac[3])
                return bwon
            if(bc[3] > ac[2] && bc[3] > ac[3])
                return bwon
        }
        
        return awon_possible && !bwon_possible ? awon : bwon_possible && !awon_possible ? bwon : 0
         */   
//         if(ac instanceof Array){
//             if(bc instanceof Array)
//                 bc = (bc[0] + bc[1]) / 2
//             return ac[0] == ac[1] ? ac[0] > bc : ac[0] + (this.camera.getAbsoluteX(b.x,b.y,this.bounds) - ac[2]) / (ac[3] - ac[2]) * (ac[1] - ac[0]) > bc
//         } else if(bc instanceof Array) {
//             return bc[0] == bc[1] ? ac > bc[0] : ac > bc[0] + (this.camera.getAbsoluteX(a.x,a.y,this.bounds) - bc[2]) / (bc[3] - bc[2]) * (bc[1] - bc[0])
//         } else {
//             return ac > bc
//         }
    }
    drawThings(){
        this.setStyle({strokeStyle:"#000",fillStyle:"#fff",lineWidth:this.camera.magnification})
        //var things = this.gameModel.elements.filter(x=>this.camera.checkIfFits(x,this.bounds))
        //var sortedFromLeft = things.sort((a,b) => a.getCenter(this.camera,this.bounds)[6] - b.getCenter(this.camera,this.bounds)[6])
        /*
        var relation_x = {}
        var relation_y = {}
        var relation_z = {}
        var todelete = {}
        var centers = {}
        var objbounds = []
        for(var i in sortedFromLeft){
            objbounds[i] = sortedFromLeft[i].getBounds()
        }*/
        
        
        var rot = ((this.camera.getRotation()) % 360 + 720) % 360
        //if(Math.random()<0.001)
        //    console.log(rot)
        
        var x_dir,y_dir
        if(rot >= 0 && rot < 90){
            x_dir = 1
            y_dir = 1
        } else if(rot >= 90 && rot < 180){
            x_dir = 1
            y_dir = -1
        } else if(rot >= 270 && rot < 360){
            x_dir = -1
            y_dir = 1
        } else {
            x_dir = -1
            y_dir = -1
        }
        if(this.staticObjectOrder == undefined)
            return
        //things = things.sort((a,b) => a.getCenter(this.camera,this.bounds)[4] - b.getCenter(this.camera,this.bounds)[5])
        var things = this.staticObjectOrder[x_dir][y_dir].objects.filter(x=>this.camera.checkIfFits(x,this.bounds))
        //var objbounds = this.staticObjectOrder[x_dir][y_dir].objbounds.slice()

        var notSolid = this.gameModel.elements.filter(x => !x.static).filter(x=>this.camera.checkIfFits(x,this.bounds)).sort((a,b) => a.getCenter(this.camera,this.bounds)[3] - b.getCenter(this.camera,this.bounds)[2])
        var objbounds = []
        things = things.concat(notSolid)
        for(var i in things){
            objbounds[i] = things[i].getBounds()
        }
        
        for(var i = notSolid.length-1;i>=0;i--){
            for(var j = things.length-1;j>=1;j--){
                if(
                    (!things[j-1].static || !things[j].static) && 
                    ((things[j-1].static || things[j].static) && (!this.relation(j,j-1,things,objbounds,x_dir,y_dir)) || 
                        (!things[j-1].static && !things[j].static && (things[j].z-5 < things[j-1].z || objbounds[j][3] < objbounds[j-1][2])
                    ))
                ){
                    var aux = things[j-1]
                    things[j-1] = things[j]
                    things[j] = aux
                    
                    aux = objbounds[j-1]
                    objbounds[j-1] = objbounds[j-1]
                    objbounds[j] = aux
                }
            }
        }
        
        
        for(var i in things){
            this.drawThing(things[i].getThing(),things[i].rotation,things[i].hidable && this.checkHide(things[i],objbounds[i]))
        }
        /*
        for(var i in sortedFromLeft){
            var a = sortedFromLeft[i]

            for(var j = i-(-1);j<sortedFromLeft.length;j++){
                var b = sortedFromLeft[j]
                
                if(centers[i][7] <= centers[j][6] || centers[j][7] <= centers[i][6]){
                    break
                }
                //if(a instanceof Cube && b instanceof Cube)
                //this.additional.push( [centers[i][0],centers[j][0],centers[i][2],centers[j][2] ])
                
                //var cont = false
                //for(var k = 0;k < sortedFromLeft.length;k++){
                //    if(relations[i][k] && relations[k][j] || relations[j][k] && relations[k][i]){
                //         cont = true
                //         break
                //    }
                        
                //}
                //if(cont)
                //    continue
                    
                if(this.objectAbove(a,b,centers[i],centers[j],objbounds[i],objbounds[j]) > 0){// || this.objectAbove(b,a,centers[j],centers[i],objbounds[i],objbounds[j]) == -1){
                    relations[i][j] = true
                } else if(this.objectAbove(b,a,centers[j],centers[i],objbounds[j],objbounds[i]) > 0){// || this.objectAbove(a,b,centers[i],centers[j],objbounds[i],objbounds[j]) == -1){                    
                    relations[j][i] = true
                }

                    //delete relations[i][j]
                    //delete relations[j][i]
            }
        }        
        for(var i in relations){
            for(var j in relations[i]){ 
                for(var k in relations[j]){
                    //delete relations[i][k]
                }
            }
        }
        
        var newThings = []
        //console.log(waiting,added)
        
        var notadded = Object.keys(sortedFromLeft)
        var k = 0
        while(notadded.length > 0 && k < 100){
            k++
            var refs = {}
            for(var i in notadded){
                var val = notadded[i]
                refs[val] = 0
            }
            for(var i in notadded){
                var val = notadded[i]
                for(var j in relations[val]){
                    refs[j]++
                }
            }
            var minref = Infinity
            
            for(var i in notadded){
                var val = notadded[i]

                if(refs[val] < minref){
                    minref = refs[val]
                }
            }
            //console.log(minref)
            //console.log(notadded.length)
            var toadd = notadded.filter(x => refs[x] <= minref)//.sort((a,b) => -this.objectBefore(sortedFromLeft[a],sortedFromLeft[b],centers[a],centers[b]))
            for(var i in toadd){
                newThings.push(sortedFromLeft[toadd[i]])
            }
            notadded = notadded.filter(x => refs[x] > minref)
        }*/
        //console.log(relations)
        //throw new Error()
        
        //things = newThings//sortedFromLeft
        //things = things.sort((a,b)=>this.compareTwoObjects(a,b))
        /*this.camera.getAbsoluteY(a.x,a.y,this.bounds)-this.camera.getAbsoluteY(b.x,b.y,this.bounds)*///)
        /*for(var i = 1;i<things.length;i++){
            for(var j = i;j<things.length;j++){
                var diff = this.compareTwoObjects(things[i],things[j])
                if(diff == -1){
                    var aux = things[i]
                    things[i] = things[i-1]
                    things[i-1] = aux
                }
            }
        }*/
    }
    checkHide(thing, objbounds){
        return this.camera.checkIfFits(thing,{left:0,top:0,width:0,height:0}) && this.compareWithCamera(thing) > 25 || this.relationZ(thing,this.camera,objbounds,this.camera.dummyBounds) == -1 && this.relationX(thing,this.camera,objbounds,this.camera.dummyBounds) == 0 && this.relationY(thing,this.camera,objbounds,this.camera.dummyBounds) == 0
    }
    drawThing(rendered,rotation,tohide){
        var r = rotation
        var t = this
        var objs = rendered.objs.sort((a,b)=>-t.getThingPosition(a,r)+t.getThingPosition(b,r))
        for(var i in objs){
            var obj = objs[i]
            this.setStyle({strokeStyle:(obj.stroke ? obj.stroke : "#000"),fillStyle:(tohide ? "#00000000" : obj.fill ? obj.fill : "#fff"),lineWidth:this.camera.magnification/2})
            switch(obj.type){
                case "line":
                    this.drawPolyLine(obj.coords,false,rendered.x,rendered.y,rendered.z,rendered.rotation)
                    break
                case "polygon":
                    this.drawPolygon(obj.coords,false,rendered.x,rendered.y,rendered.z,rendered.rotation)
                    break
                case "ball":
                    this.drawBall(obj.coords,false,rendered.x,rendered.y,rendered.z)
                    break
                case "text":
                    this.drawText(obj.text,obj.size,obj.textAlign,obj.coord,false,rendered.x,rendered.y,rendered.z)
                    break
            }
        }
    }
    drawThingFrontally(x,y,item){
        var objs = item.getDisplay()
        var translation = item.getTranslation()
        
        for(var i in objs){
            var obj = objs[i]
            this.setStyle({strokeStyle:(obj.stroke ? obj.stroke : "#000"),fillStyle:(obj.fill ? obj.fill : "#fff"),lineWidth:this.camera.magnification/2})
            switch(obj.type){
                case "line":
                    this.drawPolyLineFrontally(obj.coords,false,x,y,0,translation)
                    break
                case "polygon":
                    this.drawPolygonFrontally(obj.coords,false,x,y,0,translation)
                    break
                case "ball":
                    this.drawBallFrontally(obj.coords,false,x,y,0,translation)
                    break
            }
        }
    }
    getThingPosition(obj,rotation){
        switch(obj.type){
            case "line":
            case "polygon":
            case "ball":
                var summed = obj.coords.reduce((a,b)=>([a[0]+b[0],a[1]+b[1],a[2]+b[2]]),[0,0,0])
                    
                var ret = this.camera.getRelativeY(summed[0]/obj.coords.length,summed[1]/obj.coords.length,rotation*Math.PI/180)
                return ret
                break
        }
    }
    drawGrid(){
        var cam = this.camera
        this.bounds = this.parentDiv.getBoundingClientRect()
        
        var widthInDegrees = this.bounds.width/cam.getMagnification()
        var heightInDegrees = this.bounds.height/cam.getMagnification()

        var gridScale = Math.pow(10, Math.ceil( Math.log10 ( 20 / cam.getMagnification() ) ) )
        
        var rot = (cam.getRotation()) / 180 * Math.PI
    
        this.degreeBoundsLeft = - widthInDegrees
        this.degreeBoundsRight = + widthInDegrees
        this.degreeBoundsTop = - heightInDegrees
        this.degreeBoundsBottom = + heightInDegrees
        
        var skewed = cam.getSkewed()
        
        var leftScaled = Math.ceil( this.degreeBoundsLeft / gridScale ) * gridScale
        var topScaled = Math.ceil( this.degreeBoundsTop / gridScale / skewed ) * gridScale
        var rightScaled = Math.ceil( this.degreeBoundsRight / gridScale ) * gridScale
        var bottomScaled = Math.ceil( this.degreeBoundsBottom / gridScale / skewed ) * gridScale
        
        var leftScaled = Math.max(leftScaled-gridScale,-180*4)
        var rightScaled = Math.min(rightScaled+gridScale,180*4)
        var topScaled = Math.max(topScaled-gridScale,-90*4)
        var bottomScaled = Math.min(bottomScaled+gridScale,90*4)
        
        this.setStyle({strokeStyle:"#1110"})
        
        for(var d = leftScaled;d <= rightScaled;d+=gridScale){
            this.drawLine(d,topScaled,d,bottomScaled)
        }
        this.drawLine(rightScaled,topScaled,rightScaled,bottomScaled)
        
        for(var d = topScaled;d <= bottomScaled;d+=gridScale){
            this.drawLine(leftScaled,d,rightScaled,d)
        }
        this.drawLine(leftScaled,bottomScaled,rightScaled,bottomScaled)
        
        //console.log(widthInDegrees+" "+heightInDegrees+" "+gridScale)
    }
}
class WebGLCanvas extends AbstractCanvas {
    initializeContext(){
        this.context = this.canvasElement.getContext("webgl") || this.canvasElement.getContext("experimental-webgl")
    }
    drawLine(x1,y1,x2,y2){
        
    }
}
class TwoDCanvas extends AbstractCanvas {
    initializeContext(){
        this.context = this.canvasElement.getContext("2d")
    }
    setParticularStyle(style){
        switch(style){
            case "lineWidth":
                this.context.lineWidth = this.styles[style]
                break
            case "strokeStyle":
                this.context.strokeStyle = this.styles[style]
                break
            case "fillStyle":
                this.context.fillStyle = this.styles[style]
                break
            case "textSize":
            case "font":
                this.context.font = this.styles["textSize"] + "px " + this.styles["font"]
                break
        }
    }
    clear(){
        this.context.clearRect(0,0,this.bounds.width,this.bounds.height)
        this.context.fillStyle = "#000"
        this.context.fillRect(0,0,this.bounds.width,this.bounds.height)
    }
    drawLine(x1,y1,x2,y2,z1,z2){
        var points1x = this.camera.degreesToPixels(x1,y1,this.bounds,true,z1)
        var points1y = this.camera.degreesToPixels(x1,y1,this.bounds,false,z1)
        var points2x = this.camera.degreesToPixels(x2,y2,this.bounds,true,z2)
        var points2y = this.camera.degreesToPixels(x2,y2,this.bounds,false,z2)
        
        this.context.beginPath()
        this.context.moveTo(points1x,points1y)
        this.context.lineTo(points2x,points2y)
        this.context.stroke()
        this.context.closePath()
    }
    drawPoint(x,y){
        var pointx = this.camera.degreesToPixels(x,y,this.bounds,true)
        var pointy = this.camera.degreesToPixels(x,y,this.bounds,false)
        
        this.context.beginPath()
        this.context.moveTo(pointx-2.5,pointy)
        this.context.lineTo(pointx+2.5,pointy)
        this.context.stroke()
        
        this.context.beginPath()
        this.context.moveTo(pointx,pointy-2.5)
        this.context.lineTo(pointx,pointy+2.5)
        this.context.stroke()
    }
    drawPolyLine(line, closed,x,y,z,rotation){
        
        if(line.length === 0)
            return
            
        this.context.beginPath()
        
        var sin = Math.sin(rotation*Math.PI/180)
        var cos = Math.cos(rotation*Math.PI/180)
        
        var x1,y1
        for(var point in line){
            var pointx = this.camera.degreesToPixels(
                line[point][0]*cos+line[point][1]*sin+x,
                -line[point][0]*sin+line[point][1]*cos+y,
                this.bounds,true,line[point][2]+z)
            var pointy = this.camera.degreesToPixels(
                line[point][0]*cos+line[point][1]*sin+x,
                -line[point][0]*sin+line[point][1]*cos+y,
                this.bounds,false,line[point][2]+z)
            
            if(point === 0){
                this.context.moveTo(pointx,pointy)  
                x1 = pointx
                y1 = pointy
            } else
                this.context.lineTo(pointx,pointy)
        }
        if(closed)
            this.context.lineTo(x1,y1)
        this.context.stroke()
        //if(closed)
        //    this.context.fill()
        this.context.closePath()
    }
    drawBall(coords, closed,x,y,z){        
        if(coords.length === 0)
            return
            
        this.context.beginPath()
            
        var point1x = this.camera.degreesToPixels(coords[0][0]+x,coords[0][1]+y,this.bounds,true,coords[0][2]+z)
        var point1y = this.camera.degreesToPixels(coords[0][0]+x,coords[0][1]+y,this.bounds,false,coords[0][2]+z)
        var point2x = this.camera.degreesToPixels(coords[1][0]+x,coords[1][1]+y,this.bounds,true,coords[1][2]+z)
        var point2y = this.camera.degreesToPixels(coords[1][0]+x,coords[1][1]+y,this.bounds,false,coords[1][2]+z)
        
        var cx = (point2x+point1x)/2
        var cy = (point2y+point1y)/2
        var rx = Math.max(Math.abs(coords[0][0]-coords[1][0]),Math.abs(coords[0][1]-coords[1][1])) * this.camera.getMagnification()/2
        var ry = (
            Math.abs(coords[0][2]-coords[1][2]) * this.camera.getMagnification() * this.camera.getAntiSkewed()/2
            +
            rx * (1 - this.camera.getAntiSkewed()))
        
        this.context.save(); // save state
        this.context.beginPath();

        this.context.translate(cx-rx, cy-ry);
        this.context.scale(rx, ry);
        this.context.arc(1, 1, 1, 0, 2 * Math.PI, false);

        this.context.restore(); // restore to original state
        
        this.context.fill()
        this.context.stroke()
    }
    drawText(text,size,textAlign,coord,closed,x,y,z){        
        if(coord.length === 0)
            return
            
        this.context.beginPath()
            
        var pointx = this.camera.degreesToPixels(x+coord[0],y+coord[1],this.bounds,true,z+coord[2])
        var pointy = this.camera.degreesToPixels(x+coord[0],y+coord[1],this.bounds,false,z+coord[2])
        /*
        var point1x = this.camera.degreesToPixels(coords[0][0]+x,coords[0][1]+y,this.bounds,true,coords[0][2]+z)
        var point1y = this.camera.degreesToPixels(coords[0][0]+x,coords[0][1]+y,this.bounds,false,coords[0][2]+z)
        var point2x = this.camera.degreesToPixels(coords[1][0]+x,coords[1][1]+y,this.bounds,true,coords[1][2]+z)
        var point2y = this.camera.degreesToPixels(coords[1][0]+x,coords[1][1]+y,this.bounds,false,coords[1][2]+z)
        */
        /*
        var cx = (point2x+point1x)/2
        var cy = (point2y+point1y)/2
        var rx = Math.max(Math.abs(coords[0][0]-coords[1][0]),Math.abs(coords[0][1]-coords[1][1])) * this.camera.getMagnification()/2
        var ry = (
            Math.abs(coords[0][2]-coords[1][2]) * this.camera.getMagnification() * this.camera.getAntiSkewed()/2
            +
            rx * (1 - this.camera.getAntiSkewed()))
        
        this.context.save(); // save state
        this.context.beginPath();

        this.context.translate(cx-rx, cy-ry);
        this.context.scale(rx, ry);
        this.context.arc(1, 1, 1, 0, 2 * Math.PI, false);

        this.context.restore(); // restore to original state
        */
        
        this.context.font = Math.floor((size ? size : 10) * this.camera.getMagnification()) + "px Helvetica"
        this.context.textAlign = textAlign ? textAlign : 'center'

        this.context.fillText(text,pointx,pointy)
        this.context.strokeText(text,pointx,pointy)
    }
    drawPolygon(line, closed,x,y,z,rotation){
        if(line.length === 0)
            return
            
        this.context.beginPath()
        
        var sin = Math.sin(rotation*Math.PI/180)
        var cos = Math.cos(rotation*Math.PI/180)
        
        var x1,y1
        for(var point in line){
            var pointx = this.camera.degreesToPixels(
                line[point][0]*cos+line[point][1]*sin+x,
                -line[point][0]*sin+line[point][1]*cos+y,
                this.bounds,true,line[point][2]+z)
            var pointy = this.camera.degreesToPixels(
                line[point][0]*cos+line[point][1]*sin+x,
                -line[point][0]*sin+line[point][1]*cos+y,
                this.bounds,false,line[point][2]+z)
            
            if(point === 0){
                this.context.moveTo(pointx,pointy)  
                x1 = pointx
                y1 = pointy
            } else
                this.context.lineTo(pointx,pointy)
        }
            this.context.lineTo(x1,y1)
        this.context.closePath()
        this.context.fill()
        this.context.stroke()
    }
    drawPolyLineFrontally(line, closed,x,y,z,translation){
        
        if(line.length === 0)
            return
        
        if(translation == undefined)
            translation = [1,2]
            
        this.context.beginPath()
        
        
        var x1,y1
        for(var point in line){
            var pointx = x + line[point][Math.abs(translation[0])-1] * (translation[0] > 0 ? 1 : -1)
            var pointy = y + line[point][Math.abs(translation[1])-1] * (translation[1] > 0 ? 1 : -1)
            
            if(point === 0){
                this.context.moveTo(pointx,pointy)  
                x1 = pointx
                y1 = pointy
            } else
                this.context.lineTo(pointx,pointy)
        }
        if(closed)
            this.context.lineTo(x1,y1)
        this.context.stroke()
        //if(closed)
        //    this.context.fill()
        this.context.closePath()
    }
    drawPolygonFrontally(line, closed, x, y, z, translation){
        if(line.length === 0)
            return
        
        if(translation == undefined)
            translation = [1,2]
            
        this.context.beginPath()
        
        var x1,y1
        for(var point in line){
            var pointx = x + line[point][Math.abs(translation[0])-1] * (translation[0] > 0 ? 1 : -1)
            var pointy = y + line[point][Math.abs(translation[1])-1] * (translation[1] > 0 ? 1 : -1)
            
            if(point === 0){
                this.context.moveTo(pointx,pointy)  
                x1 = pointx
                y1 = pointy
            } else
                this.context.lineTo(pointx,pointy)
        }
            this.context.lineTo(x1,y1)
        this.context.closePath()
        this.context.fill()
        this.context.stroke()
    }
}
class Controller {
    constructor(canvas, gameModel){
        this.moving = false
        this.canvas = canvas
        this.gameModel = gameModel
        window.addEventListener("mousemove",e=>this.mouseMove(e))
        window.addEventListener("mouseup",e=>this.mouseUp(e))
        window.addEventListener("resize",e=>this.windowResize(e))
        
        /*
        this.canvas.canvasElement.addEventListener("mousedown",e=>this.canvas.mouseDown(e))
        this.canvas.canvasElement.addEventListener("mousemove",e=>this.canvas.mouseMove(e))
        this.canvas.canvasElement.addEventListener("mouseup",e=>this.canvas.mouseUp(e))
        this.canvas.canvasElement.addEventListener("wheel",e=>this.canvas.wheel(e))
        */
        
        
        this.actualizeRightPanel()
        this.timeout = undefined
    }
    mouseDown(e){
        this.moving = true
        this.startX = e.clientX;
    }
    mouseMove(e){
        if(this.moving){
            var x = e.clientX;
            var newx = x-this.startX+this.startpos;
            var lwidth = Math.max(100,newx)
            this.actualizeRightPanel()
            //this.rightpanel.style.marginLeft = (lwidth + 20)+"px"
        }
    }
    mouseUp(e){
        this.moving = false
        this.canvas.mouseUp(e)
    }
    wheel(e){
        this.canvas.wheel(e)
    }
    windowResize(e){
        this.actualizeRightPanel()
    }
    actualizeRightPanel(){
        var bodywidth = document.body.getBoundingClientRect().width
        
        this.canvas.actualizeElementSize()
        
        var t = this
        clearTimeout(this.timeout)
        this.timeout = setTimeout(
            function(ev){
                t.canvas.actualizeBounds()
            }
            ,50)
    }
}
function detectWebGL(){
    var canvas = document.createElement("canvas");
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return gl && gl instanceof WebGLRenderingContext
}
function loadCanvas(json){
    
}
function init(){
    let stageDiv = document.getElementById("stage")
    let canvasElement = document.getElementById("canv")
    
    fetch('static/data/stars.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(json => {
        let gameModel = new GameModel(json)
        
        let canvas
        if(false && detectWebGL()){
            canvas = new WebGLCanvas(canvasElement,stageDiv,gameModel)
        } else {
            canvas = new TwoDCanvas(canvasElement,stageDiv,gameModel)
        }
        let movlist = new Controller(canvas,gameModel);
        
        gameModel.addCanvas(canvas)
        
        canvas.actualizeBounds()
    })/*
    .catch(function () {
    })*/

    
}
addEventListener("load",init);

