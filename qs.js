// HTML string for quick links section
var quickLinksHTML = '<a target="_blank" href="{0}" class="QuickLink01">'+
		'<span id="Link-{1}"><img src="" />'+			
		'</span>'+
		'<span>{2}</span>'+
	'</a>';
// HTML string for announcements section
var announcementsString = '<li>'+
              '<div class="clearfix">'+
                '<div class="Ssliderbox01" id="Ann-{0}"><img src="" alt=""/></div>'+
                '<div class="Ssliderbox02">'+
                  '<div class="Sstitle01"> <span></span><span> {2}</span> </div>'+
                  '<div class="ftcText01">'+
                    '<p>{3}</p>'+
                  '</div>'+
                 // '<div class="ftcLinkbox01" style="text-align:right;"><a href="{4}">Read More</a></div>'+
                '</div>'+
              '</div>'+
            '</li>';
// HTML string for Who we are section
/*var whoWeAreString = '<li>'+
              '<div class="teamBox01"><a href="{0}"> <span>'+
                '<div class="teamimgBox" ID="wwd-{1}"><img src="{2}" alt=""/></div>'+
                '</span> <span> <span>{3}</span><span>{4}</span></span> </a> </div>'+
            '</li>';*/
            
var whoWeAreString = '<li>'+
              '<div class="teamBox01"><a href="{0}" target="_blank"> <span>'+
                '<div class="teamimgBox" ID="{2}"><img src="https://favortechconsulting.sharepoint.com/SiteAssets/WhoWeAreImages/{1}" alt=""/></div>'+
                '</span> <span> <span>{2}</span><span>{3}</span></span> </a> </div>'+
            '</li>';
