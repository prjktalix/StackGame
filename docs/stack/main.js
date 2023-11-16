// The title of the game to be displayed on the title screen
title = "STACK";

// The description, which is also displayed on the title screen
description = `
Stack to the top\n
Press any\n
key to begin!
`;

let gameOverString = `Game over!`

// The array of custom sprites
characters = [
];

// Game design variable container
const G = {
	WIDTH: 100,
	HEIGHT: 150,
    TOTALSLAB: 40
};
let overlap = 50;

// Game runtime options
// Refer to the official documentation for all available options
options = {
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
    //isCapturing: true,
    //isCapturingGameCanvasOnly: true,
    //captureCanvasScale: 2,
    isPlayingBgm: true,
    //isReplayEnabled: true,
    theme: "crt"
};
/**
* 
    */
    
    let slabs; // slabs
    let debris;
    let fallingFlag; //flag for falling slab
    let currentSlab; //current slab
    let currentdebris;
    let debristhere = false;
    let debrisright = -1;


// The game loop function
function  update() {
	// The init function
	if (!ticks) {
        //generate a slab at the bottom as an init
        // might have to init an array instead?
        /*slabs.push({
            pos: vec(G.WIDTH/2,G.HEIGHT/2),
            speed: 1
        });*/
        // Initializing array of slabs (currently 10 for testing)
        slabs = times(G.TOTALSLAB, () => {
            // Random number generator function
            // rnd( min, max )
            const posX = G.WIDTH/2;
            const posY = G.HEIGHT-1;
            // An object of type Slab with appropriate properties
            return {
                // Creates a Vector
                pos: vec(posX, posY),
                // More RNG
                speed: 2,
                width: 50,
                
            };
        
        
        });
        //debris settings
        debris = times(G.TOTALSLAB, () => {
            // Random number generator function
            // rnd( min, max )
            const posX = G.WIDTH/2;
            const posY = G.HEIGHT-1;
            // An object of type Slab with appropriate properties
            return {
                // Creates a Vector
                pos: vec(posX, posY),
                // More RNG
                speed: 2,
                width: 50,
                
            };
        
        
        });

        // Choose a color to draw
        // playable
        color("light_black");
        // Draw the slab as a square of size 10
        //box(slabs[0].pos, 50,2);

        this.goingRight = true;
        currentSlab = 1;
        fallingFlag = false;
	}

    //making debrises can change its color
    color("green");
    for (let i = 0; i< G.TOTALSLAB; i++)
    {
        
        box(debris[i].pos, debris[i].width,2);
    }
    // update loop begins
        //console.log("x value: " + slabs[currentSlab].pos.x);
        //console.log("y value: " + slabs[currentSlab].pos.y);

    // Choose a color to draw
    color("green");
    // Draw the slab as a square of size 10
    for (let i = 0; i< G.TOTALSLAB; i++)
    {
        box(slabs[i].pos, slabs[i].width,2);

    }
    
    slabs[currentSlab].pos.y = 11; 
    slabs[currentSlab].width = overlap;

    

    if(input.isJustPressed && fallingFlag == false) // if space/mouse is pressed. this might be buggy. we'll see
    {
        //activate boolean
        fallingFlag = true;
        console.log("FALLING");
        currentSlab++;
    }
    
    if(!fallingFlag)
    {
        //debris falling
        debris[0].pos.y += debris[0].speed;
        debris[1].pos.y += debris[1].speed;
        
        
        // 11 is kind of a magic number; I just experimented until I found the right height
        // It's the height of the moving slab to be dropped. will add it as a const var in the const G container
        if(slabs[currentSlab].pos.x == G.WIDTH)
        {
            this.goingRight = false;
        }
        else if (slabs[currentSlab].pos.x == 0)
        {
            this.goingRight = true;
        }

        if(this.goingRight == true)
        {
            slabs[currentSlab].pos.x += slabs[currentSlab].speed; //move the slab on top back and forth
        }
        else if (this.goingRight == false) slabs[currentSlab].pos.x -= slabs[currentSlab].speed;
        // Choose a color to draw
        color("green");
        // Draw the slab as a rectangle
        box(slabs[currentSlab].pos, overlap,2); // this is the top slab

    } else{
        
        slabs[currentSlab - 1].pos.y += slabs[currentSlab - 1].speed;
        // Check collision, then turn falling flag back to false
        if(slabs[currentSlab - 1].pos.y + 2 >= slabs[currentSlab - 2].pos.y) {
            fallingFlag = false;
            play("powerUp");
            // Calculate the overlap between the current and the previous slab
            overlap = getOverlap(slabs[currentSlab - 1], slabs[currentSlab - 2]);
            

            if (overlap > 0) {
                // Adjust the width of the current slab
                
                slabs[currentSlab-1].width = overlap;
                
                
                // Position the current slab so the overlap is visually correct
                // if slab1.x is greater than slab2.x
                if(slabs[currentSlab-1].pos.x>slabs[currentSlab-2].pos.x)
                {
                    slabs[currentSlab-1].pos.x = slabs[currentSlab-2].pos.x + (slabs[currentSlab-2].width/2)-(slabs[currentSlab-1].width/2);

                    //spawning a debris for the right side
                    debris[1].pos.x = slabs[currentSlab-2].pos.x +slabs[currentSlab-2].width/2 + (slabs[currentSlab-2].width-overlap)/2;
                    debris[1].pos.y = slabs[currentSlab-1].pos.y;
                    debris[1].width = slabs[currentSlab-2].width-overlap;
                    debris[1].height = 2
                }
                else
                slabs[currentSlab-1].pos.x = slabs[currentSlab-2].pos.x- (slabs[currentSlab-2].width/2)+(slabs[currentSlab-1].width/2);
                
                
                
                // shift the x position so that the edge of slabs[currentSlab-1]
                // (calculated by pos.x + width/2) aligns with the edge of slabs[currentSlab-2]
                // slab1.x + slab1.width/2  = slab2.x + slab2.width/2
                // slab1.x = slab2.x + slab2.width/2-slab1.width/2
                // ^^^ ~the math~ ^^^
                // the signs are switched depending on which side of the old slab the new slab falls on
                // don't ask me why that works, it seemed right in my brain and it was right. peace and love on planet earth

                //spawning a debris for the left side
                if(slabs[currentSlab-1].pos.x<slabs[currentSlab-2].pos.x){
                    debrisright = 0;
                    debristhere = true;
                    
                    debris[0].pos.x = slabs[currentSlab-2].pos.x-slabs[currentSlab-2].width/2 - (slabs[currentSlab-2].width-overlap)/2;
                    debris[0].pos.y = slabs[currentSlab-1].pos.y
                    debris[0].width = slabs[currentSlab-2].width-overlap;
                    
                    
                }
                

            } else{
                play("explosion");
                end(gameOverString);
                overlap = 50;
                return;
            }

            // Prepare the next slab with the same width as the current slab
            if (currentSlab < G.TOTALSLAB - 1) {
                slabs[currentSlab].width = overlap;  // Set the width of the next slab to the overlap
                slabs[currentSlab].pos.x = G.WIDTH / 2;  // Center the next slab
                slabs[currentSlab].pos.y = 11;  // Set the height for the next slab to fall from
            }
            
            fallingFlag = false;
            addScore(1);
            console.log("HIT!!!!!!");
        }
    }

    function getOverlap(slab1, slab2) {
        // Calculate the left and right edges of THE slabs
        const left1 = slab1.pos.x - slab1.width / 2;
        const right1 = slab1.pos.x + slab1.width / 2;
        const left2 = slab2.pos.x - slab2.width / 2;
        const right2 = slab2.pos.x + slab2.width / 2;
    
        // Find the overlap range
        const maxLeft = Math.max(left1, left2);
        const minRight = Math.min(right1, right2);
    
        return Math.max(0, minRight - maxLeft);
    }
}
