import EditProfile from "../components/EditProfile"
import React from "react"
import { Container } from "react-bootstrap"

const styles = {
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const UserSettings = () => {
  return (
    <>
      <Container style={styles}>
        <EditProfile disabled={true}/>
      </Container>
    </>
  )
}

export default UserSettings