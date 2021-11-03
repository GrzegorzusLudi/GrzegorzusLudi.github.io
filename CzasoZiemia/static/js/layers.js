
class LayerPanel {
    constructor(configs){
        this.element = null
        this.setConfig(configs)
        this.layers = {
            type:"root",
            name:"root",
            drawable:false,
            hidden:false,
            children: {}  //dict
        }
        this.editing = null
        this.selectedFeature = null
        this.previouslySelectedFeature = null
        
        this.addingDrawing = false
        this.addingAction = null
        this.addingDrawingType = null
        this.reverseAddingDrawing = null
        this.lastPointDrawing = null
        this.lastShapeDrawing = null
        
        this.operationOnShapes = false
        this.operationOnShapesType = null
        
        this.addWholeLines = false
        
        this.selectedPoint = null
        
        this.lastbounds = null
        this.lastresolution = null
        
        this.deletingShapes = false
        
        let t = this
        this.propertiesDialogWindow = new PropertyDialogWindow({
            element: "feature-properties",
            canvas: t.canvas,
            layerpanel: t,
            table: "feature-table",
            updateButton: "feature-properties-update"
        })
        this.layerPropertiesDialogWindow = new LayerPropertyDialogWindow({
            element: "layer-properties",
            canvas: t.canvas,
            layerpanel: t,
            table: "layer-property-table",
            updateButton: "layer-property-update"
        })
        this.layerOperationDialogWindow = new LayerOperationDialogWindow({
            element: "layer-operation",
            canvas: t.canvas,
            layerpanel: t,
            updateButton: "layer-operation-update",
            select: "layer-operation-layer"
        })
        
        
        this.counter = 0
        this.updateLayerView(this.layers,null)
        
    }
    setConfig(configs){
        for(var option in configs){
            switch(option){
                case "element":
                    this.element = document.getElementById(configs[option])
                    break;
                case "editToolbar":
                    this.editToolbar = document.getElementById(configs[option])
                    break;
                case "editFeatureToolbar":
                    this.editFeatureToolbar = document.getElementById(configs[option])
                    break;
                case "canvas":
                    this.canvas = document.getElementById(configs[option])
                    break;
            }
        }
    }
    
    layerNameExist(name){
        return name in this.layers
    }
    
    getStyleProperties(layer,style,feature){
        if(layer.styleProperties[style].column != null){
            var col = layer.styleProperties[style].column
            return feature.properties[col]
        } else {
            return layer.styleProperties[style].value
        }
            
    }
    
    //path is array of ids
    //initial data is written in geojson
    addLayer(path, name, type, initialData, bounds, resolution){
        var realpath = this.layers
        for(var i in path){
            var pathpart = path[i]
            realpath = realpath.children[pathpart]
        }
        var transformed = this.validateAndTransformToGeoJson(initialData, type)
        
        //console.log(initialData,transformed)
        var testname = name
        var number = 2
        while(testname in realpath.children){
            testname = name + " (" + number + ")"
            number++
        }
        realpath.children[testname] = {
            type: type,
            name: testname,
            originaldata: transformed["copied"],
            data: transformed["data"],
            drawable: transformed["drawable"],
            scheme: transformed["scheme"],
            hidden: false,
            children: {},
            rendered: null,
            edited: false,
            number: this.counter++,
            styleProperties: {
                fill: {
                    'value': null,
                    'column': null,
                },
                line: {
                    'value': null,
                    'column': null,
                },
                lineWidth: {
                    'value': null,
                    'column': null,
                },
                pointSize: {
                    'value': null,
                    'column': null,
                },
                pointShape: {
                    'value': null,
                    'column': null,
                },
                opacity: {
                    'value': null,
                    'column': null,
                },
                pointText: {
                    'value': null,
                    'column': null,
                },
            }
        }
        this.render(realpath.children[testname], bounds, resolution)
        this.updateLayerView(path)
    }
    updateLayer(layer,od,keeporiginaldata){
        var newData,transformed
        if(keeporiginaldata){
            newData = od
            transformed = this.validateAndTransformToGeoJson(newData, layer.type, true)
        } else {
            switch(layer.type){
                case "geojson":
                case "json":
                    newData = JSON.stringify(layer.originaldata)
                    break
                default:
                    newData = layer.originaldata
            }
            transformed = this.validateAndTransformToGeoJson(newData, layer.type)
        }
        
        layer.originaldata = transformed["copied"]
        layer.data = transformed["data"]
        layer.drawable = transformed["drawable"]
        
        this.render(layer)
        this.updateLayerView(this.layers)
        
    }
    
    renderLayers(bounds, resolution){
        for(var i in this.layers.children){
            this.render(this.layers.children[i], bounds, resolution)
        }
    }
    
    render(layer, bounds, resolution){
        layer.rendered = {}
        if(bounds != null)
            this.lastbounds = bounds
        else
            bounds = this.lastbounds
        if(resolution != null)
            this.lastresolution = resolution
        else
            resolution = this.lastresolution
        this.mapLayerToRendered(layer.data,layer.rendered,bounds,resolution)
    }
    
    checkBounds(coordsx, coordsy, bounds){
        return coordsx > bounds.left && coordsy > bounds.top && coordsx < bounds.right && coordsy < bounds.bottom
    }
    checkIfInBound(value, left, right){
        if(value<=left)
            return -1
        if(value<right)
            return 0
        return 1
    }
    
