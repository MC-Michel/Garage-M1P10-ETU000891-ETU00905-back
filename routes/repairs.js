var express = require('express'); 
const GenRepository = require('../commons/database/class/gen-repository');
const createRouteCallback = require('../commons/functions/create-route-callback');
const { getConnection } = require('../configs/db');
const createBodySchemaParser = require('../middlewares/body-schema-parser');
const Repair = require('../models/repair.model');
const {assign} = require('../commons/database/methods/gen-reflect');
const PdfService = require('../services/pdf.service');
const { query } = require('express-validator');
var router = express.Router();
const createAuth = require('../middlewares/auth');

const repairRepository = new GenRepository(Repair);

// const getList = async function(req, res) {  
//   const data = await repairRepository.find(req.query);
//   res.json(data);
// };

// const insertRepair = async function(req, res) {
//   await repairRepository.insert([req.body]);
//   res.json({message: "Repair created"});
// }
// const updateRepair = async function(req, res) {
//   await repairRepository.update(req.body);
//   res.json({message: "Repair updated"});
// }
// const deleteRepair = async function (req, res) {
//   await repairRepository.delete(req.params.id);
//   res.json({message: "Repair deleted"});
// }

const createInvoice = async function (req, res){
  const repairId = req.params.repairId;
  const invoiceStream = await PdfService.generateInvoice(repairId);
  res.attachment('facture.pdf');
  invoiceStream.pipe(res);
}



// router.get('', createRouteCallback(getList));
// router.post('', createRouteCallback(insertRepair));
// router.delete('/:id', createRouteCallback(deleteRepair));
// router.patch('', createRouteCallback(updateRepair));
router.get('/invoice/:repairId',createAuth([]), createRouteCallback(createInvoice))

// Financier
// router.get('/valid', createRouteCallback(getList));
// router.patch('/valid', createRouteCallback(updateRepair));



module.exports = router;