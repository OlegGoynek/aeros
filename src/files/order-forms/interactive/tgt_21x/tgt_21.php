<?php


// Include the main TCPDF library (search for installation path).
//require_once('tcpdf_include.php');

require_once('../common/tcpdf/tcpdf.php');

//always load alternative config file 
//require_once('../../tcpdf/config/a_config_alt.php');
require_once('../common/a_config_alt.php');

//------------------------------------
//LOAD MATERIALS FROM XML

$xml=simplexml_load_file("../common/materials.xml") or die("Error: Cannot create object");

$materials = array();
foreach ($xml->children() as $material) { 
    $newid = (string)$material->id;
	$nf = (string)$material->namefull;
	$ns = (string)$material->nameshort;
	$wc = (string)$material->webcolor;
	$wo = (string)$material->webopac;

	$materials["$newid"] = array(
		'namefull' => $nf,
		'nameshort' => $ns,
		'webcolor' => $wc,
		'webopac' => $wo
	);
} 
//------------------------------------



//------------------------------------
//SUBMITTED

$sbmopt = filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);

//------------------------------------



//------------------------------------
//Functions

function getColor($option){  //lookup color for option in materials array
	global $materials, $sbmopt;
	$matid = $sbmopt["$option"];
	$color = $materials["$matid"]['webcolor'];
	return $color;
}

function getOpac($option){  //lookup color for option in materials array
	global $materials, $sbmopt;
	$matid = $sbmopt["$option"];
	$opac= $materials["$matid"]['webopac'];
	return $opac;
}

function getFullName($option){  //lookup material name for option in materials array
	global $materials, $sbmopt;
	$matid = $sbmopt["$option"];
	$nameFull = $materials["$matid"]['namefull'];
	return $nameFull;
}

function getShortName($option){  //lookup material name for option in materials array
	global $materials, $sbmopt;
	$matid = $sbmopt["$option"];
	$nameFull = $materials["$matid"]['nameshort'];
	return $nameFull;
}

//extra

//battens stroke - black, if battens are white or if are the same as top surface
$battens_mat = $sbmopt["battens"];
if ($battens_mat === 'DP170MT0000' or $battens_mat === $sbmopt["top_surface"]){
    $battens_stroke = "#000000";
} else{
    $battens_stroke = getColor('battens'); //"none";
}


//------------------------------------


//('llx' => 18, 'lly' => 8, 'urx' => 202, 'ury' => 289),
$page_format = array(
    'MediaBox' => array ('llx' => 0, 'lly' => 0, 'urx' => 210, 'ury' => 297),
    'CropBox' => array ('llx' => 0, 'lly' => 0, 'urx' => 210, 'ury' => 297),
    'BleedBox' => array ('llx' => 0, 'lly' => 0, 'urx' => 210, 'ury' => 297),
    'TrimBox' => array ('llx' => 0, 'lly' => 0, 'urx' => 210, 'ury' => 297),
    'ArtBox' => array ('llx' => 20, 'lly' => 10, 'urx' => 200, 'ury' => 287),
    'Dur' => 3,
    'trans' => array(
        'D' => 1.5,
        'S' => 'Split',
        'Dm' => 'V',
        'M' => 'O'
    ),
    'Rotate' => 0,
    'PZ' => 0,//1
);

//Line break height
$ln_mm = 3;


// create new PDF document -- Orientation, Units, Page Format, Unicode, Encoding, Diskcache--
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
//$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, $page_format, true, 'UTF-8', false);


// remove default header/footer
$pdf->setPrintHeader(false);
$pdf->setPrintFooter(false);

// add a page
$pdf->AddPage();

// set margins
//$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
$pdf->SetMargins(docMarginLeft, docMarginTop, docMarginRight);

// set auto page breaks
$pdf->SetAutoPageBreak(true, docMarginBottom);

// set image scale factor
//$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

//writable width
$wrWidth = 210 - docMarginLeft - docMarginRight;

// set document information
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetTitle('Target 21 order form');
$pdf->SetSubject('Target 21');
$pdf->SetKeywords('Aeros, Order form, Target 21, Tandem');

if ((array_key_exists("dealer",$sbmopt) and $sbmopt["dealer"] != "")){
	$pdf->SetAuthor($sbmopt["dealer"]);
}elseif((array_key_exists("customer",$sbmopt) and $sbmopt["customer"] != "")){
	$pdf->SetAuthor($sbmopt["customer"]);
}else{
	$pdf->SetAuthor('www.aeros.com.ua');
}



//------------------------------------
//HEADER

//A logo
$a_logo_svg = '<svg id="a_logo" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="80px"
         height="80px" viewBox="0 0 80 80" enable-background="new 0 0 80 80" xml:space="preserve">
    <g >
    <path fill="#000000" d="M35.25,34.98c-2.02,1.38-4.05,2.95-6.53,4.97l6.53-9.94l3.13-4.6l3.5,5.8
    C39.49,32.5,37.37,33.6,35.25,34.98z M0,70.97h9.94c7.73-11.78,16.02-21.17,25.31-29c2.95-2.49,5.89-4.79,9.02-6.9l3.86,6.17
    c-4.41,3.13-8.83,7-12.88,11.23c-5.06,5.43-9.62,11.6-13.3,18.5h8.88c1.47-3.22,2.95-5.89,4.42-8.38c4.23-6.72,8.84-11.51,15-17.4
    l4.05,6.35c-5.34,5.25-9.67,11.32-12.7,19.33h7.37c1.66-5.89,4.69-11.59,7.91-15.56L66,70.88h10.03l-13.44-22
    c4.69-4.05,10.95-7.36,17.3-9.94c-8.38,1.84-13.62,3.96-19.05,7.37l-3.96-6.17c4.69-3.5,11.78-7.64,17.03-10.21
    c-7.09,1.84-13.25,4.14-18.77,6.99l-4.05-6.44c5.16-2.95,10.86-6.45,17.31-9.21c-7.46,1.57-12.8,3.5-18.96,6.26L38.2,8.93L0,70.97"/>
    </g>
    </svg>
