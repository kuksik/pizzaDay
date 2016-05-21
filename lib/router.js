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
			this.red('/groups/' + this.params.title + '?navigateItem=members');
		}
		
	},

	{
		name: 'groupInfo',
		data: function() { 	
			return Groups.findOne( {title: this.params.title} );
		}
	}
);

Router.onBeforeAction('loading');