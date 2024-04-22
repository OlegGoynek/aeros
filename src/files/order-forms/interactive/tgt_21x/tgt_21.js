var e;
var svgdom;
var org_bg_color = "#CCC";
var letters_mat = "INSIGRED"; //letters_color
var letters_id = "letters";
var temp_option = ["", "", ""]; // [option id, material id, option index] - selected in form
var matlist;

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
  var svgobj = document.getElementById('svg'); 
  svgdom = svgobj.contentDocument;
  
  NotesLimiter("notes"); //write max characters value
  
  readme("open"); // show readme window
  
  SetDate('date'); 
	
  loadxml(); //load materials from xml
}

window.onkeydown = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    
    if (key == 27) {
        if (document.getElementById("colormenu").style.display == 'inline'){
			CloseColorMenu('bg','bg','bg');
		} else {
			readme('close');
		}
	}
};

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
}

function GearAndUprights(id)
{
	
	if (id==='gear'){
			if (document.getElementById('the_form').elements.namedItem(id).checked){
				document.getElementById('uprights').checked = true; 
				document.getElementById('uprights').disabled = true;
			}
			else{
				document.getElementById('uprights').disabled = false; 
			}
		}
}

var notes_last_value ="";
function NotesLimiter(id)
{
	var maxlines = 8;
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

function BattenStrokes(item, matid){
	
	//if (item==='top_surface' || item==='battens')
	//{
		if (item==='battens')
		{
		  var bat_mat = matid;
		  var ts_mat = GetInnerValue('top_surface');
		}
		else{			
		var bat_mat = GetInnerValue('battens');
		var ts_mat = matid;
		}

		if (bat_mat === ts_mat || bat_mat ==='DP170MT0000'){ //white or same as top surface
			svgdom.getElementById('battens_tv').style.stroke = '#000000';
			svgdom.getElementById('battens_bv').style.stroke = '#000000';
		}
		else{
			svgdom.getElementById('battens_tv').style.stroke = matlist[bat_mat]['wc'];
			svgdom.getElementById('battens_bv').style.stroke = matlist[bat_mat]['wc'];
		}
	//}
		
}




function SetColor(item, matid)
{
		
  if (item === 'bg')
  {
	  var color = matlist[temp_option[1]]['wc'];
	  if (temp_option[0]==='letters' || temp_option[0]==='keel_pocket'){
		 svgdom.getElementById(temp_option[0]).style.fill = color;
		return; 
	  }
	  else{
		var opac =  matlist[temp_option[1]]['wo']; 
		var itemTV = temp_option[0] + '_tv'; //top view
		var itemBV = temp_option[0] + '_bv'; //bottom view
		svgdom.getElementById(itemTV).style.fill = color;  
		svgdom.getElementById(itemBV).style.fill = color;
		  if(temp_option[0] ==='top_surface'){
			  svgdom.getElementById(itemTV).style.fillOpacity = opac;  
		  }
		  else if(temp_option[0] ==='bottom_surface'){
			  svgdom.getElementById(itemBV).style.fillOpacity = opac;// - 0.2;
		  }
		  
	    if (temp_option[0]==='top_surface' || temp_option[0]==='battens'){ BattenStrokes(temp_option[0], temp_option[1]); }
		  
		return;
	  }
  }
	
	
  if (item !== 'letters')
  {
	  var color = matlist[matid]['wc']; //read webcolor from materials list
	  if (item ==='keel_pocket'){
		svgdom.getElementById(item).style.fill = color;
	  }
	  else{
		  var itemTV = item + '_tv'; //top view
		  var itemBV = item + '_bv'; //bottom view
		  svgdom.getElementById(itemTV).style.fill = color;
		  svgdom.getElementById(itemBV).style.fill = color; 
		  var opac =  matlist[matid]['wo'];
		  if(item ==='top_surface'){
			  svgdom.getElementById(itemTV).style.fillOpacity = opac;  
		  }
		  else if(item ==='bottom_surface'){
			  svgdom.getElementById(itemBV).style.fillOpacity = opac; // - 0.2;
		  }
		
		//battens strokes
		if (item==='top_surface' || item==='battens'){ BattenStrokes(item, matid); } 
				 
	  }
	  return;
  }
  if (matid === 'no_letters')
  {
    svgdom.getElementById(letters_id).style.display = 'none';
	vHide('opt_outline', 'hide'); document.getElementById('let_out').disabled = true;
  }
  else
  {
	  vHide('opt_outline', 'show'); document.getElementById('let_out').disabled = false;
	  svgdom.getElementById(letters_id).style.display = 'inline';
	  var outl = document.getElementById('let_out').checked;
	  var new_color;
	 	  
	  if (matid ==='outline'){
		  new_color = matlist[letters_mat]['wc'];}    //letters_color;}
	  else{
		  new_color = matlist[matid]['wc'];//color;  //read webcolor from materials list
		  letters_mat = matid;
	  }
	  
	  if (outl){
		  svgdom.getElementById(letters_id).style.fill = "none";
		  svgdom.getElementById(letters_id).style.stroke = new_color;
	  }
	  else{
		svgdom.getElementById(letters_id).style.fill = new_color;
		svgdom.getElementById(letters_id).style.stroke = "none";
	  }
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
  if (day < 10)
    {date = "0";}
  date += day;
  date += ".";
  if (mon < 10)
    {date += "0";}
  date += mon;
  date += ".";
  date += year;
  document.getElementById(id).value = date;
}

function PanelMouseOver(id)
{
  var panel = "opt_" + id;
  document.getElementById(panel).style.backgroundColor = "#35A2F2";
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
	var bg_color;
	
	temp_option[0] = id;// [id,matid, option index]
	temp_option[1] = opts[sel_index].value;
	temp_option[2] = sel_index;
	
	var option_name_ref = "opt_name_" + id;
	
	var menucontent = '<h2 id="menu_header" style="margin:0px; padding:5px; width:100%"> ' + document.getElementById(option_name_ref).innerHTML + '</h2>';
	
	var menuline_style;
	var menuline_id;
	var menuline_fontcolor;
	
	for (var i = 0; i < sel.length; i++) { 
		menuline_id = "";
		menuline_fontcolor = "";

		//color of option
		opt_color = matlist[opts[i].value]['wc']; //read webcolor from materials list	
		opt_matid = opts[i].value; //material id of the option

		if (i === sel_index) {menuline_id = 'id="menuline_selected" ';} //add id to mark selected option

		if (opt_color ==='no_letters'){bg_color='#ffffff';} else {bg_color=opt_color;} 

		if (opt_color === "#000000" || opt_color === "#006b09" || opt_color === "#0000cd") {
		menuline_fontcolor = " color: #a9a9a9;";} //fix font color

		menuline_style = 'style="background-color: ' + bg_color + ';' + menuline_fontcolor + '"';

		menucontent += '<div onMouseDown="CloseColorMenu(';
		menucontent += "'" + i + "','" + id + "','" + opt_matid + "')";
		menucontent += '"';
		menucontent += ' onMouseOver="SetColor(';
		menucontent += "'" + id + "','" + opt_matid + "')";
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

function CloseColorMenu(choice,id,matid)
{	
	if (id!='bg' && choice !=temp_option[2])
	{
	SetColor(id,matid);
	document.getElementById(id).selectedIndex = choice; //update selected option in form
	}
	
	document.getElementById("div_colormenu_bg").style.display = "none";
	document.getElementById("colormenu").style.display = "none";
	document.getElementById("colormenu").innerHTML = "";
	PanelMouseOut(temp_option[0]);
}

function GetValue(id) // like "White - DP HTP Square"
{
  var s = document.getElementById(id); // get reference to the 'select' object
  var i = s.selectedIndex; // get index of the selected 'option'
  var o = s.getElementsByTagName('option'); // get list of the 'option' objects
  return o[i].text;  // get text from selected 'option'
}
function GetInnerValue(id) 
{
  var s = document.getElementById(id); // get reference to the 'select' object
  var i = s.selectedIndex; // get index of the selected 'option'
  var o = s.getElementsByTagName('option'); // get list of the 'option' objects
  return o[i].value;  // get Value on select option
}



function OrderFor(id) { /*["wing", "wingsail"]*/
	if (document.getElementById("wing").checked){
		vHide('hidden_old_wing_data', 'hide'); 
		vHide('other_options', 'show');
		document.getElementById("header_text").innerHTML = "Target 21 - Tandem";
		document.getElementById("old_wing_sail").disabled = true;
		document.getElementById("old_wing_frame").disabled = true;
		document.getElementById("uprights").disabled = false;
		document.getElementById("gear").disabled = false;		
	}
	else{ //SAIL ONLY
		vHide('hidden_old_wing_data', 'show');
		vHide('other_options', 'hide');
		document.getElementById("header_text").innerHTML = "Target 21 SAIL ONLY";
		document.getElementById("old_wing_sail").disabled = false;
		document.getElementById("old_wing_frame").disabled = false;
		document.getElementById("uprights").disabled = true;
		document.getElementById("gear").disabled = true;	
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

