import * as THREE from 'three';

export default class Card {
  constructor(pos, size, texture) {
    this.pos = pos;

    this.width = size.width;
    this.height = size.height;
    this.texture = texture;

    console.log(this.texture);

    this.friction = THREE.MathUtils.randFloat(0.15, 0.5);
    const { x, y } = this.getUvRate(this.texture.image, this.width, this.height);
    this.uvRate = new THREE.Vector2(x, y);


    this.geometry = new THREE.PlaneGeometry(this.width, this.height, 32 );
    // this.material = new THREE.MeshPhongMaterial({ color: this.color || 0xff0000 } );
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uTexture: {
          value: this.texture,
        },
        uvRate: {
          type: 'v2',
          value: this.uvRate,
        },
        pixeles: {type: 'v2', value: new THREE.Vector2(this.width, this.height)},
      },
      vertexShader: `
      precision highp float;

      uniform vec2 uvRate;

      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        vUv -= 0.5;
        vUv *= uvRate;
        vUv += 0.5;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
      }
      `,
      fragmentShader: `
      precision highp float;

      uniform sampler2D uTexture;
      uniform vec2 pixeles;
      uniform vec2 uvRate;

      varying float vFrontShadow;
      varying vec2 vUv;
      
      void main()	{
        vec2 uv = gl_FragCoord.xy / pixeles.xy;
        vec4 tex1 = texture2D(uTexture ,vUv);
        gl_FragColor = tex1;
        // gl_FragColor = vec4(1., 0., 0., 1.);
      }
      `,
    });
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.plane.position.set(this.pos.x, this.pos.y, this.pos.z);
  }

  getUvRate = (image, width, height) => {
    const wrapperAspect = width / height;
    const imageAspect = image.width / image.height;
  
    if (wrapperAspect > imageAspect) {
      const sizes = {
        width,
        height: (width / image.width) * image.height,
      };
      return { x: 1, y: (height / sizes.height) / (width / sizes.width) };
    }
    const sizes = {
      width: (height / image.height) * image.width,
      height,
    };
    const x = (width / sizes.width) / (height / sizes.height);
    return {x, y: 1};
  };

  // map = (in_min, in_max, out_min, out_max) => {
  //   return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
  //  }

  getCard = () => this.plane;

  animate = () => {
    
  }

  update = (pos) => {
    let currentContainerPOsition = this.plane.position.z;
    // let currentContainerPOsitionX = this.plane.position.x;
    // let currentContainerPOsitionY = this.plane.position.y;
    currentContainerPOsition += (pos.z - currentContainerPOsition) * this.friction;
    // currentContainerPOsitionX += (pos.x - currentContainerPOsitionX) * this.friction;
    // currentContainerPOsitionY += (pos.y - currentContainerPOsitionY) * this.friction;

    // console.log(currentContainerPOsitionX, currentContainerPOsitionY);

    this.pos.z = currentContainerPOsition;
    // this.pos.x = pos.x * 1;
    // this.pos.y = pos.y * 1;
    this.plane.position.z = this.pos.z;

    // console.log(this.pos);
    // this.plane.position.x += this.pos.x * this.friction;
    // this.plane.position.y += this.pos.y * this.friction;
  }

  render = () => {

  }
}