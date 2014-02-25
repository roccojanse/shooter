/**
 * First Person Controls
 * @class First Person Controls
 * @author Rocco Janse, roccojanse@outlook.com
 * @constructor
 */
TGF.FirstPersonControls = function(camera, el) {

    var _this = this;

    // check and enable pointerlock
    this.checkPointerLock(el);

    this.camera = camera;
    this.pitchObject = new THREE.Object3D();
    this.yawObject = new THREE.Object3D();

    this.camera.rotation.set(0, 0, 0);
    this.pitchObject.add(this.camera);
    this.yawObject.position.y = 10;
    this.yawObject.add(this.pitchObject);

    this.speed = 10;
    this.lookSpeed = 0.5;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    this.isOnObject = false;
    this.canJump = false;

    this.velocity = new THREE.Vector3();

    this.PI_2 = Math.PI / 2;

    $(document).on({
        'mousemove': function(e) { _this.onMouseMove(e.originalEvent); },
        'keydown': function(e) { _this.onKeyDown(e); },
        'keyup': function(e) { _this.onKeyUp(e); }
    });

    this.enabled = false;

};

$.extend(TGF.FirstPersonControls.prototype, /** @lends TGF.FirstPersonControls **/ {

    update: function (delta) {

        if (this.enabled === false ) return;

        delta = this.speed * delta;
        //delta *= 0.01;

        this.velocity.x += (- this.velocity.x) * 0.08 * delta;
        this.velocity.z += (- this.velocity.z) * 0.08 * delta;

        this.velocity.y -= 0.25 * delta;

        if (this.moveForward) this.velocity.z -= 0.06 * delta;
        if (this.moveBackward) this.velocity.z += 0.06 * delta;

        if (this.moveLeft) this.velocity.x -= 0.06 * delta;
        if (this.moveRight) this.velocity.x += 0.06 * delta;

        if (this.isOnObject === true ) {
            this.velocity.y = Math.max(0, this.velocity.y);
        }

        this.yawObject.translateX(this.velocity.x);
        this.yawObject.translateY(this.velocity.y); 
        this.yawObject.translateZ(this.velocity.z);

        if (this.yawObject.position.y < 10) {
            this.velocity.y = 0;
            this.yawObject.position.y = 10;
            this.canJump = true;
        }

    },

    onMouseMove: function(e) {

        if (this.enabled === false ) return;

        var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
        var movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

        this.yawObject.rotation.y -= movementX * 0.002;
        this.pitchObject.rotation.x -= movementY * 0.002;
        this.pitchObject.rotation.x = Math.max(- this.PI_2, Math.min(this.PI_2, this.pitchObject.rotation.x));

    },

    onKeyDown: function(e) {

        switch (e.keyCode) {
            case 38: // up
            case 87: // w
                this.moveForward = true;
                break;

            case 37: // left
            case 65: // a
                this.moveLeft = true; 
                break;

            case 40: // down
            case 83: // s
                this.moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                this.moveRight = true;
                break;

            case 32: // space
                if (this.canJump === true ) {
                    this.velocity.y += 10;
                }
                this.canJump = false;
                break;
        }
    },

    onKeyUp: function(e) {

        switch(e.keyCode) {
            case 38: // up
            case 87: // w
                this.moveForward = false;
                break;

            case 37: // left
            case 65: // a
                this.moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                this.moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                this.moveRight = false;
                break;
        }
    },

    getObject: function () {
        return this.yawObject;
    },

    isOnObject: function (boolean) {
        this.isOnObject = boolean;
        this.canJump = boolean;
    },

    getDirection: function() {

       // console.log(this);

    },

    checkPointerLock: function(el) {

        var _this = this;

        this.havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document ||  'webkitPointerLockElement' in document;
        this.element = el[0] || document.body;
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
            console.log('Pointerlock changed. Controls enabled.');
        } else {
            $(this).triggerHandler('pldisable');
            console.warn('Pointerlock changed. Controls disabled.');
        }
    },

    pointerLockError: function(e) {
        $(this).triggerHandler('plerror');
        console.warn('Pointerlock Error', e);
    }

});