/********************************************************************
    File:   
        index.js
    Brief:  
        Implementation of JavaScript functionality 
        for the index.html page
    Dependencies:
        jquery-1.3.2.min.js     (jQuery library)
        jquery.easing.1.2.js    (jQuery library plugin)
        cufon-yui.js            (font replacement tool)         
    Author:
        DigitalCavalry
    Author URI:
        http://graphicriver.net/user/DigitalCavalry
*********************************************************************/

// array of image descriptions
var ImageDescriptions = new Array();

// alias to jQuery library, function noConflict release control of the $ variable 
// to whichever library first implemented it
var $j = jQuery.noConflict();

/**************************
    NEWS BAR CODE
**************************/

// time interval between news text change
var g_newsBarInterval = 8000;
// number of news determined dynamically
var g_newsCount = 0;
// current number of displayed news, start index from one
var g_actualNews = 1;
// handle to displayed news
var g_newsThis = null;

// Auto play function for news bar, is calling itself in some period time
function newsBarAutoPlay()
{
   // switch to next news
   g_actualNews = g_actualNews + 1;
   // check news range
   if(g_actualNews > g_newsCount)
   {
      // back to first news
      g_newsThis = $j(".newsBarNews:first");
      g_actualNews = 1;
   } else
   {
      // move to next news
      g_newsThis = $j(g_newsThis).next(".newsBarNews");
   }
   
   // fade down current news
   $j("#newsBarLink").fadeOut(100);
   $j("#newsBarText").fadeOut(100, 
        function(){
            $j("#newsBarText").html($j(g_newsThis).find(".text").html());
            var link = $j(g_newsThis).find(".link").html();
            $j("#newsBarLink").attr("href", link); 
            });
            
   // fade up new news
   $j("#newsBarText").fadeIn(1500);
   $j("#newsBarLink").fadeIn(1500);
   
   // set auto call in some time period
   setTimeout(newsBarAutoPlay, g_newsBarInterval);
} // end of function newsBarAutoPlay

// This function setup news bar, and is called only once then page is loaded
function setupNewsBar()
{
    // determining number of news to display
    g_newsCount = $j(".newsBarNews").length;
    // get handle to the first news
    g_newsThis = $j(".newsBarNews:first");
    // copying news text and link to newsBarText and newsBarLink
    $j("#newsBarText").html($j(g_newsThis).find(".text").html());
    $j("#newsBarLink").attr("href", $j(g_newsThis).find(".link").html()); 
    // set auto play for news
    setTimeout(newsBarAutoPlay, g_newsBarInterval);
} // end of function setupNewsBar


/**************************
       ACCORDION CODE
**************************/
 
