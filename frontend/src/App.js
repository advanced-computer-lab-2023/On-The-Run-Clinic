import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useAuthContext } from './hooks/useAuthContext';



import DoctorRegistrationForm from './pages/DoctorRegPage';
import DoctorDashboard from './components/DoctorDashboard';
import PatientRegistrationForm from './pages/PatientRegPage';
import PatientDashboard from './components/PatientDashboard';


import FamilyMemberForm from './components/FamilyMemberForm';
import FamilyMembersList from './pages/viewMyFamilyMem';

import MyPatients from './pages/MyPatients';
import MyPrescription from './pages/viewMyPrescriptions';
import Doctorz from './pages/ViewDoctorzz';
import DeleteDoctorPage from './pages/DeleteDoctorPage';
import AdminHealthPackages from './pages/AdminHealthPackages';

import ViewRequests from './pages/ViewDoctorRequest';
import FilterAppointments from './pages/FilterAppointments';
import AdminDashboard from './components/AdminDashboard';

import DeletePatient from './pages/DeletePatientPAge';
import PatientDetails from './components/PatientDetails';
import FilterAppointmentsPatient from './pages/FilterAppointmentsPatient';
import DoctorDetails from './pages/doctorDetails';
import LinkPatientPage from './pages/linkPatient';
import HealthPackageSubscriptionPage from './pages/SelectHealthPackages';
import ChangePatientPass from './pages/changePatientPass';
import MedicalHistoryList from './pages/deleteMedicalHistory';

import Login from './pages/login';
import ChangeAdminPass from './pages/changeAdminPass';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
//import HealthPackage from '../../backend/models/HealthPackages';
import HealthPackagesDetails from './pages/HealthPackageDetails';
import ViewAppointments from './pages/viewAppointments';
import Notifications from './components/Notifications';
import PendingDoctorPage from './pages/PendingDocPage';
import ViewFollowUpReqs from './pages/ViewFollowUpReqs';
import ManagePrescriptions from './pages/managePrescriptions';
import FollowupDoctor from './pages/FollowupDoctor';
import DoctorSettings from './pages/DoctorSettings';
import Videocall from './pages/VideoCall';
import ManageAdmins from './pages/ManageAdmins';
import ManageHealthPackages from './pages/HealthPackagesAdmin';
import MyPres from './pages/MyPrescriptions';

// Import your components


function App() {
  const { user } = useAuthContext()
  if (user) {
    console.log(user.role)
  }


  console.log("inApp:", user);
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/changePatientPassword/:username"
            element={user && user.role === 'patient' ? <ChangePatientPass /> : <Navigate to="/login" />}
          />
          <Route
            path="/subHealthPackages/:username"
            element={user && user.role === 'patient' ? <HealthPackageSubscriptionPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/deleteMedicalHistory/:username"
            element={user && user.role === 'patient' ? <MedicalHistoryList /> : <Navigate to="/login" />}
          />
          <Route
            path="/viewFamilyMembers/:username"
            element={user && user.role === 'patient' ? <FamilyMembersList /> : <Navigate to="/login" />}
          />
          <Route
            path="/linkFamilyMember/:username"
            element={user && user.role === 'patient' ? <LinkPatientPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/dashboard/admin/:username"
            element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/healthPackages"
            element={user && user.role === 'admin' ? <AdminHealthPackages /> : <Navigate to="/login" />}
          />
         
          <Route
            path="/viewRequests"
            element={user && user.role === 'admin' ? <ViewRequests /> : <Navigate to="/login" />}
          />
          <Route
            path="/viewMyPatients/:username"
            element={user && user.role === 'doctor' ? <MyPatients /> : <Navigate to="/login" />}
          />
          <Route
            path="/viewMyPrescription/:username"
            element={user && user.role === 'patient' ? <MyPres /> : <Navigate to="/login" />}
          />
          <Route
            path="/deleteDoctor"
            element={user && user.role === 'admin' ? <DeleteDoctorPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/deleteAdmin"
            element={user && user.role === 'admin' ? <ManageAdmins /> : <Navigate to="/login" />}
          />
          <Route
            path="/deletePatient"
            element={user && user.role === 'admin' ? <DeletePatient /> : <Navigate to="/login" />}
          />
          <Route
            path="/dashboard/patient/:username"
            element={user && user.role === 'patient' ? <PatientDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/dashboard/doctor/:username"
            element={user && user.role === 'doctor' ? <DoctorDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/pendingDoctors/:username"
            element={user && user.role === 'pending' ? <PendingDoctorPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/viewDoctors/:username"
            element={user && user.role === 'patient' ? <Doctorz /> : <Navigate to="/login" />}
          />

          <Route path="/getDoctors" element={<getDoctors />} />

          <Route path="/register/doctor" element={<DoctorRegistrationForm />} />
          <Route path="/register/patient" element={<PatientRegistrationForm />} />

          <Route
            path="/addFamilyMember/:username"
            element={user && user.role === 'patient' ? <FamilyMemberForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/filterAppointments/:username"
            element={user && user.role === 'doctor' ? <FilterAppointments /> : <Navigate to="/login" />}
          />
          <Route
            path="/filterAppointmentsPatient/:username"
            element={user && user.role === 'patient' ? <FilterAppointmentsPatient /> : <Navigate to="/login" />}
          />
          <Route
            path="/patient-details/:username/:usernameDoctor"
            element={user && (user.role === 'doctor' || user.role === 'patient' || user.role === 'admin') ? <PatientDetails /> : <Navigate to="/login" />}
          />
          <Route
            path="/doctor-details/:doctorUsername/:patientUsername"
            element={user && (user.role === 'doctor' || user.role === 'patient' || user.role === 'admin') ? <DoctorDetails /> : <Navigate to="/login" />}
          />
          <Route
            path="/viewHealthPackagesDetails/:username"
            element={user && user.role === 'patient' ? <HealthPackagesDetails /> : <Navigate to="/login" />}
          />
          <Route
            path="/ViewAppointments/:doctorUsername/:patientUsername"
            element={user && (user.role === 'doctor' || user.role === 'patient') ? <ViewAppointments /> : <Navigate to="/login" />}
          />
          <Route
            path="/changeAdminPassword/:username"
            element={user && user.role === 'admin' ? <ChangeAdminPass /> : <Navigate to="/login" />}
          />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route path="/resetPassword/:username" element={<ResetPassword />} />
          <Route path="/viewFollowup/:doctorId" element={<ViewFollowUpReqs />} />
          <Route
            path="/managePrescriptions/:username/:usernameDoctor"
            element={user && user.role === 'doctor' ? <ManagePrescriptions /> : <Navigate to="/login" />}
          />
          <Route
            path="/followUpDoctor/:username/:usernameDoctor"
            element={user && user.role === 'doctor' ? <FollowupDoctor /> : <Navigate to="/login" />}
          />
          <Route
            path="/doctorSettings/:username"
            element={user && user.role === 'doctor' ? <DoctorSettings /> : <Navigate to="/login" />}
          />
          <Route path="/videocall" element={<Videocall />} />

          <Route
            path="/notifications/:username"
            element={user && (user.role === 'doctor' || user.role === 'patient') ? <Notifications /> : <Navigate to="/login" />}
          />


          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}


export default App;