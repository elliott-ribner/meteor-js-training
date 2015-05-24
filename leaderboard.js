var players = ["Randy","Bob","Jim","Neal"]

PlayersList = new Mongo.Collection('players');

players.forEach(function(entry){
  PlayersList.insert({name: entry, score: 0 });
});

if (Meteor.isServer){
  console.log("hello server");
}

if (Meteor.isClient){
  Template.leaderboard.helpers({
    'player': function() {
      return PlayersList.find({}, {sort: {score: -1, name: 1} });
    },
    'count': function() {
      return PlayersList.find().count();
    },
    'selectedClass': function(){
      // return "selcted"
      var playerId = this._id
      var selectedPlayer = Session.get('selectedPlayer');
      if (playerId == selectedPlayer){
        return "selected"
      }
    },
    'showSelectedPlayer': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      return PlayersList.findOne(selectedPlayer)
    }
  });

  Template.leaderboard.events({
    'click .player': function(){
      var playerId = this._id;
      Session.set('selectedPlayer', playerId);
    },
    'click .increment': function(){
     var selectedPlayer = Session.get('selectedPlayer');
     PlayersList.update(selectedPlayer, {$inc: {score: 5}});
    },
    'click .decrement': function(){
     var selectedPlayer = Session.get('selectedPlayer');
     PlayersList.update(selectedPlayer, {$inc: {score: -5}});
    }
  });

  Template.addPlayerForm.events({
    'submit form': function(event){
      event.preventDefault();
      var playerNameVar = event.target.playerName.value;
      PlayersList.insert({
        name: playerNameVar,
        score: 0
      });
    }
  })
  console.log("hello client");
}