// default width of accordion for this template is set to 960 pixels,
// this value is hardcoded and must be equal to accordion width coded in
// accordionContainer CSS style (file: indexCSS.css)
var ACCORDION_WIDTH = 600;
// this variable determine the width of div then it is draw aside
var ACCORDION_DRAW_ASIDE_WIDTH = 50;
// slide function, the default is "liner" which is implemented in jQuery,
// it's not looking good, so we use special easing pluging and method "jQuery EasIng v1.1.2"
var ACCORDION_EASING_METHOD = "easeOutCirc";
// slide time
var ACCORDION_SLIDE_TIME = 650;
// collection of objects which describe divs included in accordion image slider,
// every described div have included one main image, and some addiotonal images and
// elements whith other informations needed for main image, we pack objects into an array
var g_slidedDivs = null;
var g_hoveredSlideIndex = null;
function setupAccordionImageSlider()
{
    // turn off displaying border-left for first div holding image in accordion
    $j("#accordionContainer").find(".accordionImgDiv:first").css("border-left", "0px");
    
    // get list of all slided divs in slider
    var slidedDivsList = $j("#accordionContainer .accordionImgDiv");
    // collect information on every div in to an global array
    g_slidedDivs = new Array;
    var firstDiv = $j("#accordionContainer .accordionImgDiv:first");
    for(var i = 0; i < slidedDivsList.length; i++)
    {
        var obj = new Object(); 
        obj.name = "#" + $j(firstDiv).attr('id'); 
        obj.dest = 0;
        obj.out = 0;
        g_slidedDivs.push(obj); 

        firstDiv = $j(firstDiv).next(".accordionImgDiv");
    }
                 
    // calculating rib width based on accordion containter width divided by slides number in accordion
    var ribOutWidth = 0;
    // calculate width of the rib
    ribOutWidth = ACCORDION_WIDTH / g_slidedDivs.length;
    
    // then the page is load we must set the left margin of every div in accordion
    // distance between divs a equal to rib width so the divs are placed equally
    for(var i = 0; i < g_slidedDivs.length; i++)
    {
        // set left margin
        $j(g_slidedDivs[i].name).css("margin-left", (i*ribOutWidth)+"px");
        // addiotinaly we set the dest member to the same value
        g_slidedDivs[i].dest = i*ribOutWidth;
    }

    // we set the acction for hover the accordion container,
    // when the mouse is moved on, there is no action taken,
    // when mouse is moved from we distribyte all slided divs in accordion
    // equally on accordion space
    $j("#accordionContainer").hover(
        function()
        {   
            // stop the auto play accordion image slider
            if(true == g_sliderAutoPlay)
            {
                clearTimeout(g_sliderTimerAutoPlay);
            }
            // if slider is not fully loaded
            if(g_loadedStripCount < g_slidedDivs.length)
            {
                return;
            }            
            // hide slide strip desc
            $j("#accordionContainer .accordionImgDiv").find(".slideDesc").stop().animate({opacity: 0.0}, 150);
        },
        function()
        {   
            // if slider is not fully loaded 
            if(g_loadedStripCount < g_slidedDivs.length)
            {
                return;
            }
            
            mouseOutAccorOnAll(null);        
            for(var i = 0; i < g_slidedDivs.length; i++)
            {
                // if div is currently moved we stop the animation
                // and set new animation for left margin
                $j(g_slidedDivs[i].name).stop()
                    .animate({marginLeft: (i*ribOutWidth)+"px"}, {duration: 900, easing: ACCORDION_EASING_METHOD});
                // we set the destination member to the same value
                g_slidedDivs[i].dest = i*ribOutWidth;
                // show strip desc
                $j(g_slidedDivs[i].name).find(".slideDesc").stop().animate({opacity: 1.0}, 1200);
            }
            // fire up auto play for slider
            if(true == g_sliderAutoPlay)
            {
                clearTimeout(g_sliderTimerAutoPlay);
                mouseOutAccorOnAll(null);
                g_sliderTimerAutoPlay = setTimeout(accordionPlay, g_sliderTimerInterval);
            }
        }
    );                                                    

    // setting hover action for every div of class accordionImgDiv in accordion,
    // when user move mause on div, we must to draw aside all dive except the hovered
    $j(".accordionImgDiv").hover(
        function()
        {   
            // stop the auto play accordion image slider
            if(true == g_sliderAutoPlay)
            {
                clearTimeout(g_sliderTimerAutoPlay);
            }        
            // if slider is not fully loaded we return
            if(g_loadedStripCount < g_slidedDivs.length)
            {
                return;
            }        
        
            // save in variable id of hovered element
            var divID = ("#" + $j(this).attr('id'));
            // fade out all divs with excluding hovered div
            mouseOutAccorOnAll(divID);

            g_hoveredSlideIndex = $j("#accordionContainer .accordionImgDiv").index(this);    
            
            var context = $j(this)[0];
            // stop and set new animation of main image opacity
            $j(".accordionSlideImage", context).find("img").stop().animate({opacity: 1.0}, 400); 
            // stop and set new animation of image description background div
            $j(".accordionDescBack", context).stop().animate({bottom: 0, opacity: 0.8}, 1000);
            // stop and set new animation of image description div
            $j(".accordionDesc", context).stop().animate({bottom: 0, opacity: 1.0}, 1000);
            $j(".slideStrip", context).stop().animate({opacity: 0.0}, 200, ACCORDION_EASING_METHOD); 
            
            g_slidedDivs[g_hoveredSlideIndex].out = 0;
            // draw aside all divs
            setMoveForAccordionDivs(g_hoveredSlideIndex);
			
			$j("div#ImageDescrip").text(ImageDescriptions[divID.substring(6,7)-1]);  
			
        }, 
        function()
        {
            if(g_loadedStripCount < g_slidedDivs.length)
            {
                return;
            }        
        
            g_hoveredSlideIndex = null;
            
            // save in variable id of hovered element
            var divID = ("#" + $j(this).attr('id'));
            // now we need to find the index of hovered div,
            // so we searching it name in array g_slidedDivs, when
            // the named match we save index and break loop  
            var index = 0;
            for(var i = 0; i < g_slidedDivs.length; i++)
            {
                if(divID == g_slidedDivs[i].name)
                {        
                    index = i;
                    break;
                }
            }
            
            if(g_slidedDivs[index].out != 1)
            {
                g_slidedDivs[index].out = 1;            
                mouseOutAccor(this);
            }
        }
    );
} // end of function setupAccordionImageSlider 

