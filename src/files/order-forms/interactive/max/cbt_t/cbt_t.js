var e;
var svgdom;
var org_bg_color = "#CCC";
var letters_id = "small_lat_rw";
var font_outline = false;
var no_letters = false;
var font_color = "#000000";
var temp_option = ["","",""]; // [id,color, option index] - selected in form

function loadxml() 
{

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    /*if (xmlhttp.readyState == 4 && xmlhttp.status == 200) { */
	if (xmlhttp.readyState == 4) {
      
		var xmlDoc = xmlhttp.responseXML;
		var x,i, newid;
		var fmatlist = {};
		x = xmlDoc.getElementsByTagName("material");
		
		for (i = 0; i< x.length; i++) {
			newid = x[i].getElementsByTagName("id")[0].textContent;
			fmatlist[newid] = { nf : x[i].getElementsByTagName("namefull")[0].textContent ,
							    ns : x[i].getElementsByTagName("nameshort")[0].textContent ,
							    wc : x[i].getElementsByTagName("webcolor")[0].textContent ,
							    wo : x[i].getElementsByTagName("webopac")[0].textContent };
		}
		
		matlist = fmatlist;
    }
  };
  xmlhttp.open("GET", "../common/materials.xml", true);
  xmlhttp.send();	
}
	
function OnLoad()
{
  var svgobj = document.getElementById('svg'); // id='svg'
  svgdom = svgobj.contentDocument;
  
  SetDate('date'); 
  
  NotesLimiter("notes"); //write max characters value
  
  readme("open");
	
  loadxml(); //load materials from xml
}

function readme(action)
{
	if (action ==="open")
	{
		document.getElementsByTagName("body")[0].style.overflow = "hidden";
		document.getElementById("div_content").className += " blur_bg";
		document.getElementById("div_readme_bg").style.display = "block";
		
	}
	else if (action ==="close")
	{
		document.getElementsByTagName("body")[0].style.overflow = "visible";
		document.getElementById("div_readme_bg").style.display = "none";
		if ( document.getElementById("div_content").className.match(/(?:^|\s)blur_bg(?!\S)/) ){
			document.getElementById("div_content").className = document.getElementById("div_content").className.replace( /(?:^|\s)blur_bg(?!\S)/g , '' );
		}
		
		
	}
	
	
	
	
	/* also nice!
	document.getElementById("MyElement").classList.add('class');
	document.getElementById("MyElement").classList.remove('class');
	if ( document.getElementById("MyElement").classList.contains('class') )
	document.getElementById("MyElement").classList.toggle('class');
	*/
}

window.onkeydown = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    
    if (key == 27) {
        readme('close');
	}
};



	var notes_last_value ="";
function NotesLimiter(id)
{
	var maxlines = 8;/*9;*/
	var maxlinelength = 65;/*70;*/
	
	var maxcharacters = maxlines * maxlinelength;
	
	var notes_obj=document.getElementById(id);
	
	if (notes_obj.value ===""){
		document.getElementById("char_left").innerHTML = maxcharacters;
		return;
	}
	
	var lines_array = notes_obj.value.split(/\r\n|\r|\n/g);
	var lines_used = lines_array.length; //CR count
	
	var li;
	var extra_lines = 0;  //count too long lines
	for (li = 0; li < lines_used; li++){
		extra_lines += Math.floor(lines_array[li].length / maxlinelength);
		
	}
	
	var lines_left = maxlines - lines_used - extra_lines + 1;
	var char_left = lines_left * maxlinelength - lines_array[lines_used-1].length + maxlinelength * Math.floor(lines_array[lines_used-1].length / maxlinelength) ;
	
	
	if (char_left > -1){
		document.getElementById("char_left").innerHTML = char_left;
		notes_last_value = notes_obj.value;
		
	}
	else{
		notes_obj.value = notes_last_value;
	}
	
}








