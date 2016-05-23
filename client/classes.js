Validator = class Validator {
	constructor () {
		this.rexpName = /^[-\w\s]{1,20}$/i;
		this.rexpEmail = /^[-\w\.]+@[-\w]+\.[A-z]{2,4}$/ig;
		this.rexpPrice =  /^(?!0*[.]0*$|[.]0*$|0*$)\d{0,}[.]?\d{1,}$/;
		this.rexpUrl = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
		this.rexpNum = /^\d{1,}$/;

		this.validateName;
		this.validateEmail;
		this.validatePas;
		this.validateConPas;
		this.validatePrice;
		this.validateUrl;
		this.validateSigninPas;
	}

	validateSigninPas(elem) {
		if ( elem.value.length > 5 ) {
			$(elem).addClass('valid');
		}
	};

	validateNum(elem) {
		if ( !this.rexpNum.test(elem.value) ) {
			$(elem).showError('only integer');	
		}
		else {
			$(elem).addClass('valid').next('.error_box').remove();
		}
	};

	validateName(elem) {
		if ( elem.value.length > 20 ){
			$(elem).showError('only 20 characters')
		}
		else if( !this.rexpName.test(elem.value) ) {
			$(elem).showError('use symbols: a-z, A-z, 0-9, _, -')	
		} 
		else {
			$(elem).addClass('valid').next('.error_box').remove();
		}
	};

	validateEmail(elem) {
		if ( elem.value.length > 50) {
			$(elem).showError('only 50 characters')
		}
		else if ( !this.rexpEmail.test(elem.value) ) {
			$(elem).showError('user@example.com <br> use symbols: a-z, A-z, 0-9, _, -');
		}
		else {
			$(elem).addClass('valid').next('.error_box').remove();
		}
	};

	validatePas(elem) {
		var strongRegex = 
				/^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).*$/g;
		var mediumRegex = 
				/^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$/g;
		var enoughRegex = /(?=.{6,}).*/g;

		var pas = $(elem).val()
		
		if ( pas.length  < 6 ) {
			$(elem).showError('more characters');
		}
		else if ( pas.length > 255 ) {
			$(elem).showError("<span style=\"color:black\">only 255 characters</span>")
				.addClass('valid');	
		}
		else if (strongRegex.test(pas)) {
			$(elem).showError('<span style=\"color:black\">Strong!</span>')
				.addClass('valid');
		}else if (mediumRegex.test(pas)) {
			
			$(elem).showError("<span style=\"color:red\">Medium</span>")
				.addClass('valid');
		} else if (enoughRegex.test(pas)){
			$(elem).showError("<span style=\"color:blue\">Weak!</span>")
				.addClass('valid');
		} 
	};

	validateConPas(elem) {
		if ( elem.value !== $('#reg_pas').val() ) {
			$(elem).showError('please type corect password')
		} 
		else {
			$(elem).addClass('valid').next('.error_box').remove();
		}
	};

	validatePrice(elem) {
		if( !this.rexpPrice.test(elem.value) ) {
			$(elem).showError('price should be decimal value')
		}
		else {
			$(elem).addClass('valid').next('.error_box').remove();
		}
	};

	validateUrl(elem) {
		if ( !this.rexpUrl.test(elem.value) ){
			$(elem).showError('type corect url')
		}
		else {
			$(elem).addClass('valid').next('.error_box').remove();
		}
	};
};


