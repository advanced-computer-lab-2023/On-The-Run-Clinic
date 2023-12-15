# On-The-Run-Clinic

## Summary

On-The-Run-Clinic is a web application that connects patients, doctors, and administrators for streamlined healthcare services. Patients can register, schedule appointments, manage prescriptions, and subscribe to health packages. Doctors benefit from an intuitive interface for managing appointments, prescriptions, and patient records. Administrators have tools for user management and health package configurations. The platform enhances healthcare interactions with secure authentication, video calls, and a wallet system for payments and refunds.

## Motivation

On-The-Run-Clinic is inspired by the pressing need to modernize and simplify healthcare services. Traditional healthcare systems often face challenges in communication, appointment management, and overall accessibility. The motivation behind this project is to bridge these gaps by providing a digital platform that connects patients, doctors, and administrators cohesively and efficiently.

The goal is to revolutionize the healthcare experience, ensuring that routine interactions, such as appointment scheduling, prescription management, and health package subscriptions, are user-friendly and secure. On-The-Run-Clinic seeks to empower patients with easy access to healthcare services, offer doctors intuitive tools for managing their practice, and provide administrators with the means to oversee and configure the platform effectively.

In summary, the motivation behind On-The-Run-Clinic is to create a modern and accessible healthcare platform that not only meets the current needs of patients and healthcare professionals but also anticipates and adapts to the evolving landscape of healthcare services. Through secure authentication, video calls, and a streamlined payment system, the project aims to enhance the overall quality and convenience of healthcare interactions.

## Performance Issues and Bugs

**Note**: The two websites (provide_website_1 and provide_website_2) are currently not linked. This is due to ongoing development efforts to establish the necessary connections and ensure a seamless experience between the platforms. We appreciate your patience and understanding as we work towards integrating these components. Updates on the linking progress will be communicated in subsequent releases.

- **Long Processing Time**: The website currently experiences delays in fetching information from MongoDB using Mongoose. Efforts are underway to optimize database queries and enhance overall performance.

Your understanding and patience as we address these issues are greatly appreciated.

## Code Style

The code follows React JavaScript coding conventions with the following notable aspects:

- **Import Statements:** Organized at the top of the file, each on a new line. External libraries are imported using a direct import statement (`import {...} from '...'`).

- **Component Definition:** Arrow function syntax is used for functional components with React hooks (`useState`, `useEffect`).

- **CSS Styling:** Inline styles are used within the JSX for styling components.

- **Variable Naming:** Generally clear and follows camelCase conventions.

- **Async/Await:** Asynchronous operations are handled using the `async/await` syntax.

- **Linking:** React Router's `Link` component is used for navigation.

- **Icons:** FontAwesome icons are used for visual elements.

If you're contributing to the project, please follow these conventions to maintain code consistency.

## Screenshots

Here are some screenshots that showcase how On-The-Run-Clinic looks and works:

![Screenshot 1](screenshots/AdminDashboard.png)
*Admin Dashboard*

![Screenshot 2](screenshots/deletePatient.png)
*Admin viewing and deleting patients page*

![Screenshot 3](screenshots/requests.png)
*Admin viewing doctor requests*

![Screenshot 4](screenshots/DoctorPatients.png)
*Doctor viewing his patients and can videoCall them and chat*

![Screenshot 5](screenshots/chat.png)
*Chatting with patients*

![Screenshot 6](screenshots/patientPres.png)
*Patient viewing his prescription*


## Tech/Framework Used

The On-The-Run-Clinic project is built using the following technologies and frameworks:

- **React:** The frontend of the application is developed using the React library, providing a dynamic and responsive user interface.

- **Node.js:** The backend is powered by Node.js, ensuring efficient server-side processing and communication.

- **MongoDB:** As a NoSQL database, MongoDB is used to store and manage the project's data, providing scalability and flexibility.

- **Express:** The application utilizes the Express framework for building robust and scalable server-side applications.

- **Stripe:** For secure online payment processing, the Stripe API is integrated to handle credit card transactions.

- **FontAwesome:** Icons used in the user interface are sourced from FontAwesome, adding visual elements to the design.

- **Axios:** The Axios library is employed for making HTTP requests, ensuring seamless communication between the frontend and backend.

- **React Router:** Navigation within the React-based application is managed using React Router, providing a single-page application experience.

## Features

On-The-Run-Clinic boasts a range of features designed to enhance the healthcare experience for both patients and healthcare professionals. Here are some of the key features:

1. **User-Friendly Registration:**
   - Patients and doctors can easily register on the platform with a seamless registration process, providing essential details for a personalized experience.

