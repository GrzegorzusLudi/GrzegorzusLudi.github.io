
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
        this.snapToLines = false
        
        this.selectedPoint = null
        
        this.lastbounds = null
        this.lastresolution = null
        
        this.deletingShapes = false
        
        this.globalDate = '2020-01-01'
        
        let t = this
        this.propertiesDialogWindow = new PropertyDialogWindow({
            element: "feature-properties",
            canvas: t.canvas,
            layerpanel: t,
            table: "feature-table",
            coordsTable: "coords-table",
            updateButton: "feature-properties-update",
            tempTable: "feature-temp-table",
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
        this.copyToLayerDialogWindow = new CopyToLayerWindow({
            element: "copy-to-layer-window",
            canvas: t.canvas,
            layerpanel: t,
            updateButton: "copy-to-layer-update",
            select: "copy-to-layer-layer",
            tempControls: "copy-to-layer-temp-controls"
        })
        
        
        this.counter = 0
        this.updateLayerView(this.layers,null)
        
    }
    setGlobalDate(date){
        this.globalDate = date
        this.timeControl.setDate(date)
                
        if(this.editing && this.editing.selectedFeature != null && !this.checkIfFeatureSelectableInTime(this.editing.selectedFeature)){
            this.editing.selectedFeature = null
        }
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
                case "editFeatureTimeToolbar":
                    this.editFeatureTimeToolbar = document.getElementById(configs[option])
                    break
                case "canvas":
                    this.canvas = configs[option]
                    break;
                case "timeControl":
                    this.timeControl = configs[option]
                    break;/*
                case "timeControl":
                    this.timeControl = configs[option]
                    let th = this
                    this.timeControl.setListener(() => {th.renderLayers()})
                    break;*/
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
                pointSignificance: {
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
            transformed = this.validateAndTransformToGeoJson(od, layer.type, true, layer.data)
        } else {
            switch(layer.type){
                case "tempgeojson":
                case "geojson":
                case "json":
                    newData = JSON.stringify(layer.originaldata)
                    break
                default:
                    newData = layer.originaldata
            }
            transformed = this.validateAndTransformToGeoJson(newData, layer.type)
        }
        
        
        if(!keeporiginaldata){
            layer.originaldata = transformed["copied"]
            layer.data = transformed["data"]
            layer.drawable = transformed["drawable"]
        }
        
        this.render(layer)
        this.updateLayerView(this.layers)
        this.canvas.draw()
        
    }
    
    renderLayers(bounds, resolution){
        this.pointrendermap = {}
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
            
        var featuresGroupedByIds = {}
        var ungroupedFeatures = []
        this.mapLayerToRendered(layer.data,layer.rendered,bounds,resolution,featuresGroupedByIds,ungroupedFeatures,layer)
        if(this.isSpatiotemporal(layer)){
            layer.rendered.features = this.aggregateFeatures(featuresGroupedByIds,ungroupedFeatures,layer, bounds, resolution)
        }
    }

    
    aggregateFeatures(featuresGroupedByIds,ungroupedFeatures, layer, bounds, resolution){
        var newRendered = []
        for(var id in featuresGroupedByIds){
            /*if(this.editing != null && this.editing.selectedFeature != null && id == this.editing.selectedFeature.id){
                for(var i in featuresGroupedByIds[id]){
                    newRendered.push(featuresGroupedByIds[id][i])
                }
                //continue
            }*/
            var features = featuresGroupedByIds[id].concat(ungroupedFeatures).filter(x => x.type != null)
            features.sort((a,b) => a.timebox_from-b.timebox_from)

            if(features.length == 0)
                continue
                
            this.aggregateFeaturesById(features, layer, bounds, resolution, newRendered)
        }
        if(Object.keys(featuresGroupedByIds).length == 0){
            var features = ungroupedFeatures.filter(x => x.type != null)
            features.sort((a,b) => a.timebox_from-b.timebox_from)

            if(features.length > 0)
                this.aggregateFeaturesById(features, layer, bounds, resolution, newRendered)
        }
        
        return newRendered
    }
    aggregateFeaturesById(features, layer, bounds, resolution, newRendered){
        var newF = features.filter(x => x.operation == 'NEW' || x.operation == 'NEW_ALL_FEATURES')
        var firstFeature
        if(newF.length == 0){
            features = features.sort((a,b) => this.compareDates(a.timebox_from,b.timebox_from))
            firstFeature = features[0]
            features = features.slice(1)
        } else {
            firstFeature = newF[0]
            features = features.filter(x=>x.operation != 'NEW' && x.operation != 'NEW_ALL_FEATURES')
            features = features.sort((a,b) => this.compareDates(a.timebox_from,b.timebox_from))
        }
        firstFeature.type = "Feature"
        for(var i=0;i<features.length;i++){
            var feature = features[i]
            feature.type = "Feature"
            var newGeom = null
            //if(!this.validPolygon(feature))
            //    continue
            switch(feature.operation){
                case 'UNION':
                    newGeom = turf.union(firstFeature,feature)
                    break
                case 'DIFF':
                    newGeom = turf.difference(firstFeature,feature)
                    break
                case 'INTERSECT':
                    newGeom = turf.intersect(firstFeature,feature)
                    break
                case 'PROPERTY_CHANGE':
                    newGeom = firstFeature
                    break
                case 'NEW_ALL_FEATURES':
                case 'UNION_ALL_FEATURES':
                    if(feature.id == firstFeature.id){
                        if(feature.operation != 'NEW_ALL_FEATURES')
                            newGeom = turf.union(firstFeature,feature)
                    } else {
                        newGeom = turf.difference(firstFeature,feature)
                    }
                    break
            }
            feature.type = "TempFeature"
            if(newGeom == null)
                continue
            firstFeature.geometry = newGeom.geometry
            
            for(var key in feature.properties){
                var prop = feature.properties[key]
                
                firstFeature.properties[key] = prop
            }
        }
        firstFeature.type = "TempFeature"
        /*if(firstFeature.geometry.type == "Point" && this.getStyleProperties(layer,'pointSignificance',firstFeature) != undefined){
            if(this.pointToLayerPoint(layer,firstFeature,bounds,resolution)){
                newRendered.push(firstFeature)
            }
        } else {*/
            newRendered.push(firstFeature)
        //}
    }
    pointToLayerPoint(layer,feature,bounds,resolution){
        var point = feature.geometry.coordinates
        var x = Math.floor(point[0]/resolution/40)
        var y = Math.floor(point[1]/resolution/40)
         
        if(!(x+','+y in this.pointrendermap) || this.getStyleProperties(layer,'pointSignificance',feature) > this.getStyleProperties(layer,'pointSignificance',this.pointrendermap[x+','+y])){
            
            if("bbox" in feature && (
                feature.bbox[0] > bounds.right || 
                feature.bbox[1] > bounds.bottom || 
                feature.bbox[2] < bounds.left || 
                feature.bbox[3] < bounds.top)
            )
                return false
                
            this.pointrendermap[x+','+y] = feature
            return true
        }
        return false
        
    }
    
    validPolygon(feature){
        if(feature == null)
            return false
        if(feature.geometry.type == 'Polygon'){
            if(feature.geometry.coordinates[0].length < 3)
                return false
        } else if(feature.geometry.type == 'MultiPolygon'){
            for(var i in feature.geometry.coordinates){
                var poly = feature.geometry.coordinates[i][0]
                if(poly != undefined && poly.length >= 3)
                    return true
            }
            return false
        }
        return true
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
    
    padDate(date){
        if(date[0] == '-')
            return date.slice(1).padStart(16,'0')
        return date.padStart(16,'0')
    }
    compareDates(date1,date2){/*
        if(date1[0] == '-'){
            if(date2[0] == '-'){
                return -this.padDate(date1).localeCompare(this.padDate(date2))
            } else {
                return -1
            }
        } else {
            if(date2[0] == '-'){
                return 1
            } else {
                return this.padDate(date1).localeCompare(this.padDate(date2))
            }
        }*/
        if(date1 == "")
            return -1
            
        if(date2 == "")
            return -1
        var czdate1 = new CzDate(date1), czdate2 = new CzDate(date2)
                
        if(czdate1.year == czdate2.year && czdate1.month == czdate2.month && czdate1.day == czdate2.day)
            return 0
            
        if(czdate1.year < czdate2.year || czdate1.year == czdate2.year && czdate1.month < czdate2.month || czdate1.year == czdate2.year && czdate1.month == czdate2.month && czdate1.day < czdate2.day)
            return -1
            
        if(czdate1.year > czdate2.year || czdate1.year == czdate2.year && czdate1.month > czdate2.month || czdate1.year == czdate2.year && czdate1.month == czdate2.month && czdate1.day > czdate2.day)
            return 1
    }
    checkIfFeatureInTime(feature){
        return (!('timebox_to' in feature) || feature.timebox_to == '' || this.compareDates(feature.timebox_to,this.globalDate) > -1) && (!('timebox_from' in feature) || feature.timebox_from == '' || this.compareDates(feature.timebox_from,this.globalDate) < 1)
    }
    checkIfFeatureSelectableInTime(feature){
        return (!('selectable_to' in feature) || feature.selectable_to == '' || this.compareDates(feature.selectable_to,this.globalDate) > -1) && (!('selectable_from' in feature) || feature.selectable_from == '' || this.compareDates(feature.selectable_from,this.globalDate) < 1)
    }
    
    mapLayerToRendered(layer,rendered,bounds,resolution,featuresGroupedByIds,ungroupedFeatures,topLayer){
        var lastPositionx = null, lastPositiony = null, penultimalPositionx = null, penultimalPositiony = null, notinbounds = null, notadded = false

        for(var property in layer){
            var value = layer[property]
            if(value instanceof Object && !(value instanceof Array)){
                if(layer instanceof Array && "resolution" in value && value.resolution<resolution*4){
                    break
                }
                if((!("operation" in value) || (value.operation != 'PROPERTY_CHANGE' && value.operation != 'INTERSECT' && value.operation != 'NEW' && value.operation != 'NEW_ALL_FEATURES')) && "bbox" in value && (
                    value.bbox[0] > bounds.right || 
                    value.bbox[1] > bounds.bottom || 
                    value.bbox[2] < bounds.left || 
                    value.bbox[3] < bounds.top) ||
                    (Math.abs(bounds.right-bounds.left) < resolution && Math.abs(bounds.bottom-bounds.top) < resolution)
                )
                    continue
                
                if('timebox_to' in value && !this.checkIfFeatureInTime(value)){
                    continue
                }
                    
                    
                var newObject = {}
                rendered[property] = newObject
                if(value.type == "TempFeature"){
                    if('geometry' in value && value.geometry.type == "Point" && this.getStyleProperties(topLayer,'pointSignificance',value) != undefined){
                        if(!this.pointToLayerPoint(topLayer,value,bounds,resolution))
                            continue
                    }
                    switch(value.operation){
                        case "NEW":
                        case "DIFF":
                        case "INTERSECT":
                        case "UNION":
                        case "PROPERTY_CHANGE":
                            if(featuresGroupedByIds[value.id] == undefined)
                                featuresGroupedByIds[value.id] = []
                            featuresGroupedByIds[value.id].push(newObject)
                            break
                        case "NEW_ALL_FEATURES":
                            if(featuresGroupedByIds[value.id] == undefined)
                                featuresGroupedByIds[value.id] = []
                            featuresGroupedByIds[value.id].push(newObject)
                            ungroupedFeatures.push(newObject)
                            break
                        case "UNION_ALL_FEATURES":
                            ungroupedFeatures.push(newObject)
                            break
                    }
                }
                
               
                this.mapLayerToRendered(value,newObject,bounds,resolution,featuresGroupedByIds,ungroupedFeatures,topLayer)
            } else if(layer instanceof Array && value instanceof Array && value.length > 0 && typeof value[0] == "number"){
                /*
                var posx = Math.min(Math.max(value[0], bounds.left), bounds.right)
                var posy = Math.min(Math.max(value[1], bounds.top), bounds.bottom)
                */
                var posx = value[0]
                var posy = value[1]

                var wasnotinbounds = notinbounds
                notinbounds = posx !== value[0] || posy !== value[1]
                if(lastPositionx === null || property === layer.length-1){
                    lastPositionx = posx
                    lastPositiony = posy
                    
                    notadded = true
                    rendered.push([posx,posy])
                } else if(Math.abs(lastPositionx-posx) + Math.abs(lastPositiony-posy) > resolution){
                    notadded = false

                    rendered.push([posx,posy])
                    /*
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
                    }*/
                    lastPositionx = posx
                    lastPositiony = posy
                }
            
            } else if(value instanceof Array){
                if(layer instanceof Array && "resolution" in value && value.resolution<resolution*4){
                    break
                }
                var newObject = []
                rendered[property] = newObject
                this.mapLayerToRendered(value,newObject,bounds,resolution,featuresGroupedByIds,ungroupedFeatures,topLayer)     
            } else {
                rendered[property] = value
                
                if(property == "type" && (value == "Feature" || value == "TempFeature")){
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
        this.layerPropertiesDialogWindow.action(e,true,layer,null,this.globalDate)
    }
    
    startEditingLayer(e,layerName,layerTreeElement){
        this.editing = this.layers.children[layerName]
        this.editing.edited = true
        this.updateLayerView(this.layers)
    }
    
    stopEditingLayer(e,layerName,layerTreeElement){
        this.updateLayer(this.editing,this.editing.originaldata)

        this.editing.edited = false
        this.editing.selectedFeature = null
        this.editing.selectedPoint = null
        
        this.lastShapeDrawing = null
        this.lastPointDrawing = null
        this.editing = null
        this.updateLayerView(this.layers)
    }
    
    determineExtension(layer){
        var layerName = layer.name
        if(layerName.split('.').pop() == layer.type)
            return layerName
        return layerName + '.' + layer.type
    }
    saveEditingLayer(e,layer){
        var content = JSON.stringify(layer.originaldata)
        var fileName = this.determineExtension(layer)
        var a = document.createElement("a");
        var file = new Blob([content], {type: 'text/plain'});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }
    
    addWholeLinesChange(){
        this.addWholeLines = !this.addWholeLines
        this.updateLayerView(this.layers)
    }
    
    snapToLinesChange(){
        this.snapToLines = !this.snapToLines
        this.updateLayerView(this.layers)
    }
    
    isSpatiotemporal(layer){
        return layer && layer.type == 'tempgeojson'
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
            
            newNode.innerHTML = "<div>"+layer.name+' '+(this.isSpatiotemporal(layer) ? '<img src="static/img/clock.png" alt="spatiotemporal" title="spatiotemporal" />' : '')
            
            newNode.innerHTML += '<a href="#"><img id="button-show-'+i+'" src="static/img/eye-open.png" alt="show/hide layer" title="show/hide later" /></a>'
            newNode.innerHTML += '<a href="#"><img id="button-remove-'+i+'" src="static/img/remove-layer.png" alt="remove layer" title="remove layer" /></a>'
            newNode.innerHTML += '<a href="#"><img id="button-to-top-'+i+'" src="static/img/to-top.png" alt="to top" title="to top" /></a>'
            newNode.innerHTML += '<a href="#"><img id="button-to-bottom-'+i+'" src="static/img/to-bottom.png" alt="to bottom" title="to bottom" /></a>'
            if(!layer.edited || this.editing == null){
                newNode.innerHTML += '<a href="#"><img id="edit-layer-'+i+'" src="static/img/edit-layer.png" alt="edit layer" title="edit layer" /></a>'
            } else {
                newNode.innerHTML += '<a href="#"><img id="save-layer-'+i+'" src="static/img/save-layer.png" alt="save layer" title="save layer" /></a>'
                newNode.innerHTML += '<a href="#"><img id="dont-edit-layer-'+i+'" src="static/img/dont-edit-layer.png" alt="don\'t save layer" title="don\'t save layer" /></a>'
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
                document.getElementById('dont-edit-layer-'+i).onclick = (e)=>{th.stopEditingLayer(e,name,newNode)}
                document.getElementById('save-layer-'+i).onclick = (e)=>{th.saveEditingLayer(e,layer)}                
            }
            document.getElementById('button-layer-properties-'+i).onclick = (e)=>{th.layerProperties(e,name,newNode,layer)}
            
            
        }
        this.updateEditToolbar()
    }
    
    updateEditToolbar(){
        this.editToolbar.style.display = 'none'
        this.editFeatureToolbar.style.display = 'none'
        this.editFeatureTimeToolbar.style.display = 'none'
        var th = this
        if(this.editing != null && (this.editing.type == 'geojson' || this.editing.type == 'tempgeojson')){
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
            
            var snapButton = document.getElementById('snap')
            snapButton.onclick = (e)=>{th.snapToLinesChange();e.preventDefault()}
            snapButton.style.border = this.snapToLines ? "2px solid yellow" : ""
            
            if(this.editing.selectedFeature != null){
                this.editFeatureToolbar.style.display = 'inline-block'
                if(this.editing.type == "tempgeojson")
                    this.editFeatureTimeToolbar.style.display = 'inline-block'

                
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
                
                var copyToLayerButton = document.getElementById('copy-to-layer')
                copyToLayerButton.onclick = (e)=>{th.copyToLayerWindow(e);e.preventDefault()}
                
                
                var addTimeVersionButton = document.getElementById('add-time-version')
                addTimeVersionButton.onclick = (e)=>{th.startAddingShape("Polygon","time");e.preventDefault()}
                addTimeVersionButton.style.border = this.addingAction == "time" ? "2px solid yellow" : ""
                
                var addTimePropertyVersionButton = document.getElementById('add-time-property-version')
                addTimePropertyVersionButton.onclick = (e)=>{th.startAddingTimeProperty();e.preventDefault()}
                //addTimePropertyVersionButton.style.border = this.addingAction == "time" ? "2px solid yellow" : ""
                
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
    
    copyToLayerWindow(e){
        if(!this.addingDrawing)
            this.copyToLayerDialogWindow.action(e,true,this.editing.selectedFeature)
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
    
    actionResultingInOperation(action){
        return action != null && action != "time"
    }
    startAddingTimeProperty(){
        this.editing.previouslySelectedFeature = this.editing.selectedFeature
        this.addingFeatureId = this.editing.selectedFeature.id
        
        this.deletingShapes = false
        //if(!this.addingDrawing){
            this.editing.selectedFeature = null
            this.addingDrawing = true
            this.reverseAddingDrawing = false
            //if(this.editing.selectedFeature == null){newCoords
            var newFeature
            
            var id = this.addingFeatureId
            var from_date = this.globalDate
            newFeature = {type:"TempFeature",id:id,operation:"PROPERTY_CHANGE",from:from_date,to:"",properties:{},adding:true}
            this.editing.selectedFeature = newFeature
            
            this.editing.data.features.push(newFeature)
            this.editing.originaldata.features.push(newFeature)
            delete this.editing.selectedFeature['adding']
                
            this.editing.selectedFeature = null
            this.addingAction = null
            this.editing.selectedPoint = null
            this.addingDrawing = false
            this.addingDrawingType = null
            this.lastShapeDrawing = null
            this.lastPointDrawing = null
            this.operationOnShapes = false
            this.operationOnShapesType = null
            
            this.updateLayer(this.editing,this.editing.originaldata,true)
                
            this.propertiesDialogWindow.action(null,true,newFeature,this.editing.scheme)
            //}
        //} else {
        //    this.stopAddingShape()
        //}
        this.updateLayerView(this.layers)
        
        //////////////
    }
    startAddingShape(shape,action){
        this.addingAction = action ? action : null
        if(action == 'time'){
            this.addingFeatureId = this.editing.selectedFeature.id
        }
            
        if(this.actionResultingInOperation(action)){
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
            var newFeature
            
            if(this.isSpatiotemporal(this.editing)){
                var id = action == 'time' ? this.addingFeatureId : null
                var from_date = action == 'time' ? this.globalDate : ""
                newFeature = {type:"TempFeature",id:id,operation:"NEW_ALL_FEATURES",from:from_date,to:"",geometry:{type:shape,coordinates:coords},properties:{},adding:true}
            } else {
                newFeature = {type:"Feature",geometry:{type:shape,coordinates:coords},properties:{},adding:true}
            }
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
            case "TempFeature":
            case "Feature":
                let index = this.editing.data.features.indexOf(selectedFeature)
                let index2 = this.editing.originaldata.features.indexOf(selectedFeature)
                if(index !== -1) {
                    this.editing.data.features.splice(index, 1);
                    this.editing.originaldata.features.splice(index2, 1);
                    this.editing.selectedFeature = null
                }
                break
        }

        this.updateLayer(this.editing,this.editing.data,true)
        this.updateLayerView(this.layers)
    }
    
    detectUpdate(){
        return this.editing.selectedFeature != null && (this.lastShapeDrawing == null || this.lastShapeDrawing.length > 0)
    }
    stopAddingShape(){
        var update = this.detectUpdate()
        if(update && (this.editing.selectedFeature == null || this.editing.selectedFeature.adding)){
            var newFeature
            switch(this.addingDrawingType){
                case "Polygon":
                case "LineString":
                case "Point":
                    newFeature = this.editing.selectedFeature
                    break
            }
            
            var temp = this.editing.selectedFeature.type == "TempFeature"
            if(temp && this.actionResultingInOperation(this.addingAction)){
                this.editing.selectedFeature.type = "Feature"
                this.editing.previouslySelectedFeature.type = "Feature"
            }
            switch(this.addingAction){
                case null:
                case "time":
                    this.editing.data.features.push(newFeature)
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
            if(temp && this.actionResultingInOperation(this.addingAction)){
                this.editing.selectedFeature.type = "TempFeature"
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
        var temp = this.editing.selectedFeature.type == "TempFeature"
        if(temp){
            this.editing.selectedFeature.type = "Feature"
        }
        var temp2 = newFeature.type == "TempFeature"
        if(temp2){
            newFeature.type = "Feature"
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
        if(temp){
            this.editing.selectedFeature.type = "TempFeature"
        }
        if(temp2){
            newFeature.type = "TempFeature"
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
    
    groupFeaturesByIds(collection){
        var grouped = {}
        var ungrouped = []

        var collection = collection.slice().sort((a,b)=>(a.id-b.id))
        
        for(var i in collection){
            var feature = collection[i]
            
            var id = feature.id
            if(id == undefined){
                ungrouped.push(feature)
            } else {
                if(grouped[id] == undefined)
                    grouped[id] = []
                grouped[id].push(feature)
            }
        }
        for(var i in grouped){
            grouped[i].sort((a,b)=>this.compareDates(a.from,b.from))
        }
        return {grouped: grouped, ungrouped: ungrouped}
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
            
            collection = this.groupFeaturesByIds(collection)
            
            var start = false
            for(var i in collection.grouped){
                if(!start){
                    start = true
                } else {
                    var line = document.createElement('hr')
                    subnodes.append(line)
                }
                var tempFeatures = collection.grouped[i]
                this.renderItemVersions(tempFeatures,subnodes,layerId,i,t)
            }
            for(var i in collection.ungrouped){
                var feature = collection.ungrouped[i]
                this.renderItemVersions([feature],subnodes,layerId,i,t)
            }
        }
    }
    
    renderItemVersions(features,subnodes,layerId,i,t){
        var firstFeature = features[0]
        var newNode = document.createElement("div")
        var fname = firstFeature['id'] != null ? firstFeature['id'] : firstFeature['properties']['name'] == null ? "<i>child-"+i+"</i>" : firstFeature['properties']['name']

        newNode.innerHTML = `<div>${firstFeature["type"]} : ${fname}</div>`

        subnodes.append(newNode)

        for(var j in features){
            var feature = features[j]
            var id = i+'-'+j
            
            var newNode = document.createElement("div")
            var fname = feature['id'] != null ? feature['id'] : feature['properties']['name'] == null ? "<i>child-"+id+"</i>" : feature['properties']['name']
            var ftime = ""
            if(feature.type == "TempFeature"){
                var t_from = feature.from == null ? "-∞" : feature.from
                var t_to = feature.to == null ? "∞" : feature.to
                ftime = `<div class="time-span">(${feature.from} - ${feature.to})</div>`
            }
            var version_name = feature.type == "TempFeature" ? '[version-'+j+'] : ' + feature.operation : '[select]'
            newNode.innerHTML = `<div><span id="edit-feature-${layerId}-${id}" class="edit-version-text">${version_name}</span>${ftime}</div>`
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
                description.innerHTML += `Properties:<a href="#"><img src="static/img/feature-properties.png" id="edit-properties-${layerId}-${id}" /></a>`
                for(var prop in feature["properties"]){
                    description.innerHTML += `<div>${prop} : ${feature["properties"][prop]}</div>`
                }
            }
            this.showLayerFeatures(feature, newNode)
            subnodes.append(newNode)
            let ff = feature
            document.getElementById("edit-feature-"+layerId+"-"+id).onclick = (e)=>{
                console.log(ff)
                t.editing.selectedFeature = ff
                t.lastPointDrawing = null
                t.addingDrawing = false
                if(ff.from != null)
                    t.setGlobalDate(ff.from)
                else if(ff.to != null)
                    t.setGlobalDate(ff.to)
                t.updateLayer(t.editing,t.editing.originaldata,true)
                t.updateLayerView(t.layers)
                
                t.render(t.editing)
                t.canvas.draw()
            }
            if(feature == this.editing.selectedFeature){
                document.getElementById("edit-properties-"+layerId+"-"+id).onclick = (e)=>{
                    t.propertiesDialogWindow.action(e,true,this.editing.selectedFeature,this.editing.scheme)
                }
                this.element.scrollTop = newNode.offsetTop + this.element.getBoundingClientRect().height/2
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
    validateAndTransformToGeoJson(data, type, dontparse, unoriginaldata){
        var newdata, copied, drawable = false, scheme = null
        switch(type){
            case "tempgeojson":
            case "geojson":
                    if(!dontparse){
                        newdata = JSON.parse(data)
                        scheme = this.tryGetScheme(newdata)
                        copied = this.copyGeoJSON(newdata)
                    } else {
                        newdata = unoriginaldata
                    }
                    this.addBboxes(newdata)
                    console.log(newdata)
                    if(type == "tempgeojson")
                        this.addTimeboxes(newdata)
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
            case "TempFeature":
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
        if((bbox1 == null || isNaN(bbox1.left)) && (bbox2 == null || isNaN(bbox2.left)))
            return null
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
            points: bbox1.points ? (bbox2.points ? bbox1.points+bbox2.points : bbox1.points) : (bbox2.points ? bbox2.points : 0),
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
    addTimeboxes(data){
        switch(data.type){
            case "FeatureCollection":
            case "Interval":
                switch(data.type){
                    case "FeatureCollection":
                        var collected = []
                        for(var i in data.features){
                            collected = collected.concat(this.addTimeboxes(data.features[i]))
                        }
                    break
                    case "Interval":
                        var collected = []
                        for(var i in data.children){
                            collected = collected.concat(this.addTimeboxes(data.children[i]))
                        }
                    break
                }
                console.log(collected)
                if(data.type == "FeatureCollection"){
                    var dividedByIds = {}
                    for(var i in collected){
                        var feature = collected[i]
                        
                        if(!(feature.id in dividedByIds)){
                            dividedByIds[feature.id] = []
                        }
                        dividedByIds[feature.id].push(feature)
                    }
                    for(var id in dividedByIds){
                        var features = dividedByIds[id]
                        
                        features = features.sort((a,b)=>(a.from-b.from))
                        var newDates = []
                        for(var i in features){
                            var feature = features[i]
                            switch(feature.operation){
                                case "NEW":
                                case "NEW_ALL_FEATURES":
                                    if(feature.from != "")
                                        newDates.push(feature.from)

                                case "UNION":
                                case "UNION_ALL_FEATURES":
                                case "DIFF":
                                case "INTERSECT":
                                case "PROPERTY_CHANGE":
                                    feature.timebox_from = feature.from
                                    feature.timebox_to = feature.to
                                    break
                            }
                        }
                        newDates = Array.from(new Set(newDates)).sort((a,b)=>this.compareDates(a.from,b.from))
                        
                        newDates = [""].concat(newDates)
                        for(var i in features){
                            var feature = features[i]
                            switch(feature.operation){
                                case "NEW":
                                case "NEW_ALL_FEATURES":
                                case "UNION":
                                case "UNION_ALL_FEATURES":
                                case "DIFF":
                                case "INTERSECT":
                                case "PROPERTY_CHANGE":
                                    var ndi = 0
                                    for(var j = newDates.length-1;j>=0;j--){
                                        if(this.compareDates(newDates[j],feature.from) <= 0){
                                            ndi = j
                                            break
                                        }
                                    }
                                    var fromBox = newDates[ndi]
                                    var toBox = ndi < newDates.length-1 ? newDates[ndi+1] : ""
                                    if(toBox != ""){
                                        var ncd = (new CzDate(toBox))
                                        ncd.addDay(-1)
                                        toBox = ncd.code()
                                    }

                                    if(this.compareDates(feature.timebox_from,fromBox) == -1 && fromBox != "")
                                        feature.timebox_from = fromBox
                                    if(this.compareDates(toBox,feature.timebox_to) == -1 && toBox != "")
                                        feature.timebox_to = toBox
                                        
                                    break
                            }
                        }
                        
                        var lastFeatures = []
                        for(var i in features){
                            var feature = features[i]
                            
                            feature.selectable_from = feature.timebox_from
                            feature.selectable_to = feature.timebox_to
                            
                            if(lastFeatures.length > 0 && this.compareDates(lastFeatures[0].timebox_from,feature.timebox_from) != 0){
                                for(var j in lastFeatures){
                                    lastFeatures[j].selectable_to = feature.selectable_from
                                }
                                lastFeatures.length = 0
                                lastFeatures.push(feature)
                            } else {
                                lastFeatures.push(feature)
                            }
                        }
                        /*
                        if(features.length > 0){
                            var firstProperties = features[0].properties
                            for(var i = 1;i<features.length;i++){
                                var props = features[i].properties
                                for(var j in props){
                                    firstProperties[j] = props[j]
                                }
                            }
                            for(var i = 1;i<features.length;i++){
                                features[i].properties = firstProperties
                            }
                        }*/
                    }
                }
                return collected
                break
            case "TempFeature":
                return [data]
                break
        }
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
            case "TempFeature":
            case "Feature":
                if(data.type == 'TempFeature' && !('geometry' in data)){
                    bbox = this.boxFromPoints(0,0)
                } else {
                    bbox = this.addBboxes(data.geometry)
                }
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
                bbox = this.addBboxes(data.coordinates)
                break
            case "Point":
                bbox = {left: data.coordinates[0], top: data.coordinates[1], right: data.coordinates[0], bottom: data.coordinates[1]}
                break
        }
        if(bbox == null)
            return null
        data.bbox = [bbox.left, bbox.top, bbox.right, bbox.bottom]
        data.pointNumber = bbox.points  //not cannonical
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
    
    getSnapPointCoordinates(coordinates,lon,lat,pixelDifference){
        if(coordinates.length == 0)
            return null
        var coords = null
        if(typeof coordinates[0] == 'number'){
            newCoords = coordinates
            coords = this.betterSnapPoint(lon,lat,coords,newCoords,pixelDifference)
        } else {
            for(var i in coordinates){
                var newCoords = this.getSnapPointCoordinates(coordinates[i],lon,lat,pixelDifference)
                coords = this.betterSnapPoint(lon,lat,coords,newCoords,pixelDifference)
            }
        }
        return coords
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
            case "TempFeature":
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
            case "Point":
                var result = this.checkPointsOfCoords(feature.coordinates,lon,lat,pixelDifference,magnification)

                if(result)
                    return result
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

    getSnapPointAllLayers(lon,lat,degreeBounds,pixelDifference,magnification){
        
        console.log('a',pixelDifference,magnification)
        var layerset = []
        for(var i in this.layers.children){
            layerset.push({key:i,value:this.layers.children[i]})
        }
        layerset = layerset.reverse()
        
        var coords = null
        for(var i in layerset){
            
            var key = layerset[i].key
            var layer = layerset[i].value
            
            var newCoords = this.getSnapPoint(layer.data,lon,lat,degreeBounds,pixelDifference,magnification)
            
            coords = this.betterSnapPoint(lon,lat,coords,newCoords,pixelDifference)
        }
        return coords
    }
    betterSnapPoint(lon,lat,coords,newCoords,pixelDifference){
        const PIXEL_DIFFERENCE_FACTOR = 1
        if(newCoords != null && Math.max(Math.abs(lon-newCoords[0]),Math.abs(lat-newCoords[1])) < pixelDifference/PIXEL_DIFFERENCE_FACTOR && (coords == null || Math.abs(newCoords[0]-lon)+Math.abs(newCoords[1]-lat) < Math.abs(coords[0]-lon)+Math.abs(coords[1]-lat))){
            console.log('b',[lon,lat],newCoords,pixelDifference/PIXEL_DIFFERENCE_FACTOR)
            return newCoords
        }
        return coords
    }
    getSnapPoint(layer,lon,lat,degreeBounds,pixelDifference,magnification){
        
        if(!(layer instanceof Object))
            return null

        if("bbox" in layer && (
            layer.bbox[0] > lon + pixelDifference || 
            layer.bbox[1] > lat + pixelDifference || 
            layer.bbox[2] < lon - pixelDifference || 
            layer.bbox[3] < lat - pixelDifference)
        )
            return null
        
        if('timebox_to' in layer && !this.checkIfFeatureInTime(layer))
            return null
            
        var coords = null
        switch(layer.type){
            case "FeatureCollection":
                for(var i = layer.features.length-1;i>=0;i--){
                    var newCoords = this.getSnapPoint(layer.features[i],lon,lat,degreeBounds,pixelDifference,magnification)
                    
                    coords = this.betterSnapPoint(lon,lat,coords,newCoords,pixelDifference)
                }
                break
            case "TempFeature":
                if(!this.checkIfFeatureSelectableInTime(layer))
                    coords = null
            case "Feature":
                    var newCoords = this.getSnapPoint(layer.geometry,lon,lat,degreeBounds,pixelDifference,magnification)
                    coords = this.betterSnapPoint(lon,lat,coords,newCoords,pixelDifference)
                    
                break
            case "Interval":
                if(layer.children != undefined)
                for(var i = layer.children.length-1;i>=0;i--){
                    var newCoords = this.getSnapPoint(layer.children[i],lon,lat,degreeBounds,pixelDifference,magnification)
                    coords = this.betterSnapPoint(lon,lat,coords,newCoords,pixelDifference)
                }
                break
            case "MultiPolygon":
                for(var i = layer.coordinates.length-1;i>=0;i--){
                    if(i == "resolution")
                        continue
                        
                    var newCoords = this.getSnapPointCoordinates(layer.coordinates[i],lon,lat,pixelDifference)
                    coords = this.betterSnapPoint(lon,lat,coords,newCoords,pixelDifference)
                }
                break
            case "Polygon":
                var newCoords = this.getSnapPointCoordinates(layer.coordinates,lon,lat,pixelDifference)
                coords = this.betterSnapPoint(lon,lat,coords,newCoords,pixelDifference)
                break
            case "LineString":
                var newCoords = this.getSnapPointCoordinates(layer.coordinates,lon,lat,pixelDifference)
                coords = this.betterSnapPoint(lon,lat,coords,newCoords,pixelDifference)
                break
            case "MultiLineString":
                for(var i in layer.coordinates){
                        
                    if(i == "resolution")
                        continue
                        
                    var geometry = layer.coordinates[i]
                    var newCoords = this.getSnapPointCoordinates(geometry,lon,lat,pixelDifference)
                    coords = this.betterSnapPoint(lon,lat,coords,newCoords,pixelDifference)
                    
                }
                break
            case "Point":
                if(Math.max(Math.abs(lon-layer.coordinates[0]),Math.abs(lat-layer.coordinates[1])) < pixelDifference/5){
                    coords = layer.coordinates
                }
                break
        }
        return coords
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
            layer.bbox[0] > lon + pixelDifference || 
            layer.bbox[1] > lat + pixelDifference || 
            layer.bbox[2] < lon - pixelDifference || 
            layer.bbox[3] < lat - pixelDifference)
        )
            return null
        
        if('timebox_to' in layer && !this.checkIfFeatureInTime(layer))
            return null
            
        switch(layer.type){
            case "FeatureCollection":
                for(var i = layer.features.length-1;i>=0;i--){
                    var result = this.hitTest(layer.features[i],lon,lat,degreeBounds,pixelDifference,magnification,availableShapes)
                    if(result != null)
                        return result
                }
                break
            case "TempFeature":
                if(!this.checkIfFeatureSelectableInTime(layer))
                    return null
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
            if(this.snapToLines){
                var snappedCoords = this.getSnapPointAllLayers(lon,lat,degreeBounds,pixelDifference,magnification)
                console.log(lon,lat,snappedCoords)
                
                if(snappedCoords != null){
                    lon = snappedCoords[0]
                    lat = snappedCoords[1]
                }
            }
            
            
            if(this.addingDrawing){
                this.editing.selectedPoint = null
                switch(this.addingDrawingType){
                    case "Polygon":
                    case "LineString":
                        var newPoint = [lon,lat]
                        
                        if(this.lastPointDrawing != null && this.checkPointsOfCoords(this.lastPointDrawing,lon,lat,pixelDifference,magnification)){
                            var feature = this.editing.selectedFeature
                            var adding = this.actionResultingInOperation(this.addingAction)
                            this.stopAddingShape()
                            if(!adding && !this.detectUpdate())
                                this.propertiesDialogWindow.action(null,true,feature,this.editing.scheme)
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
                        
                        var feature = this.editing.selectedFeature
                        
                        this.stopAddingShape()
                        if(!adding && !this.detectUpdate())
                            this.propertiesDialogWindow.action(null,true,feature,this.editing.scheme)

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
                if(selectedFeature != null && ['Polygon','MultiPolygon'].indexOf(selectedFeature.geometry.type) > -1)
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
                    if(selectedFeature != null)
                        console.log(selectedFeature.geometry.type)
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









