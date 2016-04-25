Template.groupsList.helpers({
  	group: function() {

    	return Groups.find({}, {'fields': {'pizzaDay':0} });
  	},

 //  	author: function() {

	// 	if( this.founder.id === Meteor.userId() ){	
	// 		return true
	// 	}
	// }
});

Template.menu.helpers({

	menuLenth: function() {
		return this.menu.length
	}



});

Template.registerHelper('eventCreator', function() {

		
	if ( Meteor.userId() === this.pizzaDay.creator) {
		return true;
	}
}),



Template.email.helpers({

	creator: function() {
		
		var userId = Template.currentData().userId,
			pizzaDay = Template.currentData().pizzaDay;
		
		if (userId === pizzaDay.creator) {
			return true;
		}
		return 
	},

	groupOrder: function() {
		var pizzaDay = Template.currentData().pizzaDay,
			userId = Template.currentData().userId,
			data = pizzaDay.orders,
			res = [];
		

		for (var i in data){
			
			var order = data[i].order;
			
			for (var key  in order ) {
		
				var title = order[key].title,
					index = res.findIndex(function(elem, index, arr) {
								if (elem.title === title ) {
									return true
								}
							});
				
				if( index === -1 ) {
					res.push(order[key])
				}
				else {
					res[index].quantity += order[key].quantity
				}	

			} 
		}
		
		
		
		return res;
	},

	groupPayment: function() {
		var pizzaDay = Template.currentData().pizzaDay;
		return pizzaDay.total - pizzaDay.discount;
	},

	user: function() {
		var userId = Template.currentData().userId,
			pizzaDay = Template.currentData().pizzaDay;

		discount = pizzaDay.discount/ pizzaDay.members.confirmed.length;
		
		data = pizzaDay.orders[userId];
		data.discount = discount;
		data.payment =pizzaDay.orders[userId].total - discount;

		return data;
	}
})




Template.registerHelper('author', function() {
	
	if (this.founder) {
		if( this.founder.id === Meteor.userId() ){	
			return true
		}
	}
	else {
		if( Template.parentData(1).founder.id === Meteor.userId() ){	
				return true
		}
	}
})

Template.registerHelper('member', function() {
	
	

	if ( this._id ) {
		var members = this.members
	}
	else { 
		var members = Template.parentData(1).members 
	}
	
	for (key in members) {
	
		if( members[key].id === Meteor.userId() ){	
			return true
		}	
	};
})

Template.notifications.helpers({


	notifications: function() {

		var not = Notifications.find();
		
		
		return { 'list':not, 'quantity': not.fetch().length}
	}
})
Template.members.helpers({




	users: function() {
		
		var data = this.members
			membersID = [];
		for (var key in data) {

			membersID.push( data[key].id );
		};

		var users = Users.find({'_id': {$nin: membersID } }) ;
		
		return {'list': users, 'quantity': users.fetch().length } ;
	}	
});

Template.coupons.helpers({
	couponsQuantity: function() {
		return this.coupons.length
	}
})



