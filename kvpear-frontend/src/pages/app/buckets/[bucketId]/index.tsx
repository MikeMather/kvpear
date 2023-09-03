import { getServerSession, protectedSsrRoute } from "@/auth/session";
import AppLayout from "@/components/common/AppLayout/AppLayout";
import { useModal } from "@/components/common/Modal/Modal";
import { getDb } from "@/database/database";
import Bucket from "@/database/models/bucket";
import KeyValue, { KeyValueDocument, KeyValueType } from "@/database/models/keyValue";
import { isObjectId } from "@/database/validation";
import { ccn } from "@/styles/styleUtils";
import { isUrlSafe, serialize, useApi } from "@/utils/api";
import { simpleTimestamp } from "@/utils/datetime";
import { useEffect, useState } from "react";
import styles from './bucket.module.scss';
import { modifyOneInArray } from "@/utils/objects";
import EditOrCreateKeyForm from "@/components/common/Forms/EditOrCreateKeyForm/EditOrCreateKeyForm";
import { useRouter } from "next/router";

type KeyValueItem = KeyValueType & {
  _id: string;
  hasChanged: boolean;
}

export const getServerSideProps = protectedSsrRoute(async (ctx: any) => {
  const { bucketId } = ctx.params as any;
  const user = await getServerSession(ctx.req);

  if (!isObjectId(bucketId)) {
    return {
      notFound: true,
    }
  }

  await getDb();
  const bucket = await Bucket.findById(bucketId);
  const keys = await KeyValue.find({ bucketId, userId: user._id }).sort({ updatedAt: 'desc' });
  return {
    props: {
      bucket: serialize(bucket),
      keys: serialize(keys),
    }
  }
});

