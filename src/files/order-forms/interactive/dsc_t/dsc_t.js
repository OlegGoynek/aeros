var svgdom;
var org_bg_color;
var font_latin = true;
var font_small = false;
var font_outline = false;
var font_color;
var no_letters = false;
var fill_color = "#000000";
var letters_svg = "letters";

function OnLoad(id)
{
  org_bg_color = document.getElementById("tbl_leading_edge").style.backgroundColor;
  var svgobj = document.getElementById(id); // id='svg'
  if ('contentDocument' in svgobj)
    svgdom = svgobj.contentDocument;
  SetColor('letters', fill_color);
  SetDate('date');
}

function SetColor(item, color)
{
  if (item != 'letters')
  {
    if (item == 'battens')
	{
		svgdom.getElementById('battens_top').style.fill = color;
		svgdom.getElementById('battens_bottom').setAttribute('fill',color) ;	
	}
	else if (item == 'leading_edge')
	{
		svgdom.getElementById('leading_edge').setAttribute('fill',color);
		svgdom.getElementById('LE').setAttribute('fill',color);
		svgdom.getElementById('nose').setAttribute('fill',color);
	}
	else if (item == 'middle_line')
	{
		if(color =='no_ml')
		{
		svgdom.getElementById('middle_line').setAttribute('opacity','0.0');
		svgdom.getElementById('ML').setAttribute('opacity','0.0');
		}
		else
		{
		svgdom.getElementById('middle_line').setAttribute('opacity','1.0');
		svgdom.getElementById('ML').setAttribute('opacity','1.0');
		svgdom.getElementById('middle_line').setAttribute('fill',color);
		svgdom.getElementById('ML').setAttribute('fill',color);
		}
		
		var letters_position = GetValue('letters_pos');
		if (letters_position !='On bottom surface')
		{ SwitchLettersPosition('rl'); }
		
	}
	else if (item == 'top_surface')
	{
		var tsc = GetValue(item);
		
		if (tsc == "Optic - Polyant PE")
		{svgdom.getElementById('xbs').setAttribute('fill','#414042');	}
		else 
		{svgdom.getElementById('xbs').setAttribute('fill','#ffffff');	}
		
		if (tsc != "Optic - Polyant PE" && tsc != "Clear - Polyant PE")
		{
		svgdom.getElementById('top_surface').setAttribute('fill',color);
		svgdom.getElementById('top_surface').setAttribute('fill-opacity','0.97');
		svgdom.getElementById('top_surface').setAttribute('fill-opacity','0.97');
		svgdom.getElementById('TE').setAttribute('fill','#ffffff');
		svgdom.getElementById('TE').setAttribute('fill-opacity','0.97');
		svgdom.getElementById('trailing_edge').setAttribute('fill','#ffffff');
		svgdom.getElementById('trailing_edge').setAttribute('fill-opacity','0.97');
		document.getElementById('te').innerHTML = "Polyant HTP 180 Square";
		}
		else
		{
		svgdom.getElementById('top_surface').setAttribute('fill',color);
		svgdom.getElementById('top_surface').setAttribute('fill-opacity','0.84');
		svgdom.getElementById('TE').setAttribute('fill',color);
		svgdom.getElementById('TE').setAttribute('fill-opacity','0.84');
		svgdom.getElementById('trailing_edge').setAttribute('fill',color);
		svgdom.getElementById('trailing_edge').setAttribute('fill-opacity','0.84');
		document.getElementById('te').innerHTML = '&nbsp;' + GetValue('top_surface');
		}
	}
	else if (item == 'bottom_surface')
	{
		svgdom.getElementById('bottom_surface').setAttribute('fill',color);
		svgdom.getElementById('BS').setAttribute('fill',color);
	}
	
	else if (item == 'rear_line')
	{
		svgdom.getElementById('rear_line').setAttribute('fill',color);
		svgdom.getElementById('RL').setAttribute('fill',color);
	}
	else
	{
		svgdom.getElementById(item).style.fill = color;
	}
	
	if (GetValue('middle_line') == GetValue('rear_line') || GetValue('middle_line') == GetValue('bottom_surface'))
	{
	document.getElementById('middle_line').selectedIndex = 0;
	SetColor('middle_line', 'no_ml');
	}
	
	return;
	
  }
  if (color == 'no_letters')
  {
    no_letters = true;
    svgdom.getElementById(letters_svg).style.opacity = 0;
  }
  else
  {
    font_color = color;
  /*  var path_id; */
    if (item == 'letters')
    {
      no_letters = false;
      if (font_outline)
      {
        svgdom.getElementById(letters_svg).style.fill = "none";
        svgdom.getElementById(letters_svg).style.stroke = font_color;
      }
      else
      {
        svgdom.getElementById(letters_svg).style.fill = font_color;
        svgdom.getElementById(letters_svg).style.stroke = font_color;
      }
      svgdom.getElementById(letters_svg).style.opacity = 1;
    }
  }
}

function OutlineFont(id)
{
  font_outline = document.getElementById(id).checked;
  if (no_letters)
    return;
  if (font_outline)
    svgdom.getElementById(letters_svg).style.fill = "none";
  else
    svgdom.getElementById(letters_svg).style.fill = font_color;
}