function SetColor(item, matid)
{
  if (item === 'bg')
  {
	/*var color = matlist[temp_option[1]]['wc'];
    svgdom.getElementById(temp_option[0]).style.fill = color; 
    return;*/
    item = temp_option[0];
    matid = temp_option[1];
  }
  if (item != 'letters')
  {
//	var color = matlist[matid]['wc'];
    svgdom.getElementById(item).style.fill = matlist[matid]['wc']; 
    svgdom.getElementById(item).style.fillOpacity = matlist[matid]['wo'];
      
    if (item==='top_surface'){
        svgdom.getElementById('top_surface_rf').style.fill = matlist[matid]['wc']; 
//        svgdom.getElementById('top_surface_rf').style.fillOpacity = matlist[matid]['wo'];
        svgdom.getElementById('top_surface_rf').style.fillOpacity = 0.6;
    }
      
    return;
  }
  if (matid == 'no_letters')
  {
    no_letters = true;
    svgdom.getElementById(letters_id).style.display = "none";
	/*document.getElementById("lett_tbl").style.display = "none";*/
	vHide('wrap_lett_tbl', 'hide');
  }
  else
  {
    font_color = matlist[matid]['wc'];
	no_letters = false;
	vHide('wrap_lett_tbl', 'show');
	if (font_outline)
	{
	  svgdom.getElementById(letters_id).style.fill = "none";
	  svgdom.getElementById(letters_id).style.stroke = font_color;
	}
	else
	{
	  svgdom.getElementById(letters_id).style.fill = font_color;
	  svgdom.getElementById(letters_id).style.stroke = font_color;
	}
	svgdom.getElementById(letters_id).style.display = "inline";
	
  }
  ChangeLetters();
}

function SetDate(id)
{
  var d, day, mon, year;
  var date;
  d = new Date();
  day = d.getDate();
  mon = d.getMonth() + 1;
  year = d.getFullYear();
  date = "";
  if (day < 10)
    date = "0";
  date += day;
  date += ".";
  if (mon < 10)
    date += "0";
  date += mon;
  date += ".";
  date += year;
  document.getElementById(id).value = date;
}

function PanelMouseOver(id)
{
  var panel = "opt_" + id;
  document.getElementById(panel).style.backgroundColor = "#35A2F2";
  /*document.getElementById(panel).style.backgroundColor = "yellow";*/
}

function PanelMouseOut(id)
{
  var panel = "opt_" + id;
  document.getElementById(panel).style.backgroundColor = org_bg_color;
}

function PanelClick(id,e)
{
	if( !e ) e = window.event;
	
	var menublock = document.getElementById("colormenu");
	
	menublock.style.display = "inline";
	document.getElementById("div_colormenu_bg").style.display = "inline";

	
	var sel = document.getElementById(id); // get reference to the 'select' object
	var opts = sel.getElementsByTagName('option'); // get list of the 'option' objects
	var sel_index = sel.selectedIndex; //selected option index
	var opt_color; 
	
	temp_option[0] = id;// [id,color, option index]
	temp_option[1] = opts[sel_index].value;
	temp_option[2] = sel_index;
	
	var option_name_ref = "opt_name_" + id;
	
	var menucontent = '<h2 id="menu_header" style="margin:0px; padding:5px; width:100%"> ' 
	+ document.getElementById(option_name_ref).innerHTML + '</h2>';
	
	var menuline_style;
	var menuline_id;
	var menuline_fontcolor;
	
	for (i = 0; i < sel.length; i++) { 
		menuline_id = "";
		menuline_fontcolor = "";

		//color of option
		opt_color = matlist[opts[i].value]['wc']; //read webcolor from materials list	
		opt_matid = opts[i].value; //material id of the option

		if (i === sel_index) {menuline_id = 'id="menuline_selected" ';} //add id to mark selected option
		
		bg_color=opt_color
		
		if (opt_color === "#000000" || opt_color === "#006b09" || opt_color === "#0000cd") {
		menuline_fontcolor = " color: #a9a9a9;";} //fix font color

		menuline_style = 'style="background-color: ' + bg_color + ';' + menuline_fontcolor + '"';

		menucontent += '<div onMouseDown="CloseColorMenu(';
		menucontent += "'"+i+"','"+id+"','"+opt_matid+"')";
		menucontent += '"';
		menucontent += ' onMouseOver="SetColor(';
		menucontent += "'"+id + "','" + opt_matid +"')";
		menucontent += '"';
		menucontent += menuline_id + ' class="menuline" ' + menuline_style +'>';
		menucontent += opts[i].text + "</div>";
	}
	menublock.innerHTML = menucontent;
	
	//menuposition
	var container_width = document.getElementById("div_cbttsvg_container").clientWidth;
	var container_height = document.getElementById("div_cbttsvg_container").clientHeight;
	var header_height = document.getElementById("menu_header").clientHeight;
	var menu_width = menublock.clientWidth;
	var menu_height = menublock.clientHeight;
	var menu_left = e.clientX;
	var menu_top = e.clientY;
	
	
	if (menu_top + menu_height - header_height > container_height){
		menu_top = container_height - menu_height - header_height -7;
	}
	else {
		menu_top = menu_top - header_height -7;
	}
	
	if (menu_left + menu_width +18 > container_width) {
		menu_left = menu_left - menu_width -14;
	}
	else {
		menu_left = menu_left + 7;	
	}
	
	menublock.style.top = menu_top + "px";
	menublock.style.left = menu_left + "px";

}