// Function set value of left margin for every slided div in accordion
// @param[in] index - index of ohovered div with class accordionImgDiv 
function setMoveForAccordionDivs(index)
{
    // for every slided div we make the same
    for(var i = 0; i < g_slidedDivs.length; i++)
    {
        var context = $j(g_slidedDivs[i].name)[0];
        var object = $j(g_slidedDivs[i].name);
        $j(".slideDesc", context).stop().animate({opacity: 0.0}, 150);
        // if div lie on left we move it on left
        if(i < index)
        {
            // calculate new margin, this equal to calculate new position of div
            var newMargin = (i*ACCORDION_DRAW_ASIDE_WIDTH);
            // if new margin is diffrent from div destination margin the animation is set    
            if(g_slidedDivs[i].dest != newMargin)
            {
                // first we stop the old animation
                object.stop();
                // animation time
                var animTime = ACCORDION_SLIDE_TIME;
                // save new margin 
                g_slidedDivs[i].dest = newMargin;
                // set new animation
                object.animate(
                    {marginLeft: newMargin+"px"}, 
                    {duration: animTime, easing: ACCORDION_EASING_METHOD});
            }
			$j("div#ImageDescrip").text(ImageDescriptions[i + 1]); 
            // go to next iteraction of loop
            continue;
        }
        // if div is hovered, we move it max to the left, the code is identical,
        // but is separated for future to add maybe some special actions
        if(index == i)
        {
            // calculate new margin
            var newMargin = (i*ACCORDION_DRAW_ASIDE_WIDTH);
            // if new margin is diffrent from div destination margin the animation is set 
            if(g_slidedDivs[i].dest != newMargin) 
            {   
                // first we stop old animation
                object.stop();
                // animation time
                var animTime = ACCORDION_SLIDE_TIME;
                // save new margin           
                g_slidedDivs[i].dest = newMargin;
                // set new animation
                object.animate(
                    {marginLeft: newMargin+"px"}, 
                    {duration: animTime, easing: ACCORDION_EASING_METHOD});
            }
            // go to next iteraction of loop   
            continue;
        }
        // if div lie on right we move it on right, we must calculate
        // margin from right border of accordion container   
        if(i > index)
        {
            // calculate new margin 
            var newMargin = (ACCORDION_WIDTH - ((g_slidedDivs.length - i) * ACCORDION_DRAW_ASIDE_WIDTH));
            // if new margin is diffrent from div destination margin the animation is set 
            if(g_slidedDivs[i].dest != newMargin) 
            {   
                // first we stop old animation   
                object.stop();
                // animation time    
                var animTime = ACCORDION_SLIDE_TIME;
                // save new margin            
                g_slidedDivs[i].dest = newMargin;
                // set new animation   
                object.animate({"marginLeft": newMargin+"px"}, {duration: animTime,
                    easing: ACCORDION_EASING_METHOD});
            }
            // go to next iteraction of loop 
            continue;
        }
    }
} // end of function setMoveForAccordionDivs  


var g_actualSlideImage = 0;
// auto play timer handle for accordion image slider
var g_sliderTimerAutoPlay = null;
// slider timer interval
var g_sliderTimerInterval = 4500;
// is accordion auto play on/off
var g_sliderAutoPlay = true;
// if have true, the new loop of slider is starting
var g_sliderNewLoop = false;
// true if new slider loop gona be start
var g_setBackwardBtnOnLast = false;

