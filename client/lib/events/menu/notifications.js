Template.notifications.events({

	'click #notifications_popup': function(event) {
		event.preventDefault();
		var elem = event.target;
		
		
		if ( $(elem).hasClass('notification_item') ) {


			
			$('.notification_window').attr('id', elem.id)
			
			$(elem).closest('li').append('<div id = "parent_popup"> <div>')
			$('.notification_window').clone().show().appendTo('#parent_popup');
			
			
			
		
			
		
		}
	},


	'click .notification_window': function(event) {
		event.preventDefault();
		
		var elem = event.target;
		
		var notification = Notifications.findOne({'_id': event.currentTarget.id})
		
		
		if ( elem.id === 'confirm_participation') {
			
			

			Groups.update(
				{'_id': notification.groupId},
				{
					$push: {'pizzaDay.members.confirmed': Meteor.userId() }
				}
			);

			$('#parent_popup').remove();
			
			
			Router.go('/groups/' + this.title + '?navigateItem=pizzaDay');
		}
		if ( elem.id === 'cancel_participation') {

			Groups.update(
				{'_id': notification.groupId},
				{
					$inc: {'pizzaDay.members.canceled': 1}
				}
			);

			$('#parent_popup').remove();
		}

		Notifications.update({'_id': notification._id}, 
						{$set: {'read': true}	});

	}



})