    mapLayerToRendered(layer,rendered,bounds,resolution){
        var lastPositionx = null, lastPositiony = null, penultimalPositionx = null, penultimalPositiony = null, notinbounds = null
        for(var property in layer){
            var value = layer[property]
            if(value instanceof Object && !(value instanceof Array)){
                if(layer instanceof Array && "resolution" in value && value.resolution<resolution*4){
                    break
                }
                if("bbox" in value && (
                    value.bbox[0] > bounds.right || 
                    value.bbox[1] > bounds.bottom || 
                    value.bbox[2] < bounds.left || 
                    value.bbox[3] < bounds.top) ||
                    (Math.abs(bounds.right-bounds.left) < resolution && Math.abs(bounds.bottom-bounds.top) < resolution)
                )
                    continue
                var newObject = {}
                rendered[property] = newObject
                this.mapLayerToRendered(value,newObject,bounds,resolution)
            } else if(layer instanceof Array && value instanceof Array && value.length > 0 && typeof value[0] == "number"){
                
                var posx = Math.min(Math.max(value[0], bounds.left), bounds.right)
                var posy = Math.min(Math.max(value[1], bounds.top), bounds.bottom)
                var wasnotinbounds = notinbounds
                notinbounds = posx !== value[0] || posy !== value[1]
                if(lastPositionx === null || property === layer.length-1){
                    lastPositionx = posx
                    lastPositiony = posy
                    
                    rendered.push([posx,posy])
                } else if(Math.abs(lastPositionx-posx) + Math.abs(lastPositiony-posy) > resolution){
                    if(notinbounds){
                        if(!wasnotinbounds || 
                            this.checkIfInBound(lastPositionx,bounds.left,bounds.right)
                            !==
                            this.checkIfInBound(posx,bounds.left,bounds.right)
                            ||
                            this.checkIfInBound(lastPositiony,bounds.top,bounds.bottom)
                            !==
                            this.checkIfInBound(posy,bounds.top,bounds.bottom)
                        ){
                            rendered.push([posx,posy])
                        }
                            
                    } else {
                        if(wasnotinbounds)
                            rendered.push([lastPositionx,lastPositiony])
                            
                        rendered.push([posx,posy])
                    }
                    lastPositionx = posx
                    lastPositiony = posy
                }
            } else if(value instanceof Array){
                if(layer instanceof Array && "resolution" in value && value.resolution<resolution*4){
                    break
                }
                var newObject = []
                rendered[property] = newObject
                this.mapLayerToRendered(value,newObject,bounds,resolution)
            } else {
                rendered[property] = value
                
                if(property == "type" && value == "Feature"){
                    rendered["originaldata"] = layer
                }
            }
        }
    }
    
    //modification is path
    modifyLayer(path, type, modification){  
        
    }
    getLayers(){
        
    }
    
    hideLayer(e,layerName,layerTreeElement){
        this.layers.children[layerName].hidden = !this.layers.children[layerName].hidden
        
        e.target.src = this.layers.children[layerName].hidden ? "static/img/eye-closed.png" : "static/img/eye-open.png"
    }
    
    removeLayer(e,layerName,layerTreeElement){
        if(confirm('Are you sure to remove layer "'+layerName+'"')){
            if(this.layers.children[layerName] == this.editing)
                this.editing = null
                
            delete this.layers.children[layerName]
            this.updateLayerView(this.layers)
        }
    }
    
    layerToTop(e,layerName,layerTreeElement){
        var moved = this.layers.children[layerName]
        delete this.layers.children[layerName]
        var newLayers = {}
        for(var name in this.layers.children){
            newLayers[name] = this.layers.children[name]
        }
        newLayers[layerName] = moved
        this.layers.children = newLayers
        this.updateLayerView(this.layers)
    }
    
    layerToBottom(e,layerName,layerTreeElement){
        var moved = this.layers.children[layerName]
        delete this.layers.children[layerName]
        var newLayers = {}
        newLayers[layerName] = moved
        for(var name in this.layers.children){
            newLayers[name] = this.layers.children[name]
        }
        this.layers.children = newLayers
        this.updateLayerView(this.layers)
    }
    
    layerProperties(e,layerName,layerTreeElement,layer){
        this.layerPropertiesDialogWindow.action(e,true,layer)
    }
    
    startEditingLayer(e,layerName,layerTreeElement){
        this.editing = this.layers.children[layerName]
        this.editing.edited = true
        this.updateLayerView(this.layers)
    }
    
    stopEditingLayer(e,layerName,layerTreeElement){
        this.editing.edited = false
        this.editing.selectedFeature = null
        this.editing.selectedPoint = null
        
        this.lastShapeDrawing = null
        this.lastPointDrawing = null
        this.editing = null
        this.updateLayerView(this.layers)
    }
    
    saveEditingLayer(e,layerName,layerTreeElement){
        
    }
    
    addWholeLinesChange(){
        this.addWholeLines = !this.addWholeLines
        this.updateLayerView(this.layers)
    }
    
    updateLayerView(path){
        var element = this.element
        var layers = this.layers
        
        //for(var i in path){   NOT YEET
        //    var pathpart = path[i]
        //    realpath = realpath.children[pathpart]
        //}
        
        element.innerHTML = "<div>root<div>" //remove all
        var subnodes = document.createElement("div")
        element.appendChild(subnodes)
        subnodes.style.marginLeft = "3px"
        subnodes.style.borderLeft = "1px solid gray"
        subnodes.style.paddingLeft = "3px"
        var th = this
        
        for(let name in layers.children){
            let layer = layers.children[name]
            var newNode = document.createElement("div")
            var i = layer.number
            
            newNode.innerHTML = "<div>"+layer.name
            
            newNode.innerHTML += '<a href="#"><img id="button-show-'+i+'" src="static/img/eye-open.png" alt="show/hide layer" title="show/hide later" /></a>'
            newNode.innerHTML += '<a href="#"><img id="button-remove-'+i+'" src="static/img/remove-layer.png" alt="remove layer" title="remove layer" /></a>'
            newNode.innerHTML += '<a href="#"><img id="button-to-top-'+i+'" src="static/img/to-top.png" alt="to top" title="to top" /></a>'
            newNode.innerHTML += '<a href="#"><img id="button-to-bottom-'+i+'" src="static/img/to-bottom.png" alt="to bottom" title="to bottom" /></a>'
            if(!layer.edited || this.editing == null){
                newNode.innerHTML += '<a href="#"><img id="edit-layer-'+i+'" src="static/img/edit-layer.png" alt="edit layer" title="edit layer" /></a>'
            } else {
                newNode.innerHTML += '<a href="#"><img id="save-layer-'+i+'" src="static/img/save-layer.png" alt="save layer" title="save layer" /></a>'
                newNode.innerHTML += '<a href="#"><img id="dont-save-layer-'+i+'" src="static/img/dont-save-layer.png" alt="don\'t save layer" title="don\'t save layer" /></a>'
            }
            newNode.innerHTML += '<a href="#"><img id="button-layer-properties-'+i+'" src="static/img/layer-properties.png" alt="layer properties" title="layer properties" /></a>'
            
            newNode.innerHTML += "</div>"
            subnodes.prepend(newNode)
            
            if(layer == this.editing){
                this.showLayerFeatures(layer.originaldata, newNode, i)
            }
            
            document.getElementById('button-show-'+i).onclick = (e)=>{th.hideLayer(e,name,newNode)}
            document.getElementById('button-remove-'+i).onclick = (e)=>{th.removeLayer(e,name,newNode)}
            document.getElementById('button-to-top-'+i).onclick = (e)=>{th.layerToTop(e,name,newNode)}
            document.getElementById('button-to-bottom-'+i).onclick = (e)=>{th.layerToBottom(e,name,newNode)}
            if(!layer.edited){
                if(this.editing == null)
                    document.getElementById('edit-layer-'+i).onclick = (e)=>{th.startEditingLayer(e,name,newNode)}
            } else {
                document.getElementById('dont-save-layer-'+i).onclick = (e)=>{th.stopEditingLayer(e,name,newNode)}
                document.getElementById('save-layer-'+i).onclick = (e)=>{th.saveEditingLayer(e,name,newNode)}                
            }
            document.getElementById('button-layer-properties-'+i).onclick = (e)=>{th.layerProperties(e,name,newNode,layer)}
            
            
        }
        this.updateEditToolbar()
    }
    
