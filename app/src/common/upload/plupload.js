(function(){

'use strict';

angular.module('jDashboardFluxApp').directive('alkPlUpload', [
    '$log', "jquery", "plupload", 'permission', 'URL_SERVICE_MEDIA',
    function ($log, $, plupload, permission, URL_SERVICE_MEDIA) {
        return {
            scope: {
                uploadedFiles: '=',
                message: '=',
                total: '=',
                entity: '@',
                entityId: '@',
                mediaType: '@',
                multiSelection: '=',
                uploadError: '='
            },
            link: function (scope, iElement, iAttrs) {

                var entity = scope.entity;
                var entityId = scope.entityId;
                var mediaType = scope.mediaType;
                $log.debug('Uploader configured for entity / id / type: ' + entity + ' / ' + entityId + ' / ' + mediaType);

                scope.uploadError = null;

                $('#' + iAttrs.id + ' .browse-button').attr("id", iAttrs.id + "-browse-button");
                $('#' + iAttrs.id + ' .drop-target').attr("id", iAttrs.id + "-drop-target");

                var specifiedMultiSelection = typeof scope.multiSelection !== "undefined";
                var options = {
                    runtimes : 'html5,flash,html4',
                    browse_button : iAttrs.id + "-browse-button",
                    drop_element : iAttrs.id + "-drop-target",
                    multi_selection: specifiedMultiSelection ? (scope.multiSelection === "true") : true,
                    max_file_size : "100mb",
                    url : URL_SERVICE_MEDIA + '/media/v2/picture/upload',
                    flash_swf_url : 'bower_components/plupload/js/Moxie.swf',
                    filters : {
                      mime_types: [
                        {title : "Image files", extensions : "jpg,jpeg,png,gif"},
                        {title : "Flash files", extensions : "swf"}
                      ]
                    },
                    headers: {
                        // Add the Authentication Token
                        Authorization: 'Bearer ' + permission.getAccessToken()
                    },
                    multipart_params : {
                        "entity_type": entity,
                        "entity_id": entityId
                    }
                };

                var uploader = new plupload.Uploader(options);
                var rootId = iAttrs.id;

                uploader.bind('Error', function(up, err) {
                    scope.uploadError = err.message;
                    scope.$apply();
                    $log.error('Error :', err);
                });

                uploader.bind('Init', function(up, params) {
                    if (uploader.features.dragdrop) {
                        $log.debug("Drag & drop supported.");
                        $('#'+rootId+' .upload-debug').html("");
                        var target = $('#' + iAttrs.id + ' .drop-target');
                        target.ondragover = function(event) {
                            event.dataTransfer.dropEffect = "copy";
                        };
                        target.ondragenter = function() {
                            this.className = "dragover";
                        };
                        target.ondragleave = function() {
                            this.className = "";
                        };
                        target.ondrop = function() {
                            this.className = "";
                        };
                    }
                });
                uploader.init();

                // DIRTY
                var showImagePreview = function(file) {

                    var item = $( "<li></li>" );
                    //item.appendTo($('#ad-upload-drop-target'));
                    var image = $( new Image() ).appendTo( item ).css('width','100px').css('height', '100px');

                    // Create an instance of the mOxie Image object. This
                    // utility object provides several means of reading in
                    // and loading image data from various sources.
                    // --
                    // Wiki: https://github.com/moxiecode/moxie/wiki/Image
                    var preloader = new mOxie.Image();

                    // Define the onload BEFORE you execute the load()
                    // command as load() does not execute async.
                    preloader.onload = function() {

                        // This will scale the image (in memory) before it
                        // tries to render it. This just reduces the amount
                        // of Base64 data that needs to be rendered.
                        preloader.downsize(500, 500);

                        // Now that the image is preloaded, grab the Base64
                        // encoded data URL. This will show the image
                        // without making an Network request using the
                        // client-side file binary.
                        image.prop( "src", preloader.getAsDataURL() );

                        // NOTE: These previews "work" in the FLASH runtime.
                        // But, they look seriously junky-to-the-monkey.
                        // Looks like they are only using like 256 colors.

                    };

                    // Calling the .getSource() on the file will return an
                    // instance of mOxie.File, which is a unified file
                    // wrapper that can be used across the various runtimes.
                    // --
                    // Wiki: https://github.com/moxiecode/plupload/wiki/File
                    preloader.load(file.getSource());
                    return item;
                };

                // post init binding

                uploader.bind('FilesAdded', function(up, files) {
                    scope.uploadError = null;
                    scope.message = 'Transfert en cours...';
                    scope.$apply();
                    $log.debug("Files :", files);
                    scope.total = up.files.length;
                    up.start();
                });


                uploader.bind('FileUploaded', function(up, file, response) {
                    var item = showImagePreview(file);
                    var responseObj = $.parseJSON(response.response);
                    if (true || responseObj.status === "ok" && responseObj.data && scope.uploadedFiles) {
                        scope.$apply(function () {
                            scope.uploadedFiles.push({
                                data: responseObj.data,
                                file: item
                            });
                        });
                    }
                });

                // XXX fixme
                // the layout around the upload button can change : added rows in a table, a loaded image push the content, etc.
                // I can think of a better way to keep the invisible <input type="file"> right above the upload button.
                // Just binding it on the FileUploaded event is not enough : in my use case, the new file add an image and once
                // the image is loaded it takes more space and pushes the browse button (but not the invisible input).
                // A interval is a bit overkill but it works.
                var refreshInterval = setInterval(function () {
                    $log.debug("Refreshing plupload");
                    uploader.refresh();
                }, 500);

                scope.$on('$destroy', function() {
                    $log.debug("Stopping plupload refresh");
                    clearInterval(refreshInterval);
                });
            }
        };
        }
    ]);
})();
