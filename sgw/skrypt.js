
//HERE IS DECLERED MOST OF GLOBAL VARIABLES
function initialize(){
clicked = false;
delaj = 0;
wielkul = 100;
wielkuliron = -1;
wielkulprod = -1;
prawdl = 50;
prawdg = 10;
podswx = -1;
podswy = -1;

podsd = -1;
podsu = -1;

podsm = -1;

magni = 1;
pox = 0;
poy = 0;
vox = 0;
voy = 0;

zaznu = -1;
zaznx = -1;
zazny = -1;

aistan = 0;

stan = 0;
kolej = 0;
akcja = -1;
stawr = 0;

//values from canvases with choice
unitDivisionValue = 0;
unitDivisionHighlight = 0;
unitsInCityNumber = -1;
createUnitNumber = -1;
upgradeCityNumber = -1;
unitMergeChoice = -1;

playing = false
playframe = 0

liczeb = [];

miasy = 25;
dru = new Array(12);
aimap = new Array(12);
f = 0;
celebracja = new Array(12);
while(f<12){
	if(f<4){
		dru[f] = 1;
	} else {
		dru[f] = 0;
	}
	
	celebracja[f] = 0

	//ai map consists of: attacks on cities,
	aimap[f] = {cities: []};
	f++;
}
var mousePositionByCanvas = {x:0,y:0};
mainCanvas=document.getElementById("canv");
ctx=mainCanvas.getContext("2d");
terrainChooseCanvas=document.getElementById("terrainChooseField");
terrainChooseCanvasCtx=terrainChooseCanvas.getContext("2d");
teamChooseCanvas=document.getElementById("teamChoose");
teamChooseCanvasCtx=teamChooseCanvas.getContext("2d");
teamChoose2Canvas=document.getElementById("teamChoose2");
teamChoose2CanvasCtx=teamChoose2Canvas.getContext("2d");
unitChoiceCanvas=document.getElementById("unitChoiceCanvas");
unitChoiceCanvasCtx=unitChoiceCanvas.getContext("2d");
unitDivisionCanvas=document.getElementById("unitDivisionCanvas");
unitDivisionCanvasCtx=unitDivisionCanvas.getContext("2d");
teamPreviewCanvas=document.getElementById("teamPreview");
teamPreviewCanvasCtx=teamPreviewCanvas.getContext("2d");
teamPreview2Canvas=document.getElementById("teamPreview2");
teamPreview2CanvasCtx=teamPreview2Canvas.getContext("2d");
teamPreview3Canvas=document.getElementById("teamPreview3");
teamPreview3CanvasCtx=teamPreview3Canvas.getContext("2d");
teamPreview4Canvas=document.getElementById("teamPreview4");
teamPreview4CanvasCtx=teamPreview4Canvas.getContext("2d");
klepsydraPreviewCanvas=document.getElementById("klepsydraPreview");
klepsydraPreviewCanvasCtx=klepsydraPreviewCanvas.getContext("2d")
cityPreviewCanvas=document.getElementById("cityPreview");
cityPreviewCanvasCtx=cityPreviewCanvas.getContext("2d");
unitsInCityCanvas=document.getElementById("unitsInCity");
unitsInCityCanvasCtx=unitsInCityCanvas.getContext("2d");
createUnitCanvas=document.getElementById("createUnitCanvas");
createUnitCanvasCtx=createUnitCanvas.getContext("2d");
upgradeCityCanvas=document.getElementById("upgradeCityCanvas");
upgradeCityCanvasCtx=upgradeCityCanvas.getContext("2d");
unitMergeCanvas=document.getElementById("unitMerge");
unitMergeCanvasCtx=unitMergeCanvas.getContext("2d");
//movesToMakeCanvas=document.getElementById("movesToMakeCanvas");
//movesToMakeCanvasCtx=movesToMakeCanvas.getContext("2d");
//movesToMakeCanvas2=document.getElementById("movesToMakeCanvas2");
//movesToMakeCanvasCtx2=movesToMakeCanvas2.getContext("2d");
statisticsCanvas=document.getElementById("statisticsCanvas");
statisticsCanvasCtx=statisticsCanvas.getContext("2d");
statisticsCanvas2=document.getElementById("statisticsCanvas2");
statisticsCanvasCtx2=statisticsCanvas2.getContext("2d");
statisticsCanvas3=document.getElementById("statisticsCanvas3");
statisticsCanvasCtx3=statisticsCanvas3.getContext("2d");
ctx.mozImageSmoothingEnabled = false;
ctx.font = "8pt Arial";
ctx.fillStyle = "white";
menst = 0;
defdr = ["CZERWONI","NIEBIESCY","ZIELONI","ŻÓŁCI","TURKUSOWI","PURPUROWI","CZARNI","POMARAŃCZOWI","FIOLETOWI","CIEMNOZIELONI","BRĄZOWI","SELEDYNOWI"];
szy = [2,3,1,5,2,1,3,3,3,8,8,2];
szyt = ["n","c","c","n","g","c","w","w","w","l","l","n"];
zas = [1,1,3,1,1,3,2,2,0,3,0,1];
zast = ["n","n","n","n","n","p","n","n","x","l","x","m"];
at = [1,2,1.6,1,1,1,1,2,0,1,0,0];
obrr = [1,2,0,1,1,0,1,2,0,0,0,0];
ced = [8,16,16,12,10,16,12,20,4,20,12,12];
ces = [0,2,2,1,0,1,0,2,0,2,1,0];
defodd1 = ["Pułk piechoty","Pułk czołgów","Pułk artylerii","Pułk piechoty zmotoryzowanej","Pułk piechoty górskiej","Pułk obrony przeciwlotniczej","Flotylla okrętów lekkich","Flotylla pancerników","Flotylla łodzi desantowych","Dywizjon lotnictwa bojowego","Dywizjon lotnictwa transportowego","Pułk saperów"];
defodd2 = ["Batalion piechoty","Batalion czołgów","Batalion artylerii","Batalion piechoty zmotoryzowanej","Batalion piechoty górskiej","Batalion obrony przeciwlotniczej","Brygada okrętów lekkich","Brygada pancerników","Brygada łodzi desantowych","Szwadron lotnictwa bojowego","Szwadron lotnictwa transportowego","Batalion saperów"];
defodd3 = ["Kompania piechoty","Kompania czołgów","Kompania artylerii","Kompania piechoty zmotoryzowanej","Kompania piechoty górskiej","Kompania obrony przeciwlotniczej","Dywizjon okrętów lekkich","Dywizjon pancerników","Dywizjon łodzi desantowych","Skrzydło lotnictwa bojowego","Skrzydło lotnictwa transportowego","Kompania saperów"];
defodd4 = ["Pluton piechoty","Pluton czołgów","Pluton artylerii","Pluton piechoty zmotoryzowanej","Pluton piechoty górskiej","Pluton obrony przeciwlotniczej","Grupa okrętów lekkich","Grupa pancerników","Grupa łodzi desantowych","Klucz lotnictwa bojowego","Klucz lotnictwa transportowego","Pluton saperów"];
defodd5 = ["Drużyna piechoty","Drużyna czołgów","Drużyna artylerii","Drużyna piechoty zmotoryzowanej","Drużyna piechoty górskiej","Drużyna obrony przeciwlotniczej","Okręt lekki","Pancernik","Łódź desantowa","Statek powietrzny lotnictwa bojowego","Statek powietrzny lotnictwa transportowego","Drużyna saperów"];
okox = -1;
okoy = -1;
terrainChooseNumber = -1;
teamChooseNumber = -1;
teamChoose2Number = -1;
unitChoiceNumber = -1;
movesToMakeNumber = -1;
movesToMakeNumber2 = -1;
scian = 15;
kotron = scian;

mapsizevalue = document.getElementById("mapsizevalue");
mapsizerange = document.getElementById("mapsizerange");
landPercentageValue = document.getElementById("landPercentageValue");
landPercentageInput = document.getElementById("landPercentageInput");
mountPercentageValue = document.getElementById("mountPercentageValue");
mountPercentageInput = document.getElementById("mountPercentageInput");
cityPercentageValue = document.getElementById("cityPercentageValue");
taxRangeValue = document.getElementById("taxRangeValue");
taxRange = document.getElementById("taxRange");
newUnitSizeValue = document.getElementById("newUnitSizeValue");
newUnitSizeRange = document.getElementById("newUnitSizeRange");
upgradeCityRangeValue = document.getElementById("upgradeCityRangeValue");
upgradeCityRange = document.getElementById("upgradeCityRange");
cityPercentageInput = document.getElementById("cityPercentageInput");
citySizeValue = document.getElementById("citySizeValue");
unitSizeRange = document.getElementById("unitSizeRange");
cityIronValue = document.getElementById("cityIronValue");
unitIronRange = document.getElementById("unitIronRange");
cityProdValue = document.getElementById("cityProdValue");
unitProdRange = document.getElementById("unitProdRange");
infoo = document.getElementById("infoo");
equality = document.getElementById("equality");
teamName = document.getElementById("teamName");
teamName2 = document.getElementById("teamName2");
teamName3 = document.getElementById("teamName3");
unitTypeField = document.getElementById("unitTypeField");
divideButton = document.getElementById("divideButton");
expandButton = document.getElementById("expandButton");
aroundcanv = document.getElementById("aroundcanv");
cityName = document.getElementById("cityName");
steelAmount = document.getElementById("steelAmount");
cityData = document.getElementById("cityData");
zatw = document.getElementById("zatw");
remindField = document.getElementById("remindField");
endturn = document.getElementById("endturn");
historiaTuraSpan = document.getElementById("historia-tura-span");
historiaDruzynaSpan = document.getElementById("historia-druzyna-span");
historiaRuchSpan = document.getElementById("historia-ruch-span");
historyPlej = document.getElementById("historyplej");
equality.disabled = false;
equality.checked = false;


var maxMapEdge = 60;
miastoo = new Array(100);
miaston = 0;
oddy = 50;

heks = new Array(maxMapEdge);
var a = 0;
while(a<maxMapEdge){
 heks[a] = new Array(maxMapEdge);
 var b = 0;
 while(b<maxMapEdge){
  heks[a][b] = new Hex(a,b);
  /*heks[a][b].granx[0] = a;
  heks[a][b].grany[0] = b-1;
  heks[a][b].granx[3] = a;
  heks[a][b].grany[3] = b+1;
  heks[a][b].granx[1] = a+1;
  heks[a][b].granx[2] = a+1;
  heks[a][b].granx[4] = a-1;
  heks[a][b].granx[5] = a-1;
  if(heks[a][b].x%2==0){
  	heks[a][b].grany[1] = b-1;
  	heks[a][b].grany[2] = b;
  	heks[a][b].grany[4] = b;
  	heks[a][b].grany[5] = b-1;
  } else {
  	heks[a][b].grany[1] = b;
  	heks[a][b].grany[2] = b+1;
  	heks[a][b].grany[4] = b+1;
  	heks[a][b].grany[5] = b;
  }*/
  b++;
 }
 a++;
}

//array of bordering hexes
a = 0;
while(a<maxMapEdge){
 b = 0;
 while(b<maxMapEdge){
	 heks[a][b].border = [];
	 if(b>0)
		heks[a][b].border[0] = heks[a][b-1];
	 else
		heks[a][b].border[0] = null;

	 if(b>=1-a%2 && a<maxMapEdge-1)
		heks[a][b].border[1] = heks[a+1][b-1+a%2];
	 else
		heks[a][b].border[1] = null;

	 if(b<=maxMapEdge-1-a%2 && a<maxMapEdge-1)
		heks[a][b].border[2] = heks[a+1][b+a%2];
	 else
		heks[a][b].border[2] = null;

	 if(b<maxMapEdge-1)
		heks[a][b].border[3] = heks[a][b+1];
	 else
		heks[a][b].border[3] = null;

	 if(b<=maxMapEdge-1-a%2 && a>0)
		heks[a][b].border[4] = heks[a-1][b+a%2];
	 else
		heks[a][b].border[4] = null;

	 if(b<=maxMapEdge-1-a%2 && a>0)
		heks[a][b].border[5] = heks[a-1][b-1+a%2];
	 else
		heks[a][b].border[5] = null;

	 heks[a][b].drawHex = drawHex;
	 b++;
 }
 a++;
}
ruchwkolejce = [];
ruchwkolejcen = 0;
	au = 508/(scian-(-1));
	bu = 762/Math.sqrt(3)/(scian-(-0.5));
generateTerrain();
smoothenCoastline();
smoothenCoastline();
smoothenCoastline();
changeState(-1);
oddnum = Array(12);
oddid = Array(12);
unix = Array(12);
rownia = Array(12);
rowniak = Array(12);
trownia = Array(12);
bloknia = Array(12);
equaUnitDistribution = false;
ts = -2;
while(ts<12){
 rownia[ts] = 0;
 trownia[ts] = 0;
 rowniak[ts] = Array();
 oddnum[ts] = 0;
 oddid[ts] = 0;
 bloknia[ts] = Array();
 for(var i = 0;i<12;i++){
	bloknia[ts][i] = false
 }
 unix[ts] = Array();
 if(ts==-2)
	 ts++;
 ts++;
}
redraw(true);
kierk = -1.11;
gameplay = false;
	taxRange.disabled = false;
	tx = -1;
	ty = -1;
	
	historyDex = new HistoryDex(this)
}

