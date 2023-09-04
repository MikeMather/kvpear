import { protectedSsrRoute } from "@/auth/session";
import AppLayout from "@/components/common/AppLayout/AppLayout";
import { getDb } from "@/database/database";
import ApiKey, { ApiKeyDocument } from "@/database/models/apiKey";
import { UserDocument } from "@/database/models/user";
import { ccn } from "@/styles/styleUtils";
import { serialize, useApi } from "@/utils/api";
import { GetServerSideProps } from "next";
import styles from './api-keys.module.scss';
import { simpleTimestamp } from "@/utils/datetime";
import { useState } from "react";
import { useModal } from "@/components/common/Modal/Modal";
import NewApiKeyForm from "@/components/common/Forms/NewApiKeyForm/NewApiKeyForm";
import SecretField from "@/components/common/SecretField/SecretField";
import useSoftRefresh from "@/utils/hooks/useSoftRefresh";

export const getServerSideProps = protectedSsrRoute(async (ctx: GetServerSideProps, session: UserDocument) => {
  await getDb();
  const apiKeys = await ApiKey.find({ userId: session._id }).exec();
  return {
    props: {
      apiKeys: serialize(apiKeys)
    }
  }
});

export default function ApiKeys({ apiKeys }: { apiKeys: ApiKeyDocument[] }) {

  const { del, isLoading, error } = useApi();
  const [filteredApiKeys, setFilteredApiKeys] = useState<ApiKeyDocument[]>(apiKeys);
  const { Modal, toggleModal } = useModal();
  const softRefresh = useSoftRefresh();


  const deleteApiKey = async (keyId: string) => {
    const isConfirmed = confirm("Are you sure you want to delete this API key? Any applications using this key will no longer have access to your buckets.");
    if (!isConfirmed) return;
    const { isOk } = await del(`/api/api-keys/${keyId}`);
    if (isOk) {
      setFilteredApiKeys(filteredApiKeys.filter(k => k._id !== keyId));
    }
  }

  const onApiKeyCreated = () => {
    softRefresh();
  }

  return (
    <AppLayout>
      <Modal title="New API Key" onClose={onApiKeyCreated}>
        <NewApiKeyForm onComplete={onApiKeyCreated} />
      </Modal>
      <div className="page-header">
        <h1>API Keys</h1>
        <button className="btn btn-primary" onClick={toggleModal}>New API Key</button>
      </div>
      {apiKeys.length === 0
        ? <div className="empty">
          <div className="empty-icon">
            <i className="icon icon-people"></i>
          </div>
          <p className="empty-title h5">You don't have any API keys yet</p>
          <div className="empty-subtitle">You'll need an API key to access your buckets. Create one using the button below</div>
          <div className="empty-action">
            <button className="btn btn-primary" onClick={toggleModal}>Create an API key</button>
          </div>
        </div>
        : <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th className="text-left">Permissions</th>
              <th className="text-right">Created</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApiKeys.map((apiKey) => (
              <tr key={apiKey._id}>
                <td>{apiKey.name}</td>
                <td style={{ minHeight: '100%' }} className="text-left">
                  <div className="flex-col">
                    {apiKey.permissions.map(p => (
                      <code key={p}>{p}</code>
                    ))}
                  </div>
                </td>
                <td className="text-right">{simpleTimestamp(apiKey.createdAt)}</td>
                <td className="text-center">
                  <button onClick={() => deleteApiKey(apiKey._id)} className="btn btn-link text-error">
                    <i className="icon icon-delete"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </AppLayout >
  )
};