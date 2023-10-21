import './LandingPage.css'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import Feature from '../../components/Feature/Feature'
import FeatureData from '../../interfaces/FeatureData'
import Price from '../../components/Price/Price'
import PriceData from '../../interfaces/PriceData'
import Contact from '../../components/Contact/Contact'

const LandingPage:React.FC = () => {
    const features: FeatureData[] = [
        {
            imgSource: "./assets/images/calendarImage.jpg",
            title: "Calendar",
            reasonOne: "Event Creation: Add, edit, or delete events quickly",
            reasonTwo: "Team Availability: View team schedules for easy planning.",
            reasonThree: "Public & Private Calendars: Manage team and personal calendars.",
            alt: "Calendar"
        },
        {
            imgSource: "./assets/images/analyticsImage.png",
            title: "Analytics",
            reasonOne: "Real-Time Dashboards: Instant insights on key performance indicators.",
            reasonTwo: "Custom Reports: Generate and share tailored analytics.",
            reasonThree: "Data-Driven Decisions: Use data for smarter strategy and higher profits.",
            alt: "Image of Analytics page"
        },
        {
            imgSource: "./assets/images/invoicePicture.jpeg",
            title: "Invoices and Payroll",
            reasonOne: "Invoices: Generate and send bills effortlessly.",
            reasonTwo: "Payroll: Simplify employee payments and taxes.",
            reasonThree: "Financial Tracking: Monitor invoices and payroll in one place.",
            alt: "Clipboard"
        },
        {
            imgSource: "./assets/images/communicationImage.jpeg",
            title: "Communication",
            reasonOne: "Chat Rooms: Instant team messaging.",
            reasonTwo: "File Sharing: Easy document exchange.",
            reasonThree: "Notifications: Real-time updates and alerts.",
            alt: "Microphone for communication"
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
            <div className="landing-intro">
                <img src="./assets/images/peopleWorkingTogether.jpeg" alt="People working together"/>
                <p>Unify, Simplify, Amplify: Your Team Management, All in One App.</p>
            </div>
            <div id="features" className="features">
                <h2>Features</h2>
                <div>
                    {
                        features.map((feature:FeatureData, i:number) => {
                            return <Feature
                                imgSource={feature.imgSource}
                                title={feature.title}
                                reasonOne={feature.reasonOne}
                                reasonTwo={feature.reasonTwo}
                                reasonThree={feature.reasonThree}
                                alt={feature.alt}
                                key={i}
                            />
                        })
                    }
                </div>
            </div>
            <div id="prices" className="prices">
                <h2>Pricing</h2>
                <div>
                    {
                        prices.map((currentPrice:PriceData, i:number) => {
                            return <Price
                                price={currentPrice.price}
                                backgroundColor={currentPrice.backgroundColor}
                                key={i}
                            />
                        })
                    }
                </div>
            </div>
            <div id="contact" className="contact">
                <h2>Contact us</h2>
                <Contact />
            </div>
            <Footer />
        </>
    )
}

export default LandingPage