const spektrum_kolorów = [
	'#f00',
	'#f40',
	'#f80',
	'#fc0',
	'#ff0',
	'#cf0',
	'#8f0',
	'#4f0',
	'#0f0',
	'#0f4',
	'#0f8',
	'#0fc',
	'#0ff',
	'#0cf',
	'#08f',
	'#04f',
	'#00f',
	'#40f',
	'#80f',
	'#c0f',
	'#f0f',
	'#f0c',
	'#f08',
	'#f04'
]
const spektrum_kolorów_fajerwerków = [
	'#f88',
	'#fa8',
	'#fc8',
	'#fe8',
	'#ff8',
	'#ef8',
	'#cf8',
	'#af8',
	'#ef8',
	'#f8e',
	'#ffa',
	'#ffc',
	'#ffe',
]
//Class for hexagon
function Hex(x,y){
 this.x = x;
 this.y = y;
 this.z = 0;

 this.hutn = 0;
 this.prod = 0;

 this.zpl = 0;
 this.hutnpl = 0;
 this.prodpl = 0;

 this.kasy = 0;
 this.stali = 0;

 this.gran = [];
 this.zmiana = 0;
 this.unt = Array(4);
 this.undr = -1;
 this.unbr = -1;
 this.unp = 0;
 eu = 0;
 while(eu<4){
  this.unt[eu] = -1;
  eu++;
 }
 this.unt[-1] = null/*obiektMost(this)*/;
 this.pode = 0;
 this.koli = 0;
 this.tasuj = tasuj;
 this.usun = usun;
 this.usunmost = usunmost;
 this.tiest = false;
 this.nazwa = '';

 this.drogn = 0;	//numer
 this.drogp = [];	//skąd nadchodzi
 this.drogk = [];	//dokąd idzie
 this.drogpr = [];	//osiągalne
 this.drogw = [];	//wysokość
 this.drogkol = [];	//kolor
 this.drogg = [];	//do kogo należy
 this.drogd = [];	//drużyna

 this.drpon = 0;
 this.drpop = [];
 this.drpok = [];
 this.drpox = [];
 this.drpoy = [];

 this.wylad = [];
 this.wyladr = [];
  for(var i=0;i<4;i++){
	this.wylad[i] = -1;
	this.wyladr[i] = -1;
  }

 this.ktodro = Array(12);		//do którego  unitu należy
 eu = 0;
 while(eu<12){
  this.ktodro[eu] = [];
  eu++;
 }
 this.dpodatnum = 0;
 this.dpodatk = [];
 this.dpodato = [];
 this.debix = -1;
 this.debiy = -1;
 this.dpodszlo = 0;

 //this.wplywy = 0;
 this.trybutariuszy = 0;
 this.trybutariusze = [];

 this.podatpr = 0;
 this.podatl = 0;

 this.kask = 0;
 this.kaska = 0;

 this.buchy = [];
 this.buchuj = buchuj;
 this.niszcz = 0;

 this.plum = 0;		//siła
 this.plumy = 0;	//klatka

 this.most = [];

 var g = 0;
 while(g<6){
	 this.most[g] = 0;
	 this.buchy[g] = new Buch(x,y,this);
	 g++;
 }
 this.zazwa = false;
 this.zazwh = false;

 this.test = "";
 this.testColor = "#000";

 this.kolz = -1;
 this.bylo = false;
 this.bydlo = false;

 this.koloruj = koloruj;

 this.waterbody = null
 this.land = null
 
 this.fajerwerki = []
 for(var i = 0;i<12;i++){
	 this.fajerwerki.push(0)
 }
 this.fajerwerkolor = this.fajerwerki.map(x=>spektrum_kolorów_fajerwerków[Math.floor(Math.random()*spektrum_kolorów_fajerwerków.length)])
 this.fajerwerx = this.fajerwerki.map(x=>Math.random()*2-1)
 this.fajerwery = this.fajerwerki.map(x=>Math.random()*2-1)
 if(Math.abs(this.fajerwery) > 2-Math.abs(this.fajerwerx)*2){
	 this.fajerwery = this.fajerwery > 0 ? 1-this.fajerwery : this.fajerwery-1
	 this.fajerwerx = this.fajerwerx > 0 ? 2-this.fajerwerx : this.fajerwerx-2
 }
 this.fajerwerktime = 0

 //should be accessible only through ai function
 this.value = ()=>this.waterbody.value()+this.waterbody.city_value(this)
}