';
$pdf->ImageSVG('@' . $a_logo_svg, $x=docMarginLeft, $y=docMarginTop, $w=a_logo_w, $h=a_logo_h, $link='http://www.aeros.com.ua', $align='', $palign='', $border=0, $fitonpage=false);

//$pdf->SetFont('FontFamilyName', 'style - B I U', 'FontSize', 'fontFile', 'false'- embed / 'true' - subset );
$pdf->SetFont(docHeaderFontFamily, 'BI', docHeaderFontSize, '', true);

$pdf->setXY(docMarginLeft,  docMarginTop +5, true);
//($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='', $stretch=0, $ignore_min_height=false, $calign='T', $valign='M')	
$pdf->Cell(210-docMarginLeft-docMarginRight, a_logo_h , 'Target 21', 0, true, 'C', 0, '', 0, false, 'M', 'M');

/*
//version
$pdf->SetFont(docTextFont, '', 6);
$pdf->setXY(docMarginRight - 30,  docMarginTop +5 );
$pdf->Cell(30, 5 , 'v 1.001.01', 0, false, 'R', 0, '', 0, false, 'M', 'B');
*/

//Line
$linestyle = array('width' => 0.3, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(0, 0, 0));
$headerlineY = docMarginTop + a_logo_h + 1.5;
$pdf->Line(docMarginLeft, $headerlineY, 210-docMarginRight, $headerlineY, $linestyle);

//END Header
//------------------------------------



//$pdf->ImageSVG($file='tgt_21.svg', $x=20, $y=30, $w=180, $h=100, $link='', $align='N', $palign='', $border=0, $fitonpage=false);

//------------------------------------
//WING SVG
//$currentY = $pdf->GetY();

$svgLettersDisplay='inline';
$svgLettersFill='none';
$svgLettersStroke='none';
if ($sbmopt["letters"] == "no_letters"){$svgLettersDisplay='none';}
else{
	if(array_key_exists("let_out",$sbmopt) and $sbmopt["let_out"] == "outl")
	{$svgLettersStroke = getColor("letters");}
	else{$svgLettersFill = getColor("letters");}
}

