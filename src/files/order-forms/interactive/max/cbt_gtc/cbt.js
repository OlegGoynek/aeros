var e;
var svgdom;
var org_bg_color = "#CCC";
//var letters_mat = "INSIGWHITE";
var letters_id = "letters_c_big_lat";
var font_outline = true;
var no_letters = false;
var font_color = "#fff";
var font_opacity = "0.6";
var temp_option = ["","",""]; // [option id, material id, option index] - selected in form
var matlist;
var ColorMenuOpen = false;
//var BottomSurfaceLayout = "odl"; //or 'standard'

window.onkeydown = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    
    if (key == 27) {
        readme('close');
	}
};

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
                                    wo : x[i].getElementsByTagName("webopac")[0].textContent ,
                                    gr : x[i].getElementsByTagName("group")[0].textContent };
            }

            matlist = fmatlist;
        }
    };
    xmlhttp.open("GET", "../common/materials.xml", true);
    xmlhttp.send();	
}

function OnLoad()
{
	readme("open");
	NotesLimiter("notes"); //write max characters value
	SetDate('date'); 
	
  var svgobj = document.getElementById('svg'); // id='svg'
  svgdom = svgobj.contentDocument;

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
			document.getElementById("div_content").className = document.getElementById("div_content").className.replace( /(?:^|\s)blur_bg(?!\S)/g , '' )
		}
		
		
	}
}


function SetColor(item, matid)
{  'use strict';
  if (item === 'bg')
  {
    /*svgdom.getElementById(temp_option[0]).style.fill = temp_option[1];
    return;*/
	  item = temp_option[0];
      matid = temp_option[1];
	  /*color = matlist[matid]['wc'];
	  opac =  matlist[matid]['wo'];*/
  }
  if (item !== 'letters')
  { 
      if(item==='battens'){
         svgdom.getElementById('battens_bottom_tv').style.fill = matlist[matid]['wc'];
         svgdom.getElementById('battens_top_tv').style.fill = matlist[matid]['wc'];
         svgdom.getElementById('battens_bottom_bv').style.fill = matlist[matid]['wc'];
         svgdom.getElementById('battens_top_bv').style.fill = matlist[matid]['wc'];
          
         svgdom.getElementById('rf1_tv').style.fill = matlist[matid]['wc'];
         svgdom.getElementById('rf1_bv').style.fill = matlist[matid]['wc'];
         }
      
      else{
        var itemTV = item + '_tv'; //top view
        var itemBV = item + '_bv'; //bottom view

        svgdom.getElementById(itemTV).style.fill = matlist[matid]['wc'];
        svgdom.getElementById(itemBV).style.fill = matlist[matid]['wc']; 
			
        svgdom.getElementById(itemTV).style.fillOpacity = matlist[matid]['wo'];
        svgdom.getElementById(itemBV).style.fillOpacity = matlist[matid]['wo']; 
      }
		
      
      if (item==='leading_edge' || item==='top_surface'){
          FixBottomSurface(item, "MaterialChange");
          
          if(matlist[GetInnerValue("leading_edge")]['gr'] !== matlist[GetInnerValue("top_surface")]['gr']){
             if(item==='leading_edge'){
                 document.getElementById('top_surface').selectedIndex = document.getElementById('leading_edge').selectedIndex;
                 SetColor("top_surface", GetInnerValue("top_surface"));
             }
             else{
                 document.getElementById('leading_edge').selectedIndex = document.getElementById('top_surface').selectedIndex;
                 SetColor("leading_edge", GetInnerValue("leading_edge"));
             }
          }
      }
      
      return;
  }
  if (matid === 'no_letters')
  {
    no_letters = true;
	/*document.getElementById("lett_tbl").style.display = "none";*/
	vHide('wrap_lett_tbl', 'hide');
	document.getElementsByName('l_font').disabled = true;
    document.getElementsByName('l_size').disabled = true;
    document.getElementsByName('l_type').disabled = true;//outlined
  }
  else
  {
    font_color = matlist[matid]['wc'];
    font_opacity = matlist[matid]['wo'];
	no_letters = false;
	vHide('wrap_lett_tbl', 'show');
    document.getElementsByName('l_font').disabled = false;
    document.getElementsByName('l_size').disabled = false;
    document.getElementsByName('l_type').disabled = false;//outlined
	
    if (font_outline)
	{
	  svgdom.getElementById(letters_id).style.fill = "none";
	  if (document.getElementById('let_big').checked){
        svgdom.getElementById(letters_id).style.stroke = font_color;
        svgdom.getElementById(letters_id).style.opacity = font_opacity;}
	}
	else
	{
	  svgdom.getElementById(letters_id).style.fill = font_color;
	  if (document.getElementById('let_big').checked){
        svgdom.getElementById(letters_id).style.stroke = font_color;
        svgdom.getElementById(letters_id).style.opacity = font_opacity;}
	}
	svgdom.getElementById(letters_id).style.display = "inline";
	
  }
  ChangeLetters();
}