function obiektMost(senior){
	this.x = senior.x;
	this.y = senior.y;
	this.d = -2;
	this.il = 0;
	this.id = oddid[-2];
	oddid[-2]++;
	this.ruchy = 0;

	this.celd = -1;
	this.celu = -1;
	this.celk = -1;

	this.celen = 0;
	this.celed = [];
	this.celeu = [];

	senior.unt[-1] = this.id;
	this.kosz = false;
	this.kolor = 0;
	//okox,okoy,kolej,oddy,oddid[kolej],oddnum[kolej],akcja
	//xh,yh,druzh,il,nunum,id,rodz
}
function Buch(hx,hy,senior){
	this.hx = hx;
	this.hy = hy;
	this.stan = 20;
	this.wielk = 0;
	this.rysunit = rysunit2;

}
function buchuj(wielt){

	var f = 0;
	while(f<6 && this.buchy[f].stan<20){
		f++;
	}
	if(f < this.buchy.length && this.buchy[f].stan==20){
		this.buchy[f].stan = 0;
		this.buchy[f].wielk = wielt;
	}
	this.niszcz += wielt;
	if(this.niszcz>100)
		this.niszcz = 100;
}
function Unit(xh,yh,druzh,il,nunum,id,rodz){
 this.x = xh;
 this.y = yh;
 this.d = druzh;
 this.il = il;
 this.num = nunum; //numer jednostki
 this.id = id;
 this.rysunit = rysunit;
 this.rodz = rodz;
 this.szyt = szyt[this.rodz];
 this.szy = szy[this.rodz];

 this.ruchy = 0;			//ile ruchów
 this.ruchk = [];	//kierunek
 this.rucho = [];	//odległość
 this.ruchh = 0;

 this.sebix = xh;
 this.sebiy = yh;
 this.ata = -1;
 this.atakt = -1;
 this.kosz = false;

 this.kiero = 0;
 this.przes = 0;
 this.przenies = przenies;

 this.wypax = -1;
 this.wypay = -1;

 this.kolor = 0;

 this.rozb = 0;

 this.zalad = 0;

 this.celd = -1;
 this.celu = -1;
 this.celk = -1;

 this.celen = 0;
 this.celed = [];
 this.celeu = [];

}
function kir(odd,doo,xy){
	var kix,kiy;
	kier = 0;
	zag = 0;
	rozn = 3-Math.abs(3-Math.abs(odd-doo));
	if(odd>=doo){
		wienk = odd;
		mienk = doo;
	} else {
		wienk = doo;
		mienk = odd;
	}
	if(wienk-mienk>3){
		wienk = mienk;
	}
	if(rozn==2){
		zag = 1;
		kier = (wienk+5)%6;
	} else if(rozn==1){
		zag = 2;
		kier = (wienk+5)%6;
	} else if(rozn==3) {
		zag = 3;
		kier = (wienk+4)%6;
	} else if(rozn==0) {
		zag = 3;
		kier = wienk;
		if(kier<0){
			kier+=6;
		}
	}
	if(zag == 1){
		switch(kier){
			case 0:
			kix = 0;
			kiy = -bu/3*Math.sqrt(3)/2;
			break;
			case 1:
			kix = au/4;
			kiy = -bu/6*Math.sqrt(3)/2;
			break;
			case 2:
			kix = au/4;
			kiy = bu/6*Math.sqrt(3)/2;
			break;
			case 3:
			kix = 0;
			kiy = bu/3*Math.sqrt(3)/2;
			break;
			case 4:
			kix = -au/4;
			kiy = bu/6*Math.sqrt(3)/2;
			break;
			case 5:
			kix = -au/4;
			kiy = -bu/6*Math.sqrt(3)/2;
			break;
		}
	}
	if(zag == 2 || zag == 3){
		switch(kier){
			case 0:
			kix = au/4;
			kiy = -bu/2*Math.sqrt(3)/2;
			break;
			case 1:
			kix = au/2;
			kiy = 0;
			break;
			case 2:
			kix = au/4;
			kiy = bu/2*Math.sqrt(3)/2;
			break;
			case 3:
			kix = -au/4;
			kiy = bu/2*Math.sqrt(3)/2;
			break;
			case 4:
			kix = -au/2;
			kiy = 0;
			break;
			case 5:
			kix = -au/4;
			kiy = -bu/2*Math.sqrt(3)/2;
			break;
		}
	}
	if(zag==3){
		kix/=2;
		kiy/=2;
	}
	var ret;
	if(xy == "x"){
		ret = kix;
	}
	if(xy == "y"){
		ret = kiy;
	}
	return ret;
}
function changeState(newState){
	showcode(false)
	akcja = -1;
	f = -2;
	var nowatura = false
	stin = document.getElementById("u"+1);
	while(f<7){
		h = f-(-1);
		stin = document.getElementById("u"+h);
		if(f==newState){
			stin.style.display = "block";
		} else {
			stin.style.display = "none";
		}
		f++;
	}
	var zamak = false;
	if(stan == 4){
		zamak = true;
	}
	if((stan>=1 || stan == -2) && newState==2){
		for(var i = 0;i<12;i++){
			spis(i);
		}
		//historyDex.zapisz()
	}
	var dotychczas = stan
	stan = newState;
	if(stan == 1){
		kolej = -1;
		nextTurn();nowatura = true
		unitChoiceDraw();

			var a = 0;
			while(a<oddid[kolej]){
				if (!unix[kolej][a].kosz && (unix[kolej][a].ruchy>0 || unix[kolej][a].celd != -1)){
					dokolejki(a);
				}
				a++;
			}
	}
	if(stan == 2){
		zaznu = -1;
		if(!gameplay){
			kolej = -1;
		}
		if(zamak || !gameplay){
			takole = kolej;
			nextTurn();nowatura = true
			
			kotron = 0;
			ruchwkolejcen = 0;
			var a = 0;
			while(a<oddid[kolej]){
				if (!unix[kolej][a].kosz && (unix[kolej][a].ruchy>0 || unix[kolej][a].celd != -1)){
					dokolejki(a);
				}
				a++;
			}
		}
		//rescaleMovesToMakeCanvasCts()
		//redrawCanvas(movesToMakeCanvasCtx)
	}
	if(stan == 6){
		historyDex.setShowcaseDataToCurrent()
		
		playing = false
		playframe = 0
	}
	uniwy = -1;
	jesio = -1;
	pokap();
	unitDivisionDraw();
	if(dotychczas == -1){
		rysujEkranStartowy(ctx)
		fajneprzejście(scian-1)
	}
		
	//if(nowatura)
	//	historyDex.zapisz()
}
function fajneprzejście(num){
	for(var j = 0;j<scian;j++){
		heks[num][j].zmiana = 1
	}
	if(num-1 >= 0){
		setTimeout(() => fajneprzejście(num-1),50)
	}
}
function rescaleMovesToMakeCanvasCts(){
	movesToMakeCanvas.height = ruchwkolejcen*30 + 20
	movesToMakeCanvasCtx=movesToMakeCanvas.getContext("2d");
}
function spis(druz){
	var lib = 0;
	var bh = 0;
	while(bh<oddid[druz]){
		if(!unix[druz][bh].kosz && unix[druz][bh].x != -1)
		lib++;
		bh++;
	}
	liczeb[druz] = lib;
}
function nextTurn(){
	if(equality.checked){
		if(!equaUnitDistribution){
			equaUnitDistribution = true;
			eij = 0;
			while(eij<oddid[kolej]){
				rowniak[unix[kolej][eij].rodz][rownia[unix[kolej][eij].rodz]] = unix[kolej][eij].il;
				rownia[unix[kolej][eij].rodz]++;
				eij++;
			}
		}
	} else {
		equaUnitDistribution = false;
	}
	if(equaUnitDistribution){
		eij = 0;
		while(eij<12){
			trownia[eij] = 0;
			eij++;
		}
	}
	akcja = -1;
	var ej = 0;
	defdr[kolej] = teamName.value;
	
	var overflow = false
	var overflows = 0
	while(ej<12){
		kolej++;
		if(kolej>=12){
			kolej = 0;
			overflow = true
		}
		
		if(dru[kolej]!=0 && (liczeb[kolej]>0 || stan<2)){
			ej = 12;
		}
		ej++;
	}
	
	historyDex.nowaKolej(overflow)
	if(dru[kolej]>1){
		aistan = 0;
	}
	pokap();
}
function generateTerrain(){
	ladu = 0;
	a = 0;
	wasx = new Array(scian*scian);
	wasy = new Array(scian*scian);
	miaston = 0;
	wasn = 0;
	while(a<60){
		b = 0;
		while(b<60){
			heks[a][b].nazwa = '';
			if(Math.random()<prawdl/100){
				if(Math.random()<prawdg/100){
  					heks[a][b].z = -2;
				} else {
					heks[a][b].z = 0;
					if(a<scian && b<scian){
						wasx[wasn] = a;
						wasy[wasn] = b;
						wasn++;
						ladu++;
					}
				}
			} else {
				heks[a][b].z = -1;
			}
			b++;
		}
		a++;
	}
	kotron = scian;
	rearrangeCities(false);

}
function rearrangeCities(czy){
	if(czy){
		wasn = 0;
		ladu = 0;
		miaston = 0;
		a = 0;
		while(a<scian){
			b = 0;
			while(b<scian){
				if(heks[a][b].z>=0){
					heks[a][b].z = 0;
					heks[wasx[iku]][wasy[iku]].nazwa = '';
					wasx[wasn] = a;
					wasy[wasn] = b;
					wasn++;
					ladu++;
				}
				for(var j = 0;j<heks[a][b].unp;j++){
					heks[a][b].usun(j)
				}
				heks[a][b].unp = 0
				b++;
			}
			a++;
		}
		/*
		wej = 0;
		while(wej<wasn){
			if(hex[wasx[wej]][wasy[wej]].z > 0){
				hex[wasx[wej]][wasy[wej]].z = 0;
			}
			wej++;
		}*/
	}
	tymczx = new Array(6);
	tymczy = new Array(6);
	miask = 0;
	if(ladu>=miasy){
		miask = miasy;
	} else {
		miask = ladu;
	}
	while(miask>0){
		iku = Math.floor(Math.random()*wasn);
		luj = 0;
		luis = 0;
		pula = -1;
		while(luj<10){
			tku = Math.floor(Math.random()*wasn);
			yla = 0;
			ym = 0;
			while(ym<miaston){

				kaks=Math.abs(wasx[miastoo[ym]]-wasx[tku])-(-Math.abs(wasy[miastoo[ym]]-wasy[tku]));
				if(kaks>yla && yla<7){
					yla = kaks;
					iku = tku;
				}
				ym++;
			}
			if(yla>pula){
				pula = yla;
			}
			luj++;
		}
		dww = Math.floor(Math.random()*160)+41;
		wasn--;
		heks[wasx[iku]][wasy[iku]].z = dww;
		heks[wasx[iku]][wasy[iku]].nazwa = dowmiasta()
		if(dww>=80){
			heks[wasx[iku]][wasy[iku]].hutn = Math.floor(Math.random()*(dww-79)/2);
			heks[wasx[iku]][wasy[iku]].prod = heks[wasx[iku]][wasy[iku]].hutn+Math.floor(Math.random()*20-10);
			if(heks[wasx[iku]][wasy[iku]].prod<0)
				heks[wasx[iku]][wasy[iku]].prod = 0;
		}
		miastoo[miaston] = iku;
		miaston++;
		e = iku;
		while(e<wasn){
			wasx[e] = wasx[e+1];
			wasy[e] = wasy[e+1];
			e++;
		}
		ladu--;
		miask--;
	}
}
function smoothenCoastline(){
	var bee = new Array(60);
	a = 0;
	while(a<60){
		bee[a] = new Array(60);
		b = 0;
		while(b<60){
			bee[a][b] = false;
  			uiu = 0;
			za = 0;
			przeciw = 0;
			while(uiu<6){
				if(heks[a][b].border[uiu]!=null){
					if((heks[a][b].border[uiu].z == -1 && heks[a][b].z == -1) || (heks[a][b].border[uiu].z != -1 && heks[a][b].z != -1)){
						za++;
					} else {
						przeciw++;
					}
				}
				uiu++;
			}
			if(za<przeciw){
				bee[a][b] = true;
			}
			b++;
		}
		a++;
	}
	a = 0;
	while(a<60){
		b = 0;
		while(b<60){
			if(bee[a][b]){
  				if(heks[a][b].z == -1){
					if(Math.random()<prawdg/100){
						heks[a][b].z = -2;
					} else {
						heks[a][b].z = 0;
					}
				} else {
					heks[a][b].z = -1;
				}
			}
			b++;
		}
		a++;
	}
}
/*
function aic(klip,kier){
	var t = false;
	if((klip.x==0 && (kier==5 || kier==4)) || (klip.y==0 && ((klip.x%2==0 && (kier==5 || kier==0 || kier==1)) || (klip.x%2==1 && kier==0))) || (klip.x==scian-1 && (kier==1 || kier==2)) || (klip.y==scian-1 && ((klip.x%2==1 && (kier==2 || kier==3 || kier==4)) || (klip.x%2==0 && kier==3))) || heks[klip.granx[kier]][klip.grany[kier]].z == -1){
		t = true;
	}
	return t;
}
function istni(klip,kier){
	var t = true;
	if((klip.x==0 && (kier==5 || kier==4)) || (klip.y==0 && ((klip.x%2==0 && (kier==5 || kier==0 || kier==1)) || (klip.x%2==1 && kier==0))) || (klip.x==scian-1 && (kier==1 || kier==2)) || (klip.y==scian-1 && ((klip.x%2==1 && (kier==2 || kier==3 || kier==4)) || (klip.x%2==0 && kier==3)))){
		t = false;
	}
	return t;
}*/
function getmouseposition(event){
  var rect = mainCanvas.getBoundingClientRect();
 mousePositionByCanvas = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };;
}
function zacz(){
	ctx.clearRect(0, 0, 800, 800);
}
cac = 0;
function adjustboard(){
					if(pox<scian*(1-1/magni)/2){
					} else {
						pox = scian*(1-1/magni)/2;
					}
					if(pox>-scian*(1-1/magni)/2){
					} else {
						pox = -scian*(1-1/magni)/2;
					}
					if(poy<scian*(1-1/magni)/2){
					} else {
						poy = scian*(1-1/magni)/2;
					}
					if(poy>-scian*(1-1/magni)/2){
					} else {
						poy = -scian*(1-1/magni)/2;
					}

}
function sprawdz(cx,cy){
	ccx = -1;
	ccy = -1;
	ccu = false;
	ccm = false;
	ccmm = -1;
	/*
	sx = 19+au*3/2*heks[a][b].x;
	sy = 19+bu*Math.sqrt(3)*heks[a][b].y;
	*/
	/*
	10+723*
	*/
	
	vox = 0;
	voy = 0;
	if(wix!=undefined){
  		aax = au*3/2*((0-scian/2+pox)+scian/magni/2+2/3);
		aay = bu*Math.sqrt(3)*((0-scian/2+poy)+scian/magni/2+0.5);
		if(cx>mainCanvas.width-wix-5){
			if(cx<mainCanvas.width-5){
				if(cy>10 && cy<110){
					ccmm = 0;
				} else if(cy>130 && cy<230){
					ccmm = 1;
				}
			}
		} else if(cy<mainCanvas.height-20) {
				if(cx<100){
					if(pox<scian*(1-1/magni)/2){
						vox = -1;
						ccmm = 2;
					} else {
						pox = scian*(1-1/magni)/2;
					}
				}
				if(cx>mainCanvas.width-105-wix){
					if(pox>-scian*(1-1/magni)/2){
						vox = 1;
						ccmm = 2;
					} else {
						pox = -scian*(1-1/magni)/2;
					}
				}
				if(cy<100){
					if(poy<scian*(1-1/magni)/2){
						voy = -1;
						ccmm = 2;
					} else {
						poy = scian*(1-1/magni)/2;
					}
				}
				if(cy>mainCanvas.height-120){
					if(poy>-scian*(1-1/magni)/2){
						voy = 1;
						ccmm = 2;
					} else {
						poy = -scian*(1-1/magni)/2;
					}
				}
		}
		if(ccmm==2){
			cac++;
		} else {
			cac = 0;
		}
	}
	if(ccmm==-1){
	sx = Math.floor(2/3*(cx-10)/au+scian/2-scian/2/magni-pox);
	sy = Math.floor(1/Math.sqrt(3)*(cy-10)/bu+scian/2-scian/2/magni-poy);
	if(sx<2){
		sx = 2;
	}
	if(sy<2){
		sy = 2;
	}
	if(sx>scian-2){
		sx = scian-2;
	}
	if(sy>scian-2){
		sy = scian-2;
	}
	a = sx-2;
	while(a<sx+2){
		b = sy-2;
		while(b<sy+2){
  			x0 = 10+au*3/2*((heks[a][b].x-scian/2+pox)+scian/magni/2+2/3);
			if(heks[a][b].x%2 == 0){
				y0 = 10+bu*Math.sqrt(3)*((heks[a][b].y-scian/2+poy)+scian/magni/2+0.5);
			} else {
				y0 = 10+bu*Math.sqrt(3)*((heks[a][b].y-scian/2+poy)+scian/magni/2+1);
			}
			if(Math.abs(cy-y0)<bu*Math.sqrt(3)/2 && Math.abs(cy-y0-(cx-x0)*Math.sqrt(3)*bu/au)<bu*Math.sqrt(3) && Math.abs(cy-y0+(cx-x0)*Math.sqrt(3)*bu/au)<bu*Math.sqrt(3)){
				ccx = a; //koordynat x podświetlonego hexa
				ccy = b;
				a = 60;
				b = 60;
			}
			b++;
		}
		a++;
	}
	if(ccx!=-1 && ccy!=-1){
		if(heks[ccx][ccy].unt[-1]!=null && unix[-2][heks[ccx][ccy].unt[-1]].kolor>0){
			if(Math.abs(cy-(y0-bu/6))<au/2 && Math.abs(cx-x0)<au/1.5){
				ccm = true;
			}
		}
		uei = 0;
		while(uei<heks[ccx][ccy].unp){
			if(Math.abs(cy-(y0-uei*2-bu/4))<au/3 && Math.abs(cx-(x0-uei*2))<au/2){
				ccu = true;
			}
			uei++;
		}
	}
	}
	return {
    	x: ccx,
    	y: ccy,
		u: ccu,
		m: ccm,
		mm: ccmm
 	 };
}
function kolox(druu,obw){
	koy = "#FFFFFF";
	switch(druu*2+obw){
		case 0: koy = "#900"; break;
		case 1: koy = "#D66"; break;

		case 2: koy = "#009"; break;
		case 3: koy = "#66D"; break;

		case 4: koy = "#090"; break;
		case 5: koy = "#6D6"; break;

		case 6: koy = "#990"; break;
		case 7: koy = "#DD6"; break;

		case 8: koy = "#099"; break;
		case 9: koy = "#6DD"; break;

		case 10: koy = "#909"; break;
		case 11: koy = "#D6D"; break;

		case 12: koy = "#333"; break;
		case 13: koy = "#555"; break;

		case 14: koy = "#950"; break;
		case 15: koy = "#D96"; break;

		case 16: koy = "#509"; break;
		case 17: koy = "#96D"; break;

		case 18: koy = "#050"; break;
		case 19: koy = "#696"; break;

		case 20: koy = "#500"; break;
		case 21: koy = "#966"; break;

		case 22: koy = "#580"; break;
		case 23: koy = "#BD6"; break;

		case 25: koy = "#737372"; break;

		case 27: koy = "#785034"; break;

	}
	return koy;
}
function addCity(x,y){
				if(wielkul>39){
					heks[x][y].z = wielkul;
				} else {
					heks[x][y].z = Math.floor(Math.random()*161)+40;
				}
				if(Number(wielkuliron)>-1){
					heks[x][y].hutn = Number(wielkuliron);
				} else {
					heks[x][y].hutn = Math.floor(Math.random()*(heks[x][y].z-79)/2);
				}
				if(Number(wielkulprod)>-1){
					heks[x][y].prod = Number(wielkulprod);
				} else {
					heks[x][y].prod = heks[x][y].hutn+Math.floor(Math.random()*20-10);
					if(heks[x][y].prod<0){
						heks[x][y].prod = 0;
					}
				}
				heks[x][y].nazwa = dowmiasta()
	
}
function cursormove(){
	/* ZAMROŻONE!!!!!*/
	nbx = okox;
	nby = okoy;
	wbx = podswx;
	wby = podswy;
	var objt = sprawdz(mousePositionByCanvas.x,mousePositionByCanvas.y);
	okox = objt.x;
	okoy = objt.y;
	okou = objt.u;
	okom = objt.m;
	okomm = objt.mm;

	
	
	if(stan == 6){
		podswx = okox;
		podswy = okoy;
		podswd = -1;
		podswu = -1;
		podsm = -1;
	} else if(okou) {
		podswd = heks[okox][okoy].undr;
		podswu = unix[podswd][heks[okox][okoy].unt[heks[okox][okoy].unp-1]].id;
		podswx = -1;
		podswy = -1;
		podsm = -1;
	} else if(okom){
		podswd = -2;
		podswu = unix[-2][heks[okox][okoy].unt[-1]].id;
		podswx = -1;
		podswy = -1;
		podsm = -1;
	} else if(okomm>-1){
		podswx = -1;
		podswy = -1;
		podswd = -1;
		podswu = -1;
		podsm = okomm;

	} else {
		podswx = okox;
		podswy = okoy;
		podswd = -1;
		podswu = -1;
		podsm = -1;
	}
	if(nbx!=okox || nby!=okoy || podswx!=wbx || podswy!=wby){
	//map edition
	switch(stan){
		case 0:
		if(clicked){
			switch(akcja){
				case 0:
				heks[podswx][podswy].z = 0;
				break;
				case 1:
					heks[podswx][podswy].z = -1;
				break;
				case 2:
				heks[podswx][podswy].z = -2;
				break;
				case 3:
				addCity(podswx,podswy)
				break;
			}
		}
		break;
		case 1:

		break;
	}
		if(nbx>=0){
			r = 0;
			if(nby>0){
				r = nby-1;
			}
			if(r<0){
				r = 0;
			}
			ro = r+2;
			while(r<ro){
				if(heks[nbx][r].zmiana <=0){
					heks[nbx][r].zmiana = 1;
				}
				r++;
			}
		}
		if(okox>=0){
			r = 0;
			if(okoy>0){
				r = okoy-1;
			}
			if(r<0){
				r = 0;
			}
			ro = r+2;
			while(r<scian){
				if(heks[okox][r].zmiana <=0){
					heks[okox][r].zmiana = 1;
				}
				r++;
			}
		}
	}
	a = 0;
	while(a<scian){
		b = 0;
		while(b<scian){
			if(a>0 && (b>0 || a%2==1) && ((heks[a][b].border[5].zmiana>0 && heks[a][b].unp>0) || heks[a][b].border[5].drogn>0)){
				if(heks[a][b].zmiana<=0){
					heks[a][b].zmiana = 1;
				}
			}
			if(b>0 && ((heks[a][b].border[0].zmiana>0 && heks[a][b].z==-2) || heks[a][b].border[0].drogn>0)){
				if(heks[a][b].zmiana<=0){
					heks[a][b].zmiana = 1;
				}
			}
			if(a<scian && (b<scian || a%2==0) && heks[a][b].border[2].drogn>0){
				if(heks[a][b].zmiana<=0){
					heks[a][b].zmiana = 1;
				}
			}
			if(b<scian && heks[a][b].border[3].drogn>0){
				if(heks[a][b].zmiana<=0){
					heks[a][b].zmiana = 1;
				}
			}
			b++;
		}
		a++;
	}
}
function klik(){
	clicked = true
	if(okomm>-1){
		if(okomm==0){
			if(magni>1){
				magni/=2;
				adjustboard();
				redraw(true);
			}
		} else if(okomm==1){
			if(magni<scian/5){
				magni*=2;
				adjustboard();
				redraw(true);
			}
		}
	} else {
	switch(stan){
		case 0:
	switch(akcja){
		case 0:
		heks[okox][okoy].z = 0;
		break;
		case 1:
		heks[okox][okoy].z = -1;
		break;
		case 2:
		heks[okox][okoy].z = -2;
		break;
		case 3:
			addCity(okox,okoy)
		break;
	}
		break;
		case 1:
			/*if(akcja>=0 && (heks[okox][okoy].undr == kolej || heks[okox][okoy].undr == -1) && heks[okox][okoy].unp<4 && ((heks[okox][okoy].z>=0 && ((akcja != 6 && akcja != 7 && akcja != 8) || heks[okox][okoy].z>0)) || (heks[okox][okoy].z==-2 && (akcja == 0 || akcja == 3 || akcja == 4 || akcja == 11)) || (heks[okox][okoy].z==-1 && (akcja == 6 || akcja == 7 || akcja == 8)))){*/
			if(akcja>=0 && (heks[okox][okoy].undr == kolej || heks[okox][okoy].undr == -1) && heks[okox][okoy].unp<4 && (heks[okox][okoy].z>0 || (heks[okox][okoy].z==0 && (szyt[akcja]=="n" || szyt[akcja]=="c" || szyt[akcja]=="g")) || (heks[okox][okoy].z==-1 && szyt[akcja]=="w") || (heks[okox][okoy].z==-2 && (szyt[akcja]=="n" || szyt[akcja]=="g")) || szyt[akcja]=="l")){
				if(!equaUnitDistribution || trownia[akcja]<rownia[akcja]){
					heks[okox][okoy].undr = kolej;
					heks[okox][okoy].unbr = kolej;
					if(equaUnitDistribution){
						unix[kolej][oddid[kolej]] = new Unit(okox,okoy,kolej,rowniak[akcja][trownia[akcja]],oddid[kolej],oddnum[kolej],akcja);

						trownia[akcja]++;
						unitChoiceDraw();
					} else {
						unix[kolej][oddid[kolej]] = new Unit(okox,okoy,kolej,oddy,oddid[kolej],oddnum[kolej],akcja);

					}

					heks[okox][okoy].unt[heks[okox][okoy].unp] = oddid[kolej];
					heks[okox][okoy].unp++;
					oddid[kolej]++;
					oddnum[kolej]++;
					//cursormove();
					heks[okox][okoy].koloruj();
				}
			}
			if(akcja==-2){
				heks[okox][okoy].usun(-1);
			}
			if(akcja==-1){
				if(zaznu==-1){
					if(podswu!=-1 && podswd==kolej){
						zaznu=podswu;
					}
				} else {
					if(podswu==zaznu && podswd==kolej && heks[okox][okoy].unp>1){
						heks[okox][okoy].tasuj();
						//cursormove();
						zaznu = podswu;
					} else if(podswu!=zaznu && podswd==kolej){
						if(heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].zmiana<1){
							heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].zmiana = 1;
						}
						//cursormove();
						zaznu=podswu;
					} else {
						if(heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].zmiana<1){
							heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].zmiana = 1;
						}
						zaznu = -1;
						//cursormove();
					}

				}
			}
		break;
		case 2:
		case 3:
		case 5:
			if(akcja==-1 && dru[kolej]==1){
					var pask = false;

					if(zaznu>-1){
						a = 0;
						while(a<heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unp){
							if(zaznu==heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unt[a]){
								pask = true;
								a = 4;
							}
							a++;
						}
					}
					if(zaznu==-1 && podswu!=-1 && podswd==kolej){

						//selects the unit
						odzaznam(0);
						zaznu=podswu;
						zaznaj(zaznu);
						zaznx = -1;zazny = -1;
					} else if((zaznx!=podswx || zazny!=podswy) && podswx>-1 && heks[podswx][podswy].z>0 && heks[podswx][podswy].undr==kolej && heks[podswx][podswy].pode<=0 && !pask){

						//selects the city
						if(zaznx!=-1){
							odzaznam(0);
							heks[zaznx][zazny].zmiana++;

						}
						zaznx = podswx;
						zazny = podswy;
						if(zaznu!=-1){
							odzaznaj();
							zaznu = -1;
						}
						changeState(5);
						cityName.value = heks[zaznx][zazny].nazwa;
					} else if(podswu==zaznu && podswd==kolej){

						if(heks[okox][okoy].unp>1){
							//changing between units from one field
							if(zaznx!=-1)
								odzaznam(0);
							heks[okox][okoy].tasuj();
							odzaznaj();
							aktdroguj(kolej,zaznu);
							cursormove();
							zaznu = podswu;
							zaznx = -1;zazny = -1;
							zaznaj(zaznu);
						} else {
							divideUnit(zaznu,10)
						}
					} else if(podswd!=-1){
						//unit another than selected

						if(unix[podswd][podswu].kolor==1 || unix[podswd][podswu].kolor==2 || unix[podswd][podswu].kolor==3){
							//unit is highlighted (ready to be attacked, merged or transported by air)

							if((podswd==kolej && (unix[podswd][podswu].kolor==1 || unix[podswd][podswu].kolor==3)) || (podswd!=kolej && unix[podswd][podswu].kolor==2)){
								celuj(unix[podswd][podswu].x,unix[podswd][podswu].y,podswd,podswu);

								if(zaznu!=-1){
									heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].zmiana++;
									unix[kolej][zaznu].sebix = unix[kolej][zaznu].x;
									unix[kolej][zaznu].sebiy = unix[kolej][zaznu].y;
									odzaznaj();
								}
								zaznu = -1;
								zaznx = -1;zazny = -1;
							}
						} else if(zaznu>-1 && podswu>-1 && podswd==kolej) {
							//select unselected unit from current team

							if(zaznx!=-1)
								odzaznam(0);
							if(heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].zmiana<1){
								heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].zmiana = 1;
							}
							unix[kolej][zaznu].sebix = unix[kolej][zaznu].x;
							unix[kolej][zaznu].sebiy = unix[kolej][zaznu].y;
							odzaznaj();
							aktdroguj(kolej,zaznu);
							zaznu = podswu;
							zaznx = -1;zazny = -1;
							zaznaj(zaznu);
						}
					} else if(zaznx>-1){
						//if city is selected select city
						if(podswx>-1 && heks[podswx][podswy].pode>0){
							//make tax path

							popodatkuj(podswx,podswy,warta-heks[zaznx][zazny].dpodszlo);
						} else {
							//deselect city

							if(zaznx!=-1)
							odzaznam(0);
							if(zaznu!=-1){
								odceluj(zaznu,kolej);
								oddroguj(zaznu,kolej,false);
								zaznu = -1;
							}
							zaznx = -1;
							zazny = -1;
							changeState(2);
						}

					} else if(podswx>-1 && heks[podswx][podswy].pode>0){
						//if hex is highlighted

						var zax = zaznu;
						if(zaznu!=-1 && unix[kolej][zaznu].szyt=="l" && szyt[unix[kolej][zaznu].rodz]!="l" && unix[kolej][zaznu].sebix == podswx && unix[kolej][zaznu].sebiy == podswy && unix[kolej][zaznu].wypax==-1){
							if(unix[kolej][zaznu].sebix!=unix[kolej][zaznu].x || unix[kolej][zaznu].sebiy!=unix[kolej][zaznu].y){
								unix[kolej][zaznu].wypax = unix[kolej][zaznu].sebix;
								unix[kolej][zaznu].wypay = unix[kolej][zaznu].sebiy;
								zaznaj(zaznu);
								zaznu = zax;
								heks[podswx][podswy].wylad[uniw(kolej,zaznu)] = zaznu;
								heks[podswx][podswy].wyladr[uniw(kolej,zaznu)] = kolej;
							} else { //landing from airbone
								wyladuj(zaznu);
								odzaznaj();
							}
						} else if(zaznu!=-1 && unix[kolej][zaznu].sebix == unix[kolej][zaznu].x && unix[kolej][zaznu].sebiy == unix[kolej][zaznu].y){
								//remove path (click on hex where unit stays)

								odceluj(zaznu,kolej);
								zaznu = zax;
								oddroguj(zaznu,kolej,false);

						}
						if(zaznu!=-1 && (unix[kolej][zaznu].sebix != podswx || unix[kolej][zaznu].sebiy != podswy)){
							//make path
							unix[kolej][zaznu].rozb = 0;
							droguj(podswx,podswy,zaznu);

							zaznaj(zaznu);
							zaznu = zax;
						}
						zaznx = -1;zazny = -1;
						//cursormove();
					} else {
						//deselect
						if(zaznu!=-1 && unix[kolej][zaznu].x == podswx && unix[kolej][zaznu].y == podswy){
							odceluj(zaznu,kolej);
							oddroguj(zaznu,kolej,false);
						}
						if(zaznu!=-1 && heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].zmiana<1){
							heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].zmiana = 1;
						}
						if(zaznu!=-1){
						unix[kolej][zaznu].sebix = unix[kolej][zaznu].x;
						unix[kolej][zaznu].sebiy = unix[kolej][zaznu].y;
						odzaznaj();
						aktdroguj(kolej,zaznu);
						}
						zaznu = -1;
						zaznx = -1;zazny = -1;
						//cursormove();
					}


			}
		break;
		case 4:

		break;
	}
	}
	r = 0;
	if(nby>0){
		r = nby-1;
	}
	if(r<0){
		r = 0;
	}
	ro = r+2;
	while(r<ro && ro<scian){
		if(heks[okox][r].zmiana<20){
			heks[okox][r].zmiana = 20;
		}
		r++;
	}
	a = 0;
	while(a<scian){
		b = 0;
		while(b<scian){
			if(a>0 && (b>0 || a%2==1) && heks[a][b].border[5].zmiana>0 && heks[a][b].unp>0){
				if(heks[a][b].zmiana<20){
					heks[a][b].zmiana = 20;
				}
			}
			if(b>0 && heks[a][b].border[0].zmiana>0 && heks[a][b].z==-2){
				if(heks[a][b].zmiana<20){
					heks[a][b].zmiana = 20;
				}
			}
			b++;
		}
		a++;
	}
}
function odklik(){
	clicked = false
}
function fillAll(nui){
	a = 0;
	while(a<60){
		b = 0;
		while(b<60){
			if(nui == 0){
				heks[a][b].z = -1;
			} else if(nui == 1) {
				heks[a][b].z = 0;
			}

			b++;
		}
		a++;
	}
}
function redraw(all){
	if(all == true){
 		ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
 		ctx.fillStyle = "#eee";
 		ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
	}
	
	//drawHex(numb,unixdata,kolej_at_time)
	
	if(stan == -1){
		rysujEkranStartowy(ctx)
	} else if(stan == 6){
		var currentState = historyDex.getCurrentState()
		
		if(currentState != undefined){
		
			a = 0;
			while(a<scian){
				b = 0;
				while(b<scian){
					xq = 10+au*3/2*((a-scian/2+pox)+scian/magni/2);
					yq = 10+bu*Math.sqrt(3)*((b-scian/2+poy)+scian/magni/2);
					if(all == true){
						if(xq>=-200 && xq<=mainCanvas.width && yq>=-200 && yq<=mainCanvas.height){
							currentState.heks[a][b].drawHex(1,currentState.unix,currentState.kolej,currentState.heks);
							currentState.heks[a][b].drawHex(0,currentState.unix,currentState.kolej,currentState.heks);
						}
					} else {
						if(currentState.heks[a][b].zmiana>0){
							currentState.heks[a][b].zmiana--;
							if(xq>=-200 && xq<=mainCanvas.width && yq>=-200 && yq<=mainCanvas.height){
								currentState.heks[a][b].drawHex(1,currentState.unix,currentState.kolej,currentState.heks);
								currentState.heks[a][b].drawHex(0,currentState.unix,currentState.kolej,currentState.heks);
							}
						}

					}
					b++;
				}
				a++;
			}
		}
		textuj(currentState.heks);
	} else {
		a = 0;
		while(a<scian){
			b = 0;
			while(b<scian){
				xq = 10+au*3/2*((a-scian/2+pox)+scian/magni/2);
				yq = 10+bu*Math.sqrt(3)*((b-scian/2+poy)+scian/magni/2);
				if(all == true){
					if(xq>=-200 && xq<=mainCanvas.width && yq>=-200 && yq<=mainCanvas.height){
						heks[a][b].drawHex(1);
						heks[a][b].drawHex(0);
					}
				} else {
					if(heks[a][b].zmiana>0){
						heks[a][b].zmiana--;
						if(xq>=-200 && xq<=mainCanvas.width && yq>=-200 && yq<=mainCanvas.height){
							heks[a][b].drawHex(1);
							heks[a][b].drawHex(0);
						}
					}

				}
				b++;
			}
			a++;
		}
		textuj();
	}
}
function removeUnits(){
	equaUnitDistribution = false;/*
	cc = 0;
	while(cc<12){
		oddid[cc] = 0;
		cc++;
	}*/
	a = 0;
	while(a<scian){
		b = 0;
		while(b<scian){
 			eu = 0;
 			while(eu<4){
				if(heks[a][b].unt[eu] > -1 && heks[a][b].undr > -1){
					unix[heks[a][b].undr][heks[a][b].unt[eu]].kosz = true
					unix[heks[a][b].undr][heks[a][b].unt[eu]].x = -1
					unix[heks[a][b].undr][heks[a][b].unt[eu]].y = -1
				}
 				heks[a][b].unt[eu] = -1;
 				eu++;
			}
			if(heks[a][b].z>0){
				heks[a][b].zmiana = 20;
				heks[a][b].unbr = heks[a][b].undr;
			}
			heks[a][b].undr = -1;
			heks[a][b].unp = 0;
			b++;
		}
		a++;
	}
}

