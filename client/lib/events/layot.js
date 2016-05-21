Template.layout.events({
	'keypress input': function( event ) {
		// event.preventDefault();
		if (event.keyCode === 13) {
			event.preventDefault();
			
			$(event.target).closest('form').find('.submit').trigger('click');
		}
	},
});