function SwitchLettersPosition(pos)
{
	var midLine = GetValue('middle_line');
	var no_letters = GetValue('letters');
	
	if (pos == 'bs')
	{
	letters_svg = "letters_bs";
	if (no_letters == 'No Letters') {return;}
	svgdom.getElementById(letters_svg).style.opacity = 1;
	svgdom.getElementById('letters').style.opacity = 0;
	svgdom.getElementById('letters_ml').style.opacity = 0;
	}
	else if (midLine == 'No middle line') 
	{
	letters_svg = "letters";
	if (no_letters == 'No Letters') {return;}
	svgdom.getElementById(letters_svg).style.opacity = 1;
	svgdom.getElementById('letters_bs').style.opacity = 0;
	svgdom.getElementById('letters_ml').style.opacity = 0;
	}
	else 
	{
	letters_svg = "letters_ml";
	if (no_letters == 'No Letters') {return;}
	svgdom.getElementById(letters_svg).style.opacity = 1;
	svgdom.getElementById('letters').style.opacity = 0;
	svgdom.getElementById('letters_bs').style.opacity = 0;
	}
	
	OutlineFont('let_out');
	SetColor('letters', font_color);
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
  var tbl = "td_" + id;
  document.getElementById(tbl).style.backgroundColor = "yellow";
}

function PanelMouseOut(id)
{
  var tbl = "td_" + id;
  document.getElementById(tbl).style.backgroundColor = org_bg_color;
}

function GetValue(id)
{
//  alert(id);
  var s = document.getElementById(id); // get reference to the 'select' object
//  alert(s);
  var i = s.selectedIndex; // get index of the selected 'option'
  var o = s.getElementsByTagName('option'); // get list of the 'option' objects
  return o[i].text;  // get text from selected 'option'
}

/*function CheckOrder()
{
  var result = true;
  return result;
}*/

/*function CreateRequest()
{
  if (CheckOrder() == false)
    return;
  var temp;
  var s;
  s = '<b>REQUEST FORM</b><br>';
  s += '---------------------------<br>';
  if (document.getElementById('order').checked)
    s += '<b>request_type</b>=ORDER';
  else
    s += '<b>request_type</b>=PRICING';
  s += '<br>';
  s += '<b>glider</b>=discus';
  s += '<br>';
  s += '<b>date</b>=' + document.getElementById('date').value;
  s += '<br>';
  s += '<b>dealer</b>=' + document.getElementById('dealer').value;
  s += '<br>';
  s += '<b>customer</b>=' + document.getElementById('customer').value;
  s += '<br>';
  s += '<b>notes</b>=' + document.getElementById('notes').value;
  s += '<br>';
  s += '<br>';

  s += '<b>MAIN PARTS & OPTIONS</b><br>';
  s += '---------------------------<br>';
  temp = GetValue('wing_size');
  s += '<b>wing_size</b>=';
  if (temp != "Wing Size")
    s += document.getElementById('wing_size').value;
  s += '<br>';
  temp = GetValue('wing_model');
  s += '<b>wing_model</b>=';
  if (temp != "Wing Model")
    s += GetValue('wing_model');
  s += '<br>';
  s += '<b>speedbar_type</b>=aluminium round';
  s += '<br>';
  s += '<b>uprights</b>=silver (Finsterwalder)';
  s += '<br>';
  s += '<b>front&rear_wires</b>=PVC, d=2.5 mm';
  s += '<br>';
  s += '<b>battens</b>=aluminium';
  s += '<br>';
  s += '<br>';
  
  s += '<b>SAIL DETAILS</b><br>';
  s += '---------------------------<br>';
  temp = GetValue('leading_edge');
  if (temp == "Leading Edge") temp = '';
  s += '<b>leading_edge</b>=' + temp;
  s += '<br>';
  temp = GetValue('top_surface');
  if (temp == 'Top Surface') temp = '';
  s += '<b>top_surface</b>=' + temp;
  s += '<br>';
  s += '<b>trailing_edge</b>=DP HTP 180 square (white only)';
  s += '<br>';
  temp = GetValue('bottom_surface');
  if (temp == 'Bottom Surface') temp = '';
  s += '<b>bottom_surface</b>=' + temp;
  s += '<br>';
  temp = GetValue('middle_line');
  if (temp == 'Middle Line') temp = '';
  s += '<b>middle_line</b>=' + temp;
  s += '<br>';
  temp = GetValue('letters');
  if (temp == 'No Letters' || temp == 'Letters')
    s += '<b>letters</b>=no letters';
  else
  {
    s += '<b>letters</b>=' + temp;
    s += '<br>';
    if (document.getElementById('let_out').checked)
      s += '<b>outline</b>=yes';
    else
      s += '<b>outline</b>=no';
  }
  s += '<br>';
  s += '<br>';

  s += '<b>SPARE PARTS</b><br>';
  s += '---------------------------<br>';
  temp = document.getElementById('upr_qty').value;
  if (temp != '')
  {
    s += '<b>uprights</b>=';
    s += document.getElementById('upr_qty').value + ' pcs.';
    s += '<br>';
  }
  temp = document.getElementById('tip_qty').value;
  if (temp != '')
  {
    s += '<b>tip_wand</b>=';
    s += document.getElementById('tip_qty').value + ' pcs.';
    s += '<br>';
  }
  if (document.getElementById('le_l').checked)
  {
    s += '<b>le_#3_tube</b>=left';
    s += '<br>';
  }
  if (document.getElementById('le_r').checked)
  {
    s += '<b>le_#3_tube</b>=right';
    s += '<br>';
  }
  var w=window.open();
  w.document.open();
  w.document.write(s);
  w.document.close();
} */
