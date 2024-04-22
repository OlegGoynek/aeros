<?php
//============================================================+
// File name   : example_058.php
// Begin       : 2010-04-22
// Last Update : 2013-05-14
//
// Description : Example 058 for TCPDF class
//               SVG Image
//
// Author: Nicola Asuni
//
// (c) Copyright:
//               Nicola Asuni
//               Tecnick.com LTD
//               www.tecnick.com
//               info@tecnick.com
//============================================================+

/**
 * Creates an example PDF TEST document using TCPDF
 * @package com.tecnick.tcpdf
 * @abstract TCPDF - Example: SVG Image
 * @author Nicola Asuni
 * @since 2010-05-02
 */

// Include the main TCPDF library (search for installation path).
require_once('tcpdf_include.php');

// create new PDF document
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

// set document information
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Nicola Asuni');
$pdf->SetTitle('TCPDF Example 058');
$pdf->SetSubject('TCPDF Tutorial');
$pdf->SetKeywords('TCPDF, PDF, example, test, guide');

// set default header data
$pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE.' 058', PDF_HEADER_STRING);

// set header and footer fonts
$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

// set default monospaced font
$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

// set margins
$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

// set auto page breaks
$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

// set image scale factor
$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

// set some language-dependent strings (optional)
if (@file_exists(dirname(__FILE__).'/lang/eng.php')) {
	require_once(dirname(__FILE__).'/lang/eng.php');
	$pdf->setLanguageArray($l);
}

// ---------------------------------------------------------

// set font
$pdf->SetFont('helvetica', '', 10);

// add a page
$pdf->AddPage();


$svginline = '
	<svg id="a_logo" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="80px"
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

// NOTE: Uncomment the following line to rasterize SVG image using the ImageMagick library.
//$pdf->setRasterizeVectorImages(true);

$pdf->ImageSVG('@' . $svginline, $x=15, $y=30, $w='', $h='', $link='http://www.tcpdf.org', $align='', $palign='', $border=1, $fitonpage=false);



$pdf->ImageSVG($file='images/tux.svg', $x=30, $y=100, $w='', $h=100, $link='', $align='', $palign='', $border=0, $fitonpage=false);

$pdf->SetFont('helvetica', '', 8);
$pdf->SetY(195);
$txt = '© The copyright holder of the above Tux image is Larry Ewing, allows anyone to use it for any purpose, provided that the copyright holder is properly attributed. Redistribution, derivative work, commercial use, and all other use is permitted.';
$pdf->Write(0, $txt, '', 0, 'L', true, 0, false, false, 0);

// ---------------------------------------------------------

//Close and output PDF document
$pdf->Output('example_058.pdf', 'D');

//============================================================+
// END OF FILE
//============================================================+
