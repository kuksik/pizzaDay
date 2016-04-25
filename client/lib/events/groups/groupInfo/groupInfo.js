Template.groupInfo.events({


	'mouseenter #navigate_items a': function(event) {
		event.preventDefault();
		var elem = event.target;
		$(elem).addClass('focus_navigate_item');


	},
	'mouseleave #navigate_items a': function(event) {
		event.preventDefault();	
		var elem = event.target;
		$(elem).removeClass('focus_navigate_item');
	},

	'click #navigate_items': function(event) {
			
		$('.navigate_item').removeClass('selected_navigate_item');
		$(event.target).addClass('selected_navigate_item');
	},



	'click #create_pizzaDay': function(event) {
		
		event.preventDefault();

		var elem = event.target;

		if ( !this.menu.length ) {
			alert('please add item to menu')
			return
		}			


	

		Groups.update( 
			{'_id': this._id},
			{$set: { 'pizzaDay': {
				created:true,
				date: (new Date()).toDateString(), 
            	creator: Meteor.userId(),
            	members: 
            		{
            			confirmed: [ Meteor.userId() ],
            			canceled: 0
            		},
            	orders: {}, 
            	total: 0,
            	discount: 0,
            	status: "Ordering"
			} } },
			function(err) {
				if( err ) {
					alert(err)
					return
				}				
			}
		);


		//send notifications
		var members = this.members
		
		
		for (var i= 0; i < members.length; i++) {

			if ( members[i].id !== Meteor.userId() ) {

				Notifications.insert(
					{
						'userId': members[i].id,
						'creator': Meteor.user().profile.name,
						'groupId': this._id,
						'group': this.title,
						'read': false 
					}
				)
			}
		}

		
		Router.go('/groups/' + this.title + '?navigateItem=pizzaDay')
	},


	'click .button_popup_window':function(event) {
		$(event.target).popupWindow();
	},


	


})