function budyd(x3,y3,wel,druza){
		var wi = wel;

		terrainChooseCanvasCtx.strokeStyle = "#666666";
		terrainChooseCanvasCtx.fillStyle = "#BBBBBB";
		terrainChooseCanvasCtx.lineWidth = 1;
		terrainChooseCanvasCtx.beginPath();
		terrainChooseCanvasCtx.moveTo(x3-aw*0.105,y3+Math.sqrt(3)/2*bw*0.5);
		terrainChooseCanvasCtx.lineTo(x3+aw*0.105,y3+Math.sqrt(3)/2*bw*0.5);
		terrainChooseCanvasCtx.lineTo(x3+aw*0.105,y3+Math.sqrt(3)/2*bw*(0.5-wi/200));
		terrainChooseCanvasCtx.lineTo(x3-aw*0.105,y3+Math.sqrt(3)/2*bw*(0.5-wi/200));
		terrainChooseCanvasCtx.closePath();
		terrainChooseCanvasCtx.fill();
		terrainChooseCanvasCtx.stroke();
		terrainChooseCanvasCtx.fillStyle = "#999999";
		terrainChooseCanvasCtx.beginPath();
		terrainChooseCanvasCtx.moveTo(x3+aw*0.105,y3+Math.sqrt(3)/2*bw*0.5);
		terrainChooseCanvasCtx.lineTo(x3+aw*0.205,y3+Math.sqrt(3)/2*bw*0.4);
		terrainChooseCanvasCtx.lineTo(x3+aw*0.205,y3+Math.sqrt(3)/2*bw*(0.4-wi/200));
		terrainChooseCanvasCtx.lineTo(x3+aw*0.105,y3+Math.sqrt(3)/2*bw*(0.5-wi/200));
		terrainChooseCanvasCtx.closePath();
		terrainChooseCanvasCtx.fill();
		terrainChooseCanvasCtx.stroke();
		terrainChooseCanvasCtx.fillStyle = "#999999";
		terrainChooseCanvasCtx.beginPath();
		terrainChooseCanvasCtx.moveTo(x3+aw*0.205,y3+Math.sqrt(3)/2*bw*(0.4-wi/200));
		terrainChooseCanvasCtx.lineTo(x3+aw*0.105,y3+Math.sqrt(3)/2*bw*(0.5-wi/200));
		terrainChooseCanvasCtx.lineTo(x3-aw*0.105,y3+Math.sqrt(3)/2*bw*(0.5-wi/200));
		terrainChooseCanvasCtx.lineTo(x3-aw*0.005,y3+Math.sqrt(3)/2*bw*(0.4-wi/200));
		terrainChooseCanvasCtx.closePath();
		terrainChooseCanvasCtx.fill();
		terrainChooseCanvasCtx.stroke();
		if(druza!=undefined){
		terrainChooseCanvasCtx.globalAlpha = 100/140;
		terrainChooseCanvasCtx.fillStyle = kolox(druza,1);
		terrainChooseCanvasCtx.lineWidth = 1;
		terrainChooseCanvasCtx.beginPath();
		terrainChooseCanvasCtx.moveTo(x3-aw*0.105,y3+Math.sqrt(3)/2*bw*0.5);
		terrainChooseCanvasCtx.lineTo(x3+aw*0.105,y3+Math.sqrt(3)/2*bw*0.5);
		terrainChooseCanvasCtx.lineTo(x3+aw*0.105,y3+Math.sqrt(3)/2*bw*(0.5-wi/200));
		terrainChooseCanvasCtx.lineTo(x3-aw*0.105,y3+Math.sqrt(3)/2*bw*(0.5-wi/200));
		terrainChooseCanvasCtx.closePath();
		terrainChooseCanvasCtx.fill();
		terrainChooseCanvasCtx.stroke();
		terrainChooseCanvasCtx.fillStyle = "#999999";
		terrainChooseCanvasCtx.beginPath();
		terrainChooseCanvasCtx.moveTo(x3+aw*0.105,y3+Math.sqrt(3)/2*bw*0.5);
		terrainChooseCanvasCtx.lineTo(x3+aw*0.205,y3+Math.sqrt(3)/2*bw*0.4);
		terrainChooseCanvasCtx.lineTo(x3+aw*0.205,y3+Math.sqrt(3)/2*bw*(0.4-wi/200));
		terrainChooseCanvasCtx.lineTo(x3+aw*0.105,y3+Math.sqrt(3)/2*bw*(0.5-wi/200));
		terrainChooseCanvasCtx.closePath();
		terrainChooseCanvasCtx.fill();
		terrainChooseCanvasCtx.stroke();
		terrainChooseCanvasCtx.fillStyle = "#999999";
		terrainChooseCanvasCtx.beginPath();
		terrainChooseCanvasCtx.moveTo(x3+aw*0.205,y3+Math.sqrt(3)/2*bw*(0.4-wi/200));
		terrainChooseCanvasCtx.lineTo(x3+aw*0.105,y3+Math.sqrt(3)/2*bw*(0.5-wi/200));
		terrainChooseCanvasCtx.lineTo(x3-aw*0.105,y3+Math.sqrt(3)/2*bw*(0.5-wi/200));
		terrainChooseCanvasCtx.lineTo(x3-aw*0.005,y3+Math.sqrt(3)/2*bw*(0.4-wi/200));
		terrainChooseCanvasCtx.closePath();
		terrainChooseCanvasCtx.fill();
		terrainChooseCanvasCtx.stroke();
		terrainChooseCanvasCtx.globalAlpha = 1;
		}

}
function budyt(x3,y3,wel){
		var wi = wel;

		cityPreviewCanvasCtx.strokeStyle = "#666666";
		cityPreviewCanvasCtx.fillStyle = "#BBBBBB";
		cityPreviewCanvasCtx.lineWidth = 1;
		cityPreviewCanvasCtx.beginPath();
		cityPreviewCanvasCtx.moveTo(x3-aw*0.105,y3+Math.sqrt(3)/2*bw*0.5);
		cityPreviewCanvasCtx.lineTo(x3+aw*0.105,y3+Math.sqrt(3)/2*bw*0.5);
		cityPreviewCanvasCtx.lineTo(x3+aw*0.105,y3+Math.sqrt(3)/2*bw*(0.5-wi/200));
		cityPreviewCanvasCtx.lineTo(x3-aw*0.105,y3+Math.sqrt(3)/2*bw*(0.5-wi/200));
		cityPreviewCanvasCtx.closePath();
		cityPreviewCanvasCtx.fill();
		cityPreviewCanvasCtx.stroke();
		cityPreviewCanvasCtx.fillStyle = "#999999";
		cityPreviewCanvasCtx.beginPath();
		cityPreviewCanvasCtx.moveTo(x3+aw*0.105,y3+Math.sqrt(3)/2*bw*0.5);
		cityPreviewCanvasCtx.lineTo(x3+aw*0.205,y3+Math.sqrt(3)/2*bw*0.4);
		cityPreviewCanvasCtx.lineTo(x3+aw*0.205,y3+Math.sqrt(3)/2*bw*(0.4-wi/200));
		cityPreviewCanvasCtx.lineTo(x3+aw*0.105,y3+Math.sqrt(3)/2*bw*(0.5-wi/200));
		cityPreviewCanvasCtx.closePath();
		cityPreviewCanvasCtx.fill();
		cityPreviewCanvasCtx.stroke();
		cityPreviewCanvasCtx.fillStyle = "#999999";
		cityPreviewCanvasCtx.beginPath();
		cityPreviewCanvasCtx.moveTo(x3+aw*0.205,y3+Math.sqrt(3)/2*bw*(0.4-wi/200));
		cityPreviewCanvasCtx.lineTo(x3+aw*0.105,y3+Math.sqrt(3)/2*bw*(0.5-wi/200));
		cityPreviewCanvasCtx.lineTo(x3-aw*0.105,y3+Math.sqrt(3)/2*bw*(0.5-wi/200));
		cityPreviewCanvasCtx.lineTo(x3-aw*0.005,y3+Math.sqrt(3)/2*bw*(0.4-wi/200));
		cityPreviewCanvasCtx.closePath();
		cityPreviewCanvasCtx.fill();
		cityPreviewCanvasCtx.stroke();

		var kox = heks[zaznx][zazny].z;
		if(kox>10){
			kox = 10;
		}
		cityPreviewCanvasCtx.globalAlpha = kox/14;
		cityPreviewCanvasCtx.fillStyle = kolox(kolej,1);
		cityPreviewCanvasCtx.lineWidth = 1;
		cityPreviewCanvasCtx.beginPath();
		cityPreviewCanvasCtx.moveTo(x3-aw*0.105,y3+Math.sqrt(3)/2*bw*0.5);
		cityPreviewCanvasCtx.lineTo(x3+aw*0.105,y3+Math.sqrt(3)/2*bw*0.5);
		cityPreviewCanvasCtx.lineTo(x3+aw*0.105,y3+Math.sqrt(3)/2*bw*(0.5-wi/200));
		cityPreviewCanvasCtx.lineTo(x3-aw*0.105,y3+Math.sqrt(3)/2*bw*(0.5-wi/200));
		cityPreviewCanvasCtx.closePath();
		cityPreviewCanvasCtx.fill();
		cityPreviewCanvasCtx.beginPath();
		cityPreviewCanvasCtx.moveTo(x3+aw*0.105,y3+Math.sqrt(3)/2*bw*0.5);
		cityPreviewCanvasCtx.lineTo(x3+aw*0.205,y3+Math.sqrt(3)/2*bw*0.4);
		cityPreviewCanvasCtx.lineTo(x3+aw*0.205,y3+Math.sqrt(3)/2*bw*(0.4-wi/200));
		cityPreviewCanvasCtx.lineTo(x3+aw*0.105,y3+Math.sqrt(3)/2*bw*(0.5-wi/200));
		cityPreviewCanvasCtx.closePath();
		cityPreviewCanvasCtx.fill();
		cityPreviewCanvasCtx.beginPath();
		cityPreviewCanvasCtx.moveTo(x3+aw*0.205,y3+Math.sqrt(3)/2*bw*(0.4-wi/200));
		cityPreviewCanvasCtx.lineTo(x3+aw*0.105,y3+Math.sqrt(3)/2*bw*(0.5-wi/200));
		cityPreviewCanvasCtx.lineTo(x3-aw*0.105,y3+Math.sqrt(3)/2*bw*(0.5-wi/200));
		cityPreviewCanvasCtx.lineTo(x3-aw*0.005,y3+Math.sqrt(3)/2*bw*(0.4-wi/200));
		cityPreviewCanvasCtx.closePath();
		cityPreviewCanvasCtx.fill();
		cityPreviewCanvasCtx.globalAlpha = 1;
}
function gmp(canv,event){
  var rect = canv.getBoundingClientRect();
 mousePositionByCanvas = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}/*
function gmimj(event){
 mousePositionByCanvas = getMousePos3(event);
}
function gmimb(event){
 mousePositionByCanvas = getMousePos4(event);
}
function gmimd(event){
 mousePositionByCanvas = getMousePos5(event);
}
function gmimd4(event){
 mousePositionByCanvas = getMousePos6(event);
}
function gmimd5(event){
 mousePositionByCanvas = getMousePos7(event);
}
function gmimd6(event){
 mousePositionByCanvas = getMousePos8(event);
}
function gmimd7(event){
 mousePositionByCanvas7 = getMousePos9(event);
}
function getMousePos2(ef) {
  var rect = terrainChooseCanvas.getBoundingClientRect();
  return {
    x: ef.clientX - rect.left,
    y: ef.clientY - rect.top
  };
}
function getMousePos3(ef) {
  var rect = jj.getBoundingClientRect();
  return {
    x: ef.clientX - rect.left,
    y: ef.clientY - rect.top
  };
}
function getMousePos4(ef) {
  var rect = bb.getBoundingClientRect();
  return {
    x: ef.clientX - rect.left,
    y: ef.clientY - rect.top
  };
}
function getMousePos5(ef) {
  var rect = dd.getBoundingClientRect();
  return {
    x: ef.clientX - rect.left,
    y: ef.clientY - rect.top
  };
}
function getMousePos6(ef) {
  var rect = poka4.getBoundingClientRect();
  return {
    x: ef.clientX - rect.left,
    y: ef.clientY - rect.top
  };
}
function getMousePos7(ef) {
  var rect = poka5.getBoundingClientRect();
  return {
    x: ef.clientX - rect.left,
    y: ef.clientY - rect.top
  };
}
function getMousePos8(ef) {
  var rect = poka6.getBoundingClientRect();
  return {
    x: ef.clientX - rect.left,
    y: ef.clientY - rect.top
  };
}
function getMousePos9(ef) {
  var rect = poka7.getBoundingClientRect();
  return {
    x: ef.clientX - rect.left,
    y: ef.clientY - rect.top
  };
}*/
function terrainChooseDraw(){
	terrainChooseCanvasCtx.fillStyle = "#000000";
	terrainChooseCanvasCtx.strokeStyle = "#666666";
	terrainChooseCanvasCtx.lineWidth = 2;
	terrainChooseCanvasCtx.fillRect(0,0,200,50);

	aw = 25;
	bw = 40/Math.sqrt(3);
	tw = 0;
	x2 = 25;
	y2 = 25;
	tu = 0;
	/*terrainChooseCanvasCtx.fillStyle = "#EEEECC";
	terrainChooseCanvasCtx.fillRect(50*ak,0,50,50);*/
	while(tu<4){
		if(tu==1){
			terrainChooseCanvasCtx.fillStyle = "#819AB5";
		} else {
			terrainChooseCanvasCtx.fillStyle = "#98C288";
		}
		if(terrainChooseNumber==tu){
			terrainChooseCanvasCtx.fillStyle = "#EEEECC";
		}
		if(akcja==tu){
			terrainChooseCanvasCtx.fillStyle = "#CCEECC";
		}
		terrainChooseCanvasCtx.beginPath();
		terrainChooseCanvasCtx.moveTo(x2-aw/2,y2-Math.sqrt(3)/2*bw);
		terrainChooseCanvasCtx.lineTo(x2+aw/2,y2-Math.sqrt(3)/2*bw);
		terrainChooseCanvasCtx.lineTo(x2+aw,y2);
		terrainChooseCanvasCtx.lineTo(x2+aw/2,y2+Math.sqrt(3)/2*bw);
		terrainChooseCanvasCtx.lineTo(x2-aw/2,y2+Math.sqrt(3)/2*bw);
		terrainChooseCanvasCtx.lineTo(x2-aw,y2);
		terrainChooseCanvasCtx.closePath();
		terrainChooseCanvasCtx.fill();
		terrainChooseCanvasCtx.stroke();
		if(tu==1){
			ctx.strokeStyle = "#666666";
	terrainChooseCanvasCtx.lineWidth = 2;
	terrainChooseCanvasCtx.beginPath();
	terrainChooseCanvasCtx.moveTo(x2-aw*0.5,y2-Math.sqrt(3)/2*bw*0.5);
	terrainChooseCanvasCtx.lineTo(x2-aw*0.25,y2-Math.sqrt(3)/2*bw*0.75);
	terrainChooseCanvasCtx.lineTo(x2,y2-Math.sqrt(3)/2*bw*0.5);
	terrainChooseCanvasCtx.lineTo(x2+aw*0.25,y2-Math.sqrt(3)/2*bw*0.75);
	terrainChooseCanvasCtx.lineTo(x2+aw*0.5,y2-Math.sqrt(3)/2*bw*0.5);
	terrainChooseCanvasCtx.stroke();
	terrainChooseCanvasCtx.beginPath();
	terrainChooseCanvasCtx.moveTo(x2-aw*0.75,y2-Math.sqrt(3)/2*bw*0);
	terrainChooseCanvasCtx.lineTo(x2-aw*0.5,y2-Math.sqrt(3)/2*bw*0.25);
	terrainChooseCanvasCtx.lineTo(x2-aw*0.25,y2-Math.sqrt(3)/2*bw*0);
	terrainChooseCanvasCtx.lineTo(x2-aw*0,y2-Math.sqrt(3)/2*bw*0.25);
	terrainChooseCanvasCtx.lineTo(x2+aw*0.25,y2-Math.sqrt(3)/2*bw*0);
	terrainChooseCanvasCtx.lineTo(x2+aw*0.5,y2-Math.sqrt(3)/2*bw*0.25);
	terrainChooseCanvasCtx.lineTo(x2+aw*0.75,y2-Math.sqrt(3)/2*bw*0);
	terrainChooseCanvasCtx.stroke();
	terrainChooseCanvasCtx.moveTo(x2-aw*0.5,y2+Math.sqrt(3)/2*bw*0.5);
	terrainChooseCanvasCtx.lineTo(x2-aw*0.25,y2+Math.sqrt(3)/2*bw*0.25);
	terrainChooseCanvasCtx.lineTo(x2,y2+Math.sqrt(3)/2*bw*0.5);
	terrainChooseCanvasCtx.lineTo(x2+aw*0.25,y2+Math.sqrt(3)/2*bw*0.25);
	terrainChooseCanvasCtx.lineTo(x2+aw*0.5,y2+Math.sqrt(3)/2*bw*0.5);
	terrainChooseCanvasCtx.stroke();
		}
		if(tu == 2){

		terrainChooseCanvasCtx.strokeStyle = "#666666";
		terrainChooseCanvasCtx.fillStyle = "#DDDDDD";
		terrainChooseCanvasCtx.lineWidth = 1;
		terrainChooseCanvasCtx.beginPath();
		terrainChooseCanvasCtx.moveTo(x2-aw*0,y2-Math.sqrt(3)/2*bw*1.25);
		terrainChooseCanvasCtx.lineTo(x2+aw*1,y2-Math.sqrt(3)/2*bw*0);
		terrainChooseCanvasCtx.lineTo(x2+aw*0.5,y2+Math.sqrt(3)/2*bw*1);
		terrainChooseCanvasCtx.lineTo(x2-aw*0.5,y2+Math.sqrt(3)/2*bw*1);
		terrainChooseCanvasCtx.lineTo(x2-aw*1,y2-Math.sqrt(3)/2*bw*0);
		terrainChooseCanvasCtx.closePath();
		terrainChooseCanvasCtx.fill();
		terrainChooseCanvasCtx.stroke();
		terrainChooseCanvasCtx.fillStyle = "#FFFFFF";
		terrainChooseCanvasCtx.beginPath();
		terrainChooseCanvasCtx.moveTo(x2-aw*0,y2-Math.sqrt(3)/2*bw*1.25);
		terrainChooseCanvasCtx.lineTo(x2+aw*0.5,y2-Math.sqrt(3)/2*bw*0.625);
		terrainChooseCanvasCtx.lineTo(x2+aw*0,y2-Math.sqrt(3)/2*bw*0.25);
		terrainChooseCanvasCtx.lineTo(x2-aw*0.5,y2-Math.sqrt(3)/2*bw*0.625);
		terrainChooseCanvasCtx.fill();

		terrainChooseCanvasCtx.fillStyle = "#888888";
		terrainChooseCanvasCtx.globalAlpha = 0.3;
		terrainChooseCanvasCtx.beginPath();
		terrainChooseCanvasCtx.moveTo(x2-aw*0,y2-Math.sqrt(3)/2*bw*1.25);
		terrainChooseCanvasCtx.lineTo(x2+aw*1,y2-Math.sqrt(3)/2*bw*0);
		terrainChooseCanvasCtx.lineTo(x2+aw*0.5,y2+Math.sqrt(3)/2*bw*1);
		terrainChooseCanvasCtx.closePath();
		terrainChooseCanvasCtx.fill();
		terrainChooseCanvasCtx.globalAlpha = 1;
		terrainChooseCanvasCtx.lineWidth = 2;
		}
	if(tu == 3){
		defic = 0;
		ofz = wielkul*2;
		if(ofz>0 && ofz<=200){
			budyd(x2-0.125*aw,y2,ofz/2);
			budyd(x2+0.125*aw,y2,ofz/2);
		} else if(ofz<=700){
			if(ofz/5-40<30){
				defic = 30-ofz/5+40;
			}
			budyd(x2-0.375*aw,y2,ofz/5-40+defic*3/2);
			budyd(x2-0.125*aw,y2,ofz/5+60-defic*2/3);
			budyd(x2+0.125*aw,y2,ofz/5+60-defic*2/3);
			budyd(x2+0.375*aw,y2,ofz/5-40+defic*3/2);

			budyd(x2,y2+0.125*bw,ofz/5-40+defic*3/2);

		} else if(ofz<1350){
			if(ofz*2/13-1200/13<30){
				defic = 30-ofz*2/13+1200/13;
			}
			budyd(x2-0.25*aw,y2-0.125*bw,ofz*2/13-1200/13+defic*3/2);
			budyd(x2,y2-0.125*bw,ofz*2/13-1200/13+defic*3/2);
			budyd(x2+0.25*aw,y2-0.125*bw,ofz*2/13-1200/13+defic*3/2);

			budyd(x2-0.375*aw,y2,ofz/13+600/13);
			budyd(x2-0.125*aw,y2,ofz*2/13+1200/13-defic*2/3);
			budyd(x2+0.125*aw,y2,ofz*2/13+1200/13-defic*2/3);
			budyd(x2+0.375*aw,y2,ofz/13+600/13);

			budyd(x2,y2+0.125*bw,ofz/13+600/13);
		} else {
			if(ofz/7-1350/7<40){
				defic = 40-ofz/7+1350/7;
			}
			budyd(x2-0.5*aw,y2-0.125*bw,ofz/7-1350/7+defic*3/4);
			budyd(x2-0.25*aw,y2-0.125*bw,ofz*2/21-200/7);
			budyd(x2,y2-0.125*bw,ofz*2/21-200/7);
			budyd(x2+0.25*aw,y2-0.125*bw,ofz*2/21-200/7);
			budyd(x2+0.5*aw,y2-0.125*bw,ofz/7-1350/7+defic*3/4);

			budyd(x2-0.375*aw,y2,ofz*2/21+150/7-defic*4/3);
			budyd(x2-0.125*aw,y2,300);
			budyd(x2+0.125*aw,y2,300);
			budyd(x2+0.375*aw,y2,ofz*2/21+150/7-defic*4/3);

			budyd(x2-0.25*aw,y2+0.125*bw,ofz/7-1350/7+defic*3/4);
			budyd(x2,y2+0.125*bw,ofz*2/21+150/7-defic*4/3);
			budyd(x2+0.25*aw,y2+0.125*bw,ofz/7-1350/7+defic*3/4);
		}
		if(wielkuliron>0){
			budyd(x2-0.5*au,y2+0.125*bu,wielkuliron/2,12);
		}
		if(wielkulprod>0){
			budyd(x2+0.5*au,y2+0.125*bu,wielkulprod/2,13);
		}
	}
		x2+=50;
		tu++;
	}

}
function teamChooseDraw(){
	generic_teamChooseDraw(teamChooseCanvasCtx,teamChooseNumber)
}
function teamChoose2Draw(){
	generic_teamChooseDraw(teamChoose2CanvasCtx,teamChoose2Number)
}
function generic_teamChooseDraw(context,number){
	context.fillStyle = "#FFFFFF";
	context.strokeStyle = "#666666";
	context.fillRect(0,0,200,150);
	context.lineWidth = 2;
	var aq = 0;
	var bq = 0;
	var xg = 0;
	var yg = 0;
	while(aq<3){
		bq = 0;
		while(bq<4){
			dtr = aq*4+bq;
			xg = bq*50+25;
			yg = aq*50+25;
			context.fillStyle = kolox(dtr,0);
			context.strokeStyle = kolox(dtr,0);
			context.fillRect(bq*50,aq*50,50,50);
			context.fillStyle = kolox(dtr,1);
			context.fillRect(bq*50+2,aq*50+2,46,46);
			if(dru[dtr]==0){
				context.beginPath();
				context.moveTo(xg-15,yg-15);
				context.lineTo(xg+15,yg+15);
				context.closePath();
				context.stroke();
				context.beginPath();
				context.moveTo(xg+15,yg-15);
				context.lineTo(xg-15,yg+15);
				context.closePath();
				context.stroke();
			} else if(dru[dtr]==-1){
				yg-=2;
				context.strokeRect(xg-5,yg-15,10,10)
				context.strokeRect(xg-10,yg-5,20,15)
				context.strokeRect(xg-18,yg-5,8,5)
				context.strokeRect(xg+10,yg-5,8,5)
				context.strokeRect(xg-8,yg+10,5,10)
				context.strokeRect(xg+3,yg+10,5,10)
			} else if(dru[dtr]==1){
				yg-=2;
				context.beginPath();
				context.arc(xg,yg-10,5,Math.PI*2,false);
				context.stroke();
				context.beginPath();
				context.moveTo(xg,yg-5);
				context.lineTo(xg-10,yg+5);
				context.lineTo(xg,yg-5);
				context.lineTo(xg+10,yg+5);
				context.lineTo(xg,yg-5);
				context.lineTo(xg,yg+5);
				context.lineTo(xg-10,yg+20);
				context.lineTo(xg,yg+5);
				context.lineTo(xg+10,yg+20);
				context.stroke();
			} else if(dru[dtr]>1){
				context.beginPath();
				switch(dru[dtr]){
				case 2:
				context.moveTo(xg+5,yg-10);
				context.lineTo(xg-5,yg-10);
				context.lineTo(xg,yg-10);
				context.lineTo(xg,yg-20);
				context.lineTo(xg,yg-17);
				context.lineTo(xg-5,yg-17);
				context.stroke();
				break;
				case 3:
				context.moveTo(xg-5,yg-17);
				context.lineTo(xg-5,yg-20);
				context.lineTo(xg+5,yg-20);
				context.lineTo(xg+5,yg-17);
				context.lineTo(xg-5,yg-10);
				context.lineTo(xg+6,yg-10);
				context.stroke();
				break;
				case 4:
				context.moveTo(xg-5,yg-17);
				context.lineTo(xg-5,yg-20);
				context.lineTo(xg+5,yg-20);
				context.lineTo(xg+5,yg-17);
				context.lineTo(xg+3,yg-15);
				context.lineTo(xg,yg-15);
				context.lineTo(xg+3,yg-15);
				context.lineTo(xg+5,yg-12);
				context.lineTo(xg+5,yg-10);
				context.lineTo(xg-5,yg-10);
				context.lineTo(xg-5,yg-12);
				context.stroke();
				break;
				case 5:
				context.moveTo(xg-5,yg-20);
				context.lineTo(xg-5,yg-15);
				context.lineTo(xg+5,yg-15);
				context.lineTo(xg+3,yg-15);
				context.lineTo(xg+3,yg-17);
				context.lineTo(xg+3,yg-10);
				context.stroke();
				break;
				case 6:
				context.moveTo(xg+5,yg-20);
				context.lineTo(xg-5,yg-20);
				context.lineTo(xg-5,yg-15);
				context.lineTo(xg+3,yg-15);
				context.lineTo(xg+5,yg-12);
				context.lineTo(xg+3,yg-10);
				context.lineTo(xg-5,yg-10);
				context.stroke();
				break;
				}

				context.strokeRect(xg-15,yg-5,30,20);
				context.strokeRect(xg-11,yg-1,7,7);
				context.strokeRect(xg+4,yg-1,7,7);
				context.strokeRect(xg-11,yg+10,22,1);
			}
			if(dtr == number){
				context.globalAlpha = 0.5;
				context.fillStyle = "#FFFFFF";
				context.fillRect(bq*50,aq*50,50,50);
				context.globalAlpha = 1;
			}
			bq++;
		}
		aq++;
	}
}
function pokap(){
	redrawCanvas(teamPreview4CanvasCtx);
	redrawCanvas(teamPreview2CanvasCtx);
	redrawCanvas(teamPreviewCanvasCtx);
	redrawCanvas(klepsydraPreviewCanvasCtx);
	redrawCanvas(statisticsCanvasCtx);
	redrawCanvas(statisticsCanvasCtx2);
	redrawCanvas(statisticsCanvasCtx3);
	teamName.value = defdr[kolej];
	teamName2.innerHTML = defdr[kolej];
	teamName4.innerHTML = defdr[kolej];
	if(dru[kolej]==1)
		endturn.disabled = false;
	else
		endturn.disabled = true;
	
	if(zaznu!=-1){
		redrawCanvas(teamPreview3CanvasCtx);
		teamName3.innerHTML = defdr[kolej];
		if(unix[kolej][zaznu].il>=80){
			unitTypeField.innerHTML = languagewise({'pl':defodd1[unix[kolej][zaznu].rodz],'en':defodd1en[unix[kolej][zaznu].rodz]});

		} else if(unix[kolej][zaznu].il>=30){
			unitTypeField.innerHTML = languagewise({'pl':defodd2[unix[kolej][zaznu].rodz],'en':defodd2en[unix[kolej][zaznu].rodz]});
		} else if(unix[kolej][zaznu].il>=10){
			unitTypeField.innerHTML = languagewise({'pl':defodd3[unix[kolej][zaznu].rodz],'en':defodd3en[unix[kolej][zaznu].rodz]});

		} else if(unix[kolej][zaznu].il>=4){
			unitTypeField.innerHTML = languagewise({'pl':defodd4[unix[kolej][zaznu].rodz],'en':defodd4en[unix[kolej][zaznu].rodz]});

		} else {
			unitTypeField.innerHTML = languagewise({'pl':defodd5[unix[kolej][zaznu].rodz],'en':defodd5en[unix[kolej][zaznu].rodz]});

		}
		if(szyt[unix[kolej][zaznu].rodz]!="l" && unix[kolej][zaznu].szyt=="l"){
			unitTypeField.innerHTML += languagewise({'pl':" (oddział transportowany)",'en':" (unit transported by air)"});
		}
		if(szyt[unix[kolej][zaznu].rodz]!="w" && unix[kolej][zaznu].szyt=="w"){
			unitTypeField.innerHTML += languagewise({'pl':" (oddział wodowany)",'en':" (transported unit)"});
		}
		if(unix[kolej][zaznu].szyt=="l" && heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].z>0){
			remindField.innerHTML = languagewise({'pl':"<br/><b>UWAGA!</b> Lotnictwo i oddziały transportowane mogą zostać zniszczone w mieście przez zwykłą artylerię/okręty!",'en':'<br/><b>ATTENTION!</b> Aircrafts and units transported by air can be destroyed in a city by the land artillery and warshipt!!'});
		} else {
			remindField.innerHTML = "";
		}
		var engineersField = document.getElementById("engineersField");
		if(zast[unix[kolej][zaznu].rodz]=="m" && unix[kolej][zaznu].szyt==szyt[unix[kolej][zaznu].rodz]){
			var createCityButton = document.getElementById("createCityButton");
			engineersField.style.display = "block";
			if(unix[kolej][zaznu].il<=50){
				createCityButton.disabled = true;
			} else {
				createCityButton.disabled = false;
			}
		} else {
			engineersField.style.display = "none";
		}
		redrawCanvas(unitMergeCanvasCtx);
	}
	if(zaznx!=-1){
		redrawCanvas(cityPreviewCanvasCtx);
		redrawCanvas(unitsInCityCanvasCtx);
		redrawCanvas(createUnitCanvasCtx);
		redrawCanvas(upgradeCityCanvasCtx);
		var cityTeam = document.getElementById("cityTeam");
		cityTeam.innerHTML = defdr[kolej];
		var sciag = Math.floor(dohod(zaznx,zazny)*(100-heks[zaznx][zazny].podatpr)/100);
		var sk = 0;
		while(sk<heks[zaznx][zazny].trybutariuszy){
			var on = heks[zaznx][zazny].trybutariusze[sk];
			sciag+=Math.floor(dohod(on[0],on[1])*(heks[on[0]][on[1]].podatpr/100));
			sk++;
		}
		var moneyAmount = document.getElementById("moneyAmount");
		moneyAmount.innerHTML = languagewise({'pl':"Budżet: ",'en':"Budget: "})+heks[zaznx][zazny].kasy+"$ (+"+sciag+"$";

		moneyAmount.innerHTML+=")";
		steelAmount.innerHTML = languagewise({'pl':"Zasoby stali: ",'en':"Steel reserves: "})+heks[zaznx][zazny].stali+"t (+"+heks[zaznx][zazny].hutn+"t)";
		taxRange.value = heks[zaznx][zazny].podatpr;
		var taxValue = document.getElementById("taxValue");
		taxValue.innerHTML = languagewise({'pl':"Podatek: (obecnie ",'en':"Tax: (currently "})+heks[zaznx][zazny].podatpr+"%)";
		changeRangeInput(taxRangeValue,taxRange.value);
		changeRangeInput(newUnitSizeValue,newUnitSizeRange.value);
	}
	
	historiaTuraSpan.innerHTML = historyDex.showcaseTurn
	historiaDruzynaSpan.innerHTML = defdr[historyDex.showcaseKolej]
	historiaDruzynaSpan.style.color = kolox(historyDex.showcaseKolej,0)
	historiaDruzynaSpan.style.backgroundColor = kolox(historyDex.showcaseKolej,1)
	historiaDruzynaSpan.style.border = '2px solid '+kolox(historyDex.showcaseKolej,0)
	historiaDruzynaSpan.style.padding = '3px'
	historiaRuchSpan.innerHTML = historyDex.showcaseMove
	historyPlej.value = playing ? '⏸' : '▶'
}
function redrawCanvas(rtx){
	if(dru[kolej]!=0 || rtx==teamPreviewCanvasCtx || rtx==teamPreview2CanvasCtx || rtx==teamPreview3CanvasCtx || rtx==teamPreview4CanvasCtx || rtx == klepsydraPreviewCanvasCtx){
	dtr = kolej;
	if(zaznu!=-1){
		dth = unix[kolej][zaznu].rodz;
		dti = unix[kolej][zaznu].il;
	} else {
		dti = -1;
	}
	var aq = 0;
	var bq = 0;
	var xg = 25;
	var yg = 25;
	var sx = 24;
	var sy = 16;
	switch(rtx){
		case klepsydraPreviewCanvasCtx:
			
			rtx.lineWidth = 2;
			rtx.fillStyle = '#554';
			rtx.strokeStyle = '#554';
			rtx.fillRect(bq*50,aq*50,50,50);
			rtx.fillStyle = '#aa8';
			rtx.fillRect(bq*50+2,aq*50+2,46,46);
			
			rtx.fillStyle = '#554';
			rtx.strokeRect(xg-15,yg-15,30,3);
			rtx.fillRect(xg-15,yg-15,30,3);
			rtx.strokeRect(xg-15,yg+12,30,3);
			rtx.fillRect(xg-15,yg+12,30,3);
			
			rtx.beginPath();
			rtx.moveTo(xg-15,yg-15);
			rtx.lineTo(xg-15,yg-8);
			rtx.lineTo(xg+15,yg+8);
			rtx.lineTo(xg+15,yg+15);
			rtx.stroke();
			rtx.beginPath();
			rtx.moveTo(xg+15,yg-15);
			rtx.lineTo(xg+15,yg-8);
			rtx.lineTo(xg-15,yg+8);
			rtx.lineTo(xg-15,yg+15);
			rtx.stroke();
			
			rtx.beginPath();
			rtx.moveTo(xg,yg);
			rtx.lineTo(xg-8,yg-5);
			rtx.lineTo(xg+8,yg-5);
			rtx.stroke();
			rtx.fill();
			rtx.beginPath();
			rtx.moveTo(xg,yg+5);
			rtx.lineTo(xg,yg);
			rtx.lineTo(xg,yg+5);
			rtx.lineTo(xg-12,yg+12);
			rtx.lineTo(xg+12,yg+12);
			rtx.stroke();
			rtx.fill();
			break
		case teamPreview4CanvasCtx:
		case teamPreview2CanvasCtx:
		case teamPreviewCanvasCtx:
			rtx.lineWidth = 2;
			rtx.fillStyle = kolox(dtr,0);
			rtx.strokeStyle = kolox(dtr,0);
			rtx.fillRect(bq*50,aq*50,50,50);
			rtx.fillStyle = kolox(dtr,1);
			rtx.fillRect(bq*50+2,aq*50+2,46,46);
			if(dru[dtr]==0){
				rtx.beginPath();
				rtx.moveTo(xg-15,yg-15);
				rtx.lineTo(xg+15,yg+15);
				rtx.closePath();
				rtx.stroke();
				rtx.beginPath();
				rtx.moveTo(xg+15,yg-15);
				rtx.lineTo(xg-15,yg+15);
				rtx.closePath();
				rtx.stroke();
			} else if(dru[dtr]==-1){
				yg-=2;
				rtx.strokeRect(xg-5,yg-15,10,10)
				rtx.strokeRect(xg-10,yg-5,20,15)
				rtx.strokeRect(xg-18,yg-5,8,5)
				rtx.strokeRect(xg+10,yg-5,8,5)
				rtx.strokeRect(xg-8,yg+10,5,10)
				rtx.strokeRect(xg+3,yg+10,5,10)
			} else if(dru[dtr]==1){
				yg-=2;
				rtx.beginPath();
				rtx.arc(xg,yg-10,5,Math.PI*2,false);
				rtx.stroke();
				rtx.beginPath();
				rtx.moveTo(xg,yg-5);
				rtx.lineTo(xg-10,yg+5);
				rtx.lineTo(xg,yg-5);
				rtx.lineTo(xg+10,yg+5);
				rtx.lineTo(xg,yg-5);
				rtx.lineTo(xg,yg+5);
				rtx.lineTo(xg-10,yg+20);
				rtx.lineTo(xg,yg+5);
				rtx.lineTo(xg+10,yg+20);
				rtx.stroke();
			} else  if(dru[dtr]>1){
				rtx.beginPath();
				switch(dru[dtr]){
				case 2:
				rtx.moveTo(xg+5,yg-10);
				rtx.lineTo(xg-5,yg-10);
				rtx.lineTo(xg,yg-10);
				rtx.lineTo(xg,yg-20);
				rtx.lineTo(xg,yg-17);
				rtx.lineTo(xg-5,yg-17);
				rtx.stroke();
				break;
				case 3:
				rtx.moveTo(xg-5,yg-17);
				rtx.lineTo(xg-5,yg-20);
				rtx.lineTo(xg+5,yg-20);
				rtx.lineTo(xg+5,yg-17);
				rtx.lineTo(xg-5,yg-10);
				rtx.lineTo(xg+6,yg-10);
				rtx.stroke();
				break;
				case 4:
				rtx.moveTo(xg-5,yg-17);
				rtx.lineTo(xg-5,yg-20);
				rtx.lineTo(xg+5,yg-20);
				rtx.lineTo(xg+5,yg-17);
				rtx.lineTo(xg+3,yg-15);
				rtx.lineTo(xg,yg-15);
				rtx.lineTo(xg+3,yg-15);
				rtx.lineTo(xg+5,yg-12);
				rtx.lineTo(xg+5,yg-10);
				rtx.lineTo(xg-5,yg-10);
				rtx.lineTo(xg-5,yg-12);
				rtx.stroke();
				break;
				case 5:
				rtx.moveTo(xg-5,yg-20);
				rtx.lineTo(xg-5,yg-15);
				rtx.lineTo(xg+5,yg-15);
				rtx.lineTo(xg+3,yg-15);
				rtx.lineTo(xg+3,yg-17);
				rtx.lineTo(xg+3,yg-10);
				rtx.stroke();
				break;
				case 6:
				rtx.moveTo(xg+5,yg-20);
				rtx.lineTo(xg-5,yg-20);
				rtx.lineTo(xg-5,yg-15);
				rtx.lineTo(xg+3,yg-15);
				rtx.lineTo(xg+5,yg-12);
				rtx.lineTo(xg+3,yg-10);
				rtx.lineTo(xg-5,yg-10);
				rtx.stroke();
				break;
				}

				rtx.strokeRect(xg-15,yg-5,30,20);
				rtx.strokeRect(xg-11,yg-1,7,7);
				rtx.strokeRect(xg+4,yg-1,7,7);
				rtx.strokeRect(xg-11,yg+10,22,1);
			}
		break;
		case teamPreview3CanvasCtx:

			rtx.fillStyle = kolox(kolej,1);
			rtx.strokeStyle = kolox(kolej,0);
			rtx.fillRect(xg-24,yg-16,48,32);
				rtx.globalAlpha = 1-dti/100;
				rtx.fillStyle = "#FFFFFF";
				rtx.fillRect(xg-24,yg-16,48,32);
				rtx.globalAlpha = 1;
				rtx.strokeRect(xg-24,yg-16,48,32);
			switch(dth){
				case 0:
				rtx.beginPath();
				rtx.moveTo(xg-sx,yg-sy);
				rtx.lineTo(xg+sx,yg+sy);
				rtx.closePath();
				rtx.stroke();
				rtx.beginPath();
				rtx.moveTo(xg-sx,yg+sy);
				rtx.lineTo(xg+sx,yg-sy);
				rtx.closePath();
				rtx.stroke();

				break;
				case 1:
				rtx.beginPath();
				rtx.arc(xg-sx/3, yg, sy/2, Math.PI/2, Math.PI*3/2, false);
				rtx.lineTo(xg+sx/3,yg-sy/2);
				rtx.arc(xg+sx/3, yg, sy/2, Math.PI*3/2, Math.PI/2, false);
				rtx.closePath();
				rtx.stroke();
				break;
				case 2:
				rtx.beginPath();
				rtx.arc(xg, yg, sy/3, 0, 2*Math.PI, false);
				rtx.closePath();
				if(dth!=akcja){
					rtx.fillStyle = kolox(dtr,0);
				} else {
					rtx.fillStyle = "#FFFF00";
				}
				rtx.fill();
				rtx.fillStyle = kolox(dtr,1);

				break;
				case 3:
				rtx.beginPath();
				rtx.moveTo(xg-sx,yg-sy);
				rtx.lineTo(xg+sx,yg+sy);
				rtx.closePath();
				rtx.stroke();
				rtx.beginPath();
				rtx.moveTo(xg-sx,yg+sy);
				rtx.lineTo(xg+sx,yg-sy);
				rtx.closePath();
				rtx.stroke();
				rtx.beginPath();
				rtx.moveTo(xg,yg+sy);
				rtx.lineTo(xg,yg-sy);
				rtx.closePath();
				rtx.stroke();

				break;
				case 4:
				rtx.beginPath();
				rtx.moveTo(xg-sx,yg-sy);
				rtx.lineTo(xg+sx,yg+sy);
				rtx.closePath();
				rtx.stroke();
				rtx.beginPath();
				rtx.moveTo(xg-sx,yg+sy);
				rtx.lineTo(xg+sx,yg-sy);
				rtx.closePath();
				rtx.stroke();
				rtx.beginPath();
				rtx.moveTo(xg,yg+sy/3);
				rtx.lineTo(xg-sx/2,yg+sy);
				rtx.lineTo(xg+sx/2,yg+sy);
				rtx.closePath();
				if(dth!=akcja){
					rtx.fillStyle = kolox(dtr,0);
				} else {
					rtx.fillStyle = "#FFFF00";
				}
				rtx.fill();
				rtx.fillStyle = kolox(dtr,1);

				break;
				case 5:
				rtx.beginPath();
				rtx.arc(xg, yg+sx+sy, sx*Math.sqrt(2), Math.PI*1.25, Math.PI*1.75, false);
				rtx.closePath();
				rtx.stroke();

				break;
				case 6:
				rtx.beginPath();
				rtx.arc(xg, yg-sy*0.25, sy/10, 0, Math.PI*2, false);
				rtx.closePath();
				rtx.stroke();

				rtx.beginPath();
				rtx.moveTo(xg,yg-sy*0.15);
				rtx.lineTo(xg,yg-sy*0.1);
				rtx.lineTo(xg-sy*0.15,yg-sy*0.1);
				rtx.lineTo(xg+sy*0.1,yg-sy*0.1);
				rtx.lineTo(xg,yg-sy*0.15);
				rtx.lineTo(xg,yg+sy*0.15);
				rtx.stroke();

				rtx.beginPath();
				rtx.arc(xg-sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
				rtx.lineTo(xg-sy*0.3, yg+sy*0.05);
				rtx.stroke();

				rtx.beginPath();
				rtx.moveTo(xg-sy*0.3, yg+sy*0.05);
				rtx.lineTo(xg-sy*0.4, yg+sy*0.2);
				rtx.lineTo(xg-sy*0.3, yg+sy*0.05);
				rtx.lineTo(xg-sy*0.2, yg+sy*0.2);
				rtx.stroke();

				rtx.beginPath();
				rtx.arc(xg+sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
				//rtx.lineTo(xg+sy*0.3, yg+sy*0.05);
				rtx.stroke();

				rtx.beginPath();
				rtx.moveTo(xg+sy*0.3, yg+sy*0.05);
				rtx.lineTo(xg+sy*0.2, yg+sy*0.2);
				rtx.lineTo(xg+sy*0.3, yg+sy*0.05);
				rtx.lineTo(xg+sy*0.4, yg+sy*0.2);
				rtx.stroke();

				break;
				case 7:

				rtx.beginPath();
				rtx.arc(xg-sx/3, yg, sy/2, Math.PI/2, Math.PI*3/2, false);
				rtx.lineTo(xg+sx/3,yg-sy/2);
				rtx.arc(xg+sx/3, yg, sy/2, Math.PI*3/2, Math.PI/2, false);
				rtx.closePath();
				rtx.stroke();

				rtx.beginPath();
				rtx.arc(xg, yg-sy*0.25, sy/10, 0, Math.PI*2, false);
				rtx.closePath();
				rtx.stroke();

				rtx.beginPath();
				rtx.moveTo(xg,yg-sy*0.15);
				rtx.lineTo(xg,yg-sy*0.1);
				rtx.lineTo(xg-sy*0.15,yg-sy*0.1);
				rtx.lineTo(xg+sy*0.1,yg-sy*0.1);
				rtx.lineTo(xg,yg-sy*0.15);
				rtx.lineTo(xg,yg+sy*0.15);
				rtx.stroke();

				rtx.beginPath();
				rtx.arc(xg-sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
				rtx.lineTo(xg-sy*0.3, yg+sy*0.05);
				rtx.stroke();

				rtx.beginPath();
				rtx.moveTo(xg-sy*0.3, yg+sy*0.05);
				rtx.lineTo(xg-sy*0.4, yg+sy*0.2);
				rtx.lineTo(xg-sy*0.3, yg+sy*0.05);
				rtx.lineTo(xg-sy*0.2, yg+sy*0.2);
				rtx.stroke();

				rtx.beginPath();
				rtx.arc(xg+sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
				//rtx.lineTo(xg+sy*0.3, yg+sy*0.05);
				rtx.stroke();

				rtx.beginPath();
				rtx.moveTo(xg+sy*0.3, yg+sy*0.05);
				rtx.lineTo(xg+sy*0.2, yg+sy*0.2);
				rtx.lineTo(xg+sy*0.3, yg+sy*0.05);
				rtx.lineTo(xg+sy*0.4, yg+sy*0.2);
				rtx.stroke();


				break;
				case 8:
				rtx.beginPath();
				rtx.arc(xg-sx, yg+sy*13/16, sy*3/16, Math.PI/2, 0, true);
				rtx.arc(xg-sx+(sy*3/8), yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				rtx.arc(xg-sx+(sy*3/8)*2, yg+sy*13/16, sy*3/16, Math.PI, 0, true);
				rtx.arc(xg-sx+(sy*3/8)*3, yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				rtx.arc(xg-sx+(sy*3/8)*4, yg+sy*13/16, sy*3/16, Math.PI, 0, true);
				rtx.arc(xg-sx+(sy*3/8)*5, yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				rtx.arc(xg-sx+(sy*3/8)*6, yg+sy*13/16, sy*3/16, Math.PI, 0, true);
				rtx.arc(xg-sx+(sy*3/8)*7, yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				rtx.arc(xg-sx+(sy*3/8)*8, yg+sy*13/16, sy*3/16, Math.PI, 0, true);

				rtx.stroke();

				break;
				case 9:

				rtx.beginPath();
				rtx.arc(xg-sx/2, yg, sy/3, Math.PI/3, Math.PI*5/3, false);
				//rtx.lineTo(xg+sx/3,yg-sy/2);
				rtx.arc(xg+sx/2, yg, sy/3, Math.PI*2/3, Math.PI*4/3, true);
				rtx.closePath();
				rtx.stroke();
				break;
				case 10:

				rtx.beginPath();
				rtx.moveTo(xg-sx/4,yg-sy*3/4);
				rtx.lineTo(xg,yg-sy/3);
				rtx.lineTo(xg+sx/4,yg-sy*3/4);
				rtx.stroke();
				break;
				case 11:
				rtx.beginPath();
				rtx.moveTo(xg-sx/2,yg-sy*3/5);
				rtx.lineTo(xg-sx/3,yg-sy/5);
				rtx.lineTo(xg+sx/3,yg-sy/5);
				rtx.lineTo(xg+sx/2,yg-sy*3/5);
				rtx.stroke();
				rtx.beginPath();
				rtx.moveTo(xg-sx/2,yg+sy*3/5);
				rtx.lineTo(xg-sx/3,yg+sy/5);
				rtx.lineTo(xg+sx/3,yg+sy/5);
				rtx.lineTo(xg+sx/2,yg+sy*3/5);
				rtx.stroke();
				break;

			}
			if(dth!=6 && dth!=7 && dth!=8 && unix[kolej][zaznu].szyt=="w"){
				rtx.beginPath();
				rtx.arc(xg-sx, yg+sy*13/16, sy*3/16, Math.PI/2, 0, true);
				rtx.arc(xg-sx+(sy*3/8), yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				rtx.arc(xg-sx+(sy*3/8)*2, yg+sy*13/16, sy*3/16, Math.PI, 0, true);
				rtx.arc(xg-sx+(sy*3/8)*3, yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				rtx.arc(xg-sx+(sy*3/8)*4, yg+sy*13/16, sy*3/16, Math.PI, 0, true);
				rtx.arc(xg-sx+(sy*3/8)*5, yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				rtx.arc(xg-sx+(sy*3/8)*6, yg+sy*13/16, sy*3/16, Math.PI, 0, true);
				rtx.arc(xg-sx+(sy*3/8)*7, yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				rtx.arc(xg-sx+(sy*3/8)*8, yg+sy*13/16, sy*3/16, Math.PI, 0, true);

				rtx.stroke();
			}
			rtx.fillStyle = "#FFFFFF";
			rtx.fillStyle = "#444444";
			rtx.fillRect(xg-sx,yg+sy*0.1,sy*1.1,sy*0.9);
			//unitChoiceCanvasCtx.strokeRect(xg-24,yg-16,48,32);
			rtx.font = Math.floor(sy*0.8)+'pt Calibri';
			rtx.textAlign = "left";
			rtx.fillStyle = "#FFFFFF";
      		rtx.fillText(dti, xg-sx, yg+sy*0.9);
		break;
		case cityPreviewCanvasCtx:

		aw = 25;
		bw = 40/Math.sqrt(3);
		tw = 0;
		x2 = 25;
		y2 = 25;
		tu = 0;
		defic = 0;
		ofz = heks[zaznx][zazny].z*2;

		rtx.fillStyle = "#98C288";

		rtx.beginPath();
		rtx.moveTo(x2-aw/2,y2-Math.sqrt(3)/2*bw);
		rtx.lineTo(x2+aw/2,y2-Math.sqrt(3)/2*bw);
		rtx.lineTo(x2+aw,y2);
		rtx.lineTo(x2+aw/2,y2+Math.sqrt(3)/2*bw);
		rtx.lineTo(x2-aw/2,y2+Math.sqrt(3)/2*bw);
		rtx.lineTo(x2-aw,y2);
		rtx.closePath();
		rtx.fill();
		rtx.stroke();

		if(ofz>0 && ofz<=200){
			budyt(x2-0.125*aw,y2,ofz/2);
			budyt(x2+0.125*aw,y2,ofz/2);
		} else if(ofz<=700){
			if(ofz/5-40<30){
				defic = 30-ofz/5+40;
			}
			budyt(x2-0.375*aw,y2,ofz/5-40+defic*3/2);
			budyt(x2-0.125*aw,y2,ofz/5+60-defic*2/3);
			budyt(x2+0.125*aw,y2,ofz/5+60-defic*2/3);
			budyt(x2+0.375*aw,y2,ofz/5-40+defic*3/2);

			budyt(x2,y2+0.125*bw,ofz/5-40+defic*3/2);

		} else if(ofz<1350){
			if(ofz*2/13-1200/13<30){
				defic = 30-ofz*2/13+1200/13;
			}
			budyt(x2-0.25*aw,y2-0.125*bw,ofz*2/13-1200/13+defic*3/2);
			budyt(x2,y2-0.125*bw,ofz*2/13-1200/13+defic*3/2);
			budyt(x2+0.25*aw,y2-0.125*bw,ofz*2/13-1200/13+defic*3/2);

			budyt(x2-0.375*aw,y2,ofz/13+600/13);
			budyt(x2-0.125*aw,y2,ofz*2/13+1200/13-defic*2/3);
			budyt(x2+0.125*aw,y2,ofz*2/13+1200/13-defic*2/3);
			budyt(x2+0.375*aw,y2,ofz/13+600/13);

			budyt(x2,y2+0.125*bw,ofz/13+600/13);
		} else {
			if(ofz/7-1350/7<40){
				defic = 40-ofz/7+1350/7;
			}
			budyt(x2-0.5*aw,y2-0.125*bw,ofz/7-1350/7+defic*3/4);
			budyt(x2-0.25*aw,y2-0.125*bw,ofz*2/21-200/7);
			budyt(x2,y2-0.125*bw,ofz*2/21-200/7);
			budyt(x2+0.25*aw,y2-0.125*bw,ofz*2/21-200/7);
			budyt(x2+0.5*aw,y2-0.125*bw,ofz/7-1350/7+defic*3/4);

			budyt(x2-0.375*aw,y2,ofz*2/21+150/7-defic*4/3);
			budyt(x2-0.125*aw,y2,300);
			budyt(x2+0.125*aw,y2,300);
			budyt(x2+0.375*aw,y2,ofz*2/21+150/7-defic*4/3);

			budyt(x2-0.25*aw,y2+0.125*bw,ofz/7-1350/7+defic*3/4);
			budyt(x2,y2+0.125*bw,ofz*2/21+150/7-defic*4/3);
			budyt(x2+0.25*aw,y2+0.125*bw,ofz/7-1350/7+defic*3/4);
		}
		break;
		case unitsInCityCanvasCtx:
				rtx.fillStyle = "#000000";
				rtx.fillRect(0,0,220,220);
				rtx.lineWidth = 2;
			a = 0;
			while(a<4){
				var nui = 3-a;
				if(zaznx>-1 && nui<heks[zaznx][zazny].unp){
					rtx.fillStyle = "#CCCCCC";
					rtx.fillRect(10,10+a*30,200,30);
					if(unitsInCityNumber==a){
						rtx.fillStyle = "#FFFFFF";
						rtx.globalAlpha = 0.6;
						rtx.fillRect(10,10+a*30,200,30);
						rtx.globalAlpha = 1;
					}
					rysunicik(32,26+a*30,rtx,nui,6,heks[zaznx][zazny].unt[nui]);
					if(unix[kolej][heks[zaznx][zazny].unt[nui]].rozb>0){
						rtx.font = '10pt Trebuchet MS';
						rtx.fillStyle = "#006666";
						rtx.textAlign = "right";
						rtx.fillText("+"+unix[kolej][heks[zaznx][zazny].unt[nui]].rozb,190,28+a*30);
					}
					if(unix[kolej][heks[zaznx][zazny].unt[nui]].ruchy > 0 || unix[kolej][heks[zaznx][zazny].unt[nui]].celu != -1){
						rtx.fillStyle = "#00FF00";
						rtx.strokeStyle = "#666666";
						rtx.lineWidth = 2
						if(unix[kolej][heks[zaznx][zazny].unt[nui]].celu != -1){
							if(unix[kolej][heks[zaznx][zazny].unt[nui]].celd != kolej){
								rtx.fillStyle = "#FF0000";
							} else if(unix[unix[kolej][heks[zaznx][zazny].unt[nui]].celd][unix[kolej][heks[zaznx][zazny].unt[nui]].celu].rodz == unix[kolej][heks[zaznx][zazny].unt[nui]].rodz){
								rtx.fillStyle = "#0000FF";
							} else if(unix[unix[kolej][heks[zaznx][zazny].unt[nui]].celd][unix[kolej][heks[zaznx][zazny].unt[nui]].celu].rodz == 10) {
								rtx.fillStyle = "#FF8800";
							} else {
								rtx.fillStyle = "#00000000";
							}
						}
						rtx.beginPath()
						rtx.moveTo(190,15+a*30)
						rtx.lineTo(190,35+a*30)
						rtx.lineTo(190+10,25+a*30)
						rtx.closePath()
						rtx.fill()
						rtx.stroke()
						rtx.fillRect(180,20+a*30,5,10);
						rtx.strokeRect(180,20+a*30,5,10);
					}
				}
				rtx.strokeStyle = "#666666";
				rtx.strokeRect(10,10+a*30,200,30);
				a++;
			}
		break;
		/*
		case movesToMakeCanvasCtx:
			rtx.fillStyle = "#000000";
			rtx.fillRect(0,0,220,220);
			rtx.lineWidth = 2;

			var a = 0;
			var za = 0
			while(a<ruchwkolejcen){
				if(unix[kolej][ruchwkolejce[a]] == undefined){
					a++
					continue
				}
				if(!(unix[kolej][ruchwkolejce[a]].celd in unix)){
					a++
					continue
				}
				
				rtx.fillStyle = "#CCCCCC";
				rtx.fillRect(10,10+za*30,200,30);
				if(movesToMakeNumber==a){
					rtx.fillStyle = "#FFFFFF";
					rtx.globalAlpha = 0.6;
					rtx.fillRect(10,10+za*30,200,30);
					rtx.globalAlpha = 1;
				}
					
				if(unix[kolej][ruchwkolejce[a]].x > -1)
					rysunicik(32,26+za*30,rtx,za,6,ruchwkolejce[a]);
				if(unix[kolej][ruchwkolejce[a]].ruchy > 0 || unix[kolej][ruchwkolejce[a]].celu != -1){
					rtx.fillStyle = "#00FF00";
					rtx.strokeStyle = "#666666";
					rtx.lineWidth = 2
					
					var hexFrom = '(' + unix[kolej][ruchwkolejce[a]].x + ',' + unix[kolej][ruchwkolejce[a]].y + ')'
					
					var dest = ''
					if(unix[kolej][ruchwkolejce[a]].celu != -1)
						dest = [unix[unix[kolej][ruchwkolejce[a]].celd][unix[kolej][ruchwkolejce[a]].celu].x, unix[unix[kolej][ruchwkolejce[a]].celd][unix[kolej][ruchwkolejce[a]].celu].y]
					else
						dest = leadPath(unix[kolej][ruchwkolejce[a]].x,unix[kolej][ruchwkolejce[a]].y,unix[kolej][ruchwkolejce[a]].ruchk,unix[kolej][ruchwkolejce[a]].rucho)
					//leadPath(x,y,ruchk,rucho,stopBefore
					var hexTo = dest ? '(' + dest[0] + ',' + dest[1] + ')' : ''
					
					if(unix[kolej][ruchwkolejce[a]].celu != -1){
						if(unix[kolej][ruchwkolejce[a]].celd != kolej){
							rtx.fillStyle = "#FF0000";
						} else if(unix[unix[kolej][ruchwkolejce[a]].celd][unix[kolej][ruchwkolejce[a]].celu].rodz == unix[kolej][ruchwkolejce[a]].rodz){
							rtx.fillStyle = "#0000FF";
						} else if(unix[unix[kolej][ruchwkolejce[a]].celd][unix[kolej][ruchwkolejce[a]].celu].rodz == 10) {
							rtx.fillStyle = "#FF8800";
						} else {
							rtx.fillStyle = "#00000000";
						}
					}
					rtx.beginPath()
					rtx.moveTo(120,15+za*30)
					rtx.lineTo(120,35+za*30)
					rtx.lineTo(120+10,25+za*30)
					rtx.closePath()
					rtx.fill()
					rtx.stroke()
					rtx.fillRect(110,20+za*30,5,10);
					rtx.strokeRect(110,20+za*30,5,10);
				}
				rtx.font = '10pt Trebuchet MS';
				rtx.fillStyle = "#006666";
				rtx.textAlign = "right";
				rtx.fillText(hexFrom,100,28+za*30);
				rtx.fillText(hexTo,180,28+za*30);
				rtx.strokeStyle = "#666666";
				rtx.strokeRect(10,10+za*30,200,30);
				za++
				a++;
			}
		break;*/
		case createUnitCanvasCtx:
				rtx.fillStyle = "#000000";
				rtx.fillRect(0,0,220,220);
			a = 0;
			while(a<3){
				b = 0;
				while(b<4){
					rysunitek(35+b*50,28+a*34,rtx,b+a*4,8,bloknia[kolej][b+a*4]);
					b++;
				}
				a++;
			}
			if(zaznx>-1 && (((heks[zaznx][zazny].hutn<=0 || heks[zaznx][zazny].prod<=0) && ces[createUnitNumber]>0) || heks[zaznx][zazny].unp>=4)){


			} else if(createUnitNumber>-1 && !bloknia[kolej][createUnitNumber]){
				a = Math.floor(createUnitNumber/4);
				b = createUnitNumber-a*4;
				rtx.fillStyle = "#FFFFFF";
				rtx.globalAlpha = 0.6;
				rtx.fillRect(10+b*50,10+a*34,50,33);
				rtx.globalAlpha = 1;
			}
		break;
		case upgradeCityCanvasCtx:
			rtx.lineWidth = 2;
			a = 0;
			while(a<3){
				var doli = "";
				switch(a){
					case 0:
					rtx.strokeStyle = "#A68607";
					rtx.fillStyle = "#F2CB33";
					if(heks[zaznx][zazny].zpl>0){
						doli = "+"+heks[zaznx][zazny].zpl+" ("+heks[zaznx][zazny].zpl*30+"$)";
					} else {
						doli = "30$/1";
					}
					break;
					case 1:
					rtx.strokeStyle = "#737372";
					rtx.fillStyle = "#B5B5B5";
					if(heks[zaznx][zazny].hutnpl>0){
						doli = "+"+heks[zaznx][zazny].hutnpl+" ("+heks[zaznx][zazny].hutnpl*15+"$)";

					} else {
						doli = "15$/1";
					}
					break;
					case 2:
					rtx.strokeStyle = "#785034";
					rtx.fillStyle = "#DBA884";
					if(heks[zaznx][zazny].prodpl>0){
						doli = "+"+heks[zaznx][zazny].prodpl+" ("+heks[zaznx][zazny].prodpl*15+"$)";

					} else {
						doli = "15$/1";
					}
					break;
				}
				rtx.font = '10pt Calibri';
				rtx.textAlign = "center";
				var przet = rtx.fillStyle;
				xg = a*70+40;
				yg = 40;
				rtx.fillRect(a*70+10,10,60,80);
				rtx.strokeRect(a*70+10,10,60,80);
				switch(a){
					case 0:
					xg-=10;
					b = 0;
					while(b<3){
					rtx.beginPath();
					rtx.arc(xg, yg-15, 5, 0, Math.PI*2, false);
					rtx.fill();
					rtx.beginPath();
					rtx.arc(xg, yg-15, 5, 0, Math.PI*2, false);
					rtx.moveTo(xg-10,yg-10);
					rtx.lineTo(xg+10,yg-10);
					rtx.lineTo(xg,yg-10);
					rtx.lineTo(xg,yg);
					rtx.lineTo(xg-10,yg+10);
					rtx.lineTo(xg,yg);
					rtx.lineTo(xg+10,yg+10);
					rtx.stroke();
					xg+=10;
					b++;
					}
					xg-=20;

					rtx.fillStyle=rtx.strokeStyle;

      				rtx.fillText(heks[zaznx][zazny].z, xg, 65);

					break;
					case 1:
					rtx.strokeRect(xg-20,yg-20,40,30);
					rtx.beginPath();
					rtx.moveTo(xg-2+5,yg-15);
					rtx.lineTo(xg-15+5,yg-15);
					rtx.lineTo(xg-15+5,yg+5);
					rtx.lineTo(xg-15+5,yg-10);
					rtx.lineTo(xg-2+5,yg-10);
					rtx.stroke();
					rtx.beginPath();
					rtx.moveTo(xg+10,yg+5);
					rtx.lineTo(xg+2,yg+5);
					rtx.lineTo(xg+2,yg-5);
					rtx.lineTo(xg+10,yg-5);
					rtx.lineTo(xg+10,yg);
					rtx.lineTo(xg+2,yg);
					rtx.stroke();

					rtx.fillStyle=rtx.strokeStyle;

      				rtx.fillText(heks[zaznx][zazny].hutn, xg, 65);
					break;
					case 2:
					rtx.fillStyle=rtx.strokeStyle;
					rtx.beginPath();
					rtx.moveTo(xg-15,yg-5);
					rtx.lineTo(xg-5,yg-10);
					rtx.lineTo(xg-5,yg-5);
					rtx.lineTo(xg+5,yg-10);
					rtx.lineTo(xg+5,yg);
					rtx.lineTo(xg+7,yg);
					rtx.lineTo(xg+7,yg-15);
					rtx.lineTo(xg+10,yg-15);
					rtx.lineTo(xg+10,yg);
					rtx.lineTo(xg+15,yg);
					rtx.lineTo(xg+15,yg+10);
					rtx.lineTo(xg-15,yg+10);
					rtx.fill();
					rtx.beginPath();
					rtx.arc(xg+5, yg-15, 3, 0, Math.PI*2, false);
					rtx.fill();
					rtx.beginPath();
					rtx.arc(xg, yg-18, 5, 0, Math.PI*2, false);
					rtx.fill();

					rtx.fillStyle=rtx.strokeStyle;

      				rtx.fillText(heks[zaznx][zazny].prod, xg, 65);
					break;
				}
      				rtx.fillText(doli, xg, 80);
				a++;
			}
			if(upgradeCityNumber>-1){
				rtx.fillStyle="#FFFFFF";
				rtx.globalAlpha=0.6;
				rtx.fillRect(10+upgradeCityNumber*70,10,60,80);
				rtx.globalAlpha=1;

			}
		break;
		case unitMergeCanvasCtx:
				rtx.fillStyle = "#000000";
				rtx.fillRect(0,0,220,220);
				rtx.lineWidth = 2;
			a = 0;
			hb = 0;
			while(a<4){
				if(zaznu>-1 && hb<heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unp-1){
					nui = a;
					rtx.fillStyle = "#CCCCCC";
					rtx.fillRect(10,10+hb*30,200,30);
					if(unitMergeChoice==hb){
						rtx.fillStyle = "#FFFFFF";
						rtx.globalAlpha = 0.6;
						rtx.fillRect(10,10+hb*30,200,30);
						rtx.globalAlpha = 1;
					}
					rysunicik(32,26+hb*30,rtx,nui,6,heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unt[hb]);
					if(unix[kolej][zaznu].rodz==unix[kolej][heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unt[hb]].rodz && unix[kolej][zaznu].szyt==unix[kolej][heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unt[hb]].szyt){
						rtx.fillStyle="#0000FF";
						rtx.fillRect(180,20+30*hb,10,10);
						rtx.strokeRect(180,20+30*hb,10,10);
					}
					if(unix[kolej][zaznu].szyt!="l" && unix[kolej][zaznu].szyt!="w" && unix[kolej][zaznu].szyt!="c" && unix[kolej][zaznu].szyt==szyt[unix[kolej][zaznu].rodz] && unix[kolej][heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unt[hb]].rodz==10){
						rtx.fillStyle="#FF8800";
						rtx.fillRect(180,20+30*hb,10,10);
						rtx.strokeRect(180,20+30*hb,10,10);
					}
					
					
					if(unix[kolej][heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unt[hb]].rozb>0){
						rtx.font = '10pt Trebuchet MS';
						rtx.fillStyle = "#006666";
						rtx.textAlign = "right";
						rtx.fillText("+"+unix[kolej][heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unt[hb]].rozb,70,28+a*30);
					}
					if(unix[kolej][heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unt[hb]].ruchy > 0 || unix[kolej][heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unt[hb]].celu != -1){
						rtx.fillStyle = "#00FF00";
						rtx.strokeStyle = "#666666";
						rtx.lineWidth = 2
						if(unix[kolej][heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unt[hb]].celu != -1){
							if(unix[kolej][heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unt[hb]].celd != kolej){
								rtx.fillStyle = "#FF0000";
							} else if(unix[unix[kolej][heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unt[hb]].celd][unix[kolej][heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unt[hb]].celu].rodz == unix[kolej][heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unt[hb]].rodz){
								rtx.fillStyle = "#0000FF";
							} else if(unix[unix[kolej][heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unt[hb]].celd][unix[kolej][heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unt[hb]].celu].rodz == 10) {
								rtx.fillStyle = "#FF8800";
							} else {
								rtx.fillStyle = "#00000000";
							}
						}
						rtx.beginPath()
						rtx.moveTo(70,15+a*30)
						rtx.lineTo(70,35+a*30)
						rtx.lineTo(70+10,25+a*30)
						rtx.closePath()
						rtx.fill()
						rtx.stroke()
						rtx.fillRect(60,20+a*30,5,10);
						rtx.strokeRect(60,20+a*30,5,10);
					}
				}
				if(a<3){
				rtx.strokeStyle = "#666666";
				rtx.strokeRect(10,10+hb*30,200,30);
				}
				hb++;
				a++;
				if(heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unt[a]==zaznu){
					a++;
				}
			}
      		rtx.fillText(unitMergeChoice, 10, 10);

		break;
		case statisticsCanvasCtx:
		case statisticsCanvasCtx2:
		case statisticsCanvasCtx3:
			if(stan >= 2){
				rtx.clearRect(0,0,220,2500)
				var stats = []
				var moneystats = []
				var ironstats = []
				var productionstats = []
				for(var i = 0;i<12;i++){
					stats[i] = []
					moneystats[i] = 0
					ironstats[i] = 0
					productionstats[i] = 0
					for(var j = 0;j<12;j++){
						stats[i][j] = 0
					}
				}
				var heksSource = heks
				var unixSource = unix
				if(rtx == statisticsCanvasCtx3 && stan == 6){
					var currentState = historyDex.getCurrentState()
					heksSource = currentState.heks
					unixSource = currentState.unix
				}
				for(var i = 0;i<scian;i++){
					for(var j = 0;j<scian;j++){
						if(heksSource[i][j].undr != -1){
							var druż = heksSource[i][j].undr
							if(heksSource[i][j].z > 0){
								moneystats[druż] -= -heksSource[i][j].z
								ironstats[druż] -= -heksSource[i][j].hutn
								productionstats[druż] += heksSource[i][j].prod
							}
							for(var k = 0;k<heksSource[i][j].unp;k++){
								//console.log(druż,i,j,heksSource[i][j])
								var unitik = unixSource[druż][heksSource[i][j].unt[k]]
								stats[druż][unitik.rodz] -= -unitik.il
							}
						}
					}
				}
				var przypisania = []
				var row = 0
				var column = 1
				for(var i = 0;i<12;i++){
					var óx = 40*column
					var óy = 10+20*row*16.5+ 70
					var óy2 = 15+20*row*16.5
					if(dru[i] != 0){
						przypisania.push({i:i,dru:dru[i],column:column,row:row})
						
						rtx.font = '9pt Calibri';
						rtx.textAlign = 'right'
							
						rtx.strokeStyle = '#fff'
						rtx.fillStyle = '#000'
						rysujprodukcję(rtx,20,óy2   ,0,0.5)
						rysujprodukcję(rtx,20,óy2+20,1,0.5)
						rysujprodukcję(rtx,20,óy2+40,2,0.5)
						rtx.fillStyle = '#fff'
							
						rtx.fillText(moneystats[i],óx+35,óy2)
						rtx.fillText(ironstats[i],óx+35,óy2+20)
						rtx.fillText(productionstats[i],óx+35,óy2+40)
						
						rtx.textAlign = 'center'
						for(var j=0;j<12;j++){
							if(stats[i][j] <= 0){
								rtx.strokeStyle = '#aaa'
								rtx.strokeRect(óx, óy+j*20, 40, 20)
							} else {
								rtx.strokeStyle = '#fff'
								rtx.fillStyle = kolox(i,0)
								rtx.fillRect(óx, óy+j*20, 40, 20)
								rtx.strokeRect(óx, óy+j*20, 40, 20)
								
								rtx.fillStyle = '#fff'
								rtx.fillText(stats[i][j],óx+20,óy+15+j*20)
							}
						}
						column++
						if(column > 4){
							for(var j=0;j<12;j++){
								rysbezkolorowyunitek(rtx,25,óy+10+j*20,15,10,j)
							}
							column = 1
							row++
						}
					}
				}
				if(column > 1){
					for(var j=0;j<12;j++){
						rysbezkolorowyunitek(rtx,25,óy+10+j*20,15,10,j)
					}
				}
			}
		break
	}
	}
}

function rysunicik(x4,y4,zr,nr,wielok,zazanu){
	/*ctx.fillStyle = kolox(this.d,1);
	ctx.strokeStyle = kolox(this.d,0);
	ctx.fillRect(x4-150/scian,y4-225/scian,300/scian,450/scian);
	ctx.strokeRect(x4-150/scian,y4-225/scian,300/scian,450/scian);*/
	var fzazanu = zazanu
	if(zazanu == undefined)
		zazanu = zaznu
		
	if(zaznx>-1){
		zaznxh = zaznx;
		zaznyh = zazny;
		if(fzazanu == undefined)
			zazanu = heks[zaznxh][zaznyh].unt[nr]
	} else {
		zaznxh = unix[kolej][zazanu].x;
		zaznyh = unix[kolej][zazanu].y;
	}
			dtr = kolej;
			dth = unix[kolej][zazanu].rodz;
			xg = x4;
			yg = y4;
			sx = wielok*3;
			sy = wielok*2;
			zr.lineWidth = 1;
			zr.fillStyle = kolox(kolej,1);
			zr.strokeStyle = kolox(kolej,0);
			zr.lineWidth = 1;

			zr.fillRect(xg-sx,yg-sy,sx*2,sy*2);
				zr.globalAlpha = 1-unix[kolej][zazanu].il/100;
				zr.fillStyle = "#FFFFFF";
				zr.fillRect(xg-sx,yg-sy,sx*2,sy*2);
				zr.globalAlpha = 1;
				zr.strokeRect(xg-sx,yg-sy,sx*2,sy*2);

			switch(dth){
				case 0:
				zr.beginPath();
				zr.moveTo(xg-sx,yg-sy);
				zr.lineTo(xg+sx,yg+sy);
				zr.closePath();
				zr.stroke();
				zr.beginPath();
				zr.moveTo(xg-sx,yg+sy);
				zr.lineTo(xg+sx,yg-sy);
				zr.closePath();
				zr.stroke();

				break;
				case 1:
				zr.beginPath();
				zr.arc(xg-sx/3, yg, sy/2, Math.PI/2, Math.PI*3/2, false);
				zr.lineTo(xg+sx/3,yg-sy/2);
				zr.arc(xg+sx/3, yg, sy/2, Math.PI*3/2, Math.PI/2, false);
				zr.closePath();
				zr.stroke();
				break;
				case 2:
				zr.beginPath();
				zr.arc(xg, yg, sy/3, 0, 2*Math.PI, false);
				zr.closePath();
				zr.fillStyle = kolox(kolej,0);
				zr.fill();
				zr.fillStyle = kolox(kolej,1);

				break;
				case 3:
				zr.beginPath();
				zr.moveTo(xg-sx,yg-sy);
				zr.lineTo(xg+sx,yg+sy);
				zr.closePath();
				zr.stroke();
				zr.beginPath();
				zr.moveTo(xg-sx,yg+sy);
				zr.lineTo(xg+sx,yg-sy);
				zr.closePath();
				zr.stroke();
				zr.beginPath();
				zr.moveTo(xg,yg+sy);
				zr.lineTo(xg,yg-sy);
				zr.closePath();
				zr.stroke();

				break;
				case 4:
				zr.beginPath();
				zr.moveTo(xg-sx,yg-sy);
				zr.lineTo(xg+sx,yg+sy);
				zr.closePath();
				zr.stroke();
				zr.beginPath();
				zr.moveTo(xg-sx,yg+sy);
				zr.lineTo(xg+sx,yg-sy);
				zr.closePath();
				zr.stroke();
				zr.beginPath();
				zr.moveTo(xg,yg+sy/3);
				zr.lineTo(xg-sx/2,yg+sy);
				zr.lineTo(xg+sx/2,yg+sy);
				zr.closePath();
				zr.fillStyle = kolox(kolej,0);
				zr.fill();
				zr.fillStyle = kolox(kolej,1);

				break;
				case 5:
				zr.beginPath();
				zr.arc(xg, yg+sx+sy, sx*Math.sqrt(2), Math.PI*1.25, Math.PI*1.75, false);
				zr.closePath();
				zr.stroke();

				break;
				case 6:
				zr.beginPath();
				zr.arc(xg, yg-sy*0.25, sy/10, 0, Math.PI*2, false);
				zr.closePath();
				zr.stroke();

				zr.beginPath();
				zr.moveTo(xg,yg-sy*0.15);
				zr.lineTo(xg,yg-sy*0.1);
				zr.lineTo(xg-sy*0.15,yg-sy*0.1);
				zr.lineTo(xg+sy*0.1,yg-sy*0.1);
				zr.lineTo(xg,yg-sy*0.15);
				zr.lineTo(xg,yg+sy*0.15);
				zr.stroke();

				zr.beginPath();
				zr.arc(xg-sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
				zr.lineTo(xg-sy*0.3, yg+sy*0.05);
				zr.stroke();

				zr.beginPath();
				zr.moveTo(xg-sy*0.3, yg+sy*0.05);
				zr.lineTo(xg-sy*0.4, yg+sy*0.2);
				zr.lineTo(xg-sy*0.3, yg+sy*0.05);
				zr.lineTo(xg-sy*0.2, yg+sy*0.2);
				zr.stroke();

				zr.beginPath();
				zr.arc(xg+sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
				//unitChoiceCanvasCtx.lineTo(xg+sy*0.3, yg+sy*0.05);
				zr.stroke();

				zr.beginPath();
				zr.moveTo(xg+sy*0.3, yg+sy*0.05);
				zr.lineTo(xg+sy*0.2, yg+sy*0.2);
				zr.lineTo(xg+sy*0.3, yg+sy*0.05);
				zr.lineTo(xg+sy*0.4, yg+sy*0.2);
				zr.stroke();

				break;
				case 7:

				zr.beginPath();
				zr.arc(xg-sx/3, yg, sy/2, Math.PI/2, Math.PI*3/2, false);
				zr.lineTo(xg+sx/3,yg-sy/2);
				zr.arc(xg+sx/3, yg, sy/2, Math.PI*3/2, Math.PI/2, false);
				zr.closePath();
				zr.stroke();

				zr.beginPath();
				zr.arc(xg, yg-sy*0.25, sy/10, 0, Math.PI*2, false);
				zr.closePath();
				zr.stroke();

				zr.beginPath();
				zr.moveTo(xg,yg-sy*0.15);
				zr.lineTo(xg,yg-sy*0.1);
				zr.lineTo(xg-sy*0.15,yg-sy*0.1);
				zr.lineTo(xg+sy*0.1,yg-sy*0.1);
				zr.lineTo(xg,yg-sy*0.15);
				zr.lineTo(xg,yg+sy*0.15);
				zr.stroke();

				zr.beginPath();
				zr.arc(xg-sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
				zr.lineTo(xg-sy*0.3, yg+sy*0.05);
				zr.stroke();

				zr.beginPath();
				zr.moveTo(xg-sy*0.3, yg+sy*0.05);
				zr.lineTo(xg-sy*0.4, yg+sy*0.2);
				zr.lineTo(xg-sy*0.3, yg+sy*0.05);
				zr.lineTo(xg-sy*0.2, yg+sy*0.2);
				zr.stroke();

				zr.beginPath();
				zr.arc(xg+sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
				//unitChoiceCanvasCtx.lineTo(xg+sy*0.3, yg+sy*0.05);
				zr.stroke();

				zr.beginPath();
				zr.moveTo(xg+sy*0.3, yg+sy*0.05);
				zr.lineTo(xg+sy*0.2, yg+sy*0.2);
				zr.lineTo(xg+sy*0.3, yg+sy*0.05);
				zr.lineTo(xg+sy*0.4, yg+sy*0.2);
				zr.stroke();


				break;
				case 8:
				zr.beginPath();
				zr.arc(xg-sx, yg+sy*13/16, sy*3/16, Math.PI/2, 0, true);
				zr.arc(xg-sx+(sy*3/8), yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				zr.arc(xg-sx+(sy*3/8)*2, yg+sy*13/16, sy*3/16, Math.PI, 0, true);
				zr.arc(xg-sx+(sy*3/8)*3, yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				zr.arc(xg-sx+(sy*3/8)*4, yg+sy*13/16, sy*3/16, Math.PI, 0, true);
				zr.arc(xg-sx+(sy*3/8)*5, yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				zr.arc(xg-sx+(sy*3/8)*6, yg+sy*13/16, sy*3/16, Math.PI, 0, true);
				zr.arc(xg-sx+(sy*3/8)*7, yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				zr.arc(xg-sx+(sy*3/8)*8, yg+sy*13/16, sy*3/16, Math.PI, 0, true);

				zr.stroke();

				break;
				case 9:

				zr.beginPath();
				zr.arc(xg-sx/2, yg, sy/3, Math.PI/3, Math.PI*5/3, false);
				//unitChoiceCanvasCtx.lineTo(xg+sx/3,yg-sy/2);
				zr.arc(xg+sx/2, yg, sy/3, Math.PI*2/3, Math.PI*4/3, true);
				zr.closePath();
				zr.stroke();
				break;
				case 10:

				zr.beginPath();
				zr.moveTo(xg-sx/4,yg-sy*3/4);
				zr.lineTo(xg,yg-sy/3);
				zr.lineTo(xg+sx/4,yg-sy*3/4);
				zr.stroke();
				break;
				case 11:
				zr.beginPath();
				zr.moveTo(xg-sx/2,yg-sy*3/5);
				zr.lineTo(xg-sx/3,yg-sy/5);
				zr.lineTo(xg+sx/3,yg-sy/5);
				zr.lineTo(xg+sx/2,yg-sy*3/5);
				zr.stroke();
				zr.beginPath();
				zr.moveTo(xg-sx/2,yg+sy*3/5);
				zr.lineTo(xg-sx/3,yg+sy/5);
				zr.lineTo(xg+sx/3,yg+sy/5);
				zr.lineTo(xg+sx/2,yg+sy*3/5);
				zr.stroke();
				break;

			}/*
			24 16 48 32   0.53125
			(xg-sx,yg-sy,sx*2,sy*2)*/
			zr.fillStyle = "#FFFFFF";
			zr.fillStyle = "#444444";
			zr.fillRect(xg-sx,yg+sy*0.1,sy*1.1,sy*0.9);
			//unitChoiceCanvasCtx.strokeRect(xg-24,yg-16,48,32);
			zr.font = Math.floor(sy*0.8)+'pt Calibri';
			zr.textAlign = "left";
			zr.fillStyle = "#FFFFFF";
      		zr.fillText(unix[kolej][zazanu].il, xg-sx, yg+sy*0.9);
}
function rysunitek(x4,y4,zr,nr,wielok,bloknia){
	/*ctx.fillStyle = kolox(this.d,1);
	ctx.strokeStyle = kolox(this.d,0);
	ctx.fillRect(x4-150/scian,y4-225/scian,300/scian,450/scian);
	ctx.strokeRect(x4-150/scian,y4-225/scian,300/scian,450/scian);*/
			dtr = kolej;
			dth = nr;
			xg = x4;
			yg = y4;
			sx = wielok*3;
			sy = wielok*2;
			zr.lineWidth = 1;
			if(bloknia) {
				zr.fillStyle = '#888888'
			} else if(zaznx>-1 && (((heks[zaznx][zazny].hutn<=0 || heks[zaznx][zazny].prod<=0) && ces[nr]>0) || heks[zaznx][zazny].unp>=4)){
				zr.fillStyle = "#FFFFFF";
			} else {
				zr.fillStyle = kolox(kolej,1);
			}
			zr.strokeStyle = !bloknia ? kolox(kolej,0) : '#222222';
			zr.lineWidth = 1;

			zr.fillRect(xg-sx,yg-sy,sx*2,sy*2);
				zr.strokeRect(xg-sx,yg-sy,sx*2,sy*2);

			switch(dth){
				case 0:
				zr.beginPath();
				zr.moveTo(xg-sx,yg-sy);
				zr.lineTo(xg+sx,yg+sy);
				zr.closePath();
				zr.stroke();
				zr.beginPath();
				zr.moveTo(xg-sx,yg+sy);
				zr.lineTo(xg+sx,yg-sy);
				zr.closePath();
				zr.stroke();

				break;
				case 1:
				zr.beginPath();
				zr.arc(xg-sx/3, yg, sy/2, Math.PI/2, Math.PI*3/2, false);
				zr.lineTo(xg+sx/3,yg-sy/2);
				zr.arc(xg+sx/3, yg, sy/2, Math.PI*3/2, Math.PI/2, false);
				zr.closePath();
				zr.stroke();
				break;
				case 2:
				zr.beginPath();
				zr.arc(xg, yg, sy/3, 0, 2*Math.PI, false);
				zr.closePath();
				zr.fillStyle = kolox(kolej,0);
				zr.fill();
				zr.fillStyle = kolox(kolej,1);

				break;
				case 3:
				zr.beginPath();
				zr.moveTo(xg-sx,yg-sy);
				zr.lineTo(xg+sx,yg+sy);
				zr.closePath();
				zr.stroke();
				zr.beginPath();
				zr.moveTo(xg-sx,yg+sy);
				zr.lineTo(xg+sx,yg-sy);
				zr.closePath();
				zr.stroke();
				zr.beginPath();
				zr.moveTo(xg,yg+sy);
				zr.lineTo(xg,yg-sy);
				zr.closePath();
				zr.stroke();

				break;
				case 4:
				zr.beginPath();
				zr.moveTo(xg-sx,yg-sy);
				zr.lineTo(xg+sx,yg+sy);
				zr.closePath();
				zr.stroke();
				zr.beginPath();
				zr.moveTo(xg-sx,yg+sy);
				zr.lineTo(xg+sx,yg-sy);
				zr.closePath();
				zr.stroke();
				zr.beginPath();
				zr.moveTo(xg,yg+sy/3);
				zr.lineTo(xg-sx/2,yg+sy);
				zr.lineTo(xg+sx/2,yg+sy);
				zr.closePath();
				zr.fillStyle = kolox(kolej,0);
				zr.fill();
				zr.fillStyle = kolox(kolej,1);

				break;
				case 5:
				zr.beginPath();
				zr.arc(xg, yg+sx+sy, sx*Math.sqrt(2), Math.PI*1.25, Math.PI*1.75, false);
				zr.closePath();
				zr.stroke();

				break;
				case 6:
				zr.beginPath();
				zr.arc(xg, yg-sy*0.25, sy/10, 0, Math.PI*2, false);
				zr.closePath();
				zr.stroke();

				zr.beginPath();
				zr.moveTo(xg,yg-sy*0.15);
				zr.lineTo(xg,yg-sy*0.1);
				zr.lineTo(xg-sy*0.15,yg-sy*0.1);
				zr.lineTo(xg+sy*0.1,yg-sy*0.1);
				zr.lineTo(xg,yg-sy*0.15);
				zr.lineTo(xg,yg+sy*0.15);
				zr.stroke();

				zr.beginPath();
				zr.arc(xg-sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
				zr.lineTo(xg-sy*0.3, yg+sy*0.05);
				zr.stroke();

				zr.beginPath();
				zr.moveTo(xg-sy*0.3, yg+sy*0.05);
				zr.lineTo(xg-sy*0.4, yg+sy*0.2);
				zr.lineTo(xg-sy*0.3, yg+sy*0.05);
				zr.lineTo(xg-sy*0.2, yg+sy*0.2);
				zr.stroke();

				zr.beginPath();
				zr.arc(xg+sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
				//unitChoiceCanvasCtx.lineTo(xg+sy*0.3, yg+sy*0.05);
				zr.stroke();

				zr.beginPath();
				zr.moveTo(xg+sy*0.3, yg+sy*0.05);
				zr.lineTo(xg+sy*0.2, yg+sy*0.2);
				zr.lineTo(xg+sy*0.3, yg+sy*0.05);
				zr.lineTo(xg+sy*0.4, yg+sy*0.2);
				zr.stroke();

				break;
				case 7:

				zr.beginPath();
				zr.arc(xg-sx/3, yg, sy/2, Math.PI/2, Math.PI*3/2, false);
				zr.lineTo(xg+sx/3,yg-sy/2);
				zr.arc(xg+sx/3, yg, sy/2, Math.PI*3/2, Math.PI/2, false);
				zr.closePath();
				zr.stroke();

				zr.beginPath();
				zr.arc(xg, yg-sy*0.25, sy/10, 0, Math.PI*2, false);
				zr.closePath();
				zr.stroke();

				zr.beginPath();
				zr.moveTo(xg,yg-sy*0.15);
				zr.lineTo(xg,yg-sy*0.1);
				zr.lineTo(xg-sy*0.15,yg-sy*0.1);
				zr.lineTo(xg+sy*0.1,yg-sy*0.1);
				zr.lineTo(xg,yg-sy*0.15);
				zr.lineTo(xg,yg+sy*0.15);
				zr.stroke();

				zr.beginPath();
				zr.arc(xg-sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
				zr.lineTo(xg-sy*0.3, yg+sy*0.05);
				zr.stroke();

				zr.beginPath();
				zr.moveTo(xg-sy*0.3, yg+sy*0.05);
				zr.lineTo(xg-sy*0.4, yg+sy*0.2);
				zr.lineTo(xg-sy*0.3, yg+sy*0.05);
				zr.lineTo(xg-sy*0.2, yg+sy*0.2);
				zr.stroke();

				zr.beginPath();
				zr.arc(xg+sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
				//unitChoiceCanvasCtx.lineTo(xg+sy*0.3, yg+sy*0.05);
				zr.stroke();

				zr.beginPath();
				zr.moveTo(xg+sy*0.3, yg+sy*0.05);
				zr.lineTo(xg+sy*0.2, yg+sy*0.2);
				zr.lineTo(xg+sy*0.3, yg+sy*0.05);
				zr.lineTo(xg+sy*0.4, yg+sy*0.2);
				zr.stroke();


				break;
				case 8:
				zr.beginPath();
				zr.arc(xg-sx, yg+sy*13/16, sy*3/16, Math.PI/2, 0, true);
				zr.arc(xg-sx+(sy*3/8), yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				zr.arc(xg-sx+(sy*3/8)*2, yg+sy*13/16, sy*3/16, Math.PI, 0, true);
				zr.arc(xg-sx+(sy*3/8)*3, yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				zr.arc(xg-sx+(sy*3/8)*4, yg+sy*13/16, sy*3/16, Math.PI, 0, true);
				zr.arc(xg-sx+(sy*3/8)*5, yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				zr.arc(xg-sx+(sy*3/8)*6, yg+sy*13/16, sy*3/16, Math.PI, 0, true);
				zr.arc(xg-sx+(sy*3/8)*7, yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				zr.arc(xg-sx+(sy*3/8)*8, yg+sy*13/16, sy*3/16, Math.PI, 0, true);

				zr.stroke();

				break;
				case 9:

				zr.beginPath();
				zr.arc(xg-sx/2, yg, sy/3, Math.PI/3, Math.PI*5/3, false);
				//unitChoiceCanvasCtx.lineTo(xg+sx/3,yg-sy/2);
				zr.arc(xg+sx/2, yg, sy/3, Math.PI*2/3, Math.PI*4/3, true);
				zr.closePath();
				zr.stroke();
				break;
				case 10:

				zr.beginPath();
				zr.moveTo(xg-sx/4,yg-sy*3/4);
				zr.lineTo(xg,yg-sy/3);
				zr.lineTo(xg+sx/4,yg-sy*3/4);
				zr.stroke();
				break;
				case 11:
				zr.beginPath();
				zr.moveTo(xg-sx/2,yg-sy*3/5);
				zr.lineTo(xg-sx/3,yg-sy/5);
				zr.lineTo(xg+sx/3,yg-sy/5);
				zr.lineTo(xg+sx/2,yg-sy*3/5);
				zr.stroke();
				zr.beginPath();
				zr.moveTo(xg-sx/2,yg+sy*3/5);
				zr.lineTo(xg-sx/3,yg+sy/5);
				zr.lineTo(xg+sx/3,yg+sy/5);
				zr.lineTo(xg+sx/2,yg+sy*3/5);
				zr.stroke();
				break;

			}/*
			24 16 48 32   0.53125
			(xg-sx,yg-sy,sx*2,sy*2)*/
			zr.fillStyle = "#FFFFFF";
			zr.fillStyle = "#444444";
			zr.fillRect(xg-sx,yg+sy*0.1,sy*1.5,sy*0.9);
			//unitChoiceCanvasCtx.strokeRect(xg-24,yg-16,48,32);
			zr.font = Math.floor(sy*0.8)+'pt Calibri';
			zr.textAlign = "left";
			zr.fillStyle = "#FFFFFF";
      		zr.fillText(ced[nr]+"$", xg-sx, yg+sy*0.9);
			if(ces[nr]>0){
			zr.fillStyle = "#CCCCCC";
			zr.fillRect(xg+sx-sy*1.1,yg+sy*0.1,sy*1.1,sy*0.9);
			zr.textAlign = "right";
			zr.fillStyle = "#000000";
      		zr.fillText(ces[nr]+"t", xg+sx, yg+sy*0.9);
			}
}
function rysujprodukcję(rtx,xg,yg,a,scale){
	switch(a){
		case 0:
		xg-=10*scale;
		var bb = 0;
		while(bb<3){
		rtx.beginPath();
		rtx.arc(xg, yg-15*scale, 5*scale, 0, Math.PI*2, false);
		rtx.fill();
		rtx.beginPath();
		rtx.arc(xg, yg-15*scale, 5*scale, 0, Math.PI*2, false);
		rtx.moveTo(xg-10*scale,yg-10*scale);
		rtx.lineTo(xg+10*scale,yg-10*scale);
		rtx.lineTo(xg,yg-10*scale);
		rtx.lineTo(xg,yg);
		rtx.lineTo(xg-10*scale,yg+10*scale);
		rtx.lineTo(xg,yg);
		rtx.lineTo(xg+10*scale,yg+10*scale);
		rtx.stroke();
		xg+=10*scale;
		bb++;
		}
		xg-=20*scale;

		break;
		case 1:
		rtx.strokeRect(xg-20*scale,yg-20*scale,40*scale,30*scale);
		xg += 5*scale
		rtx.beginPath();
		rtx.moveTo(xg-(2+5)*scale,yg-15*scale);
		rtx.lineTo(xg-(15+5)*scale,yg-15*scale);
		rtx.lineTo(xg-(15+5)*scale,yg+5*scale);
		rtx.lineTo(xg-(15+5)*scale,yg-10*scale);
		rtx.lineTo(xg-(2+5)*scale,yg-10*scale);
		rtx.stroke();
		rtx.beginPath();
		rtx.moveTo(xg+10*scale,yg+5*scale);
		rtx.lineTo(xg+2*scale,yg+5*scale);
		rtx.lineTo(xg+2*scale,yg-5*scale);
		rtx.lineTo(xg+10*scale,yg-5*scale);
		rtx.lineTo(xg+10*scale,yg);
		rtx.lineTo(xg+2*scale,yg);
		rtx.stroke();

		break;
		case 2:
		var fisty = rtx.fillStyle
		rtx.fillStyle=rtx.strokeStyle;
		rtx.beginPath();
		rtx.moveTo(xg-15*scale,yg-5*scale);
		rtx.lineTo(xg-5*scale,yg-10*scale);
		rtx.lineTo(xg-5*scale,yg-5*scale);
		rtx.lineTo(xg+5*scale,yg-10*scale);
		rtx.lineTo(xg+5*scale,yg);
		rtx.lineTo(xg+7*scale,yg);
		rtx.lineTo(xg+7*scale,yg-15*scale);
		rtx.lineTo(xg+10*scale,yg-15*scale);
		rtx.lineTo(xg+10*scale,yg);
		rtx.lineTo(xg+15*scale,yg);
		rtx.lineTo(xg+15*scale,yg+10*scale);
		rtx.lineTo(xg-15*scale,yg+10*scale);
		rtx.fill();
		rtx.beginPath();
		rtx.arc(xg+5*scale, yg-15*scale, 3*scale, 0, Math.PI*2, false);
		rtx.fill();
		rtx.beginPath();
		rtx.arc(xg, yg-18*scale, 5*scale, 0, Math.PI*2, false);
		rtx.fill();
		rtx.fillStyle = fisty
		break;
	}
}
function rysbezkolorowyunitek(zr,x4,y4,sx,sy,nr){
	/*ctx.fillStyle = kolox(this.d,1);
	ctx.strokeStyle = kolox(this.d,0);
	ctx.fillRect(x4-150/scian,y4-225/scian,300/scian,450/scian);
	ctx.strokeRect(x4-150/scian,y4-225/scian,300/scian,450/scian);*/
			dth = nr;
			xg = x4;
			yg = y4;
			zr.lineWidth = 1;
			
			zr.fillStyle = "#FFFFFF";
			
			zr.strokeStyle = '#444';
			zr.lineWidth = 1;

			zr.fillRect(xg-sx,yg-sy,sx*2,sy*2);
			zr.strokeRect(xg-sx,yg-sy,sx*2,sy*2);

			switch(dth){
				case 0:
				zr.beginPath();
				zr.moveTo(xg-sx,yg-sy);
				zr.lineTo(xg+sx,yg+sy);
				zr.closePath();
				zr.stroke();
				zr.beginPath();
				zr.moveTo(xg-sx,yg+sy);
				zr.lineTo(xg+sx,yg-sy);
				zr.closePath();
				zr.stroke();

				break;
				case 1:
				zr.beginPath();
				zr.arc(xg-sx/3, yg, sy/2, Math.PI/2, Math.PI*3/2, false);
				zr.lineTo(xg+sx/3,yg-sy/2);
				zr.arc(xg+sx/3, yg, sy/2, Math.PI*3/2, Math.PI/2, false);
				zr.closePath();
				zr.stroke();
				break;
				case 2:
				zr.beginPath();
				zr.arc(xg, yg, sy/3, 0, 2*Math.PI, false);
				zr.closePath();
				zr.fillStyle = kolox(kolej,0);
				zr.fill();
				zr.fillStyle = kolox(kolej,1);

				break;
				case 3:
				zr.beginPath();
				zr.moveTo(xg-sx,yg-sy);
				zr.lineTo(xg+sx,yg+sy);
				zr.closePath();
				zr.stroke();
				zr.beginPath();
				zr.moveTo(xg-sx,yg+sy);
				zr.lineTo(xg+sx,yg-sy);
				zr.closePath();
				zr.stroke();
				zr.beginPath();
				zr.moveTo(xg,yg+sy);
				zr.lineTo(xg,yg-sy);
				zr.closePath();
				zr.stroke();

				break;
				case 4:
				zr.beginPath();
				zr.moveTo(xg-sx,yg-sy);
				zr.lineTo(xg+sx,yg+sy);
				zr.closePath();
				zr.stroke();
				zr.beginPath();
				zr.moveTo(xg-sx,yg+sy);
				zr.lineTo(xg+sx,yg-sy);
				zr.closePath();
				zr.stroke();
				zr.beginPath();
				zr.moveTo(xg,yg+sy/3);
				zr.lineTo(xg-sx/2,yg+sy);
				zr.lineTo(xg+sx/2,yg+sy);
				zr.closePath();
				zr.fillStyle = kolox(kolej,0);
				zr.fill();
				zr.fillStyle = kolox(kolej,1);

				break;
				case 5:
				zr.beginPath();
				zr.arc(xg, yg+sx+sy, sx*Math.sqrt(2), Math.PI*1.25, Math.PI*1.75, false);
				zr.closePath();
				zr.stroke();

				break;
				case 6:
				zr.beginPath();
				zr.arc(xg, yg-sy*0.25, sy/10, 0, Math.PI*2, false);
				zr.closePath();
				zr.stroke();

				zr.beginPath();
				zr.moveTo(xg,yg-sy*0.15);
				zr.lineTo(xg,yg-sy*0.1);
				zr.lineTo(xg-sy*0.15,yg-sy*0.1);
				zr.lineTo(xg+sy*0.1,yg-sy*0.1);
				zr.lineTo(xg,yg-sy*0.15);
				zr.lineTo(xg,yg+sy*0.15);
				zr.stroke();

				zr.beginPath();
				zr.arc(xg-sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
				zr.lineTo(xg-sy*0.3, yg+sy*0.05);
				zr.stroke();

				zr.beginPath();
				zr.moveTo(xg-sy*0.3, yg+sy*0.05);
				zr.lineTo(xg-sy*0.4, yg+sy*0.2);
				zr.lineTo(xg-sy*0.3, yg+sy*0.05);
				zr.lineTo(xg-sy*0.2, yg+sy*0.2);
				zr.stroke();

				zr.beginPath();
				zr.arc(xg+sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
				//unitChoiceCanvasCtx.lineTo(xg+sy*0.3, yg+sy*0.05);
				zr.stroke();

				zr.beginPath();
				zr.moveTo(xg+sy*0.3, yg+sy*0.05);
				zr.lineTo(xg+sy*0.2, yg+sy*0.2);
				zr.lineTo(xg+sy*0.3, yg+sy*0.05);
				zr.lineTo(xg+sy*0.4, yg+sy*0.2);
				zr.stroke();

				break;
				case 7:

				zr.beginPath();
				zr.arc(xg-sx/3, yg, sy/2, Math.PI/2, Math.PI*3/2, false);
				zr.lineTo(xg+sx/3,yg-sy/2);
				zr.arc(xg+sx/3, yg, sy/2, Math.PI*3/2, Math.PI/2, false);
				zr.closePath();
				zr.stroke();

				zr.beginPath();
				zr.arc(xg, yg-sy*0.25, sy/10, 0, Math.PI*2, false);
				zr.closePath();
				zr.stroke();

				zr.beginPath();
				zr.moveTo(xg,yg-sy*0.15);
				zr.lineTo(xg,yg-sy*0.1);
				zr.lineTo(xg-sy*0.15,yg-sy*0.1);
				zr.lineTo(xg+sy*0.1,yg-sy*0.1);
				zr.lineTo(xg,yg-sy*0.15);
				zr.lineTo(xg,yg+sy*0.15);
				zr.stroke();

				zr.beginPath();
				zr.arc(xg-sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
				zr.lineTo(xg-sy*0.3, yg+sy*0.05);
				zr.stroke();

				zr.beginPath();
				zr.moveTo(xg-sy*0.3, yg+sy*0.05);
				zr.lineTo(xg-sy*0.4, yg+sy*0.2);
				zr.lineTo(xg-sy*0.3, yg+sy*0.05);
				zr.lineTo(xg-sy*0.2, yg+sy*0.2);
				zr.stroke();

				zr.beginPath();
				zr.arc(xg+sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
				//unitChoiceCanvasCtx.lineTo(xg+sy*0.3, yg+sy*0.05);
				zr.stroke();

				zr.beginPath();
				zr.moveTo(xg+sy*0.3, yg+sy*0.05);
				zr.lineTo(xg+sy*0.2, yg+sy*0.2);
				zr.lineTo(xg+sy*0.3, yg+sy*0.05);
				zr.lineTo(xg+sy*0.4, yg+sy*0.2);
				zr.stroke();


				break;
				case 8:
				zr.beginPath();
				zr.arc(xg-sx, yg+sy*13/16, sy*3/16, Math.PI/2, 0, true);
				zr.arc(xg-sx+(sy*3/8), yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				zr.arc(xg-sx+(sy*3/8)*2, yg+sy*13/16, sy*3/16, Math.PI, 0, true);
				zr.arc(xg-sx+(sy*3/8)*3, yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				zr.arc(xg-sx+(sy*3/8)*4, yg+sy*13/16, sy*3/16, Math.PI, 0, true);
				zr.arc(xg-sx+(sy*3/8)*5, yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				zr.arc(xg-sx+(sy*3/8)*6, yg+sy*13/16, sy*3/16, Math.PI, 0, true);
				zr.arc(xg-sx+(sy*3/8)*7, yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				zr.arc(xg-sx+(sy*3/8)*8, yg+sy*13/16, sy*3/16, Math.PI, 0, true);

				zr.stroke();

				break;
				case 9:

				zr.beginPath();
				zr.arc(xg-sx/2, yg, sy/3, Math.PI/3, Math.PI*5/3, false);
				//unitChoiceCanvasCtx.lineTo(xg+sx/3,yg-sy/2);
				zr.arc(xg+sx/2, yg, sy/3, Math.PI*2/3, Math.PI*4/3, true);
				zr.closePath();
				zr.stroke();
				break;
				case 10:

				zr.beginPath();
				zr.moveTo(xg-sx/4,yg-sy*3/4);
				zr.lineTo(xg,yg-sy/3);
				zr.lineTo(xg+sx/4,yg-sy*3/4);
				zr.stroke();
				break;
				case 11:
				zr.beginPath();
				zr.moveTo(xg-sx/2,yg-sy*3/5);
				zr.lineTo(xg-sx/3,yg-sy/5);
				zr.lineTo(xg+sx/3,yg-sy/5);
				zr.lineTo(xg+sx/2,yg-sy*3/5);
				zr.stroke();
				zr.beginPath();
				zr.moveTo(xg-sx/2,yg+sy*3/5);
				zr.lineTo(xg-sx/3,yg+sy/5);
				zr.lineTo(xg+sx/3,yg+sy/5);
				zr.lineTo(xg+sx/2,yg+sy*3/5);
				zr.stroke();
				break;

			}
}
function unitChoiceDraw(){
	unitChoiceCanvasCtx.fillStyle = "#000000";
	unitChoiceCanvasCtx.strokeStyle = "#666666";
	unitChoiceCanvasCtx.fillRect(0,0,200,150);
	unitChoiceCanvasCtx.lineWidth = 1;
	var aq = 0;
	var bq = 0;
	var xg = 0;
	var yg = 0;
	var sx = 24;
	var sy = 16;
	while(aq<3){
		bq = 0;
		while(bq<4){
			dtr = kolej;
			dth = aq*4+bq;
			xg = bq*50+25;
			yg = aq*50+25;
			unitChoiceCanvasCtx.fillStyle = kolox(kolej,1);
			if(dth!=akcja){
				unitChoiceCanvasCtx.strokeStyle = kolox(kolej,0);
				unitChoiceCanvasCtx.lineWidth = 1;
			} else {
				unitChoiceCanvasCtx.strokeStyle = "#FFFF00";
				unitChoiceCanvasCtx.lineWidth = 2;
			}
			unitChoiceCanvasCtx.fillRect(xg-24,yg-16,48,32);
			if(!equaUnitDistribution){
				unitChoiceCanvasCtx.globalAlpha = 1-oddy/100;
			} else {
				if(trownia[dth]<rownia[dth]){
					unitChoiceCanvasCtx.globalAlpha = 1-rowniak[dth][trownia[dth]]/100;
				} else {
					unitChoiceCanvasCtx.globalAlpha = 100;
				}
			}
				unitChoiceCanvasCtx.fillStyle = "#FFFFFF";
				unitChoiceCanvasCtx.fillRect(xg-24,yg-16,48,32);
				unitChoiceCanvasCtx.globalAlpha = 1;
				unitChoiceCanvasCtx.strokeRect(xg-24,yg-16,48,32);
			switch(dth){
				case 0:
				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.moveTo(xg-sx,yg-sy);
				unitChoiceCanvasCtx.lineTo(xg+sx,yg+sy);
				unitChoiceCanvasCtx.closePath();
				unitChoiceCanvasCtx.stroke();
				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.moveTo(xg-sx,yg+sy);
				unitChoiceCanvasCtx.lineTo(xg+sx,yg-sy);
				unitChoiceCanvasCtx.closePath();
				unitChoiceCanvasCtx.stroke();

				break;
				case 1:
				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.arc(xg-sx/3, yg, sy/2, Math.PI/2, Math.PI*3/2, false);
				unitChoiceCanvasCtx.lineTo(xg+sx/3,yg-sy/2);
				unitChoiceCanvasCtx.arc(xg+sx/3, yg, sy/2, Math.PI*3/2, Math.PI/2, false);
				unitChoiceCanvasCtx.closePath();
				unitChoiceCanvasCtx.stroke();
				break;
				case 2:
				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.arc(xg, yg, sy/3, 0, 2*Math.PI, false);
				unitChoiceCanvasCtx.closePath();
				if(dth!=akcja){
					unitChoiceCanvasCtx.fillStyle = kolox(dtr,0);
				} else {
					unitChoiceCanvasCtx.fillStyle = "#FFFF00";
				}
				unitChoiceCanvasCtx.fill();
				unitChoiceCanvasCtx.fillStyle = kolox(dtr,1);

				break;
				case 3:
				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.moveTo(xg-sx,yg-sy);
				unitChoiceCanvasCtx.lineTo(xg+sx,yg+sy);
				unitChoiceCanvasCtx.closePath();
				unitChoiceCanvasCtx.stroke();
				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.moveTo(xg-sx,yg+sy);
				unitChoiceCanvasCtx.lineTo(xg+sx,yg-sy);
				unitChoiceCanvasCtx.closePath();
				unitChoiceCanvasCtx.stroke();
				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.moveTo(xg,yg+sy);
				unitChoiceCanvasCtx.lineTo(xg,yg-sy);
				unitChoiceCanvasCtx.closePath();
				unitChoiceCanvasCtx.stroke();

				break;
				case 4:
				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.moveTo(xg-sx,yg-sy);
				unitChoiceCanvasCtx.lineTo(xg+sx,yg+sy);
				unitChoiceCanvasCtx.closePath();
				unitChoiceCanvasCtx.stroke();
				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.moveTo(xg-sx,yg+sy);
				unitChoiceCanvasCtx.lineTo(xg+sx,yg-sy);
				unitChoiceCanvasCtx.closePath();
				unitChoiceCanvasCtx.stroke();
				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.moveTo(xg,yg+sy/3);
				unitChoiceCanvasCtx.lineTo(xg-sx/2,yg+sy);
				unitChoiceCanvasCtx.lineTo(xg+sx/2,yg+sy);
				unitChoiceCanvasCtx.closePath();
				if(dth!=akcja){
					unitChoiceCanvasCtx.fillStyle = kolox(dtr,0);
				} else {
					unitChoiceCanvasCtx.fillStyle = "#FFFF00";
				}
				unitChoiceCanvasCtx.fill();
				unitChoiceCanvasCtx.fillStyle = kolox(dtr,1);

				break;
				case 5:
				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.arc(xg, yg+sx+sy, sx*Math.sqrt(2), Math.PI*1.25, Math.PI*1.75, false);
				unitChoiceCanvasCtx.closePath();
				unitChoiceCanvasCtx.stroke();

				break;
				case 6:
				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.arc(xg, yg-sy*0.25, sy/10, 0, Math.PI*2, false);
				unitChoiceCanvasCtx.closePath();
				unitChoiceCanvasCtx.stroke();

				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.moveTo(xg,yg-sy*0.15);
				unitChoiceCanvasCtx.lineTo(xg,yg-sy*0.1);
				unitChoiceCanvasCtx.lineTo(xg-sy*0.15,yg-sy*0.1);
				unitChoiceCanvasCtx.lineTo(xg+sy*0.1,yg-sy*0.1);
				unitChoiceCanvasCtx.lineTo(xg,yg-sy*0.15);
				unitChoiceCanvasCtx.lineTo(xg,yg+sy*0.15);
				unitChoiceCanvasCtx.stroke();

				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.arc(xg-sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
				unitChoiceCanvasCtx.lineTo(xg-sy*0.3, yg+sy*0.05);
				unitChoiceCanvasCtx.stroke();

				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.moveTo(xg-sy*0.3, yg+sy*0.05);
				unitChoiceCanvasCtx.lineTo(xg-sy*0.4, yg+sy*0.2);
				unitChoiceCanvasCtx.lineTo(xg-sy*0.3, yg+sy*0.05);
				unitChoiceCanvasCtx.lineTo(xg-sy*0.2, yg+sy*0.2);
				unitChoiceCanvasCtx.stroke();

				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.arc(xg+sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
				//unitChoiceCanvasCtx.lineTo(xg+sy*0.3, yg+sy*0.05);
				unitChoiceCanvasCtx.stroke();

				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.moveTo(xg+sy*0.3, yg+sy*0.05);
				unitChoiceCanvasCtx.lineTo(xg+sy*0.2, yg+sy*0.2);
				unitChoiceCanvasCtx.lineTo(xg+sy*0.3, yg+sy*0.05);
				unitChoiceCanvasCtx.lineTo(xg+sy*0.4, yg+sy*0.2);
				unitChoiceCanvasCtx.stroke();

				break;
				case 7:

				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.arc(xg-sx/3, yg, sy/2, Math.PI/2, Math.PI*3/2, false);
				unitChoiceCanvasCtx.lineTo(xg+sx/3,yg-sy/2);
				unitChoiceCanvasCtx.arc(xg+sx/3, yg, sy/2, Math.PI*3/2, Math.PI/2, false);
				unitChoiceCanvasCtx.closePath();
				unitChoiceCanvasCtx.stroke();

				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.arc(xg, yg-sy*0.25, sy/10, 0, Math.PI*2, false);
				unitChoiceCanvasCtx.closePath();
				unitChoiceCanvasCtx.stroke();

				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.moveTo(xg,yg-sy*0.15);
				unitChoiceCanvasCtx.lineTo(xg,yg-sy*0.1);
				unitChoiceCanvasCtx.lineTo(xg-sy*0.15,yg-sy*0.1);
				unitChoiceCanvasCtx.lineTo(xg+sy*0.1,yg-sy*0.1);
				unitChoiceCanvasCtx.lineTo(xg,yg-sy*0.15);
				unitChoiceCanvasCtx.lineTo(xg,yg+sy*0.15);
				unitChoiceCanvasCtx.stroke();

				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.arc(xg-sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
				unitChoiceCanvasCtx.lineTo(xg-sy*0.3, yg+sy*0.05);
				unitChoiceCanvasCtx.stroke();

				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.moveTo(xg-sy*0.3, yg+sy*0.05);
				unitChoiceCanvasCtx.lineTo(xg-sy*0.4, yg+sy*0.2);
				unitChoiceCanvasCtx.lineTo(xg-sy*0.3, yg+sy*0.05);
				unitChoiceCanvasCtx.lineTo(xg-sy*0.2, yg+sy*0.2);
				unitChoiceCanvasCtx.stroke();

				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.arc(xg+sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
				//unitChoiceCanvasCtx.lineTo(xg+sy*0.3, yg+sy*0.05);
				unitChoiceCanvasCtx.stroke();

				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.moveTo(xg+sy*0.3, yg+sy*0.05);
				unitChoiceCanvasCtx.lineTo(xg+sy*0.2, yg+sy*0.2);
				unitChoiceCanvasCtx.lineTo(xg+sy*0.3, yg+sy*0.05);
				unitChoiceCanvasCtx.lineTo(xg+sy*0.4, yg+sy*0.2);
				unitChoiceCanvasCtx.stroke();


				break;
				case 8:
				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.arc(xg-sx, yg+sy*13/16, sy*3/16, Math.PI/2, 0, true);
				unitChoiceCanvasCtx.arc(xg-sx+(sy*3/8), yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				unitChoiceCanvasCtx.arc(xg-sx+(sy*3/8)*2, yg+sy*13/16, sy*3/16, Math.PI, 0, true);
				unitChoiceCanvasCtx.arc(xg-sx+(sy*3/8)*3, yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				unitChoiceCanvasCtx.arc(xg-sx+(sy*3/8)*4, yg+sy*13/16, sy*3/16, Math.PI, 0, true);
				unitChoiceCanvasCtx.arc(xg-sx+(sy*3/8)*5, yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				unitChoiceCanvasCtx.arc(xg-sx+(sy*3/8)*6, yg+sy*13/16, sy*3/16, Math.PI, 0, true);
				unitChoiceCanvasCtx.arc(xg-sx+(sy*3/8)*7, yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				unitChoiceCanvasCtx.arc(xg-sx+(sy*3/8)*8, yg+sy*13/16, sy*3/16, Math.PI, 0, true);

				unitChoiceCanvasCtx.stroke();

				break;
				case 9:

				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.arc(xg-sx/2, yg, sy/3, Math.PI/3, Math.PI*5/3, false);
				//unitChoiceCanvasCtx.lineTo(xg+sx/3,yg-sy/2);
				unitChoiceCanvasCtx.arc(xg+sx/2, yg, sy/3, Math.PI*2/3, Math.PI*4/3, true);
				unitChoiceCanvasCtx.closePath();
				unitChoiceCanvasCtx.stroke();
				break;
				case 10:

				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.moveTo(xg-sx/4,yg-sy*3/4);
				unitChoiceCanvasCtx.lineTo(xg,yg-sy/3);
				unitChoiceCanvasCtx.lineTo(xg+sx/4,yg-sy*3/4);
				unitChoiceCanvasCtx.stroke();
				break;
				case 11:
				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.moveTo(xg-sx/2,yg-sy*3/5);
				unitChoiceCanvasCtx.lineTo(xg-sx/3,yg-sy/5);
				unitChoiceCanvasCtx.lineTo(xg+sx/3,yg-sy/5);
				unitChoiceCanvasCtx.lineTo(xg+sx/2,yg-sy*3/5);
				unitChoiceCanvasCtx.stroke();
				unitChoiceCanvasCtx.beginPath();
				unitChoiceCanvasCtx.moveTo(xg-sx/2,yg+sy*3/5);
				unitChoiceCanvasCtx.lineTo(xg-sx/3,yg+sy/5);
				unitChoiceCanvasCtx.lineTo(xg+sx/3,yg+sy/5);
				unitChoiceCanvasCtx.lineTo(xg+sx/2,yg+sy*3/5);
				unitChoiceCanvasCtx.stroke();
				break;

			}
			if(equaUnitDistribution){
				jeszcze = rownia[dth]-trownia[dth];
				unitChoiceCanvasCtx.fillStyle = "#FFFFFF";
				unitChoiceCanvasCtx.strokeStyle = "#444444";
				unitChoiceCanvasCtx.fillRect(xg+sx-sy*1.2,yg-sy*1.3,sy*1.2,sy*0.9);
				unitChoiceCanvasCtx.strokeRect(xg+sx-sy*1.2,yg-sy*1.3,sy*1.2,sy*0.9);
				//unitChoiceCanvasCtx.strokeRect(xg-24,yg-16,48,32);
				unitChoiceCanvasCtx.font = Math.floor(sy*0.8)+'pt Calibri';
				unitChoiceCanvasCtx.textAlign = "right";
				unitChoiceCanvasCtx.fillStyle = "#444444";
      			unitChoiceCanvasCtx.fillText(jeszcze, xg+sx, yg-sy*0.5);
				if(trownia[dth]<rownia[dth]){
					ot = rowniak[dth][trownia[dth]];
				} else {
					ot = "X";
				}
			} else {
				ot = oddy;
			}

			unitChoiceCanvasCtx.fillStyle = "#FFFFFF";
			unitChoiceCanvasCtx.fillStyle = "#444444";
			unitChoiceCanvasCtx.fillRect(xg-sx,yg+sy*0.1,sy*1.1,sy*0.9);
			//unitChoiceCanvasCtx.strokeRect(xg-24,yg-16,48,32);
			unitChoiceCanvasCtx.font = Math.floor(sy*0.8)+'pt Calibri';
			unitChoiceCanvasCtx.textAlign = "left";
			unitChoiceCanvasCtx.fillStyle = "#FFFFFF";
      		unitChoiceCanvasCtx.fillText(ot, xg-sx, yg+sy*0.9);
			if(dth==unitChoiceNumber){
				unitChoiceCanvasCtx.globalAlpha = 0.5;
				unitChoiceCanvasCtx.fillStyle = "#FFFFFF";
				unitChoiceCanvasCtx.fillRect(bq*50,aq*50,50,50);
				unitChoiceCanvasCtx.globalAlpha = 1;
			}
			
			if(bloknia[kolej][dth]){
				unitChoiceCanvasCtx.strokeStyle = '#888'
				unitChoiceCanvasCtx.fillStyle = '#ccc'
				
				unitChoiceCanvasCtx.fillRect(xg+sx*0.3,yg-sy*0.8,sx*0.7,sy*0.8)
				
				unitChoiceCanvasCtx.fillRect(xg+sx*0.4,yg-sy*1.2,sx*0.2,sy*0.6)
				unitChoiceCanvasCtx.fillRect(xg+sx*0.7,yg-sy*1.2,sx*0.2,sy*0.6)
				unitChoiceCanvasCtx.fillRect(xg+sx*0.4,yg-sy*1.2,sx*0.5,sy*0.2)
				
				unitChoiceCanvasCtx.strokeRect(xg+sx*0.3,yg-sy*0.8,sx*0.7,sy*0.8)
				unitChoiceCanvasCtx.strokeRect(xg+sx*0.4,yg-sy*1.2,sx*0.5,sy*0.4)
				unitChoiceCanvasCtx.strokeRect(xg+sx*0.6,yg-sy*1.0,sx*0.1,sy*0.2)

				unitChoiceCanvasCtx.fillStyle = '#888'
				unitChoiceCanvasCtx.fillRect(xg+sx*0.6,yg-sy*0.6,sx*0.1,sy*0.4)
				
			}
			bq++;
		}
		aq++;
	}
	//USUWANIE
	if(akcja==-2){
		unitChoiceCanvasCtx.strokeStyle = "#FFFF44";
	} else {
		unitChoiceCanvasCtx.strokeStyle = "#666666";
	}
	unitChoiceCanvasCtx.lineWidth = 2;
	if(unitChoiceNumber==-2){
		unitChoiceCanvasCtx.fillStyle = "#F8F8F8";
	} else {
		unitChoiceCanvasCtx.fillStyle = "#DDDDDD";
	}
	unitChoiceCanvasCtx.fillRect(2,150,100,40);
	unitChoiceCanvasCtx.strokeRect(2,150,100,40);
	unitChoiceCanvasCtx.font = '12pt Calibri';
	unitChoiceCanvasCtx.textAlign = "center";
	if(akcja==-2){
		unitChoiceCanvasCtx.fillStyle = "#FFFF44";
	} else {
		unitChoiceCanvasCtx.fillStyle = "#666666";
	}
    unitChoiceCanvasCtx.fillText("USUWANIE", 50, 177);
	
	//BLOKADA
	if(akcja==-3){
		unitChoiceCanvasCtx.strokeStyle = "#FFFF44";
	} else {
		unitChoiceCanvasCtx.strokeStyle = "#666666";
	}
	unitChoiceCanvasCtx.lineWidth = 2;
	if(unitChoiceNumber==-3){
		unitChoiceCanvasCtx.fillStyle = "#F8F8F8";
	} else {
		unitChoiceCanvasCtx.fillStyle = "#DDDDDD";
	}
	unitChoiceCanvasCtx.fillRect(103,150,95,40);
	unitChoiceCanvasCtx.strokeRect(103,150,95,40);
	unitChoiceCanvasCtx.font = '12pt Calibri';
	unitChoiceCanvasCtx.textAlign = "center";
	if(akcja==-3){
		unitChoiceCanvasCtx.fillStyle = "#FFFF44";
	} else {
		unitChoiceCanvasCtx.fillStyle = "#666666";
	}
    unitChoiceCanvasCtx.fillText("BLOKADA", 150, 177);
}
function unitDivisionDraw(){
	if(stan>1){
	unitDivisionCanvasCtx.fillStyle = "#000000";
	unitDivisionCanvasCtx.fillRect(0,0,220,50);
	if(zaznu==-1){
		kak = 0;
	} else {
		kak = zaznu;
	}
	if(zaznu!=-1){
	unitDivisionCanvasCtx.fillStyle = "#000000";
	unitDivisionCanvasCtx.lineWidth = 1;
	unitDivisionCanvasCtx.strokeStyle = kolox(kolej,0);
	unitDivisionCanvasCtx.fillStyle = kolox(kolej,1);
	unitDivisionCanvasCtx.fillRect(10,25,2*unix[kolej][kak].il,25);
	unitDivisionCanvasCtx.fillStyle = "#FFFFFF";
	unitDivisionCanvasCtx.globalAlpha = 0.2;
	unitDivisionCanvasCtx.fillRect(10+2*unitDivisionHighlight,25,2*unix[kolej][kak].il-2*unitDivisionHighlight,25);
	unitDivisionCanvasCtx.globalAlpha = 1;
	unitDivisionCanvasCtx.strokeRect(10,25,198,25);
	unitDivisionCanvasCtx.beginPath();
	unitDivisionCanvasCtx.moveTo(10+unitDivisionValue*2,20);
	unitDivisionCanvasCtx.lineTo(10+unitDivisionValue*2,50);
	unitDivisionCanvasCtx.stroke();
	unitDivisionCanvasCtx.strokeStyle = "#FFFFFF";
	unitDivisionCanvasCtx.beginPath();
	unitDivisionCanvasCtx.moveTo(10+unitDivisionHighlight*2,20);
	unitDivisionCanvasCtx.lineTo(10+unitDivisionHighlight*2,50);
	unitDivisionCanvasCtx.stroke();
	unitDivisionCanvasCtx.font = '8pt Calibri';
	unitDivisionCanvasCtx.textAlign = "right";
    	unitDivisionCanvasCtx.fillText(unitDivisionHighlight, 7+unitDivisionHighlight*2, 25);
	if(unitDivisionHighlight<unix[kolej][kak].il){
		unitDivisionCanvasCtx.textAlign = "left";
    		unitDivisionCanvasCtx.fillText(unix[kolej][kak].il-unitDivisionHighlight, 13+unitDivisionHighlight*2, 25);
	}

	if(unix[kolej][kak].rozb>0){
	unitDivisionCanvasCtx.strokeStyle = "#8888FF";
	unitDivisionCanvasCtx.fillStyle = "#8888FF";
	unitDivisionCanvasCtx.beginPath();
	unitDivisionCanvasCtx.moveTo(10+(unix[kolej][kak].il-(-unix[kolej][kak].rozb))*2,20);
	unitDivisionCanvasCtx.lineTo(10+(unix[kolej][kak].il-(-unix[kolej][kak].rozb))*2,50);
		unitDivisionCanvasCtx.textAlign = "center";
    	unitDivisionCanvasCtx.fillText("+"+unix[kolej][kak].rozb, 10+(unix[kolej][kak].il-(-unix[kolej][kak].rozb))*2, 15);
	unitDivisionCanvasCtx.stroke();
	}
	}
	}
}
function campaignChooseCanvasDraw(){
	campaignChooseCanvasCtx.clearRect(0,0,220,1000)
	for(var key in campaignGraphInPanel){
		var point = campaignGraphInPanel[key]
		
		campaignChooseCanvasCtx.strokeStyle = point.unlocked ? '#00b' : '#616161'
		campaignChooseCanvasCtx.fillStyle = point.unlocked ? '#88f' : '#bbb'
		campaignChooseCanvasCtx.lineWidth = 2
		
		if(campaignGraphChoose == key && point.unlocked){
			campaignChooseCanvasCtx.strokeStyle = '#ff0'
		}
		
		var rombWidth = 20
		campaignChooseCanvasCtx.beginPath()
		campaignChooseCanvasCtx.moveTo(point.x,point.y-rombWidth)
		campaignChooseCanvasCtx.lineTo(point.x+rombWidth,point.y)
		campaignChooseCanvasCtx.lineTo(point.x,point.y+rombWidth)
		campaignChooseCanvasCtx.lineTo(point.x-rombWidth,point.y)
		campaignChooseCanvasCtx.closePath()
		
		campaignChooseCanvasCtx.fill()
		campaignChooseCanvasCtx.stroke()
		
		campaignChooseCanvasCtx.font = '12pt Calibri';
		campaignChooseCanvasCtx.textAlign = "center";
		campaignChooseCanvasCtx.fillStyle = campaignChooseCanvasCtx.strokeStyle;
		campaignChooseCanvasCtx.fillText(key, point.x,point.y+6);
		
		var oldStrokeStyle = campaignChooseCanvasCtx.strokeStyle
		for(var i in point.to){
			var pointTo = campaignGraphInPanel[point.to[i]]
			
			if(!pointTo.unlocked){
				campaignChooseCanvasCtx.strokeStyle = '#616161'
				campaignChooseCanvasCtx.fillStyle = campaignChooseCanvasCtx.strokeStyle
			} else {
				campaignChooseCanvasCtx.strokeStyle = oldStrokeStyle
				campaignChooseCanvasCtx.fillStyle = campaignChooseCanvasCtx.strokeStyle
			}

			
			if(pointTo.x == point.x){
				campaignChooseCanvasCtx.beginPath()
				campaignChooseCanvasCtx.moveTo(point.x,point.y+rombWidth)
				campaignChooseCanvasCtx.lineTo(pointTo.x,pointTo.y-rombWidth)
				campaignChooseCanvasCtx.closePath()
				campaignChooseCanvasCtx.stroke()
				
				campaignChooseCanvasCtx.beginPath()
				campaignChooseCanvasCtx.moveTo(pointTo.x,pointTo.y-rombWidth)
				campaignChooseCanvasCtx.lineTo(pointTo.x-5,pointTo.y-rombWidth-5)
				campaignChooseCanvasCtx.lineTo(pointTo.x+5,pointTo.y-rombWidth-5)
				campaignChooseCanvasCtx.closePath()
				campaignChooseCanvasCtx.fill()
				campaignChooseCanvasCtx.stroke()
			} else if(pointTo.x != point.x && point.to.length >= 1){
				var sign = Math.sign(pointTo.x - point.x)
				campaignChooseCanvasCtx.beginPath()
				campaignChooseCanvasCtx.moveTo(point.x+rombWidth*sign,point.y)
				campaignChooseCanvasCtx.lineTo(pointTo.x,point.y)
				campaignChooseCanvasCtx.lineTo(pointTo.x,pointTo.y-rombWidth*sign)
				campaignChooseCanvasCtx.stroke()
				
				campaignChooseCanvasCtx.beginPath()
				campaignChooseCanvasCtx.moveTo(pointTo.x,pointTo.y-rombWidth)
				campaignChooseCanvasCtx.lineTo(pointTo.x-5,pointTo.y-rombWidth-5)
				campaignChooseCanvasCtx.lineTo(pointTo.x+5,pointTo.y-rombWidth-5)
				campaignChooseCanvasCtx.closePath()
				campaignChooseCanvasCtx.fill()
				campaignChooseCanvasCtx.stroke()
			} else if(pointTo.x != point.x && point.to.length == 1){
				var sign = Math.sign(pointTo.x - point.x)
				campaignChooseCanvasCtx.beginPath()
				campaignChooseCanvasCtx.moveTo(point.x,point.y+rombWidth*sign)
				campaignChooseCanvasCtx.lineTo(point.x,pointTo.y)
				campaignChooseCanvasCtx.lineTo(pointTo.x-rombWidth*sign,pointTo.y)
				campaignChooseCanvasCtx.stroke()
				
				campaignChooseCanvasCtx.beginPath()
				campaignChooseCanvasCtx.moveTo(pointTo.x-rombWidth*sign,pointTo.y)
				campaignChooseCanvasCtx.lineTo(pointTo.x-(rombWidth+5)*sign,pointTo.y-5*sign)
				campaignChooseCanvasCtx.lineTo(pointTo.x-(rombWidth+5)*sign,pointTo.y+5*sign)
				campaignChooseCanvasCtx.closePath()
				campaignChooseCanvasCtx.fill()
				campaignChooseCanvasCtx.stroke()
			}
		}
	}
}



/*
	Functions triggered when one of canvas from the left panel are moved
*/

function terrainChooseMove(){
	stg = terrainChooseNumber;
	terrainChooseNumber = Math.floor(mousePositionByCanvas.x/50);
	if(stg!=terrainChooseNumber){
		terrainChooseDraw();
	}
}
function teamChooseMove(){
	stg = teamChooseNumber;
	teamChooseNumber = Math.floor(mousePositionByCanvas.x/50)+Math.floor(mousePositionByCanvas.y/50)*4;
	if(stg!=teamChooseNumber){
		teamChooseDraw();
	}
}
function teamChoose2Move(){
	stg = teamChoose2Number;
	teamChoose2Number = Math.floor(mousePositionByCanvas.x/50)+Math.floor(mousePositionByCanvas.y/50)*4;
	if(stg!=teamChoose2Number){
		teamChoose2Draw();
	}
}
function unitChoiceMove(){
	stg = unitChoiceNumber;
	unitChoiceNumber = Math.floor(mousePositionByCanvas.x/50)+Math.floor(mousePositionByCanvas.y/50)*4;
	if(unitChoiceNumber>=12){
		unitChoiceNumber = -1;
		if(mousePositionByCanvas.x>0 && mousePositionByCanvas.x<100 && mousePositionByCanvas.y>150 && mousePositionByCanvas.y<190){
			unitChoiceNumber = -2;
		}
		if(mousePositionByCanvas.x>100 && mousePositionByCanvas.x<200 && mousePositionByCanvas.y>150 && mousePositionByCanvas.y<190){
			unitChoiceNumber = -3;
		}
	}
	if(stg!=unitChoiceNumber){
		unitChoiceDraw();
	}
}
function unitDivisionMove(){
	if(mousePositionByCanvas.x>12 && mousePositionByCanvas.x<210){
		unitDivisionHighlight = Math.floor((mousePositionByCanvas.x-10)/2);
	} else {
		unitDivisionHighlight = unitDivisionValue;
	}
	unitDivisionDraw();
}
function unitsInCityMove(){
	if(mousePositionByCanvas.x>10 && mousePositionByCanvas.x<210 && mousePositionByCanvas.y>10 && mousePositionByCanvas.y<130){
		unitsInCityNumber = Math.floor((mousePositionByCanvas.y-10)/30);
	} else {
		unitsInCityNumber = -1;
	}
	redrawCanvas(unitsInCityCanvasCtx);
}
function createUnitMove(){
	if(mousePositionByCanvas.x>10 && mousePositionByCanvas.x<210 && mousePositionByCanvas.y>10 && mousePositionByCanvas.y<130){
		createUnitNumber = Math.floor((mousePositionByCanvas.x-10)/50)+Math.floor((mousePositionByCanvas.y-10)/100*3)*4;
	} else {
		createUnitNumber = -1;
	}
	if(createUnitNumber>=12){
		createUnitNumber = -1;
	}
	redrawCanvas(createUnitCanvasCtx);
}
function upgradeCityMove(){
	upgradeCityNumber = -1;
	if(mousePositionByCanvas.y>=10 && mousePositionByCanvas.y<=90){
		a = 0;
		while(a<3){
			if(mousePositionByCanvas.x>10+70*a && mousePositionByCanvas.x<70+70*a){
				upgradeCityNumber = a;
			}
			a++;
		}
	}
	redrawCanvas(upgradeCityCanvasCtx);
}
function unitMergeMove(){
	if(mousePositionByCanvas.x>10 && mousePositionByCanvas.x<210 && mousePositionByCanvas.y>10 && mousePositionByCanvas.y<100){
		unitMergeChoice = Math.floor((mousePositionByCanvas.y-10)/30);
	} else {
		unitMergeChoice = -1;
	}
	redrawCanvas(unitMergeCanvasCtx);
}

function movesToMakeMove(){
	if(mousePositionByCanvas.x>10 && mousePositionByCanvas.x<210 && mousePositionByCanvas.y>10 && mousePositionByCanvas.y<130){
		movesTo = Math.floor((mousePositionByCanvas.y-10)/30);
	} else {
		movesToMakeNumber = -1;
	}
	redrawCanvas(movesToMakeCanvasCtx);
}

function campaignChooseCanvasMove(){
	campaignGraphChoose = -1
	if(mousePositionByCanvas.x>10 && mousePositionByCanvas.x<210 && mousePositionByCanvas.y>10 && mousePositionByCanvas.y<1000){
		
		for(var key in campaignGraphInPanel){
			var point = campaignGraphInPanel[key]
			if(Math.abs(mousePositionByCanvas.x - point.x) < 20 && Math.abs(mousePositionByCanvas.y - point.y) < 20){
				campaignGraphChoose = key
			}
		}
	} else {
		campaignGraphChoose = -1;
	}
	campaignChooseCanvasDraw()
}


/*
	Functions triggered when one of canvas from the left panel is clicked
*/

function terrainChooseClick(){
	if(akcja == terrainChooseNumber){
		akcja = -1;
	} else {
		akcja = terrainChooseNumber;
	}
	terrainChooseDraw();
}
function teamChooseClick(){
	dru[teamChooseNumber]++;
	//if(dru[teamChooseNumber]>6){
	if(dru[teamChooseNumber]>2){
		dru[teamChooseNumber] = 0;
	}
	teamChooseDraw();
}
function teamChoose2Click(){
	dru[teamChoose2Number]++;
	//if(dru[teamChooseNumber]>6){
	if(dru[teamChoose2Number]>2){
		dru[teamChoose2Number] = 0;
	}
	teamChoose2Draw();
}
function unitChoiceClick(){
	stawr = unitChoiceNumber;
	if(akcja == -3 && stawr >= 0 && stawr < 12){
		bloknia[kolej][stawr] = !bloknia[kolej][stawr]
	} else if(akcja!=stawr){
		akcja = stawr;
	} else {
		akcja = -1;
	}
	if(unitChoiceNumber != -1){
		zaznu = -1;
	}
	rek = "Wybierz jednostkę do rozmieszczenia:";
	switch(akcja){
		case 0:
		rek = "Piechota";
		break;
		case 1:
		rek = "Wojska pancerne";
		break;
		case 2:
		rek = "Artyleria";
		break;
		case 3:
		rek = "Piechota zmotoryzowana";
		break;
		case 4:
		rek = "Piechota górska";
		break;
		case 5:
		rek = "Wojska przeciwlotnicze";
		break;
		case 6:
		rek = "Lekkie okręty";
		break;
		case 7:
		rek = "Pancerniki";
		break;
		case 8:
		rek = "Łodzie desantowe";
		break;
		case 9:
		rek = "Lotnictwo";
		break;
		case 10:
		rek = "Samoloty powietrznodesantowe";
		break;
		case 11:
		rek = "Wojska saperskie";
		break;
	}
	infoo.innerHTML = rek;
	unitChoiceDraw();
}
function unitDivisionClick(){
	if(mousePositionByCanvas.x>12 && mousePositionByCanvas.x<210){
		unitDivisionValue = Math.floor((mousePositionByCanvas.x-10)/2);
	} else {

	}
	unitDivisionDraw();
}
function unitsInCityClick(){
	if(unitsInCityNumber>-1 && unitsInCityNumber>=4-heks[zaznx][zazny].unp){
		zaznu=heks[zaznx][zazny].unt[3-unitsInCityNumber];
		zaznaj(zaznu);
		zaznx = -1;zazny = -1;
	}

	redrawCanvas(unitsInCityCanvasCtx);
}
function createUnitClick(){
	if(!bloknia[kolej][createUnitNumber] && ((heks[zaznx][zazny].hutn>0 && heks[zaznx][zazny].prod>0) || ces[createUnitNumber]<=0) && heks[zaznx][zazny].unp<4){
		if(createUnitNumber>-1){
			a = Math.floor(createUnitNumber/4);
			b = createUnitNumber-a*4;
		}
		if(createUnitNumber>=0){
			dodai(zaznx,zazny,0,createUnitNumber,newUnitSizeRange.value);
			redrawCanvas(createUnitCanvasCtx);
		}
	}
}
function upgradeCityClick(){
	switch(upgradeCityNumber){
		case 0:
		heks[zaznx][zazny].zpl = upgradeCityRange.value;
		if(heks[zaznx][zazny].z-(-heks[zaznx][zazny].zpl)>1200)
		heks[zaznx][zazny].zpl = 1200-heks[zaznx][zazny].z;
		break;
		case 1:
		heks[zaznx][zazny].hutnpl = upgradeCityRange.value;
		if(heks[zaznx][zazny].hutn-(-heks[zaznx][zazny].hutnpl)>500)
		heks[zaznx][zazny].hutnpl = 500-heks[zaznx][zazny].hutn;
		break;
		case 2:
		heks[zaznx][zazny].prodpl = upgradeCityRange.value;
		if(heks[zaznx][zazny].prod-(-heks[zaznx][zazny].prodpl)>500)
		heks[zaznx][zazny].prodpl = 500-heks[zaznx][zazny].prod;
		break;
	}
	if(upgradeCityNumber>-1){
	kupuj(zaznx,zazny);

	}
	redrawCanvas(upgradeCityCanvasCtx);
}
function unitMergeClick(){
	if(unitMergeChoice>-1 && unitMergeChoice<heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unp-1){
		if(unix[kolej][zaznu].rodz==unix[kolej][heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unt[unitMergeChoice]].rodz && unix[kolej][zaznu].szyt==unix[kolej][heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unt[unitMergeChoice]].szyt){
			zespoj(zaznu,heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unt[unitMergeChoice]);
		} else if(unix[kolej][zaznu].szyt!="c" && unix[kolej][zaznu].szyt!="l" && unix[kolej][zaznu].szyt!="w" && unix[kolej][zaznu].szyt==szyt[unix[kolej][zaznu].rodz] && unix[kolej][heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unt[unitMergeChoice]].rodz==10){
			zezaladuj(zaznu,heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].unt[unitMergeChoice]);
		}
	}

	pokap();
}

function movesToMakeClick(){
	if(movesToMakeNumber>-1 && movesToMakeNumber<=ruchwkolejcen){
		//zaznu=heks[zaznx][zazny].unt[3-unitsInCityNumber];
		//zaznaj(zaznu);
		//zaznx = -1;zazny = -1;
	}

	redrawCanvas(movesToMakeCanvasCtx);
	
}

function campaignChooseCanvasClick(){
	tryChooseCampaign(campaignGraphChoose)
	campaignChooseCanvasDraw()
}

function changeRangeInput(sp,slaj){
	sp.innerHTML = slaj;
	if(sp == mapsizevalue){
		scian = slaj;
	}
	if(sp == landPercentageValue){
		prawdl = slaj;
	}
	if(sp == mountPercentageValue){
		prawdg = slaj;
	}
	if(sp == cityPercentageValue){
		miasy = slaj;
	}
	if(sp == unitSizeValue){
		oddy = slaj;
	}
	if(sp == citySizeValue){
		wielkul = slaj;
		if(slaj == 39){
			sp.innerHTML = languagewise({'pl':"Mała wartość losowa",'en':"Small random value"});
		}
	}
	if(sp == cityIronValue){
		wielkuliron = slaj;
		if(slaj == -1){
			sp.innerHTML = languagewise({'pl':"Los.",'en':"Rand."});
		}
	}
	if(sp == cityProdValue){
		wielkulprod = slaj;
		if(slaj == -1){
			sp.innerHTML = languagewise({'pl':"Los.",'en':"Rand."})
		}
	}
	if(sp == taxRangeValue){
		sp.innerHTML = slaj+"% ("+Math.floor(heks[zaznx][zazny].z*slaj/100)+"$)";
		//wielkul = slaj;
	}
	if(sp == newUnitSizeValue){
		sp.innerHTML = slaj;
	}
	if(sp == upgradeCityRangeValue){
		sp.innerHTML = slaj;
	}
}

//shows code window
function showcode(show){
	var cw = document.getElementById("codewindow");
	if(cw.style.display != "block" && show == undefined || show){
		cw.style.display = "block";
		getCode();
	} else {
		cw.style.display = "none";
	}
}

//changes map into code
function getCodeToString(){
	
	var infos = []
	
	if(stan >= 1){
		infos.push('unix='+getInfoAboutUnits())
		var druInfo = encodedPropertyValue('dru',dru)
		infos.push(druInfo)
		var defdrInfo = encodedPropertyValue('defdr',defdr)
		infos.push(defdrInfo)
		var oddidInfo = encodedPropertyValue('oddid',oddid)
		infos.push(oddidInfo)
		var oddnumInfo = encodedPropertyValue('oddnum',oddnum)
		infos.push(oddnumInfo)
		var blokniaInfo = encodedPropertyValue('bloknia',bloknia)
		infos.push(blokniaInfo)
	}
	
	var code = ":";
	code+=scian+(infos.length > 0 ? '['+infos.join(';')+']' : '')+":";
	a = 0;
	while(a<scian){
		b = 0;
		while(b<scian){
			code+=getHexCode(a,b)+":";
			b++;
		}
		a++;
	}
	return code
}

//changes map into code
function getCode(){
	var code = getCodeToString()
	codeField = document.getElementById("codeField");
	codeField.value = code;
}
function getInfoAboutUnits(){
	var infos = []
	
	for(var kolejIndex in unix){
		var kolejInfo = []
		if(kolejIndex == '-1')
			continue
		for(var unitIndex in unix[kolejIndex]){
			kolejInfo.push(unitIndex+'='+getUnitCode(kolejIndex,unitIndex)+'')
		}
		infos.push(kolejIndex+'=['+kolejInfo.join(';')+']')
	}
	
	return '['+infos.join(';')+']'
}
const emptyObject = new Object({
	
})
const hexCodeDefaults = {
	hutn:0,
	prod:0,
	zpl:0,
	hutnpl:0,
	prodpl:0,
	kasy:0,
	stali:0,
	nazwa:'',
}

const hexCodeDefaultsInUnitPlacement = {
	unt:{type:'array',size:4,def:-1,additionalMinusOne:true},
	undr:-1,
	unbr: -1,
	unp: 0,
	koli: 0,
	drogn: 0,
	drogp:{type:'array',size:0},
	drogk:{type:'array',size:0},
	drogpr:{type:'array',size:0},
	drogw:{type:'array',size:0},
	drogkol:{type:'array',size:0},
	drogg:{type:'array',size:0},
	drogd:{type:'array',size:0},

	drpon: 0,
	drpop:{type:'array',size:0},
	drpok:{type:'array',size:0},
	drpox:{type:'array',size:0},
	drpoy:{type:'array',size:0},

	wylad:{type:'array',size:4,def:-1},
	wyladr:{type:'array',size:4,def:-1},
	
	ktodro:{type:'array',size:12,def:{type:'array',size:0}},
	
	dpodatnum:0,
	dpodatk:{type:'array',size:0},
	dpodato:{type:'array',size:0},
	debix:-1,
	debiy:-1,
	dpodszlo:0,
	
	trybutariuszy:0,
	trybutariusze:{type:'array',size:0},
	

	podatpr:0,
	podatl:0,

	kask:0,
	kaska:0,
	niszcz: 0,

	most:{type:'array',size:6,def:0},
	
	cel_rodz:-1,
	cel_rodz_il:-1
}
function getHexCode(a,b){
	
	//      super(['x','y','z','hutn','prod','zpl','hutnpl','prodpl','kasy','stali','gran','zmiana','unt','undr','unbr','unp','pode','koli','tiest','nazwa','drogn','drogp','drogk','drogpr','drogw','drogkol','drogg','drogd','drpon','drpop','drpok','drpox','drpoy','wylad','wyladr','ktodro','dpodatnum','dpodatk','dpodato','debix','debiy','dpodszlo','trybutariuszy','trybutariusze','podatpr','podatl','kask','kaska','buchy','niszcz','plum','plumy','most','zazwa','zazwh','test','testColor','kolz','bylo','bydlo','waterbody','land','border'])

	
	
	var optionals = []
	
	var hex = heks[a][b]
	
	for(var key in hexCodeDefaults){
		var defvalue = hexCodeDefaults[key]
		//if(hex[key] != defvalue)
		//	optionals.push(key+'='+hex[key])
		if(!compareDefValue(hex[key],defvalue,hex)){
			var encoded = encodedPropertyValue(key,hex[key])
			optionals.push(encoded)
//				optionals.push(key+'='+hex[key])
		}
	}
	if(stan >= 1 || stan == -2){
		for(var key in hexCodeDefaultsInUnitPlacement){
			var defvalue = hexCodeDefaultsInUnitPlacement[key]
			if(!compareDefValue(hex[key],defvalue,hex)){

				var encoded = encodedPropertyValue(key,hex[key])
				optionals.push(encoded)
//				optionals.push(key+'='+hex[key])
			}
		}
	}
	return hex.z + (optionals.length > 0 ? '['+optionals.join(';')+']' : '')
}
const unitCodeDefaults = {
	x:-1,
	y:-1,
	d:-1,
	il:99,
	num:{type:'equality',size:0,property:'id'},
	id:-1,
	rodz:0,
	szyt:'n',
	szy:2,
	ruchy:0,
	ruchk:{type:'array',size:0},
	rucho:{type:'array',size:0},
	ruchh:0,
	
	sebix:{type:'equality',size:0,property:'x'},
	sebiy:{type:'equality',size:0,property:'y'},
	ata:-1,
	atakt:-1,
	kosz:false,
	kiero:0,
	przes:0,
	wypax:-1,
	wypay:-1,
	kolor:0,
	rozb:0,
	zalad:0,
	celd:-1,
	celu:-1,
	celk:-1,
	celen:0,
	celed:{type:'array',size:0},
	celeu:{type:'array',size:0}
}
function getUnitCode(druIx,index){
	
	if(druIx == -2)
		return
	var optionals = []
	
	var unit = unix[druIx][index]
	
	for(var key in unitCodeDefaults){
		var defvalue = unitCodeDefaults[key]
		//if(hex[key] != defvalue)
		//	optionals.push(key+'='+hex[key])
		
		if(!compareDefValue(unit[key],defvalue,unit)){
			var encoded = encodedPropertyValue(key,unit[key])
			optionals.push(encoded)
		}
	}
	return '['+optionals.join(';')+']'
}
function encodedPropertyValue(key,value){
	if(value instanceof Object){
		var innerValues = []
		for(var key2 in value){
			innerValues.push(encodedPropertyValue(key2,value[key2]))
		}
		return key+'=['+innerValues.join(';')+']'
	} else {
		return key+'='+value
	}
}
function compareDefValue(value,defvalue,parentvalue){
	if(defvalue instanceof Object){
		if(defvalue.type == 'array'){
			if(value.length != defvalue.size){
				return false
			}
			for(var i in value){
				if(defvalue.additionalMinusOne){
					if(i == '-1' && value[i] != null || i != '-1' && !compareDefValue(value[i],defvalue.def,value))
						return false
				} else {
					if(!compareDefValue(value[i],defvalue.def,value))
						return false
				}
			}
			return true
		} else if(defvalue.type == 'equality') {
			return value == parentvalue[defvalue.property] || value == undefined && parentvalue[defvalue.property] == undefined
		}
	} else {
		return value == defvalue || value == undefined && defvalue == undefined
	}
}
function readCode(){
	codeField = document.getElementById("codeField");
	var sta = codeField.value;
	readCodeFromString(sta)
}
function readCodeFromString(sta){
	removeUnits()
	fillAll(0)
	var ake = 0;
	var subfields = sta.split(':')
	for(var i in subfields){
		var subfield = subfields[i]
		if(subfield == '')
			continue
		if(ake == 0){
			ake = 1;
			//scian = subfield;
			readScianAndOtherData(subfield)
			a = 0;
			b = 0;
		} else	{
			var zzz = subfield.split('[')[0]
			
			if(a<scian){
				heks[a][b].z = Number(zzz);
				heks[a][b].hutn = 0;
				heks[a][b].prod = 0;
				heks[a][b].undr = -1;
				heks[a][b].unbr = -1;
				
				if(subfield.includes('[')){
					var otherFields = '['+subfield.split('[').slice(1).join('[')
					
					otherFields = splitArrayCode(otherFields)
					
					for(var i in otherFields){
						var key = otherFields[i].key
						var value = otherFields[i].value
						
						if(value.includes('[')){
							var unitFields = splitArrayCode(value)
							
							for(var j in unitFields){
								var value2 = unitFields[j].value
								if(/^[+-]?\d+(\.\d+)?$/.test(value2))
									value2 = Number(value2)
								if(value2 == 'null')
									value2 = null
								heks[a][b][key][unitFields[j].key] = value2
							}
						} else {
							if(/^[+-]?\d+(\.\d+)?$/.test(value))
								value = Number(value)
							heks[a][b][key] = value
						}
					}
				}
				b++;
				if(b>=scian){
					b = 0;
					a++;
				}
			}
		}
	}
}
const possibleArrayCodes = ['unix','dru','defdr','oddid','oddnum','bloknia']
function readScianAndOtherData(subfield){
	if(subfield.includes('[')){
		scian = subfield.split('[')[0]
		rest = '['+subfield.split('[').slice(1).join('[')
		
		data = splitArrayCode(rest)
		for(var i in data){
			var elem = data[i]
			
			if(possibleArrayCodes.includes(elem.key)){
				switch(elem.key){
					case "unix":
						readUnitsFromCode(elem.value)
						break
					case "bloknia":
						set2DArrayFromCode(elem.key,elem.value)
						break
					default:
						setArrayFromCode(elem.key,elem.value)
				}
			}
		}
	} else {
		scian = subfield
	}
}

function readUnitsFromCode(code){
	var arrayByTeam = splitArrayCode(code)
	
	for(var i in arrayByTeam){
		var key = arrayByTeam[i].key
		var value = arrayByTeam[i].value
		
		oddid[key] = 0
		oddnum[key] = 0
		
		unix[key].length = 0
		
		var arrayByUnit = splitArrayCode(value)
		for(var j in arrayByUnit){
			var key2 = arrayByUnit[j].key
			var value2 = arrayByUnit[j].value
			
			var unitArray = splitArrayCode(value2)
			
			var newUnitValues = createDefValueObject(unitCodeDefaults,unitArray)
			
			unix[key][key2] = new Unit(
				Number(newUnitValues.x),
				Number(newUnitValues.y),
				Number(newUnitValues.d),
				Number(newUnitValues.il),
				Number(newUnitValues.num),
				Number(newUnitValues.id),
				Number(newUnitValues.rodz)
			);
		}
	}
}
function createDefValueObject(unitCodeDefaults,unitArray){
	var newArray = {}
	for(var i in unitArray){
		var key = unitArray[i].key
		var value = unitArray[i].value
		newArray[key] = value
	}
	
	for(var key in unitCodeDefaults){
		if(!(key in newArray)){
			newArray[key] = realizeDefault(newArray, unitCodeDefaults[key])
		}
	}
	
	return newArray
}
function realizeDefault(array, defaultValue){
	if(defaultValue instanceof Object){
		if(defaultValue.type == 'array'){
			var result = []
			for(var i = 0;i<defaultValue.size;i++){
				result.push(realizeDefault(array[key], defaultValue.def))
			}
			return result
		} else if(defaultValue.type == 'equality'){
			return array[defaultValue.property]
		}
	} else {
		return defaultValue
	}
}
function splitArrayCode(str){
	if(!(str[0] == '[' && str[str.length-1] == ']'))
		return null
		
	var newStr = str.slice(1,-1)
	var level = 0
	var splitted = []
	var lastSplit = 0
	for(var i = 0;i<newStr.length;i++){
		var char = newStr.substr(i,1)
		if(char == '[')
			level++
		if(char == ']')
			level--
		if(char == ';' && level == 0){
			splitted.push(newStr.substring(lastSplit,i))
			lastSplit = i+1
		}
	}
	splitted.push(newStr.substring(lastSplit))
	return splitted.map(x=>new Object({key:x.split('=')[0], value:x.split('=').slice(1).join('=')})).filter(x=>x.key != '')
}
function setArrayFromCode(key,value){
	var arrayData = splitArrayCode(value)
	
	for(var i in arrayData){
		var arrayDatum = arrayData[i]
		
		var value2 = arrayDatum.value
		if(/^[+-]?\d+(\.\d+)?$/.test(value2))
			value2 = Number(value2)
		window[key][arrayDatum.key] = value2
	}
}
function set2DArrayFromCode(key,value){
	var arrayData = splitArrayCode(value)
	
	for(var i in arrayData){
		var arrayDatum = arrayData[i]

		var value2 = arrayDatum.value
		var arrayData2 = splitArrayCode(value2)
		for(var j in arrayData2){
			var arrayDatum2 = arrayData2[j]
			
			var value3 = arrayDatum2.value
			if(value3 == 'true')
				value3 = true
			if(value3 == 'false')
				value3 = false
			window[key][arrayDatum.key][arrayDatum2.key] = value3
		}
	}
}
function readCodeWtf(){
	codeField = document.getElementById("codeField");
	var sta = codeField.value;
	var ek = 1;
	var ik = 1;
	var ake = 0;
	while(ik<sta.length){
		if(ake == 0){
			if(sta.substr(ik,1)==":"){
				ake = 1;
				scian = sta.substring(ek,ik);
				a = 0;
				b = 0;
				ek = ik+1;
			}
		} else	{
			if(sta.substr(ik,1)==":"){
				if(a<scian){
					heks[a][b].z = sta.substring(ek,ik);
					b++;
					if(b>=scian){
						b = 0;
						a++;
					}
				}
				ek = ik+1;
			}
		}
		ik++;
	}
}

//check if any of teams is selected
function checkTeams(){
	w = 0;
	var su = false;
	while(w<12){
		if(dru[w]!=0){
			su = true;
			w = 12;
		}
		w++;
	}
	return su;
}
function changeScreenWidth(w){
	var prawo = document.getElementById('right')
	var tutorial = document.getElementById('tutorial')
	mainCanvas.width = w;
	mainCanvas.height = w;
	aroundcanv.style.height = w+"px";
	aroundcanv.style.width = w+"px";
	/*
	if(w==1000){
		prawo.style.marginTop = "100px";
	} else if(w==1200){
		prawo.style.marginTop = "170px";
	} else {
		prawo.style.marginTop = "0px";
	}*/
	prawo.style.height = w+"px"
	tutorial.style.height = w+"px"
	changeMountPercentageInputa()
	ctx=mainCanvas.getContext("2d");
	redraw(true);
}
function changeMountPercentageInputa(){
	var width = mainCanvas.width
	if(tutorial){
		document.getElementById('mountPercentageInputa').style.width = (540+Number(width))+'px'
	} else {
		document.getElementById('mountPercentageInputa').style.width = (275+Number(width))+'px'
	}
}
function makeTaxPath(){
	if(zaznx>-1){
		if(heks[zaznx][zazny].podatpr==0){
			odpodatkuj(zaznx,zazny);
			odzaznam();
			warta = Math.floor(dohod(zaznx,zazny)*taxRange.value/100);
			if(warta>0){
				zaznam(zaznx,zazny,warta-heks[zaznx][zazny].dpodszlo);
				taxRange.disabled = true;

			}
		} else {
				odpodatkuj(zaznx,zazny);
				pokap();
				zatw.value = "ZATWIERDŹ";
		}
	}
}
function sellSteelXY(val,x,y){
		var agq = 0;
		while(heks[x][y].stali>0 && agq<val){
			heks[x][y].stali--;
			heks[x][y].kasy+=2;
			agq++;
		}	
}
function sellSteel(val){
	if(zaznx>-1){
		var agq = 0;
		while(heks[zaznx][zazny].stali>0 && agq<val){
			heks[zaznx][zazny].stali--;
			heks[zaznx][zazny].kasy+=2;
			agq++;
		}
		pokap();
	}
}

function tryEndGame(){
	if(confirm(languagewise({pl:"Czy na pewno chcesz zakończyć grę i wrócić do menu?",en:"Do you really want to end the game and go back to the menu?"}))){
		endGame(0)
	}
}
function tryRestartGame(){
	if(confirm(languagewise({pl:"Czy na pewno chcesz zrestartować grę?",en:"Do you really want to restart the game?"}))){
		var gg = granaGra
		var cgs = campaignGraphSet
		var tut = tutorial
		var lt = lekcjaTutoriala
		var pt = przejszty
		
		removeUnits();
		changeState(0);
		redraw(true)
		initialize(0)
		changeState(1)
		
		granaGra = gg
		readCodeFromString(granaGra)
		próbujGrać()
		campaignGraphSet = cgs
		tutorial = tut
		lekcjaTutoriala = lt
		przejszty = pt
		changeState(2)
	}
}
function endGame(sty){
	removeUnits();
	changeState(sty);
	redraw(true)
	initialize(sty)
}
function generateTerrainAndArmies(){
	var configuration = document.getElementById('select-configuration').value + '-'
	
	var stack = []
	var curstack = stack
	var str = ''
	for(var i in configuration){
		var c = configuration[i]
		
		if(c == '-'){
			if(str != ''){
				curstack.push(str)
			}
			str = ''
		} else if(c == '['){
			curstack = []
			stack.push(curstack)
		} else if(c == ']'){
			curstack.push(str)
			str = ''
			curstack = stack
		} else {
			str += c
		}
	}
	
	var typ = curstack[3]
	switch(typ){
		case 'land':
		case 'poorland':
		case 'bigarmy':
		case 'largearmy':
			prawdl = 65
			prawdg = 10
			scian = Number(stack[0])
			generateTerrain();smoothenCoastline();smoothenCoastline();
			miasy = Number(stack[1].reduce((a,b)=>Number(a)+Number(b),0))
			rearrangeCities(true,typ == 'poorland' ? 0.25 : 1);
			addCitiesAccordingToStack(stack[1],stack[2])
			if(typ == 'bigarmy')
				addBigArmies(1)
			if(typ == 'largearmy')
				addBigArmies(2)
			break
	}
}
function addCitiesAccordingToStack(cityStack, powerStack){
	var cities = []
	a = 0;
	while(a<scian){
		b = 0;
		while(b<scian){
			if(heks[a][b].z>0){
				cities.push(heks[a][b])
			}
			b++;
		}
		a++;
	}
	if(cityStack.length == 2){
		kolej = 0
		for(var i = 0;i<cities.length && i<cityStack[0];i++){
			var city = cities[i]
			var ciss = powerStack[0]
			while(ciss > 0 && !Number.isNaN(Number(powerStack[0]))){
				if(ciss > 99){
					dodai(city.x,city.y,99,0,0)
					ciss-=99
				} else {
					dodai(city.x,city.y,ciss,0,0)
					ciss = 0
				}
			}
		}
		kolej = 1
		for(var j = 0;j<cities.length && j<cityStack[1];j++){
			var city = cities[cities.length-j-1]
			var ciss = powerStack[1]
			while(ciss > 0 && !Number.isNaN(Number(powerStack[1]))){
				if(ciss > 99){
					dodai(city.x,city.y,99,0,0)
					ciss-=99
				} else {
					dodai(city.x,city.y,ciss,0,0)
					ciss = 0
				}
			}
		}
		if(dru[0] == 0)
			dru[0] = 2
		if(dru[1] == 0)
			dru[1] = 1
	} else if(cityStack.length == 4){
		var ciso = cities.sort((a,b)=>a.y-b.y)
		var cities_top = ciso.slice(0,Math.floor(ciso.length / 2)).sort((a,b)=>a.x-b.x)
		var cities_bottom = ciso.slice(Math.floor(ciso.length / 2)).sort((a,b)=>a.x-b.x)
		kolej = 0
		for(var i = 0;i<cities_top.length && i<cityStack[0];i++){
			var city = cities_top[i]
			var ciss = powerStack[0]
			while(ciss > 0 && !Number.isNaN(Number(powerStack[0]))){
				if(ciss > 99){
					dodai(city.x,city.y,99,0,0)
					ciss-=99
				} else {
					dodai(city.x,city.y,ciss,0,0)
					ciss = 0
				}
			}
		}
		kolej = 2
		for(var j = 0;j<cities_top.length && j<cityStack[1];j++){
			var city = cities_top[cities_top.length-j-1]
			var ciss = powerStack[1]
			while(ciss > 0 && !Number.isNaN(Number(powerStack[1]))){
				if(ciss > 99){
					dodai(city.x,city.y,99,0,0)
					ciss-=99
				} else {
					dodai(city.x,city.y,ciss,0,0)
					ciss = 0
				}
			}
		}
		kolej = 1
		for(var i = 0;i<cities_bottom.length && i<cityStack[2];i++){
			var city = cities_bottom[i]
			var ciss = powerStack[2]
			while(ciss > 0 && !Number.isNaN(Number(powerStack[2]))){
				if(ciss > 99){
					dodai(city.x,city.y,99,0,0)
					ciss-=99
				} else {
					dodai(city.x,city.y,ciss,0,0)
					ciss = 0
				}
			}
		}
		kolej = 3
		for(var j = 0;j<cities_bottom.length && j<cityStack[3];j++){
			var city = cities_bottom[cities_bottom.length-j-1]
			var ciss = powerStack[3]
			while(ciss > 0 && !Number.isNaN(Number(powerStack[3]))){
				if(ciss > 99){
					dodai(city.x,city.y,99,0,0)
					ciss-=99
				} else {
					dodai(city.x,city.y,ciss,0,0)
					ciss = 0
				}
			}
		}
		if(dru[0] == 0)
			dru[0] = 2
		if(dru[1] == 0)
			dru[1] = 2
		if(dru[2] == 0)
			dru[2] = 1
		if(dru[3] == 0)
			dru[3] = 2
	}
}
function addBigArmies(width){
	var x1 = Math.round(scian/2)
	for(var i = 0;i<width;i++){
		for(var j = 0;j<scian;j++){
			var x2 = x1-i-1
			var x3 = x1+i
			kolej = 0
			if(heks[x2][j].z != -1 && (heks[x2][j].z <= 0 || heks[x2][j].undr == kolej)){
				for(var k = 0;k<4 && heks[x2][j].unp < 4;k++){
					dodai(x2,j,99,0,0)
				}
			}
			kolej = 1
			if(heks[x3][j].z != -1 && (heks[x3][j].z <= 0 || heks[x3][j].undr == kolej)){
				for(var k = 0;k<4 && heks[x3][j].unp < 4;k++){
					dodai(x3,j,99,0,0)
				}
			}
		}
	}
}
function próbujGrać(){
	var jestdrużyna = false
	for(var i = 0;i<12/* && !jestdrużyna*/;i++){
		spis(i);
		if(liczeb[i] > 0)
			jestdrużyna = true
	}
	if(jestdrużyna){
		kolej = 0;
		changeState(2);
		granaGra = getCodeToString()
		gameplay = true;
	} else {
		alert("Ustaw chociaż jeden oddział!")
	}
}
function rescaleStatisticCanvas(){
	var height = 340
	var number = 0
	for(var i = 0;i<12;i++){
		if(dru[i] != 0)
			number++
	}
	if(number > 8)
		height *= 3
	else if(number > 4)
		height *= 2
		
	statisticsCanvas.height = height
	statisticsCanvasCtx = statisticsCanvas.getContext('2d')
	statisticsCanvas2.height = height
	statisticsCanvasCtx2 = statisticsCanvas2.getContext('2d')
	statisticsCanvas3.height = height
	statisticsCanvasCtx3 = statisticsCanvas3.getContext('2d')
}

