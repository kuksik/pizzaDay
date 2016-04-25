

Template.pizzaDay.events({


	'mouseenter a': function(event) {
		var elem = event.target;
		$(elem).css('color', '#B44279')
	},

	'mouseleave a': function(event) {
		var elem = event.target;
		$(elem).css('color', 'black')
	},



	'click #show_order_window': function(event) {
		

		$('#pizzaDay_container').append('<div id = "parent_popup"> <div>')
		$('#order_window').clone().show().appendTo('#parent_popup');
	},

	'click #order_window': function(event) {
		var elem = event.target;
		
		if ( elem.id === 'cancel_order' ) {
			$('#parent_popup').remove();
		}

	},

	'click .change_status': function(event) {
		
		var elem = event.target;

		if ( elem.id === 'delivering') {
			
			Groups.update( 
				{'_id': this._id}, 
				{$set: { 'pizzaDay.status': 'delivering'}
			});
			$(elem).attr('id', 'delivered');
		}
		else {
			Groups.update(
				{'_id': this._id}, 
				{$set: { 'pizzaDay' : {} } 
			});
			Router.go('/groups/' + this.title + '?navigateItem=members')
		}
	

	},

	'click #confirm_order': function(event) {
		
		event.preventDefault();

		var inputs = $('.quantity_items'),
			userId = Meteor.userId(),
			data = {};
		
		data['pizzaDay.orders.' + userId + '.order'] = [];
		
		
		var coupons = this.coupons,
			discount = 0;
			total = 0;

		for (var i=0; i<inputs.length; i++) {

			if ( inputs[i].value ) {

				var quantity = +inputs[i].value,
					menu = this.menu[ inputs[i].id ];

				data['pizzaDay.orders.' + userId + '.order'].push(	
							{ 
								'title': menu.title, 
								'price': menu.price,
								'quantity': quantity
							} ); 
				
				total = total + quantity * menu.price;
				while ( quantity !== 0 && coupons.indexOf(menu.title) > -1 ) {
					
					discount = discount + +menu.price;
					coupons.splice(coupons.indexOf(menu.title), 1);
					quantity = quantity - 1;

				};
			};
		};
		data['pizzaDay.orders.' + userId + '.total'] = total
		
		
		Groups.update({_id: this._id}, {$set: data});
		
		Groups.update(
					{'_id': this._id},
					{
						$set:{'coupons': coupons},
						
						$inc: {'pizzaDay.total': total, 'pizzaDay.discount': discount}
					}
		);


		
		$('#parent_popup').remove();

		var group = Groups.findOne({'_id': this._id},{'fields': {'members':1, 'pizzaDay':1} });
		var confirmed = group.pizzaDay.members.confirmed.length,
			canceled = group.pizzaDay.members.canceled,
			orders = Object.keys( group.pizzaDay.orders ).length;
			members = group.members.length;
		
		
		if ( canceled + confirmed === members && confirmed === orders	 ) {
			
			Groups.update( {'_id': this._id}, { $set:{'pizzaDay.status': 'ordered'} } );
			
			
	        members = group.pizzaDay.members.confirmed;
	        
      

	      	for (i=0; i<members.length; i++) {
		        
		   		var html=Blaze.toHTMLWithData(Template.email, {
		   			userId: members[i],
		   			pizzaDay: group.pizzaDay
		   		});     	
		   		
		   		// console.log(html)
		   		
		     	Meteor.call('sendEmail', members[i], html)
		    }



			
		}	

	},

	

})