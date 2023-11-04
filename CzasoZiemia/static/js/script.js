
class Camera {
    constructor(oldCamera){
        this.x = 0
        this.y = 0
        this.startx = this.x
        this.starty = this.y
        this.startmovx = 0
        this.startmovy = 0
        this.movx = 0
        this.movy = 0
        this.magnification = 4
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
    
    getMouseX() { return this.mouseX }
    getMouseY() { return this.mouseY }
    setMousePosition(x,y) { this.mouseX = x; this.mouseY = y}
    
    degreesToPixels(x,y,bounds,getx){
        return getx 
                ? 
            (this.x + x) * this.magnification + bounds.width/2
                :
            -(this.y + y) * this.magnification + bounds.height/2
    }
    
    pixelsToDegrees(x,y,bounds,getx){
        return getx 
                ?
            (x - bounds.width/2) / this.magnification - this.x
                :
            -(y - bounds.height/2) / this.magnification - this.y
    }
    
    getPixelSize(){
        this.pixelSize = 1 / this.magnification
        return this.pixelSize
    }
    
    // (number of pixels)/1degree, not incremented, but multiplied by a factor
    getMagnification(){ return this.magnification }
    setMagnification(magnification){ 
        var MIN_MAGNIFICATION = 0.5
        var MAX_MAGNIFICATION = 1000000
        this.magnification = magnification

        if(this.magnification < MIN_MAGNIFICATION)
            this.magnification = MIN_MAGNIFICATION
        else if(this.magnification > MAX_MAGNIFICATION)
            this.magnification = MAX_MAGNIFICATION
    }
    
    getMagFactor(){
        return 4 / this.magnification
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
    movedSignificantly(movx,movy){
        if(this.startmovx == null)
            return false
        var DIFF = 2
        return Math.abs(movx-this.startmovx) >= DIFF || Math.abs(movy-this.startmovy) >= DIFF
    }
    revertMoving(){
        if(this.startx != null){
            this.x = this.startx
            this.y = this.starty
        }
    }
    getDegrees(){
        
    }
    
}
class AbstractCanvas {
    constructor(canvasElement,parentDiv,layerPanel,additionalCanvas,timeControl){
        this.canvasElement = canvasElement
        this.canvasElement2 = additionalCanvas
        this.parentDiv = parentDiv
        this.layerPanel = layerPanel
        this.bounds = null
        this.layerdata = null
        this.timeControl = timeControl
        
        var th = this
        this.timeControl.setListener((date)=>{
            th.layerPanel.setGlobalDate(date)
            th.layerPanel.renderLayers()
            th.draw()
        })
        
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
        
        this.actualizeBounds()
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
            this.camera.actualizeMoving(x,y)
            
            this.layerPanel.notifyMouseMove(
                this.camera.pixelsToDegrees(x,y,this.bounds,true),
                this.camera.pixelsToDegrees(x,y,this.bounds,false),
                this.getDegreeBounds()
            )
            
            var t = this
            if(!this.cameratimeout)
                this.cameratimeout = setTimeout(
                function(ev){
                    t.draw()
                    t.cameratimeout = undefined
                }
                ,100)
        }
        
        this.camera.setMousePosition(x,y)
        
        if(!this.camera.moving)
            actualizeBottomWithCoords(this.camera, this.bounds)
    }
    mouseDown(e){
        var x = e.clientX - this.bounds.left
        var y = e.clientY - this.bounds.top
        this.layerPanel.notifyMouseDown(
            this.camera.pixelsToDegrees(x,y,this.bounds,true),
            this.camera.pixelsToDegrees(x,y,this.bounds,false),
            this.getDegreeBounds()
        )
        
        this.camera.startMoving(x,y)
    }
    keypress(e){
        if(this.layerPanel.notifyKeyPress(e.key)){
            this.draw()
        }
    }
    mouseUp(e){
        var x = e.clientX - this.bounds.left
        var y = e.clientY - this.bounds.top
    
        this.camera.stopMoving()
        if(this.camera.movedSignificantly(x,y)){
            actualizeBottomWithCoords(this.camera, this.bounds)
            this.layerPanel.notifyStopMoving(
                this.camera.pixelsToDegrees(x,y,this.bounds,true),
                this.camera.pixelsToDegrees(x,y,this.bounds,false),
                this.getDegreeBounds()
            )
            
            var t = this
            clearTimeout(this.rerendertimeout)
            this.rerendertimeout = setTimeout(
                function(ev){
                    var bounds = t.getDegreeBounds()
                    var pixelSize = t.camera.getPixelSize()
                    t.layerPanel.renderLayers(bounds, pixelSize)
                    t.draw()
                }
                ,500)
        } else {
            this.camera.revertMoving()
            if(this.layerPanel.notifyClick(
                this.camera.pixelsToDegrees(x,y,this.bounds,true),
                this.camera.pixelsToDegrees(x,y,this.bounds,false),
                this.getDegreeBounds(),
                1/this.camera.magnification * 30,
                this.camera.magnification
            ))
                this.draw(this.layerPanel.dontUpdateAllWhenClick())
        }
        
    }
    wheel(e){
        var delta = event.deltaY > 0 ? 1 : -1

        var magnification = this.camera.getMagnification()
        
        this.camera.setMagnification(magnification * Math.pow(0.5,delta))
        
        actualizeBottomWithCoords(this.camera, this.bounds)
        this.draw()
        var t = this
        clearTimeout(this.rerendertimeout)
        this.rerendertimeout = setTimeout(
            function(ev){
                var bounds = t.getDegreeBounds()
                var pixelSize = t.camera.getPixelSize()
                t.layerPanel.renderLayers(bounds, pixelSize)
                t.draw()
            }
            ,500)
    }
    
    actualizeBounds(){
        var bounds = this.parentDiv.getBoundingClientRect()
        this.bounds = bounds
        
        this.initializeContext()
        this.setStyle(this.styles)
        this.draw()
    }
    actualizeElementSize(){
        var bounds = this.parentDiv.getBoundingClientRect()
        this.canvasElement.width = bounds.width
        this.canvasElement.height = bounds.height
        if(this.canvasElement2 != null){
            this.canvasElement2.width = bounds.width
            this.canvasElement2.height = bounds.height
        }
        
        this.bounds = bounds
    }
    
    draw(dontUpdateAllWhenClick){
        if(dontUpdateAllWhenClick == null)
            dontUpdateAllWhenClick = false
            
        if(!dontUpdateAllWhenClick){
            this.clear()
            this.setStyle({strokeStyle:"#000",fillStyle:"#ddffdd"})
            this.drawLayer(this.layerPanel.layers)
            this.drawGrid()
        }
        
        this.setLayer(true)
        
        this.clear()
        if(this.layerPanel.editing != null){
            this.setStyle({strokeStyle:"#ff0",fillStyle:"#00000000"})
            this.drawEditing()
        }
        this.setLayer(false)
        
    }
    getDegreeBounds(){
        return {
            left: this.degreeBoundsLeft,
            right: this.degreeBoundsRight,
            top: this.degreeBoundsTop,
            bottom: this.degreeBoundsBottom,
        }
    }
    drawGrid(){
        var cam = this.camera
        this.bounds = this.parentDiv.getBoundingClientRect()
        
        var widthInDegrees = this.bounds.width/cam.getMagnification()
        var heightInDegrees = this.bounds.height/cam.getMagnification()

        var gridScale = Math.pow(10, Math.ceil( Math.log10 ( 20 / cam.getMagnification() ) ) )
        
    
        this.degreeBoundsLeft = -cam.getX() - widthInDegrees / 2
        this.degreeBoundsRight = -cam.getX() + widthInDegrees / 2
        this.degreeBoundsTop = -cam.getY() - heightInDegrees / 2
        this.degreeBoundsBottom = -cam.getY() + heightInDegrees / 2
        
        var leftScaled = Math.ceil( this.degreeBoundsLeft / gridScale ) * gridScale
        var topScaled = Math.ceil( this.degreeBoundsTop / gridScale ) * gridScale
        var rightScaled = Math.ceil( this.degreeBoundsRight / gridScale ) * gridScale
        var bottomScaled = Math.ceil( this.degreeBoundsBottom / gridScale ) * gridScale
        var leftScaled = Math.max(leftScaled-gridScale,-180)
        var rightScaled = Math.min(rightScaled+gridScale,180)
        var topScaled = Math.max(topScaled-gridScale,-90)
        var bottomScaled = Math.min(bottomScaled+gridScale,90)
        
        this.setStyle({strokeStyle:"#55d"})
        
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
    drawLayer(layer){
        if(layer.drawable && !layer.hidden){
            this.drawLayerData(layer,layer.rendered)
            if(layer == this.layerPanel.editing && this.layerPanel.isSpatiotemporal(layer)){
                this.drawCurrentLayerData(layer,layer.data)
            }
        }
        for(var i in layer.children){
            this.drawLayer(layer.children[i])
        }
    }
    setStyleToFeature(layer,feature){
        
        if(this.layerPanel.getStyleProperties(layer,'fill',feature)){
            this.setStyle({fillStyle:this.layerPanel.getStyleProperties(layer,'fill',feature)})
        }
            
        if(layer.edited){
            this.setStyle({strokeStyle:"#f00"})
        } else {
            this.setStyle({strokeStyle:"#000"})
            if(this.layerPanel.getStyleProperties(layer,'line',feature)){
                this.setStyle({strokeStyle:this.layerPanel.getStyleProperties(layer,'line',feature)})
            }
            if(this.layerPanel.getStyleProperties(layer,'lineWidth',feature)){
                this.setStyle({lineWidth:this.layerPanel.getStyleProperties(layer,'lineWidth',feature)})
            }
        }
    }
    drawEditing(){
        var topLayer = this.layerPanel.editing
        if(topLayer == null)
            return
        //if(data.originaldata === topLayer.selectedFeature)
        this.setStyle({lineWidth:2,fillStyle:"transparent"})
        this.drawLayerData(topLayer, topLayer.selectedFeature, true, this.getDegreeBounds())   //zamień false na this.editingShape, czy coś
        if(topLayer.addingDrawing){
            //this.drawLayerPoints(layer,layer.lastShapeDrawing)
        }
        
        this.setStyle({lineWidth:1})
    }
    drawLayerData(topLayer, data, points, degreeBounds){
        if(data instanceof Object && "bbox" in data && (
            data.bbox[0] > this.degreeBoundsRight || 
            data.bbox[1] > this.degreeBoundsBottom || 
            data.bbox[2] < this.degreeBoundsLeft || 
            data.bbox[3] < this.degreeBoundsTop
        ))
            return
        if(data == undefined)
            return
        switch(data.type){
            case "Interval":
                for(var i in data.children){
                    this.drawLayerData(topLayer, data.children[i], points, degreeBounds)
                }
                break
            case "FeatureCollection":
                for(var i in data.features){
                    this.drawLayerData(topLayer, data.features[i], points, degreeBounds)
                }
                break
            case "TempFeature":
            case "Feature":
                this.setStyleToFeature(topLayer,data)
                if(data.originaldata === topLayer.selectedFeature)
                    this.setStyle({lineWidth:2})
                this.drawLayerData(topLayer, data.geometry, points, degreeBounds)
                
                if(this.layerPanel.getStyleProperties(topLayer,'pointText',data) != null)
                    this.drawLayerPointText(data,this.layerPanel.getStyleProperties(topLayer,'pointText',data),degreeBounds)
                
                this.setStyle({lineWidth:1})
                break
            case "GeometryCollection":
                for(var i in data.geometries){
                    this.drawLayerData(topLayer, data.geometries[i], points, degreeBounds)
                }
                break
            case "MultiPolygon":
                for(var i in data.coordinates){
                    var polygon = data.coordinates[i]
                    this.drawPolygon(polygon)
                }
                if(points)
                    this.drawEditPoints(data.coordinates, degreeBounds, topLayer.selectedPoint)
                
                break
            case "Polygon":
                this.drawPolygon(data.coordinates)
                if(points)
                    this.drawEditPoints(data.coordinates, degreeBounds, topLayer.selectedPoint)
                
                break
            case "MultiLineString":
                for(var i in data.coordinates){
                    var line = data.coordinates[i]
                    this.drawPolyLine(line,false)
                }
                if(points)
                    this.drawEditPoints(data.coordinates, degreeBounds, topLayer.selectedPoint)
                break
            case "LineString":
                this.drawPolyLine(data.coordinates,false)
                if(points)
                    this.drawEditPoints(data.coordinates, degreeBounds, topLayer.selectedPoint)
                
                break
            case "MultiPoint":
                for(var i in data.coordinates){
                    var point = data.coordinates[i]
                    this.drawPoint(point[0],point[1])
                }
                if(points)
                    this.drawEditPoints(data.coordinates, degreeBounds, topLayer.selectedPoint)
                break
            case "Point":
                var px = this.camera.pixelSize
                this.drawPoint(data.coordinates[0],data.coordinates[1])
                if(points)
                    this.drawEditPoints(data.coordinates, degreeBounds, topLayer.selectedPoint)
                break
        }
    }
    
    drawCurrentLayerData(topLayer, data, points, degreeBounds){
        if(data instanceof Object && "bbox" in data && (
            data.bbox[0] > this.degreeBoundsRight || 
            data.bbox[1] > this.degreeBoundsBottom || 
            data.bbox[2] < this.degreeBoundsLeft || 
            data.bbox[3] < this.degreeBoundsTop
        ))
            return
        if(data == undefined)
            return
        switch(data.type){
            case "Interval":
                for(var i in data.children){
                    this.drawCurrentLayerData(topLayer, data.children[i], points, degreeBounds)
                }
                break
            case "FeatureCollection":
                for(var i in data.features){
                    this.drawCurrentLayerData(topLayer, data.features[i], points, degreeBounds)
                }
                break
            case "TempFeature":
                //this.setStyleToFeature(topLayer,data)
                
                if(this.layerPanel.checkIfFeatureSelectableInTime(data)){
                    var strStyle = '#008'
                    switch(data.operation){
                        case 'UNION':
                        case 'UNION_ALL_FEATURES':
                            strStyle = '#080'
                            break
                        case 'DIFF':
                            strStyle = '#800'
                            break
                    }
                    this.setStyle({lineWidth:2,fillStyle:'#0000',strokeStyle:strStyle,lineDash:[2,3]})
                    this.drawLayerData(topLayer, data.geometry, points, degreeBounds)
                    this.setStyle({lineWidth:1,lineDash:[]})
                }
                break
        }
    }
    drawEditPoints(coords, bounds, selectedPoint){
        
        if(typeof coords[0] == "number"){
            if(
            coords[0] > bounds.right || 
            coords[1] > bounds.bottom || 
            coords[0] < bounds.left || 
            coords[1] < bounds.top){
                return
            }
            var selected = (selectedPoint == coords)
            
            this.setStyle({lineWidth:1,fillStyle:selected ? "#ff0" : "transparent"})
            this.drawEditPoint(coords[0], coords[1], selected)
            this.setStyle({lineWidth:2,fillStyle:"transparent"})
        } else if(coords instanceof Object) {
            var lastpoint = null
            var magfactor = this.camera.getMagFactor()
            var breakpoint = false
            for(var i in coords){
                if(typeof coords[i][0] == "number"){
                    if(lastpoint != null && Math.max(Math.abs(lastpoint[0]-coords[i][0]),Math.abs(lastpoint[1]-coords[i][1])) < magfactor){
                        breakpoint = true
                        continue
                    }
                    if(lastpoint!=null && !breakpoint && this.layerPanel.pointsCloseToShowAuxiliaryPoints(lastpoint,coords[i],magfactor)){
                        this.drawAuxiliaryEditPoints(lastpoint, coords[i], bounds, selectedPoint, magfactor)
                    }
                    lastpoint = coords[i]
                    breakpoint = false
                }
                this.drawEditPoints(coords[i], bounds, selectedPoint)
            }
        }
    }
    drawAuxiliaryEditPoints(lastpoint, coords, bounds, selectedPoint, magfactor){
        if(
        coords[0] > bounds.right || 
        coords[1] > bounds.bottom || 
        coords[0] < bounds.left || 
        coords[1] < bounds.top){
            return
        }
        
        //this.setStyle({lineWidth:1,fillStyle:selected ? "#ff0" : "transparent"})
        
        var d = Math.sqrt(Math.pow(coords[0] - lastpoint[0],2) + Math.pow(coords[1] - lastpoint[1],2))
        var p1x = this.layerPanel.auxiliaryPointsPosition(lastpoint,coords,true,true,magfactor)
        var p1y = this.layerPanel.auxiliaryPointsPosition(lastpoint,coords,true,false,magfactor)
        
        var p2x = this.layerPanel.auxiliaryPointsPosition(lastpoint,coords,false,true,magfactor)
        var p2y = this.layerPanel.auxiliaryPointsPosition(lastpoint,coords,false,false,magfactor)
        
        this.drawAuxiliaryEditPoint(p1x, p1y, false)
        this.drawAuxiliaryEditPoint(p2x, p2y, false)
        //this.setStyle({lineWidth:2,fillStyle:"transparent"})
        
    }
    drawLayerPointText(data,value,degreeBounds){
        var prevColor = this.styles['fillStyle']
        this.setStyle({fillStyle:"#000",font:"Helvetica",textSize:10,textAlign:"center"})
        if(data.geometry == undefined){
            console.log(data)
            return
        }
        this.drawText(value,data.geometry.coordinates[0],data.geometry.coordinates[1],0,-6)
        this.setStyle({fillStyle:prevColor})
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
        this.context1 = this.canvasElement.getContext("2d")
        if(this.canvasElement2)
            this.context2 = this.canvasElement2.getContext("2d")
        
        this.context = this.context1
    }
    setParticularStyle(style){
        switch(style){
            case "lineWidth":
                this.context.lineWidth = this.styles[style]
                break
            case "lineDash":
                this.context.setLineDash(this.styles[style])
                break
            case "strokeStyle":
                this.context.strokeStyle = this.styles[style]
                break
            case "fillStyle":
                this.context.fillStyle = this.styles[style]
                break
            case "textSize":
                this.context.textAlign = "center"
                break
            case "textSize":
            case "font":
                this.context.font = this.styles["textSize"] + "px " + this.styles["font"]
                break
        }
    }
    clear(){
        this.context.clearRect(0,0,this.bounds.width,this.bounds.height)
    }
    setLayer(additional){
        this.context = additional ? this.context2 : this.context1
    }
    drawLine(x1,y1,x2,y2){
        var points1x = this.camera.degreesToPixels(x1,y1,this.bounds,true)
        var points1y = this.camera.degreesToPixels(x1,y1,this.bounds,false)
        var points2x = this.camera.degreesToPixels(x2,y2,this.bounds,true)
        var points2y = this.camera.degreesToPixels(x2,y2,this.bounds,false)
        
        this.context.beginPath()
        this.context.moveTo(points1x,points1y)
        this.context.lineTo(points2x,points2y)
        this.context.stroke()
        this.context.closePath()
    }
    drawText(text,x,y,transx,transy){
        if(transx == undefined)
            transx = 0
        if(transy == undefined)
            transy = 0
            
        var pointx = this.camera.degreesToPixels(x,y,this.bounds,true)
        var pointy = this.camera.degreesToPixels(x,y,this.bounds,false)
        
        this.context.fillText(text,pointx+transx,pointy+transy)
        
    }
    drawPoint(x,y){
        var pointx = this.camera.degreesToPixels(x,y,this.bounds,true)
        var pointy = this.camera.degreesToPixels(x,y,this.bounds,false)
        
        var rad = 2
        this.context.beginPath()
        this.context.moveTo(pointx-rad,pointy-rad)
        this.context.lineTo(pointx-rad,pointy+rad)
        this.context.lineTo(pointx+rad,pointy+rad)
        this.context.lineTo(pointx+rad,pointy-rad)
        this.context.lineTo(pointx-rad,pointy-rad)
        this.context.closePath()
        this.context.fill()
        this.context.stroke()
        /*
        this.context.beginPath()
        this.context.moveTo(pointx-2.5,pointy)
        this.context.lineTo(pointx+2.5,pointy)
        this.context.stroke()
        
        this.context.beginPath()
        this.context.moveTo(pointx,pointy-2.5)
        this.context.lineTo(pointx,pointy+2.5)
        this.context.stroke()
        */
    }
    drawEditPoint(x,y,selected){
        var pointx = this.camera.degreesToPixels(x,y,this.bounds,true)
        var pointy = this.camera.degreesToPixels(x,y,this.bounds,false)
        
        var rad = selected ? 5 : 3
        this.context.beginPath()
        this.context.moveTo(pointx-rad,pointy-rad)
        this.context.lineTo(pointx-rad,pointy+rad)
        this.context.lineTo(pointx+rad,pointy+rad)
        this.context.lineTo(pointx+rad,pointy-rad)
        this.context.lineTo(pointx-rad,pointy-rad)
        this.context.closePath()
        if(selected){
            this.context.fill()
        }
        this.context.stroke()
        
    }
    drawAuxiliaryEditPoint(x,y,selected){
        var pointx = this.camera.degreesToPixels(x,y,this.bounds,true)
        var pointy = this.camera.degreesToPixels(x,y,this.bounds,false)
        
        var rad = selected ? 5 : 3
        this.context.beginPath()
        this.context.moveTo(pointx,pointy-rad)
        this.context.lineTo(pointx-rad,pointy)
        this.context.lineTo(pointx,pointy+rad)
        this.context.lineTo(pointx+rad,pointy)
        this.context.lineTo(pointx,pointy-rad)
        this.context.closePath()
        this.context.stroke()
    }
    drawPolyLine(line, closed){
        
        if(line.length === 0)
            return
            
        this.context.beginPath()
            
        var x1,y1
        for(var point in line){
            var pointx = this.camera.degreesToPixels(line[point][0],line[point][1],this.bounds,true)
            var pointy = this.camera.degreesToPixels(line[point][0],line[point][1],this.bounds,false)
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
    }
    drawPolygon(polygon){
        
        if(polygon.length === 0)
            return
            

        var x1,y1,x2,y2
        var first = true
        this.context.beginPath()
        for(var i in polygon){
            var firstPoint = true
            var line = polygon[i]
                
            for(var point in line){
                var pointx = this.camera.degreesToPixels(line[point][0],line[point][1],this.bounds,true)
                var pointy = this.camera.degreesToPixels(line[point][0],line[point][1],this.bounds,false)
                if(first){
                    this.context.moveTo(pointx,pointy)
                    x2 = pointx,y2 = pointy
                    first = false
                } else {
                    this.context.lineTo(pointx,pointy)
                }
                if(firstPoint){
                    x1 = pointx,y1 = pointy
                    firstPoint = false
                }
            }
            if(x1)
                this.context.lineTo(x1,y1)
        }
        if(x2)
            this.context.lineTo(x2,y2)
        this.context.fill()
        this.context.closePath()
        /*
        if(polygon.length>1)
            this.setStyle({strokeStyle:"#f00"})
        else
            this.setStyle({strokeStyle:"#000"})
          */  
        for(var i in polygon){
            var line = polygon[i]
            if(line.length === 0)
                continue
                
            this.context.beginPath()
            var x1,y1
            var first = true
            for(var point in line){
                var pointx = this.camera.degreesToPixels(line[point][0],line[point][1],this.bounds,true)
                var pointy = this.camera.degreesToPixels(line[point][0],line[point][1],this.bounds,false)
                if(first){
                    this.context.moveTo(pointx,pointy)
                    x1 = pointx
                    y1 = pointy
                    first = false
                } else
                    this.context.lineTo(pointx,pointy)
            }
            this.context.lineTo(x1,y1)
            this.context.closePath()
            this.context.stroke()
        }
    }
}
class Controller {
    constructor(canvas){
        this.moving = false
        this.movable = document.getElementById("movable")
        this.leftpanel = document.getElementById("leftpanel")
        this.rightpanel = document.getElementById("rightpanel")
        this.canvas = canvas
        //this.movable.addEventListener("mousedown",e=>this.mouseDown(e))
        //window.addEventListener("mousemove",e=>this.mouseMove(e))
        //window.addEventListener("mouseup",e=>this.mouseUp(e))
        //window.addEventListener("resize",e=>this.windowResize(e))
        
        var canvElement = this.canvas.canvasElement2 == null ? this.canvas.canvasElement : this.canvas.canvasElement2
        canvElement.addEventListener("mousedown",e=>this.canvas.mouseDown(e))
        canvElement.addEventListener("mousemove",e=>this.canvas.mouseMove(e))
        canvElement.addEventListener("mouseup",e=>this.canvas.mouseUp(e))
        canvElement.addEventListener("wheel",e=>this.canvas.wheel(e))
        document.addEventListener("keyup",e=>this.canvas.keypress(e))
        
        this.actualizeRightPanel()
        this.timeout = undefined
    }
    mouseDown(e){
        this.moving = true
        this.startX = e.clientX;
        this.startpos = this.leftpanel.getClientRects()[0].width
    }
    mouseMove(e){
        if(this.moving){
            var x = e.clientX;
            var newx = x-this.startX+this.startpos;
            var lwidth = Math.max(100,newx)
            this.leftpanel.style.width = lwidth+"px"
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
        var lwidth = this.leftpanel.getBoundingClientRect().width
        var bodywidth = document.body.getBoundingClientRect().width
        this.rightpanel.style.width = (bodywidth - lwidth - 20)+"px"
        
        this.canvas.actualizeElementSize()
        
        var t = this
        clearTimeout(this.timeout)
        this.timeout = setTimeout(
            function(ev){
                t.canvas.actualizeBounds()
            }
            ,300)
    }
}
function actualizeBottom(text){
    var bottom = document.getElementById("bottom")
    bottom.innerHTML = text
}
function actualizeBottomWithCoords(camera, bounds){
    var degreesx = camera.pixelsToDegrees(camera.mouseX,camera.mouseY,bounds,true)
    var degreesy = camera.pixelsToDegrees(camera.mouseX,camera.mouseY,bounds,false)
    actualizeBottom(`Coords: ${String(degreesx).slice(0,5)} ${String(degreesy).slice(0,5)}, ${Math.floor(degreesx)}° ${Math.floor((degreesx % 1)*60)}' ${Math.floor(degreesy)}° ${Math.floor((degreesy % 1)*60)}'; magnification: ${String(camera.magnification).slice(0,5)}`)
}
function detectWebGL(){
    var canvas = document.createElement("canvas");
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return gl && gl instanceof WebGLRenderingContext
}
function init(){
    
    let stageDiv = document.getElementById("stage")
    let canvasElement = document.getElementById("canv")
    let canvasElement2 = document.getElementById("canv2")
    let canvas
    let timeControl = new TimeControl("global-time",true)
    let layerpanel = new LayerPanel({
        element: "leftpanelcontent",
        editToolbar: "edit-layer-buttons",
        editFeatureToolbar: "edit-feature-buttons",
        editFeatureTimeToolbar: "edit-feature-time-buttons",
        timeControl: timeControl
    })
    if(false && detectWebGL()){
        canvas = new WebGLCanvas(canvasElement,stageDiv,layerpanel,canvasElement2,timeControl)
    } else {
        canvas = new TwoDCanvas(canvasElement,stageDiv,layerpanel,canvasElement2,timeControl)
    }
    layerpanel.setConfig({canvas: canvas})
    let movlist = new Controller(canvas);
    
    let importWindow = new ImportDialogWindow({
        button: "button-import", 
        element: "layer-import",
        file: "layer-import-file",
        datatype: "layer-import-datatype",
        addlayer: "dialog-window-import-add",
        layerpanel: layerpanel,
        canvas: canvas,
    })
    let newLayerWindow = new AddLayerDialogWindow({
        button: "button-add-layer",
        element: "layer-add",
        canvas: canvas,
        layertype: "layer-add-datatype",
        addlayer: "dialog-window-add-add",
        layerpanel: layerpanel,
        layernameinput: "layer-add-layer-name",
    })
    /*
    let propertyWindow = new PropertyDialogWindow({
        element: "feature-properties",
        canvas: canvas,
        layerpanel: layerpanel,
        table: "feature-table",
    })*/
    
    
    canvas.actualizeBounds()
}
addEventListener("load",init);