    updateEditToolbar(){
        this.editToolbar.style.display = 'none'
        this.editFeatureToolbar.style.display = 'none'
        var th = this
        if(this.editing != null && (this.editing.type == 'geojson' || this.editing.type == 'geotempjson')){
            this.editToolbar.style.display = 'inline-block'
            
            var addPolygonButton = document.getElementById('add-polygon')
            addPolygonButton.onclick = (e)=>{th.startAddingShape("Polygon");e.preventDefault()}
            addPolygonButton.style.border = this.addingDrawing && this.addingDrawingType == "Polygon" ? "2px solid yellow" : ""
            
            var addLinestringButton = document.getElementById('add-linestring')
            addLinestringButton.onclick = (e)=>{th.startAddingShape("LineString");e.preventDefault()}
            addLinestringButton.style.border = this.addingDrawing && this.addingDrawingType == "LineString" ? "2px solid yellow" : ""
            
            var addPointButton = document.getElementById('add-point')
            addPointButton.onclick = (e)=>{th.startAddingShape("Point");e.preventDefault()}
            addPointButton.style.border = this.addingDrawing && this.addingDrawingType == "Point" ? "2px solid yellow" : ""
            
            var deletingShapesButton = document.getElementById('delete-shape')
            deletingShapesButton.onclick = (e)=>{th.startDeletingShapes();e.preventDefault()}
            deletingShapesButton.style.border = this.deletingShapes ? "2px solid yellow" : ""
            
            var addWholeLinesButton = document.getElementById('add-whole-lines')
            addWholeLinesButton.onclick = (e)=>{th.addWholeLinesChange();e.preventDefault()}
            addWholeLinesButton.style.border = this.addWholeLines ? "2px solid yellow" : ""
            
            if(this.editing.selectedFeature != null){
                this.editFeatureToolbar.style.display = 'inline-block'
                
                var addPolygonToFeatureButton = document.getElementById('add-polygon-to-feature')
                addPolygonToFeatureButton.onclick = (e)=>{th.startAddingShape("Polygon","add");e.preventDefault()}
                addPolygonToFeatureButton.style.border = this.addingAction == "add" ? "2px solid yellow" : ""
                
                var removePolygonFromFeatureButton = document.getElementById('remove-polygon-from-feature')
                removePolygonFromFeatureButton.onclick = (e)=>{th.startAddingShape("Polygon","remove");e.preventDefault()}
                removePolygonFromFeatureButton.style.border = this.addingAction == "remove" ? "2px solid yellow" : ""
                
                
                var addOtherPolygonToFeatureButton = document.getElementById('add-other-polygon-to-feature')
                addOtherPolygonToFeatureButton.onclick = (e)=>{th.startOperationOnShapes("add");e.preventDefault()}
                addOtherPolygonToFeatureButton.style.border = this.operationOnShapesType == "add" ? "2px solid yellow" : ""
                
                var intersectOtherPolygonToFeatureButton = document.getElementById('intersect-other-polygon-to-feature')
                intersectOtherPolygonToFeatureButton.onclick = (e)=>{th.startOperationOnShapes("intersect");e.preventDefault()}
                intersectOtherPolygonToFeatureButton.style.border = this.operationOnShapesType == "intersect" ? "2px solid yellow" : ""
                
                var removeOtherPolygonFromFeatureButton = document.getElementById('remove-other-polygon-from-feature')
                removeOtherPolygonFromFeatureButton.onclick = (e)=>{th.startOperationOnShapes("remove");e.preventDefault()}
                removeOtherPolygonFromFeatureButton.style.border = this.operationOnShapesType == "remove" ? "2px solid yellow" : ""
                
                var operateFeatureToLayerButton = document.getElementById('operate-feature-to-layer')
                operateFeatureToLayerButton.onclick = (e)=>{th.operationOnLayer(e);e.preventDefault()}
                
                
            } else {
                this.layerOperationDialogWindow.action(null,false,null)
            }
        } else {
            this.layerOperationDialogWindow.action(null,false,null)
        }
    }
    
    operationOnLayer(e){
        if(!this.addingDrawing)
            this.layerOperationDialogWindow.action(e,true,this.editing.selectedFeature)
        else
            alert("Stop drawing first!")
    }
    
    startDeletingShapes(){
        if(!this.deletingShapes){
            this.stopAddingShape()
            this.deletingShapes = true
        } else {
            this.deletingShapes = false
        }
        this.updateLayerView(this.layers)
    }
    
    startOperationOnShapes(action){
        if(!this.operationOnShapes){
            this.stopAddingShape()
            this.operationOnShapes = true
            this.operationOnShapesType = action
        } else {
            this.operationOnShapes = false
            this.operationOnShapesType = null
        }
        this.deletingShapes = false
        this.updateLayerView(this.layers)
        
    }
    
