require('dotenv').config()


const express= require("express")
const mongoose=require('mongoose')
<<<<<<< HEAD
const {createDoctor,getDocPatients,getDoctors,updateDoctor} = require("./controllers/doctorController")
const {createPatient,getPatients,getFamilyMembers} = require("./controllers/patientController")
const {createAdmin,getAdmins} = require("./controllers/adminController")
const {createMember} = require("./controllers/familymemController")
=======
const {createDoctor,getDocPatients,getDoctors,updateDoctor,deleteDoctor} = require("./controllers/doctorController")
const {createPatient,getPatients,searchPatientsByName} = require("./controllers/patientController")
const {createAdmin,getAdmin} = require("./controllers/adminController")
const {createMember,getFamilyMembers} = require("./controllers/familymemController")
>>>>>>> 5024008c021c9d28ff439fba89175a78996808e9
const cors = require('cors');
const{createAppointment,filter,getAllAppointments}=require("./controllers/appointmentsController")


//express app
const app = express()
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend's URL
  };
  
  app.use(cors(corsOptions));

app.use(express.json())


app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next()
})
//routes


//connect to DB
mongoose.connect('mongodb+srv://laylathabet:iwant28.@cluster0.vv8gqjs.mongodb.net/?retryWrites=true&w=majority')
.then(()=>{
    // listen for req
app.listen(4000,()=>{
    console.log('Connected to DB & listenening on port 4000')
})

})
.catch((error)=>{
    console.log(error)
})
app.use(express.json())
app.post("/createAdmin",createAdmin);
app.post("/register/doctor",createDoctor);
app.put("/updateDoctor",updateDoctor);
app.post("/register/patient",createPatient);
app.get("/getDocpatients", getDocPatients);
app.get("/getDoctors",getDoctors);
app.get("/getPatients",getPatients);
<<<<<<< HEAD
//app.get("/getAdmins",getAdmins);
=======
app.get("/getAdmins",getAdmin)
>>>>>>> 5024008c021c9d28ff439fba89175a78996808e9
app.post("/addFamilyMember",createMember);
app.delete("/deletedoctor",deleteDoctor);
app.patch("/ubdateDoctor",updateDoctor);
app.get("/getFamilyMem",getFamilyMembers);
app.get("/searchPatientsByName",searchPatientsByName);



app.post("/createAppointment",createAppointment);
app.get("/getAllAppointments",getAllAppointments);
app.get("/filterAppointments",filter);

//app.put("/updateUser", updateUser);

