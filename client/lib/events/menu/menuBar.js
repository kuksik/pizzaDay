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

			if( $(elem).css('color') ===  '#00b300') {
				$(elem).css('color', 'white');					
				return
			}	

			$('.popup_menu').css('color', 'white').removeClass('open_popup');
				
			$(elem).css('color', '#00b300').addClass('open_popup')
										           .next().fadeIn(400);
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
			Router.go('/');
		} 
		else if ( id === 'show_reg_form' ) {
			$('#login_form').trigger('reset').hide()
							.find('.error_box').remove();
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
	'input #login_form':function(event) {
		var elem = event.target,
			validator = new Validator();

		$(elem).removeClass('valid');

		if ( elem.value === '' ) {
			$(elem).next('.error_box').remove()
		} 
		else if ( elem.id === 'login_email' ) {
			validator.validateEmail(elem)
		}
		else if ( elem.id === 'login_pas') {
			validator.validateSigninPas(elem)
		}	
	},

	'click #login_google': function(event) {
		Meteor.loginWithGoogle(function(err) {
			if (err) {
				alert(err); 
				return
			};
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
    	};
    	

    	var data = {
    		'name': $('#reg_name').val().toLowerCase(),
    		'email': $('#reg_email').val().toLowerCase()
    	};
    	
    	Meteor.call('chekcNewUserInfo', data, 
    		function(err, res) {
    			if( err ) {
    				alert(err.reason);
    				return
    			};

    			if ( res.valid ) {
    				Accounts.createUser({
						'email': $('#reg_email').val(),
			    		'password': $('#reg_pas').val(),
						'profile': {
							'name': $('#reg_name').val()
						},
						
						function(err) {
	    					if (err) {			
	        					alert(err.reason)
	        					return
	        				}
						} 
					});	
					$('.popup_menu').css('color', 'white');
	        		$('.popup').hide();	
    			}
    			else {
					if ( res.name ) {
						$('#reg_name').showError('Chosee another name');
					};
					if ( res.email ) {
						$('#reg_email').showError('This email is registed');
					};
				};
    	});
	}
})


Template.notifications.events({

	'click #notifications_popup': function(event) {
		event.preventDefault();
		var elem = event.target;
		
		if ( $(elem).hasClass('notification_item') ) {

			var notification = Notifications.findOne({'_id': elem.id }),
				html = Blaze.toHTMLWithData(
							Template.notificationWindow, 
							{notification}
						);

			$(elem).closest('li').append(html)			
		}
	},

	'click #not_wind': function(event) {
		event.preventDefault();
		
		var elem = event.target,
			notification = Notifications.findOne({ '_id': $(event.currentTarget).attr('name') }),
			group = new Group(notification.groupId);
		
		if ( elem.id === 'confirm_participation') {
			group.addPizzaDay('confirmed');
			
			$('#parent_popup').remove();
			
			Router.go('/groups/' + notification.group + '?navigateItem=pizzaDay');
			group.readNotification(notification._id);
		}
		if ( elem.id === 'cancel_participation') {
			group.addPizzaDay('canceled');
			group.readNotification(notification._id);
			$('#parent_popup').remove();
			
		}
	}
})