function CloseColorMenu(choice,id,color)
{	
	if (id!='bg' && choice !=temp_option[2])
	{
	SetColor(id,color);
	document.getElementById(id).selectedIndex = choice; //update selected option in form
	}
	
	document.getElementById("div_colormenu_bg").style.display = "none";
	document.getElementById("colormenu").style.display = "none";
	document.getElementById("colormenu").innerHTML = "";
	PanelMouseOut(temp_option[0]);
}

function GetValue(id)
{
  var s = document.getElementById(id); // get reference to the 'select' object
  var i = s.selectedIndex; // get index of the selected 'option'
  var o = s.getElementsByTagName('option'); // get list of the 'option' objects
  return o[i].text;  // get text from selected 'option'
}

function ChangeLetters()
{	

	var temp_id = letters_id;
	svgdom.getElementById(temp_id).style.display = "none";
	
	for(var i = 0; i < document.getElementsByName('l_wing').length; i++){
    	if(document.getElementsByName('l_wing')[i].checked){
        	var wng = document.getElementsByName('l_wing')[i].value;}
	}
	for(var i = 0; i < document.getElementsByName('l_font').length; i++){
    	if(document.getElementsByName('l_font')[i].checked){
        	var fnt = document.getElementsByName('l_font')[i].value;}
	}
	for(var i = 0; i < document.getElementsByName('l_size').length; i++){
    	if(document.getElementsByName('l_size')[i].checked){
        	var siz = document.getElementsByName('l_size')[i].value;}
	}
	for(var i = 0; i < document.getElementsByName('l_type').length; i++){
    	if(document.getElementsByName('l_type')[i].checked){
        	var outl = document.getElementsByName('l_type')[i].value;}
	}
	
	var temp_id = siz+"_"+fnt+"_"+wng;
	/*if (wng !=""){
		temp_id+="_"+wng;}*/
	
	letters_id = temp_id;
	
	
	if(outl ==="out" & siz ==="small"){
		if (font_outline){
			document.getElementById('let_sol').checked = true;
			font_outline = false;
		}
		else {
			document.getElementById('let_big').checked = true;
			font_outline = true;}
			ChangeLetters();
			return;
		}
	else if(outl ==="sol") {
		font_outline = false;
		svgdom.getElementById(temp_id).style.fill = font_color;
	}
	else if (outl ==="out") {
		svgdom.getElementById(temp_id).style.fill = "none";
	}
	
	if (no_letters) {
		return;
	}
	
 	svgdom.getElementById(temp_id).style.display = "inline";
	if(siz !=="small"){ 
		svgdom.getElementById(temp_id).style.stroke = font_color;
		svgdom.getElementById(temp_id).style.strokeWidth = 1;
	}else{
		svgdom.getElementById(temp_id).style.stroke = "none";
	}
	
	/*
	var temp_prnt_let = siz.charAt(0).toUpperCase() + siz.slice(1) +" ";
	if (fnt ==="cyr"){temp_prnt_let += "Cyrillic" + " ";}
	else {temp_prnt_let += "Latin" + " ";}
	
	if (outl){temp_prnt_let += "Outlined";}
	else {temp_prnt_let += "Solid";} 
	
	if (wng) {temp_prnt_let += ", On Right Wing Only";}
	temp_prnt_let += ", " + GetValue("letters");
	
	document.getElementById("prnt_letters").innerHTML = temp_prnt_let;*/
}

