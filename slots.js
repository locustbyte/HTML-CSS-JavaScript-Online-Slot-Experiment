$(document).ready(function() {

	var FruitRoll = function(el) {
		this.element = el;
		this.position = 0;
	};
	
	FruitRoll.prototype.init = function() {
		// initialize the rolls by rolling to some random position
		var rnd = Math.floor(Math.random() * 23) + 1;		
		this.roll(rnd);
	};

	FruitRoll.prototype.rollOne = function(animate) {
		// roll one step
		if(this.position === 0) {
			// When the strip has finished animating down we quickly move it back to the top
			// to create an 'endless roll' effect
			this.element.removeClass('animating');
			$("#spin").html('Spin');
			this.position = 24;
			this.element.find('.symbols').css(Modernizr.prefixed('transform'), 'translate3d(0,-3072px,0)');
		}
		if(animate && !this.element.hasClass('animating')) {
			// the 'animating' class enables the CSS transition stuff AND sets the background position
			// so that the 'blurry' symbols are shown for added realism
			this.element.addClass('animating');
			this.rolling = true;
		}
		// animate one step
		this.element.find('.symbols').css(Modernizr.prefixed('transform'), 'translate3d(0,' + -((this.position - 1) * 128) + 'px,0)');
		this.position--;
	};

	FruitRoll.prototype.roll = function(rollTo) {
		
		var that = this, 
		transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition'    : 'webkitTransitionEnd',
			'OTransition'      : 'oTransitionEnd',
			'msTransition'     : 'msTransitionEnd', // maybe?
			'transition'       : 'transitionend'
		},
		CSS3_TRANSITION_END = transEndEventNames[ Modernizr.prefixed('transition') ];

		this.element.find('.symbolsholder').removeClass('bounce');
	
		this.rollTo = rollTo;
		if(this.rollTo === 1) {
			// when done, do the bouncy thing to finish off
			this.rollOne(true);
			this.element.removeClass('animating');
			this.rolling = false;
			this.element.find('.symbolsholder').addClass('bounce');
			return;
		}

		this.element.find('.symbols').bind(CSS3_TRANSITION_END, function() {
	
			// every time the an one-step CSS transition finished we check whether
			//we need to roll again
	
			if(that.rollTo > 1) {
				that.rollOne(true);
				that.rollTo--;
			}
			if(that.rollTo === 1) {					
				that.rollOne(true);
				that.rollTo--;
				// done, get rid of the listener
				that.element.find('.symbols').unbind();
				// when done, do the bouncy thing to finish off
				that.element.removeClass('animating');
				that.rolling = false;
				that.element.find('.symbolsholder').addClass('bounce');
				$('.hold').removeClass('held');
			}
		});				
		this.rollOne(true);
		this.rollTo--;
	};
	
	
	// create the rolls and initialize them
	var roll1 = new FruitRoll($('#roll1')),
	roll2 = new FruitRoll($('#roll2')),
	roll3 = new FruitRoll($('#roll3')),
	mayHold = true;
	roll1.init();
	roll2.init();
	roll3.init();
	
	$('#spin').bind('click', function() {
		$("#spin").html('Good Luck!');
		var spins = [Math.floor(Math.random() * 24) + 10, Math.floor(Math.random() * 50) + 10, Math.floor(Math.random() * 50) + 10];
		// prevent the user from spinning when the rolls are still going
		if(roll1.rolling || roll2.rolling || roll3.rolling) {
			return;
		}
		$('.symbolsholder').removeClass('bounce');
		// 3 random spin

		// make sure the first roll gets the longest spin and the last roll the shortest to make sure they
		// stop in a 'first, second, third' order.
		spins.sort();
		if(!roll1.hold && !roll2.hold && !roll3.hold) {
			mayHold = true;
		}
		else {
			mayHold = true;
		}
		if(!roll1.hold) {
			roll1.roll(spins[0]);
		}
		else {
			roll1.hold = false;
		}
		if(!roll2.hold) {
			roll2.roll(spins[1]);
		}
		else {
			roll2.hold = false;
		}
		if(!roll3.hold) {
			roll3.roll(spins[2]);
		}
		else {
			roll3.hold = false;
		}
		
	});
	
	// hold buttons

	$('#hold1').bind('click', function() {
		console.log(mayHold);
		if(mayHold) {
			roll1.hold = true;
			$('#hold1').addClass('held');
		}
	});
	$('#hold2').bind('click', function() {
		console.log(mayHold);
		if(mayHold) {
			roll2.hold = true;
			$('#hold2').addClass('held');
		}
	});
	$('#hold3').bind('click', function() {
		if(mayHold) {
			roll3.hold = true;
			$('#hold3').addClass('held');
		}
		
		if(roll1.hold && roll2.hold && roll3.hold) {
			$('#spin').attr('disabled','disabled')
		}
	});

});

		
		

		
		