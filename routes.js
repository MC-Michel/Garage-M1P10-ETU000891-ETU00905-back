
const carsRoutes = require('./routes/cars')
const rapairsRoutes = require('./routes/repairs')
const expensesRoutes = require('./routes/expenses')
const usersRoutes = require('./routes/users')

module.exports = function (app){
    app.use("/cars", carsRoutes);
    app.use("/repairs", rapairsRoutes);
    app.use("/expenses", expensesRoutes);
    app.use("/users", usersRoutes);
}