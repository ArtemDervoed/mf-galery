/* eslint-disable */
import * as THREE from 'three';
import normalizeWheel from 'normalize-wheel';
import gsap from 'gsap';
import images from './hotGirls';

import Card from './Card';

Number.prototype.map = function(in_min, in_max, out_min, out_max) {
  console.log(this);
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
 }

export default class Renderer3D {
  constructor(dom) {
    this.dom = dom;
    this.textures = [];

    this.currentScrollZ = 0;
    this.mouse = new THREE.Vector3(0, 0, 0)
    
    // Границы
    this.farPos = 0;
    this.nearPos = 250;
    
    this.finalPos = this.farPos;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 2000 );
    this.camera.position.z = 500;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    dom.appendChild(this.renderer.domElement);

    // Координаты
    this.pos = new THREE.Vector3(0, 0, this.farPos);


    this.light = new THREE.AmbientLight( 0xffffff );
    this.scene.add(this.light);

    this.cards = [];

    this.collsCount = 10;
    this.rowsCount = 10;

    this.vMargn = 50;
    this.hMargn = 60;

    this.cardHeight = 150;
    this.cardWidth = 115;

    const loadManager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(loadManager);
    images.forEach(url => {
      this.textures.push(loader.load(url));
    });

    loadManager.onLoad = () => {
      for (let i = 0; i < this.collsCount; i += 1) {
        const x = (i - this.collsCount / 2) * (this.cardWidth + this.vMargn);
        for (let j = 0; j < this.rowsCount; j += 1) {
          const y = (j - this.rowsCount / 2) * (this.cardHeight + this.hMargn);
          const card = new Card(
            new THREE.Vector3(x, y, this.pos.z),
            { width: this.cardWidth, height: this.cardHeight},
            this.textures[THREE.MathUtils.randInt(0, this.textures.length - 1)]
          );
          this.scene.add(card.getCard());
          this.cards.push(card);
        }
      }
    };

    this.dom.addEventListener('wheel', this.handleWheel);
    this.dom.addEventListener('mousedown', this.handleMouseDown);
    this.dom.addEventListener('mouseup', this.handleMouseUp);

    
    this.render();
  }

  handleWheel = (e) => {
    const normalized = normalizeWheel(e);
    const { pixelY } = normalized;
    this.currentScrollZ = THREE.MathUtils.clamp(this.currentScrollZ + pixelY, this.farPos, this.nearPos);
    const finalPos = THREE.MathUtils.lerp(this.farPos, this.nearPos, this.currentScrollZ / 250);

    gsap.to(this, {
      duration: 0.5,
      finalPos,
      overwrite: 5,
    })
  }

  handleMouseDown = (e) => {
    // this.prevPosX = e.x;
    // this.prevPosY = e.y;
    this.dom.addEventListener('mousemove', this.handleMouseMove);
  }

  handleMouseUp = () => {
    // console.log('up');
    // this.mousepos.setX(0);
    // this.mousepos.setY(0);
    this.dom.removeEventListener('mousemove', this.handleMouseMove);
  }

  handleMouseMove = (event) => {
    const { width, height } = this.dom.getBoundingClientRect();
    this.mouse.x = (event.clientX / width) * 2 - 1;
    this.mouse.y = -(event.clientY / height) * 2 + 1;

    gsap.to(this.mouse, {
      duration: 0.5,
      x: (event.clientX / width) * 2 - 1,
      y: -(event.clientY / height) * 2 + 1,
      overwrite: 5,
    })

    
    // console.log(e, 'move');
    // this.prevPosX = this.currentPosX;
    // this.prevPosY = this.currentPosY;
    // this.currentPosX = e.x;
    // this.currentPosY = e.y;

    // const dx = -(this.prevPosX - this.currentPosX);
    // const dy = -(this.prevPosY - this.currentPosY);

    // this.currentScrollX += dx;
    // this.currentScrollY += dy;

    // const finalPosX = THREE.MathUtils.lerp(-100, 100, this.currentScrollX);
    // const finalPosY = THREE.MathUtils.lerp(-100, 100, this.currentScrollY);

    // gsap.to(this, {
    //   duration: 0.5,
    //   finalPosX,
    //   finalPosY,
    //   overwrite: 5,
    // })

    // console.log(this.currentScrollX, this.currentScrollY);
    // this.cards.forEach(c => {
    //   gsap.to(c.plane.position, {
    //     duration: 0.5,
    //     x: (c.plane.position.x + this.dx),
    //     y: (c.plane.position.y + this.dy),
    //     overwrite: 5,
    //   })
      // c.plane.position.x += this.dx;
      // c.plane.position.y += this.dy;
    // })

    // const finalPos = THREE.MathUtils.lerp(0, 10, this.currentScrollZ / 250);

    // console.log(dx, dy);
    // this.mousepos.add());
  }

  animate = () => {
    
  }

  update = () => {
    // console.log(this.mouseMovePos);
    this.cards.forEach(c => {
      c.update(this.pos);
    })
    this.pos.z = this.finalPos;
    this.pos.x = this.mouse.x;
    this.pos.y = this.mouse.y;
    // this.pos.x = this.dx;
    // this.pos.y = this.dy;
    
  }

  render = () => {
    this.animate();
    this.update();
    requestAnimationFrame(this.render);
    this.renderer.render(this.scene, this.camera);
  }
}