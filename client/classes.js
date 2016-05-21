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
	}

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
	constructor() {
		// this.group: = Grous.findOne({'_id': groupId})

		this.addGroup;
		this.editGroup;

		this.deleteMenuItem;
		this.addMenuItem;
		this.editMenuItem;
		
		this.addMember;
		this.deleteMember;
		this.addUserNotification;
		this.pizzaDayChangeStatus;

		this.addCoupon;
		this.deleteCoupon;

		this.confirmOrder;
		this.checkOrders;
	}

	checkOrders(groupId) {

		var members = Groups.findOne({'_id': groupId}).members
		
		for (var i=0; i<members.length; i++) {

			if (members[i].event) {
				
				if (members[i].event.participation === 'confirmed' && !members[i].event.order) {
					return false
				}
			}
			else {
				return false
			}
		}
		return true;
	};

	confirmOrder(groupId, inputs) {

		var group = Groups.findOne({ '_id': groupId }),
			members = group.members,
			coupons = group.coupons;
			
		var discount = 0,
			total = 0,
			order = [],
			usedCoupons = [];
		
		
		//order
		for (var i=0; i<inputs.length; i++) {

			if ( inputs[i].value ) {

				var quantity = +inputs[i].value,
					menu = group.menu[ inputs[i].id ];

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
					{ '_id': groupId }, 
					{ $set: data }
				);	
			
				break	
			}
		};
		
		Groups.update(
			{ '_id': groupId },
			{ $set:{'coupons': coupons} }
		);
	};


	deleteCoupon(groupId, couponId) {
		var data = {}
			data['coupons.'+ couponId ] =  1;
			
		Groups.update(
			{'_id': groupId},
			{ $unset: data }
		);
		Groups.update(
			{'_id': groupId}, 
			{$pull: {coupons: null} } 
		);
	}

	addCoupon(groupId, coupon) {
		Groups.update(
			{'_id': groupId},
			{ $push: { 'coupons': coupon } }
		);
	}

	pizzaDayChangeStatus(groupId, status){

		if ( status === 'ordering' ) {

			var members = Groups.findOne( {'_id': this._id} ).members;

        	var total = 0,
       			discount = 0;

	        for (var i=0; i< members.length; i++) {
	        	var event = members[i].event;
	        	if(event.participation === 'confirmed') {
	        		total = total + event.total;
	        		discount = discount + event.discount;
	        	}
	        }
	        
	        Groups.update(
	    		{'_id': groupId}, 
	    		{$set: {
	    			'pizzaDay.total': total, 
	    			'pizzaDay.status': 'ordered',
	    			'pizzaDay.discount':discount
	    		}}
	        );


        	for (i=0; i<members.length; i++) {
      		
		        if (members[i].event.participation === 'confirmed') {
		        	
			   		var html=Blaze.toHTMLWithData(Template.email, {
			   			groupId: groupId,
			   			member: members[i],
			   			pizzaDay: Groups.findOne({'_id': this._id}).pizzaDay
			   		});     	
			   		 	
			     	Meteor.call('sendEmail', members[i].id, html)
			    }
	   		}
		}

		else if ( status === 'ordered') {
			
			Groups.update( 
				{'_id': groupId}, 
				{$set: { 'pizzaDay.status': 'delivering'}
			});
		} 

		else if ( status === 'delivering') {

			Groups.find( {'_id': groupId} ).forEach( function(doc) {
				
				doc.members.forEach( function(member) {
					delete member.event;
				});

				delete doc.pizzaDay;
				
				Groups.update({'_id': doc._id}, 
					{
						$set: {'members': doc.members}, 
						$unset: {'pizzaDay': 1}
					});
			})
		}
	};

	deleteMember(memberId, groupId) {

		var group = Groups.findOne(
			{'_id': groupId},
			{ 'fields': {'members': 1, 'pizzaDay': 1} }
		)

		if (group.pizzaDay) {
			

			if( group.pizzaDay.status === 'ordering') {
				var members = group.members 

				var member = members.find(function (elem, i, members){
					if (elem.id === memberId) {
						return true;
					}

				})
				
				Meteor.call('removeUserNotification', member.id )

				if (member.event) {
					if (!member.event.usedCoupons) {

						var coup = [];
					}
					var coup = member.event.usedCoupons;

					for (var i=0; i<coup.length; i++) {
						
						Groups.update(
							{'_id': groupId}, 
							{
								$push: {'coupons': coup[i]},
							} );
					}

				}
				
			}
			
		}

		Groups.update( 
			{'_id': groupId}, 
			{ $pull: { 'members': {'id': memberId} } }
		);
	};

	addUserNotification(userId, groupId) {

		var group = Groups.findOne(
				{'_id': groupId},
				{ 'fields': {'title': 1, 'pizzaDay': 1} }
			)

		Notifications.insert(
			{
				'userId': userId,
				'creator': group.pizzaDay.creatorName,
				'groupId': groupId,
				'group': group.title,
				'date': (new Date()).toDateString(),
				'read': false 
			}
		)

	};

	addMember(groupId, userId, userName) {
		Groups.update( 
			{'_id': groupId}, 
			{$push: {'members': {'id': userId, 'name': userName } } }
		);

	};

	editMenuItem(groupId, menuId, title, price) {

		var data = {}
			data['menu.'+ menuId ] =  1;
		
		Groups.update(
			{'_id': groupId},
			{ $unset: data }
		);
		
		data = {}
		data['menu.'+ menuId ] =  {'title': title, 'price': price};
			
		Groups.update(
			{'_id': groupId}, 
			{$set: data },
			function(err) {
				if ( err ) {
					alert(err);
					return
				}
			} 
		);
	};

	addMenuItem(groupId, title, price) {
		Groups.update( 
			{'_id': groupId}, 
			{$push: {'menu': {'title': title, 'price': price} } },
			function(err) {
				if( err ) {
					alert(err.reason)
					return
				}
				
			} 
		);


	}



	deleteMenuItem(groupId, menuItem) {
		Groups.update( 
			{'_id': groupId}, 
			{ $pull: {'menu': { 'title': menuItem } } } 
		);
	};
	editGroup(groupId, title, logo) {
		Groups.update(
			{'_id': groupId}, 
			{$set: {'title': title, 'logo': logo} }
		);
	};

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
				}, 
				function() {
					
				}
			);	
	}
}