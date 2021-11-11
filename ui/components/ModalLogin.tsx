import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { Button, Modal} from "react-bootstrap"
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons"

const style = {margin: 4, width: "100%"}

const ModalLogin = () => {
  return (
    <Modal show={true} aria-labelledby="contained-modal-title-vcenter" centered >
      <Modal.Header>
        <Modal.Title>Please Register/Login</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{display: "flex", flexDirection: "column"}}>
        <a href="/api/auth/signin/google">
          <Button variant="primary" style={style} >
            <FontAwesomeIcon icon={faGoogle} /> Google
          </Button>
        </a>
        <a href="/api/auth/signin/github">
          <Button variant="primary" style={style} >
            <FontAwesomeIcon icon={faGithub} /> Github
          </Button>
        </a>
      </Modal.Body>
    </Modal>
  )
}

export default ModalLogin