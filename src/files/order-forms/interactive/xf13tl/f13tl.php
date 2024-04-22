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
function getColorByMat($matid){  //lookup color by material
	global $materials;
	$color = $materials["$matid"]['webcolor'];
	return $color;
}

function getOpac($option){  //lookup opacity for option in materials array
	global $materials, $sbmopt;
	$matid = $sbmopt["$option"];
	$opac= $materials["$matid"]['webopac'];
	return $opac;
}
function getOpacByMat($matid){  //lookup opacity by material
	global $materials;
	$opac= $materials["$matid"]['webopac'];
	return $opac;
}

function getFullName($option){  //lookup material name for option in materials array
	global $materials, $sbmopt;
	$matid = $sbmopt["$option"];
	$nameFull = $materials["$matid"]['namefull'];
	return $nameFull;
}
function getFullNameByMat($matid){  //lookup material name by material
	global $materials;
	$nameFull = $materials["$matid"]['namefull'];
	return $nameFull;
}

function getShortName($option){  //lookup material name for option in materials array
	global $materials, $sbmopt;
	$matid = $sbmopt["$option"];
	$nameShort = $materials["$matid"]['nameshort'];
	return $nameShort;
}
function getShortNameByMat($matid){  //lookup material name by material
	global $materials;
	$nameShort = $materials["$matid"]['nameshort'];
	return $nameShort;
}
//extra



	$headerText = "Fox 13TL";



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

// set array for viewer preferences
/*$preferences = array(
    'HideToolbar' => true,
    'HideMenubar' => true,
    'HideWindowUI' => true,
    'FitWindow' => true,
    'CenterWindow' => true,
    'DisplayDocTitle' => true,
    'NonFullScreenPageMode' => 'UseNone', // UseNone, UseOutlines, UseThumbs, UseOC
    'ViewArea' => 'CropBox', // CropBox, BleedBox, TrimBox, ArtBox
    'ViewClip' => 'CropBox', // CropBox, BleedBox, TrimBox, ArtBox
    'PrintArea' => 'CropBox', // CropBox, BleedBox, TrimBox, ArtBox
    'PrintClip' => 'CropBox', // CropBox, BleedBox, TrimBox, ArtBox
    'PrintScaling' => 'AppDefault', // None, AppDefault
    'Duplex' => 'DuplexFlipLongEdge', // Simplex, DuplexFlipShortEdge, DuplexFlipLongEdge
    'PickTrayByPDFSize' => true,
    'PrintPageRange' => array(1,1,2,3),
    'NumCopies' => 2
);*/
// Check the example n. 60 for advanced page settings
// set pdf viewer preferences
//$pdf->setViewerPreferences($preferences);



//Line break height
$ln_mm = 3;


// create new PDF document -- Orientation, Units, Page Format, Unicode, Encoding, Diskcache--
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
//$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, $page_format, true, 'UTF-8', false);

// set array for viewer preferences
$pdfPrefs = array(
    'ViewClip' => 'CropBox', // CropBox, BleedBox, TrimBox, ArtBox
    'PrintArea' => 'CropBox', // CropBox, BleedBox, TrimBox, ArtBox
    'PrintClip' => 'CropBox', // CropBox, BleedBox, TrimBox, ArtBox
    'PrintScaling' => 'none', // None, AppDefault
);
$pdf->setViewerPreferences($pdfPrefs);

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
$pdf->SetTitle('Fox 13TL order form');
$pdf->SetSubject('Fox 13 TL');
$pdf->SetKeywords('Aeros, Order form, Fox 13TL');

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
$pdf->Cell(210-docMarginLeft-docMarginRight, a_logo_h , $headerText, 0, true, 'C', 0, '', 0, false, 'M', 'M');

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



//------------------------------------
//WING SVG
//$currentY = $pdf->GetY();