    startAddingShape(shape,action){
        this.addingAction = action ? action : null
        if(action != null){
            this.editing.previouslySelectedFeature = this.editing.selectedFeature
        } else {
            this.editing.previouslySelectedFeature = null
        }

        this.deletingShapes = false
        if(!this.addingDrawing){
            this.editing.selectedFeature = null
            this.addingDrawing = true
            this.reverseAddingDrawing = false
            this.addingDrawingType = shape
            //if(this.editing.selectedFeature == null){newCoords
                var coords
                switch(shape){
                    case "Polygon":
                        var coords = [[]]
                        break
                    case "LineString":
                    case "Point":
                        var coords = []
                        break
                }
                var newFeature = {type:"Feature",geometry:{type:shape,coordinates:coords},properties:{},adding:true}
                this.editing.selectedFeature = newFeature
            //}
            switch(shape){
                case "Polygon":
                    this.lastShapeDrawing = this.editing.selectedFeature.geometry.coordinates[0]
                    break
                case "LineString":
                case "Point":
                    this.lastShapeDrawing = this.editing.selectedFeature.geometry.coordinates
                    break
            }
        } else {
            this.stopAddingShape()
        }
        this.updateLayerView(this.layers)
    }
    
    startEditingPolygon(point,shape,reverse){
        this.addingDrawing = true
        this.addingDrawingType = "Polygon"
        this.reverseAddingDrawing = reverse
        
        this.lastShapeDrawing = shape
        this.lastPointDrawing = point
            
        this.updateLayerView(this.layers)
    }
    
    deleteSelectedPoint(){
        var index = this.lastShapeDrawing.findIndex(x=>x==this.lastPointDrawing)
        this.lastShapeDrawing.splice(index,1)
        if(this.lastShapeDrawing.length > 0){
            this.editing.selectedPoint = this.lastShapeDrawing[(index + 1) & this.lastShapeDrawing.length]
            this.lastPointDrawing = this.editing.selectedPoint
        }
        
        this.updateLayer(this.editing,this.editing.originaldata,true)
    }
    

    deleteShape(selectedFeature){
        switch(selectedFeature.type){
            case "Feature":
                let index = this.editing.originaldata.features.indexOf(selectedFeature);
                if(index !== -1) {
                    this.editing.originaldata.features.splice(index, 1);
                    this.editing.selectedFeature = null
                } else {
                    return
                }
                break
        }

        this.updateLayer(this.editing,this.editing.originaldata,true)
    }
    
    stopAddingShape(){
        var update = this.editing.selectedFeature != null && (this.lastShapeDrawing == null || this.lastShapeDrawing.length > 0)
        if(update && (this.editing.selectedFeature == null || this.editing.selectedFeature.adding)){
            var newFeature
            switch(this.addingDrawingType){
                case "Polygon":
                case "LineString":
                case "Point":
                    newFeature = this.editing.selectedFeature
                    break
            }
            
            switch(this.addingAction){
                case null:
                    this.editing.originaldata.features.push(newFeature)
                    delete this.editing.selectedFeature['adding']
                    this.editing.selectedFeature = null
                    break
                case "add":
                    var newGeom = turf.union(this.editing.selectedFeature,this.editing.previouslySelectedFeature)
                    this.editing.previouslySelectedFeature.geometry = newGeom.geometry
                    this.editing.selectedFeature = this.editing.previouslySelectedFeature
                    this.editing.previouslySelectedFeature = null
                    break
                case "remove":
                    var newGeom = turf.difference(this.editing.previouslySelectedFeature,this.editing.selectedFeature)
                    this.editing.previouslySelectedFeature.geometry = newGeom.geometry
                    this.editing.selectedFeature = this.editing.previouslySelectedFeature
                    this.editing.previouslySelectedFeature = null
                    break
            }
        }
        this.addingAction = null
        this.editing.selectedPoint = null
        this.addingDrawing = false
        this.addingDrawingType = null
        this.lastShapeDrawing = null
        this.lastPointDrawing = null
        this.operationOnShapes = false
        this.operationOnShapesType = null
        
        if(update){
            this.updateLayer(this.editing,this.editing.originaldata,true)
        }
    }
    
    operateShapeToSelect(operationType,newFeature){
        
        if(this.editing.selectedFeature == null || newFeature == null){
            alert("Something has gone wrong!")
            return
        }
        var newGeom
        switch(operationType){
            case "add":
                newGeom = turf.union(this.editing.selectedFeature,newFeature)
                break
            case "remove":
                newGeom = turf.difference(this.editing.selectedFeature,newFeature)
                break
            case "intersect":
                newGeom = turf.intersect(this.editing.selectedFeature,newFeature)
                break
        }
        this.editing.selectedFeature.geometry = newGeom.geometry
        this.stopAddingShape()
        this.updateLayer(this.editing,this.editing.scheme)
    }
    
    changePointPosition(point,long,lat){
        point[0] = long
        point[1] = lat
        
        this.updateLayer(this.editing,this.editing.originaldata,true)
    }
    
    showLayerFeatures(layer, layerNode, layerId){
        var collection = null
        if(layer.features != null && layer.features.length > 0)
            collection = layer.features
        if(layer.geometries != null && layer.geometries.length > 0)
            collection = layer.geometries
        if(layer.children != null && layer.children.length > 0)
            collection = layer.children
        var t = this
            
        if(collection != null){
            var subnodes = document.createElement("div")
            layerNode.appendChild(subnodes)
            subnodes.style.marginLeft = "3px"
            subnodes.style.borderLeft = "1px solid gray"
            subnodes.style.paddingLeft = "3px"
            
            for(var i in collection){
                var feature = collection[i]
                var newNode = document.createElement("div")
                var fname = feature['name'] == null ? "<i>child-"+i+"</i>" : feature['name']
                newNode.innerHTML = `<div><span id="edit-feature-${layerId}-${i}">${feature["type"]} : ${fname}</span></div>`
                if(feature == this.editing.selectedFeature){
                    newNode.style.color = "#dd0000"
                    var description = document.createElement("div")
                    newNode.appendChild(description)
                    description.style.marginLeft = "3px"
                    description.style.borderLeft = "1px solid gray"
                    description.style.paddingLeft = "3px"
                    description.innerHTML = ""
                    if("geometry" in feature){
                        description.innerHTML += `Type : ${feature['geometry']['type']}<br/>`
                    }
                    description.innerHTML += `Properties:<a href="#"><img src="static/img/feature-properties.png" id="edit-properties-${layerId}-${i}" /></a>`
                    for(var prop in feature["properties"]){
                        description.innerHTML += `<div>${prop} : ${feature["properties"][prop]}</div>`
                    }
                }
                this.showLayerFeatures(feature, newNode)
                subnodes.append(newNode)
                let ff = feature
                document.getElementById("edit-feature-"+layerId+"-"+i).onclick = (e)=>{
                    t.editing.selectedFeature = ff
                    t.lastPointDrawing = null
                    t.addingDrawing = false
                    t.updateLayer(t.editing,t.editing.originaldata,true)
                    t.updateLayerView(t.layers)
                }
                if(feature == this.editing.selectedFeature){
                    document.getElementById("edit-properties-"+layerId+"-"+i).onclick = (e)=>{
                        t.propertiesDialogWindow.action(e,true,this.editing.selectedFeature,this.editing.scheme)
                        //new PropertyDialogWindow()
                    }
                    this.element.scrollTop = newNode.offsetTop + this.element.getBoundingClientRect().height/2
                }
            }
        }
    }
    
