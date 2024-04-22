var e;
var i;
var svgdom;
var org_bg_color = "#CCC";
var letters_color = "#000000";
var letters_id = "letters_c_ml";
var temp_option = ["","",""]; // [id,color, option index] - selected in form

var prnt_opts = ["leading_edge", "top_surface", "trailing_edge", "bottom_surface", "middle_line", "rear_line", "battens", "ribs"];

//sail cloth
var cloth = { //sailCode: ['#color';'opacity'],
	PX10T: ['#ffffff', '1'],
	PE10Cl: ['#ffffff', '0.84'],
	PE10Op: ['#919191', '0.84'],
	ODL06S: ['#3F3F3F', '0.4'],
	ODL06W: ['#ffffff', '1'],
	DP0000: ['#ffffff', '1'],
	DP2100: ['#000000', '1'],
	DP2328: ['#c0c0c0', '1'],
	DP3125: ['#dc143c', '1'],
	DP3105: ['#ff0040', '1'],
	DP4197: ['#ff4500', '1'],
	DP5076: ['#ffff00', '1'],
	DP5280: ['#c8fe2e', '1'],
	DP6047: ['#006b09', '1'],
	DP6094: ['#7fff00', '1'],
	DP7352: ['#0000cd', '1'],
	ConLtBl: ['#add8e6', '1'],
	ConMdBl: ['#1e90ff', '1'],
	ConTurq: ['#31B772', '1']
};

	
function OnLoad()
{ 'use strict';
  var svgobj = document.getElementById('svg'); 
  svgdom = svgobj.contentDocument;
  
  SetDate('date'); 
  
  updatePrnt('date', 'text');
  for (i = 0; i < prnt_opts.length; i++) {
	 updatePrnt(prnt_opts[i], 'select'); 
  }
  
  NotesLimiter("notes"); //write max characters value
  
  readme("open");
  
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

function updatePrnt(element_id, t)
{	'use strict';
	var prnt_id = "prnt_" + element_id;
	if (t ==="text"){ //textarea and input fields
	    document.getElementById(prnt_id).innerHTML = document.getElementById("the_form").elements.namedItem(element_id).value;}
		
	else if (t==="cb"){ //checkbox
		document.getElementById(prnt_id).checked = document.getElementById("the_form").elements.namedItem(element_id).checked;
	}
	
	else if (t==='rb'){//radio
	    var printvalue;
		var radios = document.getElementsByName(element_id); //element_id is name of group
		for( i = 0; i < radios.length; i++ ) {
			if( radios[i].checked ) {	printvalue = radios[i].value; break;}
		}
		document.getElementById(prnt_id).innerHTML = printvalue;
	}
	
	else { //select
		var val = GetValue(element_id);
		document.getElementById(prnt_id).innerHTML = val;
	}
}

function SetColor(item, color, prnt_upd) //prnt_upd - true for update print, false for temp color change
{ 'use strict';
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
	  color = temp_option[1];
  }
  if (item !== 'letters')
  {
	  if (item ==='ribs'){
		svgdom.getElementById(item).style.fill = color;
	  }
	  
	  else if(item==='top_surface' || item==='trailing_edge'){
		  var ts_color, te_color;
		if(item==='top_surface'){
			ts_color = color;
			te_color = GetInnerValue('trailing_edge');
		}
		else{
			ts_color = GetInnerValue('top_surface');
			te_color = color;
		}
		
		var ts_op, te_op;
		
		if(ts_color ==='#ffffff' || ts_color ==='#919191'){ts_op = 0.84;}
		else if(ts_color ==='#000000'){ts_op = 0.4;}
		else { ts_op = 1;}
		
		if(te_color ==='#ffffff' || te_color ==='#919191'){te_op = 0.84;}
		else if(te_color ==='#000000'){te_op = 0.4;}
		else {te_op = 1;}
		
				
		svgdom.getElementById('trailing_edge_bv').setAttribute('fill',te_color);
		svgdom.getElementById('trailing_edge_bv').setAttribute('fill-opacity',te_op);
		svgdom.getElementById('trailing_edge_rf_tv').setAttribute('fill',te_color);
		svgdom.getElementById('trailing_edge_rf_tv').setAttribute('fill-opacity',te_op);
		svgdom.getElementById('trailing_edge_rf_bv').setAttribute('fill',te_color);
		svgdom.getElementById('trailing_edge_rf_bv').setAttribute('fill-opacity',te_op);
		svgdom.getElementById('top_surface_rf_tv').setAttribute('fill',ts_color);
		svgdom.getElementById('top_surface_rf_tv').setAttribute('fill-opacity',ts_op);
		
		if (ts_color === te_color){
			svgdom.getElementById('top_surface_tv_s').style.display = 'none';
			svgdom.getElementById('trailing_edge_tv_s').style.display = 'none';
			svgdom.getElementById('top_surface_tv_c').style.display = 'inline';
			svgdom.getElementById('top_surface_tv_c').setAttribute('fill',ts_color);
			svgdom.getElementById('top_surface_tv_c').setAttribute('fill-opacity',ts_op);
			svgdom.getElementById('trailing_edge_tv_c').style.display = 'inline';
			svgdom.getElementById('trailing_edge_tv_c').setAttribute('fill',te_color);
			svgdom.getElementById('trailing_edge_tv_c').setAttribute('fill-opacity',te_op);
		}
		else{
			svgdom.getElementById('top_surface_tv_c').style.display = 'none';
			svgdom.getElementById('trailing_edge_tv_c').style.display = 'none';
			svgdom.getElementById('top_surface_tv_s').style.display = 'inline';
			svgdom.getElementById('top_surface_tv_s').setAttribute('fill',ts_color);
			svgdom.getElementById('top_surface_tv_s').setAttribute('fill-opacity',ts_op);
			svgdom.getElementById('trailing_edge_tv_s').style.display = 'inline';
			svgdom.getElementById('trailing_edge_tv_s').setAttribute('fill',te_color);
			svgdom.getElementById('trailing_edge_tv_s').setAttribute('fill-opacity',te_op);

		}
	  }
	  
	  else{
		var itemTV = item + '_tv'; //top view
		var itemBV = item + '_bv'; //bottom view
		
		//middle line
		if (color==='no_ml'){ 
			svgdom.getElementById(itemTV).style.display = 'none';
			svgdom.getElementById(itemBV).style.display = 'none';
			LettersUpdate();
		}
		else if (item==='middle_line'){
			svgdom.getElementById(itemTV).style.display = 'inline';
			svgdom.getElementById(itemBV).style.display = 'inline';
			LettersUpdate();
		}
		
		//for all
		if (color !== 'no_ml'){
		  svgdom.getElementById(itemTV).style.fill = color;
		  svgdom.getElementById(itemBV).style.fill = color; 
		}
		//battens strokes
		if (item==='battens')
		{
			if (color==='#ffffff')
			{
				svgdom.getElementById('battens_tv').style.stroke = '#000000';
				svgdom.getElementById('battens_bv').style.stroke = '#000000';
				svgdom.getElementById('battens_tv').setAttribute('stroke-width', '0.1');
				svgdom.getElementById('battens_bv').setAttribute('stroke-width', '0.1');
			}
			else{
				svgdom.getElementById('battens_tv').style.stroke = 'none';
				svgdom.getElementById('battens_bv').style.stroke = 'none';
			}
		}
		//end battens strokes
		
		//same color of middle line and rear line or bottom surface
		var bs_color, ml_color, rl_color;
		if (prnt_upd && item ==='middle_line' && color !== 'no_ml' ){
			bs_color = GetInnerValue('bottom_surface'); rl_color = GetInnerValue('rear_line');
			if (color === bs_color || color === rl_color){
				document.getElementById('middle_line').selectedIndex = 0;
				SetColor('middle_line','no_ml', true);
			}
		}
		else if (prnt_upd && (item ==='bottom_surface' || item ==='rear_line')){
			ml_color = GetInnerValue('middle_line');
			if (color === ml_color){
				document.getElementById('middle_line').selectedIndex = 0;
				SetColor('middle_line','no_ml', true);
			}
		}
		 
	  }
	  
	  if (prnt_upd){updatePrnt(item, 'select');}
      return;
  }
  if (color === 'no_letters')
  {
    svgdom.getElementById(letters_id).style.display = 'none';
	vHide('opt_outline', 'hide'); document.getElementById('let_out').disabled = true;
	if (prnt_upd){document.getElementById("prnt_letters").innerHTML = "No letters";}
  }
  else
  {
	  vHide('opt_outline', 'show'); document.getElementById('let_out').disabled = false;
	  svgdom.getElementById(letters_id).style.display = 'inline';
	  
	  var outl = document.getElementById('let_out').checked;
	  var new_color;
	  var letters_print = "";
	  
	  if (color ==='outline'){
		  new_color = letters_color;}
	  else{
		  new_color = color;
		  letters_color = color;
	  }
	  
	  if (outl){ //LETTERS_ID!!
		  letters_print += 'Outlined, ';
		  svgdom.getElementById(letters_id).style.fill = "none";
		  svgdom.getElementById(letters_id).style.stroke = new_color;
		  svgdom.getElementById(letters_id).setAttribute('stroke-width', '1');
	  }
	  else{
		svgdom.getElementById(letters_id).style.fill = new_color;
		svgdom.getElementById(letters_id).style.stroke = "none";
	  }
	  
	  letters_print += GetValue('letters');
	  
	  var LettersOnBottomSurface = document.getElementById('on_bs').checked;
	  if(LettersOnBottomSurface){letters_print +=', On Bottom Surface';}
	  else {letters_print +=', On Rear Line';}
	  
	  if (prnt_upd){document.getElementById("prnt_letters").innerHTML = letters_print;}
  }
}

