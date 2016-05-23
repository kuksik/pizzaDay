Template.layout.events({
	'keypress input': function( event ) {
		// event.preventDefault();
		if (event.keyCode === 13) {
			event.preventDefault();
			
			$(event.target).closest('form').find('.submit').trigger('click');
		}
	}
});

$(window).bind('popstate', function(event) {
	var page  = (location.pathname).split('/')[1] || 'home';
});

$('input').keyup(function(event){
  	if ( even.keyCode === '13' ) {
  		$( event.target ).closest('form').find('submit').trigger('click');
  	};
});

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

	$('.popup').hide();
	$('.popup_menu').css('color', 'white').removeClass('open_popup');
	$('.popup').children('form').trigger('reset')
	$('#show_login_form').trigger('click')
});