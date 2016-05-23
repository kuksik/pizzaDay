Template.groupInfo.events({

	'mouseenter .navigate_item': function(event) {
		if( !$(event.currentTarget).hasClass('selected_green') ) {
			$(event.currentTarget).css('color', '#00b300');
		}
	},

	'mouseleave .navigate_item': function(event) {
		if( !$(event.currentTarget).hasClass('selected_green') ) {
			$(event.currentTarget).css('color', 'black');
		}
	},

	'click #create_pizzaDay': function(event) {	
		var elem = event.target,
			group = new Group(this._id);

		if ( !this.menu.length ) {
			Router.go(document.location.pathname + '?navigateItem=menu');
			alert('please add item to menu')
			return
		}			

		group.addPizzaDay('confirmed');
		
		// send notifications
		var members = this.members;		
		
		for (var i= 0; i < members.length; i++) {
			if ( members[i].id !== Meteor.userId() ) {
				group.addNotification(members[i].id, Meteor.user().profile.name)
			}
		}
		
		Router.go('/groups/' + this.title + '?navigateItem=pizzaDay')
		$('.navigate_item').css('color', 'black').removeClass('selected_green');
		Meteor.setTimeout(function() { $('#navigate_items > a#pizzaDay').addClass('selected_green')}, 200)
	},


	'click .button_popup_window':function(event) {
		$(event.target).popupWindow();
	},
})


Template.members.events({

	'click #members_list': function(event) {
		event.preventDefault();
		var elem = event.target;

		if ( $(elem).hasClass('del_user') ) {
			
			var memberId = $(elem).attr('id'),
				group = new Group(this._id);

			group.deleteMember(memberId)
		}
	},

	'click #users_container': function(event) {
		event.preventDefault();		
		var elem = event.target;

		if ( $(elem).hasClass('add_user') ) {
			var userName = $(elem).attr('name'),
				userId = $(elem).attr('id'),
				group = new Group(this._id);
			
			group.addMember(userId, userName);
			
			if(this.pizzaDay && this.pizzaDay.status === 'ordering' && this.pizzaDay.date === (new Date()).toDateString() ) {
				group.addNotification(userId, this.pizzaDay.creatorName);
			}	
		}
	}
})


Template.menu.events({

	'click #menu_list': function(event) {
		
		var elem = event.target,
			menuItem = this.menu[ $(elem).closest('.list_item').attr('id') ];

		if ( $(elem).hasClass('del_item') ) {
			
			var group = new Group(this._id,);

			group.deleteMenuItem(menuItem.title);
		};

		if ( $(elem).hasClass('edit_item') ){

			var button = $('#show_add_menu_form');
			
			if ( $(button).hasClass('show') ) {
				$(button).trigger('click');
			}

			if( $('#editMenuItem_form').length ) {
				$('#cancel').trigger('click');
			}

			$('#add_button').hide();
			$('#edit_buttons').show();
			$('#edit_menu_item').addClass('submit')
			$('#add_menu_item').removeClass('submit')
			$(elem).next('.del_item').hide();

			$('#addMenuItem_form').attr('id', 'editMenuItem_form');
			
			$('#title').val(menuItem.title).addClass('valid');
			$('#price').val(menuItem.price).addClass('valid');
			
			
			$('#title_edit').text( menuItem.title);
			$('#id_edit').text( $(elem).closest('.list_item').attr('id')   )

			$('#title').focus();
		};
	},

	'input form': function(event) {
		var elem = event.target,
			validator = new Validator;

		$(elem).removeClass('valid');

		if ( elem.value === '' ) {
			$(elem).next('.error_box').remove();
		}
		else if (elem.id === 'title') {
			validator.validateName(elem);	
		}
		else if ( elem.id === 'price' ){
			validator.validatePrice(elem);
		}
		
	},

	'click #add_menu_item': function(event) {
		event.preventDefault();
		var form = $(event.target).closest('form'),
			title = $('#title').val().toLowerCase(),
			price = $('#price').val();
		
		if ( !$(form).checkRequiredFields() ) {
			return
		}
		else if ( Groups.findOne({'_id': this._id, 'menu.title': title}) ){
			$('#title').showError('chose another title').focus();
			return
		}

		var group = new Group(this._id);
		group.addMenuItem(title, price)
		
		$(form).trigger("reset").find('.error_box').remove();
	},

	'click #edit_menu_item': function(event) {

		event.preventDefault();
		var form = $(event.target).closest('form'),
			title = $('#title').val().toLowerCase(),		
			price = $('#price').val(),
			oldTitle = $('#title_edit').text(),
			menuId = $('#id_edit').text();
		
	
		if ( !$(form).checkRequiredFields() ) {
			return
		}
		else if ( Groups.findOne({'_id': this._id, 'menu.title': title}) && title !== oldTitle){	
			$('#title').showError('chose another title').focus();
			return
		}
		
		var group = new Group(this._id);
		group.editMenuItem(menuId, title, price)

		$('#cancel').trigger('click');
	},

	'click #cancel': function(event) {
		$('#editMenuItem_form').attr('id', 'addMenuItem_form').trigger("reset")
							   .find('.error_box').remove();
		$('#add_button').show();
		$('#edit_buttons').hide();

		$('#add_menu_item').addClass('submit')
		$('#remove_menu_item').removeClass('submit')

		$('.del_item').show();
	},
})


Template.coupons.events({

	'click .add_coupon': function(event) {
		event.preventDefault();

		var coupon = event.target.id,
			group = new Group(Template.currentData()._id);

		group.addCoupon(coupon)

	},

	'click #coupons_list': function(event) {
		event.preventDefault();
		var elem = event.target,
			group = new Group(this._id);
		
		if ( $(elem).hasClass('del_coupons') ) {		
			group.deleteCoupon($(elem).attr('id'))
		};
	}
})


Template.pizzaDay.events({

	'click #show_order_window': function(event) {
		var menu = this.menu;
		var html = Blaze.toHTMLWithData(
						Template.orderWindow, 
						{menu} 
					);
		$('#pizzaDay_container').append(html)
	},

	'click .change_status': function(event) {
		var elem = event.target,
			group = new Group(this._id);

		if ( elem.id === 'ordered') {
			group.pizzaDayChangeStatus('ordered')
			
			$(elem).text('Change status to "delivered"')
		} 
		else if ( elem.id === 'delivering') {
			group.pizzaDayChangeStatus('delivering')
			group.removeNotifications();
			
			Router.go(document.location.pathname + '?navigateItem=members');							
		}
	},

	'click #order_window': function(event) {
		var elem = event.target;
		
		if ( elem.id === 'cancel_order' ) {
			$('#parent_popup').remove();
		}
	},

	'input #menu_form': function(event) {
		var elem = event.target,
			validator = new Validator;

		$(elem).removeClass('valid');

		if ( elem.value === '' ) {
			$(elem).next('.error_box').remove();
		}
		else {
			validator.validateNum(elem);
		}
	},

	'click #confirm_order': function(event) {
		event.preventDefault();

		var form = $('#menu_form')

		if ( !$(form).checkRequiredFields() ) {
			return
		}
		if ( !$(form).find('.valid').length ) {
			return
		}
		
		var group = new Group(this._id),
			inputs = $('.quantity_items');
	
		group.confirmOrder(inputs);		

		$('#parent_popup').remove();

		if ( group.checkOrders() ) {
			group.pizzaDayChangeStatus('ordering');
		}; 
	},
})		