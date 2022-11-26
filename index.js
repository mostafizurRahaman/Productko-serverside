const express = require('express'); 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors'); 
const jwt = require('jsonwebtoken'); 
require('dotenv').config(); 

const app = express(); 
const port = process.env.PORT || 5000; 


//custom middlewares: 
function verifyJWT(req, res, next){
      const authHeader = req.headers.authorization; 
      if(!authHeader){
         return   res.status(401).send({message: "unauthorized access"}); 
      }
      const token = authHeader.split(' ')[0];
      jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, function(error, decoded){
         if(error){
           return  res.status(403).send({message: 'forbidden access'}); 
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
async function run(){
   try{
      const categoryCollection = client.db('ProductKo').collection('categories'); 
      const userCollections = client.db('ProductKo').collection('users'); 
      const productsCollection = client.db('ProductKo').collection('product'); 
      const bookingsCollection = client.db("ProductKo").collection('bookings'); 
     //jwt token creation : 
     app.get('/jwt', async(req, res)=>{
      const email = req.query.email; 
      const query = {email}
      const user = await userCollections.findOne(query); 
      if(user){
         const  token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'7d'}); 
         return res.send({token: token}); 
      }
       res.status(401).send({message: 'unauthorized access'}); 
     })
     
      //create a get api for  categories: 
      app.get('/categories', async(req,res)=>{
         const query = {isBooked: false}; 
         const categories = await categoryCollection.find(query).toArray();
         res.send(categories); 
      })


      // create a user posting api: 
      app.post('/users', async(req, res)=>{
         const user = req.body; 
         const result = await userCollections.insertOne(user); 
         res.send(result); 
      })
      
      // create an api for get all users : 
      app.get('/users', async(req, res)=> {
         const query = {}; 
         const users = await userCollections.find(query).toArray(); 
         res.send(users); 
      })


      // create a post api by using post method: 
      app.post('/products', async(req, res)=>{
         const product = req.body; 
         console.log(product); 
         const result = await productsCollection.insertOne(product); 
         res.send(result); 
      })

      // create single product getting api: 
      app.get('/products/:id', async(req, res)=>{
         const id = req.params.id; 
         const query = {_id: ObjectId(id)};
         console.log(id); 
         const  product = await productsCollection.findOne(query); 
         res.send(product); 
      })



      // app.put('/products', async(req,res)=>{
      //    const query = {}; 
      //    const updatedoc = {
      //       $set:{
      //          description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. '
      //       }
      //    }
      //    const result = productsCollection.updateMany(query, updatedoc, {upsert: true})
      //    res.send(result); 
      // })

      //get api for category based post : 
      app.get('/categories/:id', async(req,res)=>{
         const id = req.params.id;  
         const query = {category: id}; 
         const products = await productsCollection.find(query).toArray(); 
         res.send(products);
      })

  
     

      // create a post api for bookings : 
      app.post('/bookings', async(req, res)=>{
         const booking = req.body; 
         const result = await bookingsCollection.insertOne(booking);  
         const product_id = booking.product_id; 
         const productQuery = {_id: ObjectId(product_id)}; 
         const updatedDoc = {
            $set: {
               isBooked : true
            }
         }
         const option = {
            upsert: true, 
         }

         const product = await productsCollection.updateOne(productQuery, updatedDoc, option); 
         console.log(product); 
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
