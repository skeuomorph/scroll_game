var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var clouds_y;
var mountains;
var trees;
var canyons;

var collectables;
var isFound;

var game_score;
var flagpole;

var lives;

var enemies;

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	lives = 4;
	startGame();
}

function draw()
{	//backdrop
	background(59, 0, 179); 
	fill(28, 0, 138);
	rect(0, height * 1/4 , width , height * 1/4 );
	fill(15, 0, 77);
	rect(0, height * 1/2 , width, height * 1/4);

	noStroke();
	fill(8, 41, 4);
	rect(0, floorPos_y, width, height/4); 

	push();
	
	translate(scrollPos, 0);

	drawClouds();
	drawMountains();
	drawTrees();

	//draw objects
	for(var i = 0; i < collectables.length; i++)
	{
		if(!collectables[i].isFound)
		{
			drawCollectables(collectables[i]);
			checkCollectable(collectables[i]);
		}
	}
 
	for(var i = 0; i < canyons.length; i++)
	{
		drawCanyons(canyons[i]);
		checkCanyon(canyons[i]);
	}
	
	//CHECKPOINT
	if(flagpole.isReached != true)
	{
		checkFlagpole();
	}

	renderFlagpole();

	for( var i = 0; i < enemies.length; i++)
	{
		enemies[i].update();
		enemies[i].draw();
		if(enemies[i].isContact(gameChar_world_x, gameChar_y))
		{
			startGame();
			break;
		}
		pop();
	} 

	pop();

	
	//drawgamechar
	
	drawGameChar();

	//score
	fill(255);
	noStroke();
	text("score: " + game_score, 20, 20);
	
	//show lives on screen
	for(var i = 0; i < lives; i++)
	{
		fill(0, 255, 255);
		ellipse((20 * [i]) + 850, 20, 20, 20);
	}

	//game over code
	if(lives < 1)
	{
		push();
		textSize(100);
		fill(255, 0, 0);
		text("GAME OVER", (width / 2) - 300, (height / 2) - 100);
		textSize(40);
		text("press space to continue", (width / 2) - 200, (height / 2) - 40);
		pop();
		return;
	}

	//levelUP

	if(flagpole.isReached)
	{
		push();
		textSize(80);
		strokeWeight(5);
		stroke(255);
		fill(0, 255, 255);
		text("LEVEL COMPLETE", (width / 2) - 350, (height / 2) - 100);
		textSize(40);
		text("press space to continue", (width / 2) - 210, (height / 2) - 40);
		pop();
		return;
	}

	//scroll
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5;
		}
	}

	//gravity nd stuff

	if (gameChar_y < floorPos_y)
    {
        isFalling = true;
        gameChar_y += 2;
	}
	if(gameChar_y == floorPos_y)
	{
		isFalling = false;
	}

	//no characters IN the ground pls

	if(gameChar_y > floorPos_y)
	{
		isLeft = false;
		isRight = false;
	}

	//restart level when character falls
	if(gameChar_y >= height && lives > 0)
	{	
		startGame(); 
	}

	// Update real position of gameChar
	gameChar_world_x = gameChar_x - scrollPos;

}


// ---------------------
// ~ Key control functions 
// ---------------------

function keyPressed(){

	if(flagpole.isReached && key == ' ')
    {
        nextLevel();
        return;
    }
    else if(lives == 0 && key == ' ')
    {
        returnToStart();
        return;
    }

	console.log("press" + keyCode);
	console.log("press" + key);

	if (keyCode === LEFT_ARROW)
	{
		isLeft = true;
	}
	if (keyCode === RIGHT_ARROW)
	{
		isRight = true;
	}
    if (keyCode === 32 && gameChar_y == floorPos_y)
	{
		gameChar_y -= 150;
	}

}

function keyReleased()
{

	console.log("release" + keyCode);
	console.log("release" + key);

	if (keyCode === LEFT_ARROW)
    {
        isLeft = false;
    }
    if (keyCode === RIGHT_ARROW)
    {
        isRight = false;
    }

}