//Letters FOX TL
	if($sbmopt["letters"] == "no_letters"){$svgLetters='';}
	else
	{
	$svgLetters='<path id="letters" d="M116.748,121.85c0.149,0.26 0.162,0.653 0.022,0.891l-2.392,4.055l0.889,1.477l1.571,-2.664c0.135,-0.228 0.364,-0.199 0.519,0.05l0.232,0.39c0.148,0.239 0.162,0.632 0.028,0.86l-1.565,2.652l1.509,2.528c0.156,0.25 0.164,0.654 0.03,0.882l-2.312,3.915c-0.141,0.24 -0.376,0.223 -0.533,-0.025l-3.822,-6.365c-0.148,-0.239 -0.162,-0.631 -0.02,-0.87l4.95,-8.392c0.142,-0.238 0.384,-0.234 0.525,0.018l0.369,0.598Zm8.694,-10.723c0.05,0.527 0.04,1.06 -0.048,1.549l1.52,2.538c0.322,0.529 0.254,1.527 -0.149,2.209l-4.18,7.082c-0.403,0.684 -0.992,0.801 -1.314,0.273l-2.333,-3.876c-0.323,-0.53 -0.253,-1.527 0.149,-2.21l4.179,-7.082c0.404,-0.684 0.993,-0.801 1.316,-0.273c0.156,0.25 0.4,0.276 0.541,0.037c0.101,-0.171 0.125,-0.407 0.081,-0.627l0.238,0.38Zm-3.756,4.873c-0.188,0.319 -0.152,0.869 0.08,1.258l1.648,2.738c0.232,0.39 0.563,0.438 0.751,0.119c0.189,-0.318 0.152,-0.868 -0.08,-1.258l-1.647,-2.738c-0.232,-0.388 -0.563,-0.438 -0.752,-0.119Zm10.207,-18.275l0.251,4.711l1.286,0.168c0.854,0.12 1.148,-0.573 1.263,-0.841c0.082,-0.19 0.125,-0.408 0.081,-0.626l0.232,0.39c0.105,0.946 -0.035,1.941 -0.434,2.667l-1.23,2.083c-0.403,0.684 -0.761,0.776 -1.531,0.637l-0.325,-0.06l0.124,1.626c0.021,0.306 -0.008,0.746 -0.128,0.951l-2.083,3.53c-0.055,0.09 -0.136,0.131 -0.201,0.021c-0.046,-0.069 -0.073,-0.194 -0.075,-0.289l-0.251,-4.711l-2.811,-0.374c-0.065,-0.015 -0.129,-0.049 -0.168,-0.131c-0.073,-0.098 -0.047,-0.239 0.007,-0.331l2.083,-3.529c0.12,-0.205 0.381,-0.254 0.563,-0.221l0.978,0.181l-0.118,-1.639c-0.021,-0.306 0.002,-0.735 0.13,-0.952l2.081,-3.529c0.054,-0.09 0.137,-0.132 0.202,-0.022c0.045,0.071 0.063,0.185 0.074,0.29Zm9.488,-17.62c0.157,0.249 0.17,0.642 0.029,0.881l-1.384,2.345l3.184,5.295c0.149,0.261 0.162,0.653 0.022,0.892l-2.453,4.155c-0.134,0.228 -0.377,0.223 -0.526,-0.037l-3.184,-5.296l-1.39,2.357c-0.134,0.229 -0.37,0.211 -0.525,-0.037l-0.363,-0.61c-0.148,-0.24 -0.162,-0.631 -0.02,-0.871l5.731,-9.712c0.134,-0.228 0.37,-0.211 0.518,0.028l0.361,0.61Zm9.456,-4.404c0.156,0.249 0.162,0.654 0.028,0.881l-5.14,8.71c-0.14,0.239 -0.377,0.223 -0.532,-0.027l-3.824,-6.363c-0.147,-0.24 -0.161,-0.633 -0.019,-0.871l2.452,-4.157c0.141,-0.238 0.376,-0.221 0.524,0.018l3.193,5.305l2.432,-4.122c0.14,-0.24 0.376,-0.223 0.524,0.016l0.362,0.61Z" style="fill: ' . getColor("letters") . ' ;"/>';
	}

