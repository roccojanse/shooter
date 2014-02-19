Skybox = function(lvlName, width, height, depth) {

    // vars
    var w = width || 5000,
        h = height || w,
        d = depth || w,
        skDirs = ['rt', 'lf', 'up', 'dn', 'bk', 'ft'],
        skPath = 'assets/img/textures/skybox/',
        skPrefix = lvlName + '_',
        skExt = '.png',
        skMaterials = [];

    for (var i = 0; i < skDirs.length; i++) {
        var url = skPath + skPrefix + skDirs[i] + skExt;
        skMaterials.push(url);
    }

    var cubemap = THREE.ImageUtils.loadTextureCube(skMaterials); // load textures
    cubemap.format = THREE.RGBFormat;

    var shader = THREE.ShaderLib.cube; // init cube shader from built-in lib
    shader.uniforms.tCube.value = cubemap; // apply textures to shader

    var skyBoxMaterial = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
    });

    this.element = new THREE.Mesh(new THREE.CubeGeometry(w, h, d), skyBoxMaterial);
    return this;

};

$.extend(Skybox.prototype, {

    getElement: function() {
        return this.element;
    }

});