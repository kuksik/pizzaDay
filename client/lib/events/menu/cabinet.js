Template.cabinet.events({



	
	'click #cabinet_menu': function(event) {
		event.preventDefault();

		var elem = event.target,
			id = elem.id;
		

		if( id === 'change_pas' ) {
			$('#cabinet_menu').hide();
			$('#change_pas_form').show();
		} 
		else if ( id === 'cancel' ) {
			$(elem).closest('form').hide();
			$('#cabinet_menu').show();
			$('#login_form').show();
		}
		else if ( id === 'logout' ) {
			console.log(id)
			Meteor.logout();
		} 
		else if ( id === 'show_reg_form' ) {
			$('#login_form').hide();
			$('#reg_form').show();
		} 
		else if ( id === 'show_login_form' ) {
			$('#reg_form').hide();
			$('#login_form').show();
		}
		else if ( id === 'forgot_pas' ) {
			$('#login_form').hide();
			$('#forgot_pas_form').show();

		};
	},

	'input #login_form':function(event) {
		var elem = event.target,
			rexpEmail = /^[-\w]+@[-\w]+\.[A-z]{2,4}$/ig;

			$(elem).removeClass('valid');

			if ( elem.value === '' ) {
				$(elem).next('.error_box').remove()
			} 
			else if ( elem.id === 'login_email' && !rexpEmail.test(elem.value) ) {
				$(elem).showError('exampale@gmail.com')	
			}
			else if ( elem.id === 'login_pas' && elem.value.length < 6) {
				$(elem).showError('more characters')	
			}
			else {
				$(elem).next('.error_box').remove();
				$(elem).addClass('valid');
			};
	},

	
	

	'submit #login_form': function(event) {
		event.preventDefault();
		
		var form = event.target;


		if ( !$(form).checkRequiredFields() ) {
    		return
    	} else if ( $(form).find('input').filter('.valid').length !== 2 ) {
    		return
    	} else {

			Meteor.loginWithPassword($('#login_email').val(), $('#login_pas').val(), function(err) {
				
				if (err) {
					if ( err.reason === 'User not found') {
						$('#login_email').showError(err.reason).focus();
					} 
					else if (err.reason === 'Incorrect password'){
						$('#login_pas').showError(err.reason).focus();
					}
					
				} else {
					// Router.go('home');
					$(form).trigger('reset').find('.error_box').remove();
				}
			});
		}
		
	},

	'input #reg_form': function(event) {
		var elem = event.target,
			rexpEmail = /^[-\w]+@[-\w]+\.[A-z]{2,4}$/ig;
		

		$(elem).removeClass('valid');

		if ( elem.value === '' ) {
			$(elem).next('.error_box').remove();
		}
		else if ( elem.id === 'reg_email' && !rexpEmail.test(elem.value) ) {
			$(elem).showError('exampale@gmail.com')	
		}
		else if ( elem.id === 'reg_pas') {
			$('#confirm_pas').trigger('input');
			$(elem).checkPassword();
		}
		else if ( elem.id === 'confirm_pas') {
			
			if ( elem.value !== $('#reg_pas').val() ) {
				$(elem).showError('please type corect password')
			} else {
				$(elem).next('.error_box').remove();
				$(elem).addClass('valid');
			}
		}
		else {
			$(elem).next('.error_box').remove();
			$(elem).addClass('valid');
		};
	},

	'submit #reg_form': function(event) {
		event.preventDefault();

		var form = event.target;

    	
    	if ( !$(form).checkRequiredFields() ) {
    		return
    	} else if ( $(form).find('input').filter('.valid').length !== 4 ) {
    		return
    	} else {
    		Meteor.call('checkNewUserEmail', $('#reg_email').val(), function(err, res) {
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
				        		// Router.go('home');
				        		$(form).trigger('reset').find('.error_box').remove();
			        		}
						} 
					});
					
				}
			});
    	}	
	},

	
	'submit #forgot_pas_form': function(event) {
		event.preventDefault();

		var form = event.target;

		if ( !$(form).checkRequiredFields() ) {
    		return
    	};

    	var email = $('#forgot_email').val();

  		Accounts.forgotPassword(email);

	},



	'click #login_google': function(event) {
		
		Meteor.loginWithGoogle(function(err) {
			if (err) {
				alert(err.reason); 
				return
			}
		});
		
	}








})