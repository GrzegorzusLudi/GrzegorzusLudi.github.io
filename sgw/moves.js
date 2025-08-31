function tasuj(){
	var aii = 0;
	var ts = this.unt[0];
	while(aii<this.unp-1){
		this.unt[aii] = this.unt[aii+1];
		aii++;
	}
	this.unt[this.unp-1] = ts;
	ol = 0;
	while(ol<this.unp){
		tatasuj(this.unt[ol],ol);
		ol++;
	}
}
function usunmost(){

	wybur = -1;
	odceluj(this.unt[wybur],-2);
	oddroguj(this.unt[wybur],-2,false);

	unix[-2][this.unt[wybur]].kosz = true;
	unix[-2][this.unt[wybur]].x = -1;
	unix[-2][this.unt[wybur]].y = -1;
	unix[-2][this.unt[wybur]].celd = -1;
	this.unt[-1] = null;

	spis(kolej);
	this.koloruj();
}
function usun(ktor,atakując){
	if(ktor == -1){
		wybur = this.unp-1;
	} else {
		wybur = ktor;
	}
	var tamten;
	if(wybur==this.unp-1){
		tamten = this.unp-2;
	} else {
		tamten = this.unp-1;
	}

	if(wybur>0 && this.undr!=kolej){
		przeceluj(this.unt[wybur],this.unt[tamten],this.undr);
		odceluj(this.unt[wybur],this.undr);
	} else {
		odceluj(this.unt[wybur],this.undr);
	}
	oddroguj(this.unt[wybur],this.undr,false,atakując);
	if(wybur>=0){
		unix[this.undr][this.unt[wybur]].kosz = true;
		unix[this.undr][this.unt[wybur]].sebix = unix[this.undr][this.unt[wybur]].x;
		unix[this.undr][this.unt[wybur]].sebiy = unix[this.undr][this.unt[wybur]].y;
		unix[this.undr][this.unt[wybur]].x = -1;
		unix[this.undr][this.unt[wybur]].y = -1;
		unix[this.undr][this.unt[wybur]].celd = -1;
		if(this.unp==1){
			this.undr = -1;
		}
		this.unt[this.unp] = -1;
		while(wybur<this.unp-1){
			this.unt[wybur] = this.unt[wybur+1];
			wybur++;
		}
		this.unp--;
	}
	spis(kolej);
	this.koloruj();
}
function odzaznaj(changeTheState){
	a = 0;
	while(a<scian){
		b = 0;
		while(b<scian){
			if(heks[a][b].unp>0){
				unix[heks[a][b].undr][heks[a][b].unt[heks[a][b].unp-1]].kolor = 0;
				heks[a][b].zmiana++;
			}
			if(heks[a][b].unt[-1]!=null){
				unix[-2][heks[a][b].unt[-1]].kolor = 0;
				heks[a][b].zmiana++;
			}
			b++;
		}
		a++;
	}
	var oth,moz,sz,szcz,zak,ftx;
	tph = heks[tx][ty];
	tx = -1;
	ty = -1;
	if(tph==null){
		tph = unix[kolej][zaznu];
	}
	if(tph.pode>0){
		tph.pode = 0;
		tph.zmiana++;
	}
	var ei = 0;
	while(ei<6){
		oth = tph.border[ei];
		moz = true;
		sz = 0;
		szcz = 0;
		zak = 0;
		while(oth!=null && oth.x>=0 && oth.y>=0 && oth.x<scian && oth.y<scian){

			if(oth.pode>0){
				oth.pode = 0;
				oth.zmiana++;
			}
			oth = oth.border[ei];

		}
		ei++;
	}
	if(changeTheState == undefined || changeTheState)
		changeState(2);
}
function zaznaj(uni,changeTheState){
	if(tx!=-1){
		odzaznaj(changeTheState);
	}
	unitDivisionValue = unix[kolej][uni].il;
	unitDivisionHighlight = unix[kolej][uni].il;
	var i = 0;
        while(heks[unix[kolej][uni].x][unix[kolej][uni].y].unt[heks[unix[kolej][uni].x][unix[kolej][uni].y].unp-1]!=uni){
		heks[unix[kolej][uni].x][unix[kolej][uni].y].tasuj();
                i++
        }
	if(heks[unix[kolej][uni].x][unix[kolej][uni].y].unp<4){
		divideButton.disabled = false;
	} else {
		divideButton.disabled = true;
	}
	if(heks[unix[kolej][uni].x][unix[kolej][uni].y].z<1 || (heks[unix[kolej][uni].x][unix[kolej][uni].y].hutn<=0 || heks[unix[kolej][uni].x][unix[kolej][uni].y].prod<=0) && ces[unix[kolej][uni].rodz]>0){
		expandButton.disabled = true;
	} else {
		expandButton.disabled = false;
	}
	if(unix[kolej][uni].rozb>0){
		expandButton.value = languagewise({'pl':"ZAPRZESTAJ ROZBUDOWY",'en':"STOP BUILDING"});
	} else {
		expandButton.value = languagewise({'pl':"ROZBUDUJ",'en':"BUILD"});
	}
	placementDisplay = document.getElementById("placementDisplay");
	if(heks[unix[kolej][uni].x][unix[kolej][uni].y].z>0){
		placement = document.getElementById("placement");
		placementDisplay.style.display = "block";
		placement.innerHTML = heks[unix[kolej][uni].x][unix[kolej][uni].y].nazwa;
		cityData.innerHTML = languagewise({pl:"Budżet: ",en:"Budget: "})+heks[unix[kolej][uni].x][unix[kolej][uni].y].kasy+"$<br/>"+languagewise({pl:"Zasoby Stali: ",en:"Steel reserves: "})+heks[unix[kolej][uni].x][unix[kolej][uni].y].stali+"t";
	} else {
		placementDisplay.style.display = "none";
	}
	var otx,oty,moz,sz,szcz,zak,ftx;
	tx = unix[kolej][uni].sebix;
	ty = unix[kolej][uni].sebiy;
	tph = heks[tx][ty];
	typek = unix[kolej][uni].rodz;
	if(unix[kolej][uni].szyt=="l" && szyt[unix[kolej][uni].rodz]!="l" && unix[kolej][uni].wypax==-1 && tph.unp < 4){
		tph.pode = 1;
		tph.zmiana++;
	}
	if(unix[kolej][uni].il>0){
	var ei = 0;
	while(ei<6){
		oth = heks[tx][ty].border[ei];
		moz = true;
		plyw = false;
		sz = 0;
		szcz = -1;
		zak = 0;
		while(oth!=null && oth.x>=0 && oth.y>=0 && oth.x<scian && oth.y<scian && moz){

			if(oth.x>=0 && oth.y>=0 && oth.x<scian && oth.y<scian){
				if(oth.z == -2 && (unix[kolej][uni].szyt=="c" || unix[kolej][uni].szyt=="w")){
					moz = false;
				}
				if(oth.z == -1 && (unix[kolej][uni].szyt=="c" || unix[kolej][uni].szyt=="n" || unix[kolej][uni].szyt=="g")){
					//moz = false;
					plyw = true;
				}
				if(oth.z == -2 && unix[kolej][uni].szyt=="n" && szcz<unix[kolej][uni].szy-2){
					szcz = unix[kolej][uni].szy-2;
				}
				if(oth.z == 0 && unix[kolej][uni].szyt=="w" && szyt[unix[kolej][uni].rodz]=="w"){
					moz = false;
				}
			}
			if(moz){
				szcz++;
				if(szcz>=unix[kolej][uni].szy){
					sz = 1-sz;
					szcz = 0;
				}
				if(sz == 0){
					oth.pode = 1;
					oth.zmiana++;
				} else {
					oth.pode = 2;
					oth.zmiana++;
				}
				if(plyw){
					oth.pode = 3;
					oth.zmiana++;
				}
				oth = oth.border[ei];

			}
		}
		ei++;
	}
	aktdroguj(kolej,uni);
	zaznat(uni,1);
	zaznat(uni,2);
	zaznat(uni,3);
	}
	if(changeTheState == undefined || changeTheState)
		changeState(3);
}
function istn(aaa,bbb){
	var taak = false;
	if(aaa>=0 && aaa<scian && bbb>=0 && bbb<scian)
	taak = true;
	return taak;
}
function zaznat(uni,rodz){
	var etapy = zas[unix[kolej][uni].rodz];
	if(etapy==0 && rodz!=3)
	etapy = 1;
	a = 0;
	while(a<scian){
		b = 0;
		while(b<scian){
			heks[a][b].zazwa = false;
			b++;
		}
		a++;
	}

	var yax = unix[kolej][uni].sebix;
	var yay = unix[kolej][uni].sebiy;
	heks[yax][yay].zazwa = true;
	var e = 0;
	while(e<etapy){
		a = yax-e;
		if(a<0){
			a = 0;
		}
		while(a<=yax+e && a<scian){
			b = yay-e-1;
			if(b<0){
				b = 0;
			}
			while(b<=yay+e && b<scian){
				if(heks[a][b].zazwa){
				var f = 0;
				while(f<6){
					var tprh = heks[a][b].border[f];
					if(tprh!=null){
						tprh.zazwh = true;
                        var aimingUnit = unix[kolej][uni]
                        var lookedUpUnit = tprh.unp>0 ? unix[tprh.undr][tprh.unt[tprh.unp-1]] : null
						switch(rodz){
							case 0:
							if(tprh.unp>0){
								lookedUpUnit.kolor = 0;
							}
								if(unix[-2][tprh.unt[-1]]!=null)
									unix[-2][tprh.unt[-1]].kolor = 0;
							break;
							case 1:
							if(e==0 && tprh.unp>0 && lookedUpUnit.d==kolej && lookedUpUnit.rodz==aimingUnit.rodz && lookedUpUnit.il<99 && (lookedUpUnit.szyt==aimingUnit.szyt || aimingUnit.szyt=="w") && (aimingUnit.szyt!="l" || szy[aimingUnit.rodz]=="l")){

								lookedUpUnit.kolor = 1;
								tprh.zmiana++;
							}
							break;
							case 2:
							if(e==0 && tprh.unp>0 && lookedUpUnit.d==kolej && lookedUpUnit.rodz==10 && tprh.unt[tprh.unp-1]!=aimingUnit.id && aimingUnit.szyt!="w" && aimingUnit.szyt!="c" && aimingUnit.szyt!="l"){

								lookedUpUnit.kolor = 3;
								tprh.zmiana++;
							}
							break;
							case 3: //atak
							if(tprh.unp>0 && lookedUpUnit.d!=kolej && miaruj(aimingUnit,lookedUpUnit,tprh)/* && szyt[unix[kolej][uni].rodz]==unix[kolej][uni].szyt*/){

								lookedUpUnit.kolor = 2;
								tprh.zmiana++;
							}
							if(tprh.undr!=kolej && unix[-2][tprh.unt[-1]]!=null){
								unix[-2][tprh.unt[-1]].kolor = 2;
								tprh.zmiana++;
							}
							break;
						}
					}
					f++;
				}
			}
				b++;
			}
			a++;
		}
		e++;

		a = yax-e;
		if(a<0){
			a = 0;
		}
		while(a<=yax+e && a<scian){
			b = yay-e-1;
			if(b<0){
				b = 0;
			}
			while(b<=yay+e && b<scian){
				if(heks[a][b].zazwh){
					heks[a][b].zazwh = false;
					heks[a][b].zazwa = true;
				}
				b++;
			}
			a++;
		}
	}
}
function miaruj(atki,obri,pole,revenge){
	var werd = true;/*
	if(atki.szyt!=szyt[atki.rodz]){
		werd = false;
	}*/
	if(zast[atki.rodz]=="x" || zast[atki.rodz]=="m"){
		werd = false;
	}
	if(szyt[atki.rodz]=="c" && pole.z==-2 && !(obri.szyt == 'l' && zast[atki.rodz] == 'p')){
		werd = false;
	}
	if(szyt[atki.rodz]=="w" && pole.z==-2){
		werd = false;
	}
	
	if((szyt[atki.rodz] != "l" && zast[atki.rodz]!="p") && szyt[obri.rodz]=="l" && (pole.z<=0 || revenge)/*obri.x != undefined && heks[obri.x][obri.y].z<=0*/){
		werd = false;
	}
	//if(szyt[atki.rodz] == "l" && obri.szyt != "l" && pole.z == -2){
    //    werd = false
    //}
	if((atki.szyt == "n" || atki.szyt == "g") && obri.szyt=="w" && zas[atki.szyt]<=1 && pole.z<=0){
		werd = false;
	}
	return werd;
}
function zaznam(hexx,heyy,zosta){
	var opx,opy;
	if(heks[hexx][heyy].dpodatnum==0){
		tx = hexx;
		ty = heyy;
		heks[hexx][heyy].debix = tx;
		heks[hexx][heyy].debiy = ty;
	} else {
		tx = heks[hexx][heyy].debix;
		ty = heks[hexx][heyy].debiy;
	}
	ao = 0;
	while(ao<6){
		oph = heks[tx][ty];
		bo = 0;
		pak = zosta;
		mozl = true;
		while(oph.border[ao]!=null && pak>0 && mozl){
			oph = oph.border[ao];
			if(oph.z>=0){
				pak-=2;
			} else if(oph.z==-1){
				pak-=8;
			} else if(oph.z==-2){
				pak-=5;
			}
			if(oph.undr!=-1 && oph.undr!=kolej){
				mozl = false;
			} else {
				oph.pode = 1;
				oph.zmiana++;
			}
			bo++;
		}
		ao++;
	}
}

