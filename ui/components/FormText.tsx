import React from "react"
import Form from "react-bootstrap/esm/Form"

interface CustomSelectProps {
  label: string;
  type: string;
  placeholder: string;
  description?: string;
  name: string;
  muted?: boolean;
  className?: string;
}

const FormText = (props: CustomSelectProps) => {
  return (
    <Form.Group className={props.className} controlId={props.name}>
      <Form.Label>{props.label}</Form.Label>
      <Form.Control type={props.type} placeholder={props.placeholder} />
      <Form.Text className={props.muted ? "text-muted" : ""}>
        {props.description}
      </Form.Text>
    </Form.Group>
  )
}

export default FormText