$wingsvg = ' <svg version="1.1" id="target21_svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 705 384"  xml:space="preserve" preserveAspectRatio="xMinYMin meet">
<g id="bottom_view">

	<path id="top_surface_bv" fill="' . getColor("top_surface") . '" d="
	M192.96,283.36l68.02-7.22l61.18-5.21l59.03-2.39l75.19-2.04l53.88-2.51l35.68-0.72l31.97,1.44l29.93,3.71
	c26.32,5.59,56.61,14.09,78.06,20.6l4.67,0.59c-12.81-20.23-22.99-30.77-32.33-40.95c0,0-53.5-49.49-79.29-70.05l-15.78,3
	l-7.66-0.36l-0.12-2.39c0,0-155.02,44.76-231.9,66.97l0.01,0.03l-0.01-0.03c-21.13,6.11-36.36,10.51-40.85,11.81
	C249.48,267.26,219.64,275.81,192.96,283.36"/>

	<path id="leading_edge_bv" fill="' . getColor("leading_edge") . '" stroke="#000000" stroke-width="0.25" stroke-miterlimit="10" d="
	M690.57,289.61c-12.81-20.23-22.99-30.77-32.33-40.95s-75.55-70.76-75.55-70.76l-19.52,3.71l-7.66-0.36l-0.12-2.39
	c0,0-251.96,72.75-272.74,78.78c-184.01,53.37-265.8,73.75-272.27,74.23c-6.47,0.48-2.16-5.27-2.16-5.27s139.82-48.14,204.38-68.01
	c74.71-22.99,351.69-96.86,351.69-96.86c6.47-0.9,10.24,1.08,10.24,1.08c18.22,8.86,84.55,72.55,102.68,96.24
	c10.01,13.07,18.36,29.83,18.36,29.83C695.16,293.16,690.57,289.61,690.57,289.61z"/>

	<path id="trailing_edge_bv" fill="#FFFFFF" fill-opacity="0.9" stroke="#000000" stroke-width="0.25" stroke-miterlimit="10" d="
	M681.43,288.45l-12.25,0.48c0,0-18.16-2.71-25.5-3.35c0,0-6.7-2.55-23.87-5.35c0,0-4.07-2-27.06-7.08c0,0-61.54-9.28-131.22,3.77
	l-19.41,2.38l-17.87-1.06c0,0-36-1.92-50.61-1.68c-14.61,0.24-71.12,1.2-116.86,6.7c0,0-62.74,3.52-123.8,20.35l-50.97,10.42
	c28.05-7.51,64.76-17.6,110.94-30.68l68.02-7.22l61.18-5.21l59.03-2.39l75.19-2.04l53.88-2.51l35.68-0.72l31.97,1.44l29.93,3.71
	c26.32,5.59,56.61,14.09,78.06,20.6L681.43,288.45z"/>

	<path id="rf_bv" fill="#FFFFFF" fill-opacity="0.9" stroke="#000000" stroke-width="0.25" stroke-miterlimit="10" d="
	M354.75,276.96l21.35-3.68h52.42l38.02-0.7l36.42-3.61l6.85,1.96c-15.12,0.99-31.47,2.84-48.29,5.99l-19.41,2.38l-17.87-1.06
	c0,0-36-1.92-50.61-1.68C369.86,276.62,363.25,276.73,354.75,276.96z"/>

	<path id="bottom_surface_bv" fill="' . getColor("bottom_surface") . '" fill-opacity="' . getOpac("bottom_surface") . '" stroke="#000000" stroke-width="0.25" stroke-miterlimit="10" d="
	M690.57,289.61l-4.67-0.59c-34.48-36.17-127-73.06-162.37-86.9L323.5,245.86l-0.01-0.03c76.88-22.21,231.9-66.97,231.9-66.97
	l0.12,2.39l7.66,0.36l19.52-3.71c0,0,66.21,60.58,75.55,70.76S677.76,269.37,690.57,289.61"/>

	<path id="stripe_bv" fill="' . getColor("stripe") . '" fill-opacity="0.94" stroke="#000000" stroke-width="0.25" stroke-miterlimit="10" d="
	M685.9,289.02l-4.47-0.57c-37.4-36.2-126.76-69.67-162.13-83.51l-213.14,45.91l17.35-4.98l200.02-43.74
	C558.9,215.96,651.41,252.85,685.9,289.02z"/>

	<path id="battens_bv" fill="' . getColor("battens") . '" stroke="' . $battens_stroke . '" stroke-width="0.25" stroke-miterlimit="10" d="
	M676.57,284.01l-6.59,4.92h-0.8l6.92-5.32L676.57,284.01z M644.9,285.69l23-8.65l-0.62-0.46l-23.61,9L644.9,285.69z M654.89,268.02
	l-35.83,11.91l0.75,0.3l35.68-11.82L654.89,268.02z M593.8,273.38c0,0,25.95-8.61,43.06-16.17l-0.75-0.42
	c-17.1,7.56-43.37,16.35-43.37,16.35L593.8,273.38z M564.77,270.61c28.38-11.32,43.99-20.15,51.82-24.11l-0.65-0.33
	c-7.83,3.96-24.03,13.05-52.41,24.37L564.77,270.61z M532.94,270c23.89-11.24,41.08-20.83,61.01-34.29l-0.73-0.33
	c-19.93,13.46-37.75,23.4-61.63,34.64L532.94,270z M497.63,271.9c13.3-6.76,53.54-33.31,68.71-48.2l-0.81-0.34
	c-15.04,15.19-55.98,41.91-69.28,48.67L497.63,271.9z M461.52,276.92c8.77-7.37,54.73-48.69,72.76-66.14l-1.14-0.47
	c-18.03,17.45-64.32,59.42-73.09,66.79L461.52,276.92z M424.9,278.27c15.85-13.75,54.33-53.56,66.94-67.42l-2.71,0.58
	c-12.61,13.86-50.18,52.98-66.03,66.74L424.9,278.27z M374.4,276.55c25.06-21.39,41.13-39.08,48.72-50.89l-2.87,0.62
	c-7.59,11.81-22.93,28.92-47.99,50.31L374.4,276.55z M316.68,278.42c9.14-7.49,24.84-24.88,32.28-36.8l-1.89,0.41
	c-7.44,11.91-23.01,28.99-32.15,36.48L316.68,278.42z M257.54,283.17c3.15-3.39,12.55-14.3,16.75-23.11l-2.32,0.67
	c-4.2,8.81-13.29,19.22-16.45,22.61L257.54,283.17z M195.85,290.27c3.82-6.02,6.66-9.62,6.66-9.62l-2.45,0.69
	c0,0-2.24,3.2-6.07,9.22L195.85,290.27z M132.34,300.33l0.34,3.29l1.35-0.29l-0.39-3.36L132.34,300.33z"/>
	<path id="cb" fill="#D6D6D6" stroke="#000000" stroke-width="0.25" stroke-miterlimit="1" d="M646.98,248.66l-151.21-16.12
	l-210.78,24.42l27.81-8.02l183.23-21.83l147.65,17.06C643.67,244.17,646.98,244.71,646.98,248.66z"/>
	<path id="kt" fill="#D6D6D6" stroke="#000000" stroke-width="0.25" stroke-miterlimit="1" d="M402.95,313.93
	c59.07-47.05,98.68-90.29,156.47-132.49c1.03-0.75,12.85-7.61,14.89-6.53c-58.93,41.54-125.34,106.96-169.85,141.41
	C404.46,316.32,402.73,315.55,402.95,313.93z"/>
	<path id="keel_pocket_belt" stroke="#000000" stroke-width="0.25" stroke-miterlimit="10" d="M473.55,258.52
	c-2.84,0.5-3.76-7.05-3.76-7.05l-26.24,25.95c0.46,1.64,0.44,4.05,3.26,3.71l-1.72,1.45c-2.51,0.81-2.73-2.51-2.98-3.29
	c-0.25-0.78-1.07-0.69-1.07-0.69l-4.35-0.66l1.62-1.33l3.45,0.52l26.48-26.69h-3.1l1.92-1.84h3.02l0.74-0.74l1.28,0.5
	c-0.44,4.94,0.94,8.6,3.29,8.6L473.55,258.52z"/>

	<path id="keel_pocket" fill="' . getColor("keel_pocket") . '" stroke="#000000" stroke-width="0.25" stroke-miterlimit="10" d="
	M443.55,277.42l26.24-25.95c0,0,0.92,7.54,3.76,7.05l-26.74,22.61C443.99,281.48,444,279.06,443.55,277.42z M480.89,239.25
	c-0.32,2.02,0.23,10.62,2.84,9.87l5.47-4.79v-0.62l-0.78,0.68c-1.95,1.38-3.14-7.07-2.86-9.8L480.89,239.25z"/>
	<path id="up" fill="#D6D6D6" stroke="#000000" stroke-width="0.25" stroke-miterlimit="1" d="M463.26,372.31L476.22,258l0.3-4.34
	c-0.02-0.38-0.97-0.67-1.3-0.49c-0.57,0.32-1.44,2.42-1.44,2.42l-14.27,117.34c-0.14,1.16,0.92,2.47,2.07,2.34l121.59-13.7
	c0,0,1.8-0.4-1.44-3.79l-102.46-105.2l-2.11,1.84L579.1,359.65L463.26,372.31z"/>
	<path id="kp" fill="#D6D6D6" stroke="#000000" stroke-width="0.25" stroke-miterlimit="1" d="M464.48,188.55l-5.47-22.86
	c0,0-0.6-0.36-0.96,0s-1.32,2.75-1.32,2.75l4.95,20.86L464.48,188.55z"/>
	<polygon id="sprog" fill="#D6D6D6" stroke="#000000" stroke-width="0.25" stroke-miterlimit="1" points="684.13,284.46 
	645.59,284.12 645.59,284.86 684.13,285.19 	"/>
