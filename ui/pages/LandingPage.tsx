import '../style/custom.scss'

import Legal from '../components/Legal'
import Nav from '../components/Nav'
import Stack from '../components/Stack'

const LandingPage: React.FC = () => {
    return (
    <div>
        <Nav />
        <main style={{ minHeight: "100%" }}>
            <Stack />
        </main>
        <Legal />
    </div>
    )
}

export default LandingPage