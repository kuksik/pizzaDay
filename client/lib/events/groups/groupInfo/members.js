Template.members.events({

	


	'click #members_list': function(event) {
		event.preventDefault();
		var elem = event.target;

		if ( $(elem).hasClass('del_user') ) {
			
			var id = $(elem).attr('id');
			
			Groups.update( {'_id': this._id}, 
						   {$pull: {'members': {'id': id} } }
			);
		}
	},

	'click #users_container': function(event) {

		event.preventDefault();
		
		var elem = event.target;


		if ( $(elem).hasClass('add_user') ) {
			var name = $(elem).attr('name'),
				id = $(elem).attr('id');
			
			
			Groups.update( 
				{'_id': this._id}, 
				{$push: {'members': {'id': id, 'name': name } } }
			);
			
		}

	},


	



})