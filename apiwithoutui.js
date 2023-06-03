const express = require('express');
const app = express();
const {MongoClient} = require('mongodb');
const Mongo = require ('mongodb');
const url = const mongourl = "mongodb+srv://local:test12345@cluster0.f8vmc.mongodb.net/augintern?retryWrites=true&w=majority"
//const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);


async function main(){
    await client.connect()
}

const collection = client.db('internfeb').collection('dashboard');
const bodyParser = require('body-parser')
const cors = require('cors');
const port = process.env.PORT || 7710;
const swaggerUi=require('swagger-ui-express');
const swaggerDocument =require('./swagger.json');
const package=require('./package.json');

swaggerDocument.info.version = package.version;
app.use('/api-doc',swaggerUi.serve,swaggerUi.setup(swaggerDocument))



app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

app.get('/health',(req,res)=>{
    res.status(200).send('Health Ok')
})

app.post('/addUser',async(req,res)=>{
    await collection.insertOne(req.body);
    res.send('Data Added')
})

app.get('/users',async(req,res)=>{
    const output = [];
    let query={};
    if(req.query.city && req.query.role){
        query={
            city:req.query.city,
            role:req.query.role,
            isActive:true
        }
    }
    else if(req.query.city){
        query={
            city:req.query.city,
            isActive:true
        }
    }else if(req.query.role){
        query={
            role:req.query.role,
            isActive:true
        }
    }
    
    else if(req.query.isActive){
        let isActive = req.query.isActive;
        if(isActive == "false"){
            isActive = false
        }else{
            isActive=true;
        }
        query = {isActive}
    }else {
        query = {isActive:true}
    }
    const cursor = collection.find(query);
    for await(const data of cursor){
        output.push(data)
    }
    cursor.closed;
    res.send(output)
})

app.get('/user/:id',async(req,res)=>{
    const output = [];
    let query = {_id:new Mongo.ObjectId(req.params.id)}
    const cursor = collection.find(query);
    for await(const data of cursor){
        output.push(data)
    }
    cursor.closed;
    res.send(output)
})

// Update user
app.put('/updateUser',async(req,res)=>{
    await collection.updateOne(
        {_id:new Mongo.ObjectId(req.body._id)},
        {
            $set:{
                name:req.body.name,
                city:req.body.city,
                phone:req.body.phone,
                role:req.body.role,
                isActive:true
            }
        }
    )
    res.send('Record Updated')
})

// Hard Delete User
app.delete('/deleteUser',async(req,res)=>{
    await collection.deleteOne({
        _id:new Mongo.ObjectId(req.body._id)
    })
    res.send('User Deleted')
})

// soft delete (Deactivate)
app.put('/deactivateUser',async(req,res)=>{
    await collection.updateOne(
        {_id:new Mongo.ObjectId(req.body._id)},
        {
            $set:{
                isActive:false
            }
        }
    )
    res.send('User soft deleted and is Inactive')
})

// Activate the user
app.put('/activateUser',async(req,res)=>{
    await collection.updateOne(
        {_id:new Mongo.ObjectId(req.body._id)},
        {
            $set:{
                isActive:true
            }
        }
    )
    res.send('User Activated')
})



app.listen(port,()=>{
    main();
    console.log(`Running on port ${port}`)
})