function LettersUpdate()
{	//'use strict';
	
	var letters_color = GetInnerValue('letters');
	if (letters_color === 'no_letters'){return;}
	
	var midLine = GetInnerValue('middle_line');
	var LettersOnBottomSurface = document.getElementById('on_bs').checked;
	
	if(LettersOnBottomSurface){
		if (letters_id === 'letters_c_bs'){return;}
		svgdom.getElementById('letters_c_bs').style.display = 'inline';
		svgdom.getElementById('letters_c_rl').style.display = 'none';
		svgdom.getElementById('letters_c_ml').style.display = 'none';
		letters_id = 'letters_c_bs';
	}
	else if (midLine ==='no_ml'){ //no middle line - shift letters a bit
		if (letters_id === 'letters_c_rl'){return;}
		svgdom.getElementById('letters_c_bs').style.display = 'none';
		svgdom.getElementById('letters_c_rl').style.display = 'inline';
		svgdom.getElementById('letters_c_ml').style.display = 'none';
		letters_id = 'letters_c_rl';
	}
	else{
		if (letters_id === 'letters_c_ml'){return;}
		svgdom.getElementById('letters_c_bs').style.display = 'none';
		svgdom.getElementById('letters_c_rl').style.display = 'none';
		svgdom.getElementById('letters_c_ml').style.display = 'inline';
		letters_id = 'letters_c_ml';
	}
	
	SetColor('letters', letters_color, true);
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

	
	var sel = document.getElementById(id); // get reference to the 'select' object
	var opts = sel.getElementsByTagName('option'); // get list of the 'option' objects
	var sel_index = sel.selectedIndex; //selected option index
	var opt_color; 
	var bg_color;
	
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
	opt_color = opts[i].value; //color of option
	
	if (i === sel_index) {menuline_id = 'id="menuline_selected" ';} //add id to mark selected option
	
	if (opt_color ==='no_letters'){bg_color='#ffffff';} else {bg_color=opt_color;}
	if (opt_color ==='no_ml'){bg_color=GetInnerValue('rear_line');} else {bg_color=opt_color;} 
	
	if (opt_color === "#000000" || opt_color === "#006b09" || opt_color === "#0000cd") {
	menuline_fontcolor = " color: #a9a9a9;";} //fix font color
	
	menuline_style = 'style="background-color: ' + bg_color + ';' + menuline_fontcolor + '"';
	
	menucontent += '<div onMouseDown="CloseColorMenu(';
	menucontent += "'"+i+"','"+id+"','"+opt_color+"')";
	menucontent += '"';
	menucontent += ' onMouseOver="SetColor(';
	menucontent += "'"+id + "','" + opt_color +"')";
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
{	'use strict';
	if (id!=='bg' && choice !==temp_option[2]) //temp_option[2] - already selected option
	{
	document.getElementById(id).selectedIndex = choice; //update selected option in form
	SetColor(id, color, true);
	updatePrnt(id, 'select'); //update print form
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
function GetInnerValue(id) //like "#ffffff"
{ 'use strict';
  var s = document.getElementById(id); // get reference to the 'select' object
  var i = s.selectedIndex; // get index of the selected 'option'
  var o = s.getElementsByTagName('option'); // get list of the 'option' objects
  return o[i].value;  // get Value on select option
}

function OrderFor(id) /*["wing", "wingsail"]*/
{	'use strict'; 
	if (document.getElementById("wing").checked){
		vHide('hidden_old_wing_data', 'hide'); 
		/*vHide('options_wrapper', 'show');*/
		vHide('other_options', 'show');
		//document.getElementById("header_text").innerHTML = "Discus C";
		document.getElementById("prnt_old_wing_data").style.display = "none";
		document.getElementById("prnt_options").style.display = 'table';/*visibility = "visible";*/
		document.getElementById("prnt_order").innerHTML = 'Complete Wing';
	}
	else{ //SAIL ONLY
		vHide('hidden_old_wing_data', 'show');
		/*vHide('options_wrapper', 'hide');*/
		vHide('other_options', 'hide');
		//document.getElementById("header_text").innerHTML = "Discus C SAIL ONLY";
		document.getElementById("prnt_old_wing_data").style.display = "table";
		document.getElementById("prnt_options").style.display = "none";/*visibility = "collapse";*/
		document.getElementById("prnt_order").innerHTML = 'Sail Only';
	}
}

function WingVersion(){ 'use strict';
	var printver = 'C';
	if(document.getElementById('shortpack').checked){printver += 'B';}
	if(document.getElementById('mosq').checked){printver += 'M';}
	document.getElementById('prnt_wing_version').innerHTML = printver;
}

var notes_last_value ="";
function NotesLimiter(id)
{	'use strict'; 
	var maxlines = 8;/*9;*/
	var maxlinelength = 65;/*70;*/
	
	var maxcharacters = maxlines * maxlinelength;
	
	var notes_obj=document.getElementById(id);
	
	if (notes_obj.value ===""){
		document.getElementById("char_left").innerHTML = maxcharacters;
		document.getElementById("prnt_notes").innerHTML = "---";
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
		updatePrnt(id, 'text');
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

