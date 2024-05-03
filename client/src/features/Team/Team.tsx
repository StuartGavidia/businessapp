import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Select, { MultiValue } from 'react-select';
import UserServiceAPI from '../../api/userServiceAPI'
import './Team.css';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    positionName: string;
    managerId: string | null;
    username: string;
    email: string;
}

interface UserDatabase {
  id: number;
  first_name: string;
  last_name: string;
  position_name: string;
  manager_id: number | null;
  username: string;
  email: string;
}

interface Feature {
  label: string;
  value: string;
  isDisabled: boolean;
}

interface EmployeeDatabase {
  company_id: string,
  last_name: string,
  first_name: string,
  position_name: string,
  status: string,
  user_id: string,
  username: string,
  manager_id: string | null,
  email: string
}

const Team: React.FC = () => {
    const [teamMembers, setTeamMembers] = useState<User[]>([]);
    const [, setCurrentUser] = useState<User | null>(null);
    const [allSubordinates, setAllSubordinates] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [manager, setManager] = useState<User | null | undefined>(null);
    const [peers, setPeers] = useState<User[]>([]);
    const [subordinates, setSubordinates] = useState<User[]>([]);

    const [showModal, setShowModal] = useState(false);
    const [canEditPermissions, setCanEditPermissions] = useState(false);
    const featuresOptions: Feature[] = [
      { label: 'Analytics', value: 'analytics', isDisabled: false },
      { label: 'Calendar', value: 'calendar', isDisabled: true },
      { label: 'Messaging', value: 'messaging', isDisabled: true }
    ];
    const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([
      { label: 'Calendar', value: 'calendar', isDisabled: true },
      { label: 'Messaging', value: 'messaging', isDisabled: true }
    ]);

    const formatFeatureLabel = (feature: Feature) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>{feature.label}</div>
      </div>
    );

    const handleEditPermissionsClick = () => {
      setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    const handleSave = () => {
        //TODO: save changes by making request to backend (selectedFeatures and EditPermissions should be updated for selectedUser)
        console.log("Saved:", selectedFeatures, canEditPermissions);
        setShowModal(false);
    };

    const handleFeaturesChange = (selectedOptions: MultiValue<Feature>) => {
      const filteredOptions = selectedOptions.filter(option => !option.isDisabled);
      const mandatoryOptions = featuresOptions.filter(option => option.isDisabled);
      setSelectedFeatures([...filteredOptions, ...mandatoryOptions]);
    };

    const handleCanEditPermissionsChange = (event: any) => {
        setCanEditPermissions(event.target.checked);
    };

    useEffect(() => {
      const fetchTeamMembers = async () => {
          const employees: EmployeeDatabase[] = await UserServiceAPI.getInstance().usersInCompany();
          const simulatedData:  User[] = employees.map(employee => {
            return {
              id: employee.user_id,
              firstName: employee.first_name,
              lastName: employee.last_name,
              positionName: employee.position_name,
              managerId: employee.manager_id,
              username: employee.username,
              email: employee.email
            }
          })

          const currentEmployee: UserDatabase = await UserServiceAPI.getInstance().getUserById();
          const current: User = {
            id: currentEmployee.id.toString(),
            firstName: currentEmployee.first_name,
            lastName: currentEmployee.last_name,
            managerId: currentEmployee.manager_id ? currentEmployee.manager_id.toString() : null,
            positionName: currentEmployee.position_name,
            username: currentEmployee.username,
            email: currentEmployee.email
          }

          setAllSubordinates(findAllSubordinates(current.id, simulatedData));
          setTeamMembers(simulatedData);
          setCurrentUser(current);
          setSelectedUser(current);

          const managerData = simulatedData.find(user => user.id == current.managerId);
          setManager(managerData);

          const peersData = simulatedData.filter(user => user.managerId == current.managerId);
          setPeers(peersData);

          console.log(simulatedData)
          console.log(current)
          const subordinatesData = simulatedData.filter(user => user.managerId == current.id);
          setSubordinates(subordinatesData);
      };

      fetchTeamMembers();
    }, []);

    const findAllSubordinates = (userId: string, members: User[]): User[] => {
      let subs: User[] = [];

      const directSubs = members.filter(member => member.managerId == userId);

      subs = [...subs, ...directSubs];

      directSubs.forEach(sub => {
          subs = [...subs, ...findAllSubordinates(sub.id, members)];
      });

      return subs;
    };

    const handleSelectUser = (user: User) => {
      setSelectedUser(user);

      const managerData = teamMembers.find(member => member.id == user.managerId);
      setManager(managerData);

      const peersData = teamMembers.filter(member => member.managerId == user.managerId);
      setPeers(peersData);

      const subordinatesData = teamMembers.filter(member => member.managerId == user.id);
      setSubordinates(subordinatesData);
    };

    return (
      <>
          <div className="team-page-container">
              <div className="team-members">
                  {manager && (
                      <div className="manager">
                          <Card style={{ width: '12rem' }}>
                              <Card.Img variant="top" src="/assets/images/defaultProfile.png" alt="User Image" />
                              <Card.Body>
                                  <Card.Title>{`${manager.firstName} ${manager.lastName}`}</Card.Title>
                                  <Card.Subtitle className="mb-2 text-muted">{manager.positionName}</Card.Subtitle>
                                  <Button variant="primary" onClick={() => handleSelectUser(manager)}>View Details</Button>
                              </Card.Body>
                          </Card>
                      </div>
                  )}
                  <div className="peers">
                      {peers.map((peer) => (
                          <Card key={peer.id} style={{ width: '12rem' }}>
                              <Card.Img variant="top" src="/assets/images/defaultProfile.png" alt="User Image" />
                              <Card.Body>
                                  <Card.Title>{`${peer.firstName} ${peer.lastName}`}</Card.Title>
                                  <Card.Subtitle className="mb-2 text-muted">{peer.positionName}</Card.Subtitle>
                                  <Button variant="primary" onClick={() => handleSelectUser(peer)}>View Details</Button>
                              </Card.Body>
                          </Card>
                      ))}
                  </div>
                  <div className="subordinates">
                      {subordinates.map((sub) => (
                          <Card key={sub.id} style={{ width: '12rem' }}>
                              <Card.Img variant="top" src="/assets/images/defaultProfile.png" alt="User Image" />
                              <Card.Body>
                                  <Card.Title>{`${sub.firstName} ${sub.lastName}`}</Card.Title>
                                  <Card.Subtitle className="mb-2 text-muted">{sub.positionName}</Card.Subtitle>
                                  <Button variant="primary" onClick={() => handleSelectUser(sub)}>View Details</Button>
                              </Card.Body>
                          </Card>
                      ))}
                  </div>
              </div>
              <div className="selected-user-details">
                  {selectedUser && (
                      <Card style={{ width: '18rem' }}>
                          <Card.Img variant="top" src="/assets/images/defaultProfile.png" alt="User Image" />
                          <Card.Body>
                              <Card.Title>{`${selectedUser.firstName} ${selectedUser.lastName}`}</Card.Title>
                              <Card.Text>Username: {selectedUser.username}</Card.Text>
                              <Card.Text>Position: {selectedUser.positionName}</Card.Text>
                              <Card.Text>Email: {selectedUser.email}</Card.Text>
                              {allSubordinates.some(sub => sub.id === selectedUser.id) && (
                                  <>
                                      <Button onClick={handleEditPermissionsClick}>Edit Permissions</Button>
                                  </>
                              )}
                          </Card.Body>
                      </Card>
                  )}
              </div>
              <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Permissions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Can View:</h5>
                    <Select
                      isMulti
                      name="features"
                      options={featuresOptions}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      formatOptionLabel={formatFeatureLabel}
                      getOptionValue={option => option.value}
                      onChange={handleFeaturesChange}
                      value={selectedFeatures}
                      isOptionDisabled={(option) => option.isDisabled}
                    />
                    <h5>Can Edit Permissions:</h5>
                    <div>
                        <input
                            type="checkbox"
                            checked={canEditPermissions}
                            onChange={handleCanEditPermissionsChange}
                        /> Yes
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
          </div>
      </>
  );
};

export default Team;
