
const carsRoutes = require('./routes/cars')

module.exports = function (app){
    app.use("/cars", carsRoutes);
}