function BottomSurfaceLayoutChange() /*["Standard", "transparent"]*/
{'use strict';
    
	if (document.getElementById("bl_st").checked){ //standard
		vHide('standard_bs_wrapper', 'show');
        vHide('technora_bs_wrapper', 'hide');
        
		document.getElementById("bottom_surface_standard").disabled = false;
		document.getElementById("middle_line").disabled = false;
		document.getElementById("rear_line").disabled = false;
		
        document.getElementById("line_front").disabled = true;
//		document.getElementById("bottom_surface_odl").disabled = true;
		document.getElementById("line_rear_1").disabled = true;
		document.getElementById("line_rear_2").disabled = true;
        
        svgdom.getElementById("group_bottom_surface_odl_bv").style.display = "none";
        svgdom.getElementById("group_bottom_surface_odl_tv").style.display = "none";
        svgdom.getElementById("group_bottom_surface_standard_bv").style.display = "inline";
        svgdom.getElementById("group_bottom_surface_standard_tv").style.display = "inline";
		
		//BottomSurfaceLayout = "standard";
	}
	else{ //transparent
        vHide('standard_bs_wrapper', 'hide');
        vHide('technora_bs_wrapper', 'show');
        
		document.getElementById("bottom_surface_standard").disabled = true;
		document.getElementById("middle_line").disabled = true;
		document.getElementById("rear_line").disabled = true;
		
        document.getElementById("line_front").disabled = false;
//		document.getElementById("bottom_surface_odl").disabled = false;
		document.getElementById("line_rear_1").disabled = false;
		document.getElementById("line_rear_2").disabled = false;
		
        svgdom.getElementById("group_bottom_surface_odl_bv").style.display = "inline";
        svgdom.getElementById("group_bottom_surface_odl_tv").style.display = "inline";
        svgdom.getElementById("group_bottom_surface_standard_bv").style.display = "none";
        svgdom.getElementById("group_bottom_surface_standard_tv").style.display = "none";
        
		//BottomSurfaceLayout = "odl";
	}
    
    FixBottomSurface("", "LayoutChange");
}


/*
function fixTopSurface(item)
{	'use strict';
	var item_mat_ts = GetValue(item);
	var item_SelectedIndex = document.getElementById(item).selectedIndex;
	var item_color = document.getElementById(item).options[item_SelectedIndex].value;
	var mat_tsr = GetValue('top_surface_rear');
	var mat_tsf = GetValue('top_surface_front');
	
	if (item === 'top_surface_front')
	{
		if (mat_tsr === 'Technora - DP ODL06 UVP white' && item_mat_ts !== mat_tsr)
		{
		document.getElementById('top_surface_rear').selectedIndex = item_SelectedIndex;
		SetColor('top_surface_rear', item_color);
		}
	}
	else if (item === 'top_surface_rear')
	{
		if (item_mat_ts === 'Technora - DP ODL06 UVP white' && item_mat_ts !== mat_tsf)
		{
		document.getElementById('top_surface_front').selectedIndex = item_SelectedIndex;
		SetColor('top_surface_front', item_color);
		}
	}
	
	//reinforcement belt
	mat_tsr = GetValue('top_surface_rear');
	mat_tsf = GetValue('top_surface_front');
	if ( mat_tsf === 'Technora - DP ODL04 smoke' && mat_tsr === mat_tsf) {
		document.getElementById('ts_rf_belt').disabled = false;
		vHide('opt_rf_belt_notify', 'hide');
	}
	else {
		document.getElementById('ts_rf_belt').disabled = true;
		document.getElementById('ts_rf_belt').selectedIndex = 0;
		SetColor('ts_rf_belt', 'none');
		vHide('opt_rf_belt_notify', 'show');
	}
}
*/