// Implementing String.format utility.
(function () {
   	// First, checks if it isn't implemented yet.
	if (!String.prototype.format) {
	  String.prototype.format = function() {
	    var args = arguments;
	    return this.replace(/{(\d+)}/g, function(match, number) { 
	      return typeof args[number] != 'undefined'
	        ? args[number]
	        : match
	      ;
	    });
	  };
	}
})();
function getItems(url){
    return $.ajax({       
        url: url,        
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
        }
    });
}
function getItemsFail(err){
    // error callback
    console.log(JSON.stringify(err));
}
$(document).ready(function(){
	//Get user's personal MySite url
	SP.SOD.executeFunc('sp.js', 'SP.ClientContext', GetSliderImages);	
	// Getting the slider images items.
	//GetSliderImages();
	// Getting Announcement Items.
	GetAnnouncements();
	// Getting Text Header
	GetTextHeader();
	// Getting Quick Links
	GetQuickLinks();	
	// Getting users from who we are list
	/////GetWhoWeAre();	
	GetWhoWeAreLocal();
//	SyntaxHighlighter.all();
	$('#slider01').flexslider({
	    animation: "slide",
	    start: function(slider){
	      $('body').removeClass('loading');
	    }
	});
	
	
	$("body").on("click", "#readMore", function(event){ 
				event.preventDefault();		 				 
				var	bodyId = $(this).attr("ref");
				$.colorbox({html:'<div class="modalLightWrapper">' + getAnnouncementsModalArray[bodyId] + '</div>' ,  width:"50%", height:"50%",arrowKey: false});
	});

	
});
function GetTextHeader(){
	$('#ftcWebPart2').load("https://favortechconsulting.sharepoint.com/QS/SiteAssets/QSText.html");
}
function GetSliderImages(){
	var url = _spPageContextInfo.webAbsoluteUrl +  "/_api/web/lists/GetBytitle('Image Slider')/Items?$select=FileRef";
	getItems(url).then(function(data){
		if(data.d.results.length > 0){
			var result = data.d.results; // set value of result variable 
	        if(result && result.length > 0){
	        	for(var i=0; i < result.length; i++){
	        		$("#slider01 .slides").append("<li> <img src=" + result[i].FileRef + " /> </li>");
	        	}
	        }
	    }
	}, getItemsFail);
}
function GetWhoWeAreX(){
	var url = _spPageContextInfo.webAbsoluteUrl +  "/_api/web/lists/GetBytitle('Who We Are')/Items?$expand=Member&$select=Url,ID,Member/Name,Member/FirstName,Member/LastName,Member/JobTitle,ID,FieldValuesAsHtml";
	getItems(url).then(function(data){
		if(data.d.results.length > 0){
			var result = data.d.results; // set value of result variable 
	        if(result && result.length > 0){
	        	for(var i=0; i < result.length; i++){
					var userAccount  = encodeURIComponent(result[i].Member.Name);
					var jobTitle = result[i].Member.JobTitle ? result[i].Member.JobTitle : "";
					var firstName = result[i].Member.FirstName ? result[i].Member.FirstName  : "";
					var lastName = result[i].Member.LastName ? result[i].Member.LastName:"";
					var name = firstName + ( lastName ? (", " + lastName) : "");
	        		var url = result[i].Url ? result[i].Url.Url : "#";
	        		var userObj = new Object();
	        		userObj = GetUserProfileProperties(userAccount);
	        		console.log(userObj);
	        		/*if(Object.keys(userObj).length > 0){
	        			var str = whoWeAreString.format(userObj.userUrl,result[i].ID, (userObj.userImage ? userObj.userImage : "") ,userObj.DisplayName,jobTitle); 
	        			$("#slider03 .slides").append(str);	
	        		}
	        		*/
	        		result[i].ID = userObj.userImage;
	        		url = userObj.userUrl;
	        		name = userObj.DisplayName;
	        		/*console.log(GetPublishingImage(result[i].ID,result[i].FieldValuesAsHtml,"wwd-"));*/
	        		var str = whoWeAreString.format(url,result[i].ID, name,jobTitle); 
	        		$("#slider03 .slides").append(str);	
	        		/*var image = userObj.userImage;*/
	        		/*result[i].ID = userObj.userImage;
	        		/*GetPublishingImage(result[i].ID,result[i].FieldValuesAsHtml,"wwd-");*/
	        		if(i == (result.length - 1)){
        			  $('#slider03').flexslider({
					    animation: "slide",
					    animationLoop:false,
					    slideshow:false,
					    itemWidth: 135,
					    itemMargin: 2,
					    minItems: 1,
					    maxItems: 8
					  });
	        		}
        		}
	        }
	    }
	}, getItemsFail);
}


function GetWhoWeAreLocal(){

	
	var url = _spPageContextInfo.webAbsoluteUrl +  "/_api/web/lists/GetBytitle('Who We Are')/Items";
	getItems(url).then(function(data){
		if(data.d.results.length > 0){
			var result = data.d.results; // set value of result variable 
	        if(result && result.length > 0){
	        	for(var i=0; i < result.length; i++){
	        		var fullName = result[i].FullName ? result[i].FullName : "";
					var jobTitle = result[i].JobTitle ? result[i].JobTitle : "";
	        		var profileURL  = result[i].ProfileURL  ? result[i].ProfileURL  : "";
	        		var image = result[i].Image ? result[i].Image : "";
	        		var str = whoWeAreString.format(profileURL,image, fullName, jobTitle); 
	        		$("#slider03 .slides").append(str);	
	        		if(i == (result.length - 1)){
        			  $('#slider03').flexslider({
					    animation: "slide",
					    animationLoop:false,
					    slideshow:false,
					    itemWidth: 135,
					    itemMargin: 2,
					    minItems: 1,
					    maxItems: 8
					  });
	        		}
        		}
	        }
	    }
	}, getItemsFail);
	
}


function GetQuickLinks(){
	var url = _spPageContextInfo.webAbsoluteUrl +  "/_api/web/lists/GetBytitle('Quick Links')/Items?$select=Title,ID,FieldValuesAsHtml,LinkUrl&$OrderBy=Order&$top=10";
	getItems(url).then(function(data){
		if(data.d.results.length > 0){
			var result = data.d.results; // set value of result variable 
	        if(result && result.length > 0){
	        	for(var i=0; i < result.length; i++){	        		
	        		var str = quickLinksHTML.format(result[i].LinkUrl.Url,result[i].ID,result[i].Title);	        
	        		$(".quickLcontentbox").append(str);
	        		GetPublishingImage(result[i].ID,result[i].FieldValuesAsHtml,"Link-");	        		
	     	    }
	        }
	    }
	}, getItemsFail);
}

