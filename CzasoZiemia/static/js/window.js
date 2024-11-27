

class DialogWindow {
    constructor(configs){
        this.element = null;
        this.canvas = null;
        this.display = false;
        this.setConfig(configs)
        this.getWindowCloser()
        this.previousType = null
    }
    setConfig(configs){
        for(var option in configs){
            switch(option){
                case "button":
                    let button = document.getElementById(configs[option])
                    let th = this
                    button.onclick = (e)=>{th.action(e)}
                    break;
                case "element":
                    this.element = document.getElementById(configs[option])
                    break;
                case "canvas":
                    this.canvas = configs[option]
                    break;
            }
        }
    }
    action(e, display){
        if(display !== undefined)
            this.display = display
        else
            this.display = !this.display;
        this.element.style.display = this.display ? "block" : "none"
    }
    getWindowCloser(){
        var children = Array.from(this.element.children),closer
        if(children)
            closer = children.filter(x=>x.classList.contains("window-closer"))
        if(closer.length > 0){
            let th = this
            closer[0].onclick = (e)=>{th.action(e)}
        }
    }
}

class LayerDialogWindow extends DialogWindow {
    constructor(configs){
        super(configs)
        
        this.data = null
        this.fileName = null
        this.layerPanel = null
        
        this.typeSelect = null
        
    }    
    setData(data, filename, checkTempgeojson){
        
        this.fileName = filename
        this.data = data
        
        var type = this.determineType(data, filename, checkTempgeojson)
        
        if(checkTempgeojson)
            this.changeType(type, true)
    }
    determineType(data, filename, checkTempgeojson){
        var datatypes = {
            '.tempgeojson': 'tempgeojson',
            '.geojson': 'geojson',
            '.json': 'geojson',
            ".png": 'image',
            ".jpg": 'image',
            ".jpeg": 'image',
            ".gif": 'image',
            ".tiff": 'image',
            ".bmp": 'image',
            '.schema': 'schema'
        }
        var extension = filename.match('[.][A-z0-9]+$')
        extension = extension == undefined || extension.length == 0 ? '' : extension[0]
        
        var predicted = extension in datatypes ? datatypes[extension] : null
        var types = ['tempgeojson','geojson','schema','json','none'].sort((x,y)=>y===predicted)
        
        for(var i in types){
            var type = types[i]
            
            if(this.validateType(data, type, checkTempgeojson)){
                return type
            }
        }
        return 'text'
    }
    validateType(data, type, checkTempgeojson){
        if(data === null)
            return type === "null"
            
        switch(type){
            case 'tempgeojson':
                if(checkTempgeojson && this.typeSelect.value != 'tempgeojson')
                    return false
            case 'geojson':
                if(this.predictGeoJson(data))
                    return true
                break
            case 'schema':
                if(this.predictSchema(data))
                    return true
                break
            case 'json':
                if(this.predictJson(data))
                    return true
                break
        }
        return false
    }
    predictGeoJson(data){
        if(this.predictJson(data)){
            try {
                wk_stringify(JSON.parse(data))
            } catch(e) {
                return false
            } 
            return true
        }
        return false 
    }
    predictSchema(data){
        try {
            var json = JSON.parse(data)
            if(json['type'] == 'schema')
                return true
        } catch(e) {
            return false
        } 
        return false
    }
    predictJson(data){
        try {
            JSON.parse(data)
        } catch(e) {
            return false
        } 
        return true
    }
    changeType(type, update){
        if(!update && !this.validateType(this.data, type)){
            alert("Type doesn't match with the file.")
            this.typeSelect.value = this.previousType
        } else {
            this.typeSelect.value = type
            this.previousType = type
        }
    }
    
}
//importLayerToSchema(e,name,newNode,layer)
class ImportDialogWindow extends LayerDialogWindow {
    constructor(configs){
        super(configs)
        
        this.fileSelect = null
        this.topLayer = null
        this.setOwnConfig(configs)
    }
    setOwnConfig(configs){
        for(var option in configs){
            let th = this
            switch(option){
                case "file":
                    var fileSelect = document.getElementById(configs[option])
                    fileSelect.addEventListener("change", (e)=>{th.loadFile(e)})
                    break
                case "datatype":
                    this.typeSelect = document.getElementById(configs[option])
                    this.typeSelect.addEventListener("change", (e)=>{th.changeType(e.target.value, false)})
                    break
                case "addlayer":
                    var addLayer = document.getElementById(configs[option])
                    addLayer.addEventListener("click", (e)=>{th.addLayer(e)})
                    break
                case "dialogpanel":
                    this.dialogpanel = configs[option]
                    break
                case "layerpanel":
                    this.layerpanel = configs[option]
                    break
            }
        }
    }
    loadFile(e){
        var file = e.target.files[0]
        const reader = new FileReader();
        
        var th = this
        reader.addEventListener('load', (event) => {
            document.getElementById("layer-import-tab2").style.display = "block"
            th.setData(event.target.result, file.name, true)
            th.addFileLoaded(th.type)
        });
        reader.readAsText(file);
    }
    action(e, display, topLayer){
        super.action(e, display)
        if(this.display){
            if(topLayer != undefined){
                this.topLayer = topLayer
            }
        } else {
            this.topLayer = null
        }
    }
    
    addFileLoaded(){
        document.getElementById("layer-import-file-loaded").style.display = "block"
    }
    removeFileLoaded(){
        this.data = null
        this.fileName = null
        document.getElementById("layer-import-file-loaded").style.display = "none"
    }
    
    addLayer(e){
        var path = this.topLayer != undefined ? this.topLayer.path.concat([this.topLayer.name]) : []

        if(this.data !== null){
            var bounds = this.canvas.getDegreeBounds()
            var pixelSize = this.canvas.camera.getPixelSize()
            this.layerpanel.addLayer(path, this.fileName, this.typeSelect.value, this.data, bounds, pixelSize)
            this.action(null, false)
            this.canvas.draw()
            this.removeFileLoaded()
        }
    }
}