function FixBottomSurface(item, CallFrom){
    
    if (CallFrom === "LayoutChange" && document.getElementById("bl_odl").checked){
        if(matlist[GetInnerValue("leading_edge")]['gr'] === "DPPE"){
            document.getElementById('leading_edge').selectedIndex = 0;
            SetColor("leading_edge", GetInnerValue("leading_edge"));
        }
        if (matlist[GetInnerValue("top_surface")]['gr'] === "DPPE"){
            document.getElementById('top_surface').selectedIndex = 0;
            SetColor("top_surface", GetInnerValue("top_surface"));
        }
        //return;
    }
    
    else if (CallFrom === "MaterialChange" && document.getElementById("bl_odl").checked && matlist[GetInnerValue(item)]['gr'] === "DPPE"){ 
        //if(matlist[GetInnerValue("leading_edge")]['gr'] === "DPPE" || matlist[GetInnerValue("top_surface")]['gr'] === "DPPE"){
            document.getElementById('bl_st').checked = true;
            BottomSurfaceLayoutChange();
      //  }
    }
}


function PanelMouseOver(id)
{ 'use strict';
  var panel = "opt_" + id;
  document.getElementById(panel).style.backgroundColor = "#35A2F2";
  /*document.getElementById(panel).style.backgroundColor = "yellow";*/
}

function PanelMouseOut(id)
{ 'use strict';
  var panel = "opt_" + id;
  document.getElementById(panel).style.backgroundColor = org_bg_color;
}