//Top Surface 
if($sbmopt["top_surface_front"] == $sbmopt["top_surface_rear"] && substr($sbmopt["top_surface_front"],0,3) == "ODL"){
	$svgTSFtv = '<path id="top_surface_front_odl_tv" d="M540.672,179.733c-73.322,4.661 -128.839,11.703 -128.839,11.703c0,0 -31.629,46.176 -69.267,109.261l87.599,-79.097l110.507,-41.867" style="fill:' . getColor("top_surface_front") . '; fill-opacity: ' . getOpac("top_surface_front") . '; stroke:#000;stroke-width:0.25px;stroke-miterlimit:1;"/>';
	$svgTSRtv = '<path id="top_surface_rear_odl_tv" d="M269.455,435.443c21.839,-45.972 48.843,-94.07 73.111,-134.746l87.599,-79.097l110.507,-41.867c47.264,-3.004 102.396,-5.053 153.259,-3.478l0.002,0.003l6.986,18.102c0,0 -9.384,7.473 -19.073,25.158c0,0 -22.91,7.452 -41.062,19.842c0,0 -25.802,4.859 -51.607,17.564c0,0 -31.269,7.324 -51.994,16.928c0,0 -44.684,13.38 -61.029,22.926c-15.957,10.179 -48.273,43.815 -48.273,43.815c-18.011,14.048 -38.812,38.519 -38.812,38.519c-23.091,17.15 -39.2,37.882 -39.2,37.882c-19.314,10.487 -36.408,27.462 -36.408,27.462c-20.157,0.541 -31.093,5.473 -31.093,5.473l-12.91,-14.484" style="fill:' . getColor("top_surface_rear") . '; fill-opacity: ' . getOpac("top_surface_rear") . ';stroke:#000;stroke-width:0.25px;stroke-miterlimit:1;"/>';
	$svgTSFbv = '<path id="top_surface_front_odl_bv" d="M279.765,39.933c-73.322,4.661 -128.839,11.703 -128.839,11.703c0,0 -31.629,46.176 -69.266,109.261l87.599,-79.097l110.506,-41.867" style="fill:' . getColor("top_surface_front") . ';fill-opacity: ' . getOpac("top_surface_front") . ';stroke:#000;stroke-width:0.25px;stroke-miterlimit:1;"/>';
	$svgTSRbv = '<path id="top_surface_rear_odl_bv" d="M8.549,295.643c21.838,-45.973 48.842,-94.07 73.111,-134.746l87.599,-79.097l110.506,-41.867c47.265,-3.004 102.396,-5.053 153.259,-3.478l0.002,0.003l6.986,18.102c0,0 -9.384,7.473 -19.073,25.157c0,0 -22.91,7.453 -41.061,19.843c0,0 -25.803,4.859 -51.608,17.564c0,0 -31.269,7.324 -51.994,16.928c0,0 -44.684,13.38 -61.029,22.926c-15.957,10.179 -48.273,43.814 -48.273,43.814c-18.011,14.049 -38.812,38.52 -38.812,38.52c-23.091,17.15 -39.2,37.882 -39.2,37.882c-19.314,10.487 -36.408,27.462 -36.408,27.462c-20.157,0.541 -31.093,5.473 -31.093,5.473l-12.91,-14.484" style="fill:' . getColor("top_surface_rear") . '; fill-opacity: ' . getOpac("top_surface_rear") . '; stroke:#000;stroke-width:0.25px;stroke-miterlimit:1;"/>';
}
elseif($sbmopt["top_surface_front"] == $sbmopt["top_surface_rear"] && substr($sbmopt["top_surface_front"],0,3) == "NCV"){
	$svgTSFtv = '<path id="top_surface_front_ncv_tv" d="M349.774,288.697l77.954,-71.328l100.946,-36.845c-66.998,4.626 -116.838,10.91 -116.838,10.91c0,0 -27.825,40.691 -62.062,97.263" style="fill:' . getColor("top_surface_front") . ';fill-opacity: ' . getOpac("top_surface_front") . ';stroke:#000;stroke-width:0.25px;stroke-miterlimit:1;"/>';
	$svgTSRtv = '<path id="top_surface_rear_ncv_tv" d="M269.459,435.441c24.153,-50.845 54.109,-103.441 80.315,-146.744l0,0l77.954,-71.328l100.946,-36.845c50.075,-3.457 109.755,-5.99 165.26,-4.271l0.002,0.003l6.986,18.102c0,0 -9.384,7.473 -19.073,25.157c0,0 -22.91,7.452 -41.062,19.843c0,0 -25.802,4.859 -51.607,17.564c0,0 -31.269,7.324 -51.994,16.928c0,0 -44.684,13.38 -61.029,22.926c-15.957,10.179 -48.273,43.814 -48.273,43.814c-18.011,14.049 -38.812,38.52 -38.812,38.52c-23.091,17.15 -39.2,37.882 -39.2,37.882c-19.314,10.487 -36.408,27.462 -36.408,27.462c-20.157,0.541 -31.093,5.473 -31.093,5.473l-12.91,-14.484" style="fill:' . getColor("top_surface_rear") . '; fill-opacity: ' . getOpac("top_surface_rear") . ';stroke:#000;stroke-width:0.25px;stroke-miterlimit:1;"/>';
	$svgTSFbv = '<path id="top_surface_front_ncv_bv" d="M88.868,148.897l77.953,-71.328l100.946,-36.845c-66.998,4.625 -116.838,10.91 -116.838,10.91c0,0 -27.825,40.691 -62.061,97.263" style="fill:' . getColor("top_surface_front") . ';fill-opacity: ' . getOpac("top_surface_front") . ';stroke:#000;stroke-width:0.25px;stroke-miterlimit:1;"/>';
	$svgTSRbv = '<path id="top_surface_rear_ncv_bv" d="M8.552,295.641c24.153,-50.845 54.109,-103.441 80.316,-146.744l0,0l77.953,-71.328l100.946,-36.845c50.075,-3.457 109.755,-5.99 165.261,-4.271l0.001,0.003l6.986,18.102c0,0 -9.384,7.473 -19.073,25.157c0,0 -22.91,7.452 -41.061,19.843c0,0 -25.802,4.859 -51.608,17.564c0,0 -31.269,7.324 -51.994,16.928c0,0 -44.684,13.38 -61.029,22.926c-15.957,10.179 -48.273,43.814 -48.273,43.814c-18.011,14.049 -38.811,38.52 -38.811,38.52c-23.092,17.149 -39.201,37.882 -39.201,37.882c-19.313,10.487 -36.407,27.462 -36.407,27.462c-20.158,0.541 -31.093,5.473 -31.093,5.473l-12.911,-14.484" style="fill:' . getColor("top_surface_rear") . '; fill-opacity: ' . getOpac("top_surface_rear") . '; stroke:#000;stroke-width:0.25px;stroke-miterlimit:1;"/>';
}
else{
	$svgTSFtv = '<path id="top_surface_front_sandard_tv" d="M693.933,176.259l-0.002,-0.003c-129.768,-4.018 -282.098,15.181 -282.098,15.181c0,0 -86.669,126.735 -142.377,244.006l185.279,-173.744l239.196,-85.443" style="fill:' . getColor("top_surface_front") . ';fill-opacity: ' . getOpac("top_surface_front") . ';stroke:#000;stroke-width:0.25px;stroke-miterlimit:1;"/>';
	$svgTSRtv = '<path id="top_surface_rear_sandard_tv" d="M269.461,435.445l12.91,14.485c0,0 10.936,-4.933 31.093,-5.474c0,0 17.094,-16.974 36.408,-27.461c0,0 16.109,-20.733 39.2,-37.883c0,0 20.801,-24.47 38.812,-38.519c0,0 32.316,-33.635 48.273,-43.815c16.345,-9.545 61.029,-22.925 61.029,-22.925c20.725,-9.605 51.994,-16.929 51.994,-16.929c25.805,-12.705 51.608,-17.563 51.608,-17.563c18.151,-12.391 41.061,-19.843 41.061,-19.843c9.689,-17.684 19.073,-25.158 19.073,-25.158l-6.986,-18.101l0,0l-239.196,85.443l-185.279,173.744" style="fill:' . getColor("top_surface_rear") . '; fill-opacity: ' . getOpac("top_surface_rear") . ';stroke:#000;stroke-width:0.25px;stroke-miterlimit:1;"/>';
	$svgTSFbv = '<path id="top_surface_front_sandard_bv" d="M433.031,36.461l-0.001,-0.003c-129.768,-4.018 -282.099,15.181 -282.099,15.181c0,0 -86.669,126.736 -142.377,244.007l0,-0.001l185.279,-173.744l239.197,-85.443" style="fill:' . getColor("top_surface_front") . ';fill-opacity: ' . getOpac("top_surface_front") . ';"/>';
	$svgTSRbv = '<path id="top_surface_rear_sandard_bv" d="M8.554,295.645l12.911,14.485c0,0 10.935,-4.933 31.093,-5.474c0,0 17.094,-16.975 36.408,-27.461c0,0 16.109,-20.733 39.2,-37.883c0,0 20.8,-24.47 38.811,-38.519c0,0 32.316,-33.635 48.273,-43.815c16.345,-9.545 61.029,-22.925 61.029,-22.925c20.725,-9.605 51.995,-16.929 51.995,-16.929c25.805,-12.705 51.607,-17.564 51.607,-17.564c18.151,-12.39 41.061,-19.842 41.061,-19.842c9.689,-17.684 19.073,-25.158 19.073,-25.158l-6.986,-18.101l0,0l-239.196,85.443l-185.279,173.744" style="fill:' . getColor("top_surface_rear") . '; fill-opacity: ' . getOpac("top_surface_rear") . '; stroke:#000;stroke-width:0.25px;stroke-miterlimit:1;"/>';
}


