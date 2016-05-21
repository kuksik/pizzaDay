Template.menuBar.events({

	'mouseenter .menu_bar_item': function(event) {
		if( !$(event.currentTarget).hasClass('selected_green') ) {
			$(event.currentTarget).css('color', '#00b300')
		}
	},
	'mouseleave .menu_bar_item': function(event) {
		if( !$(event.currentTarget).hasClass('open_popup') ) {
			$(event.currentTarget).css('color', 'white')
		}	
	},
	'click .menu_bar_item': function(event) {
		
		var elem = event.currentTarget;

		if ( !$(elem).hasClass('popup_menu') ) {
			$('.menu_bar_item').removeClass('selected_green');
			$(event.target).css('color', 'white').addClass('selected_green');
		}
		else {
			$('.popup').hide();

			if( $(elem).css('color') ===  '#00b300')
			{
				$(elem).css('color', 'white');					
				return
			}	

			$('.popup_menu').css('color', 'white').removeClass('open_popup');
				
			$(elem).css('color', '#00b300').addClass('open_popup');
			$(elem).next().fadeIn(400);
		}	
	},
});



Template.cabinet.events({
	'click #cabinet_menu': function(event) {
		event.preventDefault();

		var elem = event.target,
			id = elem.id;
		
		if ( id === 'logout' ) {
			Meteor.logout();
			$('.popup_menu').css('color', 'white');
			$('.popup').hide();
			Router.go('/')
		} 
		else if ( id === 'show_reg_form' ) {
			$('#login_form').trigger('reset').hide()
							.find('.error_box').remove();;
			$('#reg_form').show().find('input')[0].focus();

		} 
		else if ( id === 'show_login_form' ) {
			$('#reg_form').trigger('reset').hide()
						  .find('.error_box').remove();
			$('#login_form').show();
		}
	},

	'input #reg_form': function(event) {
		
		var elem = event.target,
			validator = new Validator();
			
		$(elem).removeClass('valid');

		if ( elem.value === '' ) {
			$(elem).next('.error_box').remove();
		}
		else if ( elem.id === 'reg_name') {
			validator.validateName(elem)
		}
		else if ( elem.id === 'reg_email') {  
			validator.validateEmail(elem)
		}
		else if ( elem.id === 'reg_pas') {
			$('#confirm_pas').trigger('input');
			validator.validatePas(elem)
		}
		else if ( elem.id === 'confirm_pas') {
			validator.validateConPas(elem);
		}
	},

	'click #login_google': function(event) {
		
		Meteor.loginWithGoogle(function(err) {
			if (err) {
				console.log(err); 
				return
			}
			$('.popup_menu').css('color', 'white');
			$('.popup').hide();
		});
		
	},

	'click #signIn': function(event) {
		event.preventDefault();
		
		var form = $(event.target).closest('form');


		if ( !$(form).checkRequiredFields(2) ) {
    		return
    	} 
    	else {

			Meteor.loginWithPassword($('#login_email').val(), $('#login_pas').val(), function(err) {
				
				if (err) {
					if ( err.reason === 'User not found') {
						$('#login_email').showError(err.reason).focus();
					} 
					else if (err.reason === 'Incorrect password'){
						$('#login_pas').showError(err.reason).focus();
					}
					
				} else {
					$('.popup_menu').css('color', 'white');
					$('.popup').hide();
				}
			});
		}
		
	},

	'click #create_user': function(event) {
		event.preventDefault();

		var form = $(event.target).closest('form');

    	
    	if ( !$(form).checkRequiredFields() ) {
    		return
    	} 
    	else if ( Users.findOne({'profile.name': $('#reg_name').val().toLowerCase() } ) ){
    		$('#reg_name').showError('chosee another name');
    		return
    	}
    	else {
    		Meteor.call('checkNewUserEmail', $('#reg_email').val().toLowerCase(), function(err, res) {
				if(res) {
					$('#reg_email').showError('This email is registed');
				}
				else {
					Accounts.createUser({
		        		'email': $('#reg_email').val(),
		        		'password': $('#reg_pas').val(),
		    			'profile': {
							name: $('#reg_name').val()
						},
		    			function(err) {
			        		if (err) {			
				        		alert(err.reason)
				        	} else {
				        		$('.popup_menu').css('color', 'white');
				        		$('.popup').hide();
			        		}
						} 
					});
					
				}
			});
    		$('.popup').hide();
    		$('.popup_menu').css('color', 'white');
    	}	
	},
})





Template.notifications.events({

	'click #notifications_popup': function(event) {
		event.preventDefault();
		var elem = event.target;
		
		if ( $(elem).hasClass('notification_item') ) {

			var notification = Notifications.findOne({'_id': elem.id })
			
			var html = Blaze.toHTMLWithData(
							Template.notificationWindow, 
							{notification}
						);
			
			$(elem).closest('li').append(html)			
		}
	},

	'click #not_wind': function(event) {
		event.preventDefault();
		
		var elem = event.target,
			notification = Notifications.findOne({'_id': $(event.currentTarget).attr('name') })
		
		if ( elem.id === 'confirm_participation') {
	
			Meteor.call('addEvent', notification.groupId, Meteor.userId(), 'confirmed')
			
			$('#parent_popup').remove();
			
			Router.go('/groups/' + notification.group + '?navigateItem=pizzaDay');
			Notifications.update({'_id': notification._id}, 
						{$set: {'read': true}	});
		}
		if ( elem.id === 'cancel_participation') {

			Meteor.call('addEvent', notification.groupId, Meteor.userId(), 'canceled');
			
			$('#parent_popup').remove();
			Notifications.update({'_id': notification._id}, 
						{$set: {'read': true}	});
		}
	}
})

