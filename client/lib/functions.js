
(function ( $ ) {
	$.fn.popupWindow = function() {
		event.preventDefault();
		
		var popup = this.next('.window_popup');

		if ( this.hasClass('show') ) {
			
			this.removeClass('show').addClass('hide');
			$(popup).fadeIn(500);
			this.text('Hide')
			if ( $(popup).find('form').length ) {
				$(popup).find('input')[0].focus();
			}
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
				this.text('Show users list');
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
			'color': '#F42E11',
			'text-align': 'left',
			'padding': '0',
			'margin': '0 0 0 2px'
		};

		
		this.next('.error_box').remove()
		
		var errorBox = $('<p></p>').addClass('error_box')
						   .css(style).html(textError);
		this.after(errorBox);
		

		return this;
	}

}( jQuery ));



(function ( $ ) {
	$.fn.checkRequiredFields = function(validFields) {


		var inputs = this.find('input');
			valid = true

		for (var i=0; i< inputs.length; i++) {
			var elem = inputs[i];
			
			if ( $(elem).hasClass('required') &&  !$(elem).val() ) {
				$(elem).showError('this field is required')
				valid = false;
			}
			else if( $(elem).val() && !$(elem).hasClass('valid')  ){
				valid = false;
			}
		}
		return valid;
	}
}( jQuery ));
