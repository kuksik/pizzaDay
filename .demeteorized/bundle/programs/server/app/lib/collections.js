(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// lib/collections.js                                                  //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Users = Meteor.users;                                                  // 1
Groups = new Mongo.Collection('Groups');                               // 2
Notifications = new Mongo.Collection('Notifications');                 // 3
                                                                       //
Notifications.allow({                                                  // 5
	insert: function (userId, doc) {                                      // 6
		return !!userId;                                                     // 7
	},                                                                    //
	update: function (userId, doc, fields, modifier) {                    // 9
		return !!userId;                                                     // 10
	}                                                                     //
});                                                                    //
                                                                       //
Groups.allow({                                                         // 14
	insert: function (userId, doc) {                                      // 15
		return !!userId;                                                     // 16
	},                                                                    //
	update: function (userId, doc) {                                      // 18
		return !!userId;                                                     // 19
	}                                                                     //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=collections.js.map
