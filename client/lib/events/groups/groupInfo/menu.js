Template.menu.events({



	'click #add_menu_item': function(event) {
		event.preventDefault();
		var form = $(event.target).closest('form'),
			title = $('#title').val(),
			price = $('#price').val();

		if ( !$(form).checkRequiredFields() ) {
			return
		}
		else if ( Groups.findOne({'_id': this._id, 'menu.title': title}) ){
			$('#title').showError('chose another title').focus();
			return
		}
		else if ( ! (price > 0) ) {
			$('#price').showError('price must be positive').focus();
			return
		}
		
		
		Groups.update( 
			{'_id': this._id}, 
			{$push: {'menu': {'title': title, 'price': price} } },
			function(err) {
				if( err ) {
					alert(err.reason)
					return
				}
				$(form).trigger("reset").find('.error_box').remove();
			} 
		);
	},

	'click #edit_menu_item': function(event) {

		event.preventDefault();
		var form = $(event.target).closest('form'),
			title = $('#title').val(),		
			price = $('#price').val(),
			oldTitle = $('#title_edit').text(),
			id = $('#id_edit').text();
		
	
		if ( !$(form).checkRequiredFields() ) {
			return
		}
		else if ( Groups.findOne({'_id': this._id, 'menu.title': title}) && title !== oldTitle){
			$('#title').showError('chose another title').focus();
			return
		}
		else if ( ! (price > 0) ) {
			$('#price').showError('price must be positive').focus()
		}

		var data = {}
			data['menu.'+ id ] =  1;
		
		Groups.update(
			{'_id': this._id},
			{ $unset: data }
		);
		
		data = {}
		data['menu.'+ id ] =  {'title': title, 'price': price};
			
		Groups.update(
			{'_id': this._id}, 
			{$set: data },
			function(err) {
				if ( err ) {
					alert(err);
					return
				}
				$(form).attr('id', 'addMenuItem_form').trigger("reset")
												      .find('.error_box').remove();	
				$('#add_button').show()
				$('#edit_buttons').hide();
				$('.del_item').show();
			} 
		);
	},

	'click #cancel': function(event) {
		$('#editMenuItem_form').attr('id', 'addMenuItem_form').trigger("reset");
		$('#add_button').show();
		$('#edit_buttons').hide();
		$('.del_item').show();
	},

	'click #menu_list': function(event) {
		
		var elem = event.target,
			menuItem = this.menu[ $(elem).closest('.list_item').attr('id') ];

		if ( $(elem).hasClass('del_item') ) {
			Groups.update( 
				{'_id': this._id}, 
				{ $pull: {'menu': { 'title': menuItem.title } } } 
			);
		};

		if ( $(elem).hasClass('edit_item') ){

			$('#show').trigger('click');
			$('#add_button').hide();
			$('#edit_buttons').show();
			$(elem).next('.del_item').hide();

			$('#addMenuItem_form').attr('id', 'editMenuItem_form');
			
			$('#title').val(menuItem.title);
			$('#price').val(menuItem.price);
			
			
			$('#title_edit').text( menuItem.title);
			$('#id_edit').text( $(elem).closest('.list_item').attr('id')   )

			$('#title').focus();
		};
	}
})