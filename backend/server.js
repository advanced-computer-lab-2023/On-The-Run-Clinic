require('dotenv').config()


const express= require("express")
const mongoose=require('mongoose')
const Patient = require('./models/PatientModel');

const {createDoctor,getDocPatients,getDoctors,updateDoctor,deleteDoctor,addPatientToDr,getDoctorByUsername,getDoctorbyId,createDoctor1} = require("./controllers/doctorController")
const {createPatient,getPatients,searchPatientsByName,getMyPrescriptions,searchPatientsByUserame,deletePatient,getPatient,linkMemberByEmail,getLinkedFamilyMembers,getMedicalHistory,deleteMedicalHistory,payByPackage,updatePasswordPatient} = require("./controllers/patientController")
const {createAdmin,getAdmin,getAdmins,deleteAdmin,getAdminByUsername,updatePasswordAdmin} = require("./controllers/adminController")
const {createMember,getFamilyMembers} = require("./controllers/familymemController")
const cors = require('cors');
const{createAppointment,filter,getAllAppointments,getDoctorAppointments,getPatientAppointments,createAppointment1}=require("./controllers/appointmentsController")
const{createPrescription,getPrescriptionsForPatient}=require("./controllers/perscriptionsController")
const{createRequest, getOneRequest,getRequests,deleteRequest,rejectrequest}=require("./controllers/requestsController")
const{createHealthPackage,getPackages,updateHealthPackage,deleteHealthPackage,getHealthPackage}=require("./controllers/HealthPackagesController")


const{login,logout}=require("./controllers/userController")
const multer=require("multer");

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
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        return cb(null,'./controllers/uploads')
},
filename:function(req,file,cb){
    return cb(null,Date.now()+file.originalname)
}
}) 
const upload=multer({storage:storage})
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
      // Find the patient by their username
      const patient = await Patient.findOne({ username: req.body.username });
      console.log(patient);
  
      if (!patient) {
        console.error('Patient not found.');
        return res.status(404).json({ message: 'Patient not found.' });
      }
  
      // Check if a file was successfully uploaded
      if (!req.file) {
        console.error('No file uploaded.');
        return res.status(400).json({ message: 'No file uploaded.' });
      }
  
      // Update the patient's medicalHistory field with the file data
      patient.medicalHistory.push({
        filename: req.file.originalname,  // Use 'originalname' to get the original file name
        path: req.file.path,             // Use 'path' to get the path to the uploaded file
        mimetype: req.file.mimetype
      });
  
      // Save the updated patient model to the database
      await patient.save();
  
      res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  


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
app.get("/getDocPatients/:username", getDocPatients);
app.get("/getDoctors",getDoctors);
app.get("/getPatients",getPatients);
app.get("/getAdmins",getAdmins)
app.post("/addFamilyMember",createMember);
app.delete("/deleteDoctor/:id",deleteDoctor);
app.patch("/ubdateDoctor",updateDoctor);
app.get("/getFamilyMem/:username",getFamilyMembers);
app.get("/searchPatientsByName",searchPatientsByName);
app.post("/addPatientToDr",addPatientToDr);
app.post("/addPrescription",createPrescription);
app.get("/getPrescriptions/:id",getPrescriptionsForPatient);
app.get("/getMyPrescriptions/:username",getMyPrescriptions);
app.post("/createRequest",createRequest);
app.post("/createPackage",createHealthPackage);
app.get("/getPackages",getPackages);
app.put("/updatePackage",updateHealthPackage);
app.delete("/deletePackage",deleteHealthPackage);
app.delete("/deleteAdmin/:id",deleteAdmin);
app.delete("/deletePatient/:id",deletePatient);
app.get("/getDoctor/:username",getDoctorByUsername);
app.get("/getOneRequest",getOneRequest);
app.get("/getRequests",getRequests);
app.post("/createAppointment",createAppointment);
app.get("/getAllAppointments",getAllAppointments);
app.get("/filterAppointments",filter);
app.get("/search/:username",searchPatientsByUserame);
app.get("/getDoctorAppointments/:id",getDoctorAppointments);
app.get("/getPatientAppointments/:id",getPatientAppointments);
app.get("/getPatient/:id",getPatient);
app.get("/getDoc/:id",getDoctorbyId);
app.get("/getPatientByUsername/:username",searchPatientsByUserame);
app.get("/getPackage/:id",getHealthPackage);
app.get("/getLinkedFamilyMembers/:username",getLinkedFamilyMembers);
app.post("/linkMember",linkMemberByEmail);
app.post("/payPackage",payByPackage);
app.post("/updatePassPatient",updatePasswordPatient);
//app.post("/updatePassDoctor",updatePasswordDoctor);
app.get("/getMedicalHistory/:username",getMedicalHistory);
app.delete('/deleteMedicalRecord/:username/:filename', deleteMedicalHistory);
app.post("/login",login);
app.get("/logout",logout);

app.put("/rejectRequest/:id",rejectrequest);
app.post("/acceptRequest/:username/:name/:email/:password/:date_of_birth/:hourly_rate/:speciality/:Affiliation/:educational_background",createDoctor1)
app.post("/newAppointment/:username/:patientId/:doctorId/:date/:status/:description",createAppointment1);
app.get("/getDoctorByUsername/:username",getDoctorByUsername);
app.post("/forgetPassword",forgetPassword);
app.post("/resetPassword/:username",resetPassword);

app.get("/getAdminByUsername/:username",getAdminByUsername);
app.put("/updatePassAdmin",updatePasswordAdmin);




