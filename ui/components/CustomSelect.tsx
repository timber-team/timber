import { FieldProps } from "formik";
import React from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps extends FieldProps {
  className?: string;
  options: Option[];
  isMulti?: boolean;
  placeholder?: string;
  label: string;
  muted?: boolean;
  description?: string;
}

export const CustomSelect = ({
  className,
  placeholder,
  field,
  form,
  options,
  label,
  muted,
  description,
  isMulti = false
}: CustomSelectProps) => {
  const onChange = (option: Option | Option[]) => {
    form.setFieldValue(
        field.name,
      isMulti ?
        (option as Option[]).map((item: Option) => item.value) :
        (option as Option).value,
    );
  };

  const getValue = () => {
    if (options) {
      return isMulti ?
        options.filter((option) => field.value.indexOf(option.value) >= 0) :
        options.find((option) => option.value === field.value);
    } else {
      return isMulti ? [] : ('' as any);
    }
  };

  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Select
        className={className}
        name={field.name}
        value={getValue()}
        onChange={onChange}
        placeholder={placeholder}
        options={options}
        isMulti={isMulti}
      />
      <Form.Text className={muted ? "text-muted" : ""}>
        {description}
      </Form.Text>
    </Form.Group>
  );
};

export default CustomSelect;
