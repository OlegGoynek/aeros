// Created by Viktor Moroz. Last edited: 2013.04.12

var svg;
var org_bg_color;
var font_latin = true;
var font_small = false;
var font_outline = false;
var no_letters = false;
var fill_color = "#dc143c";

function OnLoad(id)
{
  org_bg_color = document.getElementById("tbl_leading_edge").style.backgroundColor;
  var svgobj = document.getElementById(id); // id='svg'
  if ('contentDocument' in svgobj)
    svg = svgobj.contentDocument;
  SetColor('letters', fill_color);
  SetDate('date');
}

function SetColor(item, color)
{
  if (item != 'letters')
  {
    svg.getElementById(item).style.fill = color;
    return;
  }
  if (color == 'no_letters')
  {
    no_letters = true;
    svg.getElementById('letters').style.opacity = 0;
    svg.getElementById('legend_letters').style.opacity = 0;
    svg.getElementById('legend_line').style.opacity = 0;
  }
  else
  {
    font_color = color;
    var path_id;
    if (item == 'letters')
    {
      no_letters = false;
      if (font_outline)
      {
        svg.getElementById('letters').style.fill = "none";
        svg.getElementById('letters').style.stroke = font_color;
      }
      else
      {
        svg.getElementById('letters').style.fill = font_color;
        svg.getElementById('letters').style.stroke = font_color;
      }
      svg.getElementById('letters').style.opacity = 1;
      svg.getElementById('legend_letters').style.opacity = 1;
      svg.getElementById('legend_line').style.opacity = 1;
    }
  }
}

function OutlineFont(id)
{
  font_outline = document.getElementById(id).checked;
  if (no_letters)
    return;
  if (font_outline)
    svg.getElementById('letters').style.fill = "none";
  else
    svg.getElementById('letters').style.fill = font_color;
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

function CheckOrder()
{
  var result = true;
  return result;
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

function CreateRequest()
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
  s += '<b>glider</b>=discus_c';
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
  s += '<b>wing_model</b>=';
  temp = GetValue('wing_model');
  if (temp != "Wing Model") s += temp;
  s += '<br>';
  s += '<b>speedbar_type</b>=aluminium profile';
  s += '<br>';
  s += '<b>uprights</b>=silver (Litestream)';
  s += '<br>';
  s += '<b>front&rear_wires</b>=';
  temp = GetValue('frw');
  if (temp != "Front/rear wires") s += temp;
  s += '<br>';
  s += '<b>battens</b>=';
  temp = GetValue('battens');
  if (temp != "Battens") s += temp;
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
  temp = GetValue('trailing_edge');
  if (temp == "Trailing Edge") temp = '';
  s += '<b>trailing_edge</b>=' + temp;
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
}
