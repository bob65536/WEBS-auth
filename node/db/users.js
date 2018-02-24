var records = [
    { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ], favoriteJoke: "Pourquoi l’Espagne n’a-t-elle pas de poils ? Car elle a un Cordoue.", passwordOfFacebook: 'LeProjetActuellementPrésentéEstTropBien'  }
  , { id: 2, username: 'jick', password: 'birthday', displayName: 'Jick', emails: [ { value: 'jick@example.com' } ], favoriteJoke: "Pourquoi faut-il faire de la collocation avec Napoléon ? Parce qu’il a un Bonaparte." , passwordOfFacebook: 'LesDevDeCeProjetSontTropBeauxEtForts' }
  , { id: 3, username: 'admin', password: 'admin', displayName: 'Chef', emails: [ { value: 'admin@admin.com' } ], favoriteJoke: "I am the Chef. I don't joke." , passwordOfFacebook: 'qwerty'}

];

exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}