</g>
<g id="top_view">
	<path id="bottom_surface_tv" fill="' . getColor("bottom_surface") . '" stroke="#000000" stroke-width="0.25" stroke-miterlimit="1" d="M8.78,154.47
	l30.07-14.97l76.45-32.58l52.98-20.26c0.36-0.22,47.15-15.96,47.15-15.96l126.5-41.55l103.69,27.47l43.67,11.26l46.73,13.45
	l45.37,15.2l32.96,11.7l49.41,19.14l-3.77-3.13c-19.02-8.53-99.82-40.17-133.49-52.5l-46.88-15.61l-44.94-14.56l-95.68-30.18
	l-3.64-0.84l-3.35,0.62l-118.68,44.5l-45.26,17.87l-50.92,22.12c-25.5,11.93-61.09,28.97-112.07,53.97L8.78,154.47z"/>
	<path id="stripe_tv" fill="' . getColor("stripe") . '" stroke="#000000" stroke-width="0.25" stroke-miterlimit="1" d="M665.01,128.38l-80.38-29.57
	l-46.73-15.25l-46.24-12.9L447.6,59.84l-104.54-27.6l-126.82,41.3L168.51,89.5l-53.27,20.41l-83.6,35.85l-21.25,10.8l-1.59-2.09
	l30.07-14.97l76.45-32.58l52.98-20.26c0.36-0.22,47.15-15.96,47.15-15.96l126.5-41.55l103.69,27.47l43.67,11.26l46.73,13.45
	l45.37,15.2l32.96,11.7l49.41,19.14L665.01,128.38z"/>
	<path id="battens_tv" fill="' . getColor("battens") . '" stroke="' . $battens_stroke . '" stroke-width="0.25" stroke-miterlimit="1" d="M13.36,160.47l28.96-23.67
	h1.52l-29.69,24.71L13.36,160.47z M56.89,156.78l24.02-43.95l-1.95,0.93L54.67,157.5L56.89,156.78z M117.15,140.52
	c0,0-0.35-37.6,0.48-45.1l-1.61,0.77c-0.83,7.5-0.57,44.97-0.57,44.97L117.15,140.52z M174.97,124.3c0,0-6.73-45.52-6.48-50.94
	l-1.57,0.67c-0.25,5.41,6.24,50.74,6.24,50.74L174.97,124.3z M211.97,56.2c0.68,5.76,13.98,58.17,13.98,58.17l1.6-0.4
	c0,0-13.37-52.61-14.06-58.37L211.97,56.2z M253.01,40.78c1.42,3.97,11.4,44.68,20.98,65.71l1.63-0.33
	c-9.58-21.04-19.64-61.99-21.07-65.96L253.01,40.78z M321.22,101.74c-10.57-20.37-26.65-64.99-29.52-75.46l-1.33,0.5
	c2.87,10.47,18.32,54.63,28.89,75L321.22,101.74z M357.74,101.37c-11.58-26.17-34.25-87.02-34.25-87.02l-1.26,0.47
	c0,0,22.39,60.32,33.97,86.49L357.74,101.37z M334.43,10.71c3.11,7.6,12.8,36.61,19.48,50.85l0.62-0.25
	c-6.68-14.24-16.3-43.13-19.41-50.73L334.43,10.71z M357.27,60.91c-6.68-14.24-17.03-42.37-20.14-49.97l-0.74-0.17
	c3.11,7.6,13.66,36.03,20.34,50.27L357.27,60.91z M391.39,100.77c-8.41-15.59-33.08-73.56-38.88-85.13l-1.56-0.49
	c5.8,11.57,30.52,70.14,38.93,85.73L391.39,100.77z M391.39,27.9c4.71,8.17,24.61,49.59,39.4,71.64l1.76,0.06
	c-14.79-22.05-34.96-63.06-39.68-71.23L391.39,27.9z M434.69,41.56c3.4,4.62,10.94,22.15,41.95,60.1l1.5,0.24
	c-31.01-37.95-38.36-55.18-41.76-59.79L434.69,41.56z M479.71,56.15c4.62,4.85,11.01,16.97,42.99,50.1l1.51,0.24
	c-31.97-33.13-38.22-44.94-42.84-49.79L479.71,56.15z M524.21,70.97c3.59,2.21,29.66,29.81,44.46,41.48l1.6,0.3
	c-14.81-11.67-40.53-38.92-44.11-41.13L524.21,70.97z M572.13,89.03c3.99,2.44,40.8,34.03,40.8,34.03l1.42,0.29
	c0,0-36.17-31.08-40.16-33.52L572.13,89.03z M601.75,100.58c6.98,3.53,49.79,31.37,49.79,31.37l2.04,0.61
	c0,0-41.36-27.08-48.35-30.61L601.75,100.58z M670.64,133.05l-20.11-11.41l-0.26,0.18L669.92,133L670.64,133.05z"/>
	<path id="rf_tv" fill="#FFFFFF" fill-opacity="0.9" stroke="#000000" stroke-width="0.25" stroke-miterlimit="1" d="M655.83,122.41
	c1.61,0.69,3,1.3,4.17,1.82l10.64,8.83c-11.81-0.98-17.05-0.49-17.05-0.49c-10.99-3.44-40.66-9.51-40.66-9.51
	c-0.73-0.22-1.46-0.44-2.19-0.66c0,0,0-2.15,0-2.15l37.75,8.98l17,0.9L655.83,122.41L655.83,122.41z M578.21,114.3l-15.93-6.36
	v3.38l0,0C567.29,112.17,572.64,113.15,578.21,114.3L578.21,114.3z M534.5,107.45c-0.43-0.05-17.38-5.3-17.38-5.3v3.26v0
	c2.3,0.33,4.67,0.69,7.09,1.08C524.21,106.49,528.01,106.75,534.5,107.45L534.5,107.45z M471.43,101.07
	c2.58,0.24,4.88,0.51,6.71,0.83c0,0,3.82,0.06,10.34,0.5l0,0l-16.61-5.28L471.43,101.07L471.43,101.07z M429.97,95.65l-59.66-1.59
	l-52.89,4.04l-9.5,4.09c4.21-0.25,8.67-0.42,13.3-0.45c0,0,19.18-1.8,52.63,0.49c0,0,35.75-3.61,58.7-2.62c0,0,3.57,0.02,8.81,0.12
	L429.97,95.65z M265.16,107.24c2.95-0.32,5.92-0.58,8.83-0.75c0,0,2.2-0.48,6.06-1.14l0,0l-4.31-5.18L265.16,107.24 M230.98,113.16
	l-2.34-4.46l-16.05,7.35l0,0c4.58-0.74,9.13-1.34,13.37-1.69C225.95,114.36,227.82,113.88,230.98,113.16z M178.12,123.48
	l-1.67-5.37l-17.91,10.07c4.55-1.12,9.43-2.27,14.62-3.4C173.42,124.72,175.23,124.23,178.12,123.48z M115.43,136.8l-57.79,15.35
	l-37.54,4.4l-4.68-12c-3.37,1.65-6.82,3.34-10.33,5.06l9.06,11.89c0,0,29.66-4.01,40.52-4.01c0,0,29.81-9.98,60.78-16.32
	c0,0,1.93-0.77,5.65-2.07L115.43,136.8z"/>

	<path id="trailing_edge_tv" fill="#FFFFFF" fill-opacity="0.9" d="
	M8.78,154.47l5.37,7.04c0,0,29.66-4.01,40.52-4.01c0,0,29.81-9.98,60.78-16.32c0,0,21.08-8.39,57.7-16.39
	c1.15-0.25,30.99-8.61,52.8-10.42c0,0,25.58-6.56,48.04-7.87c0,0,20.99-4.59,47.22-4.76c0,0,19.18-1.8,52.63,0.49
	c0,0,35.75-3.61,58.7-2.62c0,0,33.29,0.16,45.58,2.3c0,0,19.68,0.33,46.08,4.59c0,0,44.11,2.95,88.71,16.56
	c0,0,29.68,6.07,40.66,9.51c0,0,5.25-0.49,17.05,0.49l-6.87-5.7l-13.99-4.82l-22.54-5.93l-30.58-7.57l-40.87-8.72l-42.87-5.29
	l-43.87-4.29l-102.89-5.29l-52.96,3.79l-43.39,4.5l-47.55,6.86l-51.16,8.43l-56.3,13.43l-47.3,12.15l-35.87,11.15L8.78,154.47z"/>

	<path id="top_surface_tv" fill="' . getColor("top_surface") . '" fill-opacity="' . getOpac("top_surface") . '" stroke="#000000" stroke-width="0.25" stroke-miterlimit="10" d="
	M8.78,154.47l-3.7-4.85c50.98-25,86.57-42.03,112.07-53.97l50.92-22.12l45.26-17.87l118.68-44.5l3.35-0.62l3.64,0.84l95.68,30.18
	l44.94,14.56l46.88,15.61c33.68,12.32,114.47,43.97,133.49,52.5l3.77,3.13l-13.99-4.82l-22.54-5.93l-30.58-7.57l-40.87-8.72
	l-42.87-5.29l-43.87-4.29l-102.89-5.29l-52.96,3.79l-43.39,4.5l-47.55,6.86l-51.16,8.43l-56.3,13.43l-47.3,12.15l-35.87,11.15
	L8.78,154.47z"/>

	<path id="leading_edge_tv" fill="' . getColor("leading_edge") . '" d="
	M526.51,71.73C489.5,58.18,414.03,32.87,333.18,7.26c0,0-0.69-0.19-1.23,0c-41.37,14.76-105.16,40.1-161.91,64.47
	c-10.66,4.58-26.28,11.47-52.88,23.92h0l50.92-22.12l45.26-17.87l118.68-44.5l3.35-0.62l3.64,0.84l95.68,30.18l44.94,14.56
	L526.51,71.73z"/>
	<path id="top" fill="none" stroke="#000000" stroke-width="0.25" stroke-miterlimit="10" d="M660,124.23
	c-19.02-8.53-99.82-40.17-133.49-52.5C489.5,58.18,414.03,32.87,333.18,7.26c0,0-0.69-0.19-1.23,0
	c-41.37,14.76-105.16,40.1-161.91,64.47c-20.89,8.97-60.78,26.81-164.95,77.89l9.06,11.89c0,0,29.66-4.01,40.52-4.01
	c0,0,29.81-9.98,60.78-16.32c0,0,21.08-8.39,57.7-16.39c1.15-0.25,30.99-8.61,52.8-10.42c0,0,25.58-6.56,48.04-7.87
	c0,0,20.99-4.59,47.22-4.76c0,0,19.18-1.8,52.63,0.49c0,0,35.75-3.61,58.7-2.62c0,0,33.29,0.16,45.58,2.3
	c0,0,19.68,0.33,46.08,4.59c0,0,44.11,2.95,88.71,16.56c0,0,29.68,6.07,40.66,9.51c0,0,5.25-0.49,17.05,0.49L660,124.23z"/>
	<path id="kttv" fill="#D6D6D6" stroke="#000000" stroke-width="0.25" stroke-miterlimit="10" d="M374.91,102.08l21.34,46.45
	c0,0-0.24,2.5-2.77,1.5l-22.07-47.96c0.8,0.05,1.62,0.11,2.44,0.16c0,0,0.37-0.04,1.06-0.1L374.91,102.08z"/>
	<path id="uptv" fill="#D6D6D6" stroke="#000000" stroke-width="0.25" stroke-miterlimit="10" d="M369.62,101.95l5.75,19.44
	c0.17,0.58-0.25,1.17-0.86,1.18l-79.57,2.14c-0.78,0.02-1.16-0.95-0.57-1.46l24.5-21.49v0c0.78-0.01,1.56-0.02,2.35-0.03
	c0,0,0.21-0.02,0.61-0.05h0l-24.4,21.27l75.68-1.87l-5.75-19.26C368.1,101.86,368.85,101.91,369.62,101.95L369.62,101.95z"/>
	<path id="kptv" fill="#D6D6D6" stroke="#000000" stroke-width="0.25" stroke-miterlimit="10" d="M370.82,10.54
	c0.3-1.21,1.59,0,1.68,1.13l-14.07,55.61c0,0-1.37-1.36-1.37-2.02L370.82,10.54z"/>
