
const carsRoutes = require('./routes/cars')
const usersRoutes = require('./routes/users')

module.exports = function (app){
    app.use("/cars", carsRoutes);
    app.use("/users", usersRoutes);
}