    copyGeoJSON(initialData){
        switch(initialData['type']){
            case "FeatureCollection":
            case "GeometryCollection":
                var object = {}
                for(var key in initialData){
                    if(key == "features" || key == "geometries"){
                        object[key] = []
                        for(var i in initialData[key]){
                            var feature = initialData[key][i]
                            object[key].push(this.copyGeoJSON(feature))
                        }
                    } else {
                        object[key] = initialData[key]
                    }
                }
                return object
            default:
                return initialData
        }
    }
    validateAndTransformToGeoJson(data, type, dontparse){
        var newdata, copied, drawable = false, scheme = null
        switch(type){
            case "geojson":
                    newdata = dontparse ? data : JSON.parse(data)
                    scheme = this.tryGetScheme(newdata)
                    copied = this.copyGeoJSON(newdata)
                    var b = this.addBboxes(newdata)
                    drawable = true
                break
            case "json":
                    newdata = dontparse ? data : JSON.parse(data)
                    copied = newdata
                break
            case "test":
                    newdata = data
                    copied = newdata
                break
        }
        return {
            copied: copied,
            data: newdata,
            drawable: drawable,
            scheme: scheme,
        }
    }
    tryGetScheme(data){
        switch(data.type){
            case "FeatureCollection":
                var scheme = {}
                for(var i in data.features){
                    var feature = data.features[i]
                    if('properties' in feature){
                        for(var prop in feature.properties){
                            scheme[prop] = true
                        }
                    } else {
                        feature.properties = {}
                    }
                }
                return Object.keys(scheme)
                break
            case "Feature":
                var scheme = {}
                if('properties' in data){
                    for(var prop in data.properties){
                        scheme[prop] = true
                    }
                } else {
                    data.properties = {}
                }
                return Object.keys(scheme)
                break
        }
        return null
    }
    boxFromPoints(x,y){
        return {
            left: x-5, 
            right: x-(-5),
            top: y-5,
            bottom: y-(-5),
            points: 1,
        }
    }
    mergeBoxes(bbox1,bbox2){
        if(bbox1 == null || isNaN(bbox1.left))
            return {
                left: bbox2.left, 
                right: bbox2.right,
                top: bbox2.top,
                bottom: bbox2.bottom,
                points: bbox2.points,
            }
        if(bbox2 == null || isNaN(bbox2.left))
            return {
                left: bbox1.left, 
                right: bbox1.right,
                top: bbox1.top,
                bottom: bbox1.bottom,
                points: bbox1.points,
            }
            
        return {
            left: Math.min(bbox1.left,bbox2.left), 
            right: Math.max(bbox1.right,bbox2.right), 
            top: Math.min(bbox1.top,bbox2.top), 
            bottom: Math.max(bbox1.bottom,bbox2.bottom),
            points: bbox1.points+bbox2.points,
        }
    }
    mergeArrayBoxes(bbox1,bbox2){
        if(bbox1 == null)
            return [bbox2[0],bbox2[1],bbox2[2],bbox2[3]]
            
        return [
            Math.min(bbox1[0],bbox2[0]), 
            Math.min(bbox1[1],bbox2[1]), 
            Math.max(bbox1[2],bbox2[2]), 
            Math.max(bbox1[3],bbox2[3]),
        ]
    }
    getDeepestCoord(elem){
        if(elem instanceof Array){
            for(var i in elem){
                var res = this.getDeepestCoord(elem[i])
                if(res)
                    return this.getDeepestCoord(res)
            }
        } else {
            return elem
        }
        return null
    }
    addBboxes(data){
        var bbox = null
        if(data instanceof Array){
            for(var i in data){
                var elem = data[i]
                if(elem instanceof Array && elem.length>0 && elem[0] instanceof Array){
                    var getBbox = this.addBboxes(elem)
                    bbox = this.mergeBoxes(bbox, getBbox)
                } else {
                    bbox = this.mergeBoxes(bbox, this.boxFromPoints(elem[0], elem[1]))
                }
            }
            if(data.length>0 && data[0] instanceof Array){
                data.resolution = Math.max(Math.abs(bbox.left - bbox.right), Math.abs(bbox.top, bbox.bottom))
                if(data[0].length>0 && data[0][0] instanceof Array){
                    //data.sort((x,y)=>y.resolution-x.resolution)
                }
            }
            if(typeof data[0] == "number"){
                var box = this.boxFromPoints(data[0], data[1])
                delete box['points']
                return box
            }
                
            return bbox
        }
        switch(data.type){
            case "FeatureCollection":
                for(var i in data.features){
                    var newbbox = this.addBboxes(data.features[i])
                    bbox = this.mergeBoxes(bbox,newbbox)
                }
                break
            case "Feature":
                bbox = this.addBboxes(data.geometry)
                break
            case "GeometryCollection":
                for(var i in data.geometries){
                    var newbbox = this.addBboxes(data.geometries[i])
                    bbox = this.mergeBoxes(bbox,newbbox)
                }
                break
            case "MultiPolygon":
            case "Polygon":
            case "MultiLineString":
            case "LineString":
            case "MultiPoint":
            case "Point":
                bbox = this.addBboxes(data.coordinates)
                break
        }
        if(bbox == null)
            return null
        data.bbox = [bbox.left, bbox.top, bbox.right, bbox.bottom]
        data.pointNumber = bbox.points   //not cannonical
        if(bbox.points > 10000){
            switch(data.type){
                case "FeatureCollection":
                    this.trySplitBigCollection(data,"features")
                    break
                case "GeometryCollection":
                    this.trySplitBigCollection(data,"geometries")
                    break/*
                case "MultiPolygon":
                    this.trySplitBigCollection(data,"coordinates")
                    break*/
            }
        }
        return bbox
    }
    trySplitBigCollection(data,childName){
        var len = data[childName].length
        if(len < 10)
            return
        var childArray = data[childName]
        //if(childArray.length > 0 && "bbox" in childArray[0]){
            if(data.bbox[2]-data.bbox[0] > data.bbox[3]-data.bbox[1])
                childArray.sort((x,y)=>(x.bbox[0] - y.bbox[0])) //grupowanie po długości geograficznej
            else
                childArray.sort((x,y)=>(x.bbox[1] - y.bbox[1])) //grupowanie po szerokości geograficznej
        /*} else {
            childArray.sort((x,y)=>(this.getDeepestCoord(x) - this.getDeepestCoord(y)))
        }*/
        var array1 = [],array2 = [],array3 = []
        var bbox1 = null,bbox2 = null,bbox3 = null
        for(var i in childArray){
            var elem = childArray[i]
            var bbox = elem.bbox
            if(i < Math.floor(len/3)){
                array1.push(elem)
                bbox1 = this.mergeArrayBoxes(bbox1,bbox)
            } else if(i <= Math.floor(len*2/3)){
                array2.push(elem)
                bbox2 = this.mergeArrayBoxes(bbox2,bbox)
            } else {
                array3.push(elem)
                bbox3 = this.mergeArrayBoxes(bbox3,bbox)
            }
        }
        data[childName] = [
            {
                type: "Interval",
                bbox: bbox1,
                children: array1,
            },
            {
                type: "Interval",
                bbox: bbox2,
                children: array2,
            },
            {
                type: "Interval",
                bbox: bbox3,
                children: array3,
            },
        ]
        this.trySplitBigCollection(data[childName][0],"children")
        this.trySplitBigCollection(data[childName][1],"children")
        this.trySplitBigCollection(data[childName][2],"children")
    }
    