class RelationDialogWindow extends LayerDialogWindow {
    constructor(configs){
        super(configs)
        
        this.fileSelect = null
        this.topLayer = null
        this.relationSelect = null
        this.relationChildFieldSelect = null
        this.relationType = null
        this.relationFieldSelected = null
        this.setOwnConfig(configs)
    }
    setOwnConfig(configs){
        for(var option in configs){
            let th = this
            switch(option){
                case "relationSelect":
                    this.relationSelect = document.getElementById(configs[option])
                    this.selectRelationSelectIndex()
                    this.relationSelect.addEventListener("change", (e)=>{th.changeRelationType(e.target.value)})
                    break
                case "relationChildFieldSelect":
                    this.relationChildFieldSelect = document.getElementById(configs[option])
                    this.relationChildFieldSelect.addEventListener("change", (e)=>{th.changeField(e.target.value)})
                    break
            }
        }
    }
    selectRelationSelectIndex(){
        if(this.topLayer == null || this.topLayer.relation == null){
            this.relationSelect.selectedIndex = 0
        } else {
            for(var i in this.relationSelect.options){
                if(this.relationSelect.options[i].value == this.topLayer.relation.relationType){
                    this.relationSelect.selectedIndex = i
                    break
                }
            }
        }
    }
    loadFile(e){
        var file = e.target.files[0]
        const reader = new FileReader();
        
        var th = this
        reader.addEventListener('load', (event) => {
            document.getElementById("layer-import-tab2").style.display = "block"
            th.setData(event.target.result, file.name, true)
            th.addFileLoaded(th.type)
        });
        reader.readAsText(file);
    }
    action(e, display, topLayer){
        super.action(e, display)
        if(this.display){
            if(topLayer != undefined){
                this.topLayer = topLayer
                console.log(topLayer)
                this.setSelectColumns(topLayer)
            }
        } else {
            var newRelation = null
            switch(this.relationType){
                case 'intersectsumwithparent': newRelation = {relationType:this.relationType, field:null} ; break
                case 'differencesumwithparent': newRelation = {relationType:this.relationType, field:null} ; break
                case 'joinkeyparent': newRelation = {relationType:this.relationType, field:this.relationFieldSelected} ; break
            }
            console.log('rtype',this.relationType)
            this.topLayer.relation = newRelation
            this.topLayer = null
            
        }
    }
    changeRelationType(value){
        this.relationType = value
    }
    changeField(value){
        this.relationFieldSelected = value
    }
    setSelectColumns(topLayer){
        this.relationChildFieldSelect.innerHTML = '<option value="" name="none">-- NONE --</option>'
        for(var i in topLayer.scheme){
            var prop = topLayer.scheme[i]
            var select = document.createElement('option')
            select.setAttribute('value',prop)
            select.setAttribute('name',prop)
            select.innerHTML = prop
            this.relationChildFieldSelect.appendChild(select)
        }
    }
}
class AddLayerDialogWindow extends LayerDialogWindow {
    constructor(configs){
        super(configs)
        this.typeHint = null
        this.layernameinput
        this.topLayer = null
        this.setOwnConfig(configs)
    }
    setOwnConfig(configs){
        let th = this
        for(var option in configs){
            switch(option){
                case "layertype":
                    this.typeSelect = document.getElementById(configs[option])
                    this.typeSelect.addEventListener("change", (e)=>{/*th.changeType(e.target.value, false)*/})
                    break;
                case "layer-add-hint":
                    this.typeHint = document.getElementById(configs[option])
                    break;
                case "addlayer":
                    var addLayer = document.getElementById(configs[option])
                    addLayer.addEventListener("click", (e)=>{th.addLayer(e)})
                    break
                case "layerpanel":
                    this.layerpanel = configs[option]
                    break
                case "layernameinput":
                    this.layernameinput = document.getElementById(configs[option])
                    break
            }
        }
    }
    changeType(type, update){
        this.typeSelect.value = type
    }
    layername(){
        return this.layernameinput.value.trim()
    }
    action(e, display, topLayer){
        super.action(e, display)
        if(this.display){
            if(topLayer != undefined){
                this.topLayer = topLayer
            }
        } else {
            this.topLayer = null
        }
    }
    prepareDataAccordingToType(name){
        switch(this.typeSelect.value){
            case "tempgeojson":
            case "geojson":
                var data = `{"type": "FeatureCollection","name": "`+this.layername()+`","features": []}`
                this.setData(data, name, true)
                break
            case "text":
                var data = ""
                this.setData(data, name, true)
                break
        }
    }
    addLayer(e){
        if(this.layername() == ""){
            alert("Layer name must not be empty.")
            return
        }

        var layerName = this.layername()
        
        var path = this.topLayer != undefined ? this.topLayer.path.concat([this.topLayer.name]) : []
        
        var i = 1
        while(this.layerpanel.layerNameExist(layerName,path)){
            layerName = this.layername() + " (" + i + ")"
            i++
        }
        this.prepareDataAccordingToType(layerName,path)        
        
        var path = this.topLayer != undefined ? this.topLayer.path.concat([this.topLayer.name]) : []

        if(this.data !== null){
            var bounds = this.canvas.getDegreeBounds()
            var pixelSize = this.canvas.camera.getPixelSize()
            this.layerpanel.addLayer(path, layerName, this.typeSelect.value, this.data, bounds, pixelSize)
            this.action(null, false)
            this.canvas.draw()
        }
    }
}
class AddSchemaDialogWindow extends LayerDialogWindow {
    constructor(configs){
        super(configs)
        this.typeHint = null
        this.layernameinput
        this.setOwnConfig(configs)
    }
    setOwnConfig(configs){
        let th = this
        for(var option in configs){
            switch(option){
                case "addlayer":
                    var addLayer = document.getElementById(configs[option])
                    addLayer.addEventListener("click", (e)=>{th.addLayer(e)})
                    break
                case "layerpanel":
                    this.layerpanel = configs[option]
                    break
                case "layernameinput":
                    this.layernameinput = document.getElementById(configs[option])
                    break
            }
        }
    }
    layername(){
        return this.layernameinput.value.trim()
    }
    prepareDataAccordingToType(name){
        var data = JSON.stringify({
            name: this.layername(),
            type: "Schema",
            children: []
        })
        this.setData(data, name)
    }
    addLayer(e){
        if(this.layername() == ""){
            alert("Layer name must not be empty.")
            return
        }
        var layerName = this.layername()
        var i = 1
        while(this.layerpanel.layerNameExist(layerName)){
            layerName = this.layername() + " (" + i + ")"
            i++
        }
        this.prepareDataAccordingToType(layerName)
        if(this.data !== null){
            var bounds = this.canvas.getDegreeBounds()
            var pixelSize = this.canvas.camera.getPixelSize()
            this.layerpanel.addSchema([], layerName, this.data, bounds, pixelSize)
            this.action(null, false)
            this.canvas.draw()
        }
    }
    action(e, display, layer){
        super.action(e, display)
        if(layer != null){
            
        }
    }
}

/*
 
    let newLayerWindow = new AddRasterMapDialogWindow({
        button: "button-add-raster-map",
        element: "raster-map-add",
        canvas: canvas,
        layerprojection: "raster-map-projection",
        addlayer: "dialog-window-raster-map-add",
        layerpanel: layerpanel,
        layernameinput: "raster-map-add-layer-name",
    })
 */
