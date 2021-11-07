import React from "react";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import CustomSelect from "./CustomSelect";
import FormText from "./FormText";
import { Button } from "react-bootstrap";

export interface FormValues {
  avatarURL: string;
  name: string;
  username: string;
  technologies: string[];
}

const defaultValues: FormValues = {
  avatarURL: "",
  name: "",
  username: "",
  technologies: []
};

const technologyOptions = [
  {
    label: "Golang",
    value: "1"
  },
  {
    label: "Python",
    value: "2"
  },
  {
    label: "Javascript",
    value: "3"
  }
];

const EditProfile = () => {
  const onSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
    alert(JSON.stringify(values, null, 2));
    actions.setSubmitting(false);
  };

  const renderForm = (formikBag: FormikProps<FormValues>) => (
    <Form>
      <Field
        name="avatarURL"
        component={FormText}
        label="Avatar URL"
        type="text"
        placeholder="Avatar URL"
        description="Please enter your avatar URL, you can use a website like imgur to host it"
        muted={true}
      />
      <Field
        name="name"
        component={FormText}
        label="Name"
        type="text"
        placeholder="First and Second Name"
        description="Enter your name"
        muted={true}
      />
      <Field
        name="username"
        component={FormText}
        label="Username"
        type="text"
        placeholder="Please choose an alias"
        description="Enter your username"
        muted={true}
      />
      <Field
        className=""
        name="technologies"
        options={technologyOptions}
        component={CustomSelect}
        label="Select Technologies"
        placeholder="Select from multiple technologies"
        description="Please select technologies that you prefer to work with"
        isMulti={true}
      />
      <Button
        variant="primary"
        type="button"
        className="outline"
        onClick={formikBag.handleReset}
        disabled={!formikBag.dirty || formikBag.isSubmitting}
      >
        Reset
      </Button>
      <Button variant="primary" type="submit">Submit</Button>
    </Form>
  );

  return (
    <Formik
      initialValues={defaultValues}
      render={renderForm}
      onSubmit={onSubmit}
    />
  );
};

export default EditProfile