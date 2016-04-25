Template.menuBar.events({


	'mouseenter .menu_bar_item': function(event) {
		$(event.target).addClass('focus_menu_bar_item');


	},
	'mouseleave .menu_bar_item': function(event) {
		$(event.target).removeClass('focus_menu_bar_item');
	},


	'click #non_popup_list': function(event) {
		var elem = event.target;
		
		if ( $(elem).hasClass('menu_bar_item') ) {
			
			$('.menu_bar_item').removeClass('selected_menu_bar_item');
			$(elem).addClass('selected_menu_bar_item')
		}

	},
	
	'click #popup_list a.popup_menu':function(event) {
		
		var elem = event.currentTarget;
		
		$('.popup').hide();

		if( $(elem).hasClass('selected_green') )
		{
			$(elem).removeClass('selected_green');					
			return
		}	

		$('.popup_menu').removeClass('selected_green');
			
		$(elem).addClass('selected_green');
		$(elem).next().fadeIn(400);
	},

	
	
})
