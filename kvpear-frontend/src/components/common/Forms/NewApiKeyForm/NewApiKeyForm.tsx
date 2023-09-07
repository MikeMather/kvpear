import { ApiPermissions } from "@/utils/types";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";
import { ccn } from "@/styles/styleUtils";
import { useApi } from "@/utils/api";
import { useState } from "react";
import SecretField from "../../SecretField/SecretField";

const enumValues = Object.values(ApiPermissions);

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  permissions: yup.array().of(yup.string().oneOf(enumValues))
    .required('Permissions are required')
    .min(1, 'Permissions are required')
});

export default function NewApiKeyForm({ onComplete }: { onComplete: () => void }) {
  const { post, error, isLoading } = useApi();
  const { register, handleSubmit, formState: { errors }, getValues } = useForm({
    resolver: yupResolver(schema)
  });
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const onSubmit = async (payload: any) => {
    const { isOk, data } = await post('/api/api-keys', payload);
    if (isOk && data.key) {
      setCreatedKey(data.key);
    }
  }

  if (createdKey) {
    return (
      <div>
        <p style={{ marginBottom: '5px' }}>Your new API Key:</p>
        <SecretField secret={createdKey} />
      </div>
    )
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
            <input type="checkbox" { ...register('permissions', { required: true }) } value={permission} />
            <i className="form-icon"></i> {permission}
          </label>
        ))}
        {errors?.permissions && <p className="form-input-hint">{errors.permissions.message}</p>}
      </div>
      {error && <p className="form-input-hint text-error">{error}</p>}
      <div className="form-group" style={{ marginTop: '20px' }}>
        <button className={ccn("btn btn-primary float-right btn-lg", { 'loading': isLoading })} type="submit">
          Create
        </button>
      </div>
    </form>
  )
};