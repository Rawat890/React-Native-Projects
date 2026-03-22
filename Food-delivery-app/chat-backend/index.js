const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');

const PORT = 4000;

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

app.get('/api', (req, res)=>{
  console.log(req, res);
})

http.listen(PORT, ()=>{
  console.log("Listening to port - ", PORT)
});