

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
            '.tempgeojson': 'tempgeojson',
            '.geojson': 'geojson',
            '.json': 'geojson',
        }
        var extension = filename.match('[.][A-z0-9]+$')
        extension = extension == undefined || extension.length == 0 ? '' : extension[0]
        
        var predicted = extension in datatypes ? datatypes[extension] : null
        var types = ['tempgeojson','geojson','json','none'].sort((x,y)=>y===predicted)
        
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
            case 'tempgeojson':
                if(this.typeSelect.value != 'tempgeojson')
                    return false
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
    prepareDataAccordingToType(name){
        switch(this.typeSelect.value){
            case "tempgeojson":
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
        this.coordsTable = null
        this.scheme = null
        this.updateButton = null
        
        this.tempTable = null
        this.fromTime = null
        this.toTime = null
        
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
            }
        }
    }
    updateFeature(feature,scheme){
        if(feature.geometry.type == "Point"){
            var coordsInput = document.getElementById("coords-table-input")
            var crs = coordsInput.value.split(",")
            if(crs.length != 2 || isNaN(Number(crs[0])) || isNaN(Number(crs[1]))){
                alert('Wrong format od coordinates')
                coordsInput.value = this.feature.geometry.coordinates[0]+','+this.feature.geometry.coordinates[1]
                return
            } else {
                feature.geometry.coordinates[0] = Number(crs[1])    //N/S (vertical) is usually first
                feature.geometry.coordinates[1] = Number(crs[0])
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
            var opt = document.getElementById('feature-temp-operation-type')
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
            this.layerPanel.updateLayer(this.layerPanel.editing,this.layerPanel.editing.scheme)
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
    action(e,display,feature,scheme){
        super.action(e,display)
        if(display){
            this.feature = feature
            this.scheme = scheme
            this.lastFeatureId = feature.id != undefined ? feature.id : null
        } else {
            this.feature = null
            this.scheme = null
            this.lastFeatureId = null
        }
        let t = this
        this.coordsTable.style.display = (feature && feature.geometry.type == "Point") ? "block" : "none"
        var coordsInput = document.getElementById("coords-table-input")
        
        if(feature){
            if(this.layerPanel.isSpatiotemporal(this.layerPanel.editing)){
                this.tempTable.style.display = "block"
                document.getElementById('feature-id-input').value = this.feature.id
                var opt = document.getElementById('feature-temp-operation-type')
                for (var i = 0; i < opt.options.length; ++i) {
                    if (opt.options[i].text === this.feature.operation)
                        opt.options[i].selected = true
                }
                this.fromTime.setDate(this.feature.from)
                this.toTime.setDate(this.feature.to)
            } else {
                this.tempTable.style.display = "none"
            }
            if(feature.geometry.type == "Point"){
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
            this.layerPanel.updateLayer(this.layerPanel.editing,this.layerPanel.editing.scheme)
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
    }
    getDate(){
        return this.nullDate ? this.date.code() : ""
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
                break
            case '1yfor':
                this.date.addYear(1)
                this.setDate(this.date)
                break
                
            case '10yback':
                this.date.addYear(-10)
                this.setDate(this.date)
                break
            case '10yfor':
                this.date.addYear(10)
                this.setDate(this.date)
                break
                
            case '100yback':
                this.date.addYear(-100)
                this.setDate(this.date)
                break
            case '100yfor':
                this.date.addYear(100)
                this.setDate(this.date)
                break
        }
        
        if(this.listener != null){
            if(this.listenerTimeout != null){
                clearTimeout(this.listenerTimeout)
            }
            var th = this
            this.listenerTimeout = setTimeout(() => {th.listener(this.getDate())},300)
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


