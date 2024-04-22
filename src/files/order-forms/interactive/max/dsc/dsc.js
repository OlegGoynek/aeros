var e;
var i;
var svgdom;
var org_bg_color = "#CCC";
var letters_a_mat = "INSIGBLACK";
var letters_mat = "INSIGBLACK";
var letters_id = "letters_c_ml";
var temp_option = ["","",""]; // [option id, material id, option index] - selected in form
var matlist;
var wing_version = 'c';//or a

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
	  /*if(matid !=='no_ml' && item !== 'bg'){
		  color = matlist[matid]['wc'];
		  opac =  matlist[matid]['wo'];
	  }*/
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
	  
	  
	  if (temp_option[0] === 'middle_line'){document.getElementById('middle_line').selectedIndex = temp_option[2];}
	  
	  item = temp_option[0];
	  matid = temp_option[1];
	  color = matlist[matid]['wc'];
	  opac =  matlist[matid]['wo'];
  }
  if (item !== 'letters' && item !== 'letters_a')
  {
	  if (item ==='ribs'){
		svgdom.getElementById(item).style.fill = matlist[matid]['wc'];
	  }
	  
	  else if (item==='top_surface' && document.getElementById('dsc_a').checked ){
		svgdom.getElementById('top_surface_tv_c').style.fill = matlist[matid]['wc'];
		svgdom.getElementById('top_surface_tv_c').style.fillOpacity = matlist[matid]['wo'];
	  }
	  
	  else if(item==='top_surface' || item==='trailing_edge'){
		if (wing_version ==='c'){
			var ts_color, te_color, ts_mat, te_mat, ts_op, te_op;

			if(item==='top_surface'){
				ts_mat=matid;
				te_mat=GetInnerValue('trailing_edge')
			}
			else{
				ts_mat=GetInnerValue('top_surface');
				te_mat=matid;
			}

			ts_color = matlist[ts_mat]['wc']; ts_op = matlist[ts_mat]['wo'];
			te_color = matlist[te_mat]['wc']; te_op = matlist[te_mat]['wo'];

			svgdom.getElementById('trailing_edge_bv').style.fill = te_color;
			svgdom.getElementById('trailing_edge_bv').style.fillOpacity = te_op;
//			svgdom.getElementById('trailing_edge_rf_tv').style.fill = te_color;
//			svgdom.getElementById('trailing_edge_rf_tv').style.fillOpacity = te_op;
//			svgdom.getElementById('trailing_edge_rf_bv').style.fill = te_color;
//			svgdom.getElementById('trailing_edge_rf_bv').style.fillOpacity = te_op;
//			svgdom.getElementById('top_surface_rf_tv').style.fill = ts_color;
//			svgdom.getElementById('top_surface_rf_tv').style.fillOpacity = ts_op;

			if (ts_mat === te_mat){
				svgdom.getElementById('top_surface_tv_s').style.display = 'none';
				svgdom.getElementById('trailing_edge_tv_s').style.display = 'none';
				svgdom.getElementById('top_surface_tv_c').style.display = 'inline';
				svgdom.getElementById('top_surface_tv_c').style.fill = ts_color;
				svgdom.getElementById('top_surface_tv_c').style.fillOpacity = ts_op;
				svgdom.getElementById('trailing_edge_tv_c').style.display = 'inline';
				svgdom.getElementById('trailing_edge_tv_c').style.fill = te_color;
				svgdom.getElementById('trailing_edge_tv_c').style.fillOpacity = te_op;
			}
			else{
				svgdom.getElementById('top_surface_tv_c').style.display = 'none';
				svgdom.getElementById('trailing_edge_tv_c').style.display = 'none';
				svgdom.getElementById('top_surface_tv_s').style.display = 'inline';
				svgdom.getElementById('top_surface_tv_s').style.fill = ts_color
				svgdom.getElementById('top_surface_tv_s').style.fillOpacity = ts_op;
				svgdom.getElementById('trailing_edge_tv_s').style.display = 'inline';
				svgdom.getElementById('trailing_edge_tv_s').style.fill = te_color;
				svgdom.getElementById('trailing_edge_tv_s').style.fillOpacity = te_op;
			}
		}
		else {// dsc A
		  if(item==='top_surface'){
				svgdom.getElementById('top_surface_tv_c').style.fill = matlist[matid]['wc'];
				svgdom.getElementById('top_surface_tv_c').style.fillOpacity = matlist[matid]['wo'];
//			  	svgdom.getElementById('top_surface_rf_tv').style.fill = matlist['DP170MT0000']['wc'];
//				svgdom.getElementById('top_surface_rf_tv').style.fillOpacity = matlist['DP170MT0000']['wo'];
			}
			else{
				svgdom.getElementById('trailing_edge_tv_c').style.fill = matlist[matid]['wc'];
				svgdom.getElementById('trailing_edge_tv_c').style.fillOpacity = matlist[matid]['wo'];
				svgdom.getElementById('trailing_edge_bv').style.fill = matlist[matid]['wc'];
				svgdom.getElementById('trailing_edge_bv').style.fillOpacity = matlist[matid]['wo'];
//				svgdom.getElementById('trailing_edge_rf_tv').style.fill = matlist[matid]['wc'];
//				svgdom.getElementById('trailing_edge_rf_tv').style.fillOpacity = matlist[matid]['wo'];
//				svgdom.getElementById('trailing_edge_rf_bv').style.fill = matlist[matid]['wc'];
//				svgdom.getElementById('trailing_edge_rf_bv').style.fillOpacity = matlist[matid]['wo'];
			}
		}
		 		  
	  }
	  
	  else{
		var itemTV = item + '_tv'; //top view
		var itemBV = item + '_bv'; //bottom view
		
		//middle line
		if (matid==='no_ml'){ 
			svgdom.getElementById(itemTV).style.display = 'none';
			svgdom.getElementById(itemBV).style.display = 'none';
			LettersUpdate();
			return;
		}
		else if (item==='middle_line'){
			svgdom.getElementById(itemTV).style.display = 'inline';
			svgdom.getElementById(itemBV).style.display = 'inline';
			LettersUpdate();
		}
		
		//for all
		if (matid !== 'no_ml'){
		  svgdom.getElementById(itemTV).style.fill = matlist[matid]['wc'];
		  svgdom.getElementById(itemBV).style.fill = matlist[matid]['wc']; 
			
			if(item=='leading_edge'){
				svgdom.getElementById(itemTV).style.fillOpacity = matlist[matid]['wo'];
				svgdom.getElementById(itemBV).style.fillOpacity = matlist[matid]['wo']; 
			}
		}
		//battens strokes
		if (item==='battens')
		{
			if (matid==='DP170MT0000')
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
		}
		//end battens strokes
		
		//same color of middle line and rear line or bottom surface
//		var bs_color, ml_color, rl_color;
		var bs_mat, ml_mat, rl_mat;
		if ( item ==='middle_line' && matid !== 'no_ml' ){
			bs_mat = GetInnerValue('bottom_surface'); rl_mat = GetInnerValue('rear_line');
			if (matid === bs_mat || matid === rl_mat){
				document.getElementById('middle_line').selectedIndex = 0;
				SetColor('middle_line','no_ml');
			}
		}
		else if ( (item ==='bottom_surface' || item ==='rear_line')){
			ml_mat = GetInnerValue('middle_line');
			if (matid === ml_mat){
				document.getElementById('middle_line').selectedIndex = 0;
				SetColor('middle_line','no_ml');
			}
		}
		 
	  }
	  
	  
      return;
  }
  if (matid === 'no_letters')
  {
	  if (item === 'letters_a'){
		svgdom.getElementById('letters_a').style.display = 'none';
		vHide('opt_outline_a', 'hide'); 
		document.getElementById('let_out_a').disabled = true;
	  }
	  else {
		svgdom.getElementById(letters_id).style.display = 'none';
		vHide('opt_outline', 'hide'); 
		letters_id = 'no_letters';
		document.getElementById('let_out').disabled = true;
		document.getElementById('on_rl').disabled = true;
		document.getElementById('on_bs').disabled = true;	  
	  }
  }
  else
  {
	  var new_color;
	  
	  if (item === 'letters_a')
	  {
		  vHide('opt_outline_a', 'show'); document.getElementById('let_out_a').disabled = false;
		  svgdom.getElementById('letters_a').style.display = 'inline';
		  var outl_a = document.getElementById('let_out_a').checked;
		  
		  if (matid ==='outline'){
			  new_color = matlist[letters_a_mat]['wc'];}
		  else{
			  new_color = matlist[matid]['wc'];
			  letters_a_mat = matid;
		  }

		  if (outl_a){ 
			  svgdom.getElementById('letters_a').style.fill = "none";
			  svgdom.getElementById('letters_a').style.stroke = new_color;
			  svgdom.getElementById('letters_a').setAttribute('stroke-width', '1');
		  }
		  else{
			svgdom.getElementById('letters_a').style.fill = new_color;
			svgdom.getElementById('letters_a').style.stroke = "none";
		  }
	  }
	  else {
		  if (letters_id ==='no_letters'){LettersUpdate(); return;}
		  vHide('opt_outline', 'show');
		  document.getElementById('let_out').disabled = false;
		  document.getElementById('on_rl').disabled = false;
		  document.getElementById('on_bs').disabled = false;
		  svgdom.getElementById(letters_id).style.display = 'inline';

		  var outl = document.getElementById('let_out').checked;
//		  var letters_print = "";

		  if (matid ==='outline'){
			  new_color = matlist[letters_mat]['wc'];}
		  else{
			  new_color = matlist[matid]['wc'];
			  letters_mat = matid;
		  }

		  if (outl){ //LETTERS_ID!!
//			  letters_print += 'Outlined, ';
			  svgdom.getElementById(letters_id).style.fill = "none";
			  svgdom.getElementById(letters_id).style.stroke = new_color;
			  svgdom.getElementById(letters_id).setAttribute('stroke-width', '1');
		  }
		  else{
			svgdom.getElementById(letters_id).style.fill = new_color;
			svgdom.getElementById(letters_id).style.stroke = "none";
		  }

//		  letters_print += GetValue('letters');

		  /*var LettersOnBottomSurface = document.getElementById('on_bs').checked;
		  if(LettersOnBottomSurface){letters_print +=', On Bottom Surface';}
		  else {letters_print +=', On Rear Line';}*/
	  }
	  
  }
}

