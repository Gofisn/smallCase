 (function(exports) {

     var Player = function(option) {
         this.container = option.container || 'testCanvas';
         
         this.init();

     };

     Player.prototype = {
         constructor: Player,

         init: function(callback) {
             var _this = this;
             var canvas = document.getElementById(this.container);
             var stage = new createjs.Stage(canvas);

             window.showLove = true;
             this.canvas = canvas;
             this.stage = stage;

             createjs.Ticker.timingMode = createjs.Ticker.RAF;
             createjs.Ticker.addEventListener('tick', function() {
                 _this.tick(event)
             });
             this.loadQueue = new createjs.LoadQueue(false);
             this.loadQueue.addEventListener('complete', function() {
                 // _this.play();
                 window.start_play = true;

                 if (callback)
                     callback();
             });
             this.loadQueue.loadManifest(getManifest());

             function getManifest(argument) {
                 return [{
                     src: 'img/i.png',
                     id: 'i'
                 }, {
                     src: 'img/u.png',
                     id: 'u'
                 }, {
                     src: 'img/heart.png',
                     id: 'heart'
                 }]
             };

         },
         tick: function(event) {
             this.stage.update(event);
             if (window.showLove && window.start_play) { //是否从新播放
                 this.play();
             }
         },
         play: function() {
             this.stage.removeAllChildren();
             this.updateLove();
             window.showLove = false;
         },
         updateLove: function() {
             var _this = this;
             var stage = this.stage;
             var canvas = _this.canvas;
             var loadQueue = _this.loadQueue;

             var container = new createjs.Container();

             addBackground();
             addLoves(0);
             addHearts(300);
             stage.addChild(container);

             function addBackground() {
                 var child = new createjs.Shape(
                     new createjs.Graphics().beginFill("#000")
                     .rect(0, 0, canvas.width, canvas.height));

                 container.addChild(child);
             };

             function addLoves(wait) {
                 var chars = [{
                     char: 'i',
                     position: 0.35
                 }, {
                     char: 'heart',
                     position: 0.48
                 }, {
                     char: 'u',
                     position: 0.61
                 }];
                 var mc = new createjs.MovieClip(null, 0, false);
                 container.addChild(mc);
                 var time_start = 0;
                 var speed = 13;
                 for (var i = 0; i < chars.length; i++) {
                     var x = canvas.width * chars[i].position;
                     addChars(chars[i], speed, time_start, x);
                     time_start += (canvas.width - x) / speed / 1.3;
                 }

                 function addChars(item, speed, time_start, x) {
                     var child = new createjs.Bitmap(loadQueue.getResult(item.char));
                     child.regX = child.image.naturalWidth / 2;
                     child.regY = child.image.naturalHeight / 2;
                     child.y = canvas.height / 2;
                     child.rotation = -90;


                     mc.timeline.addTween(
                         createjs.Tween.get(child, { loop: false })
                         .to({ x: canvas.width + 110 }, 0)
                         .wait(time_start)
                         .to({ x: x }, (canvas.width - x) / speed, createjs.Ease.quadInOut)
                     )
                 }
             };

             function addHearts(wait) {

                 var heartNum = 200;

                 for (var i = heartNum; i > 0; i--) {
                     var time_start = Math.random() * 150;
                     var speed = Math.random() * 10 + 10;
                     addHeart('heart', time_start, speed)
                 }

                 function addHeart(img_id, time_start, speed) {
                     var mc = new createjs.MovieClip(null, 0, false);
                     container.addChild(mc);
                     var img = scale(loadQueue.getResult(img_id));
                     // img.y = 80+Math.random()*200;
                     img.y = canvas.height / 2;
                     var mc1 = new createjs.MovieClip(null, 0, true);
                     mc1.timeline.addTween(
                         createjs.Tween.get(img)
                         .to({ y: 50 }, 80 + Math.random() * 150)
                         .to({ y: 280 }, 80 + Math.random() * 150)
                         .to({ y: 50 }, 80 + Math.random() * 150)
                         .to({ y: 280 }, 80 + Math.random() * 150)
                         .to({ y: 50 }, 80 + Math.random() * 150)
                         .to({ y: 280 }, 80 + Math.random() * 150));
                     mc1.gotoAndPlay(Math.random() * 300)
                     mc.timeline.addTween(
                         createjs.Tween.get(mc1, { loop: false })
                         .to({ x: canvas.width + 100 })
                         .wait(wait)
                         .wait(time_start)
                         .to({ x: -100 }, canvas.width / speed)
                     )



                 }

                 function scale(img) {
                     // img.width = img.width / (10 + Math.random() * 5);
                     var bitmap = new createjs.Bitmap(img);
                     bitmap.regX = img.naturalWidth / 2;
                     bitmap.regY = img.naturalHeight / 2;
                     var scal = 1 / (3 + Math.random() * 5)
                     bitmap.scaleX = scal;
                     bitmap.scaleY = scal;
                     bitmap.rotation = -90;
                     return bitmap;
                 }
             };

         },
     };
     exports.Player = Player;
 })(window.ghz || (window.ghz = {}));