//random polish city name
function dowmiasta(){
	var pczl = "";
	var dczl = "";
	switch(Math.floor(Math.random()*15)){
		case 0:
			pczl = "Drew";
			tabl = ["nowo","nów","niana Wola","niszki","niana Góra"];
			dczl = tabl[Math.floor(Math.random()*tabl.length)];
		break;
		case 1:
			pczl = "Płomie";
			tabl = ["niowo","niów","ńsk","niszki","ńków"];
			dczl = tabl[Math.floor(Math.random()*tabl.length)];
		break;
		case 2:
			pczl = "Drog";
			tabl = ["owo","ów","no","iszki"];
			dczl = tabl[Math.floor(Math.random()*tabl.length)];
		break;
		case 3:
			pczl = "Genera";
			tabl = ["łów","łowo","lińsk","liszki","lska Góra"];
			dczl = tabl[Math.floor(Math.random()*tabl.length)];
		break;
		case 4:
			pczl = "Grzyb";
			tabl = ["owo","ów","no","nia","ieńsk"];
			dczl = tabl[Math.floor(Math.random()*tabl.length)];
		break;
		case 5:
			pczl = "Jele";
			tabl = ["nno","niów","nia Wola","niowo","ńsk"];
			dczl = tabl[Math.floor(Math.random()*tabl.length)];
		break;
		case 6:
			pczl = "Star";
			tabl = ["ów","owo","sk","zyńsk","a Góra"];
			dczl = tabl[Math.floor(Math.random()*tabl.length)];
		break;
		case 7:
			pczl = "Wikli";
			tabl = ["nowo","nów","ńsk","nieńsk","niana Wola"];
			dczl = tabl[Math.floor(Math.random()*tabl.length)];
		break;
		case 8:
			pczl = "Święt";
			tabl = ["owo","ów","oszyńsk","yńsk","a Góra"];
			dczl = tabl[Math.floor(Math.random()*tabl.length)];
		break;
		case 9:
			pczl = "So";
			tabl = ["snowo","snów","śnińsk","śniszki","snowa Góra"];
			dczl = tabl[Math.floor(Math.random()*tabl.length)];
		break;
		case 10:
			pczl = "Kłos";
			tabl = ["owo","ów","owa Wola","iszki","ińsk"];
			dczl = tabl[Math.floor(Math.random()*tabl.length)];
		break;
		case 11:
			pczl = "Niedźwied";
			tabl = ["ziowo","ziów","zie Wielkie","źno","zko"];
			dczl = tabl[Math.floor(Math.random()*tabl.length)];
		break;
		case 12:
			pczl = "Wil";
			tabl = ["ki","ków","czyńsk","ki Wielkie","czury"];
			dczl = tabl[Math.floor(Math.random()*tabl.length)];
		break;
		case 13:
			pczl = "Brz";
			tabl = ["ózki","ozów","ezińsk","ózki Wielkie","ozowiec"];
			dczl = tabl[Math.floor(Math.random()*tabl.length)];
		break;
		case 14:
			pczl = "Traw";
			tabl = ["no","ków","ińsk","y Wielkie","iec"];
			dczl = tabl[Math.floor(Math.random()*tabl.length)];
		break;
	}
	return pczl+dczl;
}
function changeCityName(){
	if(zaznx>-1){
		heks[zaznx][zazny].nazwa = cityName.value;
	}
}
function gotoTheCityWhereUnitIsPlaced(){
	zaznx = unix[kolej][zaznu].x;
	zazny = unix[kolej][zaznu].y;
	heks[zaznx][zazny].zmiana++;
	if(zaznu!=-1){
		odzaznaj();
		zaznu = -1;
	}
	changeState(5);
	cityName.value = heks[zaznx][zazny].nazwa;
}
function disbanduj(){
	var _x = unix[kolej][zaznu].x;
	var _y = unix[kolej][zaznu].y;
	heks[_x][_y].zmiana++;
	if(zaznu!=-1){
		var dozdisbandowania = zaznu
		odzaznaj();
		zaznu = -1;
		
		for(var j = 0;j<heks[_x][_y].unp;j++){
			if(heks[_x][_y].unt[j] == dozdisbandowania){
				heks[_x][_y].usun(j)
				break
			}
		}
	}
	changeState(2);
}
function ataz(att,obrr,ty){
	var ae = heks[att.x][att.y];
	var oe = heks[obrr.x][obrr.y];
	return ataz2(att,obrr,ae,oe,ty)
}
	
