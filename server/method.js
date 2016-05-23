Meteor.startup( function() {
	process.env.MAIL_URL = 'smtp://kuks:b12ckh01e@smtp.sendgrid.net:587';
});
Meteor.methods({

	'checkNewUserEmail': function(email) {
    	return !!Accounts.findUserByEmail(email)
	},

	'removeNotifications': function(groupId) {
		Notifications.remove({'groupId': groupId})
	},

	'removeUserNotification': function(userId) {
		Notifications.remove({'userId': userId})
	},

	'removeGroup': function(groupId) {
		Groups.remove({'_id': groupId});
	},

	'addEvent' : function(groupId, userId, participation) {
		if (!Groups.findOne({_id: groupId}).pizzaDay) {
  			Groups.update( 
    			{'_id': groupId},
    			{ $set: { 'pizzaDay': {
					created:true,
					date: (new Date()).toDateString(), 
					creator: Meteor.userId(),
					creatorName: Meteor.user().profile.name,     
					status: "ordering"
              	} } }  
			);
		};          
		
		Groups.update( 
  			{ '_id': groupId, 'members.id': userId },
  			{ $set: { 
      			'members.$.event': {
        			'participation': participation,
        			'usedCoupons': []
      			}
       		} }
		);
	},

	'addOrder': function(groupId, userId, order) {
		Groups.update(
			{ '_id': groupId, 'members.id':userId },
			{ $set: { 'members.$.event.order': order} } 
		);
	},

	'sendEmail': function(userId, html) {
            
	    var user = Users.findOne(
	    			{ '_id': userId },
	    			{ 'fields': { 'services.google.email': 1, 'emails.address': 1 } }
	    		);

	    if (user.services.google) {  
	     	var email = user.services.google.email;
	    }
    	else {
      		var email = user.emails[0].address;
    	};

    	Email.send({
      		to: email,
      		from: "pizzaday-admin@gmail.com",
   	   	    subject: "Your order confirmed!",
   	   		html: html
    	});  
	}
});