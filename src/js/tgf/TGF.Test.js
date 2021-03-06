/**
 * Game Main class
 * @class Creates main game object
 * @author Rocco Janse, roccojanse@outlook.com
 * @constructor
 */
TGF.Test = function(container, width, height) {

    var _this = this;

    this.$container = container;
    this.width = width;
    this.height = height;
    this.aspectRatio = this.width / this.height;
    this.viewAngle = 75;
    this.near = 0.1;
    this.far = 20000;

    this.fps = 60;
    this.loopCount = 0;
    this.reqAnimId = null;
    
    this.timer = new THREE.Clock();
    this.lastFrame = new Date().getTime();

    this.debug = {};

    // physics
    Physijs.scripts.worker = 'js/physijs/physijs_worker.js';
    Physijs.scripts.ammo = 'ammo.js';

    // scene
    this.world = new Physijs.Scene();
    this.world.setGravity(new THREE.Vector3(0, -30, 0));
    this.world.fog = new THREE.FogExp2(0xffffff, 0.00025);

    // camera
    this.camera = new THREE.PerspectiveCamera(this.viewAngle, this.aspectRatio, this.near, this.far);
    this.camera.position.x = -30;
    this.camera.position.y = 30;
    this.world.add(this.camera);

    // renderer
    this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapSoft = true;
    this.$container.append(this.renderer.domElement);

    // player
    this.player = new Physijs.CapsuleMesh(
        new THREE.CylinderGeometry(5.0, 5.0, 10.0),
        new Physijs.createMaterial(new THREE.MeshBasicMaterial({
            color: 0xff00ff
        })),
        0,
        0
    );
    this.player.position.y = 10;
    this.player.speed = 1;

    // controls
    this.controls = new TGF.FPSControls(this.player, this.$container);
    // this.controls.getObject().add(this.player);
    // this.world.add(this.controls.getObject());
    // 
    this.camera.lookAt(this.player.position);
    this.world.add(this.player);

    this.initWorld();

};

$.extend(TGF.Test.prototype, /** @lends TGF.Test **/ {

    initWorld: function() {

        var _this = this;

        // skybox
        var Skybox = new window.Skybox('mp_001', 5000);
        this.world.add(Skybox.getElement());

        // lensflare
        new window.Lensflare(this.world);

        // ambient
        var ambient = new THREE.AmbientLight(0x404040);
        this.world.add(ambient);

        // ground
        var loader = new THREE.JSONLoader();
        loader.load('src/js/obj/maps/mp_001.js', function(geo, mat) {
            material = Physijs.createMaterial(new THREE.MeshFaceMaterial(mat), 1, 1);
            terrain = new Physijs.PlaneMesh(geo, material, 0);
            //models.push(new THREE.Mesh(data, material));
            //scene.add(model = new THREE.Mesh(data, material));
            //
            terrain.name = 'dirtroad';
            terrain.position.z = 0;
            terrain.position.y = 0;
            terrain.position.x = 0;
            
            _this.world.add(terrain);
        }, 'assets/img/textures');

        
        this.start();
    },

    /**
     * Main game logic
     * @return void
     */
    mainLoop: function() {
        
        var time = new Date().getTime(),
            delta = time / this.lastFrame,
            dts = delta / 1000;
            
        this.loopCount += 1;
        this.reqAnimId = window.requestAnimationFrame(this.mainLoop.bind(this));

        // collision
        //console.log(this.controls.getDirection());

        this.controls.update(delta);

        this.world.simulate();
        this.camera.lookAt(this.player.position);
        this.camera.updateProjectionMatrix();

        
        //this.renderer.clear();
        this.renderer.render(this.world, this.camera);

        if (this.debug.stats) {
            this.debug.stats.update();
        }

        this.lastFrame = time;

        // if (this.loopCount > 400) {
        //     console.log('stopped gameloop.');
        //     this.stop();
        // }
    },

    /**
     * Start game loop
     * @return void
     */
    start: function() {
        this.mainLoop();
    },

    /**
     * Stop game loop
     * @param {Integer} reqAnimId Id of animation to stop
     * @return void
     */
    stop: function(reqAnimId) {

        var animId = reqAnimId || this.reqAnimId;
        if (animId === 0) { return; }

        window.cancelAnimationFrame(animId);
    },

    doDebug: function() {
        
        this.debug.stats = new Stats();
        $(this.debug.stats.domElement).css({
            'position': 'absolute',
            'bottom': 0,
            'z-index': 100
        });
        this.$container.append(this.debug.stats.domElement);
    },

    /**
     * resizes the game
     * @return void
     */
    resize: function() {

    },

    getElement: function() {
        return this.renderer.domElement;
    }

});