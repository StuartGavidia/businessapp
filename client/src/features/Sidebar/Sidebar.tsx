import './Sidebar.css'
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { Link, useLocation } from "react-router-dom"

const Sidebar:React.FC = () => {
    const location = useLocation();

    const routes: any[] = [
      {
        name: "Dashboard",
        route: "/dashboard",
        icon: "bi bi-bar-chart-fill"
      },
      {
        name: "Analytics",
        route: "/dashboard/analytics",
        icon: "bi bi-bar-chart-fill"
      },
      {
        name: "Team",
        route: "/dashboard/team",
        icon: "bi bi-bar-chart-fill"
      },
      {
        name: "Inbox",
        route: "/dashboard/communication",
        icon: "bi bi-bar-chart-fill"
      },
      {
        name: "Settings",
        route: "/dashboard/settings",
        icon: "bi bi-bar-chart-fill"
      }
    ]
    return (
      <>
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="/dashboard">
          <Row style={{width: "100%"}}>
            <Col>
              <ListGroup className="p-2">
                <h1 className="mb-4">Dashboard</h1>
                {
                  routes.map((route: any) => {
                    return (
                      <ListGroup.Item
                        action
                        as={Link}
                        to={route.route}
                        active={location.pathname === route.route}
                        className="mb-2"
                      >
                        <div className="feature-wrapper">
                          <i className={route.icon}></i>
                          <p>{route.name}</p>
                        </div>
                      </ListGroup.Item>
                    )
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
