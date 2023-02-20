let player;
let gunEquipped = false;
let scytheEquipped = false;
let playerVel = 2;
let lasers;
let laserDirection;
let laserVel = 7;
let octomonHealthBar, playerHealthBar, octomonHealthBarOutline;
let origHealthBarWidth;
let slimes;
let t = 0;
let slimesAni;
let lost = false;

function preload() {
  bgImg = loadImage('imgs/bg.png');
  playerFrontImg = loadImage('imgs/player-front.png');
  // octomonSpriteSheet = loadSpriteSheet('imgs/octomon-hit.png', 'imgs/octomon.png')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = createSprite (width / 4, height / 2);

  player.width = width;
  player.height = height;
  player.scale = 0.00006316 * width;
  player.addImg('front', 'imgs/player-front.png');
  player.addImg('right', 'imgs/player-right.png');
  player.addImg('left', 'imgs/player-left.png');
  player.addImg('back', 'imgs/player-back.png');
  player.addImg('rightGun', 'imgs/player-gun-right.png');
  player.addImg('leftGun', 'imgs/player-gun-left.png');
  player.addImg('frontGun', 'imgs/player-gun-front.png');
  player.addImg('backGun', 'imgs/player-gun-back.png');
  player.addImg('rightScythe', 'imgs/player-scythe-right.png');
  player.addImg('leftScythe', 'imgs/player-scythe-left.png');
  player.addImg('frontScythe', 'imgs/player-scythe-front.png');
  player.addImg('backScythe', 'imgs/player-scythe-back.png');

  player.ani = 'front';

  octomon = createSprite(width - width / 4, height - height / 2.2, 'static');
  octomon.width = width;
  octomon.height = height * 2;
  octomon.scale = 0.00007092 * width;
  octomon.addImg('front', 'imgs/octomon.png');
  octomon.spriteSheet = loadImage('imgs/octomon-hit.png');
  // let octomonHitAni = loadAni('imgs/octomon-hit.png', 5);
  // octomon.addAni('hit', 'imgs/octomon-hit.png', 5);
  octomonHitAni = loadAnimation('imgs/octomon-sprite-sheet.png', { frameSize: [6048.3994, 5200.7403], frames: 2});
  octomon.addAni('hit', octomonHitAni);
  octomon.ani.looping = true;
  octomon.ani.frameDelay = 7;
  octomon.ani = 'front';


  octomonHitBox = createSprite(width - width / 4, height / 2, width / 10, height / 10);
  octomonHitBox.visible = false;
  
  octomonHealthBar = createSprite(windowWidth - windowWidth / 5, 100, width / 5, height / 80, 'static');
  octomonHealthBar.color = color(255, 0, 0);
  octomonHealthBar.strokeWeight = 0;
  origHealthBarWidth = octomonHealthBar.width;
  // console.log(origHealthBarWidth);
  octomonHealthBarOutline = createSprite(width - width / 5, 100, width / 5, height / 80, 'staticsaw');
  octomonHealthBarOutline.color = color(0, 0, 0, 0);
  octomonHealthBarOutline.stroke = color(255, 246, 192);

  lasers = new Group();

  slimes = new Group();
  slimesAni = loadAnimation('imgs/slime-sprite-sheet.png', { frameSize: [301, 300], frames: 6});
  // slimes.addAni('thrown,', 'imgs/slime-sprite-sheet.png', 6);
  slimes.addAni('thrown', slimesAni);
  slimes.ani.frameDelay = 7;


  player.overlaps(octomon);
  player.overlaps(lasers);
  lasers.collides(octomon, octomonLaserHit);
  octomon.overlaps(octomonHitBox);
  player.overlaps(octomonHitBox);
  octomonHitBox.overlaps(lasers);
  octomonHealthBar.overlaps(player);
  octomonHealthBar.overlaps(lasers);
  octomonHealthBarOutline.overlaps(player);
  octomonHealthBarOutline.overlaps(lasers);
  slimes.overlaps(octomon);
  slimes.overlaps(octomonHealthBar);
  slimes.overlaps(octomonHealthBarOutline);
  slimes.overlaps(lasers);

  player.layer = 3;
  lasers.layer = 2;
  slimes.layer = 2;
  octomon.layer = 1;
}