class AddRasterMapDialogWindow extends LayerDialogWindow {
    constructor(configs){
        super(configs)
        this.typeHint = null
        this.fileSelect = null
        this.previewCanvas = null
        this.previewCanvasCtx = null
        this.previewCanvasBounds = null
        this.image = null
        this.imageBounds = null
        this.table = null
        this.errorMessageSpan = null
        
        this.layer = null
        
        this.projections = {
            '': {
                pointsNeeded:0
            },
            'null': {
                pointsNeeded:0
            },
            'equirectangular': {
                pointsNeeded:2,
                func:(lon,lat,projectionCoordData,pointX,precalc)=>{
                    
                    if(pointX){
                        return (lon - projectionCoordData.point1_lon) / (projectionCoordData.point2_lon - projectionCoordData.point1_lon) * (projectionCoordData.point2_x - projectionCoordData.point1_x) + projectionCoordData.point1_x
                    } else {
                        return (lat - projectionCoordData.point1_lat) / (projectionCoordData.point2_lat - projectionCoordData.point1_lat) * (projectionCoordData.point2_y - projectionCoordData.point1_y) + projectionCoordData.point1_y
                    }
                },
                precalcfunc:(pcd)=>{
                    return new Object()
                },
            },
            'azimuthal': {
                pointsNeeded:3,
                precalcfunc:(pcd)=>{
                    
                    var cos = x => Math.cos(x*Math.PI/180)
                    var sin = x => Math.sin(x*Math.PI/180)
                    var lambda_0 = Math.atan(( cos(pcd.point1_lat)*sin(pcd.point1_lon)*(pcd.point2_x - pcd.point3_x) +
                                     cos(pcd.point2_lat)*sin(pcd.point2_lon)*(pcd.point3_x - pcd.point1_x) +
                                     cos(pcd.point3_lat)*sin(pcd.point3_lon)*(pcd.point1_x - pcd.point2_x) )
                                    /
                                    ( cos(pcd.point1_lat)*cos(pcd.point1_lon)*(pcd.point2_x - pcd.point3_x) +
                                      cos(pcd.point2_lat)*cos(pcd.point2_lon)*(pcd.point3_x - pcd.point1_x) +
                                      cos(pcd.point3_lat)*cos(pcd.point3_lon)*(pcd.point1_x - pcd.point2_x) )) / Math.PI*180
                                 
                        var A1 = cos(pcd.point1_lat)*sin(pcd.point1_lon-lambda_0), A2 = cos(pcd.point2_lat)*sin(pcd.point2_lon-lambda_0),A3
                        var a_x,k_x
                            if(A1 - A2 != 0){
                                a_x = ( A1 * pcd.point2_x - A2 * pcd.point1_x ) / ( A1 - A2 ) 
                            } else if(A1 - A3 != 0){
                                A3 = cos(pcd.point3_lat)*sin(pcd.point3_lon-lambda_0)
                                a_x = ( A1 * pcd.point3_x - A3 * pcd.point1_x ) / ( A1 - A3 ) 
                            } else {
                                A3 = cos(pcd.point3_lat)*sin(pcd.point3_lon-lambda_0)
                                a_x = ( A2 * pcd.point1_x - A3 * pcd.point3_x ) / ( A3 - A2 ) 
                            }
                        var k_x
                            if(pcd.point1_lon-lambda_0 != 0){
                                k_x = ( pcd.point1_x - a_x ) / cos(pcd.point1_lat)/sin(pcd.point1_lon-lambda_0)
                            } else if(pcd.point2_lon-lambda_0 != 0){
                                k_x = ( pcd.point2_x - a_x ) / cos(pcd.point2_lat)/sin(pcd.point2_lon-lambda_0)
                            } else {
                                k_x = ( pcd.point3_x - a_x ) / cos(pcd.point3_lat)/sin(pcd.point3_lon-lambda_0)
                            }
                            
                        var phi_0 = Math.atan(( sin(pcd.point1_lat)*(pcd.point3_y - pcd.point2_y) +
                                     sin(pcd.point2_lat)*(pcd.point1_y - pcd.point3_y) +
                                     sin(pcd.point3_lat)*(pcd.point2_y - pcd.point1_y) )
                                    /
                                    ( cos(pcd.point1_lat)*cos(pcd.point1_lon - lambda_0)*(pcd.point3_y - pcd.point2_y) +
                                      cos(pcd.point2_lat)*cos(pcd.point2_lon - lambda_0)*(pcd.point1_y - pcd.point3_y) +
                                      cos(pcd.point3_lat)*cos(pcd.point3_lon - lambda_0)*(pcd.point2_y - pcd.point1_y) )) / Math.PI*180
                                    
                        var B1 = cos(phi_0) * sin(pcd.point1_lat) - sin(phi_0) * cos(pcd.point1_lat) * cos(pcd.point1_lon - lambda_0),
                            B2 = cos(phi_0) * sin(pcd.point2_lat) - sin(phi_0) * cos(pcd.point2_lat) * cos(pcd.point2_lon - lambda_0),
                            B3
                            
                        var a_y
                        if(B1 - B2 != 0){
                            a_y = (B1 * pcd.point2_y - B2 * pcd.point1_y) / (B1 - B2)
                        } else if(B1 - B3 != 0){
                            B3 = cos(phi_0) * sin(pcd.point3_lat) - sin(phi_0) * cos(pcd.point3_lat) * cos(pcd.point3_lon - lambda_0)
                            a_y = (B1 * pcd.point3_y - B3 * pcd.point1_y) / (B1 - B3)
                        } else {
                            B3 = cos(phi_0) * sin(pcd.point3_lat) - sin(phi_0) * cos(pcd.point3_lat) * cos(pcd.point3_lon - lambda_0)
                            a_y = (B2 * pcd.point3_y - B3 * pcd.point2_y) / (B2 - B3)
                        }
                        var k_y
                        if(B1 != 0){
                            k_y = (pcd.point1_y - a_y) / B1
                        } else if(B2 != 0){
                            k_y = (pcd.point2_y - a_y) / B2
                        } else {
                            k_y = (pcd.point3_y - a_y) / B3
                        }
                        
                    return {a_x: a_x, k_x: k_x, a_y: a_y, k_y: k_y, phi_0: phi_0, lambda_0: lambda_0}
                },
                func:(lon,lat,pcd,pointX,precalc)=>{
                    var cos = x => Math.cos(x*Math.PI/180)
                    var sin = x => Math.sin(x*Math.PI/180)
                    /*
                    var lambda_0 = Math.atan(( cos(pcd.point1_lat)*sin(pcd.point1_lon)*(pcd.point2_x - pcd.point3_x) +
                                     cos(pcd.point2_lat)*sin(pcd.point2_lon)*(pcd.point3_x - pcd.point1_x) +
                                     cos(pcd.point3_lat)*sin(pcd.point3_lon)*(pcd.point1_x - pcd.point2_x) )
                                    /
                                    ( cos(pcd.point1_lat)*cos(pcd.point1_lon)*(pcd.point2_x - pcd.point3_x) +
                                      cos(pcd.point2_lat)*cos(pcd.point2_lon)*(pcd.point3_x - pcd.point1_x) +
                                      cos(pcd.point3_lat)*cos(pcd.point3_lon)*(pcd.point1_x - pcd.point2_x) )) / Math.PI*180
                                    */
                    if(pointX){/*
                        var A1 = cos(pcd.point1_lat)*sin(pcd.point1_lon-lambda_0), A2 = cos(pcd.point2_lat)*sin(pcd.point2_lon-lambda_0),A3
                        var a_x,k_x
                            if(A1 - A2 != 0){
                                a_x = ( A1 * pcd.point2_x - A2 * pcd.point1_x ) / ( A1 - A2 ) 
                            } else if(A1 - A3 != 0){
                                A3 = cos(pcd.point3_lat)*sin(pcd.point3_lon-lambda_0)
                                a_x = ( A1 * pcd.point3_x - A3 * pcd.point1_x ) / ( A1 - A3 ) 
                            } else {
                                A3 = cos(pcd.point3_lat)*sin(pcd.point3_lon-lambda_0)
                                a_x = ( A2 * pcd.point1_x - A3 * pcd.point3_x ) / ( A3 - A2 ) 
                            }
                        var k_x
                            if(pcd.point1_lon-lambda_0 != 0){
                                k_x = ( pcd.point1_x - a_x ) / cos(pcd.point1_lat)/sin(pcd.point1_lon-lambda_0)
                            } else if(pcd.point2_lon-lambda_0 != 0){
                                k_x = ( pcd.point2_x - a_x ) / cos(pcd.point2_lat)/sin(pcd.point2_lon-lambda_0)
                            } else {
                                k_x = ( pcd.point3_x - a_x ) / cos(pcd.point3_lat)/sin(pcd.point3_lon-lambda_0)
                            }
                    */
                        return precalc.a_x + precalc.k_x * cos(lat) * sin(lon - precalc.lambda_0)
                        
                        /*
                        return (lon - projectionCoordData.point1_lon) / (projectionCoordData.point2_lon - projectionCoordData.point1_lon) * (projectionCoordData.point2_x - projectionCoordData.point1_x) + projectionCoordData.point1_x*/
                    } else {
                        /*
                        var phi_0 = Math.atan(( sin(pcd.point1_lat)*(pcd.point3_y - pcd.point2_y) +
                                     sin(pcd.point2_lat)*(pcd.point1_y - pcd.point3_y) +
                                     sin(pcd.point3_lat)*(pcd.point2_y - pcd.point1_y) )
                                    /
                                    ( cos(pcd.point1_lat)*cos(pcd.point1_lon - lambda_0)*(pcd.point3_y - pcd.point2_y) +
                                      cos(pcd.point2_lat)*cos(pcd.point2_lon - lambda_0)*(pcd.point1_y - pcd.point3_y) +
                                      cos(pcd.point3_lat)*cos(pcd.point3_lon - lambda_0)*(pcd.point2_y - pcd.point1_y) )) / Math.PI*180
                                    
                        var B1 = cos(phi_0) * sin(pcd.point1_lat) - sin(phi_0) * cos(pcd.point1_lat) * cos(pcd.point1_lon - lambda_0),
                            B2 = cos(phi_0) * sin(pcd.point2_lat) - sin(phi_0) * cos(pcd.point2_lat) * cos(pcd.point2_lon - lambda_0),
                            B3
                            
                        var a_y
                        if(B1 - B2 != 0){
                            a_y = (B1 * pcd.point2_y - B2 * pcd.point1_y) / (B1 - B2)
                        } else if(B1 - B3 != 0){
                            B3 = cos(phi_0) * sin(pcd.point3_lat) - sin(phi_0) * cos(pcd.point3_lat) * cos(pcd.point3_lon - lambda_0)
                            a_y = (B1 * pcd.point3_y - B3 * pcd.point1_y) / (B1 - B3)
                        } else {
                            B3 = cos(phi_0) * sin(pcd.point3_lat) - sin(phi_0) * cos(pcd.point3_lat) * cos(pcd.point3_lon - lambda_0)
                            a_y = (B2 * pcd.point3_y - B3 * pcd.point2_y) / (B2 - B3)
                        }
                        var k_y
                        if(B1 != 0){
                            k_y = (pcd.point1_y - a_y) / B1
                        } else if(B2 != 0){
                            k_y = (pcd.point2_y - a_y) / B2
                        } else {
                            k_y = (pcd.point3_y - a_y) / B3
                        }
                        */
                        return precalc.a_y + precalc.k_y * ( cos(precalc.phi_0) * sin(lat) - sin(precalc.phi_0) * cos(lat) * cos(lon - precalc.lambda_0) )
                        
                        //
                        /*
                        return (lat - projectionCoordData.point1_lat) / (projectionCoordData.point2_lat - projectionCoordData.point1_lat) * (projectionCoordData.point2_y - projectionCoordData.point1_y) + projectionCoordData.point1_y*/
                    }
                }
            }
        }
        this.adding = null
        
        this.projectionCoordTable = {}
        
        this.setOwnConfig(configs)
    }
    setOwnConfig(configs){
        let th = this
        for(var option in configs){
            switch(option){
                case "layerprojection":
                    this.projectionSelect = document.getElementById(configs[option])
                    this.projectionSelect.addEventListener("change", (e)=>{th.changeProjection(e.target.value, false)})
                    break;
                case "layer-add-hint":
                    this.typeHint = document.getElementById(configs[option])
                    break;
                case "addlayer":
                    var addLayer = document.getElementById(configs[option])
                    addLayer.addEventListener("click", (e)=>{th.addOrEditLayer(e)})
                    this.errorMessageSpan = document.getElementById('dialog-window-errormessage')
                    break
                case "layerpanel":
                    this.layerpanel = configs[option]
                    break
                case "file":
                    var fileSelect = document.getElementById(configs[option])
                    fileSelect.addEventListener("change", (e)=>{th.loadFile(e)})
                    break
                case "preview":
                    this.previewCanvas = document.getElementById(configs[option])
                    this.previewCanvasBounds = [0,0,this.previewCanvas.width,this.previewCanvas.height]
                    this.previewCanvasCtx = this.previewCanvas.getContext('2d')
                    
                    this.previewCanvas.onmousedown = (e)=>{th.canvasMouseDown(e)}
                    this.previewCanvas.onmousemove = (e)=>{th.canvasMouseMove(e)}
                    break
                case "table":
                    this.table = document.getElementById(configs[option])
                    this.changeProjection(this.table.value, false)
                    break
            }
        }
    }
    getProjection(){
        return this.projectionSelect.value
    }
    clickAddingPoint(num){
        this.stopAdding()
        if(this.adding == num){
            this.adding = null
        } else {
            this.adding = num
            this.projectionCoordTable[num].button.style.backgroundColor = '#ff0'
            this.projectionCoordTable[num].pointX = null
            this.projectionCoordTable[num].pointY = null
        }
    }
    stopAdding(){
        var pointsNeeded = this.projections[this.projectionSelect.value].pointsNeeded

        for(var i = 1;i<=pointsNeeded;i++){
            this.projectionCoordTable[i].button.style.backgroundColor = null
        }
    }
    canvasMouseDown(e){
        var bounds = this.previewCanvas.getBoundingClientRect()
        
        var x = e.clientX - bounds.left
        var y = e.clientY - bounds.top
        
        if(this.adding != null){
            this.projectionCoordTable[this.adding].pointX = x
            this.projectionCoordTable[this.adding].pointY = y
            this.stopAdding()
            this.adding = null
            this.showData()
        }
    }
    canvasMouseMove(e){
        
    }
    changeProjection(type, update){
        this.projectionCoordTable = []
        this.projectionSelect.value = type
        
        let t = this
        
        if(type == undefined)
            return
        
        this.table.innerHTML = ''
        var pointsNeeded = this.projections[type].pointsNeeded
        
        var innerHTML = ''
        for(var i = 1;i<=pointsNeeded;i++){
            var newRow = `
                            <tr>
                            <td>
                                c${i}:
                            </td>
                            <td>
                                <input type="text" class="table-input" id="projection-coord-table-lon-${i}" />
                            </td>
                            <td>
                                <input type="text" class="table-input" id="projection-coord-table-lat-${i}" />
                            </td>
                            <td>
                                <input type="button" class="table-input" value="set" id="projection-coord-table-coord-edit-${i}" />
                            </td>
                            </tr>`
            innerHTML += newRow
        }
        this.table.innerHTML = innerHTML
        for(var i = 1;i<=pointsNeeded;i++){
            let j = i
            this.projectionCoordTable[i] = {
                lon:    document.getElementById('projection-coord-table-lon-'+i),
                lat:    document.getElementById('projection-coord-table-lat-'+i),
                button: document.getElementById('projection-coord-table-coord-edit-'+i),
                pointX: null,
                pointY: null
            }
            this.projectionCoordTable[i].button.onclick = e => {t.clickAddingPoint(j)}
        }
    }
    /*
     * 
     * 
        var file = e.target.files[0]
        const reader = new FileReader();
        
        var th = this
        reader.addEventListener('load', (event) => {
            document.getElementById("layer-import-tab2").style.display = "block"
            th.setData(event.target.result, file.name, true)
            th.addFileLoaded(th.type)
        });
        reader.readAsText(file);
     */
    loadFile(e){
        var file = e.target.files[0]
        const reader = new FileReader();
        
        var th = this
        reader.addEventListener('load', (event) => {
            //document.getElementById("layer-import-tab2").style.display = "block"
            th.setData(event.target.result, file.name)
            th.addFileLoaded(th.type)
            th.loadImage(file)
            th.showData()
        });
        reader.readAsText(file);
    }
    loadLayer(layerName, layer){
        this.data = layer.originaldata
        this.addFileLoaded(this.type)
        this.image = this.data.image
        //this.addOrEditLayer(null,layerName, layer)
        this.showData()
    }
    
