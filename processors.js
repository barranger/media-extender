var processorSetup = function($, processors) {
	//Adding General Image processor
	processors.push(function(url, callback){
		var reg  =  /(https?:\/\/.*?\.(?:png|jpe?g|gif))/i;
		var html = "<div class='inserted-image' style='margin-top: 12px;'><a href='{{imgUrl}}' target='_blank'><img src='{{imgUrl}}' style='max-width: 435px; max-height: 375px;' /></a></div>";
		if( url.search(reg) != -1 ) {
			callback( Mustache.render(html, { imgUrl: url.match(reg)[0] }));
		}
	});

	//Adding Youtube embeder processor
	processors.push(function(url, callback) {
		var reg = /https?:\/\/www.youtube.com\/watch.*?(\?|\&)v=.*/i;
		var sreg = /https?:\/\/youtu.be\/.*/i;
		var html = '<div class="inserted-video" style="margin-top: 12px;"><object width="425" height="350"><param name="movie" value="http://youtube.com/v/{{vidId}}"><embed src="https://youtube.com/v/{{vidId}}" type="application/x-shockwave-flash" width="425" height="350"></object></div>'
		var vidId = null;

		if(url.search(reg) != -1 )
			vidId = url.substring(url.indexOf("v=") + 2);

		if(url.search(sreg) != -1 ) 
			vidId = url.substring(url.lastIndexOf("/") + 1);

		if(vidId)
			callback(Mustache.render(html, {vidId:vidId}));

	});

	//Adding Instagram
	processors.push(function(url, callback){
		var html = "<div class='inserted-image' style='margin-top: 12px;'><a href='{{url}}' target='_blank'><img src='https://instagr.am/p/{{vidId}}media/' style='max-width: 435px; max-height: 375px;' /></a></div>";
		var reg  = /https?:\/\/(instagram.com|instagr.am)\/p\/.*/i;

		if(url.search(reg) != -1 ) {
			var igId = url.substring(url.indexOf("/p/") + 3 );
			if(igId.substr(-1) !== "/") {
				igId = igId + "/";
			}
			callback(Mustache.render(html, {url:url,vidId:igId }));
		}
	});

	//Adding Imgur (where it doesn't contain .jpg)
	processors.push(function(url, callback){
		var html = "<div class='inserted-image' style='margin-top: 12px;'><a href='http://imgur.com/{{id}}' target='_blank'><img src='http://i.imgur.com/{{id}}.jpg' style='max-width: 435px; max-height: 375px;' /></a></div>";
		var reg  = /https?:\/\/imgur.com\/.*/i;

		if(url.search(reg) != -1 ) {
			var iuId = url.substring(url.lastIndexOf("/") + 1 );
			callback(Mustache.render(html, {id: iuId }));
		}
	});

	//Adding Tweet support
	processors.push(function(url, callback) {
		var html = "<div style='margin-top: 12px;'>{{{html}}}</div>";
		var reg = /https?:\/\/twitter.com\/.*?\/status/i;

		if(url.search(reg) != -1) {
			var tweetId = url.substring(url.lastIndexOf("/") + 1);
			
			$.ajax({
		        url: "https://api.twitter.com/1/statuses/oembed.json?id=" + tweetId + "&align=center",
		        success: function(data) {
		            callback(Mustache.render(html, data));
		        }
		    });
		}
	});

	//Adding Vimeo support
	processors.push(function(url, callback) {
		var html = "<div style='margin-top: 12px;'>{{{html}}}</div>";
		var reg = /https?:\/\/vimeo.com\//i;

		if(url.search(reg) != -1) {
			$.ajax({
		        url: "https://vimeo.com/api/oembed.json?maxwidth=435&url=" + url,
		        success: function(data) {
		            callback(Mustache.render(html, data));
		        }
		    });
		}
	});


};