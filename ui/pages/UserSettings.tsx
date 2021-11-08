import EditProfile from "../components/EditProfile"
import React from "react"
import { Container } from "react-bootstrap"

const styles = {
  minHeight: '75vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const UserSettings = () => {
  return (
    <>
      <Container style={styles}>
        <EditProfile />
      </Container>
    </>
  )
}

export default UserSettings