//battens stroke - black, if battens are white or same as op surface

$battens_mat = $sbmopt["battens"];

if ($battens_mat == 'DP170MT0000' || $battens_mat == $sbmopt["top_surface_front"] || $battens_mat == $sbmopt["top_surface_rear"]){
	$battens_stroke = 'stroke:#000000;stroke-width:0.25px;stroke-miterlimit:1;';
}else{$battens_stroke = '';}


$wingsvg = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg viewBox="0 0 705 490" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" x="0px" y="0px" id="dsc_svg" preserveAspectRatio="xMinYMin meet">
	<g id="top">
		<path id="bottom_surface_tv" d="M693.937,176.263l-0.002,-0.003c-129.768,-4.018 -282.098,15.181 -282.098,15.181c0,0 -86.669,126.736 -142.377,244.007c0,0 12.911,14.483 12.911,14.483l-0.002,0l14.222,-39.909l133.574,-188.416l0,-0.006l228.756,-32.82l42,5.582l0,0l-6.986,-18.102" style="fill: ' . getColor("bottom_surface") . ' ;fill-opacity:1;stroke:#000;stroke-width:0.5px;stroke-miterlimit:1;"/>
		<path id="battens_tv" d="M290.463,393.409l23.864,50.21l-0.864,0.837l-23.801,-49.509l0.801,-1.538Zm90.692,-29.516l0.527,-0.489l1.447,1.567l-0.841,0.778l7.588,12.426l-0.804,0.936l-7.662,-12.548l-38.661,35.804l7.902,13.652l-0.779,0.976l-8.013,-13.804l-1.522,1.409l-1.447,-1.568l1.871,-1.733l-28.244,-48.654l0.714,-1.276l28.422,49.104l38.623,-35.767l-38.39,-62.872l0.679,-1.139l38.59,63.198Zm-7.338,-114.098l54.902,89.914l-0.836,0.883l-54.765,-89.688l0.699,-1.109Zm15.388,-24.101l58.15,95.234l-0.864,0.836l-57.993,-94.975l0.707,-1.095Zm15.153,-23.121l61.883,101.346l-0.919,0.751l-61.681,-101.018l0.717,-1.079Zm7.479,-11.135l-0.363,0.533l64.19,105.124l0.493,-0.319l0.509,-0.294l-64.189,-105.123l-0.64,0.079Zm13.32,-1.565l61.883,101.345l1.086,-0.473l-61.681,-101.017l-1.288,0.145Zm27.489,-2.917l58.15,95.234l1.14,-0.387l-57.993,-94.976l-1.297,0.129Zm28.47,-2.679l54.902,89.915l1.167,-0.341l-54.764,-89.688l-1.305,0.114Zm149.872,39.809l2.396,-0.873l0.733,2.002l-1.949,0.71l8.619,13.435l-1.224,0.247l-8.535,-13.267l-49.51,18.036l7.662,12.547l-1.199,0.288l-7.587,-12.426l-1.078,0.393l-0.734,-2.003l0.678,-0.247l-38.589,-63.197l1.323,-0.084l38.39,62.871l49.461,-18.016l-30.696,-47.716l1.46,-0.051l30.379,47.351Zm15.958,-48.348l33.762,44.166l1.14,-0.386l-33.168,-43.79l-1.734,0.01Z" style="fill:' . getColorByMat($battens_mat) . '; ' . $battens_stroke . ' "/>
		<path id="trailing_edge_tv" d="M680.292,175.921c4.57,0.085 9.12,0.197 13.643,0.337l6.986,18.102c0,0 -9.384,7.473 -19.073,25.157c0,0 -22.91,7.452 -41.061,19.843c0,0 -25.802,4.858 -51.608,17.564c0,0 -31.269,7.324 -51.994,16.928c0,0 -44.684,13.38 -61.029,22.925c-15.957,10.18 -48.273,43.815 -48.273,43.815c-18.011,14.049 -38.811,38.52 -38.811,38.52c-23.092,17.149 -39.201,37.882 -39.201,37.882c-19.314,10.487 -36.407,27.462 -36.407,27.462c-20.158,0.54 -31.093,5.473 -31.093,5.473l-12.911,-14.484c2.015,-4.242 3.588,-7.512 5.679,-11.773l9.581,19.66c5.012,-1.488 13.664,-4.031 26.105,-4.363c0,0 16.618,-16.589 35.932,-27.076c0,0 16.109,-20.733 39.199,-37.882c0,0 20.802,-24.471 38.811,-38.52c0,0 32.685,-33.153 48.185,-44.059c16.782,-8.806 61.119,-22.681 61.119,-22.681c20.725,-9.603 51.994,-16.929 51.994,-16.929c25.805,-12.705 51.607,-17.562 51.607,-17.562c18.151,-12.392 40.537,-19.547 40.537,-19.547c5.979,-10.914 11.944,-17.526 15.557,-21.305l-13.513,-17.488" style=" fill:' . getColor("trailing_edge") . ' ;fill-opacity:1;stroke:#000;stroke-width:0.5px;stroke-miterlimit:1;"/>
		<path id="top_surface_rf_tv" d="M435.617,253.767l9.719,-7.675l11.099,-4.997l30.605,50.123c-3.342,1.481 -6.657,3.095 -9.068,4.503l-3.587,2.19c-2.337,1.491 -5.323,3.731 -8.144,6.008l-30.625,-50.154" style="fill: ' . getColor("top_surface_rf") . ' ;fill-opacity:1;stroke:#000;stroke-width:0.5px;stroke-miterlimit:1;"/>
		' . $svgTSFtv . ' 
		' . $svgTSRtv . '
		<g id="le_tv_group">
			<path id="le_tv_inl" d="M411.835,191.438c0,0 -86.669,126.736 -142.377,244.007l-3.695,-4.145c52.878,-116.848 137.089,-254.572 137.089,-254.572c0,0 160.983,-11.993 289.082,-5.651l0.001,0.001l2,5.182l-0.001,-0.003c-129.769,-4.018 -282.099,15.181 -282.099,15.181" style="stroke:none; fill:#fff;"/>
			<path id="leading_edge_tv" d="M411.835,191.438c0,0 -86.669,126.736 -142.377,244.007l-3.695,-4.145c52.878,-116.848 137.089,-254.572 137.089,-254.572c0,0 160.983,-11.993 289.082,-5.651l0.001,0.001l2,5.182l-0.001,-0.003c-129.769,-4.018 -282.099,15.181 -282.099,15.181" style="fill: ' . getColor("leading_edge") . ' ;fill-opacity: ' . getOpac("leading_edge") . ';stroke:#000;stroke-width:0.5px;stroke-miterlimit:1;"/>
			<path id="nose_cone_stroke2" d="M396.524,187.212l13.285,7.214" style="fill:none;stroke:#000;stroke-width:0.5px;stroke-miterlimit:1;"/>
			<path id="nose_cone_stroke1" d="M415.069,175.888l0.349,15.114" style="fill:none;stroke:#000;stroke-width:0.5px;stroke-miterlimit:1;"/>
		</g>
	</g>
	<g id="bottom">
		' . $svgTSFbv . ' 
		' . $svgTSRbv . '		
		<path id="top_surface_rf_bv" d="M174.711,113.967l9.719,-7.675l11.098,-4.997l30.606,50.123c-3.343,1.48 -6.658,3.095 -9.069,4.503l-3.587,2.19c-2.337,1.491 -5.323,3.731 -8.144,6.008l-30.625,-50.154" style="fill:' . getColor("top_surface_rf") . ' ;fill-opacity: ' . getOpac("top_surface_rf") . ';stroke:#000;stroke-width:0.5px;stroke-miterlimit:1;"/>
		<path id="trailing_edge_bv" d="M440.014,54.562c0,0 -9.384,7.473 -19.072,25.158c0,0 -22.911,7.452 -41.062,19.842c0,0 -25.802,4.857 -51.607,17.564c0,0 -31.27,7.324 -51.995,16.928c0,0 -42.867,12.323 -59.213,21.867l-3.587,2.19c-15.957,10.181 -46.502,42.684 -46.502,42.684c-18.011,14.048 -38.811,38.517 -38.811,38.517c-23.091,17.152 -39.2,37.884 -39.2,37.884c-19.314,10.487 -36.408,27.462 -36.408,27.462c-20.158,0.539 -31.093,5.473 -31.093,5.473l-0.003,-0.002l2.613,-7.323c5.012,-1.488 12.927,-2.913 25.368,-3.246c0,0 17.095,-16.977 36.409,-27.464c0,0 16.109,-20.732 39.199,-37.882c0,0 20.802,-24.471 38.811,-38.519c0,0 28.411,-30.022 43.911,-40.928l8.925,-5.449c16.783,-8.806 56.468,-20.364 56.468,-20.364c20.725,-9.603 51.994,-16.928 51.994,-16.928c25.805,-12.706 51.607,-17.563 51.607,-17.563c18.151,-12.392 41.062,-19.842 41.062,-19.842c5.979,-10.915 11.054,-17.279 14.667,-21.058l7.515,0.999" style="fill:' . getColor("trailing_edge") . ' ;fill-opacity: ' . getOpac("trailing_edge") . ';stroke:#000;stroke-width:0.5px;stroke-miterlimit:1;"/>
		<path id="battens_bv" d="M29.557,253.609l23.863,50.21l-0.864,0.837l-23.801,-49.509l0.802,-1.538Zm90.691,-29.516l0.527,-0.489l1.448,1.567l-0.841,0.778l7.587,12.426l-0.804,0.935l-7.662,-12.547l-38.661,35.803l7.902,13.653l-0.778,0.976l-8.014,-13.804l-1.522,1.409l-1.447,-1.568l1.871,-1.733l-28.244,-48.655l0.714,-1.275l28.422,49.104l38.623,-35.767l-38.39,-62.872l0.68,-1.139l38.589,63.198Zm-7.338,-114.098l54.902,89.914l-0.836,0.883l-54.765,-89.689l0.699,-1.108Zm15.389,-24.101l58.149,95.234l-0.864,0.835l-57.993,-94.974l0.708,-1.095Zm15.152,-23.121l61.883,101.346l-0.919,0.751l-61.681,-101.018l0.717,-1.079Zm20.8,-12.7l61.883,101.345l1.086,-0.473l-61.682,-101.017l-1.287,0.145Zm27.489,-2.917l58.149,95.234l1.14,-0.387l-57.993,-94.976l-1.296,0.129Zm28.469,-2.679l54.902,89.915l1.168,-0.341l-54.764,-89.688l-1.306,0.114Zm149.872,39.809l2.396,-0.873l0.734,2.002l-1.95,0.71l8.619,13.435l-1.224,0.247l-8.535,-13.267l-49.51,18.036l7.662,12.547l-1.199,0.288l-7.587,-12.426l-1.078,0.393l-0.733,-2.003l0.677,-0.247l-38.589,-63.197l1.324,-0.084l38.389,62.871l49.462,-18.016l-30.697,-47.716l1.461,-0.052l30.378,47.352Zm15.959,-48.348l33.761,44.166l1.141,-0.386l-33.169,-43.79l-1.733,0.01Z" style="fill:' . getColorByMat($battens_mat) . '; ' . $battens_stroke . '"/>
		<path id="bottom_surface_bv" d="M440.013,54.559l-6.986,-18.102c-128.1,-6.342 -278.736,4.633 -278.736,4.633l-14.282,8.722c0,0 -78.58,128.984 -131.458,245.833l12.91,14.484l14.222,-39.909l133.516,-188.666l228.814,-32.576l42,5.581Z" style="fill:' . getColor("bottom_surface") . ' ;fill-opacity: ' . getOpac("bottom_surface") . ';stroke:#000;stroke-width:0.5px;stroke-miterlimit:1;"/>
		<g id="leading_edge_group_bv">
			<path id="le_bv_inl" d="M433.028,36.459c-128.1,-6.342 -278.736,4.633 -278.736,4.633l0.325,12.556c-0.02,-0.076 -3.588,2.19 -3.588,2.19l-11.019,-6.024c0,0 -78.58,128.984 -131.458,245.833l-0.001,-0.002l-3.695,-4.145c52.878,-116.848 137.089,-254.572 137.089,-254.572c0,0 160.983,-11.993 289.082,-5.651l0.002,0.001l2,5.182l-0.002,-0.003" style="stroke:none; fill:#fff;"/>
			<path id="leading_edge_bv" d="M433.028,36.459c-128.1,-6.342 -278.736,4.633 -278.736,4.633l0.325,12.556c-0.02,-0.076 -3.588,2.19 -3.588,2.19l-11.019,-6.024c0,0 -78.58,128.984 -131.458,245.833l-0.001,-0.002l-3.695,-4.145c52.878,-116.848 137.089,-254.572 137.089,-254.572c0,0 160.983,-11.993 289.082,-5.651l0.002,0.001l2,5.182l-0.002,-0.003" style="fill: ' . getColor("leading_edge") . ' ;fill-opacity: ' . getOpac("leading_edge") . ';stroke:#000;stroke-width:0.5px;stroke-miterlimit:1;"/>
			<path id="noseconestroke2_bv" d="M140.01,49.814l-4.393,-2.402" style="fill-rule:nonzero;stroke:#000;stroke-width:0.5px;stroke-miterlimit:1;"/>
			<path id="noseconestroke1_bv" d="M154.292,41.092l-0.13,-5.004" style="fill-rule:nonzero;stroke:#000;stroke-width:0.5px;stroke-miterlimit:1;"/>
		</g>
		<path d="M73.391,181.231c-1.423,-1.224 -4.707,0.261 -7.332,3.315c-2.626,3.055 -3.599,6.523 -2.176,7.747c1.423,1.223 4.706,-0.26 7.331,-3.314c2.627,-3.056 3.6,-6.523 2.177,-7.748Z" style="fill-rule:nonzero;stroke:#000;stroke-width:0.5px;stroke-miterlimit:1;"/>
		<path d="M301.629,41.868c-0.439,-1.826 2.381,-4.068 6.298,-5.008c3.917,-0.94 7.448,-0.223 7.884,1.604c0.439,1.825 -2.381,4.066 -6.297,5.008c-3.917,0.94 -7.447,0.221 -7.885,-1.604Z" style="fill-rule:nonzero;stroke:#000;stroke-width:0.5px;stroke-miterlimit:1;"/>
		<g id="frame">
			<path d="M21.532,277.524l31.302,18.285l-0.886,1.685l-31.303,-18.285c0,0 -2.514,-2.485 0.887,-1.685Z" style="fill:#d9d9d9;fill-rule:nonzero;stroke:#000;stroke-width:0.5px;stroke-miterlimit:1;"/>
			<path d="M68.624,190.003l-2.5,1.94l33.066,56.568l2.58,-1.577l-33.146,-56.931Z" style="fill:#d9d9d9;fill-rule:nonzero;stroke:#000;stroke-width:0.5px;stroke-miterlimit:1;"/>
			<path d="M410.977,39.726l1.965,36.199l1.905,-0.019l-1.965,-36.198c0,0 -1.063,-3.372 -1.905,0.018Z" style="fill:#d9d9d9;fill-rule:nonzero;stroke:#000;stroke-width:0.5px;stroke-miterlimit:1;"/>
			<path d="M65.123,192.719l112.484,-93.354l-2.474,-4.051l-111.106,92.303c-0.972,2.033 -1.094,3.858 -0.14,4.677c0.325,0.281 0.75,0.419 1.239,0.428l-0.003,-0.003Z" style="fill:#d9d9d9;fill-rule:nonzero;stroke:#000;stroke-width:0.5px;stroke-miterlimit:1;"/>
			<path d="M315.625,39.761l-134.431,57.413l-2.473,-4.051l132.866,-56.668c2.253,0.064 3.931,0.79 4.224,2.012c0.101,0.418 0.031,0.857 -0.185,1.299l-0.001,-0.005Z" style="fill:#d9d9d9;fill-rule:nonzero;stroke:#000;stroke-width:0.5px;stroke-miterlimit:1;"/>
			<path d="M311.609,41.635l2.867,-1.337l35.215,55.254l-2.581,1.576l-35.501,-55.493Z" style="fill:#d9d9d9;fill-rule:nonzero;stroke:#000;stroke-width:0.5px;stroke-miterlimit:1;"/>
			<path id="keeltube" d="M217.959,157.386l-1.794,1.095l0.001,0l-1.794,1.095l-70.346,-115.208l1.794,-1.095l1.794,-1.095l70.345,115.208" style="fill:#d9d9d9;stroke:#000;stroke-width:0.5px;stroke-miterlimit:1;"/>
		</g>
		<path id="keel_pocket" d="M213.58,154.246c-1.755,1.146 -2.694,5.618 -2.694,5.618l-26.479,-43.363c0,0 4.586,1.611 6.51,0.628c1.753,-1.262 2.414,-6.077 2.414,-6.077l26.478,43.363c0,0 -4.407,-1.207 -6.229,-0.169" style="fill:' . getColor("keel_pocket") . ' ;fill-opacity:1;stroke:#000;stroke-width:0.5px;stroke-miterlimit:1;"/>
	</g>
	' . $svgLetters . '
