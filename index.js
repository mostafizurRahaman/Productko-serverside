const express = require("express");
const {
   MongoClient,
   ServerApiVersion,
   ObjectId,
   ObjectID,
} = require("mongodb");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//custom middlewares:
function verifyJWT(req, res, next) {
   const authHeader = req.headers.authorization;
   if (!authHeader) {
      return res.status(401).send({ message: "unauthorized access" });
   }
   const token = authHeader.split(" ")[0];
   jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      function (error, decoded) {
         if (error) {
            return res.status(403).send({ message: "forbidden access" });
         }
         req.decoded = decoded;
         next();
      }
   );
}

//middleware here:
app.use(cors());
app.use(express.json());

// mongodb configuration is added here :
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4nkvsmn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   serverApi: ServerApiVersion.v1,
});
async function run() {
   try {
      const categoryCollection = client
         .db("ProductKo")
         .collection("categories");
      const userCollections = client.db("ProductKo").collection("users");
      const productsCollection = client.db("ProductKo").collection("product");
      const bookingsCollection = client.db("ProductKo").collection("bookings");
      //jwt token creation :
      app.get("/jwt", async (req, res) => {
         const email = req.query.email;
         const query = { email };
         const user = await userCollections.findOne(query);
         if (user) {
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
               expiresIn: "7d",
            });
            return res.send({ token: token });
         }
         res.status(401).send({ message: "unauthorized access" });
      });

      //create a get api for  categories:
      app.get("/categories", async (req, res) => {
         const query = {};
         const categories = await categoryCollection.find(query).toArray();
         res.send(categories);
      });

      // create a user posting api:
      app.post("/users", async (req, res) => {
         const newUser = req.body;
          const query = {email: newUser.email}
          const user = await userCollections.findOne(query);         
          if(user?.email){
               return res.status(200).send({alreadyAdded : true}); 
          }
            const result = await userCollections.insertOne(newUser);
            res.send(result);  
          
        
      });
      // get  api for getting users role based :
      app.get("/users", async (req, res) => {
         const role = req.query.role;
         const query = { role: role };
         const users = await userCollections.find(query).toArray();
         res.send(users);
      });

      //for delete a user  by admin :
      app.delete("/users/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: ObjectId(id) };
         const result = await userCollections.deleteOne(query);
         res.send(result);
      });

      // create a post api by using post method:
      app.post("/products", async (req, res) => {
         const product = req.body;
         const  query = {email: product.email}; 
         const user = await userCollections.findOne(query); 
         product.isVerified = user.isVerified || false; 
         const result = await productsCollection.insertOne(product);
         res.send(result);
      });

      // create single product getting api:
      app.get("/products/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: ObjectId(id) };
         console.log(id);
         const product = await productsCollection.findOne(query);
         res.send(product);
      });

      //create a get api for user base by query email:
      app.get("/products", async (req, res) => {
         const email = req.query.email;
         const query = { email: email };
         const products = await productsCollection.find(query).toArray();
         res.send(products);
      });

      //create a put api for user advertisement update :
      app.put("/products/:id", async (req, res) => {
         const id = req.params.id;
         const isAdvertised = req.body.isAdvertised;
         console.log(isAdvertised);
         const query = { _id: ObjectId(id) };
         const updatedDoc = {
            $set: {
               isAdvertised: isAdvertised,
            },
         };
         const options = { upsert: true };

         const result = await productsCollection.updateOne(
            query,
            updatedDoc,
            options
         );
         res.send(result);
      });

      //delete api for products :
      app.delete("/products/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: ObjectId(id) };
         const result = await productsCollection.deleteOne(query);
         res.send(result);
      });

      //get api for advertised products:
      app.get("/advertised", async (req, res) => {
         const query = {
            $and: [
               {
                  isAdvertised: {
                     $eq: true,
                  },
               },
               {
                  paymentStatus: {
                     $ne: true,
                  },
               },
            ],
         };
         const products = await productsCollection.find(query).toArray();
         res.send(products);
      });

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
      app.get("/categories/:id", async (req, res) => {
         const id = req.params.id;
         const query = {
            $and: [
               {
                  category: id,
               },
               {
                  isBooked: {
                     $ne: true,
                  },
               },
            ],
         };
         const products = await productsCollection.find(query).toArray();
         res.send(products);
      });

      // create a post api for bookings :
      app.post("/bookings", async (req, res) => {
         const booking = req.body;
         const result = await bookingsCollection.insertOne(booking);
         const product_id = booking.product_id;
         const productQuery = { _id: ObjectId(product_id) };
         const updatedDoc = {
            $set: {
               isBooked: true,
            },
         };
         const option = {
            upsert: true,
         };
         const product = await productsCollection.updateOne(
            productQuery,
            updatedDoc,
            option
         );
         console.log(product);
         res.send(result);
      });


      //create a order delete api: 
      app.delete('/bookings/:id', async(req ,res)=>{
         const id = req.params.id ;
         console.log(id); 
         const order = req.body; 
         const query = {_id: ObjectId(id)}; 
         const options = {upsert: true}; 
         const updatedDoc = {
             $set: {
               isBooked: false
             }
         }
         const productId = order.product_id; 
         const productQuery = {_id: ObjectId(productId)}; 

         const updatedProduct = await productsCollection.updateOne(productQuery, updatedDoc, options); 
         console.log(updatedProduct); 
         if(updatedProduct.modifiedCount > 0){
            const result = await bookingsCollection.deleteOne(query); 
            res.send(result); 
         }
      })

       // for getting booking by filtering user email:
       app.get("/bookings", async (req, res) => {
         const email = req.query.email;
         const query = { email: email };
         const bookings = await bookingsCollection.find(query).toArray();
         res.send(bookings);
      });

      //create a get api for  single bookings : 
      app.get('/bookings/:id', async(req, res)=>{
         const id = req.params.id; 
         const query = {_id: ObjectId(id)}; 
         const booking = await bookingsCollection.findOne(query); 
         res.send(booking); 
      })


      // update user for verification : 
      app.put("/users/:email", async (req, res) => {
         const email = req.params.email;
         console.log(email); 
         const query = { email: email};
         const updatedDoc = {
            $set:{
               isVerified: true, 
            }
         }
         const options = {upsert: true}; 
        
         const products = await productsCollection.updateMany(query,updatedDoc, options)
         if(products.modifiedCount){
            const result = await userCollections.updateOne(query, updatedDoc, options);   
            res.send(result);
         }       
         
      });

      //create use delete api: 
      app.delete('/users/:id', async(req, res)=>{
         const id = req.query.id; 
         const query  = {_id: ObjectId(id)}; 
         const result = await userCollections.deleteOne(query); 
         res.send(result); 
      })

     
   } finally {
   }
}

run().catch((err) => console.log(err));

// root api of server :
app.get("/", (req, res) => {
   res.send("Productko Server is running now.");
});

app.listen(port, () => {
   console.log(`server is running on port ${port}`);
});
