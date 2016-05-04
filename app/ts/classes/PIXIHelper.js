System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var PIXIHelper;
    return {
        setters:[],
        execute: function() {
            PIXIHelper = (function () {
                function PIXIHelper() {
                }
                PIXIHelper.createPIXIRenderer = function (parentEl, width, height) {
                    var renderer = PIXI.autoDetectRenderer(width, height);
                    parentEl.appendChild(renderer.view);
                    return renderer;
                };
                PIXIHelper.loadStage = function (renderer) {
                    //create the stage
                    var stage = new PIXI.Container();
                    animate();
                    function animate() {
                        // render the stage
                        renderer.render(stage);
                        requestAnimationFrame(animate);
                    }
                    return stage;
                };
                //SPRITES
                PIXIHelper.createBackground = function (parentWidth, parentHeight, background) {
                    var backgroundTile = new PIXI.extras.TilingSprite(this.getTexture(background.image), background.width, background.height);
                    backgroundTile.width = parentWidth;
                    backgroundTile.height = parentHeight;
                    backgroundTile.interactive = true;
                    return backgroundTile;
                };
                PIXIHelper.getTexture = function (image) {
                    if (!PIXIHelper.prototype.TEXTURES[image]) {
                        PIXIHelper.prototype.TEXTURES[image] = PIXI.Texture.fromImage('img/' + image + '.gif');
                    }
                    return PIXIHelper.prototype.TEXTURES[image];
                };
                return PIXIHelper;
            }());
            exports_1("PIXIHelper", PIXIHelper);
            PIXIHelper.prototype.TEXTURES = {};
        }
    }
});
//# sourceMappingURL=PIXIHelper.js.map