    addFileLoaded(){
        document.getElementById("raster-map-add-file-loaded").style.display = "block"
    }
    removeFileLoaded(){
        this.data = null
        this.fileName = null
        document.getElementById("raster-map-add-file-loaded").style.display = "none"
    }
    loadImage(file){
        const blobURL = URL.createObjectURL(file);
        const img     = new Image();
        img.src       = blobURL;

        img.onerror = function () {
            URL.revokeObjectURL(this.src);
            // Handle the failure properly
            alert("Cannot load image");
        };
        let th = this
        img.onload = function () {
            th.image = img
            th.showData()
        };
    }
    showData(){
        this.previewCanvasCtx.clearRect(this.previewCanvasBounds[0],this.previewCanvasBounds[1],this.previewCanvasBounds[2],this.previewCanvasBounds[3])
        this.previewCanvasCtx.drawImage(this.image,this.previewCanvasBounds[0],this.previewCanvasBounds[1],this.previewCanvasBounds[2],this.previewCanvasBounds[3])
        
        var pointsNeeded = this.projections[this.projectionSelect.value].pointsNeeded

        for(var i = 1;i<=pointsNeeded;i++){
            if(this.projectionCoordTable[i].pointX != null){
                this.previewCanvasCtx.strokeStyle = '#000'
                this.previewCanvasCtx.fillStyle = '#ff0'
                
                this.previewCanvasCtx.fillRect(this.projectionCoordTable[i].pointX-2.5,this.projectionCoordTable[i].pointY-2.5,5,5)
                this.previewCanvasCtx.strokeRect(this.projectionCoordTable[i].pointX-2.5,this.projectionCoordTable[i].pointY-2.5,5,5)
            }
        }
    }
    
