'use strict';

(()=>{

	function rand(min,max){
		return Math.random()*(max-min)+min;
	}

	const scoreBord=document.querySelector('#scoreBoad');
	const inputPW=document.querySelector('#inputPW');

	// Ball クラスを作成する。
	class Ball{
		constructor(canvas){
			this.canvas=canvas;
			this.ctx=this.canvas.getContext('2d');
			this.color='snow';
			this.x=rand(30,250);	// Ballの位置
			this.y=50;
			this.r=5;  // 半径
			this.vx=rand(1,3)*(Math.random()<0.5? 1 : -1);
			this.vy=rand(1,3);
		} 

		getBallXyr(){
			return [this.x,this.y,this.r];
		}

		ballUp(y){
			if (this.vy > 0) this.vy*=-1;
			this.y=y-this.r;
		}

		update(){
			this.x+=this.vx;
			this.y+=this.vy;
			this.color='snow';

			//壁にあたった場合、速度方向を反転させる。
			if (this.x - this.r < 0 || this.x + this.r > this.canvas.width){
				this.vx*=-1;
				this.color='red';
			}

			if (this.y -this.r< 0 || this.y + this.r > this.canvas.height){
				this.vy *=-1;
				this.color='red';
			}
		}

		draw(){
			this.ctx.beginPath();
			this.ctx.fillStyle=this.color;
			this.ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
			this.ctx.fill();
			this.ctx.beginPath();
		}
	}

	// Paddle クラスを作成
	class Paddle{
		constructor(canvas){
			this.canvas=canvas;
			this.ctx=this.canvas.getContext('2d');
			this.color='skyblue';
			this.score=0;
			this.w=60;
			this.h=8;
			this.x=this.canvas.width/2-(this.w/2);
			this.y=this.canvas.height - this.h-10;
			this.mouseX=this.x; // パドルの中心X
			this.keyVx=2;
			this.addHandler();
		}

		addHandler(){
			document.addEventListener('mousemove',e=>{
				this.mouseX=e.clientX;
			});
			document.addEventListener('keydown',e=>{
				if (e.key=='Right' || e.key=='ArrowRight'){
					this.x+=this.keyVx;
				}else if (e.key=='Left'){
					this.x-=this.keyVx;
				}
			});
		}

		update(ball){ // paddle でボールを打ち返す。

			const rect=this.canvas.getBoundingClientRect();
			this.x=this.mouseX-rect.left-(this.w/2);
			// console.log(rect);
			if (this.x<0){
				this.x=0;
			}else if (this.x>rect.width - this.w){
				this.x=rect.width - this.w;
			}

			const xyr=ball.getBallXyr();
			const ballX=xyr[0];
			const ballY=xyr[1];
			const ballR=xyr[2];

			const ballTop   =ballY-ballR;
			const ballBottom=ballY+ballR;

			const paddleLeft =this.x;
			const paddleRight=this.x+this.w;
			const paddleTop =this.y;

			if (ballBottom > paddleTop && 	// ボールをpaddleで打ち返す。はねかえ
				paddleLeft<ballX && ballX < paddleRight
				){
				ball.ballUp(this.y);
				// console.log(`this.x=${this.x},this.w=${this.w}`);
				// console.log(`ballX=${ballX},paddleLeft=${paddleLeft},paddleRight=${paddleRight}`);
				this.score++;
				// return true;
			}else if (ballBottom > this.canvas.height){ //-- gameOver
				
				return true;
			}

			return false;
		}

		draw(){
			this.ctx.beginPath();
			this.ctx.fillStyle=this.color;
			this.ctx.fillRect(this.x,this.y,this.w,this.h);
			this.ctx.beginPath();
		}

		getScore(){
			return this.score;
		}

	}

	class Game{
		constructor (canvas){
			this.canvas=canvas;
			this.ctx=this.canvas.getContext('2d');
			this.GameOver=false;
			this.ball=new Ball(canvas);
			this.paddle=new Paddle(canvas);
			this.loop();
		}

		// Game loop
		loop(){
			if (this.GameOver) {
				this.drawGameOver();
				return; //-- gameをLoopを止める。
			}
			this.update();
			this.draw();

			requestAnimationFrame(()=>{
				this.loop();
			});
		}

		drawGameOver(){
			this.ctx.font='28px "Arial Black"';
			this.ctx.fillStyle='tomato';
			this.ctx.fillText('GAME OVER',50,50);
			// this.ctx.font = '28px "Arial Black"';
			// this.ctx.fillStyle = 'tomato';
			// this.ctx.fillText('GAME OVER', 50, 150);
		}

		update(){
			this.ball.update();
			this.GameOver=this.paddle.update(this.ball);
		}
		draw(){
			this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
			this.ball.draw();
			this.paddle.draw();
			scoreBord.textContent='SCORE: '+this.paddle.getScore();
		}
	}

	const canvas=document.querySelector('canvas');
	if (typeof canvas.getContext==='undefined'){
		return;
	}

	new Game(canvas);

	document.getElementById('resetButton').addEventListener('click',()=>{
		new Game(canvas);
	})

})();
