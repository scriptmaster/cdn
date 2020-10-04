const PI = Math.PI;
const PI2 = 44 / 7;
const DEG = PI / 180;

class Scenary {
    textures = {};

    constructor({ scene, camera, appendTo, update,
        controls, axesHelper,
        gui, stats,
        polarAngle
    }) {
        this.scene = scene || new THREE.Scene();
        this.camera = camera || new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 10 );
        this.update = update;
        this.setRenderer(appendTo);
        window.addEventListener('resize', this.onWindowResize.bind(this), false)

        this.polarAngle = polarAngle || 1.3;

        if(controls) this.addOrbitControls();
        if(axesHelper) this.addAxesHelper();
        if(gui) this.addGUI();
        if(stats) this.addStats();
    }

    add(mesh) {
        this.scene.add(mesh);
    }

    setRenderer(appendTo) {
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        (appendTo || document.body).appendChild( this.renderer.domElement );
    }

    animate() {
        requestAnimationFrame( this.animate.bind(this) );

        try {
            this.update();
        } catch(e) {
            console.error('scenary::animate::update:', e);
        }

        this._render();
    }

    //@private
    _render() {
        this.renderer.render( this.scene, this.camera );
        this.stats.update();
    }

    addSkybox(size) {
        let boxFaces = [];
        let textures = [];
        let materials = [];

        let urlPrefix = 'https://raw.githubusercontent.com/scriptmaster/cdn/master/images/skyboxes/penguins2/';
        boxFaces.push('arid2_ft.jpg');
        boxFaces.push('arid2_bk.jpg');
        boxFaces.push('arid2_up.jpg');
        boxFaces.push('arid2_dn.jpg');
        boxFaces.push('arid2_rt.jpg');
        boxFaces.push('arid2_lf.jpg');

        for (let i = 0; i < 6; i++) {
            textures[i] = new THREE.TextureLoader().load(urlPrefix + boxFaces[i]);
            materials[i] = new THREE.MeshBasicMaterial({ map: textures[i], flatShading: true });
            // materials[i] = new THREE.MeshBasicMaterial({ color: 0xff00ff, flatShading: true, wireframe: true });
            materials[i].side = THREE.BackSide;
        }

        this.textures['skybox'] = textures;

        // materials[0] = new THREE.ImageLoader

        let largeWithinPerspective = size || 80;
        let skyboxGeo = new THREE.BoxGeometry(largeWithinPerspective, largeWithinPerspective, largeWithinPerspective);
        this.skybox = new THREE.Mesh( skyboxGeo, materials );
        this.scene.add( this.skybox );
    }

    addAxesHelper() {
        this.scene.add(new THREE.AxesHelper());
    }

    addOrbitControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.minPolarAngle = this.controls.maxPolarAngle = this.polarAngle;
        this.controlsUpdate();
    }

    controlsUpdate() {
        this.controls.update();
    }

    addPlane(x, y, color) {
        let planeGeo = new THREE.PlaneBufferGeometry(x || 5, y || x || 5, x / 2, (y || x) / 2);
        let planeMat;
        if (this.skybox) {
            let map = this.textures['skybox'][4];
            planeMat = new THREE.MeshBasicMaterial({ map: map, flatShading: true, side: THREE.DoubleSide });
            // planeMat.wireframe = true;
            // planeMat.map = this.textures['skybox'][2];
        } else {
            planeMat = new THREE.MeshBasicMaterial({ color: color || 0xffff00,
                flatShading: false, side: THREE.DoubleSide, wireframe: true });
        }
        this.plane = new THREE.Mesh(planeGeo, planeMat);
        this.scene.add(this.plane);

        this.plane.rotation.x = -PI/2;

        const planeUI = this.gui.addFolder('Plane');
        planeUI.add(this.plane.rotation, 'x', -PI, PI, 0.02)
    }

    addGUI() {
        var ui = {
            message: 'Funny',
            maxSize: 5,
            growthSpeed: 0.02,
            speed: 0.1,
            noiseStrength: 15,
            displayOutline: true
        }

        this.gui = new dat.GUI();
        this.gui.remember(ui);

        //gui.add(ui, "message");
        //gui.add(ui, "maxSize").min(0.5).max(7);

        const controlsUpdate = this.controlsUpdate.bind(this);

        const camera = this.gui.addFolder("Camera")
        const cameraPosition = camera.addFolder("Position")

        cameraPosition.add(this.camera.position, 'x', -10, 10, 0.02).listen().onChange(controlsUpdate)
        cameraPosition.add(this.camera.position, 'y', -10, 10, 0.02).listen().onChange(controlsUpdate)
        cameraPosition.add(this.camera.position, 'z', -10, 10, 0.02).listen().onChange(controlsUpdate)

        const cameraRotation = camera.addFolder("Rotation")

        cameraRotation.add(this.camera.rotation, 'x', -PI, PI, 0.02).listen().onChange(controlsUpdate)
        cameraRotation.add(this.camera.rotation, 'y', -PI, PI, 0.02).listen().onChange(controlsUpdate)
        cameraRotation.add(this.camera.rotation, 'z', -PI, PI, 0.02).listen().onChange(controlsUpdate)


        const controls = this.gui.addFolder("Controls")
        controls.add(this.controls, 'minPolarAngle', 0, PI, 0.02).listen().onChange(controlsUpdate)
        controls.add(this.controls, 'maxPolarAngle', 0, PI, 0.02).listen().onChange(controlsUpdate)

        const self = this;
        controls.add(this, 'polarAngle', -PI, PI, 0.02).listen().onChange(function(v){
            self.controls.minPolarAngle = self.controls.maxPolarAngle = v;
            controlsUpdate();
        });
        //self.controls.minPolarAngle = self.controls.maxPolarAngle = this.polarAngle;
        //controlsUpdate();

        controls.add(this.controls, 'minAzimuthAngle', 0, PI, 0.1).listen().onChange(controlsUpdate)
        controls.add(this.controls, 'maxAzimuthAngle', 0, PI, 0.1).listen().onChange(controlsUpdate)

        //controls.add(this.plane.rotation, 'x', 0, PI2, 0.02).listen().onChange(controlsUpdate)
    }

    // window.addEventListener('resize', onWindowResize, false)
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        // render() // DONT RENDER IMMEDIATELY - let requestAnimationFrame take care
    }

    addStats(statsEl) {
        this.stats = Stats();
        (statsEl || document.body).appendChild(this.stats.dom)
    }

    cameraPosition(x, y, z) {
        this.camera.position.x = x;
        this.camera.position.y = y;
        this.camera.position.z = z;
        this.controls.update();
    }

}
