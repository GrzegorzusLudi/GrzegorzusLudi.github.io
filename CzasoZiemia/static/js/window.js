

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
    setData(data, filename){
        
        this.fileName = filename
        this.data = data
        
        var type = this.determineType(data, filename)
        
        this.changeType(type, true)
    }
    determineType(data, filename){
        var datatypes = {
            '.geojson': 'geojson',
            '.json': 'geojson',
        }
        var extension = filename.match('[.][A-z0-9]+$')
        extension = extension == undefined || extension.length == 0 ? '' : extension[0]
        
        var predicted = extension in datatypes ? datatypes[extension] : null
        var types = ['geojson','json','none'].sort((x,y)=>y===predicted)
        
        for(var i in types){
            var type = types[i]
            
            if(this.validateType(data, type)){
                return type
            }
        }
        return 'text'
    }
    validateType(data, type){
        if(data === null)
            return type === "null"
            
        switch(type){
            case 'geojson':
                if(this.predictGeoJson(data))
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
class ImportDialogWindow extends LayerDialogWindow {
    constructor(configs){
        super(configs)
        
        this.fileSelect = null
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
            th.setData(event.target.result, file.name)
            th.addFileLoaded(th.type)
        });
        reader.readAsText(file);
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
        if(this.data !== null){
            var bounds = this.canvas.getDegreeBounds()
            var pixelSize = this.canvas.camera.getPixelSize()
            this.layerpanel.addLayer([], this.fileName, this.typeSelect.value, this.data, bounds, pixelSize)
            this.action(null, false)
            this.canvas.draw()
            this.removeFileLoaded()
        }
    }
}

class AddLayerDialogWindow extends LayerDialogWindow {
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
                case "layertype":
                    this.typeSelect = document.getElementById(configs[option])
                    this.typeSelect.addEventListener("change", (e)=>{th.changeType(e.target.value, false)})
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
    prepareDataAccordingToType(name){
        switch(this.typeSelect.value){
            case "geotempjson":
            case "geojson":
                var data = `{"type": "FeatureCollection","name": "`+this.layername()+`","features": []}`
                this.setData(data, name)
                break
            case "text":
                var data = ""
                this.setData(data, name)
                break
        }
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
            this.layerpanel.addLayer([], layerName, this.typeSelect.value, this.data, bounds, pixelSize)
            this.action(null, false)
            this.canvas.draw()
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
                        this.updateFeature(this.feature,this.scheme)
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
    updateFeature(feature,scheme){
        var i = 1
        for(var ix in scheme){
            var key = scheme[ix]
            var value = document.getElementById('property-value-'+i).value
            
            if(value != '' || key in feature.properties){
                feature.properties[key] = value
            }
            i++
        }
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
    action(e,display,feature,scheme){
        super.action(e,display)
        if(display){
            this.feature = feature
            this.scheme = scheme
        } else {
            this.feature = null
            this.scheme = null
        }
        let t = this
        if(feature){
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
            
            if(child.geometry.type != "Polygon" && child.geometry.type != "MultiPolygon" && typeSelect.value != '')
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
            
            switch(typeSelect.value){
                case "intersect":
                    newFeature = turf.intersect(this.feature,sumOfAllShapes)
                    break
                case "difference":
                    newFeature = turf.difference(this.feature,sumOfAllShapes)
                    break
            }
            this.feature.geometry = newFeature.geometry
        } else {
            alert("fail")
            console.log("fail")
        }
        this.layerPanel.updateLayer(this.layerPanel.editing,this.layerPanel.editing.scheme)
        
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