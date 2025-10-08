const express = require('express');
const router = express.Router();
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

const person = require('../models/person');
const bodyParser = require('body-parser');
const passport = require('passport');

router.post('/signup', async (req,res)=>{
	//signup-> new user entry
	try{
		const data = req.body;
		const newPerson = new person(data);
		const response = await newPerson.save();
		console.log("data saved");

		const payload = {
			id : response._id,
			username: response.username
		};

		console.log(JSON.stringify(payload));
		const token = generateToken(payload);
		console.log('this is token', token);

		res.status(200).json({response : response, token : token});

	} catch(err){   
		console.log(err);
		res.status(500).json({err:'internal server error'});
	}
})

router.post('/login', async (req,res)=>{
	try{
		const {username, password} = req.body;
		const user = await person.findOne({username:username});
		if(!user){
			return res.status(401).json({error:'Incorrect password or username'});
		} 
		
		const correctPass = await user.comparePassword(password);
		if(!correctPass){
			return res.status(401).json({error:'Incorrect password or username'});
		}//pass matched -> Authenticated -> create token

		const payload = {
			id : user.id,
			username : user.username
		}

		const token = generateToken(payload);
		console.log(token);
		res.json({token});

	}catch(err){
		console.log(err);
		res.status(500).json({error:'Internal server error'})
	}
})

//profile 

router.get('/profile', jwtAuthMiddleware, async (req,res)=>{
	const userData = req.user;
	console.log(userData);
	const userId = userData.id;

	const user = await person.findById(userId);

	res.status(200).json({user});

})

router.get('/', jwtAuthMiddleware, async (req,res)=>{
    try{
        const data = await person.find();
        // console.log("data fetched");
        res.status(200).json(data);
    }
    catch(err){
        console.log(err);
        res.status(500).json({err:'internal server error'});
    }
})

router.get('/:workType', async (req,res)=>{
	try{
		const workType = req.params.workType;
		if(workType=='chef' || workType=='waiter' || workType=='manager'){
			console.log('entered')
			const response = await person.find({work:workType});
			res.status(200).json(response);
		}
		else{
			console.log('not found');
			res.status(404).json({error:'Worktype not found!'});
		}
	} catch(err){
		console.log('error');
		res.status(500).json({err:'Internal Server Error'});
	}
})

router.put('/:id', async (req,res)=>{
    try{
        const personid = req.params.id;
        const newData = req.body;

        const response = await person.findByIdAndUpdate(personid,newData,{
            new : true,
            runValidators : true
        })
        if(!response){
            res.status(404).json({error:'Person not found'});
        }
        else res.status(200).json(response);
    }catch(err){
        res.status(500).json({err:'internal Server error'});
    }
})

router.delete('/:id', async (req,res)=>{
	try{
		const personId = req.params.id;
		const response = await person.findByIdAndDelete(personId);
		if(!response){
			res.status(404).json({error:'person not found'});
		}
		else res.status(200).json({message:'person deleted successfully'});
	}catch(err){
		res.status(500).json({err:'Internal Server error'});
	}
})

// router.post('/', async (req,res)=>{
// 	try{
// 		const data = req.body;
// 		const newPerson = new person(data);

// 		//wait untill your db operation is done
// 		const savePerson = await newPerson.save();
// 		console.log("data saved");
// 		res.status(200).json(savePerson);
// 	} catch(err){   //if try block throw error it moves to catch
// 		console.log(err);
// 		res.status(500).json({err:'internal server error'});
// 	}
// })

module.exports = router;
