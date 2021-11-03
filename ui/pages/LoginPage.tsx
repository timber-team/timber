import LoginForm from "../components/LoginForm"
import React from "react"
import { Container } from "react-bootstrap"

const LoginPage: React.FC = () => {
  return(
    <div>
      <Container>
        <LoginForm />
      </Container>
    </div>
  )
}

export default LoginPage