function accordionPlay()
{
    if(g_loadedStripCount < g_slidedDivs.length)
    {
        // fire up slider
        if(true == g_sliderAutoPlay)
        {
            g_sliderTimerAutoPlay = setTimeout(accordionPlay, g_sliderTimerInterval);
        }      
        return;
    }      

    var timeOut = g_sliderTimerInterval;
 
    if(BACKWARD == g_lastSlideMoveDirection)
    {
        g_actualSlideImage++;
        if(g_actualSlideImage >= g_slidedDivs.length)
        {
            g_actualSlideImage = 0;
            g_sliderNewLoop = true;
        } 
    }
    g_lastSlideMoveDirection = FORWARD;
    
    g_setBackwardBtnOnLast = false;
    if(true == g_sliderNewLoop)
    {
        ribOutWidth = ACCORDION_WIDTH / g_slidedDivs.length;
        mouseOutAccorOnAll(null);
       
        for(var i = 0; i < g_slidedDivs.length; i++)
        {
			$j("div#ImageDescrip").text(ImageDescriptions[0]); 
            // if div is currently moved we stop the animation
            // and set new animation for left margin
            $j(g_slidedDivs[i].name).stop()
                .animate({marginLeft: (i*ribOutWidth)+"px"}, {duration: 900, easing: ACCORDION_EASING_METHOD});
            // we set the destination member to the same value
            g_slidedDivs[i].dest = i*ribOutWidth;
            $j(g_slidedDivs[i].name).find(".slideDesc").stop().animate({opacity: 1.0}, 2000); 
			
        }
        timeOut = g_sliderTimerInterval * 2;
        g_sliderNewLoop = false;
        // for backward button, we set the index to last element
        g_setBackwardBtnOnLast = true;
        // fire up slider
        g_sliderTimerAutoPlay = setTimeout(accordionPlay, timeOut); 
        return;
    }
    
    mouseOutAccorOnAll(null); 
    mouseOnAccor(g_slidedDivs[g_actualSlideImage].name);
    
    g_actualSlideImage++;
    if(g_actualSlideImage >= g_slidedDivs.length)
    {
        g_actualSlideImage = 0;
        g_sliderNewLoop = true; 
    }
    
    // fire up slider
    if(true == g_sliderAutoPlay)
    {
        g_sliderTimerAutoPlay = setTimeout(accordionPlay, g_sliderTimerInterval);
    }      
    
} // end of function accordionPlay

function setupAccordionAutoPlay()
{
    // fire up auto play for accordion image slider
    if(true == g_sliderAutoPlay)
    {
        g_sliderTimerAutoPlay = setTimeout(accordionPlay, g_sliderTimerInterval);
    }
} // end of function setupAccordionAutoPlay

function mouseOnAccor(_this)
{
    // now we need to find the index of hovered div,
    // so we searching it name in array g_slidedDivs, when
    // the named match we save index and break loop  
    var index = 0;
    for(var i = 0; i < g_slidedDivs.length; i++)
    {
        if(("#" + $j(_this).attr('id')) == g_slidedDivs[i].name)
        {        
            index = i;
            break;
        }
    }
    g_slidedDivs[index].out = 0;

    // stop and set new animation of main image opacity
    $j(_this).find(".accordionSlideImage").find("img").stop().animate({opacity: 1.0}, 400); 
    // stop and set new animation of image description background div
    $j(_this).find(".accordionDescBack").stop().animate({bottom: 0, opacity: 0.8}, 1000);
    // stop and set new animation of image description div
    $j(_this).find(".accordionDesc").stop().animate({bottom: 0, opacity: 1.0}, 1000);
    $j(_this).find(".slideStrip").stop().animate({opacity: 0.0}, 300);
  
    // draw aside all divs
    setMoveForAccordionDivs(index);
} // end of function mouseOnAccor

