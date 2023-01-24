
const carsRoutes = require('./routes/cars')
const defaultRepairsRoutes = require('./routes/default-repairs')
const repairsHistoricRoutes = require('./routes/repairs-historic')
const rapairsRoutes = require('./routes/repairs')
const expensesRoutes = require('./routes/expenses')
const usersRoutes = require('./routes/users')
const statsRoutes = require('./routes/stats');

module.exports = function (app){
    app.use("/cars", carsRoutes);
    app.use("/default-repairs", defaultRepairsRoutes);
    app.use("/repairs-historic", repairsHistoricRoutes);
    app.use("/repairs", rapairsRoutes);
    app.use("/expenses", expensesRoutes);
    app.use("/users", usersRoutes);
    app.use("/stats", statsRoutes)
}