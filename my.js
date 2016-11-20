var game = new Phaser.Game(800, 600, Phaser.AUTO, 'canvas', { preload: preload, create: create, update: update });
var cursors;
var score = 0;
var scoreText;
var health = 100;
var healthText;
var ledge;
var ground;
function preload(){
	game.load.image('sky','assets/sky.png');
	game.load.image('ground','assets/platform.png');
	game.load.image('star','assets/star.png');
	game.load.image('diamond','assets/diamond.png');
	game.load.image('firstaid','assets/firstaid.png');
	game.load.spritesheet('dude','assets/dude.png', 32, 48);//width, height
	game.load.spritesheet('gunda','assets/baddie.png', 32, 32);//width, height
}
function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'sky');
    platforms = game.add.group();
    platforms.enableBody = true;
    ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;
    ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;
    player = game.add.sprite(50, game.world.height - 150, 'dude',4);
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    gunda = game.add.sprite(50, 200, 'gunda',4);
    game.physics.arcade.enable(gunda);
    gunda.body.bounce.y = 0.2;
    gunda.body.velocity.x = 10;
    gunda.body.gravity.y = 300;
    gunda.body.gravity.x = 50;
    gunda.body.collideWorldBounds = true;
    gunda.animations.add('left', [0, 1], 10, true);
    gunda.animations.add('right', [2, 3], 10, true);
    cursors = game.input.keyboard.createCursorKeys();
    stars = game.add.group();
    stars.enableBody = true;
    for (var i = 1; i < 8; i++)
    {
        var star = stars.create(i * 90, 0, 'star');
        star.body.gravity.y = 50;
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }
	scoreText = game.add.text(16, 16, 'Score : 0', { fontSize: '32px', fill: '#000' });
	healthText = game.add.text(game.width-game.width/3, 16, 'Health : 100', { fontSize: '32px', fill: '#000' });
    diamonds = game.add.group();
    diamonds.enableBody = true;
    for (var i = 0; i < 3; i++){
        var diamond = diamonds.create(i * 310, 0, 'diamond');
        diamond.body.gravity.y = 50;
        diamond.body.bounce.y = 0.5 + Math.random() * 0.2;
    }
    firstaid = game.add.sprite(game.world.width-50, game.world.height - 150, 'firstaid');
    game.physics.arcade.enable(firstaid);
    firstaid.body.bounce.y = 0.2;
    firstaid.body.gravity.y = 300;
    gunda.animations.play('right');
}
function update(){
	game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(diamonds, platforms);
	game.physics.arcade.collide(stars, platforms);
	game.physics.arcade.collide(firstaid, platforms);
	game.physics.arcade.collide(gunda, platforms);
	player.body.velocity.x = 0;
	if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;
        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;
        player.animations.play('right');
    }
    else
    {
        player.animations.stop();
        player.frame = 4;
    }
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }
    if(gunda.body.position.x>200){
		gunda.body.velocity.x = -10;
		gunda.body.gravity.x = -50;
    	gunda.animations.play('left');

    }
    if(gunda.body.position.x<50){
		gunda.body.velocity.x = 10;
		gunda.body.gravity.x = 50;
    	gunda.animations.play('right');

    }
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this);
    game.physics.arcade.overlap(player, firstaid, increaseHealth, null, this);
    game.physics.arcade.overlap(player, gunda, end, null, this);
    if(score==220){
    	gunda.kill();
		over = game.add.text(game.width-game.width/2-150, game.height/2-48, 'You Win', { fontSize: '48px', fill: 'red' });
    }

}
function collectStar (player, star) {

    star.kill();
    score += 10;
    scoreText.text = 'Score : ' + score;

}
function collectDiamond (player, diamond) {
    diamond.kill();
    score += 50;
    scoreText.text = 'Score : ' + score;

}
function increaseHealth(player, firstaid){
	firstaid.kill();
	health +=50;
	healthText.text = 'Health : ' + health;
}
function end(){
	health -= 50;
	healthText.text = 'Health : ' + health;
	if(health==0){
		player.body.bounce.y= .5;
		player.body.velocity.y = 300;
	    ledge.body.immovable = false;
	    ground.body.immovable = false;
	    player.body.collideWorldBounds = false;
	    gunda.body.collideWorldBounds = false;
		over = game.add.text(game.width-game.width/2-150, game.height/2-48, 'Game Over', { fontSize: '48px', fill: '#000' });
	}
	else if(health>0){
		player.body.position.x = 50;
		player.body.position.y = game.world.height - 150;
	}
    else{
        health = 0;
        healthText.text = 'Health : ' + health;
    }
}