function draw() {
  background(1, 46, 55);
  allSprites.debug = mouse.pressing();
  image(bgImg, 0, 0, width, height, 0, 0, bgImg.width, bgImg.height, CONTAIN);
  fill(255, 246, 192);
  t++;
  if (t % 70 == 0) {
    throwSlime();
  }
  // rect(width / 4, height / 2, width / 15, width / 20);
  // rect(width - width / 6, 100, width / 6, height / 80);
  // rect(width - width / 4, height - height / 2.5, width / 10, height / 5);
  // if (keyCode === 69 && weaponEquipped == false) {
  //   weaponEquipped = true;
  //   console.log(weaponEquipped);
  // }
  
  // if (keyCode === 69 && weaponEquipped == true) {
  //   weaponEquipped = false;
  //   console.log(weaponEquipped);
  // }


  if(kb.presses('1') && gunEquipped == false) {
    gunEquipped = true;
    scytheEquipped = false;
  } else if (kb.presses('1') && gunEquipped == true) {
    gunEquipped = false;
  }

  if(kb.presses('2') && scytheEquipped == false) {
    scytheEquipped = true;
    gunEquipped = false;
  } else if (kb.presses('2') && scytheEquipped == true) {
    scytheEquipped = false;
  }

  // console.log(scytheEquipped);

  // console.log(gunEquipped);

  if (gunEquipped == false && scytheEquipped == false) {
    if(kb.pressing('right')) {
      player.ani = 'right';
      player.vel.x = 4;
    } else if (kb.pressing('left')) {
      player.ani = 'left';
      player.vel.x = -4;
    } else if (kb.pressing('down')) {
      player.ani = 'front';
      player.vel.y = 4;
    } else if (kb.pressing('up')) {
      player.ani = 'back';
      player.vel.y = -4;
    } else {
      player.vel.x = 0;
      player.vel.y = 0;
    }
  } else if (gunEquipped) {
    if(kb.pressing('right')) {
      player.ani = 'rightGun';
      laserDirection = 'right';
      player.vel.x = playerVel;
    } else if (kb.pressing('left')) {
      player.ani = 'leftGun';
      laserDirection = 'left';
      player.vel.x = -playerVel;
    } else if (kb.pressing('down')) {
      player.ani = 'frontGun';
      laserDirection = 'down';
      player.vel.y = playerVel;
    } else if (kb.pressing('up')) {
      player.ani = 'backGun';
      laserDirection = 'up';
      player.vel.y = -playerVel;
    } else {
      player.vel.x = 0;
      player.vel.y = 0;
    }
  } else if (scytheEquipped) {
    if(kb.pressing('right')) {
      player.ani = 'rightScythe';
      player.vel.x = playerVel;
    } else if (kb.pressing('left')) {
      player.ani = 'leftScythe';
      player.vel.x = -playerVel;
    } else if (kb.pressing('down')) {
      player.ani = 'frontScythe';
      player.vel.y = playerVel;
    } else if (kb.pressing('up')) {
      player.ani = 'backScythe';
      player.vel.y = -playerVel;
    } else {
      player.vel.x = 0;
      player.vel.y = 0;
    }
  }

  if (gunEquipped) {
    shootLaser();
  }

  octomonScytheHit();

  if (octomonHealthBar.width < 1) {
    win();
  }

  if (lost) {
    let lostText = 'OCTOMON REIGNS';
    text(lostText, width / 2, 50, width / 3, height / 10);
  }

}

function shootLaser() {
  if (kb.presses('k')) {
    let laser = new lasers.Sprite(player.x, player.y);
    laser.color = color(255, 34, 239);
    laser.stroke = color(255, 246, 192);
    laser.diameter = width / 220;
    if (laserDirection == 'right') {
      laser.vel.x = laserVel;
      laser.vel.y = 0;
    } else if (laserDirection == 'left') {
      laser.vel.x = -laserVel;
      laser.vel.y = 0;
    } else if (laserDirection == 'up') {
      laser.vel.x = 0;
      laser.vel.y = -laserVel;
    } else {
      laser.vel.x = 0;
      laser.vel.y = laserVel;
    }
    laser.life = 100;
  }
}

function octomonLaserHit() {
  // octomon.visible = false;
  octomonHealthBar.width = octomonHealthBar.width - origHealthBarWidth / 100;
  octomonHealthBar.x = octomonHealthBar.x - origHealthBarWidth / 200;
  // octomon.ani = ['hit', 'front'];
  octomon.ani.play(0);
  console.log(octomonHealthBar.width);
}

function octomonScytheHit() {
  if(scytheEquipped) {
    if (kb.presses('k') && player.overlapping(octomon)) {
      octomonHealthBar.width = octomonHealthBar.width - origHealthBarWidth / 10;
      octomonHealthBar.x = octomonHealthBar.x - origHealthBarWidth / 20;
    }
  }
}

function throwSlime() {
    let slime = new slimes.Sprite(octomon.x, octomon.y);
    slime.scale = (0.0006382979 * windowWidth) / 4;
    // slime.ani = slimesAni;
    // slime.addImg('thrown', [
    //   [0, 0],
    //   [300, 0],
    //   [600, 0],
    //   [0, 300],
    //   [300, 300],
    //   [600, 300]
    // ]);
    slime.ani.looping = false;
    slime.diameter = width / 20;
    slime.direction = random(0, 360);
    slime.speed = random(2, 10);
    console.log(t);
    slime.life = 1500;
    slime.collide(player, lose);
    // slime.collide(laser, slime.visible = false);
}

function win() {
  octomon.collider = 'kinematic';
  octomon.rotationSpeed = 1;
  octomon.vel.x = 4;
  let winText = 'OCTOMON\'S SLIMEY REIGN IS OVER';
  text(winText, width / 2, 50, width / 3, height / 10);
}

function lose() {
  player.visible = false;
  slimes.visible = false;
  lost = true;
}
