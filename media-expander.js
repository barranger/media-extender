(function ($) {

	var processors = new Array();
  var imageUploader = new ImageUploader("fc284497622fb0e57da75597b75c49bf");

 	function processPost(post_container) {
        $(post_container).find(".body .post-text").each(function() {
            var post = $(this);
            var photos = $.map($(this).find("a[href]"), function(atag) {
            	url = $(atag).attr("href");
            	for (var i = processors.length - 1; i >= 0; i--) {
                    processors[i](url, function(newElement){
                        post.append(newElement);
                    });
            	};
            });

        });
    }

    var observer = new window.WebKitMutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            $(mutation.addedNodes).each(function() {
                if ($(this).is(".post-container")) {
                    processPost($(this));
                } else {
                    $(this).find(".post-container").each(function() {
                        processPost($(this));
                    });
                }
            });
        });
    });

    var config = { 
    	subtree: true, 
    	childList: true, 
    	characterData: false, 
    	attributes: false 
    };

    $("body").each(function() {
        observer.observe(this, config);
    });

    processorSetup($,processors);
    $(".post-container").each(function() {
        processPost(this);
    });

    $(document).ready(function() {
      imageUploader.setup();
    });
    

    
})(jQuery);
