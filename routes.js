
const carsRoutes = require('./routes/cars')
const rapairsRoutes = require('./routes/repairs')
const usersRoutes = require('./routes/users')

module.exports = function (app){
    app.use("/cars", carsRoutes);
    app.use("/repairs", rapairsRoutes);
    app.use("/users", usersRoutes);
}