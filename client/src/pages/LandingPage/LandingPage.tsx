import './LandingPage.css'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import Feature from '../../components/Feature/Feature'
import FeatureData from '../../interfaces/FeatureData'
import Price from '../../components/Price/Price'
import PriceData from '../../interfaces/PriceData'
import Contact from '../../components/Contact/Contact'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';

const LandingPage:React.FC = () => {
    const features: FeatureData[] = [
        {
            title: "Calendar",
            reasonOne: "Event Creation: Add, edit, or delete events quickly",
            reasonTwo: "Team Availability: View team schedules for easy planning.",
            reasonThree: "Public & Private Calendars: Manage team and personal calendars.",
            icon: "bi-bar-chart-fill"
        },
        {
            title: "Analytics",
            reasonOne: "Real-Time Dashboards: Instant insights on key performance indicators.",
            reasonTwo: "Custom Reports: Generate tailored analytics.",
            reasonThree: "Data-Driven Decisions: Use data for strategy and higher profits.",
            icon: "bi-calendar-date"
        },
        {
          title: "Invoices and Payroll",
          reasonOne: "Invoices: Create and send detailed bills effortlessly to streamline your billing process.",
          reasonTwo: "Payroll: Manage employee salaries with ease, including tax computations.",
          reasonThree: "Financial Tracking: Oversee all financial activities, from invoices to payroll, in one place.",
          icon: "bi-chat-dots-fill"
        },
        {
            title: "Communication",
            reasonOne: "Chat Rooms: Foster team collaboration with dedicated messaging channels.",
            reasonTwo: "File Sharing: Exchange and access essential documents without hassle.",
            reasonThree: "Notifications: Stay informed with timely alerts on crucial team events.",
            icon: "bi-wallet2"
        }
    ]
    const prices: PriceData[] = [
        {
            price: "250",
            backgroundColor: "#87CEEB"
        },
        {
            price: "500",
            backgroundColor: "#67C9F1"

        },
        {
            price: "1000",
            backgroundColor: "#2EB7EF"
        }
    ]

    return (
        <>
          <Header />
          <Container fluid="md" className="mt-5">
            <Row className="d-flex align-items-center">
              <Col className="d-flex justify-content-center">
                <Image src="./assets/images/peopleWorkingTogether.jpeg" rounded style={{ height: 400 }} />
              </Col>
              <Col  className="d-flex align-items-center justify-content-start" style={{textAlign: 'center', height: 400}}>
                <h2>Unify, Simplify, Amplify: Your Team Management, All in One App.</h2>
              </Col>
            </Row>
          </Container>
          <Container fluid="md">
            <h2 className="text-center my-4" id="features">Features</h2>
            <Row className="justify-content-center d-flex">
                {
                  features.map((feature: FeatureData, i: number) => {
                    return (
                      <Col xs={8} sm={6} md={5} lg={5} className="mb-5 d-flex" key={i}>
                        <Feature
                          title={feature.title}
                          reasonOne={feature.reasonOne}
                          reasonTwo={feature.reasonTwo}
                          reasonThree={feature.reasonThree}
                          icon={feature.icon}
                        />
                      </Col>
                    )
                  })
                }
            </Row>
          </Container>
          <Container fluid="md">
            <h2 className="text-center mb-4" id="prices">Pricing</h2>
            <Row className="justify-content-center align-items-center g-0">
              {
                prices.map((currentPrice:PriceData, i:number) => {
                  return (
                    <Col xs={8}
                      sm={8}
                      md={3}
                      lg={3}
                      className="mb-5 d-flex" key={i}>
                      <Price
                        price={currentPrice.price}
                        backgroundColor={currentPrice.backgroundColor}
                        key={i}
                      />
                    </Col>
                  )
                })
              }
            </Row>
          </Container>
          <Container fluid="md">
            <h2 className="text-center" id="contact">Contact us</h2>
            <Contact />
          </Container>
          <Footer />
        </>
    )
}

export default LandingPage
