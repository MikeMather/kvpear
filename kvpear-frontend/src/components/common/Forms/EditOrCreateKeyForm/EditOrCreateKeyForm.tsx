import { KeyValueType } from "@/database/models/keyValue"
import styles from './EditOrCreateKeyForm.module.scss';
import { ccn } from "@/styles/styleUtils";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { stripWhiteSpace, urlSafeRegex, useApi } from "@/utils/api";

type Props = {
  editingKey?: KeyValueType;
  bucketId: string;
  onClose: (update: KeyValueType | null) => void;
}

const defaultKey: KeyValueType = {
  _id: '',
  key: '',
  value: '',
  bucketId: '',
  userId: '',
  createdAt: new Date(),
  updatedAt: new Date(),
}

const schema = yup.object({
  key: yup.string().required('A key name is required').matches(urlSafeRegex, 'Key must be url safe'),
  value: yup.string().required('A value is required'),
});

export default function EditOrCreateKeyModal({ editingKey=defaultKey, onClose, bucketId }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [showValidJsonResult, setShowValidJsonResult] = useState(false);
  const { post, patch, isLoading, error: apiError } = useApi();
  const { handleSubmit, formState: { errors }, register, setValue, watch } = useForm<{ key: string, value: string }>({
    resolver: yupResolver(schema),
    defaultValues: editingKey
  });

  const prettify = () => {
    try {
      const parsed = JSON.parse(watch('value'));
      const pretty = JSON.stringify(parsed, null, 2);
      setValue('value', pretty);
    } catch (e: any) {
      setError(e.message);
    }
  }

  const validateJson = () => {
    try {
      const val = JSON.parse(watch('value'));
      setShowValidJsonResult(true);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  }

  const createKey = async (payloadData: any) => {
    const isJson = payloadData.value.startsWith('{') && payloadData.value.endsWith('}');
    const payload = {
      ...payloadData,
      value: isJson ? stripWhiteSpace(payloadData.value) : payloadData.value,
    }
    const { isOk, data } = await post('/api/keys', payload, {
      successMessage: 'New key added' 
    });
    if (isOk) {
      onClose(data);
    }
  } 

  const updateKey = async (payloadData: any) => {
    const payload = {
      ...payloadData,
      value: stripWhiteSpace(payloadData.value),
    }
    const { data, isOk } = await patch(`/api/keys/${editingKey._id}`, payload, {
      successMessage: 'Key updated'
    });
    if (isOk) {
      onClose(data);
    }
  }

  const onSubmit = (data: any) => {
    if (editingKey._id) {
      updateKey({
        ...editingKey,
        ...data,
      });
    } else {
      createKey({
        ...data,
        bucketId,
      });
    }
  }

  return (
    <form className={styles.edit_form} onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label className="form-label label-lg" htmlFor="key">Key</label>
        <input 
          className={ccn("form-input input-lg", { 'is-error': !!errors.key })} 
          type="text" 
          {...register('key')}
        />
        {errors.key && <span className="form-input-hint">{errors.key.message}</span>}
      </div>
      <details className="accordion c-hand">
        <summary className="accordion-header">
          <i className="icon icon-arrow-right mr-1"></i>
          JSON Tools
        </summary>
        <div className={ccn('accordion-body', styles.json_tools)}>
          <div>
            <button type="button" className="btn btn-sm mr-2" onClick={validateJson}>Validate</button>
            <button type="button" className="btn btn-sm" onClick={prettify}>Prettify</button>
          </div> 
          {error
            ? (
              <div className="toast toast-error text-small">
                <button onClick={() => setError('')} className="btn btn-clear float-right"></button>
                {error}
              </div>
            )
            : showValidJsonResult && (
              <div className="toast toast-success">
                <button onClick={() => setShowValidJsonResult(false)} className="btn btn-clear float-right"></button>
                <i className="icon icon-check mr-2"></i>
                Valid JSON
              </div>
            )
          }
        </div>
      </details>
      <div className={ccn('form-group', { 'has-error': !!errors.value })}>
        <label className="form-label label-lg" htmlFor="value">Value</label>
        <textarea
          rows={12}
          className={ccn('form-input input-lg', styles.edit_field, { 'is-error': !!errors.value })}
          {...register('value')}
        />
        {errors.value && <span className="form-input-hint">{errors.value.message}</span>}
      </div>
      <div className={styles.footer}>
        <p className="text-error text-small">{apiError}</p>
        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '150px' }}>
          {isLoading ? <i className="loading"></i> : 'Save'}
        </button>
      </div>
    </form>
  )
}