import { ApiPermissions } from "@/utils/types";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";
import { ccn } from "@/styles/styleUtils";

const enumValues = Object.values(ApiPermissions);

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  permissions: yup.array().of(yup.string().oneOf(enumValues))
    .required('Permissions are required')
    .min(1, 'Permissions are required')
});

export default function NewApiKeyForm() {

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data: any) => {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={ccn('form-group', { 'has-error': !!errors?.name })}>
        <label className="form-label" htmlFor="key">Name</label>
        <input className="form-input" type="text" { ...register('name') } />
        {errors?.name && <p className="form-input-hint">{errors.name.message}</p>}
      </div>
      <div className={ccn('form-group', { 'has-error': !!errors?.permissions })} style={{ marginTop: '20px' }}>
        <label>Permissions</label>
        {enumValues.map((permission) => (
          <label key={permission} className="form-checkbox c-hand" style={{ marginTop: '10px' }}>
            <input type="checkbox" { ...register('permissions') } />
            <i className="form-icon"></i> {permission}
          </label>
        ))}
        {errors?.permissions && <p className="form-input-hint">{errors.permissions.message}</p>}
      </div>
      <div className="form-group" style={{ marginTop: '20px' }}>
        <button className="btn btn-primary float-right btn-lg">Create</button>
      </div>
    </form>
  )
};