function drawGameChar()
{

	if(isLeft && isFalling)
	{

		fill(0);
    	rect(gameChar_x - 10, gameChar_y - 15,
        	20,
            10);
     	stroke(255);
     	line(gameChar_x,//boots*
         	gameChar_y-5,
         	gameChar_x,
         	gameChar_y - 15);
    	noStroke();
    	fill(255, 185, 81);
    	rect(gameChar_x - 7,//character's right leg
            gameChar_y - 20,
            4,
            5);
      	rect(gameChar_x + 3,//character's left leg
            gameChar_y - 20,
         	4,
         	5);
    	fill(0);
    	quad(gameChar_x - 7,//black skirt
         	gameChar_y - 35,
         	gameChar_x + 7,
         	gameChar_y - 35,
         	gameChar_x + 17,
         	gameChar_y - 20,
         	gameChar_x - 17,
         	gameChar_y - 20);
    	stroke(10,255,206);
    	fill(10,255,206);
    	rect(gameChar_x - 17,//skirt detail
         	gameChar_y - 20,
         	34,
         	2);
    
    	push();
    
    	noFill();
    	triangle(gameChar_x - 12,//moar detail
            gameChar_y - 27,
            gameChar_x,
            gameChar_y - 27,
            gameChar_x - 5,
            gameChar_y - 20);
    	triangle(gameChar_x,
            gameChar_y - 27,//moar detail x 2
            gameChar_x + 12,
            gameChar_y - 27,
            gameChar_x + 5,
            gameChar_y - 20);
    
    	pop();
    
    	quad(gameChar_x - 7, //aqua waist cinch
         	gameChar_y - 35,
         	gameChar_x + 7,
        	gameChar_y - 35,
         	gameChar_x + 4,
         	gameChar_y - 40,
         	gameChar_x - 4,
         	gameChar_y - 40);
    
    	noFill();
    	stroke(0);
    	line(gameChar_x - 4,//cwoss
        	gameChar_y - 39,
         	gameChar_x + 4,
         	gameChar_y - 36);
    	line(gameChar_x + 4,
         	gameChar_y - 39,
         	gameChar_x - 4,
         	gameChar_y - 36);
    
    	noStroke();
    	fill(255,185,81);
    	rect(gameChar_x - 7,//shoulders nd arms
         	gameChar_y - 55,
         	14,
         	10); 
    	rect(gameChar_x - 12,
         	gameChar_y - 55,
         	24,
         	7);
    	rect(gameChar_x - 12,
         	gameChar_y - 75,
         	3,
         	20);
    	rect(gameChar_x + 9,
         	gameChar_y - 55,
         	3,
         	20);
    
    	noStroke();
    	fill(0);
    	rect(gameChar_x - 8,//straps
          	gameChar_y - 55,
         	3,
         	8);
    	rect(gameChar_x + 5,
         	gameChar_y - 55,
         	3,
         	8);
    
    	stroke(10,255,206);  
    	fill(0);
    	quad(gameChar_x - 4,//black top
         	gameChar_y - 40,
         	gameChar_x + 4,
         	gameChar_y - 40,
         	gameChar_x + 8,
         	gameChar_y - 48,
         	gameChar_x - 8,
         	gameChar_y - 48);
  
    	noStroke();
    	fill(255,185,81);
    	rect(gameChar_x - 2,//neck
         	gameChar_y - 57,
         	4, 
         	2);
    	rect(gameChar_x - 5,//head
         	gameChar_y - 70,
         	10,
         	13);
    	stroke(0);
    	fill(10,255,206);
    	rect(gameChar_x - 6,//skii shades
        	gameChar_y - 66,
         	11,
         	3);
    
    	stroke(255,0,0);
    	line(gameChar_x - 4,//SMILE
         	gameChar_y - 61,
         	gameChar_x - 1,
         	gameChar_y - 59);
    	line(gameChar_x - 1,
         	gameChar_y - 59,
         	gameChar_x + 2,
         	gameChar_y - 61);
    
    	noStroke();
    	fill(0);
    	rect(gameChar_x - 4,//fringe
         	gameChar_y - 70,
         	8,
         	3);
    	rect(gameChar_x - 10,//hurr
         	gameChar_y - 73,
         	20,
         	3);
    	rect(gameChar_x - 10,//hurr
         	gameChar_y - 73,
         	5,
         	15);
    	rect(gameChar_x + 5,//hurr
         	gameChar_y - 73,
         	5,
         	15);

	}

	else if(isRight && isFalling)
	{
		fill(0);
    	rect(gameChar_x - 10,//BIG 'OL BLACK BOOT
         	gameChar_y - 15,
         	20,
         	10
         	);
    	stroke(255);
    	line(gameChar_x,//boots*
         	gameChar_y-5,
         	gameChar_x,
         	gameChar_y - 15);
    	noStroke();
    	fill(255, 185, 81);
    	rect(gameChar_x - 7,//character's right leg
         	gameChar_y - 20,
         	4,
         	5);
    	rect(gameChar_x + 3,//character's left leg
         	gameChar_y - 20,
         	4,
         	5);
    	fill(0);
    	quad(gameChar_x - 7,//black skirt
         	gameChar_y - 35,
         	gameChar_x + 7,
         	gameChar_y - 35,
         	gameChar_x + 17,
         	gameChar_y - 20,
         	gameChar_x - 17,
         	gameChar_y - 20);
    	stroke(10,255,206);
    	fill(10,255,206);
    	rect(gameChar_x - 17,//skirt detail
         	gameChar_y - 20,
         	34,
         	2);
    
    	push();
    
    	noFill();
    	triangle(gameChar_x - 12,//moar detail
            gameChar_y - 27,
            gameChar_x,
            gameChar_y - 27,
            gameChar_x - 5,
            gameChar_y - 20);
    	triangle(gameChar_x,
            gameChar_y - 27,//moar detail x 2
            gameChar_x + 12,
            gameChar_y - 27,
            gameChar_x + 5,
            gameChar_y - 20);
    
    	pop();
    
    	quad(gameChar_x - 7, //aqua waist cinch
         	gameChar_y - 35,
         	gameChar_x + 7,
         	gameChar_y - 35,
         	gameChar_x + 4,
         	gameChar_y - 40,
         	gameChar_x - 4,
         	gameChar_y - 40);
    
    	noFill();
    	stroke(0);
    	line(gameChar_x - 4,//cwoss
         	gameChar_y - 39,
         	gameChar_x + 4,
         	gameChar_y - 36);
    	line(gameChar_x + 4,
         	gameChar_y - 39,
         	gameChar_x - 4,
         	gameChar_y - 36);
    
    	noStroke();
    	fill(255,185,81);
    	rect(gameChar_x - 7,//shoulders nd arms
         	gameChar_y - 55,
         	14,
         	10); 
    	rect(gameChar_x - 12,
         	gameChar_y - 55,
         	24,
         	7);
    	rect(gameChar_x - 12,
         	gameChar_y - 55,
         	3,
         	20);
    	rect(gameChar_x + 9,
         	gameChar_y - 75,
        	3,
         	20);
    
    	noStroke();
    	fill(0);
    	rect(gameChar_x - 8,//straps
         	gameChar_y - 55,
         	3,
         	8);
    	rect(gameChar_x + 5,
         	gameChar_y - 55,
         	3,
         	8);
    
    	stroke(10,255,206);  
    	fill(0);
    	quad(gameChar_x - 4,//black top
         	gameChar_y - 40,
         	gameChar_x + 4,
         	gameChar_y - 40,
         	gameChar_x + 8,
         	gameChar_y - 48,
         	gameChar_x - 8,
         	gameChar_y - 48);
  
    	noStroke();
    	fill(255,185,81);
    	rect(gameChar_x - 2,//neck
         	gameChar_y - 57,
         	4, 
         	2);
    	rect(gameChar_x - 5,//head
         	gameChar_y - 70,
         	10,
         	13);
    	stroke(0);
    	fill(10,255,206);
    	rect(gameChar_x - 6,//skii shades
         	gameChar_y - 66,
         	11,
         	3);
    
    	stroke(255,0,0);
    	line(gameChar_x - 4,//SMILE
         	gameChar_y - 61,
         	gameChar_x - 1,
         	gameChar_y - 59);
    	line(gameChar_x - 1,
         	gameChar_y - 59,
         	gameChar_x + 2,
         	gameChar_y - 61);
    
    	noStroke();
    	fill(0);
    	rect(gameChar_x - 4,//fringe
         	gameChar_y - 70,
         	8,
         	3);
    	rect(gameChar_x - 10,//hurr
         	gameChar_y - 73,
         	20,
         	3);
    	rect(gameChar_x - 10,//hurr
         	gameChar_y - 73,
         	5,
         	15);
    	rect(gameChar_x + 5,//hurr
         	gameChar_y - 73,
         	5,
         	15);
	}

	else if(isLeft)
	{
		fill(0);
    	rect(gameChar_x - 10,//BIG 'OL BLACK BOOT
         	gameChar_y - 10,
         	20,
         	10
         	);
    	stroke(255);
    	line(gameChar_x,//boots*
         	gameChar_y,
         	gameChar_x,
         	gameChar_y - 10);
    	noStroke();
    	fill(255, 185, 81);
    	rect(gameChar_x - 8,//character's right leg
         	gameChar_y - 20,
         	4,
         	10);
    	rect(gameChar_x + 2,//character's left leg
         	gameChar_y - 20,
         	4,
         	10);
    	fill(0);
    	quad(gameChar_x - 7,//black skirt
         	gameChar_y - 35,
         	gameChar_x + 7,
         	gameChar_y - 35,
         	gameChar_x + 17,
         	gameChar_y - 20,
         	gameChar_x - 17,
         	gameChar_y - 20);
    	stroke(10,255,206);
    	fill(10,255,206);
    	rect(gameChar_x - 17,//skirt detail
         	gameChar_y - 20,
         	34,
         	2);
    
    	push();
    
    	noFill();
    	triangle(gameChar_x - 12,//moar detail
            gameChar_y - 27,
            gameChar_x,
            gameChar_y - 27,
            gameChar_x - 5,
            gameChar_y - 20);
    	triangle(gameChar_x,
            gameChar_y - 27,//moar detail x 2
            gameChar_x + 12,
            gameChar_y - 27,
            gameChar_x + 5,
            gameChar_y - 20);
    
    	pop();
    
    	quad(gameChar_x - 7, //aqua waist cinch
         	gameChar_y - 35,
         	gameChar_x + 7,
         	gameChar_y - 35,
         	gameChar_x + 4,
         	gameChar_y - 40,
         	gameChar_x - 4,
         	gameChar_y - 40);
    
    	noFill();
    	stroke(0);
    	line(gameChar_x - 4,//cwoss
         	gameChar_y - 39,
         	gameChar_x + 4,
         	gameChar_y - 36);
    	line(gameChar_x + 4,
         	gameChar_y - 39,
         	gameChar_x - 4,
         	gameChar_y - 36);
    
    	noStroke();
    	fill(255,185,81);
    	rect(gameChar_x - 7,//shoulders nd arms
         	gameChar_y - 55,
         	14,
         	10); 
    	rect(gameChar_x - 12,
         	gameChar_y - 55,
         	24,
         	7);
    	rect(gameChar_x - 12,
         	gameChar_y - 55,
         	3,
         	20);
    	rect(gameChar_x + 9,
         	gameChar_y - 55,
         	3,
         	20);
    
    	noStroke();
    	fill(0);
    	rect(gameChar_x - 8,//straps
         	gameChar_y - 55,
         	3,
         	8);
    	rect(gameChar_x + 5,
         	gameChar_y - 55,
         	3,
         	8);
    
    	stroke(10,255,206);  
    	fill(0);
    	quad(gameChar_x - 4,//black top
         	gameChar_y - 40,
         	gameChar_x + 4,
         	gameChar_y - 40,
         	gameChar_x + 8,
         	gameChar_y - 48,
         	gameChar_x - 8,
         	gameChar_y - 48);
  
    	noStroke();
    	fill(255,185,81);
    	rect(gameChar_x - 2,//neck
         	gameChar_y - 57,
         	4, 
         	2);
    	rect(gameChar_x - 5,//head
         	gameChar_y - 70,
         	10,
         	13);
    	stroke(0);
    	fill(10,255,206);
    	rect(gameChar_x - 6,//skii shades
         	gameChar_y - 66,
         	11,
         	3);
    
    	stroke(255,0,0);
    	line(gameChar_x - 4,//SMILE
         	gameChar_y - 61,
         	gameChar_x - 1,
         	gameChar_y - 59);
    	line(gameChar_x - 1,
         	gameChar_y - 59,
         	gameChar_x + 2,
         	gameChar_y - 61);
    
    	noStroke();
    	fill(0);
    	rect(gameChar_x - 4,//fringe
         	gameChar_y - 70,
         	8,
         	3);
    	rect(gameChar_x - 10,//hurr
         	gameChar_y - 73,
         	20,
         	3);
    	rect(gameChar_x - 10,//hurr
         	gameChar_y - 73,
         	5,
         	15);
    	rect(gameChar_x + 5,//hurr
         	gameChar_y - 73,
         	5,
         	15);
	}
    
	else if(isRight)    
	{
		fill(0);
    	rect(gameChar_x - 10,//BIG 'OL BLACK BOOT
         	gameChar_y - 10,
         	20,
         	10);
    	stroke(255);
    	line(gameChar_x,//boots*
         	gameChar_y,
         	gameChar_x,
         	gameChar_y - 10);
    	noStroke();
    	fill(255, 185, 81);
    	rect(gameChar_x - 6,//character's right leg
         	gameChar_y - 20,
         	4,
         	10);
    	rect(gameChar_x + 4,//character's left leg
         	gameChar_y - 20,
         	4,
         	10);
    	fill(0);
    	quad(gameChar_x - 7,//black skirt
         	gameChar_y - 35,
         	gameChar_x + 7,
         	gameChar_y - 35,
         	gameChar_x + 17,
         	gameChar_y - 20,
         	gameChar_x - 17,
         	gameChar_y - 20);
    	stroke(10,255,206);
    	fill(10,255,206);
    	rect(gameChar_x - 17,//skirt detail
         	gameChar_y - 20,
         	34,
         	2);
    
    	push();
    
    	noFill();
    	triangle(gameChar_x - 12,//moar detail
            gameChar_y - 27,
            gameChar_x,
            gameChar_y - 27,
            gameChar_x - 5,
            gameChar_y - 20);
    	triangle(gameChar_x,
            gameChar_y - 27,//moar detail x 2
            gameChar_x + 12,
            gameChar_y - 27,
            gameChar_x + 5,
            gameChar_y - 20);
    
    	pop();
    
    	quad(gameChar_x - 7, //aqua waist cinch
         	gameChar_y - 35,
         	gameChar_x + 7,
         	gameChar_y - 35,
         	gameChar_x + 4,
         	gameChar_y - 40,
         	gameChar_x - 4,
         	gameChar_y - 40);
    
    	noFill();
    	stroke(0);
    	line(gameChar_x - 4,//cwoss
         	gameChar_y - 39,
         	gameChar_x + 4,
         	gameChar_y - 36);
    	line(gameChar_x + 4,
         	gameChar_y - 39,
         	gameChar_x - 4,
         	gameChar_y - 36);
    
    	noStroke();
    	fill(255,185,81);
    	rect(gameChar_x - 7,//shoulders nd arms
         	gameChar_y - 55,
         	14,
         	10); 
    	rect(gameChar_x - 12,
         	gameChar_y - 55,
         	24,
         	7);
    	rect(gameChar_x - 12,
         	gameChar_y - 55,
         	3,
         	20);
    	rect(gameChar_x + 9,
         	gameChar_y - 55,
         	3,
         	20);
    
    	noStroke();
    	fill(0);
    	rect(gameChar_x - 8,//straps
         	gameChar_y - 55,
         	3,
         	8);
    	rect(gameChar_x + 5,
         	gameChar_y - 55,
         	3,
         	8);
    
    	stroke(10,255,206);  
    	fill(0);
    	quad(gameChar_x - 4,//black top
         	gameChar_y - 40,
         	gameChar_x + 4,
         	gameChar_y - 40,
         	gameChar_x + 8,
         	gameChar_y - 48,
         	gameChar_x - 8,
         	gameChar_y - 48);
  
    	noStroke();
    	fill(255,185,81);
    	rect(gameChar_x - 2,//neck
         	gameChar_y - 57,
         	4, 
         	2);
    	rect(gameChar_x - 5,//head
         	gameChar_y - 70,
         	10,
         	13);
    	stroke(0);
    	fill(10,255,206);
    	rect(gameChar_x - 6,//skii shades
         	gameChar_y - 66,
         	11,
         	3);
    
    	stroke(255,0,0);
    	line(gameChar_x - 3,//SMILE
         	gameChar_y - 61,
         	gameChar_x,
         	gameChar_y - 59);
    	line(gameChar_x,
         	gameChar_y - 59,
         	gameChar_x + 3,
         	gameChar_y - 61);
    
   	 	noStroke();
    	fill(0);
    	rect(gameChar_x - 4,//fringe
         	gameChar_y - 70,
         	8,
         	3);
    	rect(gameChar_x - 10,//hurr
         	gameChar_y - 73,
         	20,
         	3);
    	rect(gameChar_x - 10,//hurr
         	gameChar_y - 73,
         	5,
         	15);
    	rect(gameChar_x + 5,//hurr
         	gameChar_y - 73,
         	5,
         	15);
	}

	else if(isFalling || isPlummeting)
	{
        fill(0);
        rect(gameChar_x - 10,//BIG 'OL BLACK BOOT
            gameChar_y - 15,
            20,
            10);
        stroke(255);
        line(gameChar_x,//boots*
            gameChar_y-5,
            gameChar_x,
            gameChar_y - 15);
        noStroke();
        fill(255, 185, 81);
        rect(gameChar_x - 7,//character's right leg
            gameChar_y - 20,
            4,
            5);
        rect(gameChar_x + 3,//character's left leg
            gameChar_y - 20,
            4,
            5);
        fill(0);
        quad(gameChar_x - 7,//black skirt
            gameChar_y - 35,
            gameChar_x + 7,
            gameChar_y - 35,
            gameChar_x + 17,
            gameChar_y - 20,
            gameChar_x - 17,
            gameChar_y - 20);
        stroke(10,255,206);
        fill(10,255,206);
        rect(gameChar_x - 17,//skirt detail
            gameChar_y - 20,
            34,
            2);
          
        push();
          
        noFill();
        triangle(gameChar_x - 12,//moar detail
            gameChar_y - 27,
            gameChar_x,
            gameChar_y - 27,
            gameChar_x - 5,
            gameChar_y - 20);
        triangle(gameChar_x,
            gameChar_y - 27,//moar detail x 2
            gameChar_x + 12,
            gameChar_y - 27,
            gameChar_x + 5,
            gameChar_y - 20);
          
        pop();
          
        quad(gameChar_x - 7, //aqua waist cinch
            gameChar_y - 35,
            gameChar_x + 7,
            gameChar_y - 35,
            gameChar_x + 4,
            gameChar_y - 40,
            gameChar_x - 4,
            gameChar_y - 40);
          
        noFill();
        stroke(0);
        line(gameChar_x - 4,//cwoss
            gameChar_y - 39,
            gameChar_x + 4,
            gameChar_y - 36);
        line(gameChar_x + 4,
            gameChar_y - 39,
            gameChar_x - 4,
            gameChar_y - 36);
          
        noStroke();
        fill(255,185,81);
        rect(gameChar_x - 7,//shoulders nd arms
            gameChar_y - 55,
            14,
            10); 
        rect(gameChar_x - 12,
            gameChar_y - 55,
            24,
            7);
        rect(gameChar_x - 12,
            gameChar_y - 75,
            3,
            20);
        rect(gameChar_x + 9,
            gameChar_y - 75,
            3,
            20);
          
        noStroke();
        fill(0);
        rect(gameChar_x - 8,//straps
            gameChar_y - 55,
            3,
            8);
        rect(gameChar_x + 5,
            gameChar_y - 55,
            3,
            8);
          
        stroke(10,255,206);  
        fill(0);
        quad(gameChar_x - 4,//black top
            gameChar_y - 40,
            gameChar_x + 4,
            gameChar_y - 40,
            gameChar_x + 8,
            gameChar_y - 48,
            gameChar_x - 8,
            gameChar_y - 48);
        
        noStroke();
        fill(255,185,81);
        rect(gameChar_x - 2,//neck
            gameChar_y - 57,
            4, 
            2);
        rect(gameChar_x - 5,//head
            gameChar_y - 70,
            10,
            13);
        stroke(0);
        fill(10,255,206);
        rect(gameChar_x - 6,//skii shades
            gameChar_y - 66,
            11,
            3);
          
        stroke(255,0,0);
        line(gameChar_x - 4,//SMILE
            gameChar_y - 61,
            gameChar_x - 1,
            gameChar_y - 59);
        line(gameChar_x - 1,
            gameChar_y - 59,
            gameChar_x + 2,
            gameChar_y - 61);
          
        noStroke();
        fill(0);
        rect(gameChar_x - 4,//fringe
            gameChar_y - 70,
            8,
            3);
        rect(gameChar_x - 10,//hurr
            gameChar_y - 73,
            20,
            3);
        rect(gameChar_x - 10,//hurr
            gameChar_y - 73,
            5,
            15);
        rect(gameChar_x + 5,//hurr
            gameChar_y - 73,
            5,
			15);
			
    }

	else
	{
		fill(0);
    	rect(gameChar_x - 10,//BIG 'OL BLACK BOOT
        	gameChar_y - 10,
        	20,
         	10);
    	stroke(255);
    	line(gameChar_x,//boots*
         	gameChar_y,
         	gameChar_x,
         	gameChar_y - 10);
    	noStroke();
    	fill(255, 185, 81);
    	rect(gameChar_x - 7,//character's right leg
         	gameChar_y - 20,
         	4,
         	10);
    	rect(gameChar_x + 3,//character's left leg
         	gameChar_y - 20,
         	4,
         	10);
    	fill(0);
    	quad(gameChar_x - 7,//black skirt
         	gameChar_y - 35,
         	gameChar_x + 7,
         	gameChar_y - 35,
         	gameChar_x + 17,
         	gameChar_y - 20,
         	gameChar_x - 17,
         	gameChar_y - 20);
    	stroke(10,255,206);
    	fill(10,255,206);
    	rect(gameChar_x - 17,//skirt detail
         	gameChar_y - 20,
         	34,
         	2);
    
    	push();
    
    	noFill();
    	triangle(gameChar_x - 12,//moar detail
            gameChar_y - 27,
            gameChar_x,
            gameChar_y - 27,
            gameChar_x - 5,
            gameChar_y - 20);
    	triangle(gameChar_x,
            gameChar_y - 27,//moar detail x 2
            gameChar_x + 12,
            gameChar_y - 27,
            gameChar_x + 5,
            gameChar_y - 20);
    
    	pop();
    
    	quad(gameChar_x - 7, //aqua waist cinch
         	gameChar_y - 35,
         	gameChar_x + 7,
         	gameChar_y - 35,
         	gameChar_x + 4,
         	gameChar_y - 40,
         	gameChar_x - 4,
         	gameChar_y - 40);
    
    	noFill();
    	stroke(0);
    	line(gameChar_x - 4,//cwoss
         	gameChar_y - 39,
         	gameChar_x + 4,
         	gameChar_y - 36);
    	line(gameChar_x + 4,
         	gameChar_y - 39,
         	gameChar_x - 4,
         	gameChar_y - 36);
    
    	noStroke();
    	fill(255,185,81);
    	rect(gameChar_x - 7,//shoulders nd arms
         	gameChar_y - 55,
         	14,
         	10); 
    	rect(gameChar_x - 12,
         	gameChar_y - 55,
         	24,
         	7);
    	rect(gameChar_x - 12,
         	gameChar_y - 55,
         	3,
         	20);
    	rect(gameChar_x + 9,
         	gameChar_y - 55,
         	3,
         	20);
    
    	noStroke();
    	fill(0);
    	rect(gameChar_x - 8,//straps
         	gameChar_y - 55,
         	3,
         	8);
   	 	rect(gameChar_x + 5,
         	gameChar_y - 55,
         	3,
         	8);
    
    	stroke(10,255,206);  
    	fill(0);
    	quad(gameChar_x - 4,//black top
         	gameChar_y - 40,
         	gameChar_x + 4,
         	gameChar_y - 40,
         	gameChar_x + 8,
         	gameChar_y - 48,
         	gameChar_x - 8,
         	gameChar_y - 48);
  
    	noStroke();
    	fill(255,185,81);
    	rect(gameChar_x - 2,//neck
         	gameChar_y - 57,
         	4, 
         	2);
    	rect(gameChar_x - 5,//head
         	gameChar_y - 70,
         	10,
         	13);
    	stroke(0);
    	fill(10,255,206);
    	rect(gameChar_x - 6,//skii shades
         	gameChar_y - 66,
         	11,
         	3);
    
    	stroke(255,0,0);
    	line(gameChar_x - 4,//SMILE
         	gameChar_y - 61,
         	gameChar_x - 1,
         	gameChar_y - 59);
    	line(gameChar_x - 1,
         	gameChar_y - 59,
         	gameChar_x + 2,
         	gameChar_y - 61);
    
    	noStroke();
    	fill(0);
    	rect(gameChar_x - 4,//fringe
         	gameChar_y - 70,
         	8,
         	3);
    	rect(gameChar_x - 10,//hurr
         	gameChar_y - 73,
         	20,
         	3);
    	rect(gameChar_x - 10,//hurr
         	gameChar_y - 73,
         	5,
         	15);
    	rect(gameChar_x + 5,//hurr
         	gameChar_y - 73,
         	5,
		 	15);
	}

}