export default function BucketPage({ bucket, keys }: any) {

  const [filteredKeys, setFilteredKeys] = useState<KeyValueItem[]>([]);
  const { Modal, toggleModal } = useModal();
  const { Modal: EditModal, toggleModal: toggleEditModal } = useModal();
  const { patch, del, isLoading, error, isDone } = useApi();
  const [expandedKey, setExpandedKey] = useState<KeyValueType | null>(null);
  const [editingBucket, setEditingBucket] = useState<boolean>(false);
  const [bucketName, setBucketName] = useState<string>(bucket.name);
  const [bucketEditError, setBucketEditError] = useState<string | null>(null);
  const [searchVal, setSearchVal] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    setFilteredKeys(keys.map((key: KeyValueDocument) => ({
      ...key,
      hasChanged: false,
    })));
  }, [keys]);

  useEffect(() => {
    if (expandedKey) {
      toggleEditModal();
    }
  }, [expandedKey]);

  const onKeyAdded = (update: KeyValueType) => {
    const newRecord: any = {
      ...update,
      hasChanged: false,
    }
    setFilteredKeys([newRecord, ...filteredKeys]);
    toggleModal();
  }

  const onChangeKey = (e: any, keyId: string) => {
    const newKeys = filteredKeys.map((key: KeyValueItem) => {
      if (key._id === keyId) {
        return {
          ...key,
          value: e.target.value,
          hasChanged: true,
        }
      }
      return key;
    });
    setFilteredKeys(newKeys);
  };

  const onSaveKey = async (keyId: string) => {
    const keyToUpdate = filteredKeys.find((key: KeyValueItem) => key._id === keyId);
    const { isOk } = await patch(`/api/keys/${keyId}`, keyToUpdate, {
      successMessage: 'Key updated'
    });
    if (isOk) {
      const itemIndex = filteredKeys.findIndex((key: KeyValueItem) => key._id === keyId);
      const updatedKeys = modifyOneInArray(filteredKeys, itemIndex, {
        hasChanged: false,
      });
      setFilteredKeys(updatedKeys);
    }
  };

  const onUpdateKey = async (key: KeyValueType) => {
    const itemIndex = filteredKeys.findIndex((k: KeyValueItem) => k._id === key._id);
    const updatedKeys = modifyOneInArray(filteredKeys, itemIndex, {
      ...key,
      hasChanged: false
    });
    setFilteredKeys(updatedKeys);
    setExpandedKey(null);
    toggleEditModal();
  }

  const onDeleteKey = async (keyId: string) => {
    const confirmed = confirm('Are you sure you want to delete this key?');
    if (!confirmed) return;
    const { isOk } = await del(`/api/keys/${keyId}`, {
      successMessage: 'Key deleted'
    });
    if (isOk) {
      const updatedKeys = filteredKeys.filter((key: KeyValueItem) => key._id !== keyId);
      setFilteredKeys(updatedKeys);
    }
  };

  const saveBucket = async () => {
    setBucketEditError(null);
    if (!isUrlSafe(bucketName)) {
      setBucketEditError('Bucket name must be url safe');
      return;
    }
    const { isOk } = await patch(`/api/buckets/${bucket._id}`, {
      name: bucketName,
    }, {
      successMessage: 'Bucket updated'
    });
    if (isOk) {
      setEditingBucket(false);
    }
  }

  const deleteBucket = async () => {
    const confirmed = confirm('Are you sure you want to delete this bucket? This can\'t be undone');
    if (!confirmed) return;
    const { isOk } = await del(`/api/buckets/${bucket._id}`, {
      successMessage: 'Bucket deleted'
    });
    if (isOk) {
      router.push('/app/buckets');
    }
  };

  const searchKeys = (e: any) => {
    const val = e.target.value;
    setSearchVal(val);
    if (!val) {
      setFilteredKeys(keys);
      return;
    }
    const filtered = keys.filter((key: KeyValueItem) => key.key.toLowerCase().includes(val.toLowerCase()));
    setFilteredKeys(filtered);
  }

  return (
    <AppLayout>
      <div>
        <Modal 
          title={`Add key to ${bucket.name}`} 
          size="md"
          className={styles.full_height_modal}
        >
          <EditOrCreateKeyForm
            bucketId={bucket._id}
            onClose={(newKey: KeyValueType | null) => {
              if (!newKey) return;
              onKeyAdded(newKey)
            }}
          />
        </Modal>
        <EditModal 
          title={`Edit ${expandedKey?.key}`} 
          size="md" 
          className={styles.full_height_modal}
        >
          {expandedKey && (
            <EditOrCreateKeyForm 
              bucketId={bucket._id}
              editingKey={expandedKey} 
              onClose={(k: KeyValueType | null) => {
                if (!k) return;
                onUpdateKey(k);
              }} 
              />
          )}
        </EditModal>
        <div className={styles.page_title_container}>
          {!editingBucket
            ? <div className={styles.page_title}>
              <h1>{bucketName}</h1>
              <button className="btn btn-link" onClick={() => setEditingBucket(true)}>
                <i className="icon icon-edit"></i>
              </button>
            </div>
            : <div>
                <div className={ccn('input-group', { 'has-error': !!bucketEditError })}>
                  <input 
                    className="form-input input-lg" 
                    type="text" 
                    value={bucketName} onChange={e => setBucketName(e.target.value)} />
                  <button
                    className="btn btn-primary input-group-btn btn-lg"
                    onClick={saveBucket}
                  >Save</button>
                  <button 
                    className="btn btn-link input-group-btn btn-lg"
                    onClick={() => setEditingBucket(false)}
                  >Cancel</button>
              </div>
              <span className="form-input-hint text-error">{bucketEditError}</span>
            </div>
          }
          <div>
            <button 
              onClick={deleteBucket} 
              className="btn btn-action btn-link text-error tooltip"
              data-tooltip="Delete bucket"
            >
              <i className="icon icon-delete" style={{ opacity: '0.9' }}></i>
            </button>
          </div>
        </div>
        <div className="columns mb-2">
          <div className="column col-3">
            <div className="input-group">
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search" 
                onChange={searchKeys}
              />
            </div>             
          </div>
          <div className="column col-7"></div>
          <div className="column col-2 text-right">
            <button onClick={toggleModal} className="btn btn-primary">+ Add Key</button>
          </div>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Key</th>
              <th className="text-center">Value</th>
              <th className="text-right">Created</th>
              <th className="text-right">Last updated</th>
              <th className="text-right"></th> {/* Actions */}
            </tr>
          </thead>
          <tbody>
            {filteredKeys.map((key: KeyValueItem) => (
              <tr key={key._id}>
                <td>
                  {key.key}
                  <button 
                    className="btn btn-link btn-sm text-dark" 
                    onClick={() => setExpandedKey(key)}
                    style={{ opacity: '0.8' }}
                  >
                    <i className="icon icon-edit"></i>
                  </button>
                </td>
                <td className="text-center">
                  <div className={ccn(styles.value_field, { 'input-group': key.hasChanged })}>
                    <input onChange={e => onChangeKey(e, key._id)} type="text" className="form-input" value={key.value} />
                    {key.hasChanged &&
                       <button onClick={() => onSaveKey(key._id)} className="btn btn-primary input-group-btn">
                        <i className="icon icon-check"></i>
                      </button>
                    }
                  </div>
                </td>
                <td className="text-right">{simpleTimestamp(key.createdAt)}</td>
                <td className="text-right">{simpleTimestamp(key.updatedAt)}</td>
                <td className="text-right">
                  <button onClick={() => onDeleteKey(key._id)} className="btn btn-action btn-link text-error">
                    <i className="icon icon-delete" style={{ opacity: '0.9', fontSize: '14px' }}></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  )
};