var e;
var i;
var svgdom;
var org_bg_color = "#CCC";
var letters_mat = "INSIGBLACK";
var temp_option = ["","",""]; // [option id, material id, option index] - selected in form
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
{ 'use strict';
  var svgobj = document.getElementById('svg'); 
  svgdom = svgobj.contentDocument;
   
  NotesLimiter("notes"); //write max characters value
  
  readme("open");
 
  SetDate('date'); 
  
  loadxml(); //load materials from xml
}

window.onkeydown = function(e) { 'use strict';
    var key = e.keyCode ? e.keyCode : e.which;
    
    if (key === 27) {
        readme('close');
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
			document.getElementById("div_content").className = document.getElementById("div_content").className.replace( /(?:^|\s)blur_bg(?!\S)/g , '' )
		}
	}
}

function SetColor(item, matid)
{ 'use strict';
 var color, opac;
	 
  if (item === 'bg')
  {
	  /*if (temp_option[0]==='letters'){
		 svgdom.getElementById(temp_option[0]).style.fill = temp_option[1];
		return; 
	  }
	  else{
		var itemTV = temp_option[0] + '_tv'; //top view
		var itemBV = temp_option[0] + '_bv'; //bottom view
		svgdom.getElementById(itemTV).style.fill = temp_option[1];  
		svgdom.getElementById(itemBV).style.fill = temp_option[1];
		return;
	  }*/
	  
	  
	  item = temp_option[0];
	  matid = temp_option[1];
	  color = matlist[matid]['wc'];
	  opac =  matlist[matid]['wo'];
  }
  if (item !== 'letters')
  {
	  /*if (item==='top_surface' && document.getElementById('dsc_a').checked ){
		svgdom.getElementById('top_surface_tv_c').style.fill = matlist[matid]['wc'];
		svgdom.getElementById('top_surface_tv_c').style.fillOpacity = matlist[matid]['wo'];
	  }   else if*/
	  
	   if(item==='top_surface_front' || item==='top_surface_rear'){

		var tsf_color, tsr_color, tsf_mat, tsr_mat, tsf_op, tsr_op;

		if(item==='top_surface_front'){
			tsf_mat=matid;
			tsr_mat=GetInnerValue('top_surface_rear')
		}
		else{
			tsf_mat=GetInnerValue('top_surface_front');
			tsr_mat=matid;
		}

		tsf_color = matlist[tsf_mat]['wc']; tsf_op = matlist[tsf_mat]['wo'];
		tsr_color = matlist[tsr_mat]['wc']; tsr_op = matlist[tsr_mat]['wo'];

/*
		svgdom.getElementById('trailing_edge_bv').style.fill = te_color;
		svgdom.getElementById('trailing_edge_bv').style.fillOpacity = te_op;
*/


		if (tsf_mat === tsr_mat && tsf_mat.substring(0,3) == 'ODL'){ 
			svgdom.getElementById('top_surface_front_sandard_tv').style.display = 'none';
			svgdom.getElementById('top_surface_rear_sandard_tv').style.display = 'none';
			svgdom.getElementById('top_surface_front_sandard_bv').style.display = 'none';
			svgdom.getElementById('top_surface_rear_sandard_bv').style.display = 'none';
			
			svgdom.getElementById('top_surface_front_ncv_tv').style.display = 'none';
			svgdom.getElementById('top_surface_rear_ncv_tv').style.display = 'none';
			svgdom.getElementById('top_surface_front_ncv_bv').style.display = 'none';
			svgdom.getElementById('top_surface_rear_ncv_bv').style.display = 'none';
	
			svgdom.getElementById('top_surface_front_odl_tv').style.display = 'inline';
			svgdom.getElementById('top_surface_rear_odl_tv').style.display = 'inline';
			svgdom.getElementById('top_surface_front_odl_bv').style.display = 'inline';
			svgdom.getElementById('top_surface_rear_odl_bv').style.display = 'inline';
			
			
			svgdom.getElementById('top_surface_front_odl_tv').style.fill = tsf_color;
			svgdom.getElementById('top_surface_front_odl_tv').style.fillOpacity = tsf_op;
			svgdom.getElementById('top_surface_front_odl_bv').style.fill = tsf_color;
			svgdom.getElementById('top_surface_front_odl_bv').style.fillOpacity = tsf_op;

			svgdom.getElementById('top_surface_rear_odl_tv').style.fill = tsr_color;
			svgdom.getElementById('top_surface_rear_odl_tv').style.fillOpacity = tsr_op;
			svgdom.getElementById('top_surface_rear_odl_bv').style.fill = tsr_color;
			svgdom.getElementById('top_surface_rear_odl_bv').style.fillOpacity = tsr_op;
			
			/*svgdom.getElementById('top_surface_front_odl_tv').style.stroke = tsf_color;
			svgdom.getElementById('top_surface_front_odl_bv').style.stroke = tsf_color;
			svgdom.getElementById('top_surface_rear_odl_tv').style.stroke = tsr_color;
			svgdom.getElementById('top_surface_rear_odl_bv').style.stroke = tsr_color;*/
		}
		   
		else if (tsf_mat === tsr_mat && tsf_mat.substring(0,3) == 'NCV'){ 
			svgdom.getElementById('top_surface_front_sandard_tv').style.display = 'none';
			svgdom.getElementById('top_surface_rear_sandard_tv').style.display = 'none';
			svgdom.getElementById('top_surface_front_sandard_bv').style.display = 'none';
			svgdom.getElementById('top_surface_rear_sandard_bv').style.display = 'none';
			
			svgdom.getElementById('top_surface_front_ncv_tv').style.display = 'inline';
			svgdom.getElementById('top_surface_rear_ncv_tv').style.display = 'inline';
			svgdom.getElementById('top_surface_front_ncv_bv').style.display = 'inline';
			svgdom.getElementById('top_surface_rear_ncv_bv').style.display = 'inline';
			
			svgdom.getElementById('top_surface_front_odl_tv').style.display = 'none';
			svgdom.getElementById('top_surface_rear_odl_tv').style.display = 'none';
			svgdom.getElementById('top_surface_front_odl_bv').style.display = 'none';
			svgdom.getElementById('top_surface_rear_odl_bv').style.display = 'none';
			
			
			svgdom.getElementById('top_surface_front_ncv_tv').style.fill = tsf_color;
			svgdom.getElementById('top_surface_front_ncv_tv').style.fillOpacity = tsf_op;
			svgdom.getElementById('top_surface_front_ncv_bv').style.fill = tsf_color;
			svgdom.getElementById('top_surface_front_ncv_bv').style.fillOpacity = tsf_op;

			svgdom.getElementById('top_surface_rear_ncv_tv').style.fill = tsr_color;
			svgdom.getElementById('top_surface_rear_ncv_tv').style.fillOpacity = tsr_op;
			svgdom.getElementById('top_surface_rear_ncv_bv').style.fill = tsr_color;
			svgdom.getElementById('top_surface_rear_ncv_bv').style.fillOpacity = tsr_op;
			
			/*svgdom.getElementById('top_surface_front_ncv_tv').style.stroke = tsf_color;
			svgdom.getElementById('top_surface_front_ncv_bv').style.stroke = tsf_color;
			svgdom.getElementById('top_surface_rear_ncv_tv').style.stroke = tsr_color;
			svgdom.getElementById('top_surface_rear_ncv_bv').style.stroke = tsr_color;*/
		}   
		   
		else{ //PE and dacron
			svgdom.getElementById('top_surface_front_odl_tv').style.display = 'none';
			svgdom.getElementById('top_surface_rear_odl_tv').style.display = 'none';
			svgdom.getElementById('top_surface_front_odl_bv').style.display = 'none';
			svgdom.getElementById('top_surface_rear_odl_bv').style.display = 'none';
			
			svgdom.getElementById('top_surface_front_ncv_tv').style.display = 'none';
			svgdom.getElementById('top_surface_rear_ncv_tv').style.display = 'none';
			svgdom.getElementById('top_surface_front_ncv_bv').style.display = 'none';
			svgdom.getElementById('top_surface_rear_ncv_bv').style.display = 'none';
			
			svgdom.getElementById('top_surface_front_sandard_tv').style.display = 'inline';
			svgdom.getElementById('top_surface_rear_sandard_tv').style.display = 'inline';
			svgdom.getElementById('top_surface_front_sandard_bv').style.display = 'inline';
			svgdom.getElementById('top_surface_rear_sandard_bv').style.display = 'inline';
			
			
			svgdom.getElementById('top_surface_front_sandard_tv').style.fill = tsf_color;
			svgdom.getElementById('top_surface_front_sandard_tv').style.fillOpacity = tsf_op;
			svgdom.getElementById('top_surface_front_sandard_bv').style.fill = tsf_color;
			svgdom.getElementById('top_surface_front_sandard_bv').style.fillOpacity = tsf_op;

			svgdom.getElementById('top_surface_rear_sandard_tv').style.fill = tsr_color;
			svgdom.getElementById('top_surface_rear_sandard_tv').style.fillOpacity = tsr_op;
			svgdom.getElementById('top_surface_rear_sandard_bv').style.fill = tsr_color;
			svgdom.getElementById('top_surface_rear_sandard_bv').style.fillOpacity = tsr_op;
			
			/*svgdom.getElementById('top_surface_front_sandard_tv').style.stroke = tsf_color;
			svgdom.getElementById('top_surface_front_sandard_bv').style.stroke = tsf_color;
			svgdom.getElementById('top_surface_rear_sandard_tv').style.stroke = tsr_color;
			svgdom.getElementById('top_surface_rear_sandard_bv').style.stroke = tsr_color;*/
		}

	  } // end top surface
	  
	  
	  else if(item==='keel_pocket'){
		  svgdom.getElementById(item).style.fill = matlist[matid]['wc'];
	  }
	  
	  
	  else{
		var itemTV = item + '_tv'; //top view
		var itemBV = item + '_bv'; //bottom view

		  svgdom.getElementById(itemTV).style.fill = matlist[matid]['wc'];
		  svgdom.getElementById(itemBV).style.fill = matlist[matid]['wc']; 
  		  
		  if(item==='keel_pocket' || item==='battens' || item==='trailing_edge'){
			  svgdom.getElementById(itemTV).style.fillOpacity = 1;
			  svgdom.getElementById(itemBV).style.fillOpacity = 1; 
		  }
		  else if (item==='bottom_surface'){
			  svgdom.getElementById(itemTV).style.fillOpacity = 1;
			  svgdom.getElementById(itemBV).style.fillOpacity = matlist[matid]['wo']; 
		  }
		  else{
			  svgdom.getElementById(itemTV).style.fillOpacity = matlist[matid]['wo'];
			  svgdom.getElementById(itemBV).style.fillOpacity = matlist[matid]['wo']; 
		  }


	  }
	  
	  //battens strokes
		  var bat_mat = GetInnerValue('battens');
		  var tsf_mat = GetInnerValue('top_surface_front');
		if ((item==='battens' && matid === 'DP170MT0000') || (item==='battens' && matid == tsf_mat) || (item==='top_surface_front' && matid == bat_mat))
		{
			svgdom.getElementById('battens_tv').style.stroke = '#000000';
			svgdom.getElementById('battens_bv').style.stroke = '#000000';
			svgdom.getElementById('battens_tv').style.strokeWidth = '0.25';
			svgdom.getElementById('battens_bv').style.strokeWidth = '0.25';
		}
		else{
			svgdom.getElementById('battens_tv').style.stroke = 'none';
			svgdom.getElementById('battens_bv').style.stroke = 'none';
		}
		//end battens strokes
	  
	  
      return;
  }
 
  if (matid === 'no_letters'){
	  svgdom.getElementById('letters').style.display = 'none';
  }else{
	  var new_color;
	  svgdom.getElementById('letters').style.display = 'inline';
	  svgdom.getElementById('letters').style.fill = matlist[matid]['wc'];
  }
 
}


