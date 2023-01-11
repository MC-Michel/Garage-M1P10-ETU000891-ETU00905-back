var express = require('express');
var router = express.Router();
const Lesson = require('../../models/test/lesson');
const MailerService = require('../../services/mailer.service');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({
    "message" : "List of lessons"
  });
});

router.get('/quotes', async function(req, res){
  res.json({
    "quotes" : await new Lesson().getQuotes()
  });
});

router.post('/quote', async function(req,res){
  res.json({
    "data" : await new Lesson().insert(null, req.body)
  });
});

router.put('/quote', async function(req,res){
  res.json({
    "data" : await new Lesson().update(null, req.body)
  });
});

router.delete('/quote', async function(req,res){
  res.json({
    "data" : await new Lesson().delete(null, req.body)
  });
});

router.get('/name', function(req, res) {
  res.json(new Lesson().getName());
});

router.post('/sendmail', async function(req,res){
  res.json(await MailerService.sendMail(req.body));
});

module.exports = router;
