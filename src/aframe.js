const {Controller} = require('./controller');
require("aframe");
require("aframe-extras");
const Stats = require("stats-js");

AFRAME.registerSystem('mindar-system', {
  container: null,
  video: null,
  processReady: false,
  processingImage: false,

  init: function() {
    this.anchorEntities = [];
  },

  tick: function() {
  },

  setup: function({imageTargetSrc, showStats}) {
    this.imageTargetSrc = imageTargetSrc;
    this.showStats = showStats;
  },

  registerAnchor: function(el, targetIndex) {
    this.anchorEntities.push({el: el, targetIndex: targetIndex});
  },

  start: function() {
    this.container = this.el.sceneEl.parentNode;

    if (this.showStats) {
      this.mainStats = new Stats();
      this.mainStats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
      this.mainStats.domElement.style.cssText = 'position:absolute;top:0px;left:0px;z-index:999';
      this.workerStats = new Stats();
      this.workerStats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
      this.workerStats.domElement.style.cssText = 'position:absolute;top:0px;left:80px;z-index:999';
      this.container.appendChild(this.mainStats.domElement);
      this.container.appendChild(this.workerStats.domElement);
    }

    this._startVideo();
  },

  stop: function() {
    this.processReady = false;
    this.video.pause();
  },

  _startVideo: function() {
    this.video = document.createElement('video');

    this.video.setAttribute('autoplay', '');
    this.video.setAttribute('muted', '');
    this.video.setAttribute('playsinline', '');
    this.video.style.position = 'absolute'
    this.video.style.top = '0px'
    this.video.style.left = '0px'
    this.video.style.zIndex = '-2'
    this.container.appendChild(this.video);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      // TODO: show unsupported error
      return;
    }

    navigator.mediaDevices.getUserMedia({audio: false, video: {
      facingMode: 'environment',
    }}).then((stream) => {
      this.video.addEventListener( 'loadedmetadata', () => {
        console.log("video ready...", this.video);
        this.video.setAttribute('width', this.video.videoWidth);
        this.video.setAttribute('height', this.video.videoHeight);
        this._startAR();
      });
      this.video.srcObject = stream;
    }).catch((err) => {
      console.log("getUserMedia error", err);
    });
  },

  _startAR: async function() {
    const video = this.video;
    const container = this.container;

    let vw, vh; // display css width, height
    const videoRatio = video.videoWidth / video.videoHeight;
    const containerRatio = container.clientWidth / container.clientHeight;
    if (videoRatio > containerRatio) {
      vh = container.clientHeight;
      vw = vh * videoRatio;
    } else {
      vw = container.clientWidth;
      vh = vw / videoRatio;
    }

    this.controller = new Controller(video.videoWidth, video.videoHeight, (data) => {
      //console.log('controller on update', data);
      if (data.type === 'processDone') {
        if (this.mainStats) this.mainStats.update();
      }
      else if (data.type === 'workerDone') {
        if (this.workerStats) this.workerStats.update();
      }
      else if (data.type === 'updateMatrix') {
        const {targetIndex, worldMatrix} = data;

        for (let i = 0; i < this.anchorEntities.length; i++) {
          if (this.anchorEntities[i].targetIndex === targetIndex) {
            this.anchorEntities[i].el.updateWorldMatrix(worldMatrix);
          }
        }
      }
    });

    const proj = this.controller.getProjectionMatrix();
    const fov = 2 * Math.atan(1/proj[5] / vh * container.clientHeight ) * 180 / Math.PI; // vertical fov
    const near = proj[14] / (proj[10] - 1.0);
    const far = proj[14] / (proj[10] + 1.0);
    const ratio = proj[5] / proj[0]; // (r-l) / (t-b)
    //console.log("loaded proj: ", proj, ". fov: ", fov, ". near: ", near, ". far: ", far, ". ratio: ", ratio);
    const newRatio = container.clientWidth / container.clientHeight;
    //console.log("newCam", fov, ratio, newRatio);
    const newCam = new AFRAME.THREE.PerspectiveCamera(fov, newRatio, near, far);

    const camera = container.getElementsByTagName("a-camera")[0];
    camera.getObject3D('camera').projectionMatrix = newCam.projectionMatrix;

    this.video.style.top = (-(vh - container.clientHeight) / 2) + "px";
    this.video.style.left = (-(vw - container.clientWidth) / 2) + "px";
    this.video.style.width = vw + "px";
    this.video.style.height = vh + "px";

    const {dimensions: imageTargetDimensions} = await this.controller.addImageTargets(this.imageTargetSrc);

    for (let i = 0; i < this.anchorEntities.length; i++) {
      const {el, targetIndex} = this.anchorEntities[i];
      if (targetIndex < imageTargetDimensions.length) {
        el.setupMarker(imageTargetDimensions[targetIndex]);
      }
    }

    await this.controller.dummyRun(this.video);
    container.querySelector(".mindar-loading-overlay").style.display = "none";

    this.controller.processVideo(this.video);
    this.processReady = true;
  },
});

AFRAME.registerComponent('mindar', {
  dependencies: ['mindar-system'],

  schema: {
    imageTargetSrc: {type: 'string'},
    showStats: {type: 'boolean', default: false},
    autoStart: {type: 'boolean', default: true}
  },

  init: function() {
    const arSystem = this.el.sceneEl.systems['mindar-system'];
    arSystem.setup({imageTargetSrc: this.data.imageTargetSrc, showStats: this.data.showStats});
    if (this.data.autoStart) {
      this.el.sceneEl.addEventListener('renderstart', () => {
        arSystem.start();
      });
    }
  }
});

AFRAME.registerComponent('mindar-image-target', {
  dependencies: ['mindar-system'],

  schema: {
    targetIndex: {type: 'number'},
  },

  postMatrix: null, // rescale the anchor to make width of 1 unit = physical width of card

  init: function() {
    const arSystem = this.el.sceneEl.systems['mindar-system'];
    arSystem.registerAnchor(this, this.data.targetIndex);

    const root = this.el.object3D;
    root.matrixAutoUpdate = false;
  },

  setupMarker([markerWidth, markerHeight]) {
    const position = new AFRAME.THREE.Vector3();
    const quaternion = new AFRAME.THREE.Quaternion();
    const scale = new AFRAME.THREE.Vector3();
    position.x = markerWidth / 2;
    position.y = markerWidth / 2 + (markerHeight - markerWidth) / 2;
    scale.x = markerWidth;
    scale.y = markerWidth;
    scale.z = markerWidth;
    this.postMatrix = new AFRAME.THREE.Matrix4();
    this.postMatrix.compose(position, quaternion, scale);
  },

  updateWorldMatrix(worldMatrix) {
    this.el.object3D.visible = worldMatrix !== null;
    if (worldMatrix === null) {
      return;
    }
    var m = new AFRAME.THREE.Matrix4();
    m.elements = worldMatrix;
    m.multiply(this.postMatrix);
    this.el.object3D.matrix = m;
  }
});