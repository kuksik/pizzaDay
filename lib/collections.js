Users = Meteor.users;
Groups = new Mongo.Collection('Groups');
Notifications = new Mongo.Collection('Notifications');
	
Notifications.allow({
	insert: function (userId, doc) {
		return !! userId;
	},
	update: function (userId, doc, fields, modifier) {
		return !! userId;
	}
});

Groups.allow({
    insert: function(userId, doc) {
	    return !! userId;
    },
    update: function(userId, doc) {
 	    return !! userId;
    },
});

