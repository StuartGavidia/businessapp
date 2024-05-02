import './Sidebar.css'
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from 'react';
import UserServiceAPI from '../../api/userServiceAPI'

interface NavRoute {
  name: string,
  route: string,
  icon: string
}

interface SidebarProps {
  toggleShow: Function
}

const Sidebar:React.FC<SidebarProps> = ({toggleShow}) => {
    const location = useLocation();

    const [features, setFeatures] = useState<string[]>([]);
    const requiredFeatures = ['Dashboard', 'Team', 'Inbox', 'Settings']

    useEffect(() => {
      const fetchFeatures = async () => {
          try {
              const featureNames = await UserServiceAPI.getInstance().getFeatures();
              setFeatures(featureNames);
          } catch (error) {
              console.error('Error fetching features:', error);
          }
      };

      fetchFeatures();
    }, []);

    const routes: NavRoute[] = [
      {
        name: "Dashboard",
        route: "/dashboard",
        icon: "bi bi-window-fullscreen"
      },
      {
        name: "Analytics",
        route: "/dashboard/analytics",
        icon: "bi bi-bar-chart-fill"
      },
      {
        name: "Team",
        route: "/dashboard/team",
        icon: "bi bi-person-circle"
      },
      {
        name: "Inbox",
        route: "/dashboard/communication",
        icon: "bi bi-chat-dots-fill"
      },
      {
        name: "Calendar",
        route: "/dashboard/calendar",
        icon: "bi bi-calendar"
      },
      {
        name: "Settings",
        route: "/dashboard/settings",
        icon: "bi bi-gear"
      }
    ]
    return (
      <>
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="/dashboard">
          <Row className="sidebar-tabs-wrapper" >
            <Col>
              <ListGroup className="p-2">
                <div style={{display: "flex", justifyContent: "space-between", color: 'var(--sidebar-text-color)'}}>
                  <h1 className="mb-4">TS</h1>
                  <p style={{cursor: "pointer"}} onClick={() => toggleShow()}>X</p>
                </div>
                {
                  routes.map((route: NavRoute, index: number) => {
                    if (features.includes(route.name) || requiredFeatures.includes(route.name)) {
                      return (
                        <ListGroup.Item
                          action
                          as={Link}
                          to={route.route}
                          active={location.pathname === route.route}
                          style={
                            {
                              backgroundColor: location.pathname === route.route ? 'var(--sidebar-text-color-active)' : 'var(--bs-background-color)',
                              border: 'none',
                              color: 'var(--sidebar-text-color)'
                            }
                          }
                          className="mb-2"
                          key={index}
                        >
                          <div className="feature-wrapper">
                            <i className={route.icon}></i>
                            <p>{route.name}</p>
                          </div>
                        </ListGroup.Item>
                      )
                    }
                  })
                }
              </ListGroup>
            </Col>
          </Row>
        </Tab.Container>
      </>
    )
}

export default Sidebar