    hitTestPolygon(polygon,lon,lat){
        if(polygon.length == 0)
            return false
        var intersectionPoints = []
        for(var i = 0;i<polygon.length;i++){
            var e1 = polygon[i], e2 = polygon[(i+1) % polygon.length]
            if(e1[0] >= lon && e2[0] <= lon || e2[0] >= lon && e1[0] <= lon){
                var intersectionPoint = e1[1] + (lon-e1[0])/(e2[0]-e1[0])*(e2[1]-e1[1])
                intersectionPoints.push(intersectionPoint)
            }
        }
        intersectionPoints.sort((a,b)=>(a-b))
        return intersectionPoints.filter(x => x < lat).length % 2 == 1
    }
    
    hitTestPolygonWithHoles(polygon,lon,lat){
        if(this.hitTestPolygon(polygon[0],lon,lat)){
            for(var i = 1;i<polygon.length;i++){
                if(this.hitTestPolygon(polygon[i],lon,lat))
                    return false
            }
            return true
        }
        return false        
    }
    
    hitTestLineString(linestring,lon,lat,pixelDifference){
        if(linestring.length == 0)
            return false
        var intersectionPoints = []
        for(var i = 0;i<linestring.length;i++){
            var e1 = linestring[i], e2 = linestring[i+1]
            if(e1 == undefined || e2 == undefined)
                continue
            if(e1[0] >= lon && e2[0] <= lon || e2[0] >= lon && e1[0] <= lon){
                var intersectionPoint = e1[1] + (lon-e1[0])/(e2[0]-e1[0])*(e2[1]-e1[1])
                if(Math.abs(intersectionPoint-lat) <= pixelDifference){
                    return true
                }
            }
        }
        return false
    }
    
    pointsCloseToShowAuxiliaryPoints(lastpoint,coords,magfactor){
        return Math.sqrt(Math.pow(lastpoint[0] - coords[0],2) + Math.pow(lastpoint[1] - coords[1],2)) > magfactor * 8
    }
    auxiliaryPointsPosition(lastpoint,coords,first,x,magfactor){
        var d = Math.sqrt(Math.pow(coords[0] - lastpoint[0],2) + Math.pow(coords[1] - lastpoint[1],2))
        if(first){
            return x 
                ? 
                    lastpoint[0] + (coords[0] - lastpoint[0])/d * magfactor * 4
                :
                    lastpoint[1] + (coords[1] - lastpoint[1])/d * magfactor * 4
        } else {
            return x
                ?
                    coords[0] - (coords[0] - lastpoint[0])/d * magfactor * 4
                :   
                    coords[1] - (coords[1] - lastpoint[1])/d * magfactor * 4
        }
    }
    
    checkPointsOfShape(feature,lon,lat,degreeBounds,pixelDifference,magnification){
        
        if(!(feature instanceof Object))
            return null

        if("bbox" in feature && (
            feature.bbox[0] > lon || 
            feature.bbox[1] > lat || 
            feature.bbox[2] < lon || 
            feature.bbox[3] < lat)
        )
            return null
        switch(feature.type){
            case "FeatureCollection":
                for(var i in feature.features){
                    var result = this.checkPointsOfShape(feature.features[i],lon,lat,degreeBounds,pixelDifference,magnification)
                    if(result != null)
                        return result
                }
            case "Feature":
                var result = this.checkPointsOfShape(feature.geometry,lon,lat,degreeBounds,pixelDifference,magnification)
                if(result != null)
                    return result
                    
            case "Interval":
                for(var i in feature.children){
                    var result = this.checkPointsOfShape(feature.children[i],lon,lat,degreeBounds,pixelDifference,magnification)
                    if(result != null)
                        return result
                }
                break
            case "MultiPolygon":
                for(var i in feature.coordinates){
                    if(i == "resolution")
                        continue
                        
                    var result = this.checkPointsOfCoords(feature.coordinates[i],lon,lat,pixelDifference,magnification)
                    if(result)
                        return result
                }
                break
            case "Polygon":
                var result = this.checkPointsOfCoords(feature.coordinates,lon,lat,pixelDifference,magnification)
                if(result)
                    return result
                break
            case "LineString":
                var result = this.checkPointsOfCoords(feature.coordinates,lon,lat,pixelDifference,magnification)
                if(result)
                    return result
                break
            case "MultiLineString":
                for(var i in feature.coordinates){
                        
                    if(i == "resolution")
                        continue
                        
                    var geometry = feature.coordinates[i]
                    var result = this.checkPointsOfCoords(geometry,lon,lat,pixelDifference,magnification)
                    if(result)
                        return result
                }
                break
        }
        return null
    }
    