function mouseOutAccor(_this)
{
    var context = $j('#accordionContainer')[0];
    // stop and set new animation of main image opacity
    $j(_this, context).find(".accordionSlideImage").find("img").stop().animate({opacity: 0.0}, 800
    ,function(){$j(_this, context).find(".slideStrip").stop().animate({opacity: 1.0}, 600);}
    );
    // stop and set new animation of image description background div   
    $j(_this, context).find(".accordionDescBack").stop().animate({bottom: -70, opacity: 0}, 300);
    // stop and set new animation of image description div   
    $j(_this, context).find(".accordionDesc").stop().animate({bottom: -70, opacity: 0}, 300);
    
} // end of function mouseOutAccor

function mouseOutAccorOnAll(excludedID)
{
    for(var j = 0; j < g_slidedDivs.length; j++)
    {
       if(excludedID != null)
       {
         if(excludedID == g_slidedDivs[j].name)
         {
            continue;
         }
       }
       if(g_slidedDivs[j].out != 1)
       {
            g_slidedDivs[j].out = 1;
            mouseOutAccor(g_slidedDivs[j].name);
       }
    } 
} // end of function mouseOutAccorOnAll


/**********************************
    ACCORDION CONTROL PANEL CODE
***********************************/
// true - forward, false - backward
var FORWARD = true;
var BACKWARD = false;
var g_lastSlideMoveDirection = FORWARD;
 
