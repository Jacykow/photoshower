//var images = ["assets/img/1.png", "assets/img/2.png", "assets/img/3.png"];
var active = 0;
var images = 3;
var container;
var drawing = 0;

var offsetL = 0;
var offsetT = 0;

function init() {
    $('#left-arrow').click(function() {
        var prev = active;
        if(active>0) active--;
        else active = images - 1;
        setSlide(prev, active);
    });
    $('#right-arrow').click(function() {
        var prev = active;
        if(active<images-1) active++;
        else active = 0;
        setSlide(prev, active);
    });
    $('#draw').click(function() {
		if (drawing) {
			$('#draw').css('background-color', 'rgb(15,15,15)');
			drawing = 0;
		}
		else {
			$('#draw').css('background-color', 'rgb(30,30,30)');
			drawing = 1;
		}
    });
	$(window).resize(function(){
		var img = $('#content img:eq('+curr+')');
		if($(window).width()/ $(window).height() > $(img).width() / $(img).height()) {
		// height = 100%;
			$(img).css('height', '100%');
		} else {
			//width = 100%;
			$(img).css('width', '100%');
		}
	});
    setSlide(active, active);
	
}

function setSlide(prev, curr) {
	
	var img = $('#content img:eq('+curr+')');
	$('#content img:eq(' + prev+')').stop().fadeOut('fast', function (){
		
		
		$('#content').css('left', '0').css('top', '0');
		$(img).stop().fadeIn().addClass('active');
		
	}).removeClass('active');
	
	if($(window).width()/ $(window).height() > $(img).width() / $(img).height()) {
		// height = 100%;
		$(img).css('height', '100%');
	} else {
		//width = 100%;
		$(img).css('width', '100%');
	}
}