function odzaznam(czy){
	if(zaznx>-1 && tx>-1){
	var opx,opy;
	ao = 0;
	while(ao<6){
		oph = heks[tx][ty];
		bo = 0;
		while(oph!=null){
			oph = oph.border[ao];
			if(oph!=null){
				oph.pode = 0;
				oph.zmiana++;
			}
			bo++;
		}
		ao++;
	}
	tx = -1;
	ty = -1;
	if(czy == 0 && zaznx>-1){
		odpodatkuj(zaznx,zazny);
	}
	taxRange.disabled = false;
	}
}
function popodatkuj(nax,nay,zosta){
	var kier;
	var opx,opy;
	oph = heks[heks[zaznx][zazny].debix][heks[zaznx][zazny].debiy];
	if(nax==oph.x){
		if(nay<oph.y){
			kier = 0;
		} else {
			kier = 3;
		}
	} else if(nax<oph.x){
		if(nax%2==0){
			if(nay<=oph.y){
				kier = 5;
			} else {
				kier = 4;
			}
		} else {
			if(nay<oph.y){
				kier = 5;
			} else {
				kier = 4;
			}
		}
	} else {
		if(nax%2==0){
			if(nay<=oph.y){
				kier = 1;
			} else {
				kier = 2;
			}
		} else {
			if(nay<oph.y){
				kier = 1;
			} else {
				kier = 2;
			}
		}
	}
	koncz = 0;
	mozl = true;
	if(heks[zaznx][zazny].dpodatnum==0){
	oph.drpop[oph.drpon] = -1;
	} else {
	oph.drpon--;
	}
	oph.drpok[oph.drpon] = kier;
	oph.drpox[oph.drpon] = zaznx;
	oph.drpoy[oph.drpon] = zazny;
	oph.zmiana++;
	oph.drpon++;
	szol = 0;
	doroh = 0;
	while(oph!=null){
                oph = oph.border[kier];
                if(oph.z>=0){
                        szol+=2;
                } else if(oph.z==-1){
                        szol+=8;
                } else if(oph.z==-2){
                        szol+=5;
                }
		doroh++;
		if(oph.x == nax && oph.y == nay){
			oph.drpop[oph.drpon] = (kier+3)%6;
			oph.drpok[oph.drpon] = -1;
			oph.drpox[oph.drpon] = zaznx;
			oph.drpoy[oph.drpon] = zazny;
			oph.zmiana++;
			oph.drpon++;
			mozl = false;
			if(heks[nax][nay].z>0 && heks[nax][nay].undr == kolej){
                                koncz = 1;
			}
			break
		} else {
			oph.drpop[oph.drpon] = (kier+3)%6;
			oph.drpok[oph.drpon] = kier;
			oph.drpox[oph.drpon] = zaznx;
			oph.drpoy[oph.drpon] = zazny;
			oph.zmiana++;
			oph.drpon++;
		}
	}
	heks[zaznx][zazny].debix = nax;
	heks[zaznx][zazny].debiy = nay;

	heks[zaznx][zazny].dpodatk[heks[zaznx][zazny].dpodatnum] = kier;
	heks[zaznx][zazny].dpodato[heks[zaznx][zazny].dpodatnum] = doroh;
	heks[zaznx][zazny].dpodszlo+=szol;
	heks[zaznx][zazny].dpodatnum++;
	if(koncz==0){
		heks[zaznx][zazny].debix = nax;
		heks[zaznx][zazny].debiy = nay;
		odzaznam(1);
		zaznam(nax,nay,warta-heks[zaznx][zazny].dpodszlo);
	} else {
		if(taxRange.value==100){
		r = 0;
		while(r<heks[zaznx][zazny].unp){
			unix[kolej][heks[zaznx][zazny].unt[r]].rozb = 0;
			if(unix[kolej][heks[zaznx][zazny].unt[r]].il<=0){
				heks[zaznx][zazny].usun(r);
				r--;
			}
			r++;
		}
		}
		heks[zaznx][zazny].debix = -1;
		heks[zaznx][zazny].debiy = -1;
		heks[zaznx][zazny].podatpr = taxRange.value;
		heks[zaznx][zazny].podatl = warta;
		heks[nax][nay].trybutariusze[heks[nax][nay].trybutariuszy] = [heks[zaznx][zazny].x,heks[zaznx][zazny].y];
		heks[nax][nay].trybutariuszy++;
		odzaznam(1);
		taxRange.disabled = false;
		pokap();
			zatw.value = languagewise({pl:"ODWOŁAJ",en:"CANCEL"});
	}
}
function odpodatkuj(jax,jay){
	var opx,opy;
	oph = heks[jax][jay];
	ao = 0;
	while(ao<heks[jax][jay].dpodatnum){


                co = 0;
                while(co<oph.drpon){
                        if(oph.drpox[co] == jax && oph.drpoy[co] == jay){
                                eo = co;
                                while(eo<oph.drpon-1){
                                        oph.drpop[eo] = oph.drpop[eo+1];
                                        oph.drpok[eo] = oph.drpok[eo+1];
                                        oph.drpox[eo] = oph.drpox[eo+1];
                                        oph.drpoy[eo] = oph.drpoy[eo+1];
                                        eo++;
                                }
                                oph.drpon--;
                                oph.zmiana++;
                        }
                        co++;
                }

		bo = 0;
		while(bo<heks[jax][jay].dpodato[ao]){

			oph = oph.border[heks[jax][jay].dpodatk[ao]];

			co = 0;
			while(co<oph.drpon){
				if(oph.drpox[co] == jax && oph.drpoy[co] == jay){
					eo = co;
					while(eo<oph.drpon-1){
						oph.drpop[eo] = oph.drpop[eo+1];
						oph.drpok[eo] = oph.drpok[eo+1];
						oph.drpox[eo] = oph.drpox[eo+1];
						oph.drpoy[eo] = oph.drpoy[eo+1];
						eo++;
					}
					oph.drpon--;
					oph.zmiana++;
				}
				co++;
			}

			bo++;
		}
		ao++;
	}
	a = 0;
	var stao = false;
	while(a<oph.trybutariuszy){
		if(!stao){
			if(oph.trybutariusze[a][0]==heks[jax][jay][0] && oph.trybutariusze[a][1]==heks[jax][jay][1]){
				stao = true;
				oph.trybutariuszy--;
			}
		}
		if(stao){
			oph.trybutariusze[a] = oph.trybutariusze[a+1];
		}
		a++;
	}
	//oph.wplywy -= heks[jax][jax].podatl-heks[jax][jax].dposzlo;
	heks[jax][jay].dpodszlo = 0;
	heks[jax][jay].dpodatnum = 0;

	heks[jax][jay].podatnum = 0;
	heks[jax][jay].podatl = 0;
	heks[jax][jay].podatpr = 0;
}
function przekazk(hax,hay){
	//if(heks[hax][hay].undr == kolej){
	var oph = heks[hax][hay];
	ao = 0;
	while(ao<heks[hax][hay].dpodatnum){

		bo = 0;
		while(bo<heks[hax][hay].dpodato[ao]){

			oph = oph.border[heks[hax][hay].dpodatk[ao]];

			bo++;
		}
		ao++;
	}
	if(oph.undr == heks[hax][hay].undr){
		if(heks[hax][hay].undr == kolej){
			heks[hax][hay].kasy-=heks[hax][hay].podatl;
			oph.kasy+=heks[hax][hay].podatl-heks[hax][hay].dpodszlo;
		}
	} else {
		odpodatkuj(hax,hay);
	}
	/*} else */if(heks[hax][hay].undr == -1) {
		odpodatkuj(hax,hay);
	}
}
function uniw(kolq,uni){
	wat = 0;
	ahh = 0;
	while(ahh<heks[unix[kolq][uni].x][unix[kolq][uni].y].unp){
		if(heks[unix[kolq][uni].x][unix[kolq][uni].y].unt[ahh]==uni){
			wat = ahh;
		}
		ahh++;
	}
	return wat;
}
function celuj(xhh,yhh,dru,uni,changeTheState){
    var zaznu_original = zaznu
	if(unix[kolej][zaznu].celd!=-1 || (unix[kolej][zaznu].sebix==unix[kolej][zaznu].x && unix[kolej][zaznu].sebiy==unix[kolej][zaznu].y)){
		oddroguj(zaznu,kolej,false);
	}
	var zix = unix[kolej][zaznu].x
	var ziy = unix[kolej][zaznu].y
	kiera = 0;
	if(xhh==tx){
		if(yhh<ty){
			kiera = 0;
		} else {
			kiera = 3;
		}
	} else if(xhh<tx){
		if(xhh%2==0){
			if(yhh<=ty){
				kiera = 5;
			} else {
				kiera = 4;
			}
		} else {
			if(yhh<ty){
				kiera = 5;
			} else {
				kiera = 4;
			}
		}
	} else {
		if(xhh%2==0){
			if(yhh<=ty){
				kiera = 1;
			} else {
				kiera = 2;
			}
		} else {
			if(yhh<ty){
				kiera = 1;
			} else {
				kiera = 2;
			}
		}
	}
	//kier = (kier+5)%6;
	tph = heks[tx][ty];
	if(dru==kolej){
		if(unix[kolej][zaznu].ruchy>0){
		heks[tph.x][tph.x].drogpr[tph.drogn-1] = 2;
		//tph.drogp[tph.drogn-1] = -1;
		tph.drogk[tph.drogn-1] = kiera;
		tph.drogg[tph.drogn-1] = zaznu;
		tph.drogd[tph.drogn-1] = kolej;
		tph.drogw[tph.drogn-1] = uniw(kolej,zaznu);
		tph.drogkol[tph.drogn-1] = 0;

		tph.ktodro[uni] = tph.drogn-1;
		tph.zmiana++;
		//tph.drogn++;
		} else {
		heks[tph.x][tph.x].drogpr[tph.drogn] = 2;
		tph.drogp[tph.drogn] = -1.11;
		tph.drogk[tph.drogn] = kiera;
		tph.drogg[tph.drogn] = zaznu;
		tph.drogd[tph.drogn] = kolej;
		tph.drogw[tph.drogn] = uniw(kolej,zaznu);
		if(unix[kolej][zaznu].rodz==unix[dru][uni].rodz){
			tph.drogkol[tph.drogn] = 1;
		} else if(unix[dru][uni].rodz==10) {
			tph.drogkol[tph.drogn] = 3;
		}
		tph.ktodro[uni] = tph.drogn;
		tph.zmiana++;
		tph.drogn++;
		}

		heks[xhh][yhh].drogpr[heks[xhh][yhh].drogn] = 2;
		heks[xhh][yhh].drogp[heks[xhh][yhh].drogn] = (kiera+3)%6;
		heks[xhh][yhh].drogk[heks[xhh][yhh].drogn] = -1.11;
		heks[xhh][yhh].drogg[heks[xhh][yhh].drogn] = zaznu;
		heks[xhh][yhh].drogd[heks[xhh][yhh].drogn] = kolej;
		heks[xhh][yhh].drogw[heks[xhh][yhh].drogn] = uniw(kolej,zaznu);
		if(unix[kolej][zaznu].rodz==unix[dru][uni].rodz){
			heks[xhh][yhh].drogkol[heks[xhh][yhh].drogn] = 1;
		} else if(unix[dru][uni].rodz==10) {
			heks[xhh][yhh].drogkol[heks[xhh][yhh].drogn] = 3;
		}
		heks[xhh][yhh].ktodro[uni] = heks[xhh][yhh].drogn;
		heks[xhh][yhh].zmiana++;
		heks[xhh][yhh].drogn++;


		unix[kolej][zaznu].rozb = 0;

		unix[kolej][zaznu].celd = dru;
		unix[kolej][zaznu].celu = uni;
		unix[kolej][zaznu].celk = kiera;

		unix[kolej][zaznu].ruchk[unix[kolej][zaznu].ruchy] = kiera;
		unix[kolej][zaznu].rucho[unix[kolej][zaznu].ruchy] = 0;
		if(unix[dru][uni].d==kolej)
		oddroguj(uni,dru,false);

		unix[dru][uni].rozb = false;
		unix[dru][uni].celed[unix[dru][uni].celen] = kolej;
		unix[dru][uni].celeu[unix[dru][uni].celen] = zaznu;
		unix[dru][uni].celen++;
		if(unix[dru][uni].ruchy>0){
			odzaznaj(changeTheState);
		}
	} else {
		var wiazka = [];
		var wiah = heks[unix[kolej][zaznu].sebix][unix[kolej][zaznu].sebiy];
		wiazka[wiah.x] = wiah.y;
		while(wiah.x>0 && (wiah.y>=0 || wiah.x%2==1)){
			var wiaz = wiah.x;
			if(ziy>=scian/2){
				wiah = wiah.border[5];
			} else {
				wiah = wiah.border[4];
			}
			if(wiah == null)
				break
			wiazka[wiah.x] = wiah.y;
		}
		wiah = heks[unix[kolej][zaznu].sebix][unix[kolej][zaznu].sebiy];
		wiazka[wiah.x] = wiah.y;
		while(wiah.x<scian-1 && (wiah.y>=0 || wiah.x%2==1)){
			var wiaz = wiah.x;
			if(ziy>=scian/2){
				wiah = wiah.border[1];
			} else {
				wiah = wiah.border[2];
			}
			if(wiah == null)
				break
			wiazka[wiah.x] = wiah.y;
		}
		wiah = heks[unix[dru][uni].x][unix[dru][uni].y];
		while((wiah.x!=unix[kolej][zaznu].sebix || wiah.y!=unix[kolej][zaznu].sebiy) && wiah != null){
			if(wiah.x==unix[kolej][zaznu].sebix){
				if(wiah.y>=unix[kolej][zaznu].sebiy){
					kiera = 0;
				} else {
					kiera = 3;
				}
			} else if(wiah.x<unix[kolej][zaznu].sebix){
				if(ziy>=scian/2){
					if(wiah.y<=wiazka[wiah.x]){
						kiera = 2;
					} else {
						kiera = 1;
					}
				} else {
					if(wiah.y>=wiazka[wiah.x]){
						kiera = 1;
					} else {
						kiera = 2;
					}
				}
			} else if(wiah.x>unix[kolej][zaznu].sebix){
				if(ziy>=scian/2){
					if(wiah.y<=wiazka[wiah.x]){
						kiera = 4;
					} else {
						kiera = 5;
					}
				} else {
					if(wiah.y>=wiazka[wiah.x]){
						kiera = 5;
					} else {
						kiera = 4;
					}
				}
			}
			wiah.drogpr[wiah.drogn] = 2;
			wiah.drogp[wiah.drogn] = -1.11;
			wiah.drogk[wiah.drogn] = kiera;
			wiah.drogg[wiah.drogn] = zaznu;
			wiah.drogd[wiah.drogn] = kolej;
			wiah.drogw[wiah.drogn] = uniw(kolej,zaznu);
			wiah.drogkol[wiah.drogn] = 2;
			wiah.ktodro[uni] = wiah.drogn;
			wiah.zmiana++;

                        wiah.drogn++;


			var wiaz = wiah.x;
			wiah = wiah.border[kiera];

			wiah.drogpr[wiah.drogn] = 2;
			wiah.drogp[wiah.drogn] = (kiera-(-3))%6;
			wiah.drogk[wiah.drogn] = -1.11;
			wiah.drogg[wiah.drogn] = zaznu;
			wiah.drogd[wiah.drogn] = kolej;
			wiah.drogw[wiah.drogn] = uniw(kolej,zaznu);
			wiah.drogkol[wiah.drogn] = 2;
			wiah.ktodro[uni] = wiah.drogn;
			wiah.zmiana++;
			wiah.drogn++;

		}
			unix[kolej][zaznu].rozb = 0;

			unix[kolej][zaznu].celd = dru;
			unix[kolej][zaznu].celu = uni;
			unix[kolej][zaznu].celk = kiera;

			unix[kolej][zaznu].ruchk[unix[kolej][zaznu].ruchy] = kiera;
			unix[kolej][zaznu].rucho[unix[kolej][zaznu].ruchy] = 0;
			if(dru==kolej)
			oddroguj(uni,dru,false);

			//unix[dru][uni].rozb = false;
			unix[dru][uni].celed[unix[dru][uni].celen] = kolej;
			unix[dru][uni].celeu[unix[dru][uni].celen] = zaznu;
			unix[dru][uni].celen++;
			if(unix[dru][uni].ruchy>0){
				odzaznaj(changeTheState);
			}
	}

	dokolejki(zaznu_original);
}
function droguj(xhh,yhh,uni){
	var kier;
	if(xhh==tx){
		if(yhh<ty){
			kier = 0;
		} else {
			kier = 3;
		}
	} else if(xhh<tx){
		if(xhh%2==0){
			if(yhh<=ty){
				kier = 5;
			} else {
				kier = 4;
			}
		} else {
			if(yhh<ty){
				kier = 5;
			} else {
				kier = 4;
			}
		}
	} else {
		if(xhh%2==0){
			if(yhh<=ty){
				kier = 1;
			} else {
				kier = 2;
			}
		} else {
			if(yhh<ty){
				kier = 1;
			} else {
				kier = 2;
			}
		}
	}
	tph = heks[tx][ty];

	var natan = -1;
	if(unix[kolej][uni].szyt=="l" && szyt[unix[kolej][uni].rodz]!="l"){
		natan = 10;
	}

	tph.drogp[tph.drogn] = -1.11;
	if(unix[kolej][uni].ruchy>0){
		tph.drogp[tph.drogn] = (kierk+3)%6;
		//tph.drogn--;
	} else {
		//tph.drogn = 0;
	}
	moz = true;
	dloh = 0;

		tph.drogk[tph.drogn] = kier;
		tph.drogg[tph.drogn] = uni;
		tph.drogd[tph.drogn] = kolej;
		tph.drogw[tph.drogn] = uniw(kolej,uni);
		tph.drogkol[tph.drogn] = 0;
		tph.drogh[tph.drogn] = unix[kolej][uni].ruchh;

		tph.ktodro[uni] = tph.drogn;
		tph.zmiana++;
		tph.drogpr[tph.drogn] = 0;
	if(unix[kolej][uni].ruchy==0){
		tph.drogk[tph.drogn] = kier;
		tph.drogp[tph.drogn] = -1.11;
		tph.drogpr[tph.drogn] = 2;
		unix[kolej][uni].ruchh = 0;
		dust = 0;
	} else {
	}/*
		if(unix[kolej][uni].ruchh<szy[unix[kolej][uni].rodz] && dust<1){
			tph.drogpr[tph.drogn] = 2;
		} else if(unix[kolej][uni].ruchh<=szy[unix[kolej][uni].rodz] && dust<2){
			tph.drogpr[tph.drogn] = 1;
		} else {
			tph.drogpr[tph.drogn] = 0;
		}*/
	//test.innerHTML = tph.drogn;
		tph.drogn++;
	while(tph!=null && tph.x>=0 && tph.y>=0 && tph.x<scian && tph.y<scian && moz){
		hph = tph;
		tph = tph.border[kier];

		tph.drogp[tph.drogn] = (kier+3)%6;
		dloh++;
		unix[kolej][uni].ruchh++;
		if(tph.z==-1 && unix[kolej][uni].szyt!="w" && unix[kolej][uni].szyt!="l"){
			dust = 2;
		}
		if(tph.z==-2 && unix[kolej][uni].szyt!="g" && unix[kolej][uni].szyt!="l" && dust==0){
			dust = 1;
		}
		//console.log(unix[kolej][uni].ruchh)
		if(unix[kolej][uni].ruchh<unix[kolej][uni].szy && dust<=1){
			tph.drogpr[tph.drogn] = 2;
		} else if(unix[kolej][uni].ruchh<=unix[kolej][uni].szy && dust<1){
			tph.drogpr[tph.drogn] = 1;
			if(dust==1){
				dust=2;
			}
		} else {
			tph.drogpr[tph.drogn] = 0;
		}
		if(tph.x==xhh && tph.y==yhh){
			tph.drogp[tph.drogn] = (kier+3)%6;

			unix[kolej][uni].sebix = xhh;
			unix[kolej][uni].sebiy = yhh;
			unix[kolej][uni].ruchk[unix[kolej][uni].ruchy] = kier;
			unix[kolej][uni].rucho[unix[kolej][uni].ruchy] = dloh;
			unix[kolej][uni].ruchy++;
			moz = false;
			tph.drogk[tph.drogn] = -1.11;
			tph.drogpr[tph.drogn] = 0;
		} else {
			tph.drogk[tph.drogn] = kier;
		}
		tph.drogg[tph.drogn] = uni;
		tph.drogd[tph.drogn] = kolej;
		tph.drogw[tph.drogn] = uniw(kolej,uni);
		tph.drogh[tph.drogn] = unix[kolej][uni].ruchh;
		tph.ktodro[uni] = tph.drogn;
		tph.drogkol[tph.drogn] = 0;
		tph.zmiana++;
		tph.drogn++;
	}
	/*if(unix[kolej][uni].celen>0)
	odceluj(uni);*/
    unix[kolej][uni].rozb = 0
	dokolejki(uni);
	kierk = kier;
}
function odceluj(uni,dru){
	
		var afa = 0;
		while(unix[dru][uni].celen>0){
			var pagx,pagy;
			//if(unix[dru][uni].celeu[unix[dru][uni].celen-1],unix[dru][uni].celed[unix[dru][uni].celen-1] == undefined)
			//	continue
			if(unix[dru][uni].celeu[unix[dru][uni].celen-1] != -1 && unix[dru][uni].celed[unix[dru][uni].celen-1] != -1 && unix[unix[dru][uni].celed[unix[dru][uni].celen-1]][unix[dru][uni].celeu[unix[dru][uni].celen-1]].x != -1){
				if(unix[dru][uni].celeu[unix[dru][uni].celen-1].x == -1){
					unix[dru][uni].celeu[unix[dru][uni].celen-1] = -1;
					unix[dru][uni].celed[unix[dru][uni].celen-1] = -1;
				} else {
					oddroguj(unix[dru][uni].celeu[unix[dru][uni].celen-1],unix[dru][uni].celed[unix[dru][uni].celen-1],true);
					/*unix[unix[kolej][uni].celed[unix[kolej][uni].celen-1]][unix[kolej][uni].celeu[unix[kolej][uni].celen-1]].celk = -1;
					unix[unix[kolej][uni].celed[unix[kolej][uni].celen-1]][unix[kolej][uni].celeu[unix[kolej][uni].celen-1]].celd = -1;
					unix[unix[kolej][uni].celed[unix[kolej][uni].celen-1]][unix[kolej][uni].celeu[unix[kolej][uni].celen-1]].celu = -1;*/
					unix[dru][uni].celeu[unix[dru][uni].celen-1] = -1;
					unix[dru][uni].celed[unix[dru][uni].celen-1] = -1;
				}
			} else {
				unix[unix[dru][uni].celed[unix[dru][uni].celen-1]][unix[dru][uni].celeu[unix[dru][uni].celen-1]].kosz = true
			}


			unix[dru][uni].celen--;
		}
	//}
		//unix[kolej][uni].celen--;
}
function przeceluj(uni,uni2,dru){


		var afa = 0;
		while(unix[dru][uni].celen>0){
			var pagx,pagy;

			var tenu = unix[unix[dru][uni].celed[unix[dru][uni].celen-1]][unix[dru][uni].celeu[unix[dru][uni].celen-1]];
			tenu.celu = uni2;
			unix[dru][uni2].celeu[unix[dru][uni2].celen] = unix[dru][uni].celeu[unix[dru][uni].celen-1];
			unix[dru][uni2].celed[unix[dru][uni2].celen] = unix[dru][uni].celed[unix[dru][uni].celen-1];
			unix[dru][uni2].celen++;
			unix[dru][uni].celeu[unix[dru][uni].celen-1] = -1;
			unix[dru][uni].celed[unix[dru][uni].celen-1] = -1;


			unix[dru][uni].celen--;
		}
	//}
		//unix[kolej][uni].celen--;
}
function oddroguj(uni,koloj,odc,atakując){
	tph = hexOfUnit(unix[koloj][uni]);
	czyscc(uni,tph.x,tph.y,koloj);
	ajk = 0;
	while(ajk<unix[koloj][uni].ruchy){
		bjk = 0;
		while(bjk<unix[koloj][uni].rucho[ajk]){
			//console.log(tph.x+'#'+tph.y)
			tph = tph.border[unix[koloj][uni].ruchk[ajk]];
			czyscc(uni,tph.x,tph.y,koloj);
			tph.zmiana++;
			bjk++;
		}
		ajk++;
	}
			//testo.innerHTML = "kwa";
/*	if(unix[koloj][uni].celen>-1)
		odceluj(uni);*/
	if(unix[koloj][uni].celd!=-1){
                    tph = unix[unix[koloj][uni].celd][unix[koloj][uni].celu];
		if(unix[koloj][uni].celd==koloj){
                    //tph = unix[unix[koloj][uni].celd][unix[koloj][uni].celu];
			for(var i = 0;i<scian;i++){
				for(var j = 0;j<scian;j++){
                    czyscc(uni,i,j,koloj);
				}
			}


                    tph.zmiana++;
		} else {
                    var dru = unix[koloj][uni].celd;
                    var unin = unix[koloj][uni].celu;
                    var wiazka = [];
                    var wiah = /*unix[koloj][uni].sebix*/heks[tph.x][tph.y];
                    wiazka[wiah.x] = wiah.y;
                    while(wiah.x>0 && (wiah.y>0 || wiah.x%2==1)){
                            wiah = wiah.border[5];
                            wiazka[wiah.x] = wiah.y;
                    }
                    wiah = heks[unix[koloj][uni].sebix][unix[koloj][uni].sebiy];
                    wiazka[wiah.x] = wiah.y;
                    while(wiah.x<scian-1 && (wiah.y>0 || wiah.x%2==1)){
                            wiah = wiah.border[1];
                            wiazka[wiah.x] = wiah.y;
                    }
                    var wiah = /*unix[koloj][uni].sebix*/heks[tph.x][tph.y];
                    while((wiah.x!=unix[koloj][uni].sebix || wiah.y!=unix[koloj][uni].sebiy)){
                            if(wiah.x==unix[koloj][uni].sebix){
                                    if(wiah.y<wiazka[wiah.x]){
                                            kiera = 3;
                                    } else {
                                            kiera = 0;
                                    }
                            } else if(wiah.x<unix[koloj][uni].sebix){
                                    if(wiah.y<=wiazka[wiah.x]){
                                            kiera = 2;
                                    } else {
                                            kiera = 1;
                                    }
                            } else if(wiah.x>unix[koloj][uni].sebix){
                                    if(wiah.y<=wiazka[wiah.x]){
                                            kiera = 4;
                                    } else {
                                            kiera = 5;
                                    }
                            }


						for(var i = 0;i<scian;i++){
							for(var j = 0;j<scian;j++){
								czyscc(uni,i,j,koloj);
								czyscc(uni,i,j,koloj);
							}
						}
                            //czyscc(uni,wiah.x,wiah.y,koloj);
                            //czyscc(uni,wiah.x,wiah.y,koloj);


                            tph.zmiana++;

                            wiah = wiah.border[kiera];

							if(wiah == null)
								break


					}
		}
	var tao = 0;
	var mag = unix[unix[koloj][uni].celd][unix[koloj][uni].celu].celen;
	while(tao<unix[unix[koloj][uni].celd][unix[koloj][uni].celu].celen && !odc){
		if(unix[unix[koloj][uni].celd][unix[koloj][uni].celu].celeu[tao] == uni && unix[unix[koloj][uni].celd][unix[koloj][uni].celu].celed[tao] == koloj){
			mag = tao;
		}
		if(mag<=tao){
			unix[unix[koloj][uni].celd][unix[koloj][uni].celu].celeu[tao] = unix[unix[koloj][uni].celd][unix[koloj][uni].celu].celeu[tao-(-1)];
			unix[unix[koloj][uni].celd][unix[koloj][uni].celu].celed[tao] = unix[unix[koloj][uni].celd][unix[koloj][uni].celu].celed[tao-(-1)];
		}
		tao++;
	}
	if(mag<=tao && !odc){
		unix[unix[koloj][uni].celd][unix[koloj][uni].celu].celen--;
	}
	unix[koloj][uni].celk = -1;
	unix[koloj][uni].celd = -1;
	unix[koloj][uni].celu = -1;
	}
	unix[koloj][uni].ruchy = 0;
	unix[koloj][uni].ruchh = 0;

	unix[koloj][uni].wypax = -1;
	unix[koloj][uni].wypay = -1;

	if(koloj != -2){
		unix[koloj][uni].rucho.length = 0;
		unix[koloj][uni].ruchk.length = 0;
	}
}
function przeczyscc(unu,kpx,kpy,dru,drogh){
	var numa = 0
	while(numa<heks[kpx][kpy].drogn){
		if(heks[kpx][kpy].drogd[numa] == dru && heks[kpx][kpy].drogg[numa] == unu && (drogh == undefined || heks[kpx][kpy].drogh[numa] <= drogh+1)){
			heks[kpx][kpy].drogp[numa] = -1
		}
		numa++;
	}
}
function czyscc(unu,kpx,kpy,dru,drogh){
	var numa = 0;

	while(numa<heks[kpx][kpy].drogn){
		if(heks[kpx][kpy].drogd[numa] == dru && heks[kpx][kpy].drogg[numa] == unu && (drogh == undefined || heks[kpx][kpy].drogh[numa] <= drogh+1)){
			var numu = numa;
			while(numu<heks[kpx][kpy].drogn-1){
				heks[kpx][kpy].drogp[numu] = heks[kpx][kpy].drogp[numu+1];
				heks[kpx][kpy].drogk[numu] = heks[kpx][kpy].drogk[numu+1];
				heks[kpx][kpy].drogpr[numu] = heks[kpx][kpy].drogpr[numu+1];
				heks[kpx][kpy].drogw[numu] = heks[kpx][kpy].drogw[numu+1];
				heks[kpx][kpy].drogd[numu] = heks[kpx][kpy].drogd[numu+1];
				heks[kpx][kpy].drogg[numu] = heks[kpx][kpy].drogg[numu+1];
				heks[kpx][kpy].drogh[numu] = heks[kpx][kpy].drogh[numu+1];
				heks[kpx][kpy].drogkol[numu] = heks[kpx][kpy].drogkol[numu+1];
				heks[kpx][kpy].ktodro[kolej][heks[kpx][kpy].drogg[numu]] = numu;

				numu++;
			}
			heks[kpx][kpy].drogn--;
			numa--
		}
		numa++;
	}
	numa = 0;
	while(numa<4){
	
		if(heks[kpx][kpy].wylad[numa] == unu && heks[kpx][kpy].wyladr[numa] == dru){
			heks[kpx][kpy].wylad[numa] = -1;
			heks[kpx][kpy].wyladr[numa] = -1;
		}
		if(heks[kpx][kpy].wyladr[numa] != -1 && heks[kpx][kpy].wylad[numa] in unix[heks[kpx][kpy].wyladr[numa]] && (unix[heks[kpx][kpy].wyladr[numa]][heks[kpx][kpy].wylad[numa]].szyt != 'l' && szyt[unix[heks[kpx][kpy].wyladr[numa]][heks[kpx][kpy].wylad[numa]].rodz] != 'l' || unix[heks[kpx][kpy].wyladr[numa]][heks[kpx][kpy].wylad[numa]].ruchy == 0)){
			heks[kpx][kpy].wylad[numa] = -1;
			heks[kpx][kpy].wyladr[numa] = -1;
		}
		numa++;
	}
}