function setupAccordionControlPanel()
{
    // fadeout description text
    $j("#accorControlBtnDesc").fadeTo(0, 0.0); 

    // bind function to accordion control panel play button called then button is clicked 
    $j("#accorPlayBtn").click(
        function()
        {
            // change state of accordion slider auto play
            g_sliderAutoPlay = !g_sliderAutoPlay;
            // if auto play is off, we need to clear actual timer,
            // in other case, if slider is on, we set new timer function call
            if(false == g_sliderAutoPlay)
            {
                clearTimeout(g_sliderTimerAutoPlay);
                
                mouseOutAccorOnAll(null);
                var ribOutWidth = ACCORDION_WIDTH / g_slidedDivs.length; 
                for(var i = 0; i < g_slidedDivs.length; i++)
                {
                    // if div is currently moved we stop the animation
                    // and set new animation for left margin
                    $j(g_slidedDivs[i].name).stop()                    
                        .animate({marginLeft: (i*ribOutWidth)+"px"}, {duration: 900, easing: ACCORDION_EASING_METHOD});
                    // we set the destination member to the same value
                    g_slidedDivs[i].dest = i*ribOutWidth;
                    $j(g_slidedDivs[i].name).find(".slideDesc").stop().animate({opacity: 1.0}, 2000); 
                }                
            } else
            {
                 g_sliderTimerAutoPlay = setTimeout(accordionPlay, g_sliderTimerInterval); 
            }
            if(true == g_sliderAutoPlay)
            {
                 $j(this).attr("src", "img/slider/accordion/control/pause_hover.png");
            } else
            {
                  $j(this).attr("src", "img/slider/accordion/control/play_hover.png");
            }
        }
    );

    // bind function to accordion control panel play button called then button is hovered by user
    $j("#accorPlayBtn").hover(
        function ()
        {
            // set text and slow fade to 100%
            $j("#accorControlBtnDesc").text("turn off/on slider auto play").fadeTo("slow", 1.0);
           
            if(false == g_sliderAutoPlay)
            {
                $j(this).attr("src", "img/slider/accordion/control/play_hover.png");
            } else
            {
                $j(this).attr("src", "img/slider/accordion/control/pause_hover.png");
            }
        },
        function ()
        {
            if(false == g_sliderAutoPlay)
            {
                $j(this).attr("src", "img/slider/accordion/control/play.png");
            } else
            {
                $j(this).attr("src", "img/slider/accordion/control/pause.png")
            }
            $j("#accorControlBtnDesc").stop().fadeTo(0, 0.0);  
        }
    );
    
    // bind function to accordion control panel backward button called then button is hovered by user
    $j("#accorBackBtn").hover(
        function ()
        {
           // set text and slow fade to 100%  
           $j("#accorControlBtnDesc").text("previous slide").fadeTo("slow", 1.0); 
           $j(this).attr("src", "img/slider/accordion/control/back_hover.png");
        },
        function ()
        {
            $j(this).attr("src", "img/slider/accordion/control/back.png");
            $j("#accorControlBtnDesc").stop().fadeTo(0, 0.0); 
        }
    );
    
    // bind function to accordion control panel backward button called then button is clicked
    $j("#accorBackBtn").click(
        function()
        {
            clearTimeout(g_sliderTimerAutoPlay);
            if(FORWARD == g_lastSlideMoveDirection)
            {
               g_actualSlideImage--;
            }
            g_lastSlideMoveDirection = BACKWARD;
            
            if(false == g_setBackwardBtnOnLast)
            {
                mouseOutAccorOnAll(null);
                g_actualSlideImage--;
                
                // if new loop is in progress we must stop it
                if(true == g_sliderNewLoop)
                {
                    g_sliderNewLoop = false;
                }
                
                if(0 > g_actualSlideImage)
                {
                    // if slider is on last slided div in this moment g_actualSlideImage 
                    // value is -2 becouse above we have two decreasing operations
                    if(g_actualSlideImage == -2)
                    {
                        // so in this situation we must set slider on the next to last slided div
                        g_actualSlideImage = g_slidedDivs.length - 2;
                    } else
                    {
                        // in normal situation we move one slide back
                        g_actualSlideImage = g_slidedDivs.length - 1;
                    }
                }
                mouseOnAccor(g_slidedDivs[g_actualSlideImage].name);
            } else
            {
                mouseOutAccorOnAll(null);
                g_actualSlideImage = g_slidedDivs.length - 1;                                               
                mouseOnAccor(g_slidedDivs[g_actualSlideImage].name);
                g_setBackwardBtnOnLast = false;               
            }
            // fire up slider
            if(true == g_sliderAutoPlay)
            {
                g_sliderTimerAutoPlay = setTimeout(accordionPlay, g_sliderTimerInterval); 
            }
        }
    );     
    
    // bind function to accordion control panel forward button called then button is hovered by user
    $j("#accorForwardBtn").hover(
        function ()
        {
            // set text and slow fade to 100% 
            $j("#accorControlBtnDesc").text("next slide").fadeTo("slow", 1.0);
            $j(this).attr("src", "img/slider/accordion/control/forward_hover.png");
        },
        function ()
        {
            $j(this).attr("src", "img/slider/accordion/control/forward.png");
            $j("#accorControlBtnDesc").stop().fadeTo(0, 0.0);   
        }
    ); 
    
    // bind function to accordion control panel forward button called then button is clicked
    $j("#accorForwardBtn").click(
        function()
        {
            clearTimeout(g_sliderTimerAutoPlay);
            g_sliderNewLoop = false; 
            
            if(BACKWARD == g_lastSlideMoveDirection)
            {
                 g_actualSlideImage++;
                 if(g_actualSlideImage >= g_slidedDivs.length)
                 {
                    g_actualSlideImage = 0;
                    g_sliderNewLoop = true; 
                 }                  
            }
            g_lastSlideMoveDirection = FORWARD;
				$j("div#ImageDescrip").text(ImageDescriptions[0]);  
            mouseOutAccorOnAll(null);
            mouseOnAccor(g_slidedDivs[g_actualSlideImage].name);
    
            g_actualSlideImage++;
            if(g_actualSlideImage >= g_slidedDivs.length)
            {
                g_actualSlideImage = 0;
                g_sliderNewLoop = true;
            }
            // fire up slider
            if(true == g_sliderAutoPlay)
            {
                g_sliderTimerAutoPlay = setTimeout(accordionPlay, g_sliderTimerInterval); 
            }
        }
    );       

} // end of function setupAccordionControlPanel 

/***************************************
    ADDITIONAL CUFON FONT REPLACEMENT
****************************************/

function setupAdditionalCufonFontReplacement()
{
    Cufon.replace(".tabHeader", {fontWeight: 400});
    Cufon.replace(".tabsHeader", {fontWeight: 700});
     
    Cufon.replace(".accordionDescHeader", {fontWeight: 700});
    Cufon.replace("#servicesProductsHeader", {fontWeight: 300});
    Cufon.replace("#latestNewsHeader", {fontWeight: 300});
} // end of function setupAddCufonFontReplacement

/***************************************
    ACTION FOR LATEST NEWS FIELDS
****************************************/

