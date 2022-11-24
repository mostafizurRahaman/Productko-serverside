const express = require('express'); 
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors'); 
const jwt = require('jsonwebtoken'); 
const { application } = require('express');

require('dotenv').config(); 

const app = express(); 
const port = process.env.PORT || 5000; 


//custom middlewares: 
function verifyJWT(req, res, next){
      const authHeader = req.headers.authorization; 
      if(!authHeader){
         res.status(401).send({message: "unauthorized access"}); 
      }
      const token = authHeader.split(' ')[0];
      jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, function(error, decoded){
         if(error){
            res.status(403).send({message: 'forbidden access'}); 
         }
         req.decoded = decoded; 
         next(); 
      } )
}

//middleware here: 
app.use(cors()); 
app.use(express.json()); 

// mongodb configuration is added here : 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4nkvsmn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri); 
async function run(){
   try{
      const categoryCollection = client.db('ProductKo').collection('categories'); 
      const userCollections = client.db('ProductKo').collection('users'); 
     //jwt token creation : 
     app.post('/jwt', async(req, res)=>{
         const user = req.body; 
         const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '7d'}); 
         console.log(token); 
         res.send(token); 
     }); 
     
      //create a get api for  categories: 
      app.get('/categories', async(req,res)=>{
         const query = {}; 
         const categories = await categoryCollection.find(query).toArray();
         res.send(categories); 
      })


      // create a user posting api: 
      app.post('/users', async(req, res)=>{
         const user = req.body; 
         const result = await userCollections.insertOne(user); 
         res.send(result); 
      })
   }
   finally{

   }
}


run().catch(err => console.log(err)); 






// root api of server : 
app.get('/', (req, res)=>{
   res.send('Productko Server is running now.'); 
}); 


app.listen(port, ()=>{
   console.log(`server is running on port ${port}`); 
})
