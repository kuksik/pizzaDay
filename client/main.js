Meteor.subscribe('Groups');
Meteor.subscribe('Users');
Meteor.subscribe('Notifications');




(function ( $ ) {
	$.fn.checkPassword = function() {
		var strongRegex = 
				/^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).*$/g;
		var mediumRegex = 
				/^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$/g;
		var enoughRegex = /(?=.{6,}).*/g;

		var pas = this.val()
		
		if ( pas.length  < 6 ) {
			this.showError('more characters');
		}
		else if (strongRegex.test(pas)) {
			this.showError('<span style=\"color:black\">Strong!</span>')
				.addClass('valid');
		}else if (mediumRegex.test(pas)) {
			console.log()
			this.showError("<span style=\"color:red\">Medium</span>")
				.addClass('valid');
		} else if (enoughRegex.test(pas)){
			this.showError("<span style=\"color:yellow\">Weak!</span>")
				.addClass('valid');
		} 
		
	return this;

	}
}( jQuery ));


(function ( $ ) {
	$.fn.popupWindow = function() {
		event.preventDefault();
		
		var popup = this.next('.window_popup');

		if ( this.hasClass('show') ) {
			
			this.removeClass('show').addClass('hide');
			$(popup).fadeIn(500);
			this.text('Cancel')
		}

		else {

			this.next('.window_popup').hide();	
			this.addClass('show');

			if ( this.attr('id') === 'show_add_menu_form' ) {

				$('#addMenuItem_form').trigger("reset");
				$('#cancel').trigger('click');
				
				this.text('Add dish');
			}
			else if ( this.attr('id') === 'show_users_list') {
				this.text('Add members');
			}
			else if ( this.attr('id') === 'show_add_coupons_form' ) {
				this.text('Add coupons');
			}
			else if ( this.attr('id') === 'show_add_group_form') {
				
				$('#addMenuItem_form').trigger("reset");
				$('#cancel').trigger('click');

				this.text('Add group')
			}
		}
		return this;
	}
} ( jQuery ));



(function ( $ ) {
	$.fn.showError = function(textError) {

		var style = {
			'font-size': '10px',
			'color': 'red',
			'text-align': 'left',
			'padding': '0',
			'margin': '0'
		};

		
		this.next('.error_box').remove()
		
		var errorBox = $('<p></p>').addClass('error_box')
						   .css(style).html(textError);
		this.after(errorBox);
		

		return this;
	}

}( jQuery ));



(function ( $ ) {
	$.fn.checkRequiredFields = function() {

		var inputs = this.find('input').filter('.required'),
			valid = true

		for (var i=0; i<inputs.length; i++) {
			if ( !$(inputs[i]).val() ) {
				$(inputs[i]).showError('this element is required')
				valid = false
			};
		};

		return valid;

	}
}( jQuery ));




$(document).click(function(event) {

	var elem = $(event.target).closest('#popup_list');
	
	
	
	if ( $(elem).length ) {
	
		return
	}
	



	if( !$(event.target).closest('form').length) {
		$('.error_box').remove()	
	}

	

	if ( $(event.target).is('input') 
		&& $(event.target).next('.error_box').length) {
		$(event.target).next('.error_box').remove();
	}

	$('.popup_menu').removeClass('focus_menu_item')
	$('.popup').hide();
	$('.menu_bar_item').removeClass('selected_green');
	
	$('.popup').children('form').trigger('reset')
	$('#show_login_form').trigger('click')
	
});
