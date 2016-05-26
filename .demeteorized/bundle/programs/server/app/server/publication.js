(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/publication.js                                               //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Meteor.publish('Groups', function () {                                 // 1
  return Groups.find();                                                // 2
});                                                                    //
                                                                       //
Meteor.publish('Users', function () {                                  // 6
  return Users.find({}, { 'fields': { '_id': 1, 'profile.name': 1 } });
});                                                                    //
                                                                       //
Meteor.publish('Notifications', function () {                          // 12
  return Notifications.find({ 'userId': this.userId, 'read': false });
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=publication.js.map