function setupLatestNews()
{
    $j(".lastNews").hover(
        function()
        {
            $j(this).find(".lastNewsTitle").css("color", "#222");
        },        
        function()
        {
            $j(this).find(".lastNewsTitle").css("color", "#444");
        }
    );
} // end of function setupLatestNews

/*********************************************
    ASYNCHRONOUS IMAGE LOADING FOR ACCORDION
**********************************************/
g_loadedSlideCount = 0;
g_imgList = null;

function checkAccordionLoading()
{
    if(g_loadedSlideCount < g_imgList.length)
    {  
       setupLoadingAsynchronousImagesForAccordion();
    }
} // end of function checkAccordionLoading 

function setupLoadingAsynchronousImagesForAccordion()
{
    if(g_imgList == null)
    {
        // get list of all slided divs in slider
        var imgDivsList = $j("#accordionContainer .asyncImgLoadAccordion");
        // collect information on every div in to an global array
         g_imgList = new Array;
         var firstDiv = $j("#accordionContainer .accordionImgDiv:first");
         var imgDiv = $j(firstDiv).find(".asyncImgLoadAccordion");
         for(var i = 0; i < imgDivsList.length; i++)
         {
            var obj = new Object(); 
            obj.id = "#" + $j(imgDiv).attr('id'); 
            g_imgList.push(obj); 

            firstDiv = $j(firstDiv).next(".accordionImgDiv");    
            imgDiv = $j(firstDiv).find(".asyncImgLoadAccordion");
         }
    }
        
    if(g_loadedSlideCount < g_imgList.length)
    {  
       g_loadedSlideCount++;
       loadAccordionImg(g_imgList[g_loadedSlideCount-1].id, g_loadedSlideCount-1);
       setTimeout(setupLoadingAsynchronousImagesForAccordion, 500);
    }
        
        function loadAccordionImg(id, _index)
        {   
            // save handle to loader - caintainer which we gona insert loaded image    
            var loader = $j(id);
            // get image path from loader title attribute
			var imageInformation = loader.attr('title').split('|');
            var imagePath = imageInformation[0];
			ImageDescriptions[_index] = imageInformation[1];
            // create new image object
            var img = new Image();
            // set opacity for image to maximum
            // value 0.0 means completly transparent
            $j(img).css("opacity", "0.0")
            // nex we set function wchig goba be caled then
            // image load is finished  
                .load(
                    function() 
                    {
                        // insert loaded image to loader object 
                        // and remove unnecessary title attribute
                        loader.append(this).removeAttr('title');
                        // for inserted image we set margin to zero
                        // opacity to max and fire up 500ms opacity animation 
                        loader.css("background-image", "none");
                        $j(this)
                            .css("margin", "0px")
                            .css("opacity", "0.0");
                        
                        if(_index == g_hoveredSlideIndex)
                        {
                            $j(this).animate({opacity: 1.0}, 500);
                        }                     
                            
                    }
                // set new value for attribute src - this means: load image from imagePath    
                ).attr('src', imagePath);                        
        } 
        
           
} // end of function setupLoadingAsynchronousImagesForAccordion 

