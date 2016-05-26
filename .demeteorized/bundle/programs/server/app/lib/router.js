(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// lib/router.js                                                       //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Router.configure({                                                     // 1
	layoutTemplate: 'layout',                                             // 2
	loadingTemplate: 'loading',                                           // 3
	waitOn: function () {                                                 // 4
		return Meteor.subscribe('Groups');                                   // 4
	},                                                                    //
	waitOn: function () {                                                 // 5
		return Meteor.subscribe('Users');                                    // 5
	}                                                                     //
});                                                                    //
                                                                       //
Router.route('/', { name: 'home' });                                   // 8
Router.route('/groups', { name: 'groups' });                           // 9
                                                                       //
Router.route('/groups/:title', function () {                           // 12
                                                                       //
	var region = this.params.query.navigateItem;                          // 14
                                                                       //
	this.render('groupInfo');                                             // 16
                                                                       //
	if (region) {                                                         // 18
		this.render(region, { to: 'aboutGroup' });                           // 19
	} else {                                                              //
		this.render('/groups/' + this.params.title + '?navigateItem=members');
	}                                                                     //
}, {                                                                   //
	name: 'groupInfo',                                                    // 28
	data: function () {                                                   // 29
		return Groups.findOne({ title: this.params.title });                 // 30
	}                                                                     //
});                                                                    //
                                                                       //
var requireLogin = function () {                                       // 35
	if (!Meteor.user()) {                                                 // 36
		if (Meteor.loggingIn()) {                                            // 37
			this.render(this.loadingTemplate);                                  // 38
		} else {                                                             //
			this.render('accessDenied');                                        // 40
		}                                                                    //
	} else {                                                              //
		this.next();                                                         // 43
	}                                                                     //
};                                                                     //
                                                                       //
Router.onBeforeAction(requireLogin, { only: 'groupInfo' });            // 48
Router.onBeforeAction('loading');                                      // 49
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=router.js.map
