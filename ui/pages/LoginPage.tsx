import EditProfile from "../components/EditProfile"
import React from "react"
import { Container } from "react-bootstrap"
import ModalLogin from "../components/ModalLogin"

const LoginPage: React.FC = () => {
  return(
    <div>
      <Container>
        <ModalLogin />
        <EditProfile />
      </Container>
    </div>
  )
}

export default LoginPage