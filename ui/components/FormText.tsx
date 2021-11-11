import { ErrorMessage, FieldProps } from "formik"
import React from "react"
import Form from "react-bootstrap/esm/Form"

interface CustomSelectProps extends FieldProps {
  label: string;
  formType: string;
  placeholder: string;
  description?: string;
  muted?: boolean;
  className?: string;
  disabledForm?: boolean;
}

const FormText = ({
  className,
  placeholder,
  field,
  formType,
  form,
  label,
  muted,
  description,
  disabledForm
}: CustomSelectProps) => {
  const onChange = (e: any) => {
    form.setFieldValue(
      field.name, 
        e.target.value
      )
  };

  return (
    <Form.Group className={className}>
      <Form.Label>{label}</Form.Label>
      <Form.Control type={formType} placeholder={placeholder} onChange={onChange} disabled={disabledForm}/>
      <ErrorMessage name={field.name} component="div" />
      <Form.Text className={muted ? "text-muted" : ""}>
        {description}
      </Form.Text>
    </Form.Group>
  )
}

export default FormText