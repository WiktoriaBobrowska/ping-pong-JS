// Zbuduj grę ping-pong. Po obu stronach planszy mamy rakietki w formie prostokątów,
// a pomiędzy nimi samodzielnie porusza się piłeczka. Rakietkami steruje się za
// pomocą klawiszy po to, aby odbijać piłeczkę. Ustaw warunki brzegowe tak, aby
// piłeczka odbijała się od rakietek oraz od górnych i dolnych granic stołu. Gracz
// zdobywa punkt jeśli wyjdzie piłeczka poza stół na stronie przeciwnika. Informacja
// o zdobytych punktach jest umieszczana w elementach '<p>'. Gra toczy się do
// uzyskania 21 punktów. 

const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d');
const p = document.querySelector('p');
const div = document.querySelector('div');

const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    vx : 5,
    vy : 5,
    speed : 2,
    color : "WHITE"
}

const user = {
    x : 0, // left side of canvas
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "#821704"
}
const user2 = {
    x : canvas.width - 10, // - width of paddle
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "#821704"
}
const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "WHITE"
}

function drawRectangle(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

document.addEventListener('keydown', function(e){
	e.preventDefault();
	if(e.code == "KeyW") user.y -=20;
	else if(e.code == "KeyS") user.y +=20;
});

document.addEventListener('keydown', function(e){
	e.preventDefault();
	if(e.code == "ArrowUp") user2.y -=20;
	else if(e.code == "ArrowDown") user2.y +=20;
});

function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.vx = -ball.vx;
    ball.speed = 7;
}

function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRectangle
    (net.x, net.y + i, net.width, net.height, net.color);
    }
}

function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function update(){
    
    if( user.score <= 20 && user2.score <= 20){
    if( ball.x - ball.radius < 0){
        user2.score++;
        p.innerHTML = user.score + ":" + user2.score;
        if( user2.score == 21){
            div.textContent = "Zwycięstwo gracza 2";
        }
        else{
        resetBall();
        }
    }
    else if( ball.x + ball.radius > canvas.width){
        user.score++;
        p.innerHTML = user.score + ":" + user2.score;
        if( user.score == 21){
            div.textContent = "Zwycięstwo gracza 1";
        }
        else{
        resetBall();
        }
    }
}

    ball.x += ball.vx;
    ball.y += ball.vy;
    
    
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.vy = -ball.vy;
    }
    
    let player = (ball.x + ball.radius < canvas.width/2) ? user : user2;
    
    if(collision(ball,player)){
        let collidePoint = (ball.y - (player.y + player.height/2));

        collidePoint = collidePoint / (player.height/2);
        
        // piłka uderze górę paletki -45stopni
        // piłka uderze środek paletki 0stopni
        // piłka uderza doł paletki 45stopni
        // PI/4 = 45 stopni
        let angleRad = (Math.PI/4) * collidePoint;
        
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.vx = direction * ball.speed * Math.cos(angleRad);
        ball.vy = ball.speed * Math.sin(angleRad);
        ball.speed += 0.11;
    }
}

function render(){
    
    drawRectangle
(0, 0, canvas.width, canvas.height, "#0f5722");
    
    drawNet();
    
    drawRectangle
(user.x, user.y, user.width, user.height, user.color);
    
    drawRectangle
(user2.x, user2.y, user2.width, user2.height, user2.color);
    
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}
function game(){
    update();
    render();
    }
let framePerSecond = 50;

let loop = setInterval(game,1000/framePerSecond);