function drawClouds()
{
	for(var i = 0; i < clouds.length; i++)
	{
		fill(20);
		ellipse(clouds[i].x, 
			clouds[i].y - (10 * clouds[i].size),
			(30 * clouds[i].size) );
		ellipse(clouds[i].x,
			clouds[i].y + (10 * clouds[i].size),
			(30 * clouds[i].size) );
		ellipse(clouds[i].x + (20 * clouds[i].size),
			clouds[i].y,
			(30 * clouds[i].size) );
		ellipse(clouds[i].x - (20 * clouds[i].size),
			clouds[i].y,
			(30 * clouds[i].size) );
	}
}

function drawMountains()
{
	for(var i = 0; i < mountains.length; i++)
	{
		stroke(255);
		line(mountains[i].x, 
			mountains[i].y,
			mountains[i].x + (100 * mountains[i].size),
			mountains[i].y - (200 * mountains[i].size) );
		line(mountains[i].x + (100 * mountains[i].size), 
			mountains[i].y - (200 * mountains[i].size),
			mountains[i].x + (200 * mountains[i].size), 
			mountains[i].y);
		noStroke();
	}
}

function drawTrees()
{
	for(var i = 0; i < trees.length; i++)
	{
		fill(0);
		rect(trees[i].x - (10 * trees[i].size),
			trees[i].y - (60 * trees[i].size),
			(20 * trees[i].size),
			(60 * trees[i].size) );
		fill(7,69,0);
		rect(trees[i].x - (50 * trees[i].size),
			trees[i].y - (80 * trees[i].size),
			(100 * trees[i].size),
			(20 * trees[i].size) );
		fill(9, 94,0);
		rect(trees[i].x - (30 * trees[i].size),
			trees[i].y - (100 * trees[i].size),
			(60 * trees[i].size),
			(10 * trees[i].size) );
		fill(17,168,0);
		rect(trees[i].x - (15 * trees[i].size),
			trees[i].y - (112 * trees[i].size),
			(30 * trees[i].size),
			(5 * trees[i].size) );
	}
}

