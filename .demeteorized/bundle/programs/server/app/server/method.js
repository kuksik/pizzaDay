(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/method.js                                                    //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Meteor.startup(function () {                                           // 1
	process.env.MAIL_URL = 'smtp://kuks:b12ckh01e@smtp.sendgrid.net:587';
});                                                                    //
Meteor.methods({                                                       // 4
                                                                       //
	'chekcNewUserInfo': function (data) {                                 // 6
		var res = { 'valid': true };                                         // 7
                                                                       //
		if (!!Accounts.findUserByEmail(data.email)) {                        // 9
			res.email = !!Accounts.findUserByEmail(data.email);                 // 10
			res.valid = false;                                                  // 11
		};                                                                   //
		if (!!Users.findOne({ 'profile.name': data.name })) {                // 13
			res.name = !!Users.findOne({ 'profile.name': data.name });          // 14
			res.valid = false;                                                  // 15
		}                                                                    //
                                                                       //
		return res;                                                          // 18
	},                                                                    //
                                                                       //
	'removeNotifications': function (groupId) {                           // 21
		Notifications.remove({ 'groupId': groupId });                        // 22
	},                                                                    //
                                                                       //
	'removeUserNotification': function (userId) {                         // 25
		Notifications.remove({ 'userId': userId });                          // 26
	},                                                                    //
                                                                       //
	'removeGroup': function (groupId) {                                   // 29
		Groups.remove({ '_id': groupId });                                   // 30
	},                                                                    //
                                                                       //
	'addEvent': function (groupId, userId, participation) {               // 33
		if (!Groups.findOne({ _id: groupId }).pizzaDay) {                    // 34
			Groups.update({ '_id': groupId }, { $set: { 'pizzaDay': {           // 35
						created: true,                                                   // 38
						date: new Date().toDateString(),                                 // 39
						creator: Meteor.userId(),                                        // 40
						creatorName: Meteor.user().profile.name,                         // 41
						status: "ordering"                                               // 42
					} } });                                                           //
		};                                                                   //
                                                                       //
		Groups.update({ '_id': groupId, 'members.id': userId }, { $set: {    // 47
				'members.$.event': {                                               // 50
					'participation': participation,                                   // 51
					'usedCoupons': []                                                 // 52
				}                                                                  //
			} });                                                               //
	},                                                                    //
                                                                       //
	'addOrder': function (groupId, userId, order) {                       // 58
		Groups.update({ '_id': groupId, 'members.id': userId }, { $set: { 'members.$.event.order': order } });
	},                                                                    //
                                                                       //
	'sendEmail': function (userId, html) {                                // 65
		var user = Users.findOne({ '_id': userId }, { 'fields': { 'services.google.email': 1, 'emails.address': 1 } });
                                                                       //
		if (user.services.google) {                                          // 71
			var email = user.services.google.email;                             // 72
		} else {                                                             //
			var email = user.emails[0].address;                                 // 75
		};                                                                   //
                                                                       //
		Email.send({                                                         // 78
			to: email,                                                          // 79
			from: "pizzaday-admin@gmail.com",                                   // 80
			subject: "Your order confirmed!",                                   // 81
			html: html                                                          // 82
		});                                                                  //
	}                                                                     //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=method.js.map