function OrderFor(id) { /*["wingant","wing", "wingsail"]*/
	if (document.getElementById("wingant").checked){
		/*document.getElementById("hidden_trike_options").style.display = "block";*/
		vHide('hidden_trike_options', 'show');
		vHide('hidden_old_wing_data', 'hide');
		//document.getElementById("header_text").innerHTML = "Combat T + ANT";
        document.getElementById("old_wing_sail").disabled=true;
        document.getElementById("old_wing_frame").disabled=true;
		
	}
	else if (document.getElementById("wing").checked){
		/*document.getElementById("hidden_trike_options").style.display = "none";*/
		vHide('hidden_trike_options', 'hide');
		vHide('hidden_old_wing_data', 'hide');
		//document.getElementById("header_text").innerHTML = "Combat T";
        document.getElementById("old_wing_sail").disabled=true;
        document.getElementById("old_wing_frame").disabled=true;
		
	}
	else{ //SAIL ONLY
		/*document.getElementById("hidden_trike_options").style.display = "none";*/
		vHide('hidden_trike_options', 'hide'); 
		vHide('hidden_old_wing_data', 'show');
		//document.getElementById("header_text").innerHTML = "Combat T SAIL ONLY";
        document.getElementById("old_wing_sail").disabled=false;
        document.getElementById("old_wing_frame").disabled=false;
		
	}
}




function EngineTacho(id, opt) //polini thor and tacho relation
{	
	var TToption = document.getElementById("tacho").getElementsByTagName("option")[1]; //TT  
	var CHToption = document.getElementById("tacho").getElementsByTagName("option")[2]; //CHT 
	
	/*var tacho_notification = document.getElementById("opt_engine_notify");*/ 
	
	/*var tacholist = document.getElementById("tacho").getElementsByTagName("option");
	for (var i = 0; i < tacholist.length; i++) {
		if (tacholist[i].value == "CHT") {CHToption = tacholist[i]; break;}
	}*/

	if (id === "engine")
	{
		if (opt ==="M25Y" || opt ==="CABB"){
			/*CHToption.disabled = true;
			if(CHToption.selected)
			{
				TToption.selected = true;
			}*/
			vHide('opt_engine_notify', 'hide');
		}
		else /*Thor_250 or Thor_250 with dual spark*/ {
			/*CHToption.disabled = false;*/
			if (CHToption.selected === false){vHide('opt_engine_notify', 'show');}
		}
        
        //PROPS
        if (opt ==="M25Y"){
            document.getElementById("prop").getElementsByTagName("option")[0].disabled = false;
            document.getElementById("prop").getElementsByTagName("option")[0].selected = true;
            document.getElementById("prop").getElementsByTagName("option")[1].disabled = true;
            document.getElementById("prop").getElementsByTagName("option")[2].disabled = true;
        }
        else if (opt ==="CABB"){ //BlackBull
            document.getElementById("prop").getElementsByTagName("option")[1].disabled = false;
            document.getElementById("prop").getElementsByTagName("option")[1].selected = true;
            document.getElementById("prop").getElementsByTagName("option")[0].disabled = true;
            document.getElementById("prop").getElementsByTagName("option")[2].disabled = true;
        }
        else{ //Polini Thor
            document.getElementById("prop").getElementsByTagName("option")[1].disabled = false;
            document.getElementById("prop").getElementsByTagName("option")[2].disabled = false;
            document.getElementById("prop").getElementsByTagName("option")[0].disabled = true;
            if (document.getElementById("prop").getElementsByTagName("option")[0].selected){
            document.getElementById("prop").getElementsByTagName("option")[1].selected = true;}
        }
        
	}
	
	if (id === "tacho")
	{
		if (CHToption.selected)
            {vHide('opt_engine_notify', 'hide');}
		
		else if (document.getElementById("engine").getElementsByTagName("option")[2].selected || document.getElementById("engine").getElementsByTagName("option")[3].selected){
			vHide('opt_engine_notify', 'show');	
		}
		
	}
    
}

function vHide(id, action)
{
	if ( document.getElementById(id).classList.contains('v_transition_hide') && action ==='show')
	{
		document.getElementById(id).classList.remove('v_transition_hide');
		document.getElementById(id).classList.add('v_transition_show');
	}
	else if (document.getElementById(id).classList.contains('v_transition_show') && action ==='hide')
	{
		document.getElementById(id).classList.remove('v_transition_show');
		document.getElementById(id).classList.add('v_transition_hide');
	}
}