</g> 
<g id="letters_group">
	
		<path id="letters" fill-rule="evenodd" clip-rule="evenodd" display="' . $svgLettersDisplay . '" fill="' . $svgLettersFill . '" stroke="' . $svgLettersStroke . '" stroke-width="1" d="
		M241.39,54.77l4.81-1.85c0,0,0.1,0.15,0.19,0.22c0.45,0.38,1.82,0.14,4.09-0.73c1.67-0.64,2.67-1.13,3.03-1.45
		c0.34-0.34,0.41-0.58,0.24-0.72c-0.13-0.11-0.36-0.15-0.71-0.1c-0.35,0.03-0.78,0.12-1.28,0.23c-0.48,0.13-1.03,0.29-1.65,0.48
		c-0.58,0.2-1.18,0.37-1.73,0.56c-1.27,0.38-2.32,0.68-3.15,0.9c-0.83,0.22-1.64,0.34-2.36,0.38c-0.72,0.04-1.25-0.07-1.57-0.34
		c-0.3-0.25-0.31-0.62-0.03-1.04c0.25-0.44,0.98-1.01,2.17-1.68c1.21-0.67,2.93-1.47,5.25-2.37c2.73-1.05,4.79-1.66,6.13-1.86
		c1.32-0.19,2.17-0.13,2.56,0.2c0.06,0.05,0.15,0.15,0.18,0.27l-4.59,1.77c-0.21-0.18-0.58-0.22-1.12-0.15
		c-0.52,0.07-1.35,0.31-2.47,0.74c-1.09,0.42-1.92,0.82-2.53,1.19c-0.59,0.36-0.76,0.64-0.57,0.8c0.13,0.11,0.36,0.13,0.73,0.09
		c0.38-0.07,0.8-0.15,1.28-0.28c0.5-0.14,1.2-0.36,2.08-0.64c1.82-0.57,3.33-0.99,4.42-1.28c1.09-0.26,1.97-0.42,2.57-0.44
		c0.61-0.02,1.06,0.09,1.31,0.31c0.41,0.34,0.41,0.76,0.01,1.29c-0.38,0.54-1.21,1.15-2.44,1.83c-1.18,0.69-2.81,1.43-4.82,2.2
		c-2.13,0.82-3.9,1.4-5.26,1.74c-1.38,0.35-2.42,0.51-3.11,0.49c-0.67,0-1.17-0.13-1.43-0.35C241.5,55.04,241.42,54.91,241.39,54.77
		L241.39,54.77z M231.51,60.92L231.51,60.92c1.38-0.58,2.56-1.17,3.57-1.74c1.33-0.78,2.33-1.5,2.98-2.18
		c0.63-0.69,1.01-1.28,1.04-1.82c0.08-0.53-0.07-0.95-0.47-1.29c-0.34-0.29-0.86-0.49-1.52-0.57c-0.66-0.09-1.48-0.06-2.42,0.06
		c-0.97,0.13-2.03,0.36-3.23,0.72c-1.22,0.34-2.59,0.79-4.04,1.34c-0.71,0.27-1.1,0.45-1.6,0.67c-1.55,0.65-2.64,1.22-3.51,1.7
		c-1.39,0.76-2.36,1.51-3.03,2.19c-0.65,0.7-1.04,1.29-1.09,1.84c-0.1,0.54,0.06,0.98,0.45,1.3c0.34,0.29,0.93,0.49,1.71,0.58
		c0.8,0.11,2-0.01,3.61-0.31c1.59-0.32,3.62-0.95,6.04-1.88l0,0C230.51,61.32,231,61.11,231.51,60.92 M230.44,60.01
		c-0.34,0.16-0.73,0.31-1.14,0.46l0,0c-0.51,0.2-1.11,0.4-1.75,0.6c-0.65,0.2-1.35,0.31-2.12,0.34c-0.75,0.05-1.34-0.09-1.76-0.45
		c-0.3-0.25-0.4-0.61-0.36-1.07c0.07-0.45,0.47-0.97,1.2-1.57c0.53-0.44,1.32-0.88,2.36-1.33c0.32-0.15,0.68-0.29,1.07-0.44
		c1.14-0.44,2.09-0.73,2.85-0.86c0.78-0.14,1.39-0.17,1.8-0.09c0.43,0.07,0.79,0.22,1.05,0.44c0.3,0.25,0.42,0.63,0.36,1.07
		c-0.09,0.46-0.49,0.98-1.23,1.58C232.22,59.14,231.43,59.58,230.44,60.01 M169.52,83.5l1.61,0.7l5.32-2.05l-9.3-3.5l-5.16,1.99l0,0
		l-6.93,9.75l5.47-2.11l1.11-1.74L169.52,83.5z M168.23,82.79l-3.28-1.45l-2.3,3.6L168.23,82.79z M177.32,74.73l1.13,6.65
		l17.41-6.71l-0.22-1.29l-12.3,4.74l-0.27-1.49l10.58-4.07l-0.22-1.23l-10.58,4.07l-0.24-1.34l12.04-4.64l-0.22-1.29L177.32,74.73z
		 M205.82,65.13l-3.16,1.22l0.3,1.7l4.67-1.8c1.34-0.51,2.25-0.98,2.73-1.36c0.51-0.39,0.66-0.67,0.43-0.87
		c-0.43-0.37-1.74-0.14-3.84,0.67L205.82,65.13 M212.68,64.95c1.48-0.68,2.48-1.32,3.01-1.91c0.55-0.61,0.6-1.07,0.22-1.4
		c-0.32-0.27-0.82-0.41-1.54-0.39c-0.67,0.03-1.45,0.14-2.28,0.35c-0.81,0.2-1.57,0.41-2.26,0.65c-0.69,0.24-1.36,0.5-2,0.74
		l-10.53,4.06l1.21,6.62l5.11-1.97l-0.42-2.44l3.93-1.51c0.44-0.17,0.85-0.33,1.26-0.46c0.38-0.12,0.71-0.22,1.02-0.31
		c0.63-0.16,1.07-0.13,1.28,0.04c0.14,0.12,0.21,0.34,0.25,0.69c0.08,0.36,0.13,0.45,0.26,0.57c0.14,0.12,0.38,0.19,0.72,0.23
		l5.21-2.01c-0.18-0.02-0.44-0.06-0.61-0.19c-0.25-0.19-0.22-0.34-0.28-0.71l-0.08-0.4c-0.06-0.35-0.02-0.57-0.39-0.72
		c-0.11-0.04-0.21-0.09-0.35-0.1c-0.46-0.02-1.27,0.16-2.44,0.54L212.7,65L212.68,64.95z"/>
