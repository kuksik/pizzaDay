Notifications = new Mongo.Collection('Notifications');

Groups = new Mongo.Collection('Groups');

Users = Meteor.users;


Notifications.allow({
	insert: function (userId, doc) {
		return !! userId;
	},
	update: function (userId, doc, fields, modifier) {
		return !! userId;
	}
	
	// remove: function (userId, doc) {
	// 	//...
	// },
	// fetch: ['owner'],
	// transform: function () {
	// 	//...
	// }
});


Groups.allow({
    insert: function(userId, doc) {
	    return !! userId;
    },
    update: function(userId, doc) {
 	    return !! userId;
    },
    remove: function(userId, doc) {
	  	return !! userId;
	}
});



