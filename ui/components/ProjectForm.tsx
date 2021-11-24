import {Field, Form, Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {Alert, Button, FormGroup, FormLabel, Modal} from 'react-bootstrap';
import {useMutation} from 'react-query';
import * as Yup from 'yup';

import {createProject, updateProject} from '../api/project';
import {getAllTags} from '../api/tag';
import {Project, Tag} from '../api/types';
import {useAuth} from '../store/auth';
import CustomSelect from './CustomSelect';

interface ProjectFormProps {
  initialItem?: Project;
  btnSize?: 'sm' | 'lg';
}

const ProjectForm: React.FC<ProjectFormProps> = ({initialItem, btnSize}) => {
  const [showModal, setShowModal] = useState(false);
  const {currentUser, accessToken} = useAuth();
  const [error, setError] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (accessToken) {
      getAllTags(accessToken).then((tags) => {
        setTags(tags);
      });
    }
  }, [accessToken]);

  const {
    isLoading: isCreating,
    isError: isErrorCreating,
    data: dataCreating,
    error: errorCreating,
    mutate: createProjectMutate,
  } = useMutation(
      (project: Partial<Project>) => createProject(project, accessToken || ''),
      {
        onSuccess: (project: Project) => {
          console.log('Successfully created project', project);
          setError(undefined);
          setShowModal(false);
        },
        onError: (error: Error) => {
          console.log('Error creating project', error);
          setError(error.message);
        },
      },
  );

  const {
    isLoading: isUpdating,
    isError: isErrorUpdating,
    data: dataUpdating,
    error: errorUpdating,
    mutate: updateProjectMutate,
  } = useMutation(
      (project: Partial<Project>) => updateProject(project, accessToken || ''),
      {
        onSuccess: (project: Project) => {
          console.log('Successfully updated project', project);
          setError(undefined);
          setShowModal(false);
        },
        onError: (error: Error) => {
          console.log('Error updating project', error);
          setError(error.message);
        },
      },
  );

  const handleSubmit = async (project: Partial<Project>, formikBag: any) => {
    try {
      if (initialItem) {
        await updateProjectMutate(project);
      } else {
        await createProjectMutate(project);
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      formikBag.setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
        .max(50, 'Must be 50 characters or less')
        .required('Name is required'),
    description: Yup.string()
        .max(2000, 'Must be 2000 characters or less')
        .required('Description is required'),
    image_url: Yup.string()
        .max(250, 'Must be 250 characters or less')
        .notRequired()
        .nullable()
        .url('Must be a valid URL'),
    required_skills: Yup.array()
        .of(Yup.number())
        .min(1, 'Must have at least 1 required skill'),
    preferred_skills: Yup.array()
        .of(Yup.number())
        .min(1, 'Must select at least 1 preferred skill'),
  });

  const initialValues = {
    name: initialItem?.name || '',
    description: initialItem?.description || '',
    image_url: initialItem?.image_url || '',
    owner_id: initialItem?.owner_id || currentUser?.id,
    required_skills: initialItem?.required_skills || [],
    preferred_skills: initialItem?.preferred_skills || [],
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleShow = () => {
    setShowModal(true);
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} size={btnSize}>
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
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({
              errors,
              touched,
              handleChange,
              handleBlur,
              isSubmitting,
              isValid,
            }) => (
              <Form>
                <FormGroup>
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
                    <Alert variant="danger" className="mt-2 sm" role="alert">
                      {errors.name}
                    </Alert>
                  )}
                </FormGroup>
                <FormGroup>
                  <FormLabel>Description</FormLabel>
                  <Field
                    type="textbox"
                    rows={5}
                    name="description"
                    placeholder="Enter project description"
                    className={`form-control ${
                      errors.description && touched.description && 'is-invalid'
                    }`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.description && touched.description && (
                    <Alert variant="danger" className="mt-2 sm" role="alert">
                      {errors.description}
                    </Alert>
                  )}
                </FormGroup>
                <FormGroup>
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
                    <Alert variant="danger" className="mt-2 sm" role="alert">
                      {errors.image_url}
                    </Alert>
                  )}
                </FormGroup>
                <FormGroup>
                  <FormLabel>Required Skills</FormLabel>
                  <Field
                    name="required_skills"
                    placeholder="Select required skills"
                    component={CustomSelect}
                    options={tags.map((tag: Tag) => ({
                      value: tag.id,
                      label: tag.name,
                      selected: initialValues.required_skills.find(
                          (skill: Tag) => skill.id === tag.id,
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
                    <Alert variant="danger" className="mt-2 sm" role="alert">
                      {errors.required_skills}
                    </Alert>
                  )}
                </FormGroup>
                <FormGroup>
                  <FormLabel>Preferred Skills</FormLabel>
                  <Field
                    name="preferred_skills"
                    placeholder="Select preferred skills"
                    component={CustomSelect}
                    options={tags.map((tag: Tag) => ({
                      value: tag.id,
                      label: tag.name,
                      selected: initialValues.preferred_skills.find(
                          (skill: Tag) => skill.id === tag.id,
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
                    <Alert variant="danger" className="mt-2 sm" role="alert">
                      {errors.preferred_skills}
                    </Alert>
                  )}
                </FormGroup>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="mt-3"
                >
                  {initialItem ? 'Edit Project' : 'Create Project'}
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
      {error && <Alert variant="danger">{error}</Alert>}
    </>
  );
};

export default ProjectForm;
