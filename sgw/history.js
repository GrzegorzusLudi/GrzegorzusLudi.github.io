

class HistoryDex {
    constructor(topobject){
        this.topobject = topobject
        
        this.turn = 0
        this.kolej = 0
        
        this.move = 0
        
        this.storedStates = {}
        
        this.firstTurn = -1
        this.firstKolej = -1
        this.firstMove = -1
        
        this.showcaseTurn = 0
        this.showcaseKolej = 0
        this.showcaseMove = 0
    }
    
    nowaKolej(overflow){
        this.kolej = this.topobject.kolej
        if(overflow)
            this.turn++
        this.move = 0
    }
    
    zapisz(){
        this.kolej = this.topobject.kolej
        if(!(this.turn in this.storedStates))
            this.storedStates[this.turn] = {}
        if(!(this.kolej in this.storedStates[this.turn]))
            this.storedStates[this.turn][this.kolej] = []
        this.storedStates[this.turn][this.kolej].push(new HistoryInstance(this.topobject))
        
        if(this.firstTurn == -1){
            this.firstTurn = this.turn
            this.firstKolej = this.kolej
            this.firstMove = this.move
        }
        this.move = this.storedStates[this.turn][this.kolej].length-1
    }
    
    setShowcaseDataToCurrent(reallyDraw){
        if(reallyDraw == undefined)
            reallyDraw = true
        this.showcaseTurn = this.turn
        this.showcaseKolej = this.kolej
        this.showcaseMove = this.move
        
        if(reallyDraw)
            this.update()
    }
    
    historyMove(h_all,h_kolej,h_move,forward,reallyDraw){
        if(reallyDraw == undefined)
            reallyDraw = true
        var prevTurn = this.showcaseTurn
        var prevKolej = this.showcaseKolej
        var prevMove = this.showcaseMove
        if(h_all){
            if(!forward){
                this.showcaseTurn = this.firstTurn
                this.showcaseKolej = this.firstKolej
                this.showcaseMove = this.firstMove
            } else {
                this.setShowcaseDataToCurrent(reallyDraw)
            }
        } else if(h_kolej){
            if(!forward){
                var lastdru = null
                var ok = false
                for(var dru in this.storedStates[this.showcaseTurn]){
                    if(dru == this.showcaseKolej){
                        ok = true
                        break
                    }
                    lastdru = dru
                }
                if(lastdru != null){
                    this.showcaseKolej = lastdru
                    this.showcaseMove = 0
                } else if(this.showcaseTurn > 0) {
                    this.showcaseTurn--
                    
                    for(var dru in this.storedStates[this.showcaseTurn]){
                        this.showcaseKolej = dru
                    }
                    this.showcaseMove = 0
                }
            } else {
                var lastdru = null
                var ok = false
                for(var dru in this.storedStates[this.showcaseTurn]){
                    if(lastdru != null && lastdru == this.showcaseKolej){
                        ok = true
                        this.showcaseKolej = dru
                        break
                    }
                    lastdru = dru
                }
                if(!ok && this.showcaseTurn<this.turn){
                    this.showcaseTurn++
                    
                    for(var dru in this.storedStates[this.showcaseTurn]){
                        this.showcaseKolej = dru
                        break
                    }
                    this.showcaseMove = 0

                }
            }
        } else if(h_move){
            if(!forward){
                if(this.showcaseMove > 0){
                    this.showcaseMove--
                } else {
                    if(this.historyMove(false,true,false,forward,false))
                        this.showcaseMove = this.storedStates[this.showcaseTurn][this.showcaseKolej].length-1
                }
            } else {
                if(this.showcaseMove < this.storedStates[this.showcaseTurn][this.showcaseKolej].length-1){
                    this.showcaseMove++
                } else {
                    if(this.historyMove(false,true,false,forward,false))
                        this.showcaseMove = 0
                }
                
            }
        }
        if(reallyDraw)
            this.update()
        return prevTurn != this.showcaseTurn || prevKolej != this.showcaseKolej || prevMove != this.showcaseMove
    }
    update(){
        this.topobject.pokap()
        this.topobject.redraw(true)
    }
    getCurrentState(){
        return this.storedStates[this.showcaseTurn][this.showcaseKolej][this.showcaseMove]
    }
}

function historyPlay(){
    if(playing){
        playing = false
    } else {
        playing = true
		playframe = 0
    }
}

function historyMove(h_all,h_kolej,h_move,forward){
    historyDex.historyMove(h_all,h_kolej,h_move,forward)
}

historyDex = new HistoryDex(this)

class UnitHistory extends CopyableDeeper {
    constructor(unit,topobject){
        super(['x','y','d','il','num','id','rodz','szyt','szy','ruchy','ruchk','rucho','ruchh','sebix','sebiy','ata','atakt','kosz','kiero','przes','wypax','wypay','kolor','rozb','zalad','celd','celu','celk','celen','celed','celeu'])
        
        this.topobject = topobject

        this.setFields(this.getFields(unit))
        
        this.rysunit = topobject.rysunit;
    }
}
class HexHistory extends CopyableDeeper {
    constructor(topobject,x,y){
        super(['x','y','z','hutn','prod','zpl','hutnpl','prodpl','kasy','stali','gran','zmiana','unt','undr','unbr','unp','pode','koli','tiest','nazwa','drogn','drogp','drogk','drogpr','drogw','drogkol','drogg','drogd','drpon','drpop','drpok','drpox','drpoy','wylad','wyladr','ktodro','dpodatnum','dpodatk','dpodato','debix','debiy','dpodszlo','trybutariuszy','trybutariusze','podatpr','podatl','kask','kaska','buchy','niszcz','plum','plumy','most','zazwa','zazwh','test','testColor','kolz','bylo','bydlo','waterbody','land','border'])
        
        this.topobject = topobject
        
        var heks = topobject.heks[x][y]
        
        this.setFields(this.getFields(heks))

        this.buchuj = topobject.buchuj;
        this.koloruj = topobject.koloruj;
        this.drawHex = topobject.drawHex
    }
}


class HistoryInstance {
    constructor(topobject){
        this.topobject = topobject
        
        this.heks = []
        for(var i = 0;i<topobject.scian;i++){
            this.heks[i] = []
            for(var j = 0;j<topobject.scian;j++){
                this.heks[i][j] = new HexHistory(topobject,i,j)
            }
        }
        this.unix = []
        for(var dr in topobject.unix){
            this.unix[dr] = []
            for(var i in topobject.unix[dr]){
                //if(topobject.unix[dr][i].x != -1){
                this.unix[dr][i] = new UnitHistory(topobject.unix[dr][i],topobject)
                //}
            }
        }
        this.kolej = topobject.kolej
    }
}



