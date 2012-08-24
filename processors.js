var processorSetup = function($, processors) {
	//Adding General Image processor
	processors.push(function(url, callback){
		var directImageRegex =  /(https?:\/\/.*?\.(?:png|jpe?g|gif))/i;
		var imgHtml = "<div class='inserted-image' style='margin-top: 12px;'><a href='~~~' target='_blank'><img src='~~~' style='max-width: 435px; max-height: 375px;' /></a></div>";
		if( url.search(directImageRegex) != -1 ) {
			callback(imgHtml.replace(/~~~/g, url.match(directImageRegex)[0]));
		}
	});

	//Adding Youtube embeder processor
	processors.push(function(url, callback) {
		var regularYT = /https?:\/\/www.youtube.com\/watch.*?(\?|\&)v=.*/i;
		var shortYT = /https?:\/\/youtu.be\/.*/i;
		var vidHtml = '<div class="inserted-video" style="margin-top: 12px;"><object width="425" height="350"><param name="movie" value="http://youtube.com/v/~~~"><embed src="https://youtube.com/v/~~~" type="application/x-shockwave-flash" width="425" height="350"></object></div>'
		
		if(url.search(regularYT) != -1 ) {
			var vidId = url.substring(url.indexOf("v=") + 2);
			callback(vidHtml.replace(/~~~/g, vidId));
		}

		if(url.search(shortYT) != -1 ) {
			var vidId = url.substring(url.lastIndexOf("/") + 1);
			callback(vidHtml.replace(/~~~/g, vidId));
		}
	});

	//Adding Instagram
	processors.push(function(url, callback){
		var imgHtml = "<div class='inserted-image' style='margin-top: 12px;'><a href='~~~' target='_blank'><img src='https://instagr.am/p/~ID~media/' style='max-width: 435px; max-height: 375px;' /></a></div>";
		var regularIG = /https?:\/\/(instagram.com|instagr.am)\/p\/.*/i;

		if(url.search(regularIG) != -1 ) {
			var igId = url.substring(url.indexOf("/p/") + 3 );
			if(igId.substr(-1) !== "/") {
				igId = igId + "/";
			}
			callback(imgHtml.replace("~~~", url).replace("~ID~", igId));
		}
	});

	//Adding Imgur (where it doesn't contain .jpg)
	processors.push(function(url, callback){
		var imgHtml = "<div class='inserted-image' style='margin-top: 12px;'><a href='http://imgur.com/~~~' target='_blank'><img src='http://i.imgur.com/~~~.jpg' style='max-width: 435px; max-height: 375px;' /></a></div>";
		var regularIU = /https?:\/\/imgur.com\/.*/i;

		if(url.search(regularIU) != -1 ) {
			var iuId = url.substring(url.lastIndexOf("/") + 1 );
			callback(imgHtml.replace(/~~~/g, iuId));
		}
	});

	//Adding Tweet support
	processors.push(function(url, callback) {
		var tweetHtml = '<blockquote class="twitter-tweet"><p>Search API will now always return "real" Twitter user IDs. The with_twitter_user_id parameter is no longer necessary. An era has ended. ^TS</p>&mdash; Twitter API (@twitterapi) <a href="https://twitter.com/twitterapi/status/133640144317198338" data-datetime="2011-11-07T20:21:07+00:00">November 7, 2011</a></blockquote><script src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
		var regularTw = /https?:\/\/twitter.com\/.*?\/status/i;

		if(url.search(regularTw) != -1) {
			var tweetId = url.substring(url.lastIndexOf("/") + 1);
			console.log("found tweetId: " + tweetId );
			
			$.ajax({
		        url: "https://api.twitter.com/1/statuses/oembed.json?id=" + tweetId + "&align=center",
		        success: function(data) {
		        	console.log(data);
		            callback('<div style="margin-top: 12px;"">' + data.html + '</div>');
		        }
		    });
		}
	});


};