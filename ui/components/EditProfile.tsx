/* eslint-disable max-len */
import {Tag} from 'api/types';
import {Field, Form, Formik, FormikHelpers, FormikProps} from 'formik';
import React, {useEffect} from 'react';
import {Button} from 'react-bootstrap';
import * as Yup from 'yup';

import {useTags} from '../api/tag';
import {useUser} from '../api/user';
import {useAuth} from '../store/auth';
import CustomSelect from './CustomSelect';
import FormText from './FormText';

export interface FormValues {
  avatarURL: string;
  username: string;
  tags: string[];
}

interface customProps {
  disabled?: boolean;
}

const stylesButton = {
  display: 'flex',
  justifyContent: 'space-around',
  marginTop: 12,
};

const EditProfile = (props: customProps) => {
  const currentUser = useAuth((state) => state.currentUser);
  const {tags, loading, error, getAllTags} = useTags();
  const {patchUser} = useUser();

  useEffect(() => {
    if (currentUser) {
      getAllTags();
    }
  }, [currentUser]);

  const defaultValues: FormValues = {
    avatarURL: '',
    username: currentUser!.username ? currentUser!.username : '',
    tags: [],
  };

  const selectable = tags.map((e) => {
    return {label: e.name, value: e.id};
  });

  console.log(useTags());

  const onSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    console.log(values.tags)
    const t: Tag[] = values.tags.map(e => JSON.parse(e))
    await patchUser({
      username: values.username,
      avatar_url: values.avatarURL,
      tags: t,
    });
    actions.setSubmitting(false);
    window.location.reload();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error!</div>;
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
        placeholder={currentUser!.username ? currentUser!.username : "Please enter an alias"}
        description="Enter your username"
        muted={true}
        disabledForm={props.disabled}
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
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </div>
    </Form>
  );

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={Yup.object({
        avatarURL: Yup.string()
            .notRequired()
            .nullable()
            .url('Must be a valid URL'),
        username: Yup.string()
            .max(15, 'Must be 15 characters or less')
            .defined('Required'),
        tags: Yup.array().defined('Required'),
      })}
      render={renderForm}
      onSubmit={onSubmit}
    />
  );
};

export default EditProfile;