Group = class Group {
	constructor(groupId) {
		this.groupId = groupId;
		this.group = Groups.findOne({ '_id': groupId });

		this.addGroup;
		this.editGroup;
		this.removeGroup;

		this.addMember;
		this.deleteMember;
		
		this.addMenuItem;
		this.editMenuItem;
		this.deleteMenuItem;
		
		this.addCoupon;
		this.deleteCoupon;

		this.addPizzaDay;
		this.pizzaDayChangeStatus;

		this.addNotification;
		this.readNotification;
		this.removeNotifications;

		this.confirmOrder;
		this.checkOrders;
	}


	addGroup(title, logo) {
		var founderId = Meteor.userId(),	
			founderName = Meteor.user().profile.name;
		
		Groups.insert({
				'title': title, 
				'logo': logo,
				'founder': { 
					'id': founderId,
					'name': founderName
					},
				'members': [{
					'id': founderId, 
					'name': founderName,
					'founder': true
					}],
				'menu': [],
	      		'coupons': []
			}
		);	
	};

	editGroup(title, logo) {
		Groups.update(
			{'_id': this.groupId}, 
			{$set: {'title': title, 'logo': logo} }
		);
	};

	removeGroup() {
		Meteor.call('removeGroup', this.groupId);
	};



	addMember(userId, userName) {
		
		Groups.update( 
			{ '_id': this.groupId }, 
			{ $push: {'members': { 'id': userId, 'name': userName } } }
		);
	};

	deleteMember(memberId) {
		if (this.group.pizzaDay) {

			if( this.group.pizzaDay.status === 'ordering') {
				var member = this.group.members .find(function (elem, i, members){
					if (elem.id === memberId) {
						return true;
					}
				});
				
				Meteor.call('removeUserNotification', member.id );

				if (member.event) {
					if (!member.event.usedCoupons) {
						var coup = [];
					};

					var coup = member.event.usedCoupons;

					for (var i=0; i<coup.length; i++) {
						Groups.update(
							{'_id': this.groupId}, 
							{ $push: { 'coupons': coup[i] }	} 
						);
					};
				};	
			};
		};

		Groups.update( 
			{'_id': this.groupId}, 
			{ $pull: { 'members': {'id': memberId} } }
		);
	};



	addMenuItem(title, price) {
		Groups.update( 
			{ '_id': this.groupId }, 
			{ $push: { 'menu': { 'title': title, 'price': price } } }  
		);
	};

	deleteMenuItem(menuItem) {
		Groups.update( 
			{'_id': this.groupId}, 
			{ $pull: {'menu': { 'title': menuItem } } } 
		);
	};

	editMenuItem(menuId, title, price) {
		var data = {}
			data['menu.'+ menuId ] =  1;
		
		Groups.update(
			{'_id': this.groupId},
			{ $unset: data }
		);
		
		data = {}
		data['menu.'+ menuId ] =  {'title': title, 'price': price};
			
		Groups.update(
			{ '_id': this.groupId }, 
			{$set: data },
		);
	};



	addCoupon(coupon) {
		Groups.update(
			{ '_id': this.groupId },
			{ $push: { 'coupons': coupon } }
		);
	};

	deleteCoupon(groupId, couponId) {
		var data = {}
			data['coupons.'+ couponId ] =  1;
			
		Groups.update(
			{'_id': this.groupId},
			{ $unset: data }
		);

		Groups.update(
			{ '_id': this.groupId }, 
			{ $pull: { coupons: null } } 
		);
	};




	addPizzaDay(participation) {
		Meteor.call('addEvent', this.groupId, Meteor.userId(), participation)
	};

	pizzaDayChangeStatus(status){

		if ( status === 'ordering' ) {
			var members = this.group.members;

        	var total = 0,
       			discount = 0;

	        for (var i=0; i< members.length; i++) {
	        	var event = members[i].event;
	        	if ( event.participation === 'confirmed' ) {
	        		total = total + event.total;
	        		discount = discount + event.discount;
	        	}
	        }
	        
	        Groups.update(
	    		{'_id': this.groupId}, 
	    		{$set: {
	    			'pizzaDay.total': total, 
	    			'pizzaDay.status': 'ordered',
	    			'pizzaDay.discount':discount
	    		}}
	        );

        	for (i=0; i<members.length; i++) {
      		
		        if (members[i].event.participation === 'confirmed') {
		        	
			   		var html=Blaze.toHTMLWithData(Template.email, {
			   			groupId: this.groupId,
			   			member: members[i],
			   			pizzaDay: Groups.findOne({'_id': this.groupId}).pizzaDay
			   		});     	
			   		 	
			     	Meteor.call('sendEmail', members[i].id, html)
			    }
	   		}
		}

		else if ( status === 'ordered') {
			Groups.update( 
				{'_id': this.groupId}, 
				{ $set: { 'pizzaDay.status': 'delivering' } }
			);
		} 

		else if ( status === 'delivering') {
			Groups.find( {'_id': this.groupId} ).forEach( function(doc) {
				
				doc.members.forEach( function(member) {
					delete member.event;
				});

				delete doc.pizzaDay;
				
				Groups.update({'_id': doc._id}, 
					{
						$set: {'members': doc.members}, 
						$unset: {'pizzaDay': 1}
					}
				);
			});
		};
	};




	addNotification(userId, creatorName) {
		Notifications.insert(
			{
				'userId': userId,
				'creator': creatorName,
				'groupId': this.groupId,
				'group': this.group.title,
				'date': (new Date()).toDateString(),
				'read': false 
			}
		)
	};

	readNotifiction(notificationId) {
		Notifications.update(
			{'_id': notificationId}, 
			{ $set: { 'read': true } }
		);
	};

	removeNotifications() {
		Meteor.call('removeNotifications', this.groupId)
	};



	confirmOrder(inputs) {
		var members = this.group.members,
			coupons = this.group.coupons;
			
		var discount = 0,
			total = 0,
			order = [],
			usedCoupons = [];
		
		
		//order
		for (var i=0; i<inputs.length; i++) {

			if ( inputs[i].value ) {
				var quantity = +inputs[i].value,
					menu = this.group.menu[ inputs[i].id ];

				order.push(	
					{ 
						'title': menu.title, 
						'price': menu.price,
						'quantity': quantity
					}
				); 
				
				total = total + quantity * menu.price;

				while ( quantity !== 0 && coupons.indexOf(menu.title) > -1 ) {
					discount = discount + +menu.price;
					coupons.splice(coupons.indexOf(menu.title), 1);
					usedCoupons.push(menu.title);
					quantity = quantity - 1;
				};
			};
		};
		
		for (var i=0; i<members.length; i++ ) {
			
			if( members[i].id === Meteor.userId() ) {
				
				members[i].event = {
					order: order,
					total: total,
					discount: discount,
					usedCoupons: usedCoupons,
					participation: 'confirmed'
				};
								
				var data = {}
				data['members.' + i] = members[i];

				Groups.update(
					{ '_id': this.groupId }, 
					{ $set: data }
				);	
				break	
			}
		};
		
		Groups.update(
			{ '_id': this.groupId },
			{ $set:{ 'coupons': coupons } }
		);
	};	

	checkOrders() {
		var members = this.group.members;
		
		for (var i=0; i<members.length; i++) {
			
			if (members[i].event) {

				if (members[i].event.participation === 'confirmed' && !members[i].event.order) {
					return false
				}
			}
			else {
				return false
			};
		};
		return true;
	};
};