</g>
</svg>
'; 

$pdf->ImageSVG('@' . $wingsvg, $x=docMarginLeft, $y=$headerlineY+1.5, $w=210-docMarginLeft-docMarginRight, $h=200, $link='', $align='N', $palign='L', $border=0, $fitonpage=false);


//$newY = $pdf->getImageRBY();
//$calcNewY = $newY + $currentY;
//$pdf->SetXY(docMarginLeft, $calcNewY, true);
//$pdf->Write(0, $currentY . ' ' . $newY . ' ' . $calcNewY, '', 0, 'L', true, 0, false, false, 0, '', '0');
$pdf->SetXY(docMarginLeft, 120, true);



//------------------------------------
// TABLE SAIL OPTIONS
// set cell padding
$pdf->setCellPaddings(0, 0, 0, 0);

// set cell margins
$pdf->setCellMargins(0, 0, 0, 0);
//$pdf->SetX(20);
//$pdf->ln($ln_mm);

// set font
$pdf->SetFont(docTextFont, '', docTextSize, '', true);


//1st and 2nd column width
$fcolw = 50; 
$scolw = 210 - $fcolw - docMarginLeft - docMarginRight;

// MultiCell($w, $h, $txt, $border=0, $align='J', $fill=0, $ln=1, $x='', $y='', $reseth=true, $stretch=0, $ishtml=false, $autopadding=true, $maxh=0, $valign='T', $fitcell=false)

