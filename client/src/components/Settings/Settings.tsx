import { useState, useEffect} from 'react'
import UserServiceAPI from '../../api/userServiceAPI'
import SettingsProps from '../../interfaces/SettingsProps'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useTheme } from '../../theme/ThemeContext';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const Settings: React.FC<SettingsProps> = () => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      hasDirectReports: false,
      managerCode: '',
      companyCode: '',
      positionName: ''
    })
    const [error, setError] = useState("");
    const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(localStorage.getItem('themeLightBackgroundColor'));
    const [selectedSidebarColor, setSelectedSidebarColor] = useState(localStorage.getItem('themeLightBackgroundColor'));

    const { toggleLightBackgroundColor, toggleLightSidebarColor} = useTheme();

    const handleBackgroundColorChange = (event) => {
      setSelectedBackgroundColor(event.target.value);
      toggleLightBackgroundColor(event.target.value)
    };

    const handleSidebarColorChange = (event) => {
      setSelectedSidebarColor(event.target.value);
      toggleLightSidebarColor(event.target.value)
    };


    useEffect(() => {
      toggleLightBackgroundColor(selectedBackgroundColor);
      toggleLightSidebarColor(selectedSidebarColor)
      // Replace with your function
      // You can place any code here that you want to run when the component loads
    }, []);
  
    const toggleDirectReports = (hasDirectReports: boolean) => {
      setFormData(prevState => ({ ...prevState, ['hasDirectReports']: hasDirectReports }))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log(formData)
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return;
        }

        //need to send this data to user service for register confirmation
        try {
          await UserServiceAPI.getInstance().registerUser(formData);
          alert("Registration was succesful!")
          setError("");
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An error occurred");
          }
        }
    };

    const divStyle = {
      width: '100%',
    };

    return (
      <div style={divStyle}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="firstName" className="mb-3">
              <Form.Control
                style={{color: "black"}}
                type="text"
                placeholder="First Name"
                name="firstName"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="lastName" className="mb-3">
              <Form.Control
                style={{color: "black"}}
                type="text"
                placeholder="Last Name"
                name="lastName"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="username" className="mb-3">
              <Form.Control
                style={{color: "black"}}
                type="text"
                placeholder="Username"
                name="username"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="email" className="mb-3">
              <Form.Control
                style={{color: "black"}}
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="password" className="mb-3">
              <Form.Control
                style={{color: "black"}}
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="confirmPassword" className="mb-3">
              <Form.Control
                style={{color: "black"}}
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <ButtonGroup className="mb-3">
              <ToggleButton
                id="has-reports"
                type="checkbox"
                variant="primary"
                checked={formData.hasDirectReports}
                value="1"
                onChange={() => toggleDirectReports(true)}
              >
                Has Direct Reports
              </ToggleButton>
              <ToggleButton
                id="not-has-reports"
                type="checkbox"
                variant="primary"
                checked={!formData.hasDirectReports}
                value="2"
                onChange={() => toggleDirectReports(false)}
            >
              Has No Direct Reports
              </ToggleButton>
            </ButtonGroup>
            <Form.Group controlId="managerCode" className="mb-3">
              <Form.Control
                style={{color: "black"}}
                type="text"
                placeholder="Manager Code"
                name="managerCode"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="positionName" className="mb-3">
              <Form.Control
                style={{color: "black"}}
                type="text"
                placeholder="Position Name (ex: Builder, Chef, Manager ... )"
                name="positionName"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="companyCode" className="mb-3">
              <Form.Control
                style={{color: "black"}}
                type="text"
                placeholder="Company Code"
                name="companyCode"
                onChange={handleChange}
                required
              />
            </Form.Group>
            {
              error &&
              <p className="error-message">{error}</p>
            }

            <div>
             <select value={selectedBackgroundColor} onChange={handleBackgroundColorChange}>
              <option value="tan">Tan</option>
                <option value="green">Green</option>
                <option value="blue">Blue</option>
                <option value="purple">Purple</option>
                <option value="cyan">Cyan</option>
              </select>
              {/* Display the selected option */}
              {selectedBackgroundColor && <p>Background Color Will Be: {selectedBackgroundColor}</p>}
            </div>


            <div>
             <select value={selectedSidebarColor} onChange={handleSidebarColorChange}>
              <option value="tan">Tan</option>
                <option value="green">Green</option>
                <option value="blue">Blue</option>
                <option value="purple">Purple</option>
                <option value="cyan">Cyan</option>
              </select>
              {/* Display the selected option */}
              {selectedSidebarColor && <p>Sidebar Color Will Be: {selectedSidebarColor}</p>}
            </div>


            <Button variant="primary" type="submit" className="w-100">
                Save
            </Button>
          </Form>
        </div>
    )
}

export default Settings