function drawCollectables(t_collectable)
{
	
	fill(255,215,0);
	stroke(0);
	ellipse(t_collectable.x,
			t_collectable.y - (50 * (t_collectable.size * 0.75) ) ,
			(50 * (t_collectable.size * 0.75) ) );
	fill(139,0,0);
	noStroke();
	ellipse(t_collectable.x,
			t_collectable.y - (50 * (t_collectable.size * 0.75) ) ,
			(10 * (t_collectable.size * 0.75) ),
			(50 * (t_collectable.size * 0.75) ) );
	fill(127,255,0);
	ellipse(t_collectable.x,
			t_collectable.y - (50 * (t_collectable.size * 0.75) ) ,
			(7 * (t_collectable.size * 0.75) ) );
	
}

function checkCollectable(t_collectable)
{
	var d = dist(gameChar_world_x, gameChar_y, t_collectable.x, t_collectable.y)
	if (d < 40)
	{
		t_collectable.isFound = true;  
		game_score += (10 * t_collectable.size) ; 
	}
}

function drawCanyons(t_canyon)
{

	fill(0);
	quad(t_canyon.x,
		t_canyon.y,
		t_canyon.x + 80,
		t_canyon.y,
		t_canyon.x + 80,
		t_canyon.y + 144,
		t_canyon.x,
		t_canyon.y + 144); 
	fill(255,110,0);
	quad(t_canyon.x + 80,
		t_canyon.y + 144,
		t_canyon.x,
		t_canyon.y + 144,
		t_canyon.x,
		t_canyon.y + 118,
		t_canyon.x + 80,
		t_canyon.y + 118);
	fill(75);
	ellipse(t_canyon.x + 40,
		t_canyon.y + 128,
		25,
		10);
	fill(100);
	triangle(t_canyon.x + 35,
		t_canyon.y + 128,
		t_canyon.x + 45,
		t_canyon.y + 128,
		t_canyon.x + 40,
		t_canyon.y + 108);
}

