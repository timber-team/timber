import React, { useEffect } from "react";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import CustomSelect from "./CustomSelect";
import FormText from "./FormText";
import { Button } from "react-bootstrap";
import { useTags } from "../api/tag";
import { useUser } from "../api/user";
import { Tag } from "api/types";
import { useAuth } from "../store/auth";
import * as Yup from 'yup';

export interface FormValues {
  avatarURL: string;
  username: string;
  tags: Tag[];
}

interface customProps {
  disabled?: boolean;
}

const defaultValues: FormValues = {
  avatarURL: "",
  username: "",
  tags: []
};

const stylesButton = {
  display: 'flex',
  justifyContent: 'space-around',
  marginTop: 12
}

const EditProfile = (props: customProps) => {
  const currentUser = useAuth((state) => state.currentUser);
  const {tags, loading, error, getAllTags} = useTags();
  const {patchUser} = useUser();

  useEffect(() => {
    getAllTags();
  }, []);

  const selectable = tags.map((e) => {return({label: e.name, value: e.id})})

  console.log(useTags())

  const onSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    const u = currentUser!.username ? currentUser!.username : values.username
    await patchUser({
      username: u,
      avatar_url: values.avatarURL,
      tags: values.tags
    })
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
        name="tags"
        options={selectable}
        component={CustomSelect}
        label="Select Technologies"
        placeholder="Select from multiple tags"
        description="Please select tags that you prefer to work with"
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
      validationSchema={Yup.object({
        avatarURL: Yup.string()
            .max(50, 'Must be 50 characters or less')
            .notRequired()
            .nullable()
            .url('Must be a valid URL'),
        username: Yup.string()
            .max(15, 'Must be 15 characters or less')
            .defined(currentUser?.username ? '' : 'Required'),
        tags: Yup.array()
            .defined('Required'),
      })}
      render={renderForm}
      onSubmit={onSubmit}
    />
  );
};

export default EditProfile