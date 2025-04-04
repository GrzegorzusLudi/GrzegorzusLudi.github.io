﻿function drawHex(numb){
	if(numb==1){
	au = magni*472*(mainCanvas.width/800)/(scian-(-0.5));
	bu = magni*723*(mainCanvas.height/800)/Math.sqrt(3)/(scian-(-1));
	x0 = 10+au*3/2*((this.x-scian/2+pox)+scian/magni/2+2/3);
	if(this.x%2 == 0){
		y0 = 10+bu*Math.sqrt(3)*((this.y-scian/2+poy)+scian/magni/2+0.5);
	} else {
		y0 = 10+bu*Math.sqrt(3)*((this.y-scian/2+poy)+scian/magni/2+1);
	}
	ctx.strokeStyle = "#666666";
	ctx.lineWidth = 1;
	if(this.z == -1){
		ctx.fillStyle = /*"#819AB5"*/"#819AB5";
	} else {
		ctx.fillStyle = /*"#98C288"*/"#98C288";
	}
	switch(this.pode){
		case 1:
		if(this.z == -1){
			ctx.fillStyle = "#DDE5ED";
		} else {
			ctx.fillStyle = "#DEEDD8";
		}
		break;
		case 2:
		if(this.z == -1){
			ctx.fillStyle = "#A7BBD1";
		} else {
			ctx.fillStyle = "#B0D1A3";
		}
		break;
		case 3:
		if(this.z == -1){
			ctx.fillStyle = "#94A4B5";
		} else {
			ctx.fillStyle = "#A9C49F";
		}
		break;
	}
	if(zaznx == this.x && zazny == this.y){
		tumor = true;
	} else {
		tumor = false;
	}
	if(podswx == this.x && podswy == this.y){
		ctx.fillStyle = "#EEEECC";
	}
		ctx.beginPath();
		ctx.moveTo(x0-au/2,y0-Math.sqrt(3)/2*bu);
		ctx.lineTo(x0+au/2,y0-Math.sqrt(3)/2*bu);
		ctx.lineTo(x0+au,y0);
		ctx.lineTo(x0+au/2,y0+Math.sqrt(3)/2*bu);
		ctx.lineTo(x0-au/2,y0+Math.sqrt(3)/2*bu);
		ctx.lineTo(x0-au,y0);
		ctx.closePath();
		ctx.fill();
		if(this.pode == 0 && !(podswx == this.x && podswy == this.y) && this.niszcz>0 && this.z!=-1){
			ctx.globalAlpha = this.niszcz/100;
			ctx.fillStyle = "#9E9672";
			ctx.fill();
			ctx.globalAlpha = 1;
		}
	if(this.z != -1){
		if(this.border[0]!=null && this.border[0].z==-1){
			ctx.fillStyle = "#739167";
			ctx.beginPath();
			ctx.moveTo(x0-au/2,y0-Math.sqrt(3)/2*bu);
			ctx.lineTo(x0+au/2,y0-Math.sqrt(3)/2*bu);
			ctx.lineTo(x0+au/2*0.875,y0-Math.sqrt(3)/2*bu*0.875);
			ctx.lineTo(x0-au/2*0.875,y0-Math.sqrt(3)/2*bu*0.875);
			ctx.closePath();
			ctx.fill();
		}
		if(this.border[1]!=null && this.border[1].z==-1){
			ctx.fillStyle = "#739167";
			ctx.beginPath();
			ctx.moveTo(x0+au,y0);
			ctx.lineTo(x0+au/2,y0-Math.sqrt(3)/2*bu);
			ctx.lineTo(x0+au/2*0.875,y0-Math.sqrt(3)/2*bu*0.875);
			ctx.lineTo(x0+au*0.8125,y0);
			ctx.closePath();
			ctx.fill();
		}
		if(this.border[2]!=null && this.border[2].z==-1){
			ctx.fillStyle = "#B3E3A1";
			ctx.beginPath();
			ctx.moveTo(x0+au,y0);
			ctx.lineTo(x0+au/2,y0+Math.sqrt(3)/2*bu);
			ctx.lineTo(x0+au/2*0.8125,y0+Math.sqrt(3)/2*bu*0.8125);
			ctx.lineTo(x0+au*0.8125,y0);
			ctx.closePath();
			ctx.fill();
		}
		if(this.border[3]!=null && this.border[3].z==-1){
			ctx.fillStyle = "#B3E3A1";
			ctx.beginPath();
			ctx.moveTo(x0-au/2,y0+Math.sqrt(3)/2*bu);
			ctx.lineTo(x0+au/2,y0+Math.sqrt(3)/2*bu);
			ctx.lineTo(x0+au/2*0.8125,y0+Math.sqrt(3)/2*bu*0.8125);
			ctx.lineTo(x0-au/2*0.8125,y0+Math.sqrt(3)/2*bu*0.8125);
			ctx.closePath();
			ctx.fill();
		}
		if(this.border[4]!=null && this.border[4].z==-1){
			ctx.fillStyle = "#B3E3A1";
			ctx.beginPath();
			ctx.moveTo(x0-au,y0);
			ctx.lineTo(x0-au/2,y0+Math.sqrt(3)/2*bu);
			ctx.lineTo(x0-au/2*0.8125,y0+Math.sqrt(3)/2*bu*0.8125);
			ctx.lineTo(x0-au*0.8125,y0);
			ctx.closePath();
			ctx.fill();
		}
		if(this.border[5]!=null && this.border[5].z==-1){
			ctx.fillStyle = "#739167";
			ctx.beginPath();
			ctx.moveTo(x0-au,y0);
			ctx.lineTo(x0-au/2,y0-Math.sqrt(3)/2*bu);
			ctx.lineTo(x0-au/2*0.875,y0-Math.sqrt(3)/2*bu*0.875);
			ctx.lineTo(x0-au*0.8125,y0);
			ctx.closePath();
			ctx.fill();
		}
	}
		ctx.beginPath();
		ctx.moveTo(x0-au/2,y0-Math.sqrt(3)/2*bu);
		ctx.lineTo(x0+au/2,y0-Math.sqrt(3)/2*bu);
		ctx.lineTo(x0+au,y0);
		ctx.lineTo(x0+au/2,y0+Math.sqrt(3)/2*bu);
		ctx.lineTo(x0-au/2,y0+Math.sqrt(3)/2*bu);
		ctx.lineTo(x0-au,y0);
		ctx.closePath();
		ctx.stroke();
	if(this.z == -1){
	ctx.strokeStyle = /*"#666666"*/"#666666";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(x0-au*0.5,y0-Math.sqrt(3)/2*bu*0.5);
	ctx.lineTo(x0-au*0.25,y0-Math.sqrt(3)/2*bu*0.75);
	ctx.lineTo(x0,y0-Math.sqrt(3)/2*bu*0.5);
	ctx.lineTo(x0+au*0.25,y0-Math.sqrt(3)/2*bu*0.75);
	ctx.lineTo(x0+au*0.5,y0-Math.sqrt(3)/2*bu*0.5);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(x0-au*0.75,y0-Math.sqrt(3)/2*bu*0);
	ctx.lineTo(x0-au*0.5,y0-Math.sqrt(3)/2*bu*0.25);
	ctx.lineTo(x0-au*0.25,y0-Math.sqrt(3)/2*bu*0);
	ctx.lineTo(x0-au*0,y0-Math.sqrt(3)/2*bu*0.25);
	ctx.lineTo(x0+au*0.25,y0-Math.sqrt(3)/2*bu*0);
	ctx.lineTo(x0+au*0.5,y0-Math.sqrt(3)/2*bu*0.25);
	ctx.lineTo(x0+au*0.75,y0-Math.sqrt(3)/2*bu*0);
	ctx.stroke();
	ctx.moveTo(x0-au*0.5,y0+Math.sqrt(3)/2*bu*0.5);
	ctx.lineTo(x0-au*0.25,y0+Math.sqrt(3)/2*bu*0.25);
	ctx.lineTo(x0,y0+Math.sqrt(3)/2*bu*0.5);
	ctx.lineTo(x0+au*0.25,y0+Math.sqrt(3)/2*bu*0.25);
	ctx.lineTo(x0+au*0.5,y0+Math.sqrt(3)/2*bu*0.5);
	ctx.stroke();

	if(this.plum>0){

      ctx.beginPath();
      ctx.arc(x0, y0, au*0.8*this.plumy/10, 0, 2 * Math.PI, false);
      ctx.lineWidth = this.plum/(this.plumy+10)*4;
      ctx.strokeStyle = '#ccccff';
      ctx.stroke();
	}

		var av  = 0;
		while(av<6){
			if(this.most[av]>0){
				if(this.unt[-1]!=null && unix[-2][this.unt[-1]].kolor>0)
					ctx.fillStyle = "#B59B77";
				else
					ctx.fillStyle = "#634A29";
				var strok = false;
				if(podswd==-2 && podswu==this.unt[-1]){
					ctx.strokeStyle = "#FFFF00";
					strok = true;
				}
				ctx.beginPath();
				ctx.moveTo(x0,y0);
				var bv = 0;
					if(bv==av){
						ctx.moveTo(x0+kir((bv+5)%6,(bv+1)%6,"x")*3,y0+kir((bv+5)%6,(bv+1)%6,"y")*3);
					} else if((bv-av+6)%6==5){
						ctx.moveTo(x0+kir((av+4)%6,(av+5)%6,"x")*(this.most[av]/100)+kir((av+5)%6,(av+1)%6,"x")*3,y0+kir((av+4)%6,(av+5)%6,"y")*(this.most[av]/100)+kir((av+5)%6,(av+1)%6,"y")*3);
					} else if((bv-av+6)%6==1){
						ctx.moveTo(x0+kir((av+1)%6,(av+2)%6,"x")*(this.most[av]/100)+kir((av+5)%6,(av+1)%6,"x")*3,y0+kir((av+1)%6,(av+2)%6,"y")*(this.most[av]/100)+kir((av+5)%6,(av+1)%6,"y")*3);
					} else {
						ctx.moveTo(x0+kir((bv+5)%6,(bv+1)%6,"x")*(this.most[av]/100)*2,y0+kir((bv+5)%6,(bv+1)%6,"y")*(this.most[av]/100)*2);
					}
				bv  = 1;
				while(bv<6){
					if(bv==av){
						ctx.lineTo(x0+kir((bv+5)%6,(bv+1)%6,"x")*3,y0+kir((bv+5)%6,(bv+1)%6,"y")*3);
					} else if((bv-av+6)%6==5){
						ctx.lineTo(x0+kir((av+4)%6,(av+5)%6,"x")*(this.most[av]/100)+kir((av+5)%6,(av+1)%6,"x")*3,y0+kir((av+4)%6,(av+5)%6,"y")*(this.most[av]/100)+kir((av+5)%6,(av+1)%6,"y")*3);
					} else if((bv-av+6)%6==1){
						ctx.lineTo(x0+kir((av+1)%6,(av+2)%6,"x")*(this.most[av]/100)+kir((av+5)%6,(av+1)%6,"x")*3,y0+kir((av+1)%6,(av+2)%6,"y")*(this.most[av]/100)+kir((av+5)%6,(av+1)%6,"y")*3);
					} else {
						ctx.lineTo(x0+kir((bv+5)%6,(bv+1)%6,"x")*(this.most[av]/100)*2,y0+kir((bv+5)%6,(bv+1)%6,"y")*(this.most[av]/100)*2);
					}
					bv++;
				}
				ctx.closePath();
				ctx.fill();
				if(strok)
					ctx.stroke();
			}
			av++;
		}
	}
	if(this.z == -2){
		ctx.strokeStyle = "#666666";
		ctx.fillStyle = "#DDDDDD";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(x0-au*0,y0-Math.sqrt(3)/2*bu*1.25);
		ctx.lineTo(x0+au*1,y0-Math.sqrt(3)/2*bu*0);
		ctx.lineTo(x0+au*0.5,y0+Math.sqrt(3)/2*bu*1);
		ctx.lineTo(x0-au*0.5,y0+Math.sqrt(3)/2*bu*1);
		ctx.lineTo(x0-au*1,y0-Math.sqrt(3)/2*bu*0);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = "#FFFFFF";
		ctx.beginPath();
		ctx.moveTo(x0-au*0,y0-Math.sqrt(3)/2*bu*1.25);
		ctx.lineTo(x0+au*0.5,y0-Math.sqrt(3)/2*bu*0.625);
		ctx.lineTo(x0+au*0,y0-Math.sqrt(3)/2*bu*0.25);
		ctx.lineTo(x0-au*0.5,y0-Math.sqrt(3)/2*bu*0.625);
		ctx.fill();

		ctx.fillStyle = "#888888";
		ctx.globalAlpha = 0.3;
		ctx.beginPath();
		ctx.moveTo(x0-au*0,y0-Math.sqrt(3)/2*bu*1.25);
		ctx.lineTo(x0+au*1,y0-Math.sqrt(3)/2*bu*0);
		ctx.lineTo(x0+au*0.5,y0+Math.sqrt(3)/2*bu*1);
		ctx.closePath();
		ctx.fill();
		ctx.globalAlpha = 1;

	}


	if(this.kolz>-1){

		ctx.fillStyle = kolox(this.kolz,1);
		if(this.z<=0){
			ctx.fillRect(x0-au/10,y0-bu/10,au/5,bu/5);
			ctx.fillRect(x0-au/10-au/2,y0-bu/10,au/5,bu/5);
			ctx.fillRect(x0-au/10+au/2,y0-bu/10,au/5,bu/5);
			ctx.fillRect(x0-au/10-au/4,y0-bu/10-bu/2,au/5,bu/5);
			ctx.fillRect(x0-au/10+au/4,y0-bu/10-bu/2,au/5,bu/5);
			ctx.fillRect(x0-au/10-au/4,y0-bu/10+bu/2,au/5,bu/5);
			ctx.fillRect(x0-au/10+au/4,y0-bu/10+bu/2,au/5,bu/5);
		}
		var f = 0;
		while(f<6){
			if(this.border[f]!=null){
				if(this.border[f].kolz!=this.kolz){
					ctx.beginPath();
					ctx.moveTo(x0+kir(f,(f-1)%6,"x")*2,y0+kir(f,(f-1)%6,"y")*2);
					ctx.lineTo(x0+kir(f,(f+1)%6,"x")*2,y0+kir(f,(f+1)%6,"y")*2);
					ctx.lineTo(x0+kir(f,(f+1)%6,"x")*1.6,y0+kir(f,(f+1)%6,"y")*1.6);
					ctx.lineTo(x0+kir(f,(f-1)%6,"x")*1.6,y0+kir(f,(f-1)%6,"y")*1.6);
					ctx.closePath();
					ctx.fill();
				}
			}
			f++;
		}
	}

	if(this.z > 0){
		defic = 0;
		ofz = this.z*2;
		if(ofz>0 && ofz<=200){
			budyn(x0-0.125*au,y0,ofz/2,this.koli,this.unbr);
			budyn(x0+0.125*au,y0,ofz/2,this.koli,this.unbr);
		} else if(ofz<=700){
			if(ofz/5-40<30){
				defic = 30-ofz/5+40;
			}
			budyn(x0-0.375*au,y0,ofz/5-40+defic*3/2,this.koli,this.unbr);
			budyn(x0-0.125*au,y0,ofz/5+60-defic*2/3,this.koli,this.unbr);
			budyn(x0+0.125*au,y0,ofz/5+60-defic*2/3,this.koli,this.unbr);
			budyn(x0+0.375*au,y0,ofz/5-40+defic*3/2,this.koli,this.unbr);

			budyn(x0,y0+0.125*bu,ofz/5-40+defic*3/2,this.koli,this.unbr);

		} else if(ofz<1350){
			if(ofz*2/13-1200/13<30){
				defic = 30-ofz*2/13+1200/13;
			}
			budyn(x0-0.25*au,y0-0.125*bu,ofz*2/13-1200/13+defic*3/2,this.koli,this.unbr);
			budyn(x0,y0-0.125*bu,ofz*2/13-1200/13+defic*3/2,this.koli,this.unbr);
			budyn(x0+0.25*au,y0-0.125*bu,ofz*2/13-1200/13+defic*3/2,this.koli,this.unbr);

			budyn(x0-0.375*au,y0,ofz/13+600/13,this.koli,this.unbr);
			budyn(x0-0.125*au,y0,ofz*2/13+1200/13-defic*2/3,this.koli,this.unbr);
			budyn(x0+0.125*au,y0,ofz*2/13+1200/13-defic*2/3,this.koli,this.unbr);
			budyn(x0+0.375*au,y0,ofz/13+600/13,this.koli,this.unbr);


			budyn(x0,y0+0.125*bu,ofz/13+600/13,this.koli,this.unbr);
		} else {
			if(ofz/7-1350/7<40){
				defic = 40-ofz/7+1350/7;
			}
			budyn(x0-0.5*au,y0-0.125*bu,ofz/7-1350/7+defic*3/4,this.koli,this.unbr);
			budyn(x0-0.25*au,y0-0.125*bu,ofz*2/21-200/7,this.koli,this.unbr);
			budyn(x0,y0-0.125*bu,ofz*2/21-200/7,this.koli,this.unbr);
			budyn(x0+0.25*au,y0-0.125*bu,ofz*2/21-200/7,this.koli,this.unbr);
			budyn(x0+0.5*au,y0-0.125*bu,ofz/7-1350/7+defic*3/4,this.koli,this.unbr);

			budyn(x0-0.375*au,y0,ofz*2/21+150/7-defic*4/3,this.koli,this.unbr);
			budyn(x0-0.125*au,y0,300,this.koli,this.unbr);
			budyn(x0+0.125*au,y0,300,this.koli,this.unbr);
			budyn(x0+0.375*au,y0,ofz*2/21+150/7-defic*4/3,this.koli,this.unbr);

			budyn(x0-0.25*au,y0+0.125*bu,ofz/7-1350/7+defic*3/4,this.koli,this.unbr);
			budyn(x0,y0+0.125*bu,ofz*2/21+150/7-defic*4/3,this.koli,this.unbr);
			budyn(x0+0.25*au,y0+0.125*bu,ofz/7-1350/7+defic*3/4,this.koli,this.unbr);
		}
		if(this.hutn>0){
			budyn(x0-0.5*au,y0+0.125*bu,this.hutn/2,100,12);
		}
		if(this.prod>0){
			budyn(x0+0.5*au,y0+0.125*bu,this.prod/2,100,13);
		}
	}
	} else {/*
	if(this.unp>0){
		this.unt[];
	}*/

	ag = 0;
	while(ag<this.drpon){
		if(this.drpok[ag]>-1){
			ctx.strokeStyle="#1D2ABF";
			ctx.lineWidth=2;
			ctx.beginPath();
			if(this.drpop[ag]>-1){
				ctx.moveTo(x0,y0+bu/3);
			} else {
				ctx.moveTo(x0+kir((this.drpok[ag]+5)%6,(this.drpok[ag]+1)%6,"x")*2,y0+kir((this.drpok[ag]+5)%6,(this.drpok[ag]+1)%6,"y")*2+bu/3);
			}
			ctx.lineTo(x0+kir((this.drpok[ag]+5)%6,(this.drpok[ag]+1)%6,"x")*3,y0+kir((this.drpok[ag]+5)%6,(this.drpok[ag]+1)%6,"y")*3+bu/3);
			ctx.stroke();
			ctx.lineWidth=1;
		}
		if(this.drpop[ag]>-1){
			ctx.strokeStyle="#1D2ABF";
			ctx.lineWidth=2;
			ctx.beginPath();
			if(this.drpok[ag]>-1){
				ctx.moveTo(x0,y0+bu/3);
			} else {
				ctx.lineTo(x0+kir((this.drpop[ag]+5)%6,(this.drpop[ag]+1)%6,"x")*2,y0+kir((this.drpop[ag]+5)%6,(this.drpop[ag]+1)%6,"y")*2+bu/3);
				ctx.lineTo(x0-Math.cos((-this.drpop[ag]-0.3-1.5)*Math.PI/3)*bu,y0+Math.sin((-this.drpop[ag]-0.3-1.5)*Math.PI/3)*au+bu/3);
				ctx.lineTo(x0+kir((this.drpop[ag]+5)%6,(this.drpop[ag]+1)%6,"x")*2,y0+kir((this.drpop[ag]+5)%6,(this.drpop[ag]+1)%6,"y")*2+bu/3);
				ctx.lineTo(x0-Math.cos((-this.drpop[ag]+0.3-1.5)*Math.PI/3)*bu,y0+Math.sin((-this.drpop[ag]+0.3-1.5)*Math.PI/3)*au+bu/3);
				ctx.lineTo(x0+kir((this.drpop[ag]+5)%6,(this.drpop[ag]+1)%6,"x")*2,y0+kir((this.drpop[ag]+5)%6,(this.drpop[ag]+1)%6,"y")*2+bu/3);
			}
			ctx.lineTo(x0+kir((this.drpop[ag]+5)%6,(this.drpop[ag]+1)%6,"x")*3,y0+kir((this.drpop[ag]+5)%6,(this.drpop[ag]+1)%6,"y")*3+bu/3);

			ctx.stroke();
			ctx.lineWidth=1;
		}
		ag++;
	}


	rst = 0;
	while(rst<4){
		if(this.wylad[rst]!=-1){
			ctx.lineWidth=3;
			ctx.strokeStyle="#00FF00";
			ctx.beginPath();
			ctx.moveTo(x0-au*0.6,y0-bu*0.4);
			ctx.lineTo(x0+au*0.6,y0+bu*0.4);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(x0+au*0.6,y0-bu*0.4);
			ctx.lineTo(x0-au*0.6,y0+bu*0.4);
			ctx.stroke();
			ctx.lineWidth=1;
		}
		ag = 0;
		while(ag<this.drogn){
			popr = ctx.strokeStyle;
			popw = ctx.fillStyle;
			if(this.drogw[ag]==rst && this.drogd[ag]==kolej){
				y0-=bu/4;
				switch(this.drogkol[ag]){
					case 0:
				if(this.drogg[ag]==zaznu && this.drogd[ag]==kolej){
					ctx.strokeStyle="#77FF77";
					ctx.fillStyle="#77FF77";
				} else {
					ctx.strokeStyle="#00FF00";
					ctx.fillStyle="#00FF00";
				}
				break;
				case 1:
				if(this.drogg[ag]==zaznu && this.drogd[ag]==kolej){
					ctx.strokeStyle="#7777FF";
					ctx.fillStyle="#7777FF";
				} else {
					ctx.strokeStyle="#0000FF";
					ctx.fillStyle="#0000FF";
				}
				break;
				case 2:
				if(this.drogg[ag]==zaznu && this.drogd[ag]==kolej){
					ctx.strokeStyle="#FF7777";
					ctx.fillStyle="#FF7777";
				} else {
					ctx.strokeStyle="#FF0000";
					ctx.fillStyle="#FF0000";
				}
				break;
				case 3:
				if(this.drogg[ag]==zaznu && this.drogd[ag]==kolej){
					ctx.strokeStyle="#FFCC77";
					ctx.fillStyle="#FFCC77";
				} else {
					ctx.strokeStyle="#FF8800";
					ctx.fillStyle="#FF8800";
				}
				break;
				}
				if(this.drogpr[ag]>0){
					if(this.drogp[ag]>=0){
						tam = this.drogp[ag];
						tamp = this.drogp[ag];
						ctx.beginPath();
						ctx.moveTo(x0-kir((tam+5)%6,(tam+1)%6,"x")-rst*0								,y0-kir((tam+5)%6,(tam+1)%6,"y")-rst*0);
						tam = (tam+1)%6;
						ctx.lineTo(x0-kir((tam+5)%6,(tam+1)%6,"x")-rst*0								,y0-kir((tam+5)%6,(tam+1)%6,"y")-rst*0);
						tam = (tam+1)%6;
						ctx.lineTo(x0-kir((tam+5)%6,(tam+1)%6,"x")+kir((tamp+5)%6,(tamp+1)%6,"x")*3-rst*0,y0-kir((tam+5)%6,(tam+1)%6,"y")+kir((tamp+5)%6,(tamp+1)%6,"y")*3-rst*0);
						tam = (tam+1)%6;
						ctx.lineTo(x0-kir((tam+5)%6,(tam+1)%6,"x")+kir((tamp+5)%6,(tamp+1)%6,"x")*3-rst*0,y0-kir((tam+5)%6,(tam+1)%6,"y")+kir((tamp+5)%6,(tamp+1)%6,"y")*3-rst*0);
						tam = (tam+1)%6;
						ctx.lineTo(x0-kir((tam+5)%6,(tam+1)%6,"x")+kir((tamp+5)%6,(tamp+1)%6,"x")*3-rst*0,y0-kir((tam+5)%6,(tam+1)%6,"y")+kir((tamp+5)%6,(tamp+1)%6,"y")*3-rst*0);
						tam = (tam+1)%6;
						ctx.lineTo(x0-kir((tam+5)%6,(tam+1)%6,"x")-rst*0								,y0-kir((tam+5)%6,(tam+1)%6,"y")-rst*0);
						ctx.fill();
					}
					if(this.drogk[ag]>=0 && this.drogpr[ag]>1){
						tam = this.drogk[ag];
						tamp = this.drogk[ag];
						ctx.beginPath();
						ctx.moveTo(x0-kir((tam+5)%6,(tam+1)%6,"x")-rst*0								,y0-kir((tam+5)%6,(tam+1)%6,"y")-rst*0);
						tam = (tam+1)%6;
						ctx.lineTo(x0-kir((tam+5)%6,(tam+1)%6,"x")-rst*0								,y0-kir((tam+5)%6,(tam+1)%6,"y")-rst*0);
						tam = (tam+1)%6;
						ctx.lineTo(x0-kir((tam+5)%6,(tam+1)%6,"x")+kir((tamp+5)%6,(tamp+1)%6,"x")*3-rst*0,y0-kir((tam+5)%6,(tam+1)%6,"y")+kir((tamp+5)%6,(tamp+1)%6,"y")*3-rst*0);
						tam = (tam+1)%6;
						ctx.lineTo(x0-kir((tam+5)%6,(tam+1)%6,"x")+kir((tamp+5)%6,(tamp+1)%6,"x")*3-rst*0,y0-kir((tam+5)%6,(tam+1)%6,"y")+kir((tamp+5)%6,(tamp+1)%6,"y")*3-rst*0);
						tam = (tam+1)%6;
						ctx.lineTo(x0-kir((tam+5)%6,(tam+1)%6,"x")+kir((tamp+5)%6,(tamp+1)%6,"x")*3-rst*0,y0-kir((tam+5)%6,(tam+1)%6,"y")+kir((tamp+5)%6,(tamp+1)%6,"y")*3-rst*0);
						tam = (tam+1)%6;
						ctx.lineTo(x0-kir((tam+5)%6,(tam+1)%6,"x")-rst*0								,y0-kir((tam+5)%6,(tam+1)%6,"y")-rst*0);
						ctx.fill();
					}
				}

				if(this.drogk[ag]>=0 && this.drogp[ag]<0){
				ctx.beginPath();
				kat = this.drogk[ag];
				katd = (this.drogk[ag]+3)%6;
				ctx.moveTo(x0-kir(katd,kat,"x")-rst*0,y0-kir(katd,kat,"y")-rst*0);
				ctx.lineTo(x0-kir(katd,kat,"x")+kir((kat-1)%6,(kat+1)%6,"x")*3-rst*0,y0-kir(katd,kat,"y")+kir((kat-1)%6,(kat+1)%6,"y")*3-rst*0);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(x0+kir(katd,kat,"x")-rst*0,y0+kir(katd,kat,"y")-rst*0);
				ctx.lineTo(x0+kir(katd,kat,"x")+kir((kat-1)%6,(kat+1)%6,"x")*3-rst*0,y0+kir(katd,kat,"y")+kir((kat-1)%6,(kat+1)%6,"y")*3-rst*0);
				ctx.stroke();
				}
			if((this.drogp[ag]-this.drogk[ag])%3==0 && this.drogp[ag]!=this.drogk[ag] && this.drogp[ag]*this.drogk[ag]>=0){
				ctx.beginPath();
				ctx.moveTo(x0-kir(this.drogp[ag],this.drogk[ag],"x")+kir((this.drogp[ag]-1)%6,(this.drogp[ag]+1)%6,"x")*3-rst*0,y0-kir(this.drogp[ag],this.drogk[ag],"y")+kir((this.drogp[ag]-1)%6,(this.drogp[ag]+1)%6,"y")*3-rst*0);
				ctx.lineTo(x0-kir(this.drogp[ag],this.drogk[ag],"x")+kir((this.drogk[ag]-1)%6,(this.drogk[ag]+1)%6,"x")*3-rst*0,y0-kir(this.drogp[ag],this.drogk[ag],"y")+kir((this.drogk[ag]-1)%6,(this.drogk[ag]+1)%6,"y")*3-rst*0);
				ctx.stroke();
				ctx.moveTo(x0+kir(this.drogp[ag],this.drogk[ag],"x")+kir((this.drogp[ag]-1)%6,(this.drogp[ag]+1)%6,"x")*3-rst*0,y0+kir(this.drogp[ag],this.drogk[ag],"y")+kir((this.drogp[ag]-1)%6,(this.drogp[ag]+1)%6,"y")*3-rst*0);
				ctx.lineTo(x0+kir(this.drogp[ag],this.drogk[ag],"x")+kir((this.drogk[ag]-1)%6,(this.drogk[ag]+1)%6,"x")*3-rst*0,y0+kir(this.drogp[ag],this.drogk[ag],"y")+kir((this.drogk[ag]-1)%6,(this.drogk[ag]+1)%6,"y")*3-rst*0);
				ctx.stroke();
			}
			if(3-Math.abs(3-Math.abs(this.drogp[ag]-this.drogk[ag]))==2 && this.drogp[ag]*this.drogk[ag]>=0){
				var wie,mnie;
				var powik = 1;
				poczprz = this.drogp[ag];
				konprz = this.drogk[ag];
				if((poczprz-konprz+6)%6==2){
					wie = this.drogp[ag];
					mnie = this.drogk[ag];
				wzg = (this.drogk[ag]+1)%6;
				zzg = (this.drogp[ag]+2)%6;
				} else {
					wie = this.drogk[ag];
					mnie = this.drogp[ag];
				wzg = (this.drogp[ag]+1)%6;
				zzg = (this.drogk[ag]+2)%6;
				powik = -1;
				}
				if(wie>4){
					wie-=6;
				}
				drogpo = this.drogp[ag];
					drogpo=(drogpo+3)%6;
				drogko = this.drogk[ag];
				ctx.beginPath();
				ctx.moveTo(x0-kir(drogpo+3,drogpo,"x")+kir((this.drogp[ag]+5)%6,(this.drogp[ag]+1)%6,"x")*3-rst*0,
							y0-kir(drogpo+3,drogpo,"y")+kir((this.drogp[ag]+5)%6,(this.drogp[ag]+1)%6,"y")*3-rst*0);
				ctx.lineTo(x0-kir((wzg+5)%6,(wzg+1)%6,"x")*powik-rst*0,
							y0-kir((wzg+5)%6,(wzg+1)%6,"y")*powik-rst*0);
				ctx.lineTo(x0-kir(drogko,drogko+3,"x")+kir((this.drogk[ag]+5)%6,(this.drogk[ag]+1)%6,"x")*3-rst*0,
							y0-kir(drogko,drogko+3,"y")+kir((this.drogk[ag]+5)%6,(this.drogk[ag]+1)%6,"y")*3-rst*0);
				ctx.stroke();
				drogpo = this.drogp[ag];
				drogko = this.drogk[ag];
					drogko=(drogko+3)%6;
				ctx.beginPath();
				ctx.moveTo(x0-kir(drogpo+3,drogpo,"x")+kir((this.drogp[ag]+5)%6,(this.drogp[ag]+1)%6,"x")*3-rst*0,
							y0-kir(drogpo+3,drogpo,"y")+kir((this.drogp[ag]+5)%6,(this.drogp[ag]+1)%6,"y")*3-rst*0);
				ctx.lineTo(x0-kir((zzg+5)%6,(zzg+1)%6,"x")*powik-rst*0,
							y0-kir((zzg+5)%6,(zzg+1)%6,"y")*powik-rst*0);
				ctx.lineTo(x0-kir(drogko,drogko+3,"x")+kir((this.drogk[ag]+5)%6,(this.drogk[ag]+1)%6,"x")*3-rst*0,
							y0-kir(drogko,drogko+3,"y")+kir((this.drogk[ag]+5)%6,(this.drogk[ag]+1)%6,"y")*3-rst*0);
				ctx.stroke();
			}

			if(3-Math.abs(3-Math.abs(this.drogp[ag]-this.drogk[ag]))==1 && this.drogp[ag]*this.drogk[ag]>=0){
				var wie,mnie;
				var powik = 1;
				poczprz = this.drogp[ag];
				konprz = this.drogk[ag];
				if((poczprz-konprz+6)%6==1){
					wie = this.drogp[ag];
					mnie = this.drogk[ag];
				} else {
					wie = this.drogk[ag];
					mnie = this.drogp[ag];
					powik = -1;
				/*wzg = wie;
				zzg = (mnie+6)%6;
				ozg = (mnie+5)%6;*/
				}
				wzg = mnie;
				zzg = (wie+6)%6;
				ozg = (wie+5)%6;
				drogpo = this.drogp[ag];
				drogpo=(drogpo+3)%6;
				drogko = this.drogk[ag];
				ctx.beginPath();
				ctx.moveTo(x0-kir(drogpo+3,drogpo,"x")+kir((this.drogp[ag]-1)%6,(this.drogp[ag]+1)%6,"x")*3-rst*0,y0-kir(drogpo+3,drogpo,"y")+kir((this.drogp[ag]-1)%6,(this.drogp[ag]+1)%6,"y")*3-rst*0);

				if(powik==1){
				ctx.lineTo(x0-kir((ozg+5)%6,(ozg+1)%6,"x")-rst*0,
							y0-kir((ozg+5)%6,(ozg+1)%6,"y")-rst*0);
				ctx.lineTo(x0-kir((zzg+5)%6,(zzg+1)%6,"x")-rst*0,
							y0-kir((zzg+5)%6,(zzg+1)%6,"y")-rst*0);
				} else {
				ctx.lineTo(x0-kir((wzg+3)%6,(wzg+4)%6,"x")-rst*0,
							y0-kir((wzg+3)%6,(wzg+4)%6,"y")-rst*0);

				}
				ctx.lineTo(x0-kir(drogko,drogko+3,"x")+kir((this.drogk[ag]-1)%6,(this.drogk[ag]+1)%6,"x")*3-rst*0,y0-kir(drogko,drogko+3,"y")+kir((this.drogk[ag]-1)%6,(this.drogk[ag]+1)%6,"y")*3-rst*0);
				ctx.stroke();
				drogpo = this.drogp[ag];
				drogko = this.drogk[ag];
				drogko=(drogko+3)%6;
				ctx.beginPath();
				ctx.moveTo(x0-kir(drogpo+3,drogpo,"x")+kir((this.drogp[ag]+5)%6,(this.drogp[ag]+1)%6,"x")*3-rst*0,y0-kir(drogpo+3,drogpo,"y")+kir((this.drogp[ag]+5)%6,(this.drogp[ag]+1)%6,"y")*3-rst*0);
				if(powik==1){
					ctx.lineTo(x0-kir((wzg+3)%6,(wzg+4)%6,"x")-rst*0,
							y0-kir((wzg+3)%6,(wzg+4)%6,"y")-rst*0);
				} else {
				ctx.lineTo(x0-kir((zzg+5)%6,(zzg+1)%6,"x")-rst*0,
							y0-kir((zzg+5)%6,(zzg+1)%6,"y")-rst*0);
				ctx.lineTo(x0-kir((ozg+5)%6,(ozg+1)%6,"x")-rst*0,
							y0-kir((ozg+5)%6,(ozg+1)%6,"y")-rst*0);

				}
				ctx.lineTo(x0-kir(drogko,drogko+3,"x")+kir((this.drogk[ag]+5)%6,(this.drogk[ag]+1)%6,"x")*3-rst*0,y0-kir(drogko,drogko+3,"y")+kir((this.drogk[ag]+5)%6,(this.drogk[ag]+1)%6,"y")*3-rst*0);
				ctx.stroke();
			}

			if((this.drogp[ag]==this.drogk[ag] || (this.drogp[ag]>=0 && this.drogk[ag]<0))/* && this.drogp[ag]*this.drogk[ag]>=0*/){

				pprz = this.drogp[ag];
				wzg = (pprz)%6;
				if(pprz>=3){
					zzg = (pprz+5)%6;
					ozg = (pprz+1)%6;
				} else {
					zzg = (pprz+1)%6;
					ozg = (pprz+5)%6;
				}
				ctx.beginPath();
				ctx.moveTo(x0-kir(pprz,(pprz+3)%6,"x")+kir((pprz+5)%6,(pprz+1)%6,"x")*3-rst*0,
							y0-kir(pprz,(pprz+3)%6,"y")+kir((pprz+5)%6,(pprz+1)%6,"y")*3-rst*0);
				ctx.lineTo(x0-kir((zzg+5)%6,(zzg+1)%6,"x")-rst*0,
							y0-kir((zzg+5)%6,(zzg+1)%6,"y")-rst*0);
				ctx.lineTo(x0-kir((wzg+5)%6,(wzg+1)%6,"x")-rst*0,
							y0-kir((wzg+5)%6,(wzg+1)%6,"y")-rst*0);
				ctx.lineTo(x0-kir((ozg+5)%6,(ozg+1)%6,"x")-rst*0,
							y0-kir((ozg+5)%6,(ozg+1)%6,"y")-rst*0);
				ctx.lineTo(x0+kir(pprz,(pprz+3)%6,"x")+kir((pprz+5)%6,(pprz+1)%6,"x")*3-rst*0,
							y0+kir(pprz,(pprz+3)%6,"y")+kir((pprz+5)%6,(pprz+1)%6,"y")*3-rst*0);
				ctx.stroke();


			}
				y0+=bu/4;
			}
			ag++;
			ctx.strokeStyle=popr;
			ctx.fillStyle=popw;
		}
		rst++;
	}

	rst = 0;
	while(rst<4){
		if(this.undr >-1 && rst<this.unp){
			unix[this.undr][this.unt[rst]].rysunit(x0-rst*2,y0-rst*2-bu/4);
		}
		for(var i = 0;i<6;i++){
			if(this.buchy[i].stan<20){
				for(var j = 0;j<6;j++){
					ctx.fillStyle = "#777";
					ctx.beginPath();
					ctx.arc(x0-kir(j,(j+1)%6,"x")*Math.pow(0.4,1/(this.buchy[i].stan+1)),y0-kir(j,(j+1)%6,"y")*Math.pow(0.4,1/(this.buchy[i].stan+1)),(1-Math.pow(1.1,this.buchy[i].stan-20))*this.buchy[i].wielk*au/100,0,2*Math.PI,0);

					ctx.globalAlpha = 1-this.buchy[i].stan/20;
					ctx.fill();
					ctx.fillStyle = "#ffc";
					ctx.globalAlpha = Math.pow(1-this.buchy[i].stan/20,4);
					ctx.fill();
					ctx.globalAlpha = 1;
				}
			}
		}
			/*ctx.font = '8pt Calibri';
			ctx.textAlign = "center";
			ctx.fillStyle = "#000";
			if(this.drogn>0){
      		//ctx.fillText(this.drogp[this.drogn-1]+','+this.drogk[this.drogn-1], x0-au/2, y0);
			}*/
		rst++;
	}
	}
	ctx.fillStyle = this.testColor;
	ctx.font = '8pt Calibri';
	ctx.fillText(this.test, x0-au/2, y0+bu/1.5);
}
function rysunit(x4,y4){
	/*ctx.fillStyle = kolox(this.d,1);
	ctx.strokeStyle = kolox(this.d,0);
	ctx.fillRect(x4-150/scian,y4-225/scian,300/scian,450/scian);
	ctx.strokeRect(x4-150/scian,y4-225/scian,300/scian,450/scian);*/
			dtr = kolej;
			dth = this.rodz;
			xg = x4;
			yg = y4;
			sx = au/2*Math.sqrt((this.il-(-1))/100);
			sy = au/3*Math.sqrt((this.il-(-1))/100);
			ctx.lineWidth = 1;
			ctx.fillStyle = kolox(this.d,1);

			xg+=kir((this.kiero+5)%6,(this.kiero+1)%6,"x")*3*this.przes;
			yg+=kir((this.kiero+5)%6,(this.kiero+1)%6,"y")*3*this.przes;

			if(kolej!=this.d || zaznu!=this.id){

				if(podswu==this.id && podswd==this.d){
					ctx.strokeStyle = "#FFFF88";
					ctx.lineWidth = 2;
				} else if(this.kolor==1){
					ctx.strokeStyle = "#0000FF";
					ctx.lineWidth = 1;
				} else if(this.kolor==2){
					ctx.strokeStyle = "#FF0000";
					ctx.lineWidth = 1;
				} else if(this.kolor==3){
					ctx.strokeStyle = "#FF8800";
					ctx.lineWidth = 1;
				} else {
					ctx.strokeStyle = kolox(this.d,0);
					ctx.lineWidth = 1;
				}
			} else {
				ctx.strokeStyle = "#FFFF00";
				ctx.lineWidth = 1;
			}
			ctx.fillRect(xg-sx,yg-sy,sx*2,sy*2);
				/*ctx.globalAlpha = 1-this.il/100;
				ctx.fillStyle = "#FFFFFF";
				ctx.fillRect(xg-sx,yg-sy,sx*2,sy*2);
				ctx.globalAlpha = 1;*/
				ctx.strokeRect(xg-sx,yg-sy,sx*2,sy*2);

			switch(dth){
				case 0:
				ctx.beginPath();
				ctx.moveTo(xg-sx,yg-sy);
				ctx.lineTo(xg+sx,yg+sy);
				ctx.closePath();
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(xg-sx,yg+sy);
				ctx.lineTo(xg+sx,yg-sy);
				ctx.closePath();
				ctx.stroke();

				break;
				case 1:
				ctx.beginPath();
				ctx.arc(xg-sx/3, yg, sy/2, Math.PI/2, Math.PI*3/2, false);
				ctx.lineTo(xg+sx/3,yg-sy/2);
				ctx.arc(xg+sx/3, yg, sy/2, Math.PI*3/2, Math.PI/2, false);
				ctx.closePath();
				ctx.stroke();
				break;
				case 2:
				ctx.beginPath();
				ctx.arc(xg, yg, sy/3, 0, 2*Math.PI, false);
				ctx.closePath();
				if(zaznu!=this.id || kolej!=this.d){
					if(podswd==this.d && podswu==this.id){
						ctx.fillStyle = "#FFFF88";
					} else {
						ctx.fillStyle = kolox(this.d,0);
					}
				} else {
					ctx.fillStyle = "#FFFF00";
				}
				ctx.fill();
				ctx.fillStyle = kolox(this.d,1);

				break;
				case 3:
				ctx.beginPath();
				ctx.moveTo(xg-sx,yg-sy);
				ctx.lineTo(xg+sx,yg+sy);
				ctx.closePath();
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(xg-sx,yg+sy);
				ctx.lineTo(xg+sx,yg-sy);
				ctx.closePath();
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(xg,yg+sy);
				ctx.lineTo(xg,yg-sy);
				ctx.closePath();
				ctx.stroke();

				break;
				case 4:
				ctx.beginPath();
				ctx.moveTo(xg-sx,yg-sy);
				ctx.lineTo(xg+sx,yg+sy);
				ctx.closePath();
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(xg-sx,yg+sy);
				ctx.lineTo(xg+sx,yg-sy);
				ctx.closePath();
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(xg,yg+sy/3);
				ctx.lineTo(xg-sx/2,yg+sy);
				ctx.lineTo(xg+sx/2,yg+sy);
				ctx.closePath();
				if(zaznu!=this.id || kolej!=this.d){
					if(podswd==this.d && podswu==this.id){
						ctx.fillStyle = "#FFFF88";
					} else {
						ctx.fillStyle = kolox(this.d,0);
					}
				} else {
					ctx.fillStyle = "#FFFF00";
				}
				ctx.fill();
				ctx.fillStyle = kolox(this.d,1);

				break;
				case 5:
				ctx.beginPath();
				ctx.arc(xg, yg+sx+sy, sx*Math.sqrt(2), Math.PI*1.25, Math.PI*1.75, false);
				ctx.closePath();
				ctx.stroke();

				break;
				case 6:
				ctx.beginPath();
				ctx.arc(xg, yg-sy*0.25, sy/10, 0, Math.PI*2, false);
				ctx.closePath();
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(xg,yg-sy*0.15);
				ctx.lineTo(xg,yg-sy*0.1);
				ctx.lineTo(xg-sy*0.15,yg-sy*0.1);
				ctx.lineTo(xg+sy*0.1,yg-sy*0.1);
				ctx.lineTo(xg,yg-sy*0.15);
				ctx.lineTo(xg,yg+sy*0.15);
				ctx.stroke();

				ctx.beginPath();
				ctx.arc(xg-sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
				ctx.lineTo(xg-sy*0.3, yg+sy*0.05);
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(xg-sy*0.3, yg+sy*0.05);
				ctx.lineTo(xg-sy*0.4, yg+sy*0.2);
				ctx.lineTo(xg-sy*0.3, yg+sy*0.05);
				ctx.lineTo(xg-sy*0.2, yg+sy*0.2);
				ctx.stroke();

				ctx.beginPath();
				ctx.arc(xg+sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
				//btx.lineTo(xg+sy*0.3, yg+sy*0.05);
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(xg+sy*0.3, yg+sy*0.05);
				ctx.lineTo(xg+sy*0.2, yg+sy*0.2);
				ctx.lineTo(xg+sy*0.3, yg+sy*0.05);
				ctx.lineTo(xg+sy*0.4, yg+sy*0.2);
				ctx.stroke();

				break;
				case 7:

				ctx.beginPath();
				ctx.arc(xg-sx/3, yg, sy/2, Math.PI/2, Math.PI*3/2, false);
				ctx.lineTo(xg+sx/3,yg-sy/2);
				ctx.arc(xg+sx/3, yg, sy/2, Math.PI*3/2, Math.PI/2, false);
				ctx.closePath();
				ctx.stroke();

				ctx.beginPath();
				ctx.arc(xg, yg-sy*0.25, sy/10, 0, Math.PI*2, false);
				ctx.closePath();
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(xg,yg-sy*0.15);
				ctx.lineTo(xg,yg-sy*0.1);
				ctx.lineTo(xg-sy*0.15,yg-sy*0.1);
				ctx.lineTo(xg+sy*0.1,yg-sy*0.1);
				ctx.lineTo(xg,yg-sy*0.15);
				ctx.lineTo(xg,yg+sy*0.15);
				ctx.stroke();

				ctx.beginPath();
				ctx.arc(xg-sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
				ctx.lineTo(xg-sy*0.3, yg+sy*0.05);
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(xg-sy*0.3, yg+sy*0.05);
				ctx.lineTo(xg-sy*0.4, yg+sy*0.2);
				ctx.lineTo(xg-sy*0.3, yg+sy*0.05);
				ctx.lineTo(xg-sy*0.2, yg+sy*0.2);
				ctx.stroke();

				ctx.beginPath();
				ctx.arc(xg+sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
				//btx.lineTo(xg+sy*0.3, yg+sy*0.05);
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(xg+sy*0.3, yg+sy*0.05);
				ctx.lineTo(xg+sy*0.2, yg+sy*0.2);
				ctx.lineTo(xg+sy*0.3, yg+sy*0.05);
				ctx.lineTo(xg+sy*0.4, yg+sy*0.2);
				ctx.stroke();


				break;
				case 8:
				ctx.beginPath();
				ctx.arc(xg-sx, yg+sy*13/16, sy*3/16, Math.PI/2, 0, true);
				ctx.arc(xg-sx+(sy*3/8), yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				ctx.arc(xg-sx+(sy*3/8)*2, yg+sy*13/16, sy*3/16, Math.PI, 0, true);
				ctx.arc(xg-sx+(sy*3/8)*3, yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				ctx.arc(xg-sx+(sy*3/8)*4, yg+sy*13/16, sy*3/16, Math.PI, 0, true);
				ctx.arc(xg-sx+(sy*3/8)*5, yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				ctx.arc(xg-sx+(sy*3/8)*6, yg+sy*13/16, sy*3/16, Math.PI, 0, true);
				ctx.arc(xg-sx+(sy*3/8)*7, yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				ctx.arc(xg-sx+(sy*3/8)*8, yg+sy*13/16, sy*3/16, Math.PI, 0, true);

				ctx.stroke();

				break;
				case 9:

				ctx.beginPath();
				ctx.arc(xg-sx/2, yg, sy/3, Math.PI/3, Math.PI*5/3, false);
				//btx.lineTo(xg+sx/3,yg-sy/2);
				ctx.arc(xg+sx/2, yg, sy/3, Math.PI*2/3, Math.PI*4/3, true);
				ctx.closePath();
				ctx.stroke();
				break;
				case 10:

				ctx.beginPath();
				ctx.moveTo(xg-sx/4,yg-sy*3/4);
				ctx.lineTo(xg,yg-sy/3);
				ctx.lineTo(xg+sx/4,yg-sy*3/4);
				ctx.stroke();
				break;
				case 11:
				ctx.beginPath();
				ctx.moveTo(xg-sx/2,yg-sy*3/5);
				ctx.lineTo(xg-sx/3,yg-sy/5);
				ctx.lineTo(xg+sx/3,yg-sy/5);
				ctx.lineTo(xg+sx/2,yg-sy*3/5);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(xg-sx/2,yg+sy*3/5);
				ctx.lineTo(xg-sx/3,yg+sy/5);
				ctx.lineTo(xg+sx/3,yg+sy/5);
				ctx.lineTo(xg+sx/2,yg+sy*3/5);
				ctx.stroke();
				break;

			}
			if(dth!=6 && dth!=7 && dth!=8 && this.szyt=="w"){
				ctx.beginPath();
				ctx.arc(xg-sx, yg+sy*13/16, sy*3/16, Math.PI/2, 0, true);
				ctx.arc(xg-sx+(sy*3/8), yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				ctx.arc(xg-sx+(sy*3/8)*2, yg+sy*13/16, sy*3/16, Math.PI, 0, true);
				ctx.arc(xg-sx+(sy*3/8)*3, yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				ctx.arc(xg-sx+(sy*3/8)*4, yg+sy*13/16, sy*3/16, Math.PI, 0, true);
				ctx.arc(xg-sx+(sy*3/8)*5, yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				ctx.arc(xg-sx+(sy*3/8)*6, yg+sy*13/16, sy*3/16, Math.PI, 0, true);
				ctx.arc(xg-sx+(sy*3/8)*7, yg+sy*13/16, sy*3/16, Math.PI, Math.PI*2, false);
				ctx.arc(xg-sx+(sy*3/8)*8, yg+sy*13/16, sy*3/16, Math.PI, 0, true);

				ctx.stroke();
			}
			if(dth!=9 && dth!=10 && this.szyt=="l"){
				ctx.beginPath();
				ctx.moveTo(xg-sx/4,yg-sy*3/4);
				ctx.lineTo(xg,yg-sy/3);
				ctx.lineTo(xg+sx/4,yg-sy*3/4);
				ctx.stroke();
			}
			/*
			24 16 48 32   0.53125
			(xg-sx,yg-sy,sx*2,sy*2)*/
			sx = au/2;
			sy = au/3;
			ctx.fillStyle = "#FFFFFF";
			ctx.fillStyle = "#444444";
			ctx.fillRect(xg-sx,yg+sy*0.1,sy*1.1,sy*0.9);
			//btx.strokeRect(xg-24,yg-16,48,32);
			ctx.font = Math.floor(sy*0.8)+'pt Calibri';
			ctx.textAlign = "left";
			ctx.fillStyle = "#FFFFFF";
      		ctx.fillText(this.il, xg-sx, yg+sy*0.9);


		if(this.rozb>0){
			sx = au/2*Math.sqrt((this.il-(-1-this.rozb))/100);
			sy = au/3*Math.sqrt((this.il-(-1-this.rozb))/100);
			ctx.strokeStyle = "#00FFFF";
			ctx.beginPath();
			ctx.moveTo(xg-sx*7/6,yg-sy);
			ctx.lineTo(xg-sx,yg-sy*5/4);
			ctx.lineTo(xg+sx,yg-sy*5/4);
			ctx.lineTo(xg+sx*7/6,yg-sy);
			ctx.lineTo(xg+sx*7/6,yg+sy);
			ctx.lineTo(xg+sx,yg+sy*5/4);
			ctx.lineTo(xg-sx,yg+sy*5/4);
			ctx.lineTo(xg-sx*7/6,yg+sy);
			ctx.closePath();
			ctx.stroke();

			sx = au/2;
			sy = au/3;
			ctx.fillStyle = "#00FFFF";
			ctx.fillRect(xg+sx-sy*1.1,yg-sy,sy*1.1,sy*0.9);
			//btx.strokeRect(xg-24,yg-16,48,32);
			ctx.font = Math.floor(sy*0.8)+'pt Calibri';
			ctx.textAlign = "right";
			ctx.fillStyle = "#000000";
      		ctx.fillText(this.rozb, xg+sx, yg-sy*0.1);
		}
			sx = au/2*Math.sqrt((this.il-(-1))/100);
			sy = au/3*Math.sqrt((this.il-(-1))/100);
		var kolot = 0;
		var far = 0;
		while(far<this.celen){
			if(this.celed[far]==this.d){
				if(unix[this.d][this.celeu[far]].rodz==this.rodz){
					kolot = 1;
				} else if(kolot!=1 && this.rodz==10) {
					kolot = 3;
				}
			}
			far++;
		}
		if(this.celen>0 && kolot!=0){
			if(kolot==1){
				ctx.strokeStyle = "#0000FF";
			} else if(kolot==3){
				ctx.strokeStyle = "#FF8800";
			}
			ctx.beginPath();
			ctx.moveTo(xg-sx*7/6,yg-sy);
			ctx.lineTo(xg-sx,yg-sy*5/4);
			ctx.lineTo(xg+sx,yg-sy*5/4);
			ctx.lineTo(xg+sx*7/6,yg-sy);
			ctx.lineTo(xg+sx*7/6,yg+sy);
			ctx.lineTo(xg+sx,yg+sy*5/4);
			ctx.lineTo(xg-sx,yg+sy*5/4);
			ctx.lineTo(xg-sx*7/6,yg+sy);
			ctx.closePath();
			ctx.stroke();
		}
}
function rysunit2(x4,y4){

}
function budyn(x1,y1,wel,koli,druza){
		var wi = wel;
		if(tumor){
			ctx.strokeStyle = "#EEEECC";
		} else {
			ctx.strokeStyle = "#666666";
		}
		ctx.fillStyle = "#BBBBBB";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(x1-au*0.105,y1+Math.sqrt(3)/2*bu*0.5);
		ctx.lineTo(x1+au*0.105,y1+Math.sqrt(3)/2*bu*0.5);
		ctx.lineTo(x1+au*0.105,y1+Math.sqrt(3)/2*bu*(0.5-wi/200));
		ctx.lineTo(x1-au*0.105,y1+Math.sqrt(3)/2*bu*(0.5-wi/200));
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = "#999999";
		ctx.beginPath();
		ctx.moveTo(x1+au*0.105,y1+Math.sqrt(3)/2*bu*0.5);
		ctx.lineTo(x1+au*0.205,y1+Math.sqrt(3)/2*bu*0.4);
		ctx.lineTo(x1+au*0.205,y1+Math.sqrt(3)/2*bu*(0.4-wi/200));
		ctx.lineTo(x1+au*0.105,y1+Math.sqrt(3)/2*bu*(0.5-wi/200));
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = "#999999";
		ctx.beginPath();
		ctx.moveTo(x1+au*0.205,y1+Math.sqrt(3)/2*bu*(0.4-wi/200));
		ctx.lineTo(x1+au*0.105,y1+Math.sqrt(3)/2*bu*(0.5-wi/200));
		ctx.lineTo(x1-au*0.105,y1+Math.sqrt(3)/2*bu*(0.5-wi/200));
		ctx.lineTo(x1-au*0.005,y1+Math.sqrt(3)/2*bu*(0.4-wi/200));
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		if(druza>-1){
		ctx.globalAlpha = koli/140;
		ctx.fillStyle = kolox(druza,1);
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(x1-au*0.105,y1+Math.sqrt(3)/2*bu*0.5);
		ctx.lineTo(x1+au*0.105,y1+Math.sqrt(3)/2*bu*0.5);
		ctx.lineTo(x1+au*0.105,y1+Math.sqrt(3)/2*bu*(0.5-wi/200));
		ctx.lineTo(x1-au*0.105,y1+Math.sqrt(3)/2*bu*(0.5-wi/200));
		ctx.closePath();
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(x1+au*0.105,y1+Math.sqrt(3)/2*bu*0.5);
		ctx.lineTo(x1+au*0.205,y1+Math.sqrt(3)/2*bu*0.4);
		ctx.lineTo(x1+au*0.205,y1+Math.sqrt(3)/2*bu*(0.4-wi/200));
		ctx.lineTo(x1+au*0.105,y1+Math.sqrt(3)/2*bu*(0.5-wi/200));
		ctx.closePath();
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(x1+au*0.205,y1+Math.sqrt(3)/2*bu*(0.4-wi/200));
		ctx.lineTo(x1+au*0.105,y1+Math.sqrt(3)/2*bu*(0.5-wi/200));
		ctx.lineTo(x1-au*0.105,y1+Math.sqrt(3)/2*bu*(0.5-wi/200));
		ctx.lineTo(x1-au*0.005,y1+Math.sqrt(3)/2*bu*(0.4-wi/200));
		ctx.closePath();
		ctx.fill();
		ctx.globalAlpha = 1;
		}

}
function textuj(){
	var tka = "";
	if(podswx!=-1){
		tka+="Sześciokąt("+podswx+","+podswy+")";
		if(heks[podswx][podswy].z>0){
			tka+=" Miasto "+heks[podswx][podswy].nazwa+"; Populacja: "+heks[podswx][podswy].z+" Hutnictwo: "+heks[podswx][podswy].hutn+" Produkcja: "+heks[podswx][podswy].prod;
		}
	}
	wix = mainCanvas.width/800*80;
	ctx.fillStyle="#eee";
	ctx.fillRect(0,mainCanvas.height-20,mainCanvas.width,20);
	ctx.fillRect(mainCanvas.width-wix-5,0,wix+5,mainCanvas.height);
	ctx.fillStyle="#777";
	ctx.font="12px verdana";
	ctx.textAlign="left";
	ctx.fillText(tka,10,mainCanvas.width-5);

	//powiększenie

	ctx.strokeStyle="#777";
	if(podsm==0)
		ctx.fillStyle="#ccc";
	else
		ctx.fillStyle="#eee";
	ctx.fillRect(mainCanvas.width-wix-5,10,wix,100);

	if(podsm==1)
		ctx.fillStyle="#ccc";
	else
		ctx.fillStyle="#eee";
	ctx.fillRect(mainCanvas.width-wix-5,130,wix,100);

	ctx.fillStyle="#777";
	ctx.strokeRect(mainCanvas.width-wix-5,10,wix,100);
	ctx.fillRect(mainCanvas.width-wix/2-30+5,35+17,40,16);

	ctx.strokeRect(mainCanvas.width-wix-5,130,wix,100);
	ctx.fillRect(mainCanvas.width-wix/2-30+5,155+17,40,16);
	ctx.fillRect(mainCanvas.width-wix/2-30+17,155+5,16,40);
}
