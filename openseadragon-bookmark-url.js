// OpenSeadragon Bookmark URL plugin 0.0.1

(function() {

    $ = window.OpenSeadragon;

    if (!$) {
        $ = require('openseadragon');
        if (!$) {
            throw new Error('OpenSeadragon is missing.');
        }
    }

    // ----------
    $.Viewer.prototype.bookmarkUrl = function() {
        var self = this;

        var changing = false;

        var parseHash = function() {
            var params = {};
            var hash = window.location.hash.replace(/^#/, '');
            if (hash) {
                var parts = hash.split('&');
                parts.forEach(function(part) {
                    var subparts = part.split('=');
                    var key = subparts[0];
                    var value = parseFloat(subparts[1]);
                    if (!key || isNaN(value)) {
                        console.error('bad hash param', part);
                    } else {
                        params[key] = value;
                    }
                });
            }

            return params;
        };

        var updateUrl = function() {
            var zoom = self.viewport.getZoom();
            var pan = self.viewport.getCenter();
            changing = true;
            window.location.hash = 'zoom=' + zoom + '&x=' + pan.x + '&y=' + pan.y;
        };

        var useParams = function(params) {
            if (params.zoom !== undefined) {
                self.viewport.zoomTo(params.zoom, null, true);
            }

            if (params.x !== undefined && params.y !== undefined) {
                self.viewport.panTo(new $.Point(params.x, params.y), true);
            }
        };

        var params = parseHash();

        if (this.world.getItemCount() === 0) {
            this.addOnceHandler('open', function() {
                useParams(params);
            });
        } else {
            useParams(params);
        }

        this.addHandler('zoom', updateUrl);
        this.addHandler('pan', updateUrl);

        window.addEventListener('hashchange', function() {
            if (changing) {
                changing = false;
            } else {
                useParams(parseHash());
            }
        }, false);
    };

})();