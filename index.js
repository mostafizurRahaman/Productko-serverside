const express = require('express'); 
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors'); 
const jwt = require('jsonwebtoken'); 
const { application } = require('express');

require('dotenv').config(); 

const app = express(); 
const port = process.env.PORT || 5000; 



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
      
      //create a get api for  categories: 
      app.get('/categories', async(req,res)=>{
         const query = {}; 
         const categories = await categoryCollection.find(query).toArray();
         res.send(categories); 
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
