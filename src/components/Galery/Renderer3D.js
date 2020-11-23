/* eslint-disable */
import * as THREE from 'three';
import normalizeWheel from 'normalize-wheel';
import gsap from 'gsap';

import Card from './Card';

Number.prototype.map = function(in_min, in_max, out_min, out_max) {
  console.log(this);
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
 }

export default class Renderer3D {
  constructor(dom) {
    this.dom = dom;

    this.currentScroll = 0;
    
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

    this.mousepos = new THREE.Vector2(0);
    this.mouseMovePos = new THREE.Vector2(0);

    this.light = new THREE.AmbientLight( 0xffffff );
    this.scene.add(this.light);

    this.cards = [];

    this.collsCount = 20;
    this.rowsCount = 10;

    this.vMargn = 50;
    this.hMargn = 60;

    this.cardHeight = 150;
    this.cardWidth = 115;

    for (let i = 0; i < this.collsCount; i += 1) {
      const x = (i - this.collsCount / 2) * (this.cardWidth + this.vMargn);
      for (let j = 0; j < this.rowsCount; j += 1) {
        const y = (j - this.rowsCount / 2) * (this.cardHeight + this.hMargn);
        const card = new Card(
          new THREE.Vector3(x, y, this.pos.z),
          { width: this.cardWidth, height: this.cardHeight},
          new THREE.Color(
            Math.random(),
            Math.random(),
            Math.random(),
          )
        );
        this.scene.add(card.getCard());
        this.cards.push(card);
      }
    }

    this.dom.addEventListener('wheel', this.handleWheel);
    this.dom.addEventListener('mousedown', this.handleMouseDown);
    this.dom.addEventListener('mouseup', this.handleMouseUp);

    
    this.render();
  }

  handleWheel = (e) => {
    const normalized = normalizeWheel(e);
    const { pixelY } = normalized;
    this.currentScroll = THREE.MathUtils.clamp(this.currentScroll + pixelY, this.farPos, this.nearPos);
    const finalPos = THREE.MathUtils.lerp(this.farPos, this.nearPos, this.currentScroll / 250);

    gsap.to(this, {
      duration: 0.5,
      finalPos,
      overwrite: 5,
    })
  }

  handleMouseDown = (e) => {
    this.mousepos.setX(e.x);
    this.mousepos.setY(e.y);
    this.dom.addEventListener('mousemove', this.handleMouseMove);
  }

  handleMouseUp = () => {
    // console.log('up');
    this.mousepos.setX(0);
    this.mousepos.setY(0);
    this.dom.removeEventListener('mousemove', this.handleMouseMove);
  }

  handleMouseMove = (e) => {
    // console.log(e, 'move');
    this.mouseMovePos.x = e.x;
    this.mouseMovePos.y = e.y;

    this.dx = (this.mouseMovePos.x - this.mousepos.x);
    this.dy = -(this.mouseMovePos.y - this.mousepos.y);

    this.cards.forEach(c => {
      gsap.to(c.plane.position, {
        duration: 0.5,
        x: (c.plane.position.x + this.dx),
        y: (c.plane.position.y + this.dy),
        overwrite: 5,
      })
      // c.plane.position.x += this.dx;
      // c.plane.position.y += this.dy;
    })

    // const finalPos = THREE.MathUtils.lerp(0, 10, this.currentScroll / 250);

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