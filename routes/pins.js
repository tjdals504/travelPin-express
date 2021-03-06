var express = require('express');
var router = express.Router({mergeParams: true});
var Users = require('../models/userModel.js');
var Pin = require('../models/pinModel.js');
var authHelpers = require('../helper/auth.js');

// GET ROUTE FOR USER'S PIN INDEX (USER ALBUM) PAGE
router.get('/', function(req, res) {
  Users.findById(req.params.userId)
  .exec(function(err, user) {
    if (err) console.log(err);
    console.log(user.pins)
    res.render('pins/index', {  
      user: user,
      pins: user.pins
    });
  });
});

// GET ROUTE & RENDER TO new.hbs PAGE!
router.get('/new', function(req, res) {
  Users.findById(req.params.userId)
  .exec(function(err, user) {
    if(err) console.log(err);
    res.render('pins/new.hbs', {
      user: user,
      pins: user.pins
    });
  });
});

// POST ROUTE TO CREATE NEW PIN!
router.post('/', function createNewPin(req, res) {
  Users.findById(req.params.userId)
    .exec(function (err, user) {
      if (err) {console.log(err);
      }
      const newPin = {
        title: req.body.title,
        location: req.body.location,
        imgUrl: req.body.imgUrl,
      }
      user.pins.push(newPin);
      user.save(function (err) {
        if(err) console.log(err);
        console.log('New Pin Created!');
        res.redirect('/user/'+ req.params.userId +'/pins');
      });
    });
  });

// GET ROUTE FOR VIEWING DETAILS OF EACH PIN
router.get('/:id', function showPinDetail(req, res) {
   Users.findById(req.params.userId)
    .exec(function(err, user) {
      if (err) console.log(err);
      const pinDetail = user.pins.id(req.params.id);
      res.render('pins/show.hbs', {
          user: user,
          pin: pinDetail
       });
    });
});

// GET ROUTE & RENDER TO edit.hbs PAGE
router.get('/:id/edit', function editPinDetail(req, res) {
  Users.findById(req.params.userId)
    .exec(function (err, user){
      if (err) {console.log(err); }
      const pinDetail = user.pins.id(req.params.id);
      res.render('pins/edit.hbs', {
        user: user,
        pin: pinDetail
      });
    });
});

// PUT ROUTE FOR UPDATE & RENDER BACK TO index.hbs PAGE!
// USER UPDATE ROUTE
router.put('/:id', function updatePinDetail(req, res){
  Users.findById(req.params.userId)
    .exec(function (err, user){
      if (err) { console.log(err); }
      const pin = user.pins.id(req.params.id);
      // EACH VALUES ARE EDITED
      pin.title = req.body.title
      pin.location = req.body.location
      pin.imgUrl = req.body.imgUrl
      pin.liked = req.body.liked
      user.save();

      res.redirect('/user/'+req.params.userId+'/pins/'+req.params.id);
    });
});


// GET ROUTE FOR VIEWING DETAILS OF EACH PIN
router.get('/:id', function showPinDetail(req, res) {
 	 Users.findById(req.params.userId)
  	.exec(function(err, user) {
    	if (err) console.log(err);
    	const pinDetail = user.pins.id(req.params.id);
    	res.render('pins/show.hbs', {
      		user: user,
      		pin: pinDetail
   		 });
  	});
});

// // DELETE THIS PIN
// router.delete('/:id', function deleteThisPin(req, res) {
//   User.findByIdAndUpdate(req.params.userId, {
//     $pull:{
//       pins: {_id: req.params.id}
//     }
//   })
//     .exec(function (err, user) {
//       if (err) { console.log(err); }
//     });
//   Pins.findByIdAndRemove(req.params.id)
//     .exec(function(err, pin) {
//       if (err) {console.log(err);}
//       console.log(pin);
//       res.redirect('/user/'+req.params.userId+'/pins/'+req.params.id);
//     });
// });


module.exports = router;