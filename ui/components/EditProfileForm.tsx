/* eslint-disable max-len */
import {Field, Form, Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  Container,
  FormGroup,
  FormLabel,
  Modal,
} from 'react-bootstrap';
import {useMutation} from 'react-query';
import * as Yup from 'yup';

import {getAllTags} from '../api/tag';
import {Tag, User} from '../api/types';
import {updateUser} from '../api/user';
import {useAuth} from '../store/auth';
import CustomSelect from './CustomSelect';

type EditProfileFormProps = {
  type: 'modal' | undefined;
};

const EditProfileForm: React.FC<EditProfileFormProps> = ({type}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const {
    currentUser,
    accessToken,
    isLoading: getUserLoading,
    getUser,
  } = useAuth();
  const [error, setError] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<Tag[]>([]);

  // get current user from useAuth state
  useEffect(() => {
    getUser(false);
  }, []);

  // get all tags from api
  useEffect(() => {
    setLoading(true);
    if (accessToken) {
      getAllTags(accessToken).then((res) => {
        setTags(res);
      });
    }
  }, [accessToken]);

  useEffect(() => {
    if (tags.length > 0) {
      setLoading(false);
    }
  }, [tags]);

  const userTags = currentUser?.tags;
  const {
    isLoading: isLoadingUserUpdate,
    mutate: mutateUserUpdate,
    status,
  } = useMutation(
      (user: Partial<User>) => updateUser(user, accessToken),
      {
        onSuccess: (res) => {
          getUser(true);
        },
        onError: (err) => {
          setError(err.message);
        },
      },
      {
        enabled: accessToken !== undefined,
      },
  );

  const handleSubmit = (values: Partial<User>) => {
    mutateUserUpdate({
      ...values,
    });
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
        .max(20, 'Username must be 20 characters or less')
        .required('Username is required'),
    avatar_url: Yup.string()
        .max(250, 'Must be 250 characters or less')
        .notRequired()
        .nullable()
        .url('Must be a valid URL'),
    description: Yup.string()
        .max(2000, 'Must be 2000 characters or less')
        .required('Description is required'),
    tags: Yup.array().of(Yup.number()).min(1, 'Must have at least 1 skill tag'),
  });

  if (
    getUserLoading ||
    isLoadingUserUpdate ||
    loading ||
    status === 'loading' ||
    !currentUser
  ) {
    return <div>Loading...</div>;
  }

  const initialValues = {
    username: currentUser?.username || '',
    avatar_url: currentUser?.avatar_url || '',
    description: currentUser?.description || '',
    tags: userTags || [],
  };

  const form = (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({
        isSubmitting,
        isValid,
        errors,
        touched,
        handleChange,
        handleBlur,
      }) => (
        <Form>
          <FormGroup>
            <FormLabel>Username</FormLabel>
            <Field
              type="text"
              name="username"
              placeholder="Username"
              className={`form-control ${
                errors.username && touched.username && 'is-invalid'
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.username && touched.username && (
              <Alert variant="danger">{errors.username}</Alert>
            )}
          </FormGroup>
          <FormGroup>
            <FormLabel>Avatar URL</FormLabel>
            <Field
              type="text"
              name="avatar_url"
              placeholder="Avatar URL"
              className={`form-control ${
                errors.avatar_url && touched.avatar_url && 'is-invalid'
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.avatar_url && touched.avatar_url && (
              <Alert variant="danger">{errors.avatar_url}</Alert>
            )}
          </FormGroup>
          <FormGroup>
            <FormLabel>Description</FormLabel>
            <Field
              type="text"
              as="textarea"
              rows={5}
              name="description"
              placeholder="Description"
              className={`form-control ${
                errors.description && touched.description && 'is-invalid'
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.description && touched.description && (
              <Alert variant="danger">{errors.description}</Alert>
            )}
          </FormGroup>
          <FormGroup>
            <FormLabel>Skills</FormLabel>
            <Field
              name="tags"
              placeholder="Skills"
              component={CustomSelect}
              options={tags.map((tag: Tag) => ({
                value: tag.id,
                label: tag.name,
                selected: initialValues.tags.find(
                    (skill: Tag) => skill.id === tag.id,
                ) ?
                  true :
                  false,
              }))}
              isMulti={true}
              className={`form-control ${
                errors.tags && touched.tags && 'is-invalid'
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.tags && touched.tags && (
              <Alert variant="danger">{errors.tags}</Alert>
            )}
          </FormGroup>
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="mt-3"
          >
            Update Profile
          </Button>
        </Form>
      )}
    </Formik>
  );

  if (type === 'modal') {
    return (
      <Modal show={true} centered>
        <Modal.Header>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {form}
          {error && <Alert variant="danger">{error}</Alert>}
        </Modal.Body>
      </Modal>
    );
  } else {
    return (
      <Container>
        <h2 style={{padding: '50px 50px 30px 50px', textAlign: 'center'}}>
          Settings
        </h2>
        {form}
        {error && <Alert variant="danger">{error}</Alert>}
      </Container>
    );
  }
};

export default EditProfileForm;
