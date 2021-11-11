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

const EditProfile = (props: customProps) => {
  const currentUser = useAuth((state) => state.currentUser);
  const { tags, loading, error, getAllTags } = useTags();
  const { patchUser } = useUser();

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
          label="Avatar name"
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
          className="form-select"
          name="technologies"
          options={technologyOptions}
          component={CustomSelect}
          placeholder="Select from multiple technologies"
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

  export default EditProfile