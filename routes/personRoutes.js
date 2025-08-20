const express = require('express');
const router = express.Router();

const person = require('../models/person');

router.post('/', async (req,res)=>{
	try{
		const data = req.body;
		const newPerson = new person(data);

		//wait untill your db operation is done
		const savePerson = await newPerson.save();
		console.log("data saved");
		res.status(200).json(savePerson);
	} catch(err){   //if try block throw error it moves to catch
		console.log(err);
		res.status(500).json({err:'internal server error'});
	}
})

router.get('/', async (req,res)=>{
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

module.exports = router;