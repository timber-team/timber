import React from "react";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import CustomSelect from "./CustomSelect";

export interface FormValues {
  singleLanguage: string;
  multiLanguages: string[];
}

const defaultValues: FormValues = {
  singleLanguage: "",
  multiLanguages: []
};

const languageOptions = [
  {
    label: "Chinese",
    value: "zh-CN"
  },
  {
    label: "English (US)",
    value: "en-US"
  },
  {
    label: "English (GB)",
    value: "en-GB"
  },
  {
    label: "French",
    value: "fr-FR"
  },
  {
    label: "Spanish",
    value: "es-ES"
  }
];

const LoginForm = () => {
  const onSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
    alert(JSON.stringify(values, null, 2));
    actions.setSubmitting(false);
  };

  const renderForm = (formikBag: FormikProps<FormValues>) => (
    <Form>
      <Field
        className="custom-select"
        name="singleLanguage"
        options={languageOptions}
        component={CustomSelect}
        placeholder="Select a language..."
        isMulti={false}
      />
      <Field
        className="custom-select"
        name="multiLanguages"
        options={languageOptions}
        component={CustomSelect}
        placeholder="Select multi languages..."
        isMulti={true}
      />
      <button
        type="button"
        className="outline"
        onClick={formikBag.handleReset}
        disabled={!formikBag.dirty || formikBag.isSubmitting}
      >
        Reset
      </button>
      <button type="submit">Submit Form</button>
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

export default LoginForm