</svg>';



/*$pdf->ImageSVG('@' . $wingsvg, $x=docMarginLeft, $y=$headerlineY+1.5, $w=210-docMarginLeft-docMarginRight-60, $h=200, $link='', $align='N', $palign='L', $border=0, $fitonpage=false);*/
$pdf->ImageSVG('@' . $wingsvg, $x=docMarginLeft + 30, $y=$headerlineY+1.5, $w=210-docMarginLeft-docMarginRight-60, $h=100, $link='', $align='N', $palign='C', $border=0, $fitonpage=false);


//$newY = $pdf->getImageRBY();
//$calcNewY = $newY + $currentY;
//$pdf->SetXY(docMarginLeft, $calcNewY, true);
//$pdf->Write(0, $currentY . ' ' . $newY . ' ' . $calcNewY, '', 0, 'L', true, 0, false, false, 0, '', '0');
$pdf->SetXY(docMarginLeft, 110, true);



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
$fcolw = 75; 
$scolw = 210 - $fcolw - docMarginLeft - docMarginRight;

// MultiCell($w, $h, $txt, $border=0, $align='J', $fill=0, $ln=1, $x='', $y='', $reseth=true, $stretch=0, $ishtml=false, $autopadding=true, $maxh=0, $valign='T', $fitcell=false)