//ORDER
$pdf->MultiCell($fcolw, 0, "ORDER FOR", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$orderValue;
if ($sbmopt["opt_order"] == "wing"){$orderValue = "Complete wing";}
else{$orderValue = "Sail only!";}
$pdf->MultiCell($scolw, 0, $orderValue, 0, 'L', 0, 1, 65 , '', true, 0, false, true, 40, 'T'); // right cell
$pdf->ln($ln_mm);

// ($h, $txt, $link='', $fill=false, $align='', $ln=false, $stretch=0, $firstline=false, $firstblock=false, $maxh=0, $wadj=0, $margin='')
$pdf->Write(0, 'SAIL', '', 0, 'L', true, 0, false, false, 0, '', '0');


//Leading Edge
$pdf->MultiCell($fcolw, 0, "Leading edge", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$pdf->MultiCell($scolw, 0, getFullName("leading_edge"), 0, 'L', 0, 1, 65 , '', true, 0, false, true, 40, 'T'); // right cell

//Top surface
$pdf->MultiCell($fcolw, 0, "Top surface", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$pdf->MultiCell($scolw, 0, getFullName("top_surface"), 0, 'L', 0, 1, 65 , '', true, 0, false, true, 40, 'T'); // right cell

//Trailing edge
$pdf->MultiCell($fcolw, 0, "Trailing edge", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$pdf->MultiCell($scolw, 0, $materials['DP180HTPS']['namefull'], 0, 'L', 0, 1, 65 , '', true, 0, false, true, 40, 'T'); // right cell

//Bottom surface
$pdf->MultiCell($fcolw, 0, "Bottom surface", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$pdf->MultiCell($scolw, 0, getFullName("bottom_surface"), 0, 'L', 0, 1, 65 , '', true, 0, false, true, 40, 'T'); // right cell

//Stripe
$pdf->MultiCell($fcolw, 0, "Stripe", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$pdf->MultiCell($scolw, 0, getFullName("stripe"), 0, 'L', 0, 1, 65 , '', true, 0, false, true, 40, 'T'); // right cell

//Battens
$pdf->MultiCell($fcolw, 0, "Battens", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$pdf->MultiCell($scolw, 0, getFullName("battens"), 0, 'L', 0, 1, 65 , '', true, 0, false, true, 40, 'T'); // right cell

//Keel pocket
$pdf->MultiCell($fcolw, 0, "Keel pocket", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$pdf->MultiCell($scolw, 0, getFullName("keel_pocket"), 0, 'L', 0, 1, 65 , '', true, 0, false, true, 40, 'T'); // right cell

//Letters
$lettersValue = "";
if((array_key_exists("let_out",$sbmopt) and $sbmopt["let_out"] == "outl")){$lettersValue="Outlined, ";}
if($sbmopt["letters"] == "no_letters"){$lettersValue="No Letters";}
else{$lettersValue .= getShortName("letters");}
$pdf->MultiCell($fcolw, 0, "Letters", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$pdf->MultiCell($scolw, 0, $lettersValue, 0, 'L', 0, 1, 65 , '', true, 0, false, true, 40, 'T'); // right cell




// END SAIL OPTIONS TABLE
//-----------------------------------------

$pdf->ln($ln_mm);

//-----------------------------------------
// Other options / old sail

if ($sbmopt["opt_order"] == "wing") {
	$pdf->Write(0, 'OTHER OPTIONS' . "\n", '', 0, 'L', true, 0, false, false, 0);
	//Reinforced uprights
	$pdf->MultiCell($fcolw, 0, "Reinforced uprights", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
	if((array_key_exists("uprights",$sbmopt) and $sbmopt["uprights"] == "Yes") or (array_key_exists("gear", $sbmopt) and $sbmopt["gear"] == "Yes")){
		$pdf->MultiCell($scolw, 0, "Yes" . "\n", 0, 'L', 0, 1, 65 , '', true, 0, false, true, 40, 'T'); // right cell
	} else {
		$pdf->MultiCell($scolw, 0, "No" . "\n", 0, 'L', 0, 1, 65 , '', true, 0, false, true, 40, 'T'); // right cell
	}
	// Landing gear set
	$pdf->MultiCell($fcolw, 0, "Landing gear set", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
	if(array_key_exists("gear", $sbmopt) and $sbmopt["gear"] == "Yes"){
		$pdf->MultiCell($scolw, 0, "Yes" . "\n", 0, 'L', 0, 1, 65 , '', true, 0, false, true, 40, 'T'); // right cell
	} else {
		$pdf->MultiCell($scolw, 0, "No" . "\n", 0, 'L', 0, 1, 65 , '', true, 0, false, true, 40, 'T'); // right cell
	}
}
else{
	$pdf->Write(0, 'Replacement Sail for (customer\'s wing):' . "\n", '', 0, 'L', true, 0, false, false, 0);
	//sail number
	$pdf->MultiCell($fcolw, 0, "Sail serial number", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
	$pdf->MultiCell($scolw, 0, $sbmopt["old_wing_sail"] . "\n", 0, 'L', 0, 1, 65 , '', true, 0, false, true, 40, 'T'); // right cell
	//frame number
	$pdf->MultiCell($fcolw, 0, "Frame serial number", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
	$pdf->MultiCell($scolw, 0, $sbmopt["old_wing_frame"] . "\n", 0, 'L', 0, 1, 65 , '', true, 0, false, true, 40, 'T'); // right cell	
}


// END Other options
//-----------------------------------------

//-----------------------------------------
// INFO section
$pdf->ln($ln_mm);
$pdf->Write(0, 'ORDER INFO', '', 0, 'L', true, 0, false, false, 0);

//Date
$pdf->MultiCell($fcolw, 0, "Date", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$pdf->MultiCell($scolw, 0, $sbmopt["date"], 0, 'L', 0, 1, 65 , '', true, 0, false, true, 40, 'T'); // right cell

//Order reference
$pdf->MultiCell($fcolw, 0, "Order reference", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$pdf->MultiCell($scolw, 0, $sbmopt["cust_ref"], 0, 'L', 0, 1, 65 , '', true, 0, false, true, 40, 'T'); // right cell

//Dealer
$pdf->MultiCell($fcolw, 0, "Dealer", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$pdf->MultiCell($scolw, 0, $sbmopt["dealer"], 0, 'L', 0, 1, 65 , '', true, 0, false, true, 40, 'T'); // right cell

//Customer
$pdf->MultiCell($fcolw, 0, "Customer", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$pdf->MultiCell($scolw, 0, $sbmopt["customer"], 0, 'L', 0, 1, 65 , '', true, 0, false, true, 40, 'T'); // right cell

// END Info
//-----------------------------------------


/*
$pdf->ln($ln_mm);
$pdf->Write(0, 'NOTES:' . "\n" . $sbmopt["notes"], '', 0, 'L', true, 0, false, false, 0);
*/

$pdf->ln($ln_mm);
$pdf->Write(0, 'NOTES:', '', 0, 'L', true, 0, false, false, 0);
$pdf->Write(0, $sbmopt["notes"], '', 0, 'L', true, 0, false, false, 0);

//$pdf->writeHTML($html, true, false, true, false, ''); //temp


//------------------------------------
//FOOTER
$pdf->SetXY(docMarginLeft, -44); 
$pdf->SetFont(docHeaderFontFamily, '', 5, '', true);
// set color for background
$pdf->SetFillColor(0, 0, 0);
$pdf->SetTextColor(255,255,255);
$pdf->setCellPaddings(0.5, 0.5, 0.5, 0.5);
$pdf->setCellMargins(0, 0, 0, 0);

// MultiCell($w, $h, $txt, $border=0, $align='J', $fill=0, $ln=1, $x='', $y='', $reseth=true, $stretch=0, $ishtml=false, $autopadding=true, $maxh=0, $valign='T', $fitcell=false)
$pdf->MultiCell($wrWidth, 1, 'This block will be filled by Aeros', $border=1, $align='C', $fill=1, $ln=1, $x='', $y='', $reseth=true, $stretch=0);

$pdf->SetFont(docTextFont, '', 7, '', true);
$pdf->SetTextColor(0,0,0);
$pdf->MultiCell($wrWidth / 4, 10, 'Sail#', $border=1, $align='L', $fill=0, $ln=0, $x='', $y='', $reseth=true, $stretch=0, false, true, 10, 'B');
$pdf->MultiCell($wrWidth / 4, 10, 'Frame#', $border=1, $align='L', $fill=0, $ln=0, $x='', $y='', $reseth=true, $stretch=0, false, true, 10, 'B');
$pdf->MultiCell($wrWidth / 4, 10, 'Order#', $border=1, $align='L', $fill=0, $ln=0, $x='', $y='', $reseth=true, $stretch=0, false, true, 10, 'B');
$pdf->MultiCell($wrWidth / 4, 10, 'Production date', $border=1, $align='L', $fill=0, $ln=1, $x='', $y='', $reseth=true, $stretch=0, false, true, 10, 'B');
$pdf->SetFont(docTextFont, '', 5, '', true);
$pdf->MultiCell($wrWidth, 20, $sbmopt["version"], $border=1, $align='R', $fill=0, $ln=1, $x='', $y='', $reseth=true, $stretch=0, false, true, 20, 'B');

//footer end
//------------------------------------


// ---------------------------------------------------------

/*
PrintArea name (Optional; PDF 1.4) The name of the page boundary representing the area of a page to be rendered when printing the document. Valid values are (see Section 10.10.1, "Page Boundaries").:
MediaBox
CropBox (default)
BleedBox
TrimBox
ArtBox


TCPDF::$page_boxes = array('MediaBox', 'CropBox', 'BleedBox', 'TrimBox', 'ArtBox') protected
*/
$pdf->setViewerPreferences( array(
	'ViewArea' => 'CropBox', 
	'PrintArea' => 'CropBox',
	'PrintClip' => 'CropBox',
	'ViewClip' => 'CropBox',
	'PrintScaling' => 'None' // None, AppDefault
								 ) );

/* ---------------------------------------------------------
Close and output PDF document (I: send the file inline to the browser (default). The plug-in is used if available. The name given by name is used when one selects the "Save as" option on the link generating the PDF.
D: send to the browser and force a file download with the name given by name.
F: save to a local server file with the name given by name.
S: return the document as a string (name is ignored).
FI: equivalent to F + I option
FD: equivalent to F + D option
E: return the document as base64 mime multi-part email attachment (RFC 2045)) */
$pdf->Output('Target_21_order_form.pdf', 'I');
//$pdf->Output('Target_21_order_form.pdf', 'D');

//============================================================+
// END OF FILE
//============================================================+
