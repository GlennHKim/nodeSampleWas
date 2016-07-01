
// setting up rest server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));	// body-parser 사용
app.use(bodyParser.json());							// post로 json data를 받을 수 있도록

var port = process.env.PORT || 8080;

var router = express.Router();

// route
router.get('/', function(req, res){
	res.json({message : 'Aloha~, whelcome to HAWAII!'});
});
router.get('/where', function(req, res){
	res.json({message : 'THIS IS SPARTAAAA!!'});
});
router.route('/bears')
	.post(function(req, res){
		var bear = new Bear();
		bear.name = req.body.name;

		bear.save(function(err){
			if(err)
				res.send(err);
			res.json({message:'Bear created!'});
		});
	})
	.get(function(req,res){
		Bear.find(function(err,bears){
			if(err)
				res.send(err);
			res.json(bears);
		})
	});

router.route('/bears/:bear_id')	
	.get(function(req,res){
		console.log("request for : " + req.params.bear_id);
		Bear.findById(req.params.bear_id, function(err, bear){
			if(err)
				res.send(err);
			res.json(bear);
		});
	})

	.put(function(req, res){
		Bear.findById(req.params.bear_id, function(err, bear){
			if(err)
				res.send(err);
			bear.name = req.body.name;
			bear.save(function(err){
				if(err)
					res.send(err);
				res.json({message:'Bear updated!'});
			});
		});
	})

	.delete(function(req, res){
		Bear.remove({
			_id: req.params.bear_id
		}, function(err, bear){
			if(err)
				res.send(err);
			res.json({mesaage: 'Successfully deleted'});
		});
	});
	

router.route('/contact')
	.get(function(req, res){
		console.log("contact request");
		Contact.find(function(err, contacts){
			if(err)
				res.send(err);
			res.json(contacts);
		})
	})
	.post(function(req, res){
		console.log("contact save : " + req.body);
		var contact = new Contact();

		contact.name = req.body.name;
		contact.id = req.body.id;
		contact.telnum = req.body.telnum;
		contact.desc = req.body.desc;
		contact.address = req.body.address;

		contact.save(function(err){
			if(err)
				res.send(err);
			res.json({ message : "success to save contact"});
		})

	});

router.route('/contact/:id')
	.get(function(req, res){
		console.log("contact id request");
		Contact.findOne({id : req.params.id}, "id name telnum address desc", 
			function(err, contact){
			if(err)
				res.send(err);
			res.json(contact);
		});
	})
	.put(function(req, res){
		console.log("contact id update");
		Contact.findOne({id : req.params.id}, "id name telnum address desc",
			function(err, contact){
				if(err)
					res.send(err);
				if(req.body.name)
					contact.name = req.body.name;
				if(req.body.telnum)
					contact.telnum = req.body.telnum;
				if(req.body.desc)
					contact.desc = req.body.desc;
				contact.save(function(err){
					if(err)
						res.send(err)
					res.json({message:"update success"});
				});
			});
	})
	.delete(function(req, res){
		console.log("contact delete");
		Contact.remove({id : req.params.id}, function(err){
			if(err)
				res.send(err);
			res.json({message : "contact removed"});
		});
	});


router.route('/dialog/:sender/:receiver')
	.get(function(req, res){
		console.log("dialog request sender: " + req.params.sender + " / receiver : " + req.params.receiver );
		Dialog.find({$and :[{tag:new RegExp(req.params.sender)}, {tag:new RegExp(req.params.receiver)}]}, function(err, dialogs){
			if(err)
				res.send(err);
			res.json(dialogs);
		});
	});
router.route('/dialog/:id')	
	.post(function(req, res){
		console.log("dialog put");
		var dialog = new Dialog();

		dialog.sender = req.body.sender;
		dialog.receiver = req.body.receiver;
		dialog.text = req.body.text;
		dialog.time = req.body.time;
		dialog.tag = "#" + req.body.sender + "#" + req.body.receiver;

		dialog.save(function(err){
			if(err)
				res.send(err);
			res.json({message : "success"});
		});
	});

app.use('/api', router);	// 모든 route는 /api가 어미로 붙는다.

app.listen(port);

console.log('I got a message from this port : ' + port);



// setting up db
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/my_database');

var Bear = require('./app/models/bear');
var Contact = require('./app/models/contact');
var Dialog = require('./app/models/dialog');
