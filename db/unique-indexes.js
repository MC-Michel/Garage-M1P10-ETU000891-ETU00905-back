
db.User.createIndex( { "email": 1 }, { unique: true } );
db.Car.createIndex( { "numberPlate": 1 }, { unique: true } );