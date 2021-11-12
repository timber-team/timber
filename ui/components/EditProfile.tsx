/* eslint-disable max-len */
import {Field, Form, Formik} from 'formik';
import React, {useEffect} from 'react';
import {Button, FormGroup, FormLabel} from 'react-bootstrap';
import * as Yup from 'yup';

import {useTags} from '../api/tag';
import {Tag, User} from '../api/types';
import {useUser} from '../api/user';
import {useAuth} from '../store/auth';
import CustomSelect from './CustomSelect';

interface customProps {
  disabled?: boolean;
}

const stylesButton = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '1rem',
};

const EditProfile = (props: customProps) => {
  const currentUser = useAuth((state) => state.currentUser);
  const getUser = useAuth((state) => state.getUser);
  const {tags, loading, error: tagError, getAllTags} = useTags();
  const {patchUser, getUserById, error: userError} = useUser();
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);

  useEffect(() => {
    if (currentUser) {
      getUserById(currentUser.id).then((user) => {
        if (user) {
          setUser(user);
        }
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (user) {
      getAllTags();
    }
  }, [user]);

  const handleSubmit = async (values: Partial<User>) => {
    setIsLoading(true);
    try {
      await patchUser({
        id: user?.id,
        username: values.username,
        description: values.description,
        avatar_url: values.avatar_url,
        tags: values.tags,
      });
      setSuccess('Profile updated successfully');
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  if (loading || !currentUser || isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <Formik
      initialValues={{
        avatar_url: user?.avatar_url || '',
        username: user?.username || '',
        description: user?.description || '',
        tags: user?.tags || [],
      }}
      validationSchema={Yup.object({
        avatar_url: Yup.string()
            .max(250, 'Must be 250 characters or less')
            .notRequired()
            .nullable()
            .url('Must be a valid URL'),
        username: Yup.string().required('Username is required'),
        tags: Yup.array().required('Tags are required'),
      })}
      onSubmit={(values, {setSubmitting}) => {
        handleSubmit(values);
        getUser(true);
        setSubmitting(false);
      }}
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
        <Form
          onSubmit={handleSubmit}
          style={{minWidth: '400px', width: '50%', margin: 'auto'}}
        >
          <FormGroup
            controlId="avatarURL"
            style={{display: 'flex', flexDirection: 'column'}}
          >
            <FormLabel>Avatar URL</FormLabel>
            <Field
              // Style like FormText
              style={{
                border: 'none',
                borderBottom: '1px solid #ced4da',
                padding: '0.375rem 0.75rem',
                fontSize: '1rem',
                lineHeight: '1.5',
                color: '#495057',
                backgroundColor: '#fff',
                backgroundImage: 'none',
                backgroundClip: 'padding-box',
                borderRadius: '0',
              }}
              type="text"
              name="avatar_url"
              placeholder="Avatar URL"
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.avatar_url && errors.avatar_url ? 'error' : ''}
            />
            {touched.avatar_url && errors.avatar_url && (
              <div className="input-feedback">{errors.avatar_url}</div>
            )}
          </FormGroup>
          <br />
          <FormGroup
            controlId="username"
            style={{display: 'flex', flexDirection: 'column'}}
          >
            <FormLabel>Username</FormLabel>
            <Field
              style={{
                border: 'none',
                borderBottom: '1px solid #ced4da',
                padding: '0.375rem 0.75rem',
                fontSize: '1rem',
                lineHeight: '1.5',
                color: '#495057',
                backgroundColor: '#fff',
                backgroundImage: 'none',
                backgroundClip: 'padding-box',
                borderRadius: '0',
              }}
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.username && errors.username ? 'error' : ''}
            />
            {touched.username && errors.username && (
              <div className="input-feedback">{errors.username}</div>
            )}
          </FormGroup>
          <br />
          <FormGroup
            controlId="description"
            style={{display: 'flex', flexDirection: 'column'}}
          >
            <FormLabel>Description</FormLabel>
            <Field
              style={{
                border: 'none',
                borderBottom: '1px solid #ced4da',
                padding: '0.375rem 0.75rem',
                fontSize: '0.8rem',
                lineHeight: '1.1',
                color: '#495057',
                backgroundColor: '#fff',
                backgroundImage: 'none',
                backgroundClip: 'padding-box',
                borderRadius: '0',
              }}
              type="text"
              as="textarea"
              name="description"
              placeholder="Description"
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.description && errors.description ? 'error' : ''}
            />
            {touched.description && errors.description && (
              <div className="input-feedback">{errors.description}</div>
            )}
          </FormGroup>
          <br />
          <FormGroup
            controlId="tags"
            style={{display: 'flex', flexDirection: 'column'}}
          >
            <FormLabel>Tags</FormLabel>
            <Field
              name="tags"
              placeholder="Tags"
              component={CustomSelect}
              options={tags.map((tag: Tag) => ({
                label: tag.name,
                value: tag.id,
                selected: values.tags?.find(
                    (skill: Tag) => skill?.id === tag.id,
                ) ?
                  true :
                  false,
              }))}
              isMulti={true}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.tags && errors.tags ? 'error' : ''}
            />
            {touched.tags && errors.tags && (
              <div className="input-feedback">{errors.tags}</div>
            )}
          </FormGroup>
          <div style={stylesButton}>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                setUser(null);
                setSuccess(null);
                setError(null);
                window.location.reload();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="secondary"
              disabled={isSubmitting}
              style={{marginRight: '10px'}}
            >
              Submit
            </Button>
          </div>
          {error && <div>{error}</div>}
          {success && <div>{success}</div>}
        </Form>
      )}
    </Formik>
  );
};

export default EditProfile;
