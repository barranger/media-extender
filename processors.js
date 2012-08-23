var processorSetup = function($, processors) {
	//Adding General Image processor
	processors.push(function(url){
		var directImageRegex =  /(https?:\/\/.*?\.(?:png|jpe?g|gif))/i;
		var imgHtml = "<div class='inserted-image' style='margin-top: 12px;'><a href='~~~' target='_blank'><img src='~~~' style='max-width: 435px; max-height: 375px;' /></a></div>";
		if( url.search(directImageRegex) != -1 ) {
			return imgHtml.replace(/~~~/g, url.match(directImageRegex)[0]);
		}
	});

	//Adding Youtube embeder processor
	processors.push(function(url) {
		var regularYT = /https?:\/\/www.youtube.com\/watch.*?(\?|\&)v=.*/i;
		var shortYT = /https?:\/\/youtu.be\/.*/i;
		var vidHtml = '<div class="inserted-video" style="margin-top: 12px;"><object width="425" height="350"><param name="movie" value="http://youtube.com/v/~~~"><embed src="https://youtube.com/v/~~~" type="application/x-shockwave-flash" width="425" height="350"></object></div>'
		
		if(url.search(regularYT) != -1 ) {
			var vidId = url.substring(url.indexOf("v=") + 2);
			return vidHtml.replace(/~~~/g, vidId);
		}

		if(url.search(shortYT) != -1 ) {
			var vidId = url.substring(url.lastIndexOf("/") + 1);
			return vidHtml.replace(/~~~/g, vidId);
		}
	});

	//Adding Instagram
	processors.push(function(url){
		var imgHtml = "<div class='inserted-image' style='margin-top: 12px;'><a href='~~~' target='_blank'><img src='https://instagr.am/p/~ID~media/' style='max-width: 435px; max-height: 375px;' /></a></div>";
		var regularIG = /https?:\/\/(instagram.com|instagr.am)\/p\/.*/i;

		if(url.search(regularIG) != -1 ) {
			var igId = url.substring(url.indexOf("/p/") + 3 );
			return imgHtml.replace("~~~", url).replace("~ID~", igId);
		}
	});
};