    checkPointsOfCoords(feature,lon,lat,pixelDifference,magnification){
        if(typeof feature[0] == "number"){
            if(Math.max(Math.abs(lon-feature[0]),Math.abs(lat-feature[1])) < pixelDifference/5){
                return {feature:feature,type:'exact'}
            }
        } else {
            var lastfeature = null,stilllastfeature = null
            var breakpoint = false
            
            var magfactor = pixelDifference/6
            
            var editpoint1 = null, editpoint2 = null
            for(var i in feature){
                if(typeof feature[i][0] == "number"){
                    if(lastfeature != null && Math.max(Math.abs(lastfeature[0]-feature[i][0]),Math.abs(lastfeature[1]-feature[i][1])) < magfactor){
                        breakpoint = true
                        continue
                    }
                    if(lastfeature!=null && !breakpoint && this.pointsCloseToShowAuxiliaryPoints(lastfeature,feature[i],magfactor)){
                        var p1x = this.auxiliaryPointsPosition(lastfeature,feature[i],true,true,magfactor)
                        var p1y = this.auxiliaryPointsPosition(lastfeature,feature[i],true,false,magfactor)
                        
                        var p2x = this.auxiliaryPointsPosition(lastfeature,feature[i],false,true,magfactor)
                        var p2y = this.auxiliaryPointsPosition(lastfeature,feature[i],false,false,magfactor)
                        editpoint1 = this.checkPointsOfCoords([p1x,p1y],lon,lat,pixelDifference,magnification)
                        editpoint2 = this.checkPointsOfCoords([p2x,p2y],lon,lat,pixelDifference)
                        stilllastfeature = lastfeature
                    }
                    lastfeature = feature[i]
                    breakpoint = false
                }
                var result = this.checkPointsOfCoords(feature[i],lon,lat,pixelDifference,magnification)
                if(result != null){
                    if(typeof feature[i][0] == "number")
                        result.geometry = feature
                    return result
                }
                if(editpoint1 != null)
                    return {feature:stilllastfeature,type:'between',geometry:feature}
                if(editpoint2 != null)
                    return {feature:feature[i],type:'betweenback',geometry:feature}
            }
        }
        return null
    }

    allLayersHitTest(lon,lat,degreeBounds,pixelDifference,magnification,availableShapes){
        var layerset = []
        for(var i in this.layers.children){
            layerset.push({key:i,value:this.layers.children[i]})
        }
        layerset = layerset.reverse()
        
        for(var i in layerset){
            
            var key = layerset[i].key
            var layer = layerset[i].value
            
            var feature = this.hitTest(layer.data,lon,lat,degreeBounds,pixelDifference,magnification,availableShapes)
            
            if(feature != null && feature != this.editing.selectedFeature)
                return feature
        }
        return null
    }
    
    hitTest(layer,lon,lat,degreeBounds,pixelDifference,magnification,availableShapes){
        if(!(layer instanceof Object))
            return null

        if("bbox" in layer && (
            layer.bbox[0] > lon || 
            layer.bbox[1] > lat || 
            layer.bbox[2] < lon || 
            layer.bbox[3] < lat)
        )
            return null
        switch(layer.type){
            case "FeatureCollection":
                for(var i = layer.features.length-1;i>=0;i--){
                    var result = this.hitTest(layer.features[i],lon,lat,degreeBounds,pixelDifference,magnification,availableShapes)
                    if(result != null)
                        return result
                }
                break
            case "Feature":
                if(this.hitTest(layer.geometry,lon,lat,degreeBounds,pixelDifference,magnification,availableShapes) != null && (availableShapes == undefined || availableShapes.filter(x=>x == layer.geometry.type).length > 0))
                    return layer
                    
                break
            case "Interval":
                if(layer.children != undefined)
                for(var i = layer.children.length-1;i>=0;i--){
                    var result = this.hitTest(layer.children[i],lon,lat,degreeBounds,pixelDifference,magnification,availableShapes)
                    if(result != null)
                        return result
                }
                break
            case "MultiPolygon":
                for(var i = layer.coordinates.length-1;i>=0;i--){
                    if(i == "resolution")
                        continue
                        
                    var result = this.hitTestPolygonWithHoles(layer.coordinates[i],lon,lat)
                    if(result)
                        return layer
                }
                break
            case "Polygon":
                var result = this.hitTestPolygonWithHoles(layer.coordinates,lon,lat)
                if(result)
                    return layer
                break
            case "LineString":
                var result = this.hitTestLineString(layer.coordinates,lon,lat,pixelDifference)
                if(result)
                    return layer
                break
            case "MultiLineString":
                    for(var i in layer.coordinates){
                        
                    if(i == "resolution")
                        continue
                        
                    var geometry = layer.coordinates[i]
                    var result = this.hitTestLineString(geometry,lon,lat,pixelDifference)
                    if(result)
                        return layer
                    
                }
                break
            case "Point":
                if(Math.max(Math.abs(lon-layer.coordinates[0]),Math.abs(lat-layer.coordinates[1])) < pixelDifference/5){
                    return layer
                }
                break
        }
        return null
    }
    
    dontUpdateAllWhenClick(){
        //console.log(this.editing,this.editing.selectedFeature)
        return this.editing != null && this.editing.selectedFeature != null
    }
    
    coordDistance(a,b){
        return Math.abs(a.x-b.x)+Math.abs(a.y-b.y)
    }
    
