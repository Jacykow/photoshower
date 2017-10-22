	var canvas;
	var context;
	
	
	var clickX = [];
	var clickY = [];
	var clickDrag = [];
	var paint;
	
	var red = "#ff2626";
	var black = "#000";
	var blue = "#ade9ff";
	var purple = "#d392cd";

	var curColor = red;
	var clickColor = [];

	function initCanvas() {
        canvas = document.getElementById('myCanvas');
        context = canvas.getContext("2d");
		
		canvas.width  = document.width || document.body.clientWidth;
		canvas.height = document.height || document.body.clientHeight;
        $('#clean').on('click', function () {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            clickX = [];
            clickY = [];
            clickDrag = [];
        });
		
		$('#red').on('click', function() {
			curColor = red;
		});
		
		$('#black').on('click', function() {
			curColor = black;
		});
		
		$('#blue').on('click', function() {
			curColor = blue;
		});
		
		$('#purple').on('click', function() {
			curColor = purple;
		});
		
		document.getElementById('red').addEventListener("touch",function() {
			curColor = red;
		});
		
		document.getElementById('black').addEventListener("touch",function() {
			curColor = black;
		});
		
		document.getElementById('blue').addEventListener("touch",function() {
			curColor = blue;
		});
		
		document.getElementById('purple').addEventListener("touch", function() {
			curColor = purple;
		});
		
        $('#myCanvas').mousedown(function (e) {
            var mouseX = e.clientX - offsetL;
            var mouseY = e.clientY - offsetT;

            paint = true;
			if(drawing) {
				
				addClick(mouseX, mouseY);
				redraw();
			}
        });

		canvas.addEventListener("touchstart", function(e) {
			var touchX = e.targetTouches[0].pageX - offsetL;
            var touchY = e.targetTouches[0].pageY - offsetT;
            paint = true;
			if(drawing) {
				
				addClick(touchX, touchY);
				redraw();
			}
		});
		
        $('#myCanvas').mousemove(function (e) {
			var mouseX = e.clientX - offsetL;
            var mouseY = e.clientY - offsetT;
			
            if (paint && drawing) {
                addClick(mouseX, mouseY, true);
                redraw();
            }
        });
		canvas.addEventListener("touchmove", function(e) {
			 var touchX = e.targetTouches[0].pageX - offsetL;
             var touchY = e.targetTouches[0].pageY - offsetT;
			
			 if (paint && drawing) {
                addClick(touchX, touchY, true);
                redraw();
            }
		});

        $('#myCanvas').mouseup(function (e) {
            paint = false;
        });
		canvas.addEventListener("touchend", function() {
			 paint = false;
		});

        $('#myCanvas').mouseleave(function (e) {
            paint = false;
        });
		
		$(window).resize(function() {
			resizeCanvas();
		});

    }

	function resizeCanvas() {
		
		canvas.width  = document.width || document.body.clientWidth;
		canvas.height = document.height || document.body.clientHeight;
		redraw();
	}
	
	function addClick(x, y, dragging)
	{
	  x /= $(content).width();
	  y /= $(content).height();
	  clickX.push(x);
	  clickY.push(y);
	  clickDrag.push(dragging);
	  clickColor.push(curColor);
	}
	function redraw(){
		  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
		  
		  context.strokeStyle = "#df4b26";
		  context.lineJoin = "round";
		  context.lineWidth = 5;
					
		  for(var i=0; i < clickX.length; i++) {		
			context.beginPath();
			if(clickDrag[i] && i){
				  
				  context.moveTo(clickX[i-1] * $(content).width(), clickY[i-1] * $(content).height());
				 }else{
				   context.moveTo(clickX[i] * $(content).width(), clickY[i] * $(content).height());
				 }
				 context.lineTo(clickX[i] * $(content).width(), clickY[i] * $(content).height());
				 context.closePath();
				 context.stroke();
				 context.strokeStyle = clickColor[i];
		  }
	}

