//var images = ["assets/img/1.png", "assets/img/2.png", "assets/img/3.png"];
var active = 0;
var images = 3;
var container;

window.onload = function() {
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
		
	});
	$('#clear').click(function() {
		
	});
	content = $('#content');
	setSlide(active, active);
	
}

function setSlide(prev, curr) {
	console.log(prev);
	console.log(active);
	$('#content img:eq(' + prev+')').stop().fadeOut().removeClass('active');
	var img = $('#content img:eq('+curr+')');
	$(img).stop().fadeIn().addClass('active');
	//console.log($(img).width());
	
	if($(window).width()/ $(window).height() > $(img).width() / $(img).height()) {
		// height = 100%;
		$(img).css('height', '100%');
	} else {
		//width = 100%;
		$(img).css('width', '100%');
	}
	
}
