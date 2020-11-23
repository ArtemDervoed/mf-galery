import * as THREE from 'three';

export default class Card {
  constructor(pos, size, color) {
    this.pos = pos;

    this.width = size.width;
    this.height = size.height;
    this.color = color;

    this.friction = THREE.MathUtils.randFloat(0.15, 0.5);


    this.geometry = new THREE.PlaneGeometry(this.width, this.height, 32 );
    this.material = new THREE.MeshPhongMaterial({ color: this.color || 0xff0000 } );
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.plane.position.set(this.pos.x, this.pos.y, this.pos.z);
  }

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

    this.pos.z = currentContainerPOsition;
    // this.pos.x = currentContainerPOsitionX;
    // this.pos.y = currentContainerPOsitionY;
    this.plane.position.z = this.pos.z;
  }

  render = () => {

  }
}