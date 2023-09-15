import { ccn } from "@/styles/styleUtils";
import { isUrlSafe, useApi } from "@/utils/api"
import { useState } from "react";


export default function NewBucketForm({ onComplete }: { onComplete: (res: any) => void}) {
  const { post, error, isLoading } = useApi();
  const [validationError, setValidationError] = useState('');
  const [bucketName, setBucketName] = useState('');

  const createBucket = async (e: any) => {
    e.preventDefault();
    setValidationError('');
    if (!bucketName) {
      setValidationError('Name is required');
      return;
    }
    if (!isUrlSafe(bucketName)) {
      setValidationError('Name must be URL safe');
      return;
    }
    const { isOk, data } = await post('/api/buckets', {
      name: bucketName,
    }, {
      successMessage: 'Bucket created',
      errorMessage: 'Bucket creation failed',
    });
    if (isOk) {
      onComplete(data);
    }
  };

  return (
    <form>
      <div className={ccn('form-group', { 'has-error': !!validationError })}>
        <label className="form-label" htmlFor="name">Name</label>
        <input 
          className="form-input" 
          type="text" 
          name="name"
          value={bucketName}
          autoFocus
          onChange={e => setBucketName(e.target.value)} 
        />
        {!!validationError && <span className="form-input-hint">{validationError}</span>}
      </div>
      <button 
        onClick={createBucket}
        className="btn btn-primary btn-block"
        style={{ marginTop: '30px' }}
      >{isLoading ? <i className="loading" ></i> : 'Save'}</button>
    </form>
  )
}