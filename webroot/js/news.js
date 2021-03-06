/********************************************************************
    File:   
        news.js
    Brief:  
        Implementation of JavaScript functionality for 
        the news.html page
    Dependencies:
        jquery-1.3.2.min.js             (jQuery library)
        jquery.easing.1.2.js            (jQuery library plugin)
    Author:
        DigitalCavalry
    Author URI:
        http://graphicriver.net/user/DigitalCavalry
*********************************************************************/ 

// alias to jQuery library, function noConflict release control of the $ variable 
// to whichever library first implemented it
var $j = jQuery.noConflict();

/***************************************
    CUFON SETTINGS
****************************************/

function setupAdditionalCufonFontReplacement()
{
    Cufon.replace(".newsLastTitle", {fontWeight: 700});
    Cufon.replace(".newsItemWrapper .title", {fontWeight: 400}); 
} // end of function setupAdditionalCufonFontReplacement
    
/***************************************
    MAIN CODE - CALL THEN PAGE LOADED
****************************************/
       
// binding action to event onload page
$j(document).ready(
    function()
    {
        // common.js
        setupGlobal();
        setupCommunityButtons();            
        setupToolTipText();
        setupSearchBox();
        setupCufonFontReplacement();
        setupSideBarMiniSlider();
        setupMultiImageLightBox();
        setupSidebarTabsPanel();
        setupLoadingAsynchronousImages();
        setupToolTipImagePreview();
        setupTextLabelImagePreview(); 
                 
        // this file
        setupAdditionalCufonFontReplacement();
    }
); 