function checkCanyon(t_canyon)
{
	if (gameChar_world_x > t_canyon.x + 15 && gameChar_world_x < t_canyon.x + 60
    	&& gameChar_y >= floorPos_y - 30)
    {
        isPlummeting = true;
        gameChar_y += 10;
	}
		
	else
	{
		isPlummeting = false;
	}
}



function renderFlagpole()
{
	push();
	stroke(150);
	strokeWeight(5);
	line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 200);

	if(flagpole.isReached)
	{
		noStroke();
		fill(0, 255, 255);
		rect(flagpole.x_pos, floorPos_y - 200, 50, 50);
	}
	else
	{
		noStroke();
		fill(0, 255, 255);
		rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
	}
	pop();

}

function checkFlagpole()
{
	var d = abs(gameChar_world_x - flagpole.x_pos);

	if(d < 50)
	{
		flagpole.isReached = true;
	}
}

function startGame()
{
	
	enemies = [];
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
	clouds_y = (height/4) - 50;

	scrollPos = 0;

	gameChar_world_x = gameChar_x - scrollPos;

	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	trees = [{x: 260, y: floorPos_y, size: 3} , {x: 740, y: floorPos_y, size: 1}, {x: 850, y: floorPos_y, size: 1}, {x: 960, y: floorPos_y, size: 1}, {x: 1600, y: floorPos_y, size: 1}, {x: 2000, y: floorPos_y, size: 2}, {x: 2300, y:floorPos_y, size: 2}];
	clouds = [{x: 100, y: clouds_y, size: 1}, {x: 300, y: clouds_y, size: 2}, {x: 600, y: clouds_y, size: 3}, { x: 1000, y: clouds_y, size: 4}, {x: 1250, y: clouds_y, size: 2}, {x: 1400, y: clouds_y + 25, size: 2}, {x: 1550, y: clouds_y + 50, size: 2}];
	mountains = [{x: 700, y: floorPos_y, size: 1}, {x: 750, y:floorPos_y, size: 1.5}, {x: 1300, y: floorPos_y, size: 1.8}, {x: 1425, y: floorPos_y, size: 1.5}, {x: 1500, y: floorPos_y, size: 1.8}, {x: 1900, y: floorPos_y, size: 0.9}, {x: 2000, y: floorPos_y, size: 0.4}, {x: 2075, y: floorPos_y, size: 0.3}];
	canyons = [{x: 600, y: floorPos_y}, {x: 1025, y: floorPos_y}, {x: 1300, y: floorPos_y}, {x: 2100, y: floorPos_y}];
	collectables = [{x: 740, y: floorPos_y, isFound: false, size: 1}, {x: 850, y: floorPos_y, isFound: false, size: 1}, {x: 960, y: floorPos_y, isFound: false, size: 1}, {x: 2000, y: floorPos_y, isFound: false, size: 2}];

	isFound = false;

	game_score = 0;

	flagpole = {
		x_pos: 2200,
		isReached: false
	}

	lives -= 1;

	enemies.push(new Enemy(740, floorPos_y, 220));
}

function Enemy(x, y, range)
{
	this.x = x;
	this.y = y;
	this.range = range; 
	this.current_x = x;
	this.incr = 2;

	this.draw = function()
	{
		push();
		strokeWeight(5);
		stroke(0, 255, 255);
		fill(255);
		triangle(this.current_x - 30, this.y - 50,
			this.current_x + 30, this.y - 50,
			this.current_x, this.y);
		strokeWeight(2);
		stroke(0);
		line(this.current_x - 5, this.y - 40,
			this.current_x - 20, this.y - 45);
		line(this.current_x + 5, this.y - 40,
			this.current_x + 20, this.y - 45);
		arc(this.current_x, this.y - 20, 10, 12, -PI, 0);
		pop();

	}

	this.update = function()
	{
		this.current_x += this.incr;

		if(this.current_x < this.x)
		{
			this.incr = 2;
		}
		else if(this.current_x > this.x + this.range)
		{
			this.incr = -2;
		}
	}

	this.isContact = function(gc_x, gc_y)
	{
		// returns true if collision occurs
		var d = dist(gc_x, gc_y, this.current_x, this.y);

		if(d < 30)
		{
			return true;
		}

		return false;
	}
} 