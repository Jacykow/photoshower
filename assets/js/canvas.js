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
		
        $('#myCanvas').mousedown(function (e) {
            var mouseX = e.clientX - offsetL;
            var mouseY = e.clientY - offsetT;

            console.log("down");
            paint = true;
			if(drawing) {
				
				addClick(e.clientX - offsetL, e.clientY - offsetT);
				redraw();
			}
        });

        $('#myCanvas').mousemove(function (e) {
            if (paint && drawing) {
				console.log(e);
                addClick(e.clientX -offsetL, e.clientY - offsetT, true);
                redraw();
            }
        });

        $('#myCanvas').mouseup(function (e) {
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
	}
	
	function addClick(x, y, dragging)
	{
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
				  context.moveTo(clickX[i-1], clickY[i-1]);
				 }else{
				   context.moveTo(clickX[i]-1, clickY[i]);
				 }
				 context.lineTo(clickX[i], clickY[i]);
				 context.closePath();
				 context.stroke();
				 context.strokeStyle = clickColor[i];
		  }
	}