//ORDER
$pdf->MultiCell($fcolw, 0, "ORDER FOR", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
//$orderValue;
if ($sbmopt["opt_order"] == "wing"){$orderValue = "Complete wing";}
else{$orderValue = "Sail only";}
$pdf->MultiCell($scolw, 0, $orderValue, 0, 'L', 0, 1, $fcolw , '', true, 0, false, true, 40, 'T'); // right cell


$pdf->ln($ln_mm);

// ($h, $txt, $link='', $fill=false, $align='', $ln=false, $stretch=0, $firstline=false, $firstblock=false, $maxh=0, $wadj=0, $margin='')
$pdf->Write(0, 'SAIL', '', 0, 'L', true, 0, false, false, 0, '', '0');


//Leading Edge
$pdf->MultiCell($fcolw, 0, "Leading Edge", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$pdf->MultiCell($scolw, 0, getFullName("leading_edge"), 0, 'L', 0, 1, $fcolw , '', true, 0, false, true, 40, 'T'); // right cell

//Top surface Front
$pdf->MultiCell($fcolw, 0, "Top Surface Front Panel", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$pdf->MultiCell($scolw, 0, getFullName("top_surface_front"), 0, 'L', 0, 1, $fcolw , '', true, 0, false, true, 40, 'T'); // right cell

//Top surface Rear
$pdf->MultiCell($fcolw, 0, "Top Surface Rear Panel", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$pdf->MultiCell($scolw, 0, getFullName("top_surface_rear"), 0, 'L', 0, 1, $fcolw , '', true, 0, false, true, 40, 'T'); // right cell

//Top Surface Reinforcement
$pdf->MultiCell($fcolw, 0, "Top Surface Reinforcement", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$pdf->MultiCell($scolw, 0, getFullName("top_surface_rf"), 0, 'L', 0, 1, $fcolw , '', true, 0, false, true, 40, 'T'); // right cell

//Keel Pocket
$pdf->MultiCell($fcolw, 0, "Keel Pocket", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$pdf->MultiCell($scolw, 0, getFullName("keel_pocket"), 0, 'L', 0, 1, $fcolw , '', true, 0, false, true, 40, 'T'); // right cell

//Trailing edge
$pdf->MultiCell($fcolw, 0, "Trailing Edge", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$pdf->MultiCell($scolw, 0, getFullName("trailing_edge"), 0, 'L', 0, 1, $fcolw , '', true, 0, false, true, 40, 'T'); // right cell

//Bottom surface
$pdf->MultiCell($fcolw, 0, "Bottom Surface", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$pdf->MultiCell($scolw, 0, getFullName("bottom_surface"), 0, 'L', 0, 1, $fcolw , '', true, 0, false, true, 40, 'T'); // right cell

//Battens
$pdf->MultiCell($fcolw, 0, "Batten Pockets", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$pdf->MultiCell($scolw, 0, getFullName("battens"), 0, 'L', 0, 1, $fcolw , '', true, 0, false, true, 40, 'T'); // right cell

//Letters Fox TL
$lettersValue = "";
if($sbmopt["letters"] == "no_letters"){	$lettersValue = "No Letters";} else {$lettersValue=getFullName("letters");}
	
$pdf->MultiCell($fcolw, 0, "Letters", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$pdf->MultiCell($scolw, 0, $lettersValue, 0, 'L', 0, 1, $fcolw , '', true, 0, false, true, 40, 'T'); // right cell

// END SAIL OPTIONS TABLE
//-----------------------------------------

$pdf->ln($ln_mm);

//-----------------------------------------
// Other options / old sail

if ($sbmopt["opt_order"] == "wing") {
	$pdf->Write(0, 'OTHER OPTIONS' . "\n", '', 0, 'L', true, 0, false, false, 0);
	//4m Bag
	$pdf->MultiCell($fcolw, 0, "4m Transport Bag", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
	if(array_key_exists("bag4m",$sbmopt) && $sbmopt["bag4m"] == "Yes"){
		$pdf->MultiCell($scolw, 0, $sbmopt["bag4m"], 0, 'L', 0, 1, $fcolw , '', true, 0, false, true, 40, 'T'); // right cell
	}else{
		$pdf->MultiCell($scolw, 0, "No", 0, 'L', 0, 1, $fcolw , '', true, 0, false, true, 40, 'T'); // right cell
	}
}
else{
	$pdf->Write(0, 'Replacement Sail for (customer\'s wing data):' . "\n", '', 0, 'L', true, 0, false, false, 0);
	//sail number
	$pdf->MultiCell($fcolw, 0, "Sail serial number", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
	$pdf->MultiCell($scolw, 0, $sbmopt["old_wing_sail"] . "\n", 0, 'L', 0, 1, $fcolw , '', true, 0, false, true, 40, 'T'); // right cell
	//frame number
	$pdf->MultiCell($fcolw, 0, "Frame serial number", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
	$pdf->MultiCell($scolw, 0, $sbmopt["old_wing_frame"] . "\n", 0, 'L', 0, 1, $fcolw , '', true, 0, false, true, 40, 'T'); // right cell	
}


// END Other options
//-----------------------------------------

//-----------------------------------------
// INFO section
$pdf->ln($ln_mm);
$pdf->Write(0, 'ORDER INFO', '', 0, 'L', true, 0, false, false, 0);

//Date
$pdf->MultiCell($fcolw, 0, "Date: " . $sbmopt["date"], 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$pdf->MultiCell($scolw, 0, "Order reference: " . $sbmopt["cust_ref"], 0, 'L', 0, 1, $fcolw , '', true, 0, false, true, 40, 'T'); // right cell

//Dealer
$pdf->MultiCell($fcolw, 0, "Dealer", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$pdf->MultiCell($scolw, 0, $sbmopt["dealer"], 0, 'L', 0, 1, $fcolw , '', true, 0, false, true, 40, 'T'); // right cell

//Customer
$pdf->MultiCell($fcolw, 0, "Customer", 0, 'L', 0, 0, 20, '', true, 0, false, true, 40, 'T'); // left cell
$pdf->MultiCell($scolw, 0, $sbmopt["customer"], 0, 'L', 0, 1, $fcolw , '', true, 0, false, true, 40, 'T'); // right cell

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
$pdf->MultiCell($wrWidth, 20, 'v.' . $sbmopt["version"], $border=1, $align='R', $fill=0, $ln=1, $x='', $y='', $reseth=true, $stretch=0, false, true, 20, 'B');

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
