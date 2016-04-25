Template.coupons.events({

	'click #add_coupon': function(event) {
		event.preventDefault();


		var coupon = $('#coupon').val();			

		Groups.update(
			{'_id':this._id},
			{ $push: { 'coupons': coupon } }
		);
	},


	'click #coupons_list': function(event) {
		event.preventDefault();
		var elem = event.target;
		
		if ( $(elem).hasClass('del_coupons') ) {
			
			var data = {}
			data['coupons.'+ $(elem).attr('id') ] =  1;
			
			Groups.update(
				{'_id': this._id},
				{ $unset: data }
			);
			Groups.update(
				{'_id': this._id}, 
				{$pull: {coupons: null} } 
			);
		};
	}
})