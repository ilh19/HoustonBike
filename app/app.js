if (Meteor.isClient) {
  
  Template.map.events({
    'initialize' : function () {
      if (typeof console !== 'undefined')
        console.log("map initialized");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
