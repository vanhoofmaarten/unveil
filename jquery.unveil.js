/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

;(function($) {

    $.fn.unveil = function(options, callback) {

        var settings = $.extend({
                threshold : 0,
                attribute : "data-src",
                animation : "Animation--fade",
                animationActivate : "is-in",
            }, options);

        var images = this,
            $window = $(window),
            loaded;

        this.one("unveil", function() {
            tag = this.tagName;

            if (tag == "PICTURE"){

                var elements = [];
                    sourceElement = this.getElementsByTagName("SOURCE"),
                    imageElement =  this.getElementsByTagName("IMG");

                for (var i = 0; i < sourceElement.length; i++){
                    var source = sourceElement[i].getAttribute(settings.attribute);

                    if (source) {
                        sourceElement[i].setAttribute("srcset", source);
                        if (typeof callback === "function") callback.call(sourceElement[i]);
                    }
                }

                for (var i = 0; i < imageElement.length; i++){
                    var source = imageElement[i].getAttribute(settings.attribute);

                    if (source) {
                        imageElement[i].setAttribute("srcset", source);
                        if (typeof callback === "function") callback.call(imageElement[i]);
                    }
                }

            } else if (tag == "IMG") {
                var source = this.getAttribute(settings.attribute);

                if (source) {
                    this.setAttribute("src", source);
                    if (typeof callback === "function") callback.call(this);
                }
            }

            this.classList.add(settings.animationActivate);
        });

        function unveil() {
            var inview = images.filter(function() {
                var $e = $(this);
                if ($e.is(":hidden")) return;

                $e.addClass(settings.animation);

                var windowTop = $window.scrollTop(),
                    windowBottom = windowTop + $window.height(),
                    elementTop = $e.offset().top,
                    elementBottom = elementTop + $e.height();

                return elementBottom >= windowTop - settings.threshold && elementTop <= windowBottom + settings.threshold;
            });

            loaded = inview.trigger("unveil");
            images = images.not(loaded);
        }

        $window.on("scroll.unveil resize.unveil lookup.unveil", unveil);

        unveil();

        return this;

    };

})(window.jQuery);
