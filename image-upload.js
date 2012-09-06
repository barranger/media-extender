function ImageUploader(imgurKey) {
	this.imgurKey = imgurKey;
}

ImageUploader.prototype = {
	setup: function() {
		var self = this;
        $('button[data-submit-post-button]').parent().prepend('<button class="btn btn-primary" id="img-upload">Add Image</button><div class="hide"><input name="upload" type="file" id="fileinput"/></div>');
        $('#img-upload').click(function() {
            $('#fileinput').trigger('click'); 
        });
      
      	$('#fileinput').live('change', function(e) {
            var file = this.files[0];
            
            window.webkitRequestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
              (function(f) {
                fs.root.getFile(f.name, {create: false}, 
                    function(fe) {
                        fe.remove(function() {
                            console.log('deleted')
                            self.loadFileToStorage(fs, f);
                        });
                    },
                    function(error) {
                        if( error.code === 1) {
                            self.loadFileToStorage(fs, f);
                        }
                        else {
                            self.errorHandler(error);
                        }
                    });
	              })(file);
	        }, self.errorHandler);
        });
	},

	upload: function(file) {
       if (!file || !file.type.match(/image.*/)) return;

       var fd = new FormData();
       fd.append("image", file); // Append the file
       fd.append("key", this.imgurKey); // Get your own key: http://api.imgur.com/

       var xhr = new XMLHttpRequest();
       xhr.open("POST", "http://api.imgur.com/2/upload.json"); 
       xhr.onload = function() {
          var obj = JSON.parse(xhr.responseText);
            console.log(obj);
          $('textarea[name="post"]').text(obj.upload.links.imgur_page);
       }
       
       xhr.send(fd);
    },

    loadFileToStorage: function(fs, f) {
    	var self = this;
        fs.root.getFile(f.name, {create: true, exclusive: true}, function(fileEntry) {
                  fileEntry.createWriter(function(fileWriter) {
                    fileWriter.onwriteend = function(e) {
                        console.log('Write completed.');
                        var img = new Image();
                            img.src = fileEntry.toURL();
                            $('.newpost').append($('<div class="inserted-image" style="margin-top: 12px;"></div>')).append(img);
                            self.upload(f);
                        };
            
                    fileWriter.write(f); // Note: write() can take a File or Blob object.
                    
                  }, self.errorHandler);
                }, self.errorHandler);
    },

    errorHandler: function(e) {
	  var msg = '';

	  switch (e.code) {
	    case FileError.QUOTA_EXCEEDED_ERR:
	      msg = 'QUOTA_EXCEEDED_ERR';
	      break;
	    case FileError.NOT_FOUND_ERR:
	      msg = 'NOT_FOUND_ERR';
	      break;
	    case FileError.SECURITY_ERR:
	      msg = 'SECURITY_ERR';
	      break;
	    case FileError.INVALID_MODIFICATION_ERR:
	      msg = 'INVALID_MODIFICATION_ERR';
	      break;
	    case FileError.INVALID_STATE_ERR:
	      msg = 'INVALID_STATE_ERR';
	      break;
	    default:
	      msg = 'Unknown Error';
	      break;
	  };

	  console.log('Error: ' + msg);
	}

}