function LettersUpdate()
{	'use strict';
 	
	var letters_mat = GetInnerValue('letters');
	
	if (letters_mat === 'no_letters'){return;}
	
 	var lcbs, lcrl, lcml, lbs, lrl, lml;
 
	var midLine = GetInnerValue('middle_line');
	var LettersOnBottomSurface = document.getElementById('on_bs').checked;
	
 	if (wing_version ==='c'){
		lbs = 'none'; lrl = 'none'; lml = 'none';
		if (LettersOnBottomSurface){
			if (letters_id === 'letters_c_bs'){return;}
			lcbs = 'inline'; lcrl = 'none'; lcml = 'none';
			letters_id = 'letters_c_bs';
		}
		else if (midLine ==='no_ml'){ //no middle line - shift letters a bit
			if (letters_id === 'letters_c_rl'){return;}
			lcbs = 'none'; lcrl = 'inline'; lcml = 'none';
			letters_id = 'letters_c_rl';
		}
		else{
			if (letters_id === 'letters_c_ml'){return;}
			lcbs = 'none'; lcrl = 'none'; lcml = 'inline';
			letters_id = 'letters_c_ml';
		}
	}
 	else{// if A
		lcbs = 'none'; lcrl = 'none'; lcml = 'none';
		if (LettersOnBottomSurface){
			if (letters_id === 'letters_bs'){return;}
			lbs = 'inline'; lrl = 'none'; lml = 'none';
			letters_id = 'letters_bs';
		}
		else if (midLine ==='no_ml'){
			if (letters_id === 'letters_rl'){return;}
			lbs = 'none'; lrl = 'inline'; lml = 'none';
			letters_id = 'letters_rl';
		}
		else{
			if (letters_id === 'letters_ml'){return;}
			lbs = 'none'; lrl = 'none'; lml = 'inline';
			letters_id = 'letters_ml';
		}
	}
		
	svgdom.getElementById('letters_c_bs').style.display = lcbs;
	svgdom.getElementById('letters_c_rl').style.display = lcrl;
	svgdom.getElementById('letters_c_ml').style.display = lcml;
	svgdom.getElementById('letters_bs').style.display = lbs;
	svgdom.getElementById('letters_rl').style.display = lrl;
	svgdom.getElementById('letters_ml').style.display = lml;

	SetColor('letters', letters_mat);
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
	
 	if (wing_version==='a' && id==='trailing_edge'){return;}
 
	var menublock = document.getElementById("colormenu");
	
	menublock.style.display = "inline";
	document.getElementById("div_colormenu_bg").style.display = "inline";
 
 	var sel; // get reference to the 'select' object
	if (wing_version==='a' && id==='top_surface'){sel = document.getElementById('top_surface_a');}
	else{sel = document.getElementById(id);}
	
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

			if (opt_matid ==='no_ml'){opt_color=matlist[GetInnerValue('rear_line')]['wc'];} else {
					opt_color = matlist[opt_matid]['wc']; //read webcolor from materials list	
			}

			bg_color=opt_color;

			if (i === sel_index) {menuline_id = 'id="menuline_selected" ';} //add id to mark selected option

			//if (opt_color ==='no_letters'){bg_color='#ffffff';} else {bg_color=opt_color;} 

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
		if (wing_version==='a' && id==='top_surface'){document.getElementById('top_surface_a').selectedIndex = choice;}
		else{document.getElementById(id).selectedIndex = choice;} //update selected option in form
		
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
		
		WingVersion();
	}
	else{ //SAIL ONLY
		vHide('hidden_old_wing_data', 'show');
		/*vHide('options_wrapper', 'hide');*/
		vHide('other_options', 'hide');
		//document.getElementById("header_text").innerHTML = "Discus C SAIL ONLY";
		
		//options
		document.getElementById('bat_alu').disabled = true;
		document.getElementById('bat_c').disabled = true;
		document.getElementById('wires25pvc').disabled = true;
		document.getElementById('wires20').disabled = true;
	}
}