    addOrEditLayer(e, layerName, layer){
        this.errorMessageSpan.innerHTML = ''

        if(this.data !== null){
            var bounds = this.canvas.getDegreeBounds()
            var pixelSize = this.canvas.camera.getPixelSize()
            
            if(this.getProjection() == '' || this.getProjection() == 'null'){
                this.errorMessageSpan.innerHTML = 'First, select the map projection!'
                return
            }
            
            var pointsNeeded = this.projections[this.projectionSelect.value].pointsNeeded

            for(var i = 1;i<=pointsNeeded;i++){
                if(!this.checkNumber(this.projectionCoordTable[i].pointX) || !this.checkNumber(this.projectionCoordTable[i].pointY) || !this.checkNumber(this.projectionCoordTable[i].lat.value) || !this.checkNumber(this.projectionCoordTable[i].lon.value)){
                    this.errorMessageSpan.innerHTML = 'Set coordinates of all points!'

                    return
                }
            }
            var projectionCoordData = {}
            
            for(var i = 1;i<=pointsNeeded;i++){
                projectionCoordData['point'+i+'_lon'] = this.projectionCoordTable[i].lon.value
                projectionCoordData['point'+i+'_lat'] = this.projectionCoordTable[i].lat.value
                
                projectionCoordData['point'+i+'_x'] = this.projectionCoordTable[i].pointX / this.previewCanvas.width * this.image.width
                projectionCoordData['point'+i+'_y'] = this.projectionCoordTable[i].pointY / this.previewCanvas.height * this.image.height
            }
            var data = {
                image:this.image,
                projection:this.getProjection(),
                projectionCoordData:projectionCoordData,
                projectionFunction:this.projections[this.getProjection()].func,
                projectionPrecalcFunction:this.projections[this.getProjection()].precalcfunc,
                width:this.image.width,
                height:this.image.height
            }
            if(this.layer == null){
                this.layerpanel.addRasterMapLayer([], this.fileName, 'raster', data, bounds, pixelSize)
            } else {
                this.layerpanel.updateRasterMapLayer(this.layer, this.fileName, data)
            }
            
            this.action(null, false)
            this.canvas.draw()
            this.removeFileLoaded()
        }
    }
    
    checkNumber(number){
        return Number.isFinite(Number(number)) && number !== '' && number != null
    }
    
    action(e, display, layerName, layer){
        super.action(e, display)
        if(layer != undefined){
            this.loadLayer(layerName, layer)
            this.layer = layer
        } else {
            this.layer = null
        }
    }
}
class YesNoDialogWindow extends DialogWindow {
    constructor(configs){
        super(configs)
        
        this.typeSelect = null
        this.typeHint = null
        
        let th = this
        document.getElementById("yes-no-window-no").onclick = (e)=>{th.action(e)}
        
        this.setOwnConfig(configs)
        this.action(null,true)
    }
    setOwnConfig(configs){
        let th = this
        for(var option in configs){
            switch(option){
                case "action":
                    document.getElementById("yes-no-window-yes").onclick = (e)=>{th.action(e);option['action']}
                    break;
            }
        }
    }
}

class PropertyDialogWindow extends DialogWindow {
    constructor(configs){
        super(configs)
        
        this.data = null
        this.fileName = null
        this.layerPanel = null
        this.table = null
        
        this.feature = null
        this.coordsTable = null
        this.scheme = null
        this.updateButton = null
        
        this.tempTable = null
        this.fromTime = null
        this.toTime = null
        
        this.setOwnConfig(configs)
    }
    operationTypeSelectByFeature(feature){
        if('geometry' in feature){
            return document.getElementById('feature-temp-operation-type')
        } else {
            return document.getElementById('feature-temp-operation-type-nogeometry')
        }
    }
    setOwnConfig(configs){
        for(var option in configs){
            let th = this
            switch(option){
                case "updateButton":
                    this.updateButton = document.getElementById(configs[option])
                    this.updateButton.onclick = (e)=>{
                        this.updateFeature(this.feature,this.scheme)
                    }
                    break
                case "table":   
                    this.table = document.getElementById(configs[option])
                    break
                case "coordsTable":
                    this.coordsTable = document.getElementById(configs[option])
                    break
                case "tempTable":
                    this.tempTable = document.getElementById(configs[option])
                    
                    this.fromTime = new TimeControl("from-time",false,true)
                    this.toTime = new TimeControl("to-time",false,true)
                    break
                case "layerpanel":
                    this.layerPanel = configs[option]
                    break
                case "coordsTableSwapCoords":
                    this.coordsTableSwapCoords = document.getElementById(configs[option])
                    this.coordsTableSwapCoords.onclick = (e) => {
                        this.swapCoords()
                    }
                    break
            }
        }
    }
    swapCoords(){
        var coordsInput = document.getElementById("coords-table-input")
        
        coordsInput.value = coordsInput.value.split(',').slice(1).join(',').trim() + ',' + coordsInput.value.split(',')[0].trim()
    }
    updateFeature(feature,scheme){
        if(feature.geometry && feature.geometry.type == "Point"){
            var coordsInput = document.getElementById("coords-table-input")
            var crs = coordsInput.value.split(",")
            if(crs.length != 2 || isNaN(Number(crs[0])) || isNaN(Number(crs[1]))){
                alert('Wrong format od coordinates')
                coordsInput.value = this.feature.geometry.coordinates[0]+','+this.feature.geometry.coordinates[1]
                return
            } else {
                feature.geometry.coordinates[0] = Number(crs[0])    //N/S (vertical) is usually first
                feature.geometry.coordinates[1] = Number(crs[1])
            }
        }
        if(this.layerPanel.isSpatiotemporal(this.layerPanel.editing)){
            var selectedLayer = this.layerPanel.editing.originaldata
            var newid = document.getElementById('feature-id-input').value
            if(newid == ""){
                alert("All features in tempgeojson must have ids.")
                return
            }
            if(this.lastFeatureId == null){
                for(var i in selectedLayer.features){
                    if(selectedLayer.features[i].id == newid && selectedLayer.features[i] != feature){
                        alert("A feature with id '"+newid+"' already exists.")
                        return
                    }
                }
            } else {
                //TODO: lock ID field
            }
            this.feature.id = newid
            var opt = this.operationTypeSelectByFeature(this.feature)
            this.feature.operation = opt.options[opt.selectedIndex].value
            
            var lastFrom = this.feature.from, lastTo = this.feature.to
            
            this.feature.from = this.fromTime.getDate()
            this.feature.to = this.toTime.getDate()
            
            //if(lastFrom != this.feature.from || lastTo != this.feature.to)
            //    this.layerPanel.updateLayer(this.layerPanel.editing,this.layerPanel.editing.scheme)
        }
        var i = 1
        for(var ix in scheme){
            var key = scheme[ix]
            var value = document.getElementById('property-value-'+i).value
            
            if(document.getElementById('property-column-empty-checkbox-'+i).checked){
                delete feature.properties[key]
            } else if(value != '' || key in feature.properties){
                feature.properties[key] = value
            }
            i++
        }
        
        if(this.layerPanel.isSpatiotemporal(this.layerPanel.editing))
            this.layerPanel.updateLayer(this.layerPanel.editing,this.layerPanel.editing.scheme,true)
        this.action(null, false)
    }
    addColumn(){
        var columnName = document.getElementById('property-column-add').value
        if(/[\n\t]/.test(columnName) || /^\s*$/.test(columnName)){
            alert('Column name is not valid for JSON!')
        } else if(this.scheme.indexOf(columnName) > -1){
            alert('Column already exists!')
        } else {
            this.scheme.push(columnName)
            this.action(null,true,this.feature,this.scheme)
        }
    }
    removeColumn(columnName){
        if(confirm("Do you want to remove this column from dataset?")){
            alert('Column name is not valid for JSON!')
            var ix = this.scheme.indexOf(columnName)
            this.scheme.splice(ix,1)
            this.action(null,true,this.feature,this.scheme)
        }
    }
    action(e,display,feature,scheme,globalDate){
        super.action(e,display)
        if(display){
            this.feature = feature
            this.scheme = scheme
            this.lastFeatureId = feature.id != undefined ? feature.id : null
            if(globalDate != undefined){
                this.fromTime.setDate(globalDate)
                this.toTime.setDate(globalDate)
            }
        } else {
            this.feature = null
            this.scheme = null
            this.lastFeatureId = null
        }
        let t = this
        this.coordsTable.style.display = (feature && feature.geometry && feature.geometry.type == "Point") ? "block" : "none"
        var coordsInput = document.getElementById("coords-table-input")
        
        if(feature){
            if(this.layerPanel.isSpatiotemporal(this.layerPanel.editing)){
                this.tempTable.style.display = "block"
                document.getElementById('feature-id-input').value = this.feature.id
                document.getElementById('feature-temp-operation-type').style.display = 'none'
                document.getElementById('feature-temp-operation-type-nogeometry').style.display = 'none'
                var opt = this.operationTypeSelectByFeature(feature)
                opt.style.display = 'block'
                for (var i = 0; i < opt.options.length; ++i) {
                    if (opt.options[i].text === this.feature.operation)
                        opt.options[i].selected = true
                }
                this.fromTime.setDate(this.feature.from)
                this.toTime.setDate(this.feature.to)
            } else {
                this.tempTable.style.display = "none"
            }
            if(feature.geometry && feature.geometry.type == "Point"){
                coordsInput.value = this.feature.geometry.coordinates[0]+','+this.feature.geometry.coordinates[1]
            }
            var innerHtml = "<tr><td></td><td>Names:</td><td></td><td>Values:</td><td>empty?</td></tr>"
            var i = 1
            for(var j in scheme){
                var prop = scheme[j]
                if(prop in feature.properties){
                    var value = feature.properties[prop]
                    innerHtml += "<tr><td><a href='#' id='property-column-remove-button-"+i+"'>[-]</a></td><td>"+prop+'</td><td> : </td><td><textarea class="table-input" id="property-value-'+i+'" cols="40" rows="1">'+value+'</textarea></td><td><input type="checkbox" id="property-column-empty-checkbox-'+i+'" /></td></tr>'
                } else {
                    innerHtml += "<tr><td><a href='#' id='property-column-remove-button-"+i+"'>[-]</a></td><td>"+prop+'</td><td> : </td><td><textarea class="table-input gray-border" id="property-value-'+i+'" cols="40" rows="1"></textarea></td><td><input type="checkbox" id="property-column-empty-checkbox-'+i+'" /></td></tr>'
                }
                i+=1
            }
            innerHtml += "<tr><td><a href='#' id='property-column-add-button'>[+]</a></td><td><input type='text' class='table-input' id='property-column-add' /></td><td></td><td></td><td></td></tr>"
            this.table.innerHTML = innerHtml
            document.getElementById('property-column-add-button').onclick = (e) => {t.addColumn()}
            var i = 1
            for(var j in scheme){
                document.getElementById('property-column-remove-button-'+i).onclick = (e) => {t.removeColumn(scheme[j])}
                var cb = document.getElementById('property-column-empty-checkbox-'+i)
                
                cb.checked = !(scheme[j] in feature.properties)
                i+=1
            }
        }
    }
}

