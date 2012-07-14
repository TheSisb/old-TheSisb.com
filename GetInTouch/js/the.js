var cursor = $('.cursor');
var body = $('body');
var step = 0;
var health = 500;
var name ="",company="";
var combo = false, bound = false;
var slides = [ 
				new Slide( '#s0', 	'#userInput', 		'', 	''),
				new Slide( '#s1', 	'', 				'', 	"$('.enterName').html(name);$('#hp').fadeIn(700,function(){$('#num').slideDown(700);cursor.delay(1000).fadeIn();});"),
				new Slide( '#s2', 	'', 				'yes', 	''),
				new Slide( '#s3', 	'', 				'', 	''),
				// job
				new Slide( '#s4', 	'#companyInput', 	'', 	''),
				new Slide( '#s5', 	'', 				'', 	"$('body').css('overflow','hidden');var w = $(window).width()-50;var h = $(window).height()-50;for (var i=0;i<20;i++) {$('body').append(\"<div class='shape' style='border:1px solid #222;border-radius:50%; width:30px;height:30px; position:absolute;'></div>\");}$('.shape').each( function() {$(this).css(\"top\",Math.floor((Math.random()*h)+1));$(this).css(\"left\",Math.floor((Math.random()*w)+1));});$('.shape').fadeIn().animate({marginLeft:\"-50px\",marginTop:\"-50px\", width:\"150px\",height:\"150px\"}, 600).fadeOut();"+
																"name = $('#userInput').val();company = $('#companyInput').val();$('.enterCompany').html(company);$('.enterName').html(name);"),
				new Slide( '#s6', 	'#jobTextArea', 	'', 	"$('body').css('overflow','visible');"),
				// hi
				new Slide( '#s7', 	'', 				'', 	''),
				new Slide( '#s8', 	'#hiTextArea', 		'', 	"name = $('#userInput').val();"),
				// hate
				new Slide( '#s9', 	'', 				'', 	''),
				new Slide( '#s10', 	'#hateTextArea', 	'', 	"name = $('#userInput').val();"),
				// tinker
				new Slide( '#s11', 	'', 				'yes', 	''),
				new Slide( '#s12', 	'', 				'', 	''),
				new Slide( '#s13', 	'', 				'', 	''),
				// end
				new Slide( '#s14',	'',					'yes',		'')
			];
	

/**
 * SLIDE Class
 */
function Slide(id, input, options, custom){
	this.id 		= id
	this.input		= input;
	this.options 	= options;	
	this.custom 	= custom;
}

// New Slide
Slide.prototype.init = function() {
	var input = $(this.input);
	var options = this.options;
	
	$(this.id).fadeIn(750, function(){
		
		if ( input.length > 0) {
			
			body.on('click', function(e){
				input.focus();
			});
			input.focus().delay(300).focus();
		}
		else if ( options.length > 0) {
			
		}
		else {
			cursor.delay(400).fadeIn();
		}

		// Ending slide, end this 'loop'
		if (step == 12 || step == 14) {
			takeDamage( health );
			$('#ending').fadeIn();
			return;
		} else if (step == 13) {
			takeDamage( -999999, 1);
			$('#ending').fadeIn();
			return;
		} else 
			slides[step].process();
	});
}

// What a slide does
Slide.prototype.process = function() {
	var input = $(this.input);
	
	if ( input.length > 0 ) {
		body.on( "keydown.inputBox", function(e){
			input.focus();
		});
		
		input.on( "keydown", InputBoxer);
	}
	else if ( this.options.length > 0) {
		body.on( "keydown", OptionsBoxer);
	}
	else {
		// Just waiting for an Enter key press
		body.on( "keydown", CutsceneBoxer);	
	}
	
	if ( this.custom.length > 0 )
		evalSafely(this.custom);
		
}

