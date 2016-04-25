Meteor.startup( function() {
  process.env.MAIL_URL = "smtp://postmaster%40sandboxfd54bd40b83c4671a83035e754c90045.mailgun.org:dcd63b6c4d94868c3c238659f5358398@smtp.mailgun.org:587";
});

Meteor.methods({
	


    'checkNewUserEmail': function(email) {

      return !!Accounts.findUserByEmail(email)
      
    },


 	'sendEmail': function(userId, html) {
            
    var user = Users.findOne(
      {'_id': userId},
      {'fields': {'services.google.email':1, 'emails.address':1} }
    );

    
    if (user.services.google) {  
      var email = user.services.google.email;
    }
    else {
      var email = user.emails[0].address;
    };

      
    Email.send({
      to: email,
      from: "pizzaday-admin@gmail.com",
      subject: "Your order confirmed!",
      html: html
    });
    
     
	}

})