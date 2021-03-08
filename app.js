const express = require('express');
const bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
const app = express();
const user = require('./models/user');
const issue = require('./models/issue')
const pwork = require('./models/pwork')
// const site_details = require('./models/site_details')
// const site_masters = require('./models/site_masters')
// const expense_masters = require('./models/expense_masters')
// const employee_masters = require('./models/employee_masters')
const jwt = require('jsonwebtoken')
const {jwtkey} = require('./config/keys')
var http = require('http');
const requireToken = require('./middleware/requireToken')

// Database
const db = require('./config/database');
app.use(bodyParser.json())
// Test DB
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err))
 


// Index route
app.get('/',requireToken,(req,res)=>{
  res.send({fname:req.us.fname,lname:req.us.lname,id:req.us.id,phone:req.us.phone,type:req.us.type})
})

const multer = require("multer");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
  let dir = `uploads/`; // specify the path you want to store file
  //check if file path exists or create the directory
  fs.access(dir, function(error) {
  if (error) {
  console.log("Directory does not exist.");
  return fs.mkdir(dir, error => cb(error, dir));
  } else {
  console.log("Directory exists.");
  return cb(null, dir);
  }
  });
  },
  filename: function(req, file, cb) {
  cb(null, Date.now() + "-" + file.originalname); // added Date.now() so that name will be unique
  }
  });
  const uploadFiles = multer({ storage: storage });
  app.post("/upload", uploadFiles.single("file"), (req, res, next) => {
  const file = req.file;
  if (!file) {
  const error = new Error("Please upload a file");
  error.httpStatusCode = 400;
  return next(error);
  }
  res.json({
  success: true,
  statusCode: 200,
  fileName: file.filename });
  });

// app.get('/allsites',async (req,res)=>{
//     // const {cname} = req.body
//     // if(!use){
//     //   return res.status(422).send({error :"must provide username or password2"})
//     // }
//     try{
//       const use = await site_masters.findAll()
//       res.send(use)
//       console.log(use)
//     }catch(err){
//         return res.send(err)
//     }
// })


app.get('/allissues', (req, res) => 
  issue.findAll()
    .then(user => res.send(user))
    .catch(err => console.log(err)));

app.get('/allpworks', (req, res) => 
  pwork.findAll()
    .then(user => res.send(user))
    .catch(err => console.log(err)));

app.post('/signup',async (req, res) => {
        let { fname,lname,email,phone,username,password,type } = req.body;
        try{
            const hash = await bcrypt.hash(password, 10);
              // bcrypt.genSalt(10, function(err, salt) {
              //   bcrypt.hash(password, salt, async(err, hash)=> {
                    // Store hash in your password DB.
                    const use = new user({fname,lname,email,phone,username,password:hash,type});
                await  use.save();
                const token = jwt.sign({userId:use.id},jwtkey)
                res.send({token})
            //     });
            // });
          
    
        }catch(err){
          return res.status(422).send(err.message)
        }
});

app.post('/signin',async (req,res)=>{
  const {username,password} = req.body
  console.log(username,password)
  if(!username || !password){
      return res.status(422).send({error :"must provide username or password"})
  }
  const use = await user.findOne({ where: { username } })
  // res.send(use)
  if(!use){
      return res.status(422).send({error :"must provide username or password2"})
  }
  try{
    console.log(use.hash)
    // await user.comparePassword(password);
    const validPass = await bcrypt.compare(password, use.password);
            if(validPass) {
                const token = jwt.sign({userId:use.id},jwtkey)
                res.send({token})
              // res.status(200).json('Valid Email and pass!');
            } else {
                res.status(400).json('Wrong password!');
            }    
    
  }catch(err){
      return res.status(422).send({error :"must provide username or password3"})
  }
})


app.post('/addissue', async (req, res) => {
  let { user_id, date, issue_type, ward, name, mobile, issues } = req.body;
  try{
    const con = new issue({ user_id, date, issue_type, ward, name, mobile, issues });
    await  con.save();
    res.send("Success")
  }catch(err){
    return res.status(422).send(err.message)
  }
});


app.post('/addpwork', async (req, res) => {
  let { user_id , date, name, title, description } = req.body;
  try{
    const con = new pwork({ user_id , description, name, title, date });
    await  con.save();
    res.send("Success")
  }catch(err){
    return res.status(422).send(err.message)
  }
}); 


// app.post('/material', async (req, res) => {
//   let { site_id , material_type, material, omaterial, unit, unit_rate, quantity, amount, material_from, location, contact_person, contact_number, remarks, status, created_by} = req.body;
  
//     const con = new material_details({ site_id , material_type, material, omaterial, unit, unit_rate, quantity, amount, material_from, location, contact_person, contact_number, remarks, status, created_by});
//     await  con.save()
//     .then((data)=>{
//       res.send(data)
//     })
//     .catch(err=>{
//       console.log(err)
//   })
// }); 


// app.post('/sitedetail', async (req, res) => {
//   let { site_id , flat_number	, party_name, party_contact_number, employee, token_recieved, final_status, amount_recieved, sale_deed, site_visit_date, remarks, status, created_by} = req.body;
//   try{
//     const con = new site_details({ site_id , flat_number	, party_name, party_contact_number, employee, token_recieved, final_status, amount_recieved, sale_deed, site_visit_date, remarks, status, created_by});
//     await  con.save();
//     res.send("Success")
//   }catch(err){
//     return res.status(422).send(err.message)
//   }
// }); 


// app.post('/sitemaster', async (req, res) => {
//   let { name , address	, contact_person, contact_number, status } = req.body;
//   try{
//     const con = new site_masters({ name , address	, contact_person, contact_number, status });
//     await  con.save();
//     res.send("Success")
//   }catch(err){
//     return res.status(422).send(err.message)
//   }
// }); 


// app.post('/searc',async (req,res)=>{
//     const {site_id} = req.body
//     // const use=[];
//     console.log(site_id)
//     // if(!use){
//       //   return res.status(422).send({error :"must provide username or password2"})
//       // }
//       try{
//         const use = await project_details.findAll({ where: { site_id:site_id } })
//         // use.push(one)
//         res.send(use)
//         console.log(use)
//         // return use
//       }catch(err){
//         return res.send(err)
//     }
//     // res.send(use)
//   })

// const port = process.env.PORT;

app.listen(process.env.PORT || 3000, console.log(`Server started on port ${process.env.PORT || 3000}`));