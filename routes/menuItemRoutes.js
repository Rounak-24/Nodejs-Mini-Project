const express = require('express');
const router = express.Router();

const menuItem = require('../models/menu');

router.post('/', async (req,res)=>{
	try{
		const data = req.body;
		const newmenuItem = new menuItem(data);
		const savedmenuItem = await newmenuItem.save();
		console.log('menuitem saved!');
		res.status(200).json(savedmenuItem);
	}
	catch(err){
		console.log(err);
		res.status(500).json({err:'internal server error!'});
	}
	
})

router.get('/', async (req,res)=>{
    try{
        const response = await menuItem.find();
        res.status(200).json(response);
    }catch(err){
        res.status(500).json({err: 'Internal Server Error'});
    }
})

router.get('/:tasteType', async (req,res)=>{
    try{
        const tasteType = req.params.tasteType;
        if(tasteType=='sweet' || tasteType=='sour' || tasteType=='spicy'){
            const response = await menuItem.find({taste:tasteType});
            res.status(200).json(response);
        }
        else{
            res.status(404).json({error:'Tste item not found'});
        }
    }catch(err){
        res.status(500).json({err:'Internal Server Error'});
    }
})

router.put('/:id', async (req,res)=>{
    try{
        const menuId = req.params.id;
        const newMenuItem = req.body;
        const response = await menuItem.findByIdAndUpdate(menuId,newMenuItem,{
            new : true,
            runValidators : true
        })

        if(!response){
            res.status(404).json({error:'menu item not found'});
        }
        else res.status(200).json(response);
    }catch(err){
        res.status(500).json({err:'Internal server error'});
    }
})

router.put('/:id', async (req,res)=>{
    try{
        const menuId = req.params.id;
        const response = await menuItem.findByIdAndDelete(menuId);

        if(!response){
            res.status(404).json({error:'menu item not found'});
        }
        else res.status(200).json(response);
    }catch(err){
        res.status(500).json({err:'Internal server error'});
    }
})

module.exports = router; 