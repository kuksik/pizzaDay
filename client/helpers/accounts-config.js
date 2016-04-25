// import { Accounts } from 'meteor/accounts-base';

Accounts.ui.config({
	passwordSignupFields: 'EMAIL_ONLY'
});




// Accounts.ui.config({
//     extraSignupFields: [{
//         fieldName: 'name',
//         fieldLabel: 'Username',
//         inputType: 'text',
//         visible: true,
//         validate: function(value, errorFunction) {
//           if (!value) {
//             errorFunction("Please write your name");
//             return false;
//           } else {
//             return true;
//           }
//         }
//     }]
// });

// Accounts.ui.config({
//     extraSignupFields: [{
//         fieldName: 'name',
//         fieldLabel: 'Username',
//         inputType: 'text',
//         visible: true,
//         validate: function(value, errorFunction) {
//           if (!value) {
//             errorFunction("Please write your name");
//             return false;
//           } else {
//             return true;
//           }
//         }
//     }]
// });