// Close Slide
Slide.prototype.step = function() {
	
	// Step checks
	if (step > 2)
		takeDamage( 5,1 );
	if (step == 5)
		strangeBlur();
	if (step == 6 || step == 8 || step == 10)
		step = 13;
	
	// Remove slide bindings
	if (this.input.length > 0) {
		body.off('click').off("keydown.inputBox");
		$(this.input).blur().off("keydown").animate({
			fontSize: "2px",
			width: "20px"
		},1500);	
	}
	else if (this.options.length > 0) {
		body.off( "keydown" );
	}
	else {
		body.off( "keydown" );
	}
	
	// Stepping out animation
	$(this.id).animate({
		width: "70%",
		opacity: 0.2,
		marginLeft: "3in",
		marginTop: "-0.6in",
		fontSize: "2px"
	}, 500, "linear", function(){
		$(this).hide();
		cursor.hide();
		
		slides[++step].init();
	});
}

function InputBoxer(e) {
	
	// Show cursor
	if ( cursor.css('display') == 'none' )
		cursor.delay(400).fadeIn();
		
	var $this = $(this);
		
	// <input>
	if ( $this.is("input") ){
		// If 'ENTER' key is pressed
		if (e.which == 13) {
			// If the input has 0 or 1 letters in it do nothing
			if ( $this.val().length < 2 ) 
				return;
			// Otherwise, go to next Slide
			slides[step].step();
		}
	}
	
	// <textarea>
	if ( $this.is("textarea") ) {
		takeDamage( 1, 0 );
		
		if (!bound) {
			bound = true;
			$(document).on("keydown.submit", function(e) {
				if ( e.which == 9 ) {
					combo = true;
					takeDamage( -1, 0);
					e.preventDefault();
				} else if ( e.which == 32 && combo ) {
					takeDamage( -1, 0);
					e.preventDefault();
					
					var text = "Job: " + $('#jobTextArea').val() + "\nHi: " + $('#hiTextArea').val() + "\nHate: " + $('#hateTextArea').val();
					
					$.ajax({
					  type: "POST",
					  url: "posted.php",
					  data: {"name":name,"company":company,"text":text}
					}).done(function( msg ) {
						if(msg) // If a string is returned it evaluates to true
							slides[step].step();
					});
					
					$(document).off("keydown.submit");       
							 
				} else
					combo = false;
			});
		}
	}
}
function CutsceneBoxer(e) {
	// If 'ENTER' key is pressed
	if (e.which == 13)
		slides[step].step();
}

// Showing off my switch statement skillz.  I don't know.
function OptionsBoxer(e){
	if (step == 2) {
		switch (e.which){
			case 49:
				takeDamage(10,1);
				slides[step].step();
				break;
			case 50:
				takeDamage(50,1);
				slides[step].step();
				step = 6;
				break;
			case 51:
				takeDamage(100,1);
				slides[step].step();
				step = 8;
				break;
			case 52:
				takeDamage( Math.floor(Math.random()*450)+50, 1 );
				slides[step].step();
				step = 10;
				break;
		}
	}
	if (step == 11) {
		// Walk on and live like a king
		if (e.which == 49) {
			slides[step].step();
			step = 12;
		}
		// Accept offer and die before getting the goods
		if (e.which == 50) {
			takeDamage( health-5, 1);
			slides[step].step();
		}
	}
}

function takeDamage( damage, anim ){
	health -= damage;
	
	if (health < 1) {
		health = 0;
		$('#jobTextArea, #hiTextArea, #hateTextArea').attr("disabled", "disabled");
		$('#num').css("text-decoration","line-through");
	}
	
	if (anim)
		$('#num').stop().shake(9, 8, 260).html( health.toString() );
	else
		$('#num').html( health.toString() );
}


$(function() {				
	slides[step].init();
	$(document).mousemove(function (){
		$('#info').show().delay(500).stop().fadeOut();
	});
	
});	


// jQuery eval that doesn't use eval apparently
function evalSafely(text) {
	$.globalEval(text);
}

// jQuery SHAKE animation plugin
jQuery.fn.shake = function(intShakes, intDistance, intDuration) {
    this.each(function() {
        for (var x=1; x<=intShakes; x++) {
			$(this).stop().animate({left:intDistance*-1+332}, intDuration/intShakes/4)
					.animate({left:intDistance+332}, intDuration/intShakes/2)
					.animate({left:332}, intDuration/intShakes/4)
		}
	});
	return this;
};
function strangeBlur(){
	
}
