// MUST INCLUDE CONSTANTS.JS BEFORE THIS IN THE HTML
// ALL THE VARIABLES THAT CAN BE ADJUSTED SHOULD BE ADJUSTED IN CONSTANTS.JS

function Vector(x, y) {
  this.x = x;
  this.y = y;
  this.getMagnitude = getMagnitude;

  function getMagnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
}

// takes x, y coordinate to generate:
// position vector
// velocity vector
// acceleration vector
function Ball(x, y) {
  this.position = new Vector(x, y);
  this.velocity = generateRandomVector(-1, 1, -1, 1);
  this.acceleration = new Vector(0, 0);
  this.radius = generateRandomFrom(5, 20);
  this.update = update;
  this.handleEdges = handleEdges;
  this.handleCollision = handleCollision;

  var randomColorIndex = parseInt(
    generateRandomFrom(0, MY_BALLS_COLORS.length)
  );

  this.color = MY_BALLS_COLORS[randomColorIndex];

  function update() {
    this.position = addVectors(this.position, this.velocity);
    this.velocity = addVectors(this.velocity, this.acceleration);
    this.acceleration = multiplyVectorWithScalar(this.acceleration, 0);
  }

  // yesle chai edge ma check garcha
  function handleEdges(width, height) {
    // if ma left right wala else if ma top bottom wala
    if (
      this.position.x - this.radius <= 0 ||
      this.position.x + this.radius >= width
    ) {
      this.velocity.x = -this.velocity.x;
    } else if (
      this.position.y - this.radius <= 0 ||
      this.position.y + this.radius >= height
    ) {
      this.velocity.y = -this.velocity.y;
    }
  }

  function handleCollision(ball) {
    var distanceVector = subtractVectors(this.position, ball.position);
    var distanceVectorMagnitude = distanceVector.getMagnitude();

    // collision check and handling
    if (distanceVectorMagnitude <= this.radius + ball.radius) {
      // collision vector from two balls
      var vCollision = subtractVectors(this.position, ball.position);
      var distance = vCollision.getMagnitude();

      // this creates a normal vector between two balls that collide
      var vCollisionNorm = divideVectorWithScalar(vCollision, distance);

      var vRelativeVelocity = subtractVectors(ball.velocity, this.velocity);
      var speed =
        vRelativeVelocity.x * vCollisionNorm.x +
        vRelativeVelocity.y * vCollisionNorm.y;

      // if speed is negative they are moving away soo dont need to handle them
      // if speed is positive they move closer so handling the velocities here
      if (speed > 0) {
        ball.velocity.x -= speed * vCollisionNorm.x;
        ball.velocity.y -= speed * vCollisionNorm.y;
        this.velocity.x += speed * vCollisionNorm.x;
        this.velocity.y += speed * vCollisionNorm.y;
      }
    }
  }
}

function Canvas() {
  this.canvas = document.createElement("canvas");
  this.ctx = this.canvas.getContext("2d");
  this.setup = setup;
  this.update = update;
  document.body.appendChild(this.canvas);

  this.canvas.width = WIDTH;
  this.canvas.height = HEIGHT;
  this.canvas.style.background = MY_CANVAS_COLOR;
  this.setup();

  window.requestAnimationFrame(
    function () {
      return this.update();
    }.bind(this)
  );

  function setup() {
    this.myBalls = [];

    for (let i = 0; i < MY_BALLS_COUNT; i++) {
      var myNewBall = new Ball(
        generateRandomFrom(0, this.canvas.width),
        generateRandomFrom(0, this.canvas.height)
      );
      this.myBalls.push(myNewBall);
    }
  }

  function update() {
    // clear canvas for each repaint
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // checking each ball against eachother except for self
    for (var i = 0; i < this.myBalls.length; i++) {
      var myCurrentBall = this.myBalls[i];
      // removing checked balls
      var notMyCurrentBall = this.myBalls.slice(i + 1);

      for (var j = 0; j < notMyCurrentBall.length; j++) {
        notMyCurrentBall[j].handleCollision(myCurrentBall);
      }
    }

    // repaint my balls
    for (var i = 0; i < this.myBalls.length; i++) {
      var myBall = this.myBalls[i];
      myBall.update();
      myBall.handleEdges(this.canvas.width, this.canvas.height);

      this.ctx.fillStyle = myBall.color;
      this.ctx.fillStyle = this.ctx.beginPath();
      this.ctx.arc(
        myBall.position.x,
        myBall.position.y,
        myBall.radius,
        0,
        2 * Math.PI
      );
      this.ctx.fill();
    }

    window.requestAnimationFrame(
      function () {
        return this.update();
      }.bind(this)
    );
  }
}

// lord random number here
function generateRandomFrom(min, max) {
  return min + Math.random() * (max - min);
}

// vector operations below

function generateRandomVector(minX, maxX, minY, maxY) {
  return new Vector(
    generateRandomFrom(minX, maxX),
    generateRandomFrom(minY, maxY)
  );
}

function addVectors(vector1, vector2) {
  return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
}

function multiplyVectorWithScalar(vector, scalar) {
  return new Vector(vector.x * scalar, vector.y * scalar);
}

function subtractVectors(vector1, vector2) {
  return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
}

function divideVectorWithScalar(vector, scalar) {
  return new Vector(vector.x / scalar, vector.y / scalar);
}

new Canvas();
