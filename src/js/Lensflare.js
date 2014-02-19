Lensflare = function(scene, flName) {

    // vars
    var name = flName || 'lensflare',
        flarePath = 'assets/img/fx/',
        ext = '.png';

    // properties
    this.scene = scene;
    this.textures = [];

    for (var i = 0; i < 3; i++) {
        this.textures.push(THREE.ImageUtils.loadTexture(flarePath + name + i + ext));
    }

    this.addLight(0.55, 0.9, 0.5, 5000, 3000, -1000);
    this.addLight(0.08, 0.8, 0.5, 0, 3000, -1000);
    this.addLight(0.995, 0.5, 0.9, 5000, 3000, -1000);

    return this;

};

$.extend(Lensflare.prototype, {

    addLight: function(h, s, l, x, y, z) {

        var light = new THREE.PointLight(0xffffff, 1.5, 4500);
        light.color.setHSL(h, s, l);
        light.position.set(x, y, z);
        this.scene.add(light);

        var flareColor = new THREE.Color(0xffffff);
        flareColor.setHSL(h, s, l + 0.5);

        var lensFlare = new THREE.LensFlare(this.textures[0], 700, 0.0, THREE.AdditiveBlending, flareColor);
        
        lensFlare.add(this.textures[1], 512, 0.0, THREE.AdditiveBlending);
        lensFlare.add(this.textures[1], 512, 0.0, THREE.AdditiveBlending);
        lensFlare.add(this.textures[1], 512, 0.0, THREE.AdditiveBlending);

        lensFlare.add(this.textures[2], 60, 0.6, THREE.AdditiveBlending);
        lensFlare.add(this.textures[2], 70, 0.7, THREE.AdditiveBlending);
        lensFlare.add(this.textures[2], 120, 0.9, THREE.AdditiveBlending);
        lensFlare.add(this.textures[2], 70, 1.0, THREE.AdditiveBlending);

        lensFlare.customUpdateCallback = this.lensFlareUpdateCallback;
        lensFlare.position = light.position;

        this.scene.add(lensFlare);
    },

    lensFlareUpdateCallback: function(object) {

        var f, fl = object.lensFlares.length;
        var flare;
        var vecX = -object.positionScreen.x * 2;
        var vecY = -object.positionScreen.y * 2;

        for(f = 0; f < fl; f++) {
            flare = object.lensFlares[f];
            flare.x = object.positionScreen.x + vecX * flare.distance;
            flare.y = object.positionScreen.y + vecY * flare.distance;
            flare.rotation = 0;
        }

        object.lensFlares[1].y += 0.025;
        object.lensFlares[2].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad(45);

    }

});
