/**
 * Import Phaser dependencies using `expose-loader`.
 * This makes then available globally and it's something required by Phaser.
 * The order matters since Phaser needs them available before it is imported.
 */

import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';

/**
 * Create a new Phaser game instance.
 * And render a single sprite so we make sure it works.
 */

var game = new Phaser.Game(400, 490, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
  game.load.image('dog', './assets/images/dog.png');
  game.load.image('barb', './assets/images/barbed.png');
  game.load.audio('jump', './assets/sounds/jump.wav'); 
  game.load.audio('songs', ['./assets/sounds/music.mp3', './assets/sounds/music.ogg']); 
}

var dog;
var spaceKey;
var barbs;
var score;
var labelScore;
var timer;
var jumpSound;
var flipFlop = false; 
var music;
var play = false;

function create() {
  //change background color
  game.stage.backgroundColor = '#33ccff';

  //set physics
  game.physics.startSystem(Phaser.Physics.ARCADE);

  //add dog spite
  dog = game.add.sprite(100, 245, 'dog');

  //move dogs Center of rotaion
  dog.anchor.setTo(-0.2,0,5);

  //add barb group
  barbs = game.add.group();

  //apply physics to dog
  game.physics.arcade.enable(dog);  
  
  //set gravity strength
  dog.body.gravity.y = 1000;

  //assign spacekey button
  spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  //add Row of barbs to game
  timer = game.time.events.loop(1500, addRowOfbarbs, this);

  score = 0;
  labelScore = game.add.text(20,20, "0",{ font: "30px Arial", fill: "#ffffff"});

  //add Sound
  jumpSound = game.add.audio('jump'); 


  if (!play){
    music = game.add.audio('songs').play();
    play = true;
  }
  
    
};
  
function update() {
  if(spaceKey.isDown) {
    if(!flipFlop){
      jump();
      flipFlop = true;
    }
  }
  if (spaceKey.isUp){
    flipFlop = false;
  }

  if(dog.body.y < 0 || dog.body.y > 490) {
    restartGame();
  }
  
  //set collision detection
  game.physics.arcade.overlap(dog, barbs, hitbarb, null, this);

  //rotate dog down
  if(dog.angle < 20)
  {
    dog.angle +=1;
  }
    
}
   
function jump() {
  if (dog.alive == false){
    return;  
  }
    
  dog.body.velocity.y = -295;

  // animation for dog jumping
  var animation = game.add.tween(dog);

  //start the animation
  animation.to({angle:-20}, 100).start();

  jumpSound.play();
  
}
  
function restartGame() {
  game.state.restart()  
}

function addOnebarb(x, y) {
  //create barb at x,y
  var barb = game.add.sprite(x,y,  'barb');

  //add barb to group
  barbs.add(barb);


  //add barb to physics
  game.physics.arcade.enable(barb);

  //maek barbs move left
  barb.body.velocity.x = -200;

  //get rid of barbs when off screen
  barb.CheckWorldBounds = true;
  barb.outOfBoundsKill = true;

}

function addRowOfbarbs() {
  var hole = Math.floor(Math.random()*5+1);

  for(var i=0; i<8; i++){
    if(i != hole && i != hole+  1){
      addOnebarb(400, 60 * i + 10);
    }
  }
  score += 1;
  labelScore.text= score;   
}
function hitbarb() {
  //check to see if dog already hit a barb
  if(dog.alive == false){
    return;
  } 
  //set dog to dead when hits barb
  dog.alive = false;

  game.time.events.remove(timer);

  barbs.forEach(function(p){
    p.body.velocity.x = 0;
  }, this);


}