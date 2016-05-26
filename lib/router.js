Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	waitOn: function() { return Meteor.subscribe('Groups'); },
	waitOn: function() { return Meteor.subscribe('Users'); }
});

Router.route('/', {name: 'home'});
Router.route('/groups', {name: 'groups'});


Router.route('/groups/:title', function() {
			
		var region = this.params.query.navigateItem;

		this.render('groupInfo')

		if ( region ) {
			this.render(region, {to: 'aboutGroup'})			
		}
		else {
			this.render('/groups/' + this.params.title + '?navigateItem=members');
		}
		
	},

	{
		name: 'groupInfo',
		data: function() { 	
			return Groups.findOne( {title: this.params.title} );
		}
	}
);

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
};


Router.onBeforeAction(requireLogin, {only: 'groupInfo'});
Router.onBeforeAction('loading');