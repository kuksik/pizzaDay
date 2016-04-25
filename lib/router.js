Router.configure({
	layoutTemplate: 'layout',
	// autoRender: false
	loadingTemplate: 'loading',
	waitOn: function() { return Meteor.subscribe('Groups'); },
	waitOn: function() { return Meteor.subscribe('Users'); },
	
});

// Router.route('/', {name: 'home'});
Router.route('/home', {name: 'home'});
Router.route('/groups', {name: 'groups'});

Router.route('/groups/:title', function() {
			
		if( !Meteor.user() ) {	
			Router.go('home')
		}
		
		var region = this.params.query.navigateItem;

		this.render('groupInfo')

		if ( region ) {
			
			this.render(region, {to: 'aboutGroup'})			
		}

		else {
			this.render('members', {to: 'aboutGroup'})	
		}
		
	},

	{
		name: 'groupInfo',
		data: function() { 	

			return Groups.findOne( {title: this.params.title} );
		}
	}
);


// Router.route('/groups/:title/:navigateItem', function() {
	

// 	if( this.params.navigateItem === 'members') {
		
// 		this.render('GroupMembers', {to: 'aboutGroup',
// 		data: function() {
// 			return Groups.findOne( 
// 				{'title': this.params.title}, 
// 				{'fields': { 
// 					'members':1,
// 					'founder':1 
// 				} 
// 			});
// 		}}
  			
// 		);
// 	}
// 	// console.log(this.params)
// })

// Router.route('/groups/:title/pizzaDay', function() {
// 		if( !Meteor.user() ) {	
// 			Router.go('home')
// 		}

// 		this.render('pizzaDay', {
// 			data: function() {
// 				return Groups.findOne( {title: this.params.title} ); },
// 			waitOn: function() { return Meteor.subscribe('Groups'); }
// 		})
// 	},
// 	{name: 'pizzaDay'}
// );




Router.onBeforeAction('loading');