function WingVersion()
{
	if (document.getElementById('dsc_a').checked){
		wing_version = 'a';
		
		document.getElementById('header_text').innerHTML = 'Discus';
		
		//top surface letters
		document.getElementById('let_out_a').disabled = false;
		document.getElementById('letters_a').disabled = false;
		
		svgdom.getElementById('top_surface_tv_s').style.display = 'none';
		svgdom.getElementById('trailing_edge_tv_s').style.display = 'none';
		svgdom.getElementById('top_surface_tv_c').style.display = 'inline';
		svgdom.getElementById('trailing_edge_tv_c').style.display = 'inline';
		
		//leading edge
		document.getElementById('leading_edge').selectedIndex = 0;
		document.getElementById('leading_edge').getElementsByTagName("option")[4].disabled = true;
		
		
		//trailing edge - select
		vHide('trailing_edge_value_hide', 'hide');
		vHide('trailing_edge_a_value_hide', 'show');
		document.getElementById('trailing_edge').disabled = true;
		
		//top surface - select
		vHide('top_surface_value_hide', 'hide');
		vHide('top_surface_a_value_hide', 'show');
		document.getElementById('top_surface').disabled = true;
		document.getElementById('top_surface_a').disabled = false;
		
		//middle line
		document.getElementById('middle_line').selectedIndex = 0;
		document.getElementById('middle_line').disabled = true;
		
		//battens and ribs
		document.getElementById('battens').selectedIndex = 0;
		document.getElementById('ribs').selectedIndex = 0;
		document.getElementById('battens').disabled = true;
		document.getElementById('ribs').disabled = true;
		
		//other options
		if (document.getElementById('wing').checked){
		document.getElementById('bat_alu').checked = true;
		document.getElementById('bat_alu').disabled = true;
		document.getElementById('bat_c').disabled = true;
		document.getElementById('wires25pvc').checked = true;
		document.getElementById('wires25pvc').disabled = true;
		document.getElementById('wires20').disabled = true;
		document.getElementById('uprights').innerHTML = 'Silver (Finsterwalder)';
		document.getElementById('speedbar').innerHTML = 'Alu round';
		}
		
		SetColor('leading_edge', GetInnerValue('leading_edge'));
		SetColor('trailing_edge', 'DP180HTPS');
		SetColor('top_surface', GetInnerValue('top_surface_a'));
		SetColor('battens', GetInnerValue('battens'));
		SetColor('ribs', GetInnerValue('ribs'));
		SetColor('middle_line', GetInnerValue('middle_line'));
		LettersUpdate();
	}
	else{
		wing_version = 'c';
		
		document.getElementById('header_text').innerHTML = 'Discus C';
		
		//top surface letters
		vHide('opt_outline_a', 'hide');
		document.getElementById('let_out_a').checked = false;
		document.getElementById('let_out_a').disabled = true;
		document.getElementById('letters_a').disabled = true;
		document.getElementById('letters_a').selectedIndex = 0;
		SetColor('letters_a','no_letters');
		
		//leading edge
		document.getElementById('leading_edge').getElementsByTagName("option")[4].disabled = false;
		
		//trailing edge - select
		vHide('trailing_edge_value_hide', 'show');
		vHide('trailing_edge_a_value_hide', 'hide');
		document.getElementById('trailing_edge').disabled = false;
		
		//top surface - select
		vHide('top_surface_value_hide', 'show');
		vHide('top_surface_a_value_hide', 'hide');
		document.getElementById('top_surface').disabled = false;
		document.getElementById('top_surface_a').disabled = true;
		
		//middle line
		document.getElementById('middle_line').disabled = false;
		
		//battens and ribs
		document.getElementById('battens').disabled = false;
		document.getElementById('ribs').disabled = false;
		
		//other options
		if (document.getElementById('wing').checked){
		document.getElementById('bat_alu').disabled = false;
		document.getElementById('bat_c').disabled = false;
		document.getElementById('wires25pvc').disabled = false;
		document.getElementById('wires20').disabled = false;
		document.getElementById('uprights').innerHTML = 'Silver (Litestream)';
		document.getElementById('speedbar').innerHTML = 'Alu profiled';
		}
		
		SetColor('trailing_edge', GetInnerValue('trailing_edge'));
		SetColor('top_surface', GetInnerValue('top_surface'));
		LettersUpdate();
	}
}

var notes_last_value ="";
function NotesLimiter(id)
{	'use strict'; 
	var maxlines = 5;/*9;*/
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
