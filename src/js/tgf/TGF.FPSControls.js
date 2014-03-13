/**
 * First Person Controls
 * @class First Person Controls
 * @author Rocco Janse, roccojanse@outlook.com
 * @constructor
 */
TGF.FPSControls = function(player, el) {

    if (!player) { return; }

    // vars
    var _this = this;

    // properties
    this.player = player;
    this.element = el[0] || document.body;

    this.enabled = false;
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.jumpHeight = 10;
    this.isJumping = false;

    this.keys = {
        up: [38, 87],       // up, w
        left: [37, 65],     // left, a
        down: [40, 83],     // down, s
        right: [39, 68],    // right, d
        jump: 32            // space
    };

    this.velocity = new THREE.Vector3();



    $(document).on({
        //'mousemove': function(e) { _this.onMouseMove(e.originalEvent); },
        'keydown': function(e) { _this.onKeyDown(e); },
        'keyup': function(e) { _this.onKeyUp(e); }
    });

    // check pointerlock and enable if found
    this.checkPointerLock();

};

$.extend(TGF.FPSControls.prototype, /** @lends TGF.FPSControls **/ {

    update: function(delta) {

        if (!this.enabled) { return; }

        this.velocity.y -= 10 * delta;

        if (this.moveForward === true) {
            this.velocity.z -= this.player.speed * delta;
        }
        if (this.moveBackward === true) {
            this.velocity.z += this.player.speed * delta;
        }
        if (this.moveLeft === true) {
            this.velocity.x -= this.player.speed * delta;
        }
        if (this.moveRight === true) {
            this.velocity.x += this.player.speed * delta;
        }

        this.player.translateX(this.velocity.x);
        this.player.translateY(this.velocity.y);
        this.player.translateZ(this.velocity.z);

        if (this.player.position.y < 10) {
            this.player.position.y = 10;
            this.velocity.y = 0;
        }

    },

    onKeyDown: function(e) {

        if (e.keyCode === this.keys.up || $.inArray(e.keyCode, this.keys.up) !== -1) {
            this.moveForward = true;
        }
        if (e.keyCode === this.keys.left || $.inArray(e.keyCode, this.keys.left) !== -1) {
            this.moveLeft = true;
        }
        if (e.keyCode === this.keys.down || $.inArray(e.keyCode, this.keys.down) !== -1) {
            this.moveBackward = true;
        }
        if (e.keyCode === this.keys.right || $.inArray(e.keyCode, this.keys.right) !== -1) {
            this.moveRight = true;
        }
        if ((e.keyCode === this.keys.jump || $.inArray(e.keyCode, this.keys.jump) !== -1) && this.isJumping === false) {
            this.velocity.y += this.jumpHeight;
            this.isJumping = true;
        }

    },

    onKeyUp: function(e) {

        if (e.keyCode === this.keys.up || $.inArray(e.keyCode, this.keys.up) !== -1) {
            this.moveForward = false;
        }
        if (e.keyCode === this.keys.left || $.inArray(e.keyCode, this.keys.left) !== -1) {
            this.moveLeft = false;
        }
        if (e.keyCode === this.keys.down || $.inArray(e.keyCode, this.keys.down) !== -1) {
            this.moveBackward = false;
        }
        if (e.keyCode === this.keys.right || $.inArray(e.keyCode, this.keys.right) !== -1) {
            this.moveRight = false;
        }

    },

    checkPointerLock: function() {

        var _this = this;

        this.havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document ||  'webkitPointerLockElement' in document;
        this.requestPointerLock = null;
        
        if (this.havePointerLock) {
            console.log('PointerLock enabled.');

            $(document).on({
                'pointerlockchange': function() { _this.pointerLockChanged(); },
                'mozpointerlockchange': function() { _this.pointerLockChanged(); },
                'webkitpointerlockchange': function() { _this.pointerLockChanged(); },
                'pointerlockerror': function(e) { _this.pointerLockError(e); },
                'mozpointerlockerror': function(e) { _this.pointerLockError(e); },
                'webkitpointerlockerror': function(e) { _this.pointerLockError(e); }
            });

            this.element.requestPointerLock = this.element.requestPointerLock || this.element.mozRequestPointerLock || this.element.webkitRequestPointerLock;

            $(this.element).on({
                'click': function(e) {
                    _this.element.requestPointerLock();
                }
            });

        } else {
            console.error('Your browser doesn\'t seem to support Pointer Lock API.');
            return false;
        }
    },

    pointerLockChanged: function(e) {
        if (document.pointerLockElement === this.element || document.mozPointerLockElement === this.element || document.webkitPointerLockElement === this.element) {
            $(this).triggerHandler('plenable');
            this.enable();
        } else {
            $(this).triggerHandler('pldisable');
            this.disable();
        }
    },

    enable: function() {
        this.enabled = true;
        console.log('Pointerlock changed. Controls enabled.');
    },

    disable: function() {
        this.enabled = false;
        console.warn('Pointerlock changed. Controls disabled.');
    },

    pointerLockError: function(e) {
        $(this).triggerHandler('plerror');
        this.enabled = false;
        console.warn('Pointerlock Error', e);
    }

});