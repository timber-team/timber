import { Navbar, Nav, Container, Dropdown, Image, Row, Col } from 'react-bootstrap'

const Legal: React.FC = () => {
    return (
        <div>
            <Navbar fixed="bottom" variant="dark" bg="black"
                style={{ color: "#fff8" }}
            >
                <Container
                    style={{ width: "100%" }}
                >
                    <Row>
                        <Col>
                            <Nav>
                                <Nav.Item>
                                    <h1 style={{ color: "#fffc" }}>Timber</h1>
                                    <p>Create and join teams to work on projects.</p>
                                    <p style={{ color: "#fffc" }} >Create beautiful things.</p>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                                Copyright &copy; Timber Ltd.
                        </Col>
                    </Row>
                </Container>
            </Navbar>
        </div>
    )
}

export default Legal