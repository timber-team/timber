/* eslint-disable max-len */
import {ErrorMessage, Field, Form, Formik} from 'formik';
import React from 'react';
import {Button, FormGroup, Modal} from 'react-bootstrap';
import * as Yup from 'yup';
import {FormLabel} from 'react-bootstrap';

import {useProjects} from '../api/project';
import {useTags} from '../api/tag';
import {useAuth} from '../store/auth';
import CustomSelect from './CustomSelect';

export const CreateProjectForm = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: (show: boolean) => void;
}) => {
  const {projects, createProject} = useProjects();
  const {tags, getAllTags} = useTags();
  const {currentUser} = useAuth();

  // setShow is passed in from the parent component, and is used to hide the form.
  const handleClose = () => {
    setShow(false);
  };

  // getAllTags is called when the component mounts, and is used to populate the select options.
  React.useEffect(() => {
    if (currentUser) {
      getAllTags();
    }
  }, [show === true]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            name: '',
            description: '',
            image_url: '',
            preferred_skills: [],
            required_skills: [],
          }}
          validationSchema={Yup.object({
            name: Yup.string()
                .max(15, 'Must be 15 characters or less')
                .defined('Required'),
            description: Yup.string()
                .max(85, 'Must be 85 characters or less')
                .defined('Required'),
            image_url: Yup.string()
                .max(50, 'Must be 50 characters or less')
                .notRequired()
                .nullable()
                .url('Must be a valid URL'),
            preferred_skills: Yup.array().required('Required'),
            required_skills: Yup.array().required('Required'),
          })}
          onSubmit={async (values, {setSubmitting}) => {
            await createProject({
              name: values.name,
              description: values.description,
              image_url: values.image_url,
              preferred_skills: values.preferred_skills,
              required_skills: values.required_skills,
            });
            setSubmitting(false);
          }}
        >
          {/* Change all Label tags to FormLabel's */}
          {({isSubmitting}) => (
            <Form>
              <FormGroup>
                {/* <Label>Name</Label> */}
                <FormLabel>Name</FormLabel>
                <Field
                  type="text"
                  name="name"
                  placeholder="Enter project name"
                  className="form-control"
                />
                <ErrorMessage name="name" component="div" />
              </FormGroup>
              <FormGroup>
                {/* <Label>Description</Label> */}
                <FormLabel>Description</FormLabel>
                <Field
                  type="text"
                  name="description"
                  placeholder="Enter project description"
                  className="form-control"
                />
                <ErrorMessage name="description" component="div" />
              </FormGroup>
              <FormGroup>
                {/* <Label>Image URL</Label> */}
                <FormLabel>Image URL</FormLabel>
                <Field
                  type="text"
                  name="image_url"
                  placeholder="Enter image URL"
                  className="form-control"
                />
                <ErrorMessage name="image_url" component="div" />
              </FormGroup>
              <FormGroup>
                {/* <Label>Required Skills</Label> */}
                <FormLabel>Required Skills</FormLabel>
                <Field
                  name="required_skills"
                  placeholder="Select required skills"
                  className="form-control"
                  component={CustomSelect}
                  options={tags.map((tag) => ({
                    label: tag.name,
                    value: tag.id,
                  }))}
                  isMulti={true}
                />
                <ErrorMessage name="required_skills" component="div" />
              </FormGroup>
              <FormGroup>
                {/* <Label>Preferred Skills</Label> */}
                <FormLabel>Preferred Skills</FormLabel>
                <Field
                  name="preferred_skills"
                  placeholder="Select preferred skills"
                  className="form-control"
                  component={CustomSelect}
                  options={tags.map((tag) => ({
                    label: tag.name,
                    value: tag.id,
                  }))}
                  isMulti={true}
                />
                <ErrorMessage name="preferred_skills" component="div" />
              </FormGroup>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};
