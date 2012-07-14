$('.skill').hover(function(){
	$(this).addClass('turn');
},function(){
	$(this).removeClass('turn');
});
			


var rating = [
				['#english',	1,1,1,1,1],
				['#french',		1,1,1,1,0],
				['#spanish',	1,0,0,0,0],
				['#arabic',		1,1,0,0,0],
				['#html',		1,1,1,1,1],
				['#css',		1,1,1,1,1],
				['#js',			1,1,1,1,0],
				['#java',		1,1,1,1,0],
				['#cpp',		1,1,1,0,0],
				['#php',		1,1,1,0,0],
				['#vb',			1,1,1,0,0],
				['#python',		1,1,0,0,0],
				['#apache',		1,1,1,1,0],
				['#nginx',		1,1,1,1,1],
				['#windows',	1,1,1,1,1],
				['#debuntu',	1,1,1,1,0]
			];
/*
$(function(){
	// cols 6 = 1+5
	for (var j=1; j < rating[0].length; j++) {	
		setTimeout(addStarColumn(j), 2000);
	}		
});
*/
var starCounter = 0;
(function addStar() {
	setTimeout(function() {
		if (starCounter++ < 5) {
			addStarColumn(starCounter);
			addStar();
		}
		if (starCounter == 5)
			$('.rating').addClass('glow');
	}, 300);
	
})();
function addStarColumn(col){
	// rows 15
	for ( var i=0; i < rating.length; i++ ) {
		if (rating[i][col] == 1){
			$(rating[i][0] + " .rating").append("<div id='s" + i + col + "' class='star'></div>");
			$('#s'+i+col).delay(i * 100).animate({'opacity': 1}, 500);
		}
	}
}
				