function PanelMouseOver(id)
{ 'use strict';
  var panel = "opt_" + id;
  document.getElementById(panel).style.backgroundColor = "#35A2F2";
}

function PanelMouseOut(id)
{ 'use strict';
  var panel = "opt_" + id;
  document.getElementById(panel).style.backgroundColor = org_bg_color;
}

function PanelClick(id,e)
{	'use strict';
	if( !e ) e = window.event;
	
 
	var menublock = document.getElementById("colormenu");
	
	menublock.style.display = "inline";
	document.getElementById("div_colormenu_bg").style.display = "inline";
 
 	/*var sel; // get reference to the 'select' object
	if (wing_version==='a' && id==='top_surface'){sel = document.getElementById('top_surface_a');}
	else{sel = document.getElementById(id);}*/
	var sel = document.getElementById(id);
	
 	var opts = sel.getElementsByTagName('option'); // get list of the 'option' objects
	var sel_index = sel.selectedIndex; //selected option index
	var opt_color, opt_matid;
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
		if (opts[i].disabled == false){
			menuline_id = "";
			menuline_fontcolor = "";

			//color of option
			opt_matid = opts[i].value; //material id of the option

			/*if (opt_matid ==='no_ml'){opt_color=matlist[GetInnerValue('rear_line')]['wc'];} else {
					opt_color = matlist[opt_matid]['wc']; //read webcolor from materials list	
			}*/
			
			if(opt_matid =='no_letters'){opt_color = 'no_letters'}
			else{opt_color = matlist[opt_matid]['wc'];} //read webcolor from materials list
			
			//bg_color=opt_color;

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
	if (id!=='bg' && choice !==temp_option[2]) //temp_option[2] - already selected option
	{
		
		document.getElementById(id).selectedIndex = choice; //update selected option in form
		
		SetColor(id, matid);

	}
	
	document.getElementById("div_colormenu_bg").style.display = "none";
	document.getElementById("colormenu").style.display = "none";
	document.getElementById("colormenu").innerHTML = "";
	//PanelMouseOut(temp_option[0]);
}

function GetValue(id) // like "White - DP HTP Square"
{ 'use strict';
  var s = document.getElementById(id); // get reference to the 'select' object
  var i = s.selectedIndex; // get index of the selected 'option'
  var o = s.getElementsByTagName('option'); // get list of the 'option' objects
  return o[i].text;  // get text from selected 'option'
}
function GetInnerValue(id) //like "DP170MT7352"
{ 'use strict';
  var s = document.getElementById(id); // get reference to the 'select' object
  var i = s.selectedIndex; // get index of the selected 'option'
  var o = s.getElementsByTagName('option'); // get list of the 'option' objects
  return o[i].value;  // get Value in select option
}

function OrderFor(id) /*["wing", "wingsail"]*/
{	'use strict'; 
	if (document.getElementById("wing").checked){
		vHide('hidden_old_wing_data', 'hide'); 
		/*vHide('options_wrapper', 'show');*/
		vHide('other_options', 'show');
		//document.getElementById("header_text").innerHTML = "Discus C";
		
		//options
		document.getElementById('bag4m').disabled = false;

	}
	else{ //SAIL ONLY
		vHide('hidden_old_wing_data', 'show');
		/*vHide('options_wrapper', 'hide');*/
		vHide('other_options', 'hide');
		//document.getElementById("header_text").innerHTML = "Discus C SAIL ONLY";
		
		//options
		document.getElementById('bag4m').disabled = true;
		document.getElementById('bag4m').checked = false;
		
	}
}



var notes_last_value ="";
function NotesLimiter(id)
{	'use strict'; 
	var maxlines = 8;/*9;*/
	var maxlinelength = 85;/*70;*/
	
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
{ 'use strict';
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