function tatasuj(uni,wyski){
	tph = heks[unix[kolej][uni].x][unix[kolej][uni].y];
	numu = 0;
	while(numu<tph.drogn){
		if(tph.drogg[numu]==uni){
			break;
		}
		numu++;
	}
	//var numu = tph.ktodro[kolej][uni];
	tph.drogw[numu] = wyski;
	ajk = 0;
	while(ajk<unix[kolej][uni].ruchy){
		bjk = 0;
		while(bjk<unix[kolej][uni].rucho[ajk]){
			tph = tph.border[unix[kolej][uni].ruchk[ajk]];

			numu = 0;
			while(numu<tph.drogn){
				if(tph.drogg[numu]==uni){
					tph.drogw[numu] = wyski;
					tph.zmiana++;
					//break;
				}
				numu++;
			}
			//numu = tph.ktodro[kolej][uni];
			bjk++;
		}
		ajk++;
	}
	if(unix[kolej][uni].celd>-1){
		tx = tph.x;
		ty = tph.y;
		//testo.innerHTML = "tttt";
	tph = unix[unix[kolej][uni].celd][unix[kolej][uni].celu];
		var afa = 0;
		while(afa<tph.drogn){
			if(tph.drogg[afa]==uni && tph.drogd[afa]==kolej){
				var bfb = 0;
				while(bfb<heks[unix[kolej][uni].x][unix[kolej][uni].y].unp){
					if(heks[unix[kolej][uni].x][unix[kolej][uni].y].unt[bfb]==uni)
						tph.drogw[afa] = bfb;
					bfb++;
				}
			}
			afa++;
		}
	}

}
function divideUnit(uni,zost,changeTheState){
	//console.log(kolej,uni)
	if(unix[kolej][uni].il>zost && heks[unix[kolej][uni].x][unix[kolej][uni].y].unp<4){
		
		tx = unix[kolej][uni].x
		ty = unix[kolej][uni].y
		var pal = 0;
		while(pal<oddid[kolej] && !unix[kolej][pal].kosz){
			pal++;
		}
		/*if(pal==oddid[kolej])
		pal--;*/
		dodai(unix[kolej][uni].x,unix[kolej][uni].y,unix[kolej][uni].il-zost,unix[kolej][uni].rodz,0);
		unix[kolej][uni].il = zost;
		unix[kolej][pal].szy = unix[kolej][uni].szy;
		unix[kolej][pal].szyt = unix[kolej][uni].szyt;
		if(zaznu!=-1){
			
			tx = unix[kolej][uni].sebix;
			ty = unix[kolej][uni].sebiy;
            odzaznaj(changeTheState);
			
			unix[kolej][uni].sebix = unix[kolej][uni].x;
			unix[kolej][uni].sebiy = unix[kolej][uni].y;
			
            zaznu = pal;

            zaznaj(zaznu,changeTheState);
		}
		return pal
	}
	return -1
}
function expandUnit(uni,dost){
	var uax,uay;
	if(bloknia[kolej][unix[kolej][uni].rodz])
		return
	if(unix[kolej][uni].rozb==0){
		if(unix[kolej][uni].il<dost){
			oddroguj(uni,kolej,false);
			odceluj(uni,kolej);
			unix[kolej][uni].rozb = dost-unix[kolej][uni].il;
			unitDivisionValue = unix[kolej][uni].il;
			unitDivisionDraw();
			heks[unix[kolej][uni].x][unix[kolej][uni].y].zmiana++;
			expandButton.value = languagewise({'pl':"ZAPRZESTAJ ROZBUDOWY",'en':"STOP BUILDING"});
		}
	} else {
		unix[kolej][uni].rozb = 0;
		unitDivisionDraw();
		expandButton.value = languagewise({'pl':"ROZBUDUJ",'en':"BUILD"});
		if(unix[kolej][uni].il<=0){

			odzaznaj();
			var kv = -1;
			var kq = 0;
			while(kq<heks[unix[kolej][uni].x][unix[kolej][uni].y].unp){
				if(heks[unix[kolej][uni].x][unix[kolej][uni].y].unt[kq] == uni){
					kv = kq;
					kq = 4;
				}
				kq++;
			}
			uax = unix[kolej][uni].x;
			uay = unix[kolej][uni].y;
			heks[unix[kolej][uni].x][unix[kolej][uni].y].usun(kv);
			zaznu = -1;
			heks[uax][uay].zmiana++;
		}

	}
}
function dodai(unx,uny,ilo,typ,rosn){
	var pal = 0;
	while(pal<oddid[kolej] && !unix[kolej][pal].kosz){
		pal++;
	}
	heks[unx][uny].undr = kolej;
	heks[unx][uny].unbr = kolej;
	if(pal==oddid[kolej]){
		unix[kolej][pal] = new Unit(unx,uny,kolej,ilo,pal,pal,typ);
	} else {
	}
	unix[kolej][pal].szy = szy[typ];
	unix[kolej][pal].szyt = szyt[typ];
	unix[kolej][pal].x = unx;
	unix[kolej][pal].y = uny;
	unix[kolej][pal].d = kolej;
	unix[kolej][pal].il = ilo;
	unix[kolej][pal].num = oddnum[kolej];
	unix[kolej][pal].id = pal;
	unix[kolej][pal].rodz = typ;
	unix[kolej][pal].rozb = rosn;
	unix[kolej][pal].kosz = false;
	heks[unx][uny].zmiana++;

	unix[kolej][pal].ruchy = 0;			//ile ruchów
 unix[kolej][pal].ruchh = 0;

 unix[kolej][pal].sebix = unx;
 unix[kolej][pal].sebiy = uny;
 unix[kolej][pal].ata = -1;
 unix[kolej][pal].atakt = -1;

 unix[kolej][pal].kiero = 0;
 unix[kolej][pal].przes = 0;

 unix[kolej][pal].kolor = 0;

 unix[kolej][pal].celd = -1;
 unix[kolej][pal].celu = -1;
 unix[kolej][pal].celk = -1;

 unix[kolej][pal].celen = 0;

	heks[unx][uny].unt[heks[unx][uny].unp] = pal;
	heks[unx][uny].unp++;
	if(pal == oddid[kolej]){
		oddid[kolej]++;
	}
	oddnum[kolej]++;

	heks[unx][uny].koloruj();
}
function najbliz(hex,zas){
	var wyn = -1;
	var pamp = [hex];
	var pampow = 1;
	if(pamp[0].undr>-1 || pamp[0].z>0){
		wyn = pamp[0].undr;
	} else if(pamp[0].z!=-1){
	ag = 0;
	while(ag<=zas){
		var spamp = [];
		var spampow = 0;
		var bg = 0;
		while(bg<pampow){
			if(!pamp[bg].bydlo){
				var cg = 0;
				while(cg<6){
					if(pamp[bg].border[cg]!=null){
						if(pamp[bg].border[cg].z==-1){
						} else if(pamp[bg].border[cg].undr>-1 || pamp[bg].border[cg].z>0){
							wyn = pamp[bg].border[cg].undr;
							cg = 6;
							bg = pampow;
							ag = zas;
						} else {
							spamp[spampow] = pamp[bg].border[cg];
							spampow++;
						}
					}
					cg++;
				}
			}
			bg++;
		}
		bg = 0;
		while(bg<pampow){
			pamp[bg].bydlo = true;
			bg++;
		}
		bg = 0;
		while(bg<spampow){
			pamp[pampow] = spamp[bg];
			pampow++;
			bg++;
		}
		ag++;
	}
	ag = 0;
	while(ag<pampow){
		pamp[ag].bydlo = false;
		ag++;
	}
	} else if(0){

	}
	return wyn;
}
function koloruj(){
	this.kolz = najbliz(this,1);
	var najj = 0;
	var ag = 0;
	var lad = false;
	var wod = false;
	var gor = false;
	var gorn = false;
	while(ag<this.unp){
		if(this.unt[ag] in unix[this.undr]){
			if(unix[this.undr][this.unt[ag]].szyt=="g"){
				gorn = true;
			}
			if(unix[this.undr][this.unt[ag]].szyt=="w"){
				wod = true;
			}
			if(unix[this.undr][this.unt[ag]].szyt!="w" && unix[this.undr][this.unt[ag]].szyt!="l"){
				lad = true;
				if(unix[this.undr][this.unt[ag]].szyt!="c"){
					gor = true;
				}
			}
			if(unix[this.undr][this.unt[ag]].szy>=najj && unix[this.undr][this.unt[ag]].szyt!="l"){
				najj = unix[this.undr][this.unt[ag]].szy;
			}
		}
		ag++;
	}
	najj--;
	var pam = [this];
	var pamow = 1;
	ag = 0;
	while(ag<=najj){
		var spam = [];
		var spamow = 0;
		bg = 0;
		while(bg<pamow){
			if(!pam[bg].bylo){
				cg = 0;
				while(cg<6){
					if(pam[bg].border[cg]!=null){
						if(pam[bg].border[cg].bylo){
						} else if(!wod && pam[bg].border[cg].z==-1){
						} else if(!gor && pam[bg].border[cg].z==-2){
						} else if(!lad && pam[bg].border[cg].z>=0){
						} else {
							pam[bg].border[cg].kolz = najbliz(pam[bg].border[cg],ag);
							pam[bg].border[cg].zmiana++;
							if(pam[bg].border[cg].kolz==this.kolz){
								spam[spamow] = pam[bg].border[cg];
								spamow++;
							}
						}
					}
					cg++;
				}
				pam[bg].bylo = true;
			}
			bg++;
		}
		bg = 0;
		while(bg<spamow){
			pam[pamow] = spam[bg];
			pamow++;
			bg++;
		}
		ag++;
	}
	ag = 0;
	while(ag<pamow){
		pam[ag].bylo = false;
		ag++;
	}
}
function mostuj(x,y,kierunek,ilosc){
	var ghh;
	ghh = heks[x][y].border[kierunek];
	heks[x][y].most[kierunek]=Math.max(0,heks[x][y].most[kierunek],ilosc);
	if(heks[x][y].most[kierunek]>99)
		heks[x][y].most[kierunek]=99;
	ghh.most[(kierunek+3)%6]=Math.max(0,ghh.most[(kierunek+3)%6],ilosc);
	if(ghh.most[(kierunek+3)%6]>99)
		ghh.most[(kierunek+3)%6]=99;
	ghh.zmiana++;
	if(ghh.z==-1 && ghh.unt[-1]==null){
		unix[-2][oddid[-2]] = new obiektMost(ghh);
	}
}
function przenies(kierunek){
	var rer = 0;
	var taik = false;
	var peh = hexOfUnit(this).border[kierunek];
	var ton = 0;
	var tox = this.x,toy = this.y;
	if(peh.undr!=kolej && peh.undr!=-1){
		atakuj(this.id,peh,peh.undr);
	}
	if(peh.unp<4 && (peh.undr==-1 || peh.undr==kolej)){
		if(peh.z != -1 || this.szyt=="w" || this.szyt=="l"){
			if(peh.z != -1 && this.szyt=="w" && szyt[this.rodz]!="w"){

				dodai(this.x,this.y,this.il,8,0);
				this.szyt = szyt[this.rodz];
				this.szy = szy[this.rodz];
				jesio = 0;
			} else if(hexOfUnit(this).z==-1){
				if((zast[this.rodz]=="m" && (hexOfUnit(this).most[kierunek]<this.il || peh.most[(kierunek+3)%6]<this.il)) && this.szyt==szyt[this.rodz]){
					mostuj(this.x,this.y,kierunek,this.il);
				}
			}
			while(rer<hexOfUnit(this).unp){
				if(hexOfUnit(this).unt[rer] == this.id){
					taik = true;
					hexOfUnit(this).unp--;
				}
				if(taik && rer<hexOfUnit(this).unp){
					hexOfUnit(this).unt[rer] = hexOfUnit(this).unt[rer+1];
				}
				rer++;
			}
			if(hexOfUnit(this).unp == 0){
				hexOfUnit(this).undr = -1;
				hexOfUnit(this).unbr = -1;
			}
			tox = this.x;
			toy = this.y;
			ton = 1;
			this.x = peh.x;
			this.y = peh.y;
			this.sebix = peh.x;
			this.sebiy = peh.y;
			hexOfUnit(this).unt[hexOfUnit(this).unp] = this.id;
			hexOfUnit(this).unp++;
			hexOfUnit(this).undr = kolej;
			hexOfUnit(this).unbr = kolej;
			heks[tox][toy].koloruj();
			hexOfUnit(this).koloruj();

		} else if(peh.z == -1){

			var numw = 0;
			var nump = this.il;
			if(peh.unp>0 && peh.undr==kolej){
				var gv = peh.unp-1;
				while(gv>=0){
					if(szyt[unix[kolej][peh.unt[gv]].rodz]=='w' && zast[unix[kolej][peh.unt[gv]].rodz]=='x' && peh.unt[gv] != -1 && unix[kolej][peh.unt[gv]].rozb==0){
						while(nump>0 && unix[kolej][peh.unt[gv]].il>0){
							nump--;
							numw++;
							unix[kolej][peh.unt[gv]].il--;
						}
						if(unix[kolej][peh.unt[gv]].il==0){
							peh.usun(gv);
						}
					}
					gv--;
				}
			}
			var gv = hexOfUnit(this).unp-1;
			while(gv>=0){
				if(szyt[unix[kolej][hexOfUnit(this).unt[gv]].rodz]=='w' && zast[unix[kolej][hexOfUnit(this).unt[gv]].rodz]=='x' && unix[kolej][hexOfUnit(this).unt[gv]].rozb==0){
					while(nump>0 && unix[kolej][hexOfUnit(this).unt[gv]].il>0){
						nump--;
						numw++;
						unix[kolej][hexOfUnit(this).unt[gv]].il--;
					}
					if(unix[kolej][hexOfUnit(this).unt[gv]].il==0){
						hexOfUnit(this).usun(gv);
					}
				}
				gv--;
			}
			if(nump>0 && numw>0){
				divideUnit(this.id,numw);
			}
			if(numw>0){
				while(rer<hexOfUnit(this).unp){
					if(hexOfUnit(this).unt[rer] == this.id){
						taik = true;
						hexOfUnit(this).unp--;
					}
					if(taik && rer<hexOfUnit(this).unp){
						hexOfUnit(this).unt[rer] = hexOfUnit(this).unt[rer+1];
					}
					rer++;
				}
				if(hexOfUnit(this).unp == 0){
					hexOfUnit(this).undr = -1;
					hexOfUnit(this).unbr = -1;
				}
				tox = this.x;
				toy = this.y;
				ton = 1;
				this.x = peh.x;
				this.y = peh.y;
				this.sebix = peh.x;
				this.sebiy = peh.y;
				hexOfUnit(this).unt[hexOfUnit(this).unp] = this.id;
				hexOfUnit(this).unp++;
				hexOfUnit(this).undr = kolej;
				hexOfUnit(this).unbr = kolej;
				this.szyt = "w";
				this.szy = szy[8];
				jesio = szy[8];
			} else {
				if(this.szyt==szyt[this.rodz]){
					if((zast[this.rodz]=="m" && (hexOfUnit(this).most[kierunek]<this.il || peh.most[(kierunek+3)%6]<this.il))){
						mostuj(this.x,this.y,kierunek,this.il);
						jesio = 0;
					} else if(peh.most[(kierunek+3)%6]==0){
						jesio = -1;
					}
				}
			}

			if(peh.most[(kierunek+3)%6]>0 && this.szyt == szyt[this.rodz]){
				var numw = peh.most[(kierunek+3)%6];
				var nump = this.il;
				var gv = 0;
				while(numw>0 && gv<peh.unp){
					if(unix[kolej][peh.unt[gv]].szyt!="l" && unix[kolej][peh.unt[gv]].szyt!="w" && unix[kolej][peh.unt[gv]].zast!="m"){
						var zostao = unix[kolej][peh.unt[gv]].il;
						while(numw>0 && zostao>0){
							numw--;
							zostao--;
						}
					}
					gv++;
				}
				if(numw<this.il && numw>0){
					divideUnit(this.id,numw);
				}
				if(numw>0){
					while(rer<heks[tox][toy].unp){
						if(heks[tox][toy].unt[rer] == this.id){
							taik = true;
							heks[tox][toy].unp--;
						}
						if(taik && rer<heks[tox][toy].unp){
							heks[tox][toy].unt[rer] = heks[tox][toy].unt[rer+1];
						}
						rer++;
					}
					if(heks[tox][toy].unp == 0){
						heks[tox][toy].undr = -1;
						heks[tox][toy].unbr = -1;
					}
					//tox = this.x;
					//toy = this.y;
					ton = 1;
					this.x = peh.x;
					this.y = peh.y;
					this.sebix = peh.x;
					this.sebiy = peh.y;
					hexOfUnit(this).unt[hexOfUnit(this).unp] = this.id;
					hexOfUnit(this).unp++;
					hexOfUnit(this).undr = kolej;
					hexOfUnit(this).unbr = kolej;
					heks[tox][toy].koloruj();
					hexOfUnit(this).koloruj();
				} else {
					jesio = -1;
				}
			}
		}
		odceluj(this.id,kolej);
	} else {
		jesio = -1;
	}
	if(ton>0){
		przeczyscc(this.id,this.x,this.y,this.d,0)
		czyscc(this.id,tox,toy,this.d,0);
		//aktdroguj(kolej,this.id);
	}
}