2. **Document Upload for Medical History:**
   - Patients have the ability to upload and remove documents (PDF, JPEG, JPG, PNG) for their medical history, ensuring comprehensive and centralized record-keeping.

3. **Flexible Health Package Subscriptions:**
   - Patients can choose from different health packages (Silver, Gold, Platinum) with varying benefits, including session discounts, medication discounts, and family member subscription discounts.

4. **Secure Authentication and Password Management:**
   - Robust password validation ensures secure authentication, and users have the ability to change and reset passwords with ease.

5. **Comprehensive Appointment Management:**
   - Patients can filter, schedule, reschedule, and cancel appointments, while doctors can manage their available time slots and view upcoming appointments.

6. **Real-Time Video Calls:**
   - Doctors and patients can initiate video calls, providing a convenient and secure means of communication for consultations.

7. **Wallet System for Payments and Refunds:**
   - Patients can choose to pay for appointments and health packages using their wallet or credit card, and refunds are seamlessly processed to the user's wallet.

8. **Family Member Management:**
   - Patients can add and manage family members, allowing for streamlined health management for the entire family unit.

9. **Prescription and Medication Management:**
   - Doctors can add prescriptions, update dosages, and manage medications directly from the platform, providing a comprehensive overview for patients.

10. **Interactive Chat System:**
    - Doctors and patients can engage in secure and interactive chat sessions, fostering communication and clarification on healthcare matters.

These features collectively contribute to a user-centric healthcare platform, providing convenience, security, and efficiency in managing healthcare interactions. On-The-Run-Clinic aims to stand out by offering a holistic set of features that cater to the diverse needs of both patients and healthcare professionals.


## Code Examples

### User Registration

Registering a patient involves sending a POST request to the server with the necessary user details.

```javascript
//admin viewing,deleting and updating the health packages
const ManageHealthPackages = () => {

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [packages, setPackages] = useState([]);
  const [packagee, setPackagee] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch the list of health packages from the server
    axios.get('http://localhost:4000/getPackages', {
      withCredentials: true
    })
      .then((response) => {
        setPackages(response.data);
      })
      .catch((error) => {
        console.error('Error fetching health packages:', error);
      });
  }, []);

  const handlePackagesFetched = (isLinked) => {
    if (isLinked) {
      axios.get('http://localhost:4000/getPackages', {
        withCredentials: true
      })
        .then((response) => {
          setPackages(response.data);
        })
        .catch((error) => {
          console.error('Error fetching health packages:', error);
        });
      setIsFormVisible(false);
    }
  };
  const handleDelete = (packageId) => {
    // Send a DELETE request to delete the selected package
    axios.delete(`http://localhost:4000/deletePackage?id=${packageId}`, {
      withCredentials: true
    })
      .then((response) => {
        console.log('Package deleted successfully:', response.data);
        // Fetch the updated list of health packages after deletion
        axios.get('http://localhost:4000/getPackages', {
          withCredentials: true
        })
          .then((response) => {
            setPackages(response.data);
          })
          .catch((error) => {
            console.error('Error fetching health packages:', error);
          });
      })
      .catch((error) => {
        console.error('Error deleting health package:', error);
      });
  };


  return (
    <div className="container">
      <div className="prescriptions-list">
        <h2>
          Health Packages
          <FontAwesomeIcon
            className="add-icon"
            icon={faPlus}
            onClick={() => setIsFormVisible(true)}
            style={{ color: '#14967f' }}
          />
        </h2>
        <ul>
          {packages.map((p) => (
            <li key={p._id}>
              <div className="prescription-card">
                <div className="prescription-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span><strong>Name: </strong>  {p.name}</span>
                  <div>
                    <FontAwesomeIcon
                      className="view-icon"
                      icon={faEye}
                      style={{marginRight:'10px'}}
                      onClick={() => {
                        setActiveId(p._id)
                        setPackagee(p);
                        setIsModalOpen(true);
                      }}
                    />
                    <FontAwesomeIcon
                      className="delete-icon"
                      icon={faTrash}
                      onClick={() => handleDelete(p._id)}
                    />
                  </div>
                </div>
                  <div><strong>Package ID: </strong> {p._id}</div>
                </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="prescription-form">
        {isFormVisible && <HealthPackagesForm onPackagesFetched={handlePackagesFetched} />}
      </div>
      {isModalOpen && packagee &&
        <PackageDetailsModal
          setOpenModal={setIsModalOpen}
          packagee={packagee}
          onSuccess={handlePackagesFetched}
        />
      }

    </div>

  )
}
export default ManageHealthPackages

