import React, { useEffect, useState } from "react";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import CustomSelect from "./CustomSelect";
import FormText from "./FormText";
import { Button } from "react-bootstrap";
import { useTags } from "../api/tag";

export interface FormValues {
  avatarURL: string;
  name: string;
  username: string;
  technologies: string[];
}

interface customProps {
  disabled?: boolean;
}

const defaultValues: FormValues = {
  avatarURL: "",
  name: "",
  username: "",
  technologies: []
};

const stylesButton = {
  display: 'flex',
  justifyContent: 'space-around',
  marginTop: 12
}

const EditProfile = (props: customProps) => {
  const {tags, loading, error, getAllTags} = useTags();

  useEffect(() => {
    getAllTags();
  }, []);

  const selectable = tags.map((e) => {return({label: e.name, value: e.id})})

  console.log(useTags())

  const onSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
    alert(JSON.stringify(values, null, 2));
    actions.setSubmitting(false);
  };

  if (error) {
    return <div>Error!</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

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
        disabled={props.disabled}
      />
      <Field
        name="username"
        component={FormText}
        label="Username"
        type="text"
        placeholder="Please choose an alias"
        description="Enter your username"
        muted={true}
        disabled={props.disabled}
      />
      <Field
        className=""
        name="technologies"
        options={selectable}
        component={CustomSelect}
        label="Select Technologies"
        placeholder="Select from multiple technologies"
        description="Please select technologies that you prefer to work with"
        isMulti={true}
      />
      <div style={stylesButton}>
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
      </div>
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