class LayerPropertyDialogWindow extends DialogWindow {
    constructor(configs){
        super(configs)
        
        this.data = null
        this.fileName = null
        this.layerPanel = null
        this.table = null
        
        this.layer = null
        this.scheme = null
        this.updateButton = null
        
        this.elements = {
            "fill": {
                'input': 'layer-property-input-fill',
                'select': 'layer-property-select-fill',
                'value': null,
                'column': null,
            },
            "line": {
                'input': 'layer-property-input-line',
                'select': 'layer-property-select-line',
                'value': null,
                'column': null,
            },
            "lineWidth": {
                'input': 'layer-property-input-line-width',
                'select': 'layer-property-select-line-width',
                'value': null,
                'column': null,
            },
            "pointSize": {
                'input': 'layer-property-input-point-size',
                'select': 'layer-property-select-point-size',
                'value': null,
                'column': null,
            },
            "pointShape": {
                'input': 'layer-property-input-point-shape',
                'select': 'layer-property-select-point-shape',
                'value': null,
                'column': null,
            },
            "opacity": {
                'input': 'layer-property-input-opacity',
                'select': 'layer-property-select-opacity',
                'value': null,
                'column': null,
            },
            "pointText": {
                'input': 'layer-property-input-point-text',
                'select': 'layer-property-select-point-text',
                'value': null,
                'column': null,
            },
            "pointSignificance": {
                'input': 'layer-property-input-point-significance',
                'select': 'layer-property-select-point-significance',
                'value': null,
                'column': null,
            },
        }
        
        this.setOwnConfig(configs)
    }
    setOwnConfig(configs){
        for(var option in configs){
            let th = this
            switch(option){
                case "updateButton":
                    this.updateButton = document.getElementById(configs[option])
                    this.updateButton.onclick = (e)=>{
                        this.updateLayer(this.layer,this.scheme)
                        th.action(null, false)
                    }
                    break
                case "table":
                    this.table = document.getElementById(configs[option])
                    break
                case "layerpanel":
                    this.layerPanel = configs[option]
                    break
            }
        }
    }
    updateLayer(feature,scheme){
        for(var prop in this.elements){
            var elementData = this.elements[prop]
            var inputElement = document.getElementById(elementData['input'])
            var selectElement = document.getElementById(elementData['select'])
            
            this.value = inputElement.value == "" ? null : inputElement.value
            this.column = selectElement.options[selectElement.selectedIndex].value == "" ? null : selectElement.options[selectElement.selectedIndex].value

            this.layer.styleProperties[prop].value = this.value
            this.layer.styleProperties[prop].column = this.column
        }
        if(this.layerPanel.editing != undefined)
            this.layerPanel.updateLayer(this.layerPanel.editing,this.layerPanel.editing.scheme,true)
    }
    /*
    removeColumn(columnName){
        if(confirm("Do you want to remove this column from dataset?")){
            alert('Column name is not valid for JSON!')
            var ix = this.scheme.indexOf(columnName)
            this.scheme.splice(ix,1)
            this.action(null,true,this.feature,this.scheme)
        }
    }*/
    action(e,display,layer){
        super.action(e,display)
        if(display){
            this.layer = layer
            this.scheme = layer.scheme
        } else {
            this.feature = null
            this.scheme = null
        }
        let t = this
        if(display){
            for(var i in this.elements){
                var elementData = this.elements[i]
                var inputElement = document.getElementById(elementData['input'])
                var selectElement = document.getElementById(elementData['select'])
                
                inputElement.value = layer.styleProperties[i].value
                
                selectElement.innerHTML = '<option value="" name="none">-- NONE --</option>'
                for(var j in this.scheme){
                    var column = this.scheme[j]
                    var select = document.createElement('option')
                    select.setAttribute('value',column)
                    select.setAttribute('name',column)
                    select.innerHTML = column
                    selectElement.appendChild(select)
                }
            }
        }
        /*
        var innerHtml = "<tr><td></td><td>Names:</td><td></td><td>Values:</td></tr>"
        var i = 1
        for(var j in scheme){
            var prop = scheme[j]
            if(prop in feature.properties){
                var value = feature.properties[prop]
                innerHtml += "<tr><td><a href='#' id='property-column-remove-button-"+i+"'>[-]</a></td><td>"+prop+'</td><td> : </td><td><textarea class="table-input" id="property-value-'+i+'" cols="40" rows="1">'+value+'</textarea></td></tr>'
            } else {
                innerHtml += "<tr><td><a href='#' id='property-column-remove-button-"+i+"'>[-]</a></td><td>"+prop+'</td><td> : </td><td><textarea class="table-input gray-border" id="property-value-'+i+'" cols="40" rows="1"></textarea></td></tr>'
            }
            i+=1
        }
        innerHtml += "<tr><td><a href='#' id='property-column-add-button'>[+]</a></td><td><input type='text' class='table-input' id='property-column-add' /></td><td></td><td></td></tr>"
        this.table.innerHTML = innerHtml
        document.getElementById('property-column-add-button').onclick = (e) => {t.addColumn()}
        var i = 1
        for(var j in scheme){
            document.getElementById('property-column-remove-button-'+i).onclick = (e) => {t.removeColumn(scheme[j])}
            i+=1
        }
        */
    }
}