function ataz2(att,obrr,ae,oe,ty){
	var vae = 1;
	var voe = 1;
	if(ae.z==-1 && oe.z!=-1){
		vae = 0.75;
		voe = 1.25;
	}
	if(ae.z==-2){
		vae = 1.25;
		if(att.szyt=="g")vae = 1.4;
		if(obrr.szyt=="g"){voe = 1.25}
	}
	if(oe.z==-2){
		vae = 0.75;
		voe = 1.25;
		if(att.szyt=="g"){vae = 1.25;voe = 1};
		if(obrr.szyt=="g"){voe = 1.4};
		if(ae.z==-1){
			vae = 0.6;
			voe = 1.4;
			if(obrr.szyt=="g")voe = 1.6;
		}
	}
	if(zas[att.rodz]>1){
		vae = 1;
	}
	if(zast[att.rodz]=="p" && obrr.szyt=="l"){
		vae*=3;
	}
	if(zast[obrr.rodz]=="p" && att.szyt=="l"){
		voe*=3;
	}
	var ret = voe;
	if(ty=="a"){
		ret = vae;
	}
	return ret;
}
function checkCelebration(przed,atkju,obrkju){
	spis(atkju)
	spis(obrkju)
	var długość = liczeb.filter(x=>x>0).length <= 1 ? 50000 : 40
	if(liczeb[atkju] == 0){
		celebracja[obrkju] = długość
	}
	if(liczeb[obrkju] == 0){
		celebracja[atkju] = długość
	}
		
	/*
	var hasUnits = false
	for(var i = 0;i<scian && !hasUnits;i++){
		for(var j = 0;j<scian && !hasUnits;j++){
			if(heks[i][j].unt[0] != -1 && heks[i][j].undr == kolej)
				hasUnits = true
		}
	}*/
}
