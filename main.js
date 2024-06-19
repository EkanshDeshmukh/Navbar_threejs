import './style.css'
import * as THREE from 'three'
 

class Site {
  constructor({ dom }) {
    this.time = 0;
    this.container = dom;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.images = [...document.querySelectorAll('.images img')];
    this.material = null;
    this.imageStore = [];
    this.uStartIndex = 0;
    this.uEndIndex = 1;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 100, 2000);

    this.camera.position.z = 200;
    this.camera.fov = 2 * Math.atan(this.height / 2 / 200) * (180 / Math.PI);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);
    this.renderer.render(this.scene, this.camera);

    this.addObject();
    this.resize()
    this.setPosition();
    this.setupResize();
    this.setPosition();
    this.render();
  }
resize(){
  this.width = this.container.offsetWidth
  this.height = this.container.offsetHeight
  this.renderer.setSize(this.width, this.height)
  this.camera.aspect = this.width / this.height
  this.camera.updateProjectionMatrix()
  this.setPosition()
}

setupResize(){
  window.addEventListener('resize', this.resize.bind(this))
}

setPosition() {
  this.imageStore.forEach((imgObj) => {
    const bounds = imgObj.img.getBoundingClientRect();
    imgObj.mesh.position.y = bounds.top + this.height / 2 - bounds.height / 2;
    imgObj.mesh.position.x = bounds.left - this.width / 2 + bounds.width / 2;
  });
}


  addImages() {
    const textureLoader = new THREE.TextureLoader()
    const textures = this.images.map((img) => textureLoader.load(img))

    const uniforms = {
      uTime: { value: 0 },
      uTimeline:{ value: 0.2 },
      uStartIndex:{ value: 0 },
      uEndIndex:{ value: 1},
      uImage1: { value: textures[0] },
      uImage2: { value: textures[2] },
      uImage3: { value: textures[3] },
      uImage4: { value: textures[4] },

    }

    this.material = new THREE.ShaderMaterial({
      vertexShader: vertexColor,
      fragmentShader: fragment,
      transparent: true,
      uniforms: uniforms,
    })
    this.images.forEach((img) => {
      const bounds = img.getBoundingClientRect()
      const geometry = new THREE.PlaneGeometry(bounds.width, bounds.height)
      const mesh = new THREE.Mesh(geometry, this.material)

      this.scene.add(mesh)

      this.imageStore.push({
        img: img,
        mesh: mesh,
        top: bounds.top,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height,

      })

    })

  }

  hoverOverLinks(){
    const links = document.querySelectorAll('.links a')
       links.forEach((link,i)=>{
        link.addEventListener('mouseover',(e)=>{
          this.material.uniforms.uTimeline.value = 0.0
          gsap.to(this.material.uniforms.uTimeline,{
            value: 0.2,
            duration: 2,
            ease: 'power1.out',
            onStart: function(){
              this.uEndIndex = i;
              this.material.uniforms.uStartIndex.value = this.uStartIndex
              this.material.uniforms.uEndIndex.value = this.uEndIndex
this.uStartIndex = this.uEndIndex
            }
          })

        })
       })
    
  }

  addObject() {
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.cube);
  }

  render() {
    this.time+= 0.1;

     this.material.uniforms.uTime.value = this.time
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }
}

new Site({
  dom: document.querySelector('.canvas'),
});