class LayerOperationDialogWindow extends DialogWindow {
    constructor(configs){
        super(configs)
        
        this.data = null
        this.fileName = null
        this.layerPanel = null
        this.layerSelect = null
        this.table = null
        
        this.feature = null
        this.scheme = null
        this.updateButton = null
        
        this.setOwnConfig(configs)
    }
    setOwnConfig(configs){
        for(var option in configs){
            let th = this
            switch(option){
                case "updateButton":
                    this.updateButton = document.getElementById(configs[option])
                    this.updateButton.onclick = (e)=>{
                        if(th.tryUpdate())
                            th.action(null, false)
                    }
                    break
                case "layerpanel":
                    this.layerPanel = configs[option]
                    break
                case "select":
                    this.layerSelect = document.getElementById(configs[option])
                    break
            }
        }
    }
    tryUpdate(){
        var typeSelect = document.getElementById("layer-operation-type")
        if(typeSelect.value == "null"){
            alert("Select type of operation")
            return false
        }
        
        if(this.layerSelect.value == ""){
            alert("Select layer!")
            return false
        }
        
        var selectedLayer = this.layerPanel.layers.children[this.layerSelect.value].originaldata
        
        if(selectedLayer.features.indexOf(this.feature) > -1){
            alert("You can't operate on the same layer!")
            return false
        }
        
        var sumOfAllShapes = null
        for(var i in selectedLayer.features){
            var child = selectedLayer.features[i]
            
            if(child.geometry && child.geometry.type != "Polygon" && child.geometry.type != "MultiPolygon" && typeSelect.value != '')
                continue
                
            if("bbox" in child && !isNaN(child.bbox[0]) && (
                child.bbox[0] > this.feature.bbox[2] || 
                child.bbox[1] > this.feature.bbox[3] || 
                child.bbox[2] < this.feature.bbox[0] || 
                child.bbox[3] < this.feature.bbox[1]))
                continue
                
            if(child == null){
                alert('fail')
                return
            }
            if(sumOfAllShapes == null){
                sumOfAllShapes = JSON.parse(JSON.stringify(child))
            } else {
                //var zapasSum = sumOfAllShapes
                //try {
                    sumOfAllShapes = turf.union(child,sumOfAllShapes)
                //} catch(error) {
                //    sumOfAllShapes = zapasSum
                //}
            }
        }
        if(sumOfAllShapes != null && this.feature != null){
            var newFeature
            
            var temp = this.feature.type == "TempFeature"
            if(temp){
                this.feature.type = "Feature"
            }
            switch(typeSelect.value){
                case "intersect":
                    newFeature = turf.intersect(this.feature,sumOfAllShapes)
                    break
                case "difference":
                    newFeature = turf.difference(this.feature,sumOfAllShapes)
                    break
            }
            if(temp){
                this.feature.type = "TempFeature"
            }
            this.feature.geometry = newFeature.geometry
        } else {
            alert("fail")
            console.log("fail")
        }
        this.layerPanel.updateLayer(this.layerPanel.editing,this.layerPanel.editing.scheme,true)
        
        return true
    }
    action(e,display,feature){
        super.action(e,display)
        if(display){
            this.feature = feature
                        
            this.layerSelect.innerHTML = '<option value="" name="none">-- NONE --</option>'
            for(var name in this.layerPanel.layers.children){
                var value = this.layerPanel.layers.children[name]
                var select = document.createElement('option')
                select.setAttribute('value',name)
                select.setAttribute('name',name)
                select.innerHTML = name
                this.layerSelect.appendChild(select)
            }
        } else {
                
            this.feature = null
        }
    }
}


class CopyToLayerWindow extends DialogWindow {
    
    constructor(configs){
        super(configs)
        
        this.data = null
        this.fileName = null
        this.layerPanel = null
        this.layerSelect = null
        this.operationSelect = null
        this.idInput = null
        this.table = null
        
        this.feature = null
        this.scheme = null
        this.updateButton = null
        
        this.setOwnConfig(configs)
    }
    setOwnConfig(configs){
        for(var option in configs){
            let th = this
            switch(option){
                case "updateButton":
                    this.updateButton = document.getElementById(configs[option])
                    this.updateButton.onclick = (e)=>{
                        if(th.tryUpdate())
                            th.action(null, false)
                    }
                    break
                case "layerpanel":
                    this.layerPanel = configs[option]
                    break
                case "select":
                    this.layerSelect = document.getElementById(configs[option])
                    break
                case "tempControls":
                    this.tempControls = document.getElementById(configs[option])
                    this.operationSelect = document.getElementById('copy-to-layer-temp-operation-type')
                    
                    this.idInput = document.getElementById('copy-to-layer-id-input')
                    
                    this.fromTime = new TimeControl("copy-to-layer-from-time",false,true)
                    this.toTime = new TimeControl("copy-to-layer-to-time",false,true)
                    this.afterLayerSelectChanged()
                    break
            }
        }
    }
    tryUpdate(){
        if(!(this.layerSelect.value in this.layerPanel.layers.children))
            return false
            
        var layer = this.layerPanel.layers.children[this.layerSelect.value]
        
        var copiedGeometry = JSON.parse(JSON.stringify(this.feature.geometry))
        var newFeature
        if(this.layerPanel.isSpatiotemporal(layer)){
            var id = this.idInput.value
            var operation = this.operationSelect.value
            var from_date = this.fromTime.getDate()
            var to_date = this.toTime.getDate()
            
            newFeature = {type:"TempFeature",geometry:copiedGeometry,id:id,operation:operation,from:from_date,to:to_date,properties:{}}

        } else {
            
            newFeature = {type:"Feature",geometry:copiedGeometry,properties:{}}
        }
        layer.originaldata.features.push(newFeature)
        this.layerPanel.updateLayer(layer,layer.scheme,true)

        
        return true
    }
    afterLayerSelectChanged(e){
        this.tempControls.style.display = this.layerSelect.value in this.layerPanel.layers.children && this.layerPanel.isSpatiotemporal(this.layerPanel.layers.children[this.layerSelect.value]) ? 'block' : 'none'
    }
    action(e,display,feature){
        super.action(e,display)
        if(display){
            this.feature = feature
                        
            this.layerSelect.innerHTML = '<option value="" name="none">-- NONE --</option>'
            for(var name in this.layerPanel.layers.children){
                var value = this.layerPanel.layers.children[name]
                //if(this.layerPanel.editing == value)
                //    continue
                    
                var select = document.createElement('option')
                select.setAttribute('value',name)
                select.setAttribute('name',name)
                select.innerHTML = name
                this.layerSelect.appendChild(select)
            }
            let t = this
            this.layerSelect.onchange = e => {t.afterLayerSelectChanged(e)}
        } else {
                
            this.feature = null
        }
    }
}



