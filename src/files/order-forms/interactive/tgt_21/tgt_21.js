
var e;
var svgdom;
var org_bg_color = "#CCC";
var letters_color = "#dc143c";
var letters_id = "letters";
var temp_option = ["","",""]; // [id,color, option index] - selected in form

var prnt_opts = ["leading_edge", "top_surface", "bottom_surface", "stripe", "battens", "keel_pocket"];

	
function OnLoad()
{
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

window.onkeydown = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    
    if (key == 27) {
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
			document.getElementById("div_content").className = document.getElementById("div_content").className.replace( /(?:^|\s)blur_bg(?!\S)/g , '' );
		}
	}
}

function updatePrnt(element_id, t)
{
	var prnt_id = "prnt_" + element_id;
	if (t ==="text"){
	    document.getElementById(prnt_id).innerHTML = document.getElementById("the_form").elements.namedItem(element_id).value;}
	else if (t==="cb"){
		document.getElementById(prnt_id).checked = document.getElementById("the_form").elements.namedItem(element_id).checked;
	}
	else {
		var val = GetValue(element_id);
		document.getElementById(prnt_id).innerHTML = val;
	}
}

function GearAndUprights(id)
{
	updatePrnt(id, 'cb');
	if (id==='gear'){
			if (document.getElementById('the_form').elements.namedItem(id).checked){
				document.getElementById('uprights').checked = true; 
				document.getElementById('uprights').disabled = true; updatePrnt('uprights', 'cb');
			}
			else{
				document.getElementById('uprights').disabled = false; updatePrnt('uprights', 'cb');
			}
		}
}

var notes_last_value ="";
function NotesLimiter(id)
{
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


function SetColor(item, color)
{
  if (item === 'bg')
  {
	  if (temp_option[0]==='letters' || temp_option[0]==='keel_pocket'){
		 svgdom.getElementById(temp_option[0]).style.fill = temp_option[1];
		return; 
	  }
	  else{
		var itemTV = temp_option[0] + '_tv'; //top view
		var itemBV = temp_option[0] + '_bv'; //bottom view
		svgdom.getElementById(itemTV).style.fill = temp_option[1];  
		svgdom.getElementById(itemBV).style.fill = temp_option[1];
		return;
	  }
  }
  if (item !== 'letters')
  {
	  if (item ==='keel_pocket'){
		svgdom.getElementById(item).style.fill = color;
	  }
	  else{
		var itemTV = item + '_tv'; //top view
		var itemBV = item + '_bv'; //bottom view
		svgdom.getElementById(itemTV).style.fill = color;
		svgdom.getElementById(itemBV).style.fill = color; 
		
		//battens strokes
		if (item==='top_surface' || item==='battens')
		{
			if (item==='battens')
			{
			  var bat_color = color;
			  var ts_color = GetInnerValue('top_surface');
			}
			else{			
			var bat_color = GetInnerValue('battens');
			var ts_color = color;
			}
			
			if (bat_color === ts_color){
				svgdom.getElementById('battens_tv').style.stroke = '#000000';
				svgdom.getElementById('battens_bv').style.stroke = '#000000';
			}
			else{
				svgdom.getElementById('battens_tv').style.stroke = bat_color;
				svgdom.getElementById('battens_bv').style.stroke = bat_color;
			}
		}
		//end battens strokes
		 
	  }
	  updatePrnt(item, 'select');
      return;
  }
  if (color === 'no_letters')
  {
    svgdom.getElementById(letters_id).style.opacity = 0;
	vHide('opt_outline', 'hide'); document.getElementById('let_out').disabled = true;
	document.getElementById("prnt_letters").innerHTML = "No letters";
  }
  else
  {
	  vHide('opt_outline', 'show'); document.getElementById('let_out').disabled = false;
	  svgdom.getElementById(letters_id).style.opacity = 1;
	  var outl = document.getElementById('let_out').checked;
	  var new_color;
	  var letters_print = "";
	  
	  if (color ==='outline'){
		  new_color = letters_color;}
	  else{
		  new_color = color;
		  letters_color = color;
	  }
	  
	  if (outl){
		  letters_print += 'Outlined, ';
		  svgdom.getElementById(letters_id).style.fill = "none";
		  svgdom.getElementById(letters_id).style.stroke = new_color;
	  }
	  else{
		svgdom.getElementById(letters_id).style.fill = new_color;
		svgdom.getElementById(letters_id).style.stroke = "none";
	  }
	  
	  letters_print += GetValue('letters');
	  document.getElementById("prnt_letters").innerHTML = letters_print;
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
	
	temp_option[0] = id;// [id,color, option index]
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
	opt_color = opts[i].value; //color of option
	
	if (i === sel_index) {menuline_id = 'id="menuline_selected" ';} //add id to mark selected option
	
	if (opt_color ==='no_letters'){bg_color='#ffffff';} else {bg_color=opt_color;} 
	
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
{	
	if (id!='bg' && choice !=temp_option[2])
	{
	SetColor(id,color);
	document.getElementById(id).selectedIndex = choice; //update selected option in form
	updatePrnt(id, 'select'); //update print form
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
function GetInnerValue(id) //like "#ffffff"
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
		document.getElementById("prnt_old_wing_data").style.display = "none";
		document.getElementById("prnt_options").style.visibility = "visible";
	}
	else{ //SAIL ONLY
		vHide('hidden_old_wing_data', 'show');
		vHide('other_options', 'hide');
		document.getElementById("header_text").innerHTML = "Target 21 SAIL ONLY";
		document.getElementById("prnt_old_wing_data").style.display = "table";
		document.getElementById("prnt_options").style.visibility = "collapse";
		
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