    notifyClick(lon,lat,degreeBounds,pixelDifference,magnification){
        if(this.editing != null){
            if(this.addingDrawing){
                this.editing.selectedPoint = null
                switch(this.addingDrawingType){
                    case "Polygon":
                    case "LineString":
                        var newPoint = [lon,lat]
                        if(this.lastPointDrawing != null && this.checkPointsOfCoords(this.lastPointDrawing,lon,lat,pixelDifference,magnification)){
                            this.stopAddingShape()
                            return true
                        }
                        
                        var lineToAdd = null
                        if(this.addWholeLines){
                            var lineToAdd = this.allLayersHitTest(lon,lat,degreeBounds,pixelDifference,magnification,['LineString'])
                        }
                        var coords = []
                        if(lineToAdd != null){
                            coords = lineToAdd.geometry.coordinates.slice()
                            if(this.coordDistance(newPoint,coords[coords.length-1]) < this.coordDistance(newPoint,coords[0]))
                                coords = coords.reverse()
                        } else {
                            coords = [newPoint]
                        }
                        for(var i in coords){
                            if(this.lastShapeDrawing.length == 0){
                                this.lastShapeDrawing.push(coords[i])
                            } else {
                                var index = this.lastShapeDrawing.findIndex(x=>x==this.lastPointDrawing)
                                if(!this.reverseAddingDrawing)
                                    this.lastShapeDrawing.splice(index+1,0,coords[i])
                                else
                                    this.lastShapeDrawing.splice(index,0,coords[i])
                            }
                            this.lastPointDrawing = coords[i]//newPoint
                        }
                        break
                    case "Point":
                        var newPoint = [lon,lat]
                        
                        this.lastShapeDrawing[0] = lon
                        this.lastShapeDrawing[1] = lat
                        this.lastShapeDrawing.length = 2
                        
                        this.lastPointDrawing = this.lastShapeDrawing
                        
                        this.stopAddingShape()
                        return true
                        
                        break
                }
                this.updateLayerView(this.layers)
                return true
            } else if(this.deletingShapes){
                this.editing.selectedPoint = null
                var selectedFeature = this.hitTest(this.editing.data,lon,lat,degreeBounds,pixelDifference,magnification)
                if(selectedFeature != null){
                    if(selectedFeature == this.editing.selectedFeature){
                        this.deleteShape(selectedFeature)
                    } else {
                        this.editing.selectedFeature = selectedFeature
                    }
                    this.updateLayerView(this.layers)
                }
                return true
            } else if(this.operationOnShapes){
                
                var selectedFeature = this.allLayersHitTest(lon,lat,degreeBounds,pixelDifference,magnification)
                if(selectedFeature != null)
                    this.operateShapeToSelect(this.operationOnShapesType,selectedFeature)
                /*
                var previousEditing = this.editing.selectedFeature
                this.editing.selectedFeature = selectedFeature
                if(this.editing.selectedFeature == null){
                    this.editing.selectedPoint = null
                } else if(previousEditing == selectedFeature){
                    this.propertiesDialogWindow.action(null,true,this.editing.selectedFeature,this.editing.scheme)
                }*/
                
                this.operationOnShapes = false
                this.operationOnShapesType = null
                this.updateLayerView(this.layers)
            } else {
                var selectedPoint = null
                if(this.editing.selectedFeature != null){
                    selectedPoint = this.checkPointsOfShape(this.editing.selectedFeature,lon,lat,degreeBounds,pixelDifference,magnification)

                    if(selectedPoint != null){
                        if(selectedPoint.type == 'exact'){
                            if(this.editing.selectedPoint == selectedPoint.feature){
                                this.editing.selectedPoint = null
                                this.lastPointDrawing = null
                                this.lastShapeDrawing = null
                            } else {
                                this.editing.selectedPoint = selectedPoint.feature
                                this.lastPointDrawing = selectedPoint.feature
                                this.lastShapeDrawing = selectedPoint.geometry
                            }
                        } else if(selectedPoint.type == 'between'){
                            this.editing.selectedPoint = selectedPoint.feature
                            this.startEditingPolygon(selectedPoint.feature,selectedPoint.geometry,false)
                        } else if(selectedPoint.type == 'betweenback'){
                            this.editing.selectedPoint = selectedPoint.feature
                            this.startEditingPolygon(selectedPoint.feature,selectedPoint.geometry,true)
                        }
                        return true
                    }
                }
                if(selectedPoint == null && this.editing.selectedPoint != null){
                    this.changePointPosition(this.editing.selectedPoint,lon,lat)
                } else {
                    var selectedFeature = this.hitTest(this.editing.data,lon,lat,degreeBounds,pixelDifference,magnification)
                    
                    var previousEditing = this.editing.selectedFeature
                    this.editing.selectedFeature = selectedFeature
                    if(this.editing.selectedFeature == null){
                        this.editing.selectedPoint = null
                        this.lastPointDrawing = null
                        this.lastShapeDrawing = null
                    } else if(previousEditing == selectedFeature){
                        this.propertiesDialogWindow.action(null,true,this.editing.selectedFeature,this.editing.scheme)
                    }
                    
                    this.updateLayerView(this.layers)

                }
                return true
            }
        }
        return false
    }
    
    notifyMouseDown(lon,lat,degreeBounds){
        return false
    }
    
    notifyMouseMove(lon,lat,degreeBounds){
        return false
    }
    
    notifyStopMoving(lon,lat,degreeBounds){
        return false
    }
    
    notifyKeyPress(key){
        switch(key){
            case "Backspace":
                return this.notifyBackspace()
                break
        }
        return false
    }
    notifyBackspace(){
        if(this.editing != null){
            if(this.addingDrawing){
                switch(this.addingDrawingType){
                    case "Polygon":
                    case "LineString":
                        this.lastShapeDrawing.pop()
                        if(this.lastShapeDrawing.length > 1){
                            this.lastPointDrawing = this.lastShapeDrawing[this.lastShapeDrawing.length-1]
                        } else {
                            this.lastPointDrawing = null
                        }
                        break
                }
                this.updateLayerView(this.layers)
                return true
            } else if(this.deletingShapes){
            } else {
                if(this.editing.selectedFeature != null && this.editing.selectedPoint != null){
                    this.deleteSelectedPoint()
                    return true
                }
                
            }
        }
        return false
    }
}









