****
** SCRIPT PARA GRAFICAR LA TEMPERATURA POTENCIAL EQUIVALENTE EN EL NIVEL DE 850mb 
** EN BASE A LOS REANALISIS DEL ECMWF ERA5
** VALE PARA UN TIEMPO
****
'reinit'
'run jaecol'
'set mpdset hires'
* PRIMERO SE CARGA EL NETCDF DEL REANALISIS, REEMPLAZAR POR LA CARPETA EN LA CUAL SE ENCUENTRA Y EL NOMBRE DEL ARCHIVO
* AQUI EL DIRECTORIO DONDE SE ENCUENTRA EL ARCHIVO
path_in = '...' 
* AQUI EL DIRECTORIO DONDE SALDRAN LA IMAGENES
path_out = '...'
* AQUI SE ABRE EL ARCHIVO (cambiar prueba.nc por el archivo) 
'sdfopen ' path_in 'prueba.nc'
* PARA LA FECHA CORRESPONDIENTE 
'q time'
line1=sublin(result,1)
itime1=subwrd(line1,3)
fecha=substr(itime1,1,12)
* SE SETEAN LAS LAT LON PARA EL GRAFICO
'set lat -60 -10'
'set lon 270 330'
*************************
* PARA SETEAR EL TAMAÑO DEL GRAFICO
* SI SE VE CORTADO SE CORRIGE O SE COLOCA UN * EN EL INICIO DE LA LINEA DE COMANDO
'set ylpos 0 0'
'set xlint 10'
'set ylint 10'
'set xlopts 1 4 0.2'
'set ylopts 1 4 0.2'
'set parea 0.1 10.5 0.5 7.5'
* SE DEFINEN LAS VARIABLES A USAR QUE ESTAN EN EL REANALISIS
* PARA CONOCER CUALES SON, SE ABRE POR APARTE EL ARCHIVO CON GRADS Y SE EJECUTA EL COMANDO q file
* ALLI SE DESPLEGAN TODAS LAS VARIABLES DIPONIBLES
'define t = t'
'define q = q'
'define rh = r' 
'lev = 850'
* CON LAS DEFINIDAS SE ARMA LA TITAE
'define et=(-2937.4/(t))-(4.9283*log10(t))+22.5518'
'define es=pow(10,et)*10'
'define e=es*0.01*rh'
'define aux=3.5 *log(t)-log(e)-4.805'
'define tl=2840./aux + 55.'
'undefine aux'
'define aux=3.376/tl - 0.00254'
'define aux1=q*1000*(1.+0.81*q)'
'define aux2=0.2854*(1.-0.28*q)'
'define aux3=(1000/lev)'
'define te=((t)*pow(aux3,aux2)*exp(aux*aux1))'
'undefine aux'
'undefine aux1'
'undefine aux2'
'undefine aux3'
*************************
* AHORA SE GRAFICA LA VARIABLE JUNTO CON EL VIENTO
*************************
* SE DEFINE AL VIENTO EN SUS COMPONENTES EN ms-1 (por defecto), SE MULTIPLICAN POR 1.94 PARA QUE SEAN EN knots O 3.6 PARA KMh
'define u = u*1.94'
'define v = v*1.94'
*************************
* PRIMERO EN CONTORNOS RELLENOS LA TITAE
'set gxout shaded'
'set grads off'
'set clevs 270 280 290 300 310 320 330 340 350 360'
'set ccols 41 42 43 44 33 34 35 23 24 26 29'
'd smth9(te)'
'run cbarn'
* LUEGO EL VIENTO EN FELCHAS O BARBAS (SE CAMBIA EN GXOUT vector POR FECLAS O barb PARA BARBAS)
'set ccolor 1'
'set gxout barb'
'd smth9(skip(u, 11));smth9(skip(v, 11))'
* EN CONTORNOS LAS ISOLINEAS DE TITAE DE 290 320 Y 340 
'set gxout contour'
'set clskip 1'
'set cthick 10'
* ISO 290
'set cmax 290'
'set cmin 290'
'set ccolor 49'
'd smth9(te)'
* ISO 320
'set cmax 320'
'set cmin 320'
'set ccolor 39'
'd smth9(te)'
* ISO 340
'set cmax 340'
'set cmin 340'
'set ccolor 69'
'd smth9(te)'
* EL TITULO DEL GRAFICO
'draw title ' fecha ' \ Temperatura potencial equivalente (K) y viento (kts) para 850mb' 
* FINALMENTE SE GUARDA EL GRAFICO EN ALGUNA CARPETA 
* COLOCAR BIEN LA DIRECCION DONDE SE QUIERA EL GRAFICO
'printim ' path_out 'titae_850_' fecha '.png png white'
'c'
