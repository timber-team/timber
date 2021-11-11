/* eslint-disable camelcase */
/* eslint-disable max-len */
import {Field, Form, Formik} from 'formik';
import React from 'react';
import {Alert, Button, FormGroup, FormLabel, Modal} from 'react-bootstrap';
import * as Yup from 'yup';

import {useProjects} from '../api/project';
import {useTags} from '../api/tag';
import {Project, Tag} from '../api/types';
import {useAuth} from '../store/auth';
import CustomSelect from './CustomSelect';

type ProjectFormProps = {
  initialItem?: Project;
};

const ProjectForm: React.FC<ProjectFormProps> = ({initialItem}) => {
  const [showModal, setShowModal] = React.useState(false);
  const {currentUser} = useAuth();
  const {
    projects,
    loading: projectLoading,
    error: projectError,
    createProject,
    updateProject,
  } = useProjects();
  const {tags, getAllTags} = useTags();
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (currentUser) {
      getAllTags();
    }
  }, [currentUser && showModal == true]);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleShow = () => {
    setShowModal(true);
  };

  const handleSubmit = async (values: Partial<Project>) => {
    setShowModal(false);
    setIsLoading(true);
    try {
      if (initialItem) {
        await updateProject({
          id: initialItem.id,
          name: values.name,
          description: values.description,
          image_url: values.image_url,
          preferred_skills: values.preferred_skills,
          required_skills: values.required_skills,
        });
        setSuccess('Project updated successfully');
      } else {
        await createProject({
          name: values.name,
          description: values.description,
          image_url: values.image_url,
          preferred_skills: values.preferred_skills,
          required_skills: values.required_skills,
        });
        setSuccess('Project created successfully');
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        {initialItem ? 'Edit Project' : 'Create Project'}
      </Button>
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {initialItem ? 'Edit Project' : 'Create Project'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              name: initialItem?.name || '',
              description: initialItem?.description || '',
              image_url: initialItem?.image_url || '',
              preferred_skills: initialItem?.preferred_skills || [],
              required_skills: initialItem?.required_skills || [],
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
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <Form>
                <FormGroup controlId="name">
                  <FormLabel>Name</FormLabel>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Enter project name"
                    className={`form-control ${
                      errors.name && touched.name && 'is-invalid'
                    }`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.name && touched.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </FormGroup>
                <FormGroup controlId="description">
                  <FormLabel>Description</FormLabel>
                  <Field
                    type="textbox"
                    rows={3}
                    name="description"
                    placeholder="Enter project description"
                    className={`form-control ${
                      errors.description && touched.description && 'is-invalid'
                    }`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.description && touched.description && (
                    <div className="invalid-feedback">{errors.description}</div>
                  )}
                </FormGroup>
                <FormGroup controlId="image_url">
                  <FormLabel>Image URL</FormLabel>
                  <Field
                    type="text"
                    name="image_url"
                    placeholder="Enter project image URL"
                    className={`form-control ${
                      errors.image_url && touched.image_url && 'is-invalid'
                    }`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.image_url && touched.image_url && (
                    <div className="invalid-feedback">{errors.image_url}</div>
                  )}
                </FormGroup>
                <FormGroup controlId="preferred_skills">
                  <FormLabel>Preferred Skills</FormLabel>
                  <Field
                    name="preferred_skills"
                    placeholder="Enter preferred skills"
                    component={CustomSelect}
                    options={tags.map((tag: Tag) => ({
                      label: tag.name,
                      value: tag.id,
                      selected: values.preferred_skills?.find(
                          (skill: Tag) => skill?.id === tag.id,
                      ) ?
                        true :
                        false,
                    }))}
                    isMulti={true}
                    className={`form-control ${
                      errors.preferred_skills &&
                      touched.preferred_skills &&
                      'is-invalid'
                    }`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.preferred_skills && touched.preferred_skills && (
                    <div className="invalid-feedback">
                      {errors.preferred_skills}
                    </div>
                  )}
                </FormGroup>
                <FormGroup controlId="required_skills">
                  <FormLabel>Required Skills</FormLabel>
                  <Field
                    name="required_skills"
                    placeholder="Enter required skills"
                    component={CustomSelect}
                    options={tags.map((tag) => ({
                      label: tag.name,
                      value: tag.id,
                      selected: values.required_skills?.find(
                          (skill: Tag) => skill?.id === tag.id,
                      ) ?
                        true :
                        false,
                    }))}
                    isMulti={true}
                    className={`form-control ${
                      errors.required_skills &&
                      touched.required_skills &&
                      'is-invalid'
                    }`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.required_skills && touched.required_skills && (
                    <div className="invalid-feedback">
                      {errors.required_skills}
                    </div>
                  )}
                </FormGroup>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-3"
                >
                  {isSubmitting ? 'Loading...' : 'Submit'}
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
      {success && (
        <Alert variant="success" onClose={() => setSuccess('')} dismissible>
          {success}
        </Alert>
      )}
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}
    </>
  );
};

export default ProjectForm;
