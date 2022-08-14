 (function (global, factory) {
            typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
                typeof define === 'function' && define.amd ? define(factory) :
                    (global.mergeImages = factory());
        }(this, (function () {
            'use strict';

            // Defaults
            var defaultOptions = {
                format: 'image/png',
                quality: 0.92,
                width: undefined,
                height: undefined,
                Canvas: undefined,
                crossOrigin: undefined
            };

            // Return Promise
            var mergeImages = function (sources, options) {
                if (sources === void 0) sources = [];
                if (options === void 0) options = {};

                return new Promise(function (resolve) {
                    options = Object.assign({}, defaultOptions, options);

                    var canvas = options.Canvas ? new options.Canvas() : window.document.createElement('canvas');

                    var Image = options.Image || window.Image;

                    var images = sources.map(function (source) {
                        return new Promise(function (resolve, reject) {

                            // Convert sources to objects
                            if (source.constructor.name !== 'Object') {
                                source = { src: source };
                            }

                            // Resolve source and img when loaded
                            var img = new Image();
                            img.crossOrigin = options.crossOrigin;
                            img.onerror = function () { return reject(new Error('Couldn\'t load image')); };
                            img.onload = function () { return resolve(Object.assign({}, source, { img: img })); };
                            img.src = source.src;
                        });
                    });

                    // Get canvas context
                    var ctx = canvas.getContext('2d');

                    // When sources have loaded
                    resolve(Promise.all(images)
                        .then(function (images) {

                            let width = 300;
                            let height = 300;

                            canvas.width = width;
                            canvas.height = height;

                            // Draw images to canvas
                            images.forEach(function (image) {
                                ctx.globalAlpha = image.opacity ? image.opacity : 1;
                                return ctx.drawImage(image.img, image.x || 0, image.y || 0, image.width || width, image.height || height);
                            });

                            // Resolve all other data URIs sync
                            return canvas.toDataURL(options.format, options.quality);
                        }));
                });
            };

            return mergeImages;
        })));
