import { useState, useEffect } from 'react'
import UserServiceAPI from '../../api/userServiceAPI'
import SettingsProps from '../../interfaces/SettingsProps'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useTheme } from '../../theme/ThemeContext';
import { themes } from '../../theme/themes';

import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useAppConfig } from '../../providers/AppConfigProvider';

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
    const [selectedLightTheme, setSelectedLightTheme] = useState(localStorage.getItem('lightTheme'));
    const { toggleLightThemeChange} = useTheme();

    const handleThemeChange = (event) => {
      setSelectedLightTheme(event.target.value);
      localStorage.setItem('lightTheme', event.target.value); 
      if (localStorage.getItem('theme') == null) {
        localStorage.setItem('theme', 'light')
      }
      if (localStorage.getItem('theme') == 'light') {
        toggleLightThemeChange();
      }
    };


    const { appConfig } = useAppConfig();
    const appConfigUserId = appConfig.userId;
    console.log(appConfigUserId)
    useEffect( () => {
      const fetchData = async (appConfigUserId) => {
        const json = await UserServiceAPI.getInstance().getUser(appConfigUserId);
        return json
      }
      
     fetchData(appConfigUserId).then( (data) => {
      changeFormData('firstName', data['user_info'].first_name)
      changeFormData('lastName', data['user_info'].last_name)
      changeFormData('username', data['user_info'].username)
      changeFormData('email', data['user_info'].email)
      changeFormData('managerCode', data['user_info'].manager_code)
      changeFormData('companyCode', data['user_info'].company_code)
      changeFormData('positionName', data['user_info'].position_name)
     })

    }, [appConfigUserId]);


    const changeFormData = (name, value) => {
      setFormData(prevState => ({ ...prevState, [name]: value }));
    }

    const toggleDirectReports = (hasDirectReports: boolean) => {
      setFormData(prevState => ({ ...prevState, ['hasDirectReports']: hasDirectReports }))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setFormData(prevState => ({ ...prevState, [name]: value }));
    };
    
    
    const capitalizeKey = (key) => {
      return key.charAt(0).toUpperCase() + key.slice(1);
    }

    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log(formData)
        e.preventDefault();

        //need to send this data to user service for register confirmation
        try {
          await UserServiceAPI.getInstance().updateUser(formData);
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


    const changePassword = async (e: React.FormEvent<HTMLFormElement>) => {
      console.log(formData)
      e.preventDefault();

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      //need to send this data to user service for register confirmation
      try {
        await UserServiceAPI.getInstance().updatePassword(formData);
        alert("Password was updated successfully!")
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
                value = {formData.firstName}
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
                value = {formData.lastName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="username" className="mb-3">
              <Form.Control
                style={{color: "black"}}
                type="text"
                placeholder="Username"
                value = {formData.username}
                name="username"
                onChange={handleChange}
                disabled
              />
            </Form.Group>
            <Form.Group controlId="email" className="mb-3">
              <Form.Control
                style={{color: "black"}}
                type="email"
                placeholder="Email"
                name="email"
                value = {formData.email}
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
                placeholder="N/A"
                name="managerCode"
                value = {!formData.hasDirectReports ? "": formData.managerCode}
                onChange={handleChange}
                disabled={!formData.hasDirectReports}
                required
              />
            </Form.Group>
            <Form.Group controlId="positionName" className="mb-3">
              <Form.Control
                style={{color: "black"}}
                type="text"
                placeholder="N/A"
                name="positionName"
                value = {formData.positionName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="companyCode" className="mb-3">
              <Form.Control
                style={{color: "black"}}
                type="text"
                placeholder="N/A"
                name="companyCode"
                value = {formData.companyCode}
                onChange={handleChange}
                required
              />
            </Form.Group>
            {
              error &&
              <p className="error-message">{error}</p>
            }

            <div>
              <select value={selectedLightTheme} onChange={handleThemeChange}>
                  {Object.keys(themes).map((key, index) => {
                      if (key != 'dark') {
                        return <option value={key}>{capitalizeKey(key)}</option>
                      }
                    })}
              </select>
              {selectedLightTheme && <p>Theme Will Be: {selectedLightTheme}</p>}
           </div>


            <Button variant="primary" type="submit" className="w-100">
                Save
            </Button>
          </Form>


          <Form onSubmit={changePassword}>
            <Form.Group controlId="password" className="mb-3">
                <Form.Control
                  style={{color: "black"}}
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="confirmPassword" className="mb-3">
                <Form.Control
                  style={{color: "black"}}
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  onChange={handleChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Change Password
            </Button>
          </Form>
        </div>
    )
}

export default Settings