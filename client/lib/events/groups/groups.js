Template.groups.events({
	'click .button_popup_window':function(event) {
		$(event.target).popupWindow();
	}
})


Template.newGroup.events({
	

	'click #add_group': function(event) {
		event.preventDefault();

		var title = $('#title').val(),
			form = event.target;
		
		if ( !$(form).checkRequiredFields() ){
			return
		}	
		else if ( Groups.findOne( {'title': title}) ){
			$('#title').showError('Ououou... choose another name');
			return
		} 
		else {
			var logo = $('#logo').val() || 'http://www.rippleeffectlegacies.org/wp-content/uploads/2014/05/Group-Icon.png',
				founderId = Meteor.userId(),	
				userName = Meteor.user().profile.name;
			
			Groups.insert({
				'title': title, 
				'logo': logo,
				'founder': { 
					'id': founderId,
					'name': userName
					},
				'members': [{
					'id': founderId, 
					'name': userName,
					'founder': true
					}],
				'menu': [],
          		'coupons': [],
          		'pizzaDay':{}
				}, 
				function() {
					$(form).trigger("reset").find('.error_box').remove();
					Router.go('groupInfo', {title: title})
				}
			);	
		}
	},


	'click edit_group': function(event) {
		event.preventDefault();

		var title = $('#title').val(),
			logo = $('#logo').val() || 'http://www.rippleeffectlegacies.org/wp-content/uploads/2014/05/Group-Icon.png',
			id = $('#edit_span').text(),
			checkGroup = Groups.findOne({'title': title}, {'fields': {'title':1}}),
			form = event.target;		
		
		

		if ( !$(form).checkRequiredFields() ) {
			return
		} else if ( !!checkGroup  && checkGroup._id !== id){
			$('#title').showError('Ououou... choose another name');
			return
		} 
		else{
			$('#cancel').trigger('click')
			$('.del_group').show();
			Groups.update(
				{'_id': id}, 
				{$set: {'title': title, 'logo': logo} }
			);
		}
	},

	'click #cancel': function(event) {
		$('#editGroup_form').attr('id', 'addGroup_form').trigger("reset")
							                            .find('.error_box').remove();

		$('#add_button').show();
		$('#edit_buttons').hide();

		$('.del_group').show();
	},
})



Template.groupsList.events({


	

	'click #groups_list': function(event) {
		
		


		var elem = event.target,
			id = $(elem).closest('.list_item').attr('id');


		if ( $(elem).hasClass('del_group') ) {	
			event.preventDefault();
			Groups.remove({'_id': id});
		}

		else if ( $(elem).hasClass('edit_group') ) {
			event.preventDefault();
			var group = Groups.findOne({'_id': id}, {'fields': {'title': 1, 'logo': 1} } );
			
			$('#show_add_group_form').trigger('click');

			$('#add_button').hide();
			$('#edit_buttons').show();

			$('#addGroup_form').attr('id', 'editGroup_form');
			
			$('#title').val(group.title);
			$('#logo').val(group.logo);
			$('#edit_span').text(group._id)
			$('#title').focus();
			$(elem).siblings('.del_group').hide();	
		};

	}

})