var getAnnouncementsModalArray = [];
function GetAnnouncements(){
	var url = _spPageContextInfo.webAbsoluteUrl +  "/_api/web/lists/GetBytitle('FTC Announcements')/Items?$select=Body,Title,ID,Expires,FieldValuesAsHtml&$filter=Expires ge datetime'"+  new Date().toISOString() +"'&$OrderBy=Expires&$top=10";
	getItems(url).then(function(data){
		if(data.d.results.length > 0){
			var result = data.d.results; // set value of result variable 
	        if(result && result.length > 0){
	        	for(var i=0; i < result.length; i++){
	        	    // Display form URL of the announcemnet
			        var redirectUrl = _spPageContextInfo.webAbsoluteUrl + "/Lists/FTC%20Announcements/DispForm.aspx?ID=" + result[i].ID +"&Source=" +_spPageContextInfo.webAbsoluteUrl;
			        // Get body in variable and truncate if character lenght is > 500
			        var bodyText = $(result[i].Body).text();	
			        getAnnouncementsModalArray.push(bodyText)		        
			        if(bodyText.length > 550){
			        	bodyText = bodyText.substr(0,550) + '... <div class="ftcLinkbox01" style="text-align:right;"><a  id="readMore" ref="'+ i +'" href="'+ redirectUrl +'">Read More</a></div>';
			        }	        // Building the HTML string to accomodate slider of the Announcement
			        var str = announcementsString.format(result[i].ID,result[i].Expires.split("T")[0],result[i].Title,bodyText,redirectUrl);
			        
			        $("#slider02 .slides").append(str);
	        		GetPublishingImage(result[i].ID,result[i].FieldValuesAsHtml, "Ann-");
	        		
	        		if(i == (result.length - 1)){
	        			$('#slider02').flexslider({
					        animation: "slide",
					        animationLoop:true,
					        slideshowSpeed: 10000,
					        /*controlNav: true,
					        start: function(slider){
					          $('body').removeClass('loading');
					        }
					        */
				      	});
	        		}
	        	} // for
	        	
	        }
	    }
	}, getItemsFail);
}

function GetPublishingImage(itemID, fldVlAsHtml, idToAppend){
	getItems(fldVlAsHtml.__deferred.uri+"?$select=LinkImage").then(function(data){
		if(data.d){
			var result = data.d; 
			// Setting the HTML image SRC attribute
			
			//var imageSRC = ( result.LinkImage.length > 0 ? $(result.LinkImage).attr("src") : "/_layouts/15/userphoto.aspx");

			var imageSRC = ( result.LinkImage.length > 0 ? $(result.LinkImage).attr("src") : "https://favortechconsulting.sharepoint.com/SiteAssets/announcements 500x500.jpg");
		
	// Appending to respective DIV
			$("#" + idToAppend + itemID + " img").attr("src",imageSRC);
	    }
	}, getItemsFail);
}
function GetUserProfileProperties(userAccount) {
	var retObj = new Object();
    //Get the current user's account information
    $.ajax({
	  url: _spPageContextInfo.webAbsoluteUrl + "/_api/sp.userprofiles.peoplemanager/getpropertiesfor(@v)?@v='" + userAccount + "'",
	  type: "GET",
	  async: false,
	  headers: { "accept": "application/json;odata=verbose" },
	  success: function (data) {            
            retObj.DisplayName = data.d.DisplayName;
            retObj.userImage = data.d.PictureUrl;
            retObj.userUrl = data.d.UserUrl;            

        },
	  error:  function (err) {
            console.error(JSON.stringify(err));
        }
	});
	return retObj;
}
