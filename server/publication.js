Meteor.publish('Groups', function() {
  return Groups.find();
});

Meteor.publish('Users', function() {
  return Users.find({}, 
  		{'fields': {'_id': 1, 'profile.name': 1} } );
});

Meteor.publish('Notifications', function() {
	
  	return Notifications.find( {'userId': this.userId, 'read': false} );
});
