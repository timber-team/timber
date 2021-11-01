import '../style/custom.scss'

import Legal from '../components/Legal'
import Nav from '../components/Nav'

const LandingPage: React.FC = () => {
    return (
    <div>
        <Nav />
        <main style={{ minHeight: "100%" }}>

        </main>
        <Legal />
    </div>
    )
}

export default LandingPage