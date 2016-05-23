Template.groups.events({

	'click .button_popup_window':function(event) {
		$(event.target).popupWindow();
	}
})


Template.groupsList.events({

	'click #groups_list a': function(event) {
		
		if ( !Meteor.user() ) {
			event.preventDefault();
			alert('This content is available only to registered users')
		}		
	},

	'click #groups_list': function(event) {
		
		var elem = event.target,
			groupId = $(elem).closest('.list_item').attr('id'),
			group = new Group(groupId);

		if ( $(elem).hasClass('del_group') ) {	
			event.preventDefault();
			group.removeGroup();
		}

		else if ( $(elem).hasClass('edit_group') ) {
			event.preventDefault();
			var group = Groups.findOne({'_id': groupId}, {'fields': {'title': 1, 'logo': 1} } );
			
			var button = $('#show_add_group_form');
			
			if ( $(button).hasClass('show') ) {
				$(button).trigger('click');
			}
			
			if( $('#editGroup_form').length ) {
				$('#cancel').trigger('click');
			}

			$('#add_button').hide();
			$('#edit_buttons').show();
			$(elem).next().hide();	

			$('#addGroup_form').attr('id', 'editGroup_form');
			
			$('#add_group').removeClass('submit');
			$('#edit_group').addClass('submit');

			$('#title').val(group.title).addClass('valid');
			$('#logo').val(group.logo).addClass('valid');

			$('#edit_span').text(group._id)
			$('#title').focus();
		};
	}
})


Template.newGroup.events({
	
	'input form': function(event) {
		var elem = event.target,
			validator = new Validator;

		$(elem).removeClass('valid');

		if ( elem.value === '' ) {
			$(elem).next('.error_box').remove();
		}
		else if (elem.id === 'title') {
			validator.validateName(elem);
		}
		else if ( elem.id ==='logo'  ) {
			validator.validateUrl(elem)
		}
	},

	'click #add_group': function(event) {
		event.preventDefault();

		var title = $('#title').val().toLowerCase(),
			logo = $('#logo').val() || 'http://www.rippleeffectlegacies.org/wp-content/uploads/2014/05/Group-Icon.png',
			form = (event.target).closest('form');
		
		if ( !$(form).checkRequiredFields() ){
			return
		}
		else if ( Groups.findOne( {'title': title}) ){
			$('#title').showError('Ououou... choose another title');
			return
		} 
		else {	
			var group = new Group();
			
			group.addGroup(title, logo);
			
			$(form).trigger("reset").find('.error_box').remove();
			Router.go('groupInfo', {title: title}, {query: 'navigateItem=members'})
		}
	},

	'click #edit_group': function(event) {
		event.preventDefault();

		var title = $('#title').val().toLowerCase(),
			logo = $('#logo').val() || 'http://www.rippleeffectlegacies.org/wp-content/uploads/2014/05/Group-Icon.png',
			groupId = $('#edit_span').text(),
			checkGroup = Groups.findOne({'title': title}, {'fields': {'title':1}}),
			form = (event.target).closest('form');	
		
		if ( !$(form).checkRequiredFields() ) {
			return
		} 
		else if ( !!checkGroup  && checkGroup._id !== groupId){
			$('#title').showError('Ououou... choose another title');
			return
		} 
		else{
			$('#cancel').trigger('click')
			$('.del_group').show();

			var group = new Group(groupId);
						
			group.editGroup(title, logo);
		}
	},

	'click #cancel': function(event) {
		$('#editGroup_form').attr('id', 'addGroup_form').trigger("reset")
							.find('.error_box').remove();

		$('#edit_group').removeClass('submit');
		$('#add_group').addClass('submit');

		$('#add_button').show();
		$('#edit_buttons').hide();

		$('.del_group').show();
	},
});