function PanelClick(id,e)
{	//'use strict';
	if( !e ) {e = window.event;}
	
	ColorMenuOpen = true;
	
	var menublock = document.getElementById("colormenu");
	
	menublock.style.display = "inline";
	document.getElementById("div_colormenu_bg").style.display = "inline";

	
	var sel = document.getElementById(id); // get reference to the 'select' object
	var opts = sel.getElementsByTagName('option'); // get list of the 'option' objects
	var sel_index = sel.selectedIndex; //selected option index
	var opt_color, opt_matid;
	var bg_color; 
	
	temp_option[0] = id;// [id,color, option index]
	temp_option[1] = opts[sel_index].value;
	temp_option[2] = sel_index;
	
	var option_name_ref = "opt_name_" + id;
	
	var menucontent = '<h2 id="menu_header" style="margin:0px; padding:5px; width:100%"> '+ document.getElementById(option_name_ref).innerHTML + '</h2>';
	
	var menuline_style;
	var menuline_id;
	var menuline_fontcolor;
	
	for (var i = 0; i < sel.length; i++) { 
        menuline_id = "";
        menuline_fontcolor = "";
        
        //color of option
        opt_matid = opts[i].value; //material id of the option
        opt_color = matlist[opt_matid]['wc']; //read webcolor from materials list
        
        bg_color=opt_color;
        
        if (i === sel_index) {menuline_id = 'id="menuline_selected" ';} //add id to mark selected option

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
	var container_width = document.getElementById("div_svg_container").clientWidth;
	var container_height = document.getElementById("div_svg_container").clientHeight;
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

function CloseColorMenu(choice,id,matid) 
{	'use strict';
	ColorMenuOpen = false;
	
	if (id!=='bg' && choice !==temp_option[2])
	{
	document.getElementById(id).selectedIndex = choice; //update selected option in form
	SetColor(id,matid);
	
	}
	
	document.getElementById("div_colormenu_bg").style.display = "none";
	document.getElementById("colormenu").style.display = "none";
	document.getElementById("colormenu").innerHTML = "";
	PanelMouseOut(temp_option[0]);
}

function GetValue(id) //description of option
{ 'use strict';
  var s = document.getElementById(id); // get reference to the 'select' object
  var i = s.selectedIndex; // get index of the selected 'option'
  var o = s.getElementsByTagName('option'); // get list of the 'option' objects
  return o[i].text;  // get text from selected 'option'
}

function GetInnerValue(id) //value of option
{ 'use strict';
  var s = document.getElementById(id); // get reference to the 'select' object
  var i = s.selectedIndex; // get index of the selected 'option'
  var o = s.getElementsByTagName('option'); // get list of the 'option' objects
  return o[i].value;  // get Value in select option
}

function ChangeLetters()
{	'use strict';
	var i, fnt, siz, outl;
	var temp_id = letters_id;
	svgdom.getElementById(temp_id).style.display = "none";
	
	for(i = 0; i < document.getElementsByName('l_font').length; i++){
    	if(document.getElementsByName('l_font')[i].checked){
        	fnt = document.getElementsByName('l_font')[i].value;}
	}
	for(i = 0; i < document.getElementsByName('l_size').length; i++){
    	if(document.getElementsByName('l_size')[i].checked){
        	siz = document.getElementsByName('l_size')[i].value;}
	}
	for(i = 0; i < document.getElementsByName('l_type').length; i++){
    	if(document.getElementsByName('l_type')[i].checked){
        	outl = document.getElementsByName('l_type')[i].value;}
	}
	
	temp_id ="letters_c_" + siz+"_"+fnt;
	
	letters_id = temp_id;
	
	if(outl && siz ==="small"){
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
	else if(!outl) {
		font_outline = false;
		svgdom.getElementById(temp_id).style.fill = font_color;
        svgdom.getElementById(temp_id).style.opacity = font_opacity;
	}
	else if (outl) {
		svgdom.getElementById(temp_id).style.fill = "none";
	}
	
	if (no_letters) {
		return;
	}
	
    svgdom.getElementById(temp_id).style.display = "inline";
  	if (document.getElementById('let_big').checked){
     svgdom.getElementById(temp_id).style.stroke = font_color;
    svgdom.getElementById(temp_id).style.opacity = font_opacity;}
	
	
}

var notes_last_value ="";
function NotesLimiter(id)
{
	var maxlines = 6;
	var maxlinelength = 85;
	
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

function OrderFor(id) { 
    //'use strict';
    
    //combat version
    var wingVer;
    if (document.getElementById("cbt_c").checked){
        wingVer = "C";
        
        //sizes
        document.getElementById("wing_size").remove(4); //13.2
        document.getElementById("wing_size").remove(3); //14.2
        
        //materials - no PE for CombatC
        while (document.getElementById("leading_edge").length >1){
          document.getElementById("leading_edge").remove(document.getElementById("leading_edge").length-1);  
        }
        SetColor("leading_edge", GetInnerValue("leading_edge"));
        
        while (document.getElementById("top_surface").length >1){
           document.getElementById("top_surface").remove(document.getElementById("top_surface").length-1); 
        }
        SetColor("top_surface", GetInnerValue("top_surface"));
        
    }
    else{ 
        wingVer = "GT";
        
        //sizes
        if (document.getElementById("wing_size").length < 4){ //options[3].value != "14.2"){
            var optn142 = document.createElement("option");
            optn142.text = "14.2";
            optn142.value = "14.2";
            document.getElementById("wing_size").appendChild(optn142);
        }
        
        if (document.getElementById("wing_size").length < 5 && document.getElementById("wingsail").checked){ //13.2 is only for sail orders
            var optn132 = document.createElement("option");
            optn132.text = "13.2";
            optn132.value = "13.2";
            document.getElementById("wing_size").appendChild(optn132);
        }
        else{document.getElementById("wing_size").remove(4);}
        
        //materials
        if (document.getElementById("leading_edge").length < 2){
                       
            var optnPEOLE = document.createElement("option"); optnPEOLE.text = "Optic 3 - DP PE05 Black"; optnPEOLE.value = "PE05BLACK";
            document.getElementById("leading_edge").appendChild(optnPEOLE);

            var optnPEOTS = document.createElement("option"); optnPEOTS.text = "Optic 3 - DP PE05 Black"; optnPEOTS.value = "PE05BLACK";
            document.getElementById("top_surface").appendChild(optnPEOTS);
        }
    }
    
    
    //wing or sail
	if (document.getElementById("wing").checked){
		vHide('hidden_old_wing_data', 'hide');
		vHide('options', 'show');
		vHide('spareparts', 'show');
        
		document.getElementById("header_text").innerHTML = "Combat " + wingVer;
		
		document.getElementById("options").disabled = false;
		document.getElementById("spareparts").disabled = false;
		
		document.getElementById("old_wing_sail").disabled = true;
		document.getElementById("old_wing_frame").disabled = true;
		
	}
	else{ //SAIL ONLY
		vHide('hidden_old_wing_data', 'show');
		vHide('options', 'hide'); 
		vHide('spareparts', 'hide'); 
        
		document.getElementById("header_text").innerHTML = "Combat " + wingVer + " SAIL ONLY";
		
		document.getElementById("options").disabled = true;
		document.getElementById("spareparts").disabled = true;
		
		document.getElementById("old_wing_sail").disabled = false;
		document.getElementById("old_wing_frame").disabled = false;
		
	}
    
    
}
 
function vHide(id, action)
{	'use strict';
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

function SetDate(id)
{
  var d, day, mon, year;
  var date;
  d = new Date();
  day = d.getDate();
  mon = d.getMonth() + 1;
  year = d.getFullYear();
  date = "";
  if (day < 10){date = "0";}
  date += day;
  date += ".";
  if (mon < 10){date += "0";}
  date += mon;
  date += ".";
  date += year;
  document.getElementById(id).value = date;
}