//returns hexagon where unit is placed
function hexOfUnit(unit){
	if(unit.x == -1 || unit.y == -1)
		return heks[unit.sebix][unit.sebiy];
	return heks[unit.x][unit.y];
}

function aktdroguj(kolejk,uni){
	if(uni!=-1){
	tph = unix[kolejk][uni];
	zasieg = unix[kolejk][uni].szy;
	tphx = hexOfUnit(tph)
	a = 0;
	if(tphx != null){
		while(a<tphx.drogn){
			if(tphx.drogg[a]==uni && tphx.drogd[a]==kolejk && tphx.drogh[a]<=1 && tphx.drogkol[a]==0){
				//tphx.drogp[a] = -1;
				//tphx.drogk[a] = -1;

				tphx.drogw[a] = uniw(kolejk,uni);
				tphx.drogpr[a] = 2;
				tphx.drogh[a] = 0;
			}
			a++;
		}
	}
	tphx.zmiana++;
	tph = tphx
	var drogow = 0
	ajk = 0;
	while(ajk<unix[kolejk][uni].ruchy){
		bjk = 0;
		while(bjk<unix[kolejk][uni].rucho[ajk]){
			//console.log(tph.x+'#'+tph.y+'#'+unix[kolejk][uni].ruchk[ajk])
			drogow++
			//console.log(tph,unix[kolejk][uni].ruchk[ajk])
			tph = hexOfUnit(tph).border[unix[kolejk][uni].ruchk[ajk]];
			if(tph == undefined)
				break
			if(zasieg>=0){
				zasieg--;
			}
			if(zasieg > 0){
				if(tph.z == -2 && unix[kolejk][uni].szyt!="l" && unix[kolejk][uni].szyt!="g"){
					zasieg = 0;
				}
				if(tph.z == -1 && unix[kolejk][uni].szyt!="w" && unix[kolejk][uni].szyt!="l"){
					zasieg = -1;
				}
			}
				a = 0;
				while(a<tph.drogn){
					if(tph.drogg[a]==uni && tph.drogd[a]==kolejk && tph.drogh[a] <= drogow+1){
						if(zasieg >= 0){
							tph.drogw[a] = uniw(kolejk,uni);
							if(zasieg>0){
								tph.drogpr[a] = 2;
							} else {
								tph.drogpr[a] = 1;
							}
						}
						tph.drogh[a] = drogow;

					}

					a++;
				}
			tph.zmiana++;
			bjk++;
		}
		ajk++;
	}
	/*
	if(false && unix[kolejk][uni].celd>-1 && unix[unix[kolejk][uni].celd][unix[kolejk][uni].celu].x>-1){
        if(unix[kolejk][uni].celd!=kolej){
            tx = tph.x;
            ty = tph.y;
            //testo.innerHTML = "tttt";
                    tph = unix[unix[kolejk][uni].celd][unix[kolejk][uni].celu];
            var afa = 0;
            while(afa<tph.drogn){
                if(tph.drogg[afa]==uni && tph.drogd[afa]==kolejk){
                    var bfb = 0;
                    while(bfb<heks[unix[kolejk][uni].x][unix[kolejk][uni].y].unp){
                        if(heks[unix[kolejk][uni].x][unix[kolejk][uni].y].unt[bfb]==uni)
                            tph.drogw[afa] = bfb;
                        bfb++;
                    }
                }
                afa++;
            }
        } else {

            var wiazka = [];
            var wiah = heks[unix[kolejk][uni].sebix][unix[kolejk][uni].sebiy];
            wiazka[wiah.x] = wiah.y;
            while(wiah.x>0 && (wiah.y>0 || wiah.x%2==1)){
                wiah = wiah.border[5];
                wiazka[wiah.x] = wiah.y;
            }
            wiah = heks[unix[kolejk][uni].sebix][unix[kolejk][uni].sebiy];
            wiazka[wiah.x] = wiah.y;
            while(wiah.x<scian-1 && (wiah.y>0 || wiah.x%2==1)){
                wiah = wiah.border[1];
                wiazka[wiah.x] = wiah.y;
            }
            wiah = unix[unix[kolejk][uni].celd][unix[kolejk][uni].celu]
            wiah = heks[wiah.x][wiah.y]
            while((wiah.x!=unix[kolejk][uni].sebix || wiah.y!=unix[kolejk][uni].sebiy)){
                if(wiah.x==unix[kolejk][uni].sebix){
                    if(wiah.y>=unix[kolejk][uni].sebiy){
                        kiera = 0;
                    } else {
                        kiera = 3;
                    }
                } else if(wiah.x<unix[kolejk][uni].sebix){
                    if(wiah.y<=wiazka[wiah.x]){
                        kiera = 2;
                    } else {
                        kiera = 1;
                    }
                } else if(wiah.x>unix[kolejk][uni].sebix){
                    if(wiah.y<=wiazka[wiah.x]){
                        kiera = 4;
                    } else {
                        kiera = 5;
                    }
                }
                tph = wiah;
                var afa = 0;
                            while(afa<tph.drogn){
                                    if(tph.drogg[afa]==uni && tph.drogd[afa]==kolejk){
                                            var bfb = 0;
                                            while(bfb<heks[unix[kolejk][uni].x][unix[kolejk][uni].y].unp){
                                                    if(heks[unix[kolejk][uni].x][unix[kolejk][uni].y].unt[bfb]==uni)
                                                            tph.drogw[afa] = bfb;
                                                    bfb++;
                                            }
                                    }
                                    afa++;
                            }

                            wiah = wiah.border[5];


				}
			}
		}*/

	}
}
function pokadrogi(koli,uni){

	tph = unix[kolej][uni];
	ajk = 0;
	while(ajk<unix[kolej][uni].ruchy){
		bjk = 0;
		while(bjk<unix[kolej][uni].rucho[ajk]){
			tph = tph.border[unix[kolej][uni].ruchk[ajk]];
			tph.zmiana++;
			bjk++;
		}
		ajk++;
	}
}
function rozwijaj(hx,hy){
	var prodsta = heks[hx][hy].prod;
	var tsa = heks[hx][hy].unp-1;
	while(tsa>=0){
		var uniwyb = unix[kolej][heks[hx][hy].unt[tsa]];
		if(uniwyb.rozb>0 && !bloknia[kolej][uniwyb.rodz]){
			if(ces[uniwyb.rodz]>0){
				while(heks[hx][hy].kasy>=ced[uniwyb.rodz] && heks[hx][hy].stali>=ces[uniwyb.rodz] && prodsta>0 && uniwyb.rozb>0){
					uniwyb.il++;
					uniwyb.rozb--;
					heks[hx][hy].kasy-=ced[uniwyb.rodz];
					heks[hx][hy].stali-=ces[uniwyb.rodz];
					prodsta-=ces[uniwyb.rodz];
				}
			} else {
				while(heks[hx][hy].kasy>=ced[uniwyb.rodz] && uniwyb.rozb>0){
					uniwyb.il++;
					uniwyb.rozb--;
					heks[hx][hy].kasy-=ced[uniwyb.rodz];
				}
			}
		}
		tsa--;
	}
}
function kupuj(hx,hy){
	while(heks[hx][hy].kasy>=15 && heks[hx][hy].prodpl>0){
		heks[hx][hy].prod++;
		heks[hx][hy].prodpl--;
		heks[hx][hy].kasy-=15;
	}
	while(heks[hx][hy].kasy>=15 && heks[hx][hy].hutnpl>0){
		heks[hx][hy].hutn++;
		heks[hx][hy].hutnpl--;
		heks[hx][hy].kasy-=15;
	}
	while(heks[hx][hy].kasy>=30 && heks[hx][hy].zpl>0){
		heks[hx][hy].z++;
		heks[hx][hy].zpl--;
		heks[hx][hy].kasy-=30;
		heks[hx][hy].podatl = Math.floor(heks[hx][hy].z*heks[hx][hy].podatpr/100);
	}
	pokap();
}
function dohod(ah,bh){
	var liczb = heks[ah][bh].z;
	var wak = 0;
	var kaa = 0;
	while(kaa<heks[ah][bh].unp){
		if(unix[heks[ah][bh].undr][heks[ah][bh].unt[kaa]].szyt!="l")
		wak-=-unix[heks[ah][bh].undr][heks[ah][bh].unt[kaa]].il;
		kaa++;
	}
	if(wak<10){
		liczb = Math.floor(liczb*wak/10);
	}
	if(liczb <= 0)liczb = 1;
	return liczb;
}
function spoj(uni,unic){
	unix[kolej][unic].rozb-=-unix[kolej][uni].rozb;
	if(unix[kolej][unic].rozb>99)
		unix[kolej][unic].rozb=99;
	if(unix[kolej][uni].il-(-unix[kolej][unic].il)>99){
		unix[kolej][uni].il = unix[kolej][uni].il-(-unix[kolej][unic].il)-99;
		unix[kolej][unic].il = 99;
		oddroguj(uni,kolej,false);
		odceluj(unic,kolej);
		if(stan==4){
		jesio = -1;
		unix[kolej][uni].przes = 0;
		}
	} else {
		unix[kolej][unic].il -= -unix[kolej][uni].il;
		unix[kolej][uni].il = 0;
		var ata = 0;
		while(ata<4 && ata<heks[unix[kolej][uni].x][unix[kolej][uni].y].unp){
			if(heks[unix[kolej][uni].x][unix[kolej][uni].y].unt[ata] == uni){
				oddroguj(uni,kolej,false);
				heks[unix[kolej][uni].x][unix[kolej][uni].y].usun(ata);
				ata = 4;
			}
			ata++;
		}
		if(stan==4){
		unix[kolej][uni].przes = 0;
		}
	}
	unix[kolej][uni].celd = -1;
	unix[kolej][uni].celu = -1;
	unix[kolej][uni].celk = -1;
}
function graniczy(je,dw){
	var tg = false;
	var ta = 0;
	while(ta<6){
		if(hexOfUnit(je).border[ta].x==dw.x && hexOfUnit(je).border[ta].y==dw.y){
			tg = true;
		}
		ta++;
	}
	return tg;
}
function atakuj(uni,hek,dru){
	zbor = 0;
	robz = 0;
	var dwa = 2
		while(hek.unp>0 && bitni>0 && unix[kolej][uni].il>0 && (unix[dru][hek.unt[hek.unp-1]].il>0 || unix[dru][hek.unt[hek.unp-1]].rozb>0) && miaruj(uni,hek.unt[hek.unp-1],hek) && !unix[kolej][uni].kosz){
			unic = hek.unt[hek.unp-1];
			att = at[unix[kolej][uni].rodz]*dwa*ataz(unix[kolej][uni],unix[dru][unic],"a");
			obrrr = obrr[unix[dru][unic].rodz]*ataz(unix[kolej][uni],unix[dru][unic],"o");
			var wak = Math.floor(Math.random()*(att+1))-Math.floor(Math.random()*(obrrr+1));
			if(wak>0){
				unix[dru][unic].il-=wak;
				zbor+=wak;
			}
			if(unix[dru][unic].il<=0){
				//odceluj(unic,dru);
				var ata = 0;
				while(ata<4 && ata<heks[unix[dru][unic].x][unix[dru][unic].y].unp){
					if(heks[unix[dru][unic].x][unix[dru][unic].y].unt[ata] == unic){
						oddroguj(unic,dru,false);
						
						heks[unix[dru][unic].x][unix[dru][unic].y].usun(ata);
						ata = 4;
					}
					ata++;
				}
			} else if(unix[kolej][uni].il>=0 && unix[dru][unic].il>=0 && miaruj(unix[dru][unic],unix[kolej][uni],heks[unix[kolej][uni].x][unix[kolej][uni].y],true) && (zas[unix[kolej][uni].rodz]<=zas[unix[dru][unic].rodz])){
				att = at[unix[dru][unic].rodz]*dwa*ataz(unix[kolej][uni],unix[dru][unic],"o");
				obrrr = obrr[unix[kolej][uni].rodz]*ataz(unix[kolej][uni],unix[dru][unic],"a");
				wak = Math.floor(Math.random()*(att+1))-Math.floor(Math.random()*(obrrr+1));
				if(wak>0){
					unix[kolej][uni].il-=wak;
					robz+=wak;
				}
			}
			bitni--;
		}
	heks[unix[kolej][uni].x][unix[kolej][uni].y].zmiana = 24;
	heks[unix[kolej][uni].x][unix[kolej][uni].y].buchuj(robz);
	heks[unix[kolej][uni].x][unix[kolej][uni].y].plum = robz;
	if(unix[kolej][uni].il<=0){
		var ata = 0;
		while(ata<4 && ata<heks[unix[kolej][uni].x][unix[kolej][uni].y].unp){
			if(heks[unix[kolej][uni].x][unix[kolej][uni].y].unt[ata] == uni){
				oddroguj(uni,kolej,false);
				heks[unix[kolej][uni].x][unix[kolej][uni].y].usun(ata,true);
				ata = 4;
			}
			ata++;
		}
	}
	hek.zmiana = 24;
	hek.buchuj(zbor);
	hek.plum = zbor;
	ao = 0;
	while(ao<6){
		oph = hek;
		if(hek.border[ao]!=null){

			oph = hek.border[ao];
			oph.zmiana = 24;
			oph.buchuj(zbor/6);
		}
		ao++;
	}
	if(hek.unp>0){
		jesio = -1;
	} else if(unix[kolej][uni].celu != -1 && /*unix[unix[kolej][uni].celd][unix[kolej][uni].celu].x != -1 && */heks[unix[unix[kolej][uni].celd][unix[kolej][uni].celu].x][unix[unix[kolej][uni].celd][unix[kolej][uni].celu].y] == hek) {
		unix[kolej][uni].celd = -1;
		unix[kolej][uni].celu = -1;
		unix[kolej][uni].celk = -1;
	}
}
function czyutrzymasie(hek){
	var s = 0;
	var mostmax = 0;
	while(s<6){
		if(hek.most[s]>mostmax)
			mostmax=hek.most[s];
		s++;
	}
	var sumod = 0;
	var niszcz = false;
	var ung = 0;
	while(ung<hek.unp){
		if(!niszcz){
			sumod+=unix[hek.undr][hek.unt[ung]].il;
			if(sumod>mostmax){
				niszcz = true;
				unix[hek.undr][hek.unt[ung]].il-=(sumod-mostmax);
				hek.plum+=sumod-mostmax;
				if(unix[hek.undr][hek.unt[ung]].il<=0){
					hek.usun(ung);
				}
			}
		} else {
			hek.usun(ung);
		}
		ung++;
	}
	//alert(sumod+" "+mostmax);
}
function atakujmost(uni,hek){
	var s = 0;
	zbor = 0;
	s = 0
	bitni = unix[kolej][uni].il;
	while((hek.most[0]>0 || hek.most[1]>0 || hek.most[2]>0 || hek.most[3]>0 || hek.most[4]>0 || hek.most[5]>0) && bitni>0 && !unix[kolej][uni].kosz){
		unic = hek.unt[hek.unp-1];
		att = at[unix[kolej][uni].rodz];
		var wak = Math.floor(Math.random()*(att+1));
		if(wak>0){
			s = 0
			while(s<6){
				if(hek.most[s] > 0){
					hek.most[s]=Math.max(0,hek.most[s]-wak);
				}
				s++
			}
			czyutrzymasie(hek);
			zbor+=wak;
		}
		bitni--;
	}
	hek.zmiana = 20;
	hek.buchuj(zbor/6);
	ao = 0;
	var niema = 0;
	while(ao<6){
		if(hek.most[ao]>niema)
			niema = hek.most[ao];
		oph = hek;
		if(hek.border[ao]!=null){

			oph = hek.border[ao];
			oph.zmiana = 20;
			oph.buchuj(zbor/6);
		}
		ao++;
	}
	if(niema>0){
		jesio = -1;
	} else {
		hek.usunmost();
		unix[kolej][uni].celd = -1;
		unix[kolej][uni].celu = -1;
		unix[kolej][uni].celk = -1;
	}
}
function zespoj(uni,unic,changeTheState){
    var unichex = heks[unix[kolej][unic].x][unix[kolej][unic].y]
	if(unix[kolej][uni].il-(-unix[kolej][unic].il)>99){
		unix[kolej][uni].il = unix[kolej][uni].il-(-unix[kolej][unic].il)-99;
		unix[kolej][unic].il = 99;
		oddroguj(uni,kolej,false);
	} else {
		unix[kolej][unic].il -= -unix[kolej][uni].il;
		unix[kolej][uni].il = 0;
		odceluj(uni,kolej,changeTheState);
		var ata = 0;
		while(ata<4 && ata<heks[unix[kolej][uni].x][unix[kolej][uni].y].unp){
			if(heks[unix[kolej][uni].x][unix[kolej][uni].y].unt[ata] == uni){
				oddroguj(uni,kolej,false);
				heks[unix[kolej][uni].x][unix[kolej][uni].y].usun(ata);
				ata = 4;
			}
			ata++;
		}
		zaznu = unic;
        if(unix[kolej][unic].x != -1)
            zaznaj(zaznu,changeTheState);
		zaznu = unic;
		while(unichex.unt[unichex.unp-1] != zaznu){
			unichex.tasuj();
		}
	}
	unichex.zmiana++;
	if(unix[kolej][unic].il + unix[kolej][unic].rozb > 99){
		unix[kolej][unic].rozb = 99 - unix[kolej][unic].il
	}
	if(unix[kolej][uni].il + unix[kolej][uni].rozb > 99){
		unix[kolej][uni].rozb = 99 - unix[kolej][uni].il
	}
	unix[kolej][uni].celd = -1;
	unix[kolej][uni].celu = -1;
	unix[kolej][uni].celk = -1;
}
function zaladuj(uni,unic){
	if(heks[unix[kolej][unic].x][unix[kolej][unic].y].unp<4 || unix[kolej][unic].il<=unix[kolej][uni].il){
		var at = 0;
		var ah = 0;
		while(at<heks[unix[kolej][unic].x][unix[kolej][unic].y].unp){
			if(heks[unix[kolej][unic].x][unix[kolej][unic].y].unt[at]==unic){
				ah = at;
				at = 4;
			}
			at++;
		}
		var dou = false;
		if(unix[kolej][unic].il<unix[kolej][uni].il){
			divideUnit(uni,/*unix[kolej][uni].il-*/unix[kolej][unic].il);
			dou = true;
		}
		if(unix[kolej][unic].il==unix[kolej][uni].il){
			czyscc(uni,unix[kolej][uni].x,unix[kolej][uni].y,kolej);
			dou = true;
		}
		if(unix[kolej][unic].il>unix[kolej][uni].il){
			unix[kolej][unic].il-=unix[kolej][uni].il;
		}


		unix[kolej][uni].szyt = szyt[10];
		unix[kolej][uni].szy = szy[10];

		var par = false;
		var ai = 0;
		while(ai<unix[unix[kolej][uni].celd][unix[kolej][uni].celu].celen){
			if(unix[unix[kolej][uni].celd][unix[kolej][uni].celu].celeu[ai] == uni && unix[unix[kolej][uni].celd][unix[kolej][uni].celu].celed[ai] == kolej){
				par = true;
				unix[unix[kolej][uni].celd][unix[kolej][uni].celu].celen--;
			}
			if(par){
				unix[unix[kolej][uni].celd][unix[kolej][uni].celu].celeu[ai] = unix[unix[kolej][uni].celd][unix[kolej][uni].celu].celeu[ai+1];
				unix[unix[kolej][uni].celd][unix[kolej][uni].celu].celed[ai] = unix[unix[kolej][uni].celd][unix[kolej][uni].celu].celed[ai+1];
			}
			ai++;
		}

		unix[kolej][uni].przenies(unix[kolej][uni].celk);

		if(dou){
			heks[unix[kolej][unic].x][unix[kolej][unic].y].usun(ah);
		}
		
		unix[kolej][uni].celd = -1;
		unix[kolej][uni].celu = -1;
		unix[kolej][uni].celk = -1;
		
		czyscc(uni,unix[kolej][uni].x,unix[kolej][uni].y,kolej);

	} else {
		jesio = -1;
	}
}
function zezaladuj(uni,unic){
	//if(heks[unix[kolej][uni].x][unix[kolej][uni].y].unp<4 || unix[kolej][uni].il>=unix[kolej][unic].il){
			var at = 0;
			var ah = 0;
			var aw = 0;
			while(at<heks[unix[kolej][uni].x][unix[kolej][uni].y].unp){
				if(heks[unix[kolej][uni].x][unix[kolej][uni].y].unt[at]==unic){
					ah = at;
				}
				if(heks[unix[kolej][uni].x][unix[kolej][uni].y].unt[at]==uni){
					aw = at;
				}
				at++;
			}
		var dou = false;
		if(unix[kolej][uni].il>unix[kolej][unic].il){
			heks[unix[kolej][uni].x][unix[kolej][uni].y].usun(ah);
			czyscc(uni,unix[kolej][uni].x,unix[kolej][uni].y,kolej);
			if(ah < aw){
				aw--
			}
			divideUnit(uni,unix[kolej][uni].il-unix[kolej][unic].il);
		} else if(unix[kolej][uni].il==unix[kolej][unic].il){
			heks[unix[kolej][uni].x][unix[kolej][uni].y].usun(ah);
			czyscc(uni,unix[kolej][uni].x,unix[kolej][uni].y,kolej);
			dou = true;
		} else if(unix[kolej][uni].il<unix[kolej][unic].il){
			unix[kolej][unic].il-=unix[kolej][uni].il;
		}

		unix[kolej][zaznu].szyt = szyt[10];
		unix[kolej][zaznu].szy = szy[10];


		unix[kolej][unic].celd = -1;
		unix[kolej][unic].celu = -1;
		unix[kolej][unic].celk = -1;
		kpx = unix[kolej][unic].x;
		kpy = unix[kolej][unic].y;
		czyscc(uni,unix[kolej][unic].x,unix[kolej][unic].y,kolej);
		heks[unix[kolej][uni].x][unix[kolej][uni].y].zmiana++;
	/*} else {
		jesio = -1;
	}*/
}
function wyladuj(uni){
	if(heks[unix[kolej][uni].x][unix[kolej][uni].y].unp < 4){
		unix[kolej][uni].szy = szy[unix[kolej][uni].rodz];
		unix[kolej][uni].szyt = szyt[unix[kolej][uni].rodz];
		if(stan == 4){
			jesio = unix[kolej][uniwy].szy;
		}
		dodai(unix[kolej][uni].x,unix[kolej][uni].y,unix[kolej][uni].il,10,0);
		heks[unix[kolej][uni].x][unix[kolej][uni].y].tasuj();
	}
}
function createCity(zazn){
	if(zazn == undefined)
		zazn = zaznu
	var city = heks[unix[kolej][zazn].x][unix[kolej][zazn].y];
	if(city.z==0){
		while(unix[kolej][zazn].il>5){
			city.z++;
			unix[kolej][zazn].il-=5;
		}
	}
	redraw(true);
}
function dokolejki(unj){
	var a = 0;
	while(a<ruchwkolejcen){
		if(ruchwkolejce[a]==unj){
			var b = a;
			ruchwkolejcen--;
			while(b<ruchwkolejcen){
				ruchwkolejce[b]=ruchwkolejce[b+1];
				b++;
			}
		}
		a++
	}
	ruchwkolejce[ruchwkolejcen] = unj;
	ruchwkolejcen++;
}