var g_loadedStripCount = 0;
var g_stripList = null;
function setupLoadingAsyncSlideStripImages()
{
    if(g_stripList == null)
    {
        // get list of all slided divs in slider
        var imgDivsList = $j("#accordionContainer .slideStrip");
        // collect information on every div in to an global array
         g_stripList = new Array;
         var firstDiv = $j("#accordionContainer .accordionImgDiv:first");
         var imgDiv = $j(firstDiv).find(".slideStrip");
         for(var i = 0; i < imgDivsList.length; i++)
         {
            var obj = new Object(); 
            obj.id = imgDiv; 
            g_stripList.push(obj); 

            firstDiv = $j(firstDiv).next(".accordionImgDiv");    
            imgDiv = $j(firstDiv).find(".slideStrip");
         }
    }
        
    if(g_loadedStripCount < g_stripList.length)
    {  
       
       loadStripImg(g_stripList[g_loadedStripCount].id, g_loadedStripCount);
       
    } else
    {
        clearTimeout(g_sliderTimerAutoPlay);
        g_sliderTimerAutoPlay = setTimeout(accordionPlay, g_sliderTimerInterval);
    }
        
        function loadStripImg(id, _index)
        {   
            // save handle to loader - caintainer which we gona insert loaded image    
            var loader = $j(id);
            // get image path from loader title attribute
			var imageInformation = loader.attr('title').split('|');
            var imagePath = imageInformation[0];
			var imageDesc = imageInformation[1];
            // create new image object
            var img = new Image();
            // set opacity for image to maximum
            // value 0.0 means completly transparent
            $j(img).css("opacity", "0.0")
            // nex we set function wchig goba be caled then
            // image load is finished  
                .load(
                    function() 
                    {
                        // insert loaded image to loader object 
                        // and remove unnecessary title attribute
                        loader.append(this).removeAttr('title');
                        // for inserted image we set margin to zero
                        // opacity to max and fire up 500ms opacity animation 
                        g_loadedStripCount++;
                        $j(this)
                            .css("margin", "0px")
                            .css("opacity", "0.0")
                            .animate({opacity: 1.0}, 400, function()
                            {
                                loader.css("background-image", "none"); 
                                setTimeout(setupLoadingAsyncSlideStripImages, 20); 
                            });                            
                    }
                // set new value for attribute src - this means: load image from imagePath    
                ).attr('src', imagePath);                        
        } 
} // end of function setupLoadingAsyncSlideStripImages 

/***************************************
    CODE FOR TABS
****************************************/
// handle to selected tab
var g_selectedTab = null;
var g_tabsBtnColor = "#65B31C";

function setupTabs()
{
    // selecting all tab switch on
    var tabs = $j(".tabsBtn");

    // for every tab we doing the same things
    for(var i = 0; i < tabs.length; i++)
    {
        // veriable for object with class tabsDefaultTab
        var defaultTab = null;
        // lets find default tab element
        defaultTab = $j(tabs[i]).find(".tabsDefaultTab");
        // if currently analysed tab contains the default tab element 
        if(0 != defaultTab.length)
        {
            var tabSource = $j(tabs[i]).find(".tabsSource").text();
            $j(tabSource).css("visibility", "visible").css("top", 0);
            $j(tabs[i]).each(function(){g_selectedTab = this;});
            $j(tabs[i]).css("background-color", g_tabsBtnColor);
            break;
        }
    } // for


    $j(".tabsBtn").click(
        function()
        {
             if(g_selectedTab == this)
             {
                return;
             } 
             if(g_selectedTab != null)
             {
                $j(g_selectedTab).css("background-color", "#000");
             }
             var oldSource = $j(g_selectedTab).find(".tabsSource").text();
             g_selectedTab = this;
             $j(this).css("background-color", g_tabsBtnColor);
             
             $j(oldSource).animate({opacity: 0.0}, 200, 
                function()
                {
                    $j(this).css("visibility", "hidden");
                    var tabSource = $j(g_selectedTab).find(".tabsSource").text();
                    $j(tabSource)
                        .css("opacity", 0.0)
                        .css("top", 0)
                        .css("visibility", "visible")
                        .animate({opacity: 1.0}, 400); 
                }
             );
        }
    );

    $j(".tabsBtn").hover(
        function()
        {
            if(this != g_selectedTab)
            {
                $j(this).css("background-color", g_tabsBtnColor);
            }
        },
        function()
        {
            if(this != g_selectedTab)
            {
                $j(this).css("background-color", "#000000");
            }
        }
    );
} // end of function setupTabs  
       

       
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
        setupLinkLightBox();
        setupSidebarTabsPanel();
        setupLoadingAsynchronousImages();
        setupToolTipImagePreview();
        setupTextLabelImagePreview();
        setupFaderMoverSlider();   
        // this file
        setupAdditionalCufonFontReplacement();
        setupNewsBar();
        setupTabs();
        if($j("#accordionContainer").length > 0)
        {
            // call this functions only if accordion is included
            setupLoadingAsynchronousImagesForAccordion();
            setupLoadingAsyncSlideStripImages();            
            setupAccordionImageSlider();
            setupAccordionControlPanel();        
            setupAccordionAutoPlay();
        }
        setupLatestNews();
    }
);
