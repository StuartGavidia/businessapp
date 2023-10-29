import './Sidebar.css'
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { Link, useLocation } from "react-router-dom"

interface NavRoute {
  name: string,
  route: string,
  icon: string
}

const Sidebar:React.FC = () => {
    const location = useLocation();

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
        name: "Settings",
        route: "/dashboard/settings",
        icon: "bi bi-gear"
      }
    ]
    return (
      <>
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="/dashboard">
          <Row className="sidebar-tabs-wrapper">
            <Col>
              <ListGroup className="p-2">
                <h1 className="mb-4">ABC</h1>
                {
                  routes.map((route: NavRoute) => {
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
