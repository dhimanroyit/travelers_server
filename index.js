const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

require('dotenv').config();
const app = express();
app.use(cors());
app.use(bodyParser());

const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@cluster0.fpbx6.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("travelers").collection("services");
  const adminCollection = client.db("travelers").collection("admins");
  app.get('/', (req, res) => {
    res.send('welcome')
  })
  app.get('/services', (req, res) => {
    servicesCollection.find({})
      .toArray((err, serviceArray) => {
        res.send(serviceArray);
      })
  })

  
  app.post('/service', (req, res) => {
    console.log(req.body);
    servicesCollection.insertOne(req.body)
      .then(service => {
        return res.send(service);
      })
      .catch(err => res.send(err));
  })
  
  app.delete('/service', (req, res) => {
  
  })

  app.get('/admin/:email', (req, res) => {
    const {email} = req.params;
    adminCollection.find({adminEmail: email})
    .toArray((err, admin) => {
      res.send(admin[0]);
    })
  })

  app.post("/admins", (req, res) => {
    adminCollection.insertOne(req.body)
      .then(admins => {
        return res.send(admins);
      })
      .catch(err => res.send(err));
  })
});



app.listen(process.env.PORT || 5000)