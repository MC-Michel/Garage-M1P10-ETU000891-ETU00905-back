
const carsRoutes = require('./routes/cars')
const repairsHistoricRoutes = require('./routes/repairs-historic')
const rapairsRoutes = require('./routes/repairs')
const expensesRoutes = require('./routes/expenses')
const usersRoutes = require('./routes/users')

module.exports = function (app){
    app.use("/cars", carsRoutes);
    app.use("/repairs-historic", repairsHistoricRoutes);
    app.use("/repairs", rapairsRoutes);
    app.use("/expenses", expensesRoutes);
    app.use("/users", usersRoutes);
}