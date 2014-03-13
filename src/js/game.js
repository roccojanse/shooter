(function($, window, document) {

    "use strict";

    var $container = $(document.body),
        width = $(window).width(),
        height = $(window).height(),
        objectManager = new TGF.ObjectManager(),
        textureManager = new TGF.TextureManager(),
        sceneManager = new TGF.SceneManager();

    console.log(objectManager, textureManager, sceneManager);

    //var loadManager = new THREE.LoadingManager();

    THREE.DefaultLoadingManager.onProgress = function ( item, loaded, total ) { 
        console.log( item, loaded, total ); 
    }; 





    var loader = new THREE.JSONLoader(true);

    console.log(loader);

    loader.load('src/js/obj/maps/mp_001.js', function(geo, mat) {

        console.log(mat);



        // material = Physijs.createMaterial(new THREE.MeshFaceMaterial(mat), 1, 1);
        // terrain = new Physijs.PlaneMesh(geo, material, 0);
        // //models.push(new THREE.Mesh(data, material));
        // //scene.add(model = new THREE.Mesh(data, material));
        // //
        // terrain.name = 'dirtroad';
        // terrain.position.z = 0;
        // terrain.position.y = 0;
        // terrain.position.x = 0;
        
        // _this.world.add(terrain);
    }, 'assets/img/textures');






}(jQuery, window, document)); 
