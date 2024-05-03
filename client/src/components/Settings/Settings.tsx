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
    const [isEditable, setIsEditable] = useState(false);

    const handleThemeChange = (event: any) => {
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
      const fetchData = async (appConfigUserId: any) => {
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


    const changeFormData = (name: any, value: any) => {
      setFormData(prevState => ({ ...prevState, [name]: value }));
    }

    const toggleDirectReports = (hasDirectReports: boolean) => {
      setFormData(prevState => ({ ...prevState, ['hasDirectReports']: hasDirectReports }))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setFormData(prevState => ({ ...prevState, [name]: value }));
    };


    const capitalizeKey = (key: any) => {
      return key.charAt(0).toUpperCase() + key.slice(1);
    }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
                readOnly={!isEditable}
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
                readOnly={!isEditable}
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
                readOnly={!isEditable}
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
                readOnly={!isEditable}
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
                readOnly={!isEditable}
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
                readOnly={!isEditable}
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
                readOnly={!isEditable}
                disabled={!formData.hasDirectReports}
                required
              />
            </Form.Group>
            <Form.Group controlId="positionName" className="mb-3">
              <Form.Control
                style={{color: "black"}}
                type="text"
                placeholder="Position Name (ex: Builder, Chef, Manager ... )"
                name="positionName"
                value = {formData.positionName}
                readOnly={!isEditable}
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
                value = {formData.companyCode}
                readOnly={!isEditable}
                onChange={handleChange}
                required
              />
            </Form.Group>
            {
              error &&
              <p className="error-message">{error}</p>
            }

            <div>
              <select value={selectedLightTheme || ''} onChange={handleThemeChange}>
                  {Object.keys(themes).map((key) => {
                      if (key != 'dark') {
                        return <option value={key}>{capitalizeKey(key)}</option>
                      }
                    })}
              </select>
              {selectedLightTheme && <p>Theme Will Be: {selectedLightTheme}</p>}
           </div>

          {isEditable && (
              <Button variant="primary" type="submit" className="w-100">
                  Save
              </Button>) 
          }


        
          </Form>


          <Form onSubmit={changePassword}>
            <Form.Group controlId="password" className="mb-3">
                <Form.Control
                  style={{color: "black"}}
                  type="password"
                  placeholder="Password"
                  name="password"
                  readOnly={!isEditable}
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
                  readOnly={!isEditable}
                />
              </Form.Group>

            {isEditable && (
              <Button variant="primary" type="submit" className="w-100">
                Change Password
            </Button>
            )}
          </Form>

          {isEditable && (
              <Button variant="primary" onClick={() => setIsEditable(false)} className="w-100">
                Cancel
              </Button>
            )
          } 

          {!isEditable && (
              <Button variant="primary" onClick={() => setIsEditable(true)} type="submit" className="w-100">
                  Edit
              </Button>)
          }
        </div>
    )
}

export default Settings