class CzDate{
    constructor(year,month,day,prevDate){
        if(String(year).slice(1).indexOf('-') > -1){
            this.parse(year,month)
        } else {
            this.setDatePart(year,month,day,prevDate)
        }
    }
    setDatePart(year,month,day,prevDate){
        if(!String(year).match(/^-?[0-9]{1,7}$/gi))
            year = prevDate ? prevDate.year : 1
        if(!String(month).match(/^[0-9]{1,2}$/gi))
            month = prevDate ? prevDate.month : 1
        if(!String(day).match(/^[0-9]{1,2}$/gi))
            day = prevDate ? prevDate.day : null
            
        if(year == 0)
            year = prevDate ? prevDate.year : null
        if(month > 12 || month == 0)
            month = prevDate ? prevDate.month : null
        if(this.dayOffLimit(year,month,day))
            day = prevDate ? prevDate.day : null
            
        this.year = Number(year)
        this.month = Number(month)
        this.day = Number(day)
    }
    parse(string,prevDate){
        var split = string.split('-')
        if(string[0] == '-'){
            this.setDatePart('-'+split[1],split[2],split[3],prevDate)
        } else {
            this.setDatePart(split[0],split[1],split[2],prevDate)
        }
    }
    inzero(int){
        int = Number(int)
        if(int < 10)
            return '0'+int
        return int
    }
    code(){
        return this.year+'-'+this.inzero(this.month)+'-'+this.inzero(this.day)
    }
    lastDay(year,month){
        if([4,6,9,11].indexOf(Number(month)) > -1)
            return 30
        if(Number(month) == 2)
            return 29
        if(Number(month) == 2 && (year % 4 != 0 || (year % 100 == 0 && year % 400 != 0)))
            return 28
        return 31
    }
    dayOffLimit(year,month,day){
        if(day > 31 || day == 0)
            return true
        if(day > this.lastDay(year,month))
            return true
        return false
    }
    addYear(count){
        this.year -= -count
        if(this.year == 0){
            this.year = count > 0 ? 1 : -1
        }
    }
    addMonth(count){
        this.month -= -count
        if(this.month > 12){
            this.month = 1
            this.addYear(1)
        }
        if(this.month < 1){
            this.month = 12
            this.addYear(-1)
        }
    }
    addDay(count){
        this.day -= -count
        if(this.day > this.lastDay(this.year,this.month)){
            this.day = 1
            this.addMonth(1)
        }
        if(this.day < 1){
            this.addMonth(-1)
            this.day = this.lastDay(this.year,this.month)
        }
        
    }
}
class TimeControl {
    constructor(divId,exclusive,allowNull){
        this.div = document.getElementById(divId)
        this.ndiv = null
        
        this.buttons = {}
        this.inputs = {}
        this.nullDate = true
        this.listener = null
        this.listenerTimeout = null
        
        this.allowNull = allowNull
        
        this.createInput(exclusive,allowNull)
        
        this.date = new CzDate(2020,1,1)
        this.setDate(this.date)
        this.lastDateYearChangeAmount = 1
    }
    setListener(listener){
        this.listener = listener
    }
    setDate(czdate){
        if(typeof czdate == "string"){
            if(czdate == ""){
                this.setNull(false)
                czdate = this.date
            } else {
                this.setNull(true)
                czdate = new CzDate(czdate,this.date)
            }
        } else {
            this.setNull(true)
        }
        this.inputs['years'].value = czdate.year
        this.inputs['months'].value = czdate.month
        this.inputs['days'].value = czdate.day
        
        this.date = czdate
        
    }
    getDate(){
        return this.nullDate ? this.date.code() : ""
    }
    moveLastNYears(){
        var actionName = this.lastDateYearChangeAmount + 'yback'
        this.action(null,actionName)
    }
    moveNextNYears(){
        var actionName = this.lastDateYearChangeAmount + 'yfor'
        this.action(null,actionName)
    }
    action(e,action){
        switch(action){
            case 'years':
            case 'months':
            case 'days':
                var years = this.inputs['years'].value
                var months = this.inputs['months'].value
                var days = this.inputs['days'].value
                this.date = new CzDate(years,months,days,this.date)
                this.setDate(this.date)
                break
            case 'dback':
                this.date.addDay(-1)
                this.setDate(this.date)
                break
            case 'dfor':
                this.date.addDay(1)
                this.setDate(this.date)
                break
                
            case 'mback':
                this.date.addMonth(-1)
                this.setDate(this.date)
                break
            case 'mfor':
                this.date.addMonth(1)
                this.setDate(this.date)
                break
                
            case '1yback':
                this.date.addYear(-1)
                this.setDate(this.date)
                this.lastDateYearChangeAmount = 1
                break
            case '1yfor':
                this.date.addYear(1)
                this.setDate(this.date)
                this.lastDateYearChangeAmount = 1
                break
                
            case '10yback':
                this.date.addYear(-10)
                this.setDate(this.date)
                this.lastDateYearChangeAmount = 10
                break
            case '10yfor':
                this.date.addYear(10)
                this.setDate(this.date)
                this.lastDateYearChangeAmount = 10
                break
                
            case '100yback':
                this.date.addYear(-100)
                this.setDate(this.date)
                this.lastDateYearChangeAmount = 100
                break
            case '100yfor':
                this.date.addYear(100)
                this.setDate(this.date)
                this.lastDateYearChangeAmount = 100
                break
        }
        
        if(this.listener != null){
            if(this.listenerTimeout != null){
                clearTimeout(this.listenerTimeout)
            }
            var th = this
            this.listenerTimeout = setTimeout(() => {th.listener(this.getDate())},200)
        }
    }
    setNull(state){
        if(!this.allowNull)
            return
            
        this.nullDate = state
        this.buttons['nullbutton'].checked = state
        this.ndiv.style.display = this.nullDate ? "inline" : "none"
    }
    createInput(exclusive,allowNull){
        this.div.innerHTML = ""
        let th = this
        if(allowNull){
            this.buttons['nullbutton'] = document.createElement('input')
            this.buttons['nullbutton'].setAttribute('type','checkbox')
            this.buttons['nullbutton'].setAttribute('name','nullbutton')
            this.buttons['nullbutton'].onclick = (e) => {th.setNull(e.target.checked)}
            this.div.appendChild(this.buttons['nullbutton'])
        }
        
        this.ndiv = document.createElement('span')
        
        if(allowNull)
            this.setNull(this.nullDate)
            
        this.ndiv.innerHTML = ""
        this.div.appendChild(this.ndiv)
        
        var buttonDefinitions1 = [
            {
                name:'100yback',
                src:'static/img/time-controls/century-back.png',
                exclusive:true
            },
            {
                name:'10yback',
                src:'static/img/time-controls/ten-year-back.png',
                exclusive:true
            },
            {
                name:'1yback',
                src:'static/img/time-controls/year-back.png',
            },
            {
                name:'mback',
                src:'static/img/time-controls/month-back.png',
            },
            {
                name:'dback',
                src:'static/img/time-controls/day-back.png',
            },
        ]
        
        var inputDefinitions = [
            {
                name:'years',
                class:'yearsize',
            },
            {
                name:'months',
                class:'daysize',
            },
            {
                name:'days',
                class:'daysize',
            },
        ]
        
        var buttonDefinitions2 = [
            {
                name:'dfor',
                src:'static/img/time-controls/day-forward.png',
            },
            {
                name:'mfor',
                src:'static/img/time-controls/month-forward.png',
            },
            {
                name:'1yfor',
                src:'static/img/time-controls/year-forward.png',
            },
            {
                name:'10yfor',
                src:'static/img/time-controls/ten-year-forward.png',
                exclusive:true
            },
            {
                name:'100yfor',
                src:'static/img/time-controls/century-forward.png',
                exclusive:true
            },
        ]
        for(var i in buttonDefinitions1){
            let elem = buttonDefinitions1[i]
            
            if(elem.exclusive && !exclusive)
                continue
            
            this.buttons[elem.name] = document.createElement('img')
            this.buttons[elem.name].setAttribute('src',elem.src)
            this.buttons[elem.name].setAttribute('class','time-button')
            this.ndiv.appendChild(this.buttons[elem.name])
            
            this.buttons[elem.name].onclick = (e) => {th.action(e,elem.name)}
        }
        
        for(var i in inputDefinitions){
            let elem = inputDefinitions[i]
            
            this.inputs[elem.name] = document.createElement('input')
            this.inputs[elem.name].setAttribute('type','text')
            this.inputs[elem.name].setAttribute('class','table-input '+elem.class)
            this.ndiv.appendChild(this.inputs[elem.name])
            
            this.inputs[elem.name].onchange = (e) => {th.action(e,elem.name)}
        }
        for(var i in buttonDefinitions2){
            let elem = buttonDefinitions2[i]
            
            if(elem.exclusive && !exclusive)
                continue
            
            this.buttons[elem.name] = document.createElement('img')
            this.buttons[elem.name].setAttribute('src',elem.src)
            this.buttons[elem.name].setAttribute('class','time-button')
            this.ndiv.appendChild(this.buttons[elem.name])
            
            this.buttons[elem.name].onclick = (e) => {th.action(e,elem.name)}
        }
        
        
        
        /*
        <img src="static/img/time-controls/century-back.png" class="time-button" />
        <img src="static/img/time-controls/ten-year-back.png" class="time-button" />
        <img src="static/img/time-controls/year-back.png" class="time-button" />
        <img src="static/img/time-controls/month-back.png" class="time-button" />
        <img src="static/img/time-controls/day-back.png" class="time-button" />
        
        <input type="text" width="20" class="table-input yearsize" />
        <input type="text" width="20" class="table-input daysize" />
        <input type="text" width="20" class="table-input daysize" />
        
        <img src="static/img/time-controls/day-forward.png" class="time-button" />
        <img src="static/img/time-controls/month-forward.png" class="time-button" />
        <img src="static/img/time-controls/year-forward.png" class="time-button" />
        <img src="static/img/time-controls/ten-year-forward.png" class="time-button" />
        <img src="static/img/time-controls/century-forward.png" class="time-button" />
        */
    }
}


