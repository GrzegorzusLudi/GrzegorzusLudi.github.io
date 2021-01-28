boardWidth = 60;
boardHeight = 60;
prawdopodobienstwo = 50;
prawdopodobienstwo2 = 30;
function Heks(a,b){
	this.x = a;
	this.y = b;
	this.gor = 0;
	this.kolor = 0;
	this.glebok = -1;
	if(Math.random()*100>prawdopodobienstwo){
		this.kolor = 1;
	}
	this.przechow = -1;
	this.gora = 0;
        this.place = 0; // 0 - nic, 
}
function ptwo(){
	prawdopodobienstwo = document.getElementById("pwo").value;
	document.getElementById("pok").innerHTML = prawdopodobienstwo;
}
function ptwo2(){
	prawdopodobienstwo2 = document.getElementById("pwo2").value;
	document.getElementById("pok2").innerHTML = prawdopodobienstwo2;
}
function zgranic(x,y,r){
	var bialych = 0;
	var czarnych = 0;
	y0 = Math.max(y-r,0);
	while(y0<Math.min(y+r+1,boardHeight)){
		if((y0-y)%2==0){
			x0 = x-r+Math.abs(y0-y)/2;
			x1 = x+r-Math.abs(y0-y)/2;
			if(x0<0)
				x0 = 0;
			while(x0<=x1 && x0<boardWidth){
				if(heks[x0][y0].kolor==0){
					bialych++;
				} else {
					czarnych++;
				}
				x0++;
			}
		} else if(y%2==0) {
			x0 = x-r+Math.abs(Math.abs(y0-y)+1)/2-1;
			x1 = x+r-Math.abs(Math.abs(y0-y)+1)/2;
			if(x0<0)
				x0 = 0;
			while(x0<=x1 && x0<boardWidth){
				if(heks[x0][y0].kolor==0){
					bialych++;
				} else {
					czarnych++;
				}
				x0++;
			}
		} else {
			x0 = x-r+Math.abs(Math.abs(y0-y)+1)/2;
			x1 = x+r-Math.abs(Math.abs(y0-y)+1)/2+1;
			if(x0<0)
				x0 = 0;
			while(x0<=x1 && x0<boardWidth){
				if(heks[x0][y0].kolor==0){
					bialych++;
				} else {
					czarnych++;
				}
				x0++;
			}
		}
		
		y0++;
	}
	if(bialych==czarnych){
		heks[x][y].przechow = heks[x][y].kolor;
	} else if(bialych>czarnych){
		heks[x][y].przechow = 0;
	} else {
		heks[x][y].przechow = 1;
	}
}
function generuj(){
	boardWidth = document.getElementById("szer").value;
	boardHeight = document.getElementById("wys").value;
	init();
}
function goruj(){
	var a = 0;
	while(a<boardWidth){
		var b = 0;
		while(b<boardHeight){
			if(heks[a][b].glebok>=3){
				if(Math.random()<prawdopodobienstwo2/100)
					heks[a][b].gora = 2;
			} else if(heks[a][b].glebok>=1){
				if(Math.random()<prawdopodobienstwo2/100)
					heks[a][b].gora = 1;
			}
			
			b++;
		}
		a++;
	}
        drawBoard(ctx, boardWidth, boardHeight);
}
function granicpoziom(x,y,poz){
	yt = [-1,-1,0,1,1,0];
	if(y%2==0)
		xt = [-1,0,1,0,-1,-1];
	else
		xt = [0,1,1,1,0,-1];
	var i = 0;
	var najniz = -1;
	while(i<6){
		x0 = x+xt[i];
		y0 = y+yt[i];
		if(x0>=0 && x0<boardWidth && y0>=0 && y0<boardHeight){
			if(poz==0){
				if(heks[x0][y0].kolor == 1){
					heks[x][y].glebok = 0;
					break;
				}
			} else if(heks[x0][y0].kolor == 0 && heks[x0][y0].glebok==poz-1){
				heks[x][y].glebok = poz;
				break;
			}
		}
		i++;
	}
}
function granic(x,y,r,akcja){
	var bialych = 0;
	var czarnych = 0;
	y0 = Math.max(y-r,0);
	while(y0<Math.min(y+r+1,boardHeight)){
		if((y0-y)%2==0){
			x0 = x-r+Math.abs(y0-y)/2;
			x1 = x+r-Math.abs(y0-y)/2;
			if(x0<0)
				x0 = 0;
			while(x0<=x1 && x0<boardWidth){
				akcja(x0,y0);
				x0++;
			}
		} else if(y%2==0) {
			x0 = x-r+Math.abs(Math.abs(y0-y)+1)/2-1;
			x1 = x+r-Math.abs(Math.abs(y0-y)+1)/2;
			if(x0<0)
				x0 = 0;
			while(x0<=x1 && x0<boardWidth){
				akcja(x0,y0);
				x0++;
			}
		} else {
			x0 = x-r+Math.abs(Math.abs(y0-y)+1)/2;
			x1 = x+r-Math.abs(Math.abs(y0-y)+1)/2+1;
			if(x0<0)
				x0 = 0;
			while(x0<=x1 && x0<boardWidth){
				akcja(x0,y0);
				x0++;
			}
		}
		
		y0++;
	}
}
function scal(poziom){
        var i,j;
        for(i = 0; i < boardWidth; ++i) {
            for(j = 0; j < boardHeight; ++j) {
				zgranic(i,j,poziom); 
            }
        }
        for(i = 0; i < boardWidth; ++i) {
            for(j = 0; j < boardHeight; ++j) {
                heks[i][j].kolor = heks[i][j].przechow;
            }
        }
		glebokosci();
		drawBoard(ctx,boardWidth, boardHeight);
}
function cos(x,y){
	ctx.fillStyle = "#800";
	drawHexagon(ctx, true,x,y,false);
}
function glebokosci(){
	var a = 0;
	while(a<boardWidth){
		var b = 0;
		while(b<boardHeight){
			heks[a][b].glebok = -1;
			b++;
		}
		a++;
	}
	var depth = Math.max(boardWidth,boardHeight);
	var f = 0;
	while(f<depth){
		var a = 0;
		while(a<boardWidth){
			var b = 0;
			while(b<boardHeight){
				if(heks[a][b].kolor==0 && heks[a][b].glebok == -1){
					granicpoziom(a,b,f);
				}
				b++;
			}
			a++;
		}
		f++;
	}
}
function init(){
    canvas = document.getElementById('hexmap');

    /*var hexHeight,
        hexRadius,
        hexRectangleHeight,
        hexRectangleWidth,*/
        hexagonAngle = 0.523598776, // 30 degrees in radians
        sideLength = 350/Math.max(boardWidth,boardHeight);

    hexHeight = Math.sin(hexagonAngle) * sideLength;
    hexRadius = Math.cos(hexagonAngle) * sideLength;
    hexRectangleHeight = sideLength + 2 * hexHeight;
    hexRectangleWidth = 2 * hexRadius;
	heks = [];
	a = 0;
	while(a<boardWidth){
		heks[a] = [];
		b = 0;
		while(b<boardHeight){
			heks[a][b] = new Heks(a,b);
			b++;
		}
		a++;
	}
	glebokosci();
    if (canvas.getContext){
        ctx = canvas.getContext('2d');

        ctx.fillStyle = "#000000";
        ctx.strokeStyle = "#CCCCCC";
        ctx.lineWidth = 1;

        drawBoard(ctx, boardWidth, boardHeight);

        canvas.addEventListener("mousedown", function(eventInfo) {
            var x,
                y,
                hexX,
                hexY,
                screenX,
                screenY;

            x = eventInfo.offsetX || eventInfo.layerX;
            y = eventInfo.offsetY || eventInfo.layerY;

            
            hexY = Math.floor(y / (hexHeight + sideLength));
            hexX = Math.floor((x - (hexY % 2) * hexRadius) / hexRectangleWidth);

            screenX = hexX * hexRectangleWidth + ((hexY % 2) * hexRadius);
            screenY = hexY * (hexHeight + sideLength);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawBoard(ctx, boardWidth, boardHeight);

            // Check if the mouse's coords are on the board
            if(hexX >= 0 && hexX < boardWidth) {
                if(hexY >= 0 && hexY < boardHeight) {
                    //ctx.fillStyle = "#000000";
                    drawHexagon(ctx, true,hexX,hexY,true);
                }
            }
			//granic(hexX,hexY,4,cos);
			granic(hexX,hexY,0,cos);
        }); 
    }


}

    function drawBoard(canvasContext, width, height) {
		ctx.fillStyle="#000";
		ctx.fillRect(0,0,canvas.width,canvas.height);
        var i,
            j;

        for(i = 0; i < width; ++i) {
            for(j = 0; j < height; ++j) {
                drawHexagon(ctx,  false ,i,j,true);
            }
        }
    }
    function drawHexagon(canvasContext, fill,xx,yy,kolorzachowany) {           
        //var fill = fill || false;
		if(xx>=0 && xx<boardWidth && yy>=0 && yy<boardHeight){
			
            x = xx * hexRectangleWidth + ((yy % 2) * hexRadius);
            y = yy * (hexHeight + sideLength);
        canvasContext.beginPath();
        canvasContext.moveTo(x + hexRadius, y);
        canvasContext.lineTo(x + hexRectangleWidth, y + hexHeight);
        canvasContext.lineTo(x + hexRectangleWidth, y + hexHeight + sideLength);
        canvasContext.lineTo(x + hexRadius, y + hexRectangleHeight);
        canvasContext.lineTo(x, y + sideLength + hexHeight);
        canvasContext.lineTo(x, y + hexHeight);
        canvasContext.closePath();
		if(kolorzachowany){
			if(heks[xx][yy].kolor==0){
                            canvasContext.fillStyle = "#fff";
                            if(heks[xx][yy].gora>=2)
				canvasContext.fillStyle = "#ddd";
			}
			if(heks[xx][yy].kolor==1){
				canvasContext.fillStyle = "#444";
			}
			if(heks[xx][yy].kolor==2){
				canvasContext.fillStyle = "#800";
			}
		}
            canvasContext.fill();
		if(heks[xx][yy].gora==1){
			canvasContext.strokeStyle = "#666";
			canvasContext.beginPath();
			canvasContext.arc(x + hexRadius, y + hexRectangleHeight*0.65,hexRadius*1,-0.85*Math.PI,-0.15*Math.PI);
			canvasContext.stroke();
		} else if(heks[xx][yy].gora==2){
			canvasContext.strokeStyle = "#666";
			canvasContext.beginPath();
			canvasContext.moveTo(x , y + hexRectangleHeight/2);
			canvasContext.lineTo(x + hexRadius, y);
			canvasContext.lineTo(x + hexRadius*2, y + hexRectangleHeight/2);
			canvasContext.stroke();
		}
		canvasContext.fillStyle = heks[xx][yy].kolor==0 ? "#000" : "#fff"
                //canvasContext.fillText(heks[xx][yy].glebok,x+hexRadius*0.3,y+hexRadius*1.8);
			/*if(heks[xx][yy].kolor==0){
				canvasContext.fillStyle = "#000";
				canvasContext.fillText(heks[xx][yy].glebok,x+hexRadius/2,y+hexHeight*2);
			}*/
            //canvasContext.stroke();
        
		}
    }