Template.registerHelper('eventCreator', function() {
	var status = this.pizzaDay.status;
	if ( Meteor.userId() === this.pizzaDay.creator && 
									(status !== 'ordering') ) {
		return true;
	}
}),

Template.registerHelper('author', function() {
	if (this.founder) {
		if( this.founder.id === Meteor.userId() ){	
			return true;
		};
	}
	else {
		if( Template.parentData(1).founder.id === Meteor.userId() ){	
				return true;
		}
	};
});

Template.registerHelper('member', function() {
	if ( this._id ) {
		var members = this.members
	}
	else { 
		var members = Template.parentData(1).members 
	};
	
	for (key in members) {
		if( members[key].id === Meteor.userId() ){	
			return true
		};	
	};
});

Template.groupsList.helpers({
  	groups: function() {
  		var groups = Groups.find({}, 
  						{ 'fields': { 'logo':1, 'title':1, 'members':1, 'founder':1 } }
  					 );
  		return { list: groups, length: groups.fetch().length}
  	}
});

Template.menu.helpers({
	menuLenth: function() {
		return this.menu.length
	}
});

Template.pizzaDay.helpers({
	confirmedOrOrdered: function() {
		var members = Groups.findOne({'_id': this._id}).members;

		var member = members.find(function(elem, i, err) {
						if (elem.id === Meteor.userId()) {
							return true;
						}
					} );

		if ( !member.event ){
			return false
		} else if ( member.event.participation === 'canceled') {
			return false
		}
		else if( member.event.order) {
			return false
		};

		return true
	}
});

Template.notifications.helpers({
	notifications: function() {
		var not = Notifications.find();

		return { 'list':not, 'quantity': not.fetch().length}
	}
});

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
});

Template.email.helpers({
	creator: function() {		
		var userId = Template.currentData().member.id,
			pizzaDay = Template.currentData().pizzaDay;
		
		if (userId === pizzaDay.creator) {
			return true;
		};
		return;
	},

	groupOrder: function() {
		var data = Template.currentData(),
			res = [],
			members =  Groups.findOne({'_id':  data.groupId}).members;
		
		for (var i in members) {
			if (members[i].event.participation === 'confirmed') {
				var order = members[i].event.order;
			
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
				};
			};
		};
		return res;
	},

	groupPayment: function() {
		var pizzaDay = Template.currentData().pizzaDay;
		return pizzaDay.total - pizzaDay.discount;
	},
		
	user: function() {			
		var data = Template.currentData(),
			members =  Groups.findOne({_id: data.groupId}).members,
			count = 0;

		for (var i =0; i<members.length; i++) {
			if(members[i].event.participation === 'confirmed') {
				count = count+1;
			};
		};
	
		var a = {
				order: data.member.event.order,
				discount: data.pizzaDay.discount/count,
				total: data.member.event.total,
				payment: data.member.event.total - data.pizzaDay.discount/count
			};

		return a;
	}
});