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


  const deleteApiKey =  async(keyId: string) => {
    const isConfirmed = confirm("Are you sure you want to delete this API key? Any applications using this key will no longer have access to your buckets.");
    if (!isConfirmed) return;
    const { isOk } = await del(`/api/api-keys/${keyId}`);
    if (isOk) {
      setFilteredApiKeys(filteredApiKeys.filter(k => k._id !== keyId));
    }
  }

  return (
    <AppLayout>
      <Modal title="New API Key">
        <NewApiKeyForm />
      </Modal>
      <div className="page-header">
        <h1>API Keys</h1>
        <button className="btn btn-primary" onClick={toggleModal}>New API Key</button>
      </div>
      <table className="table">
          <thead>
            <tr>
              <th>Key</th>
              <th className="text-center">Permissions</th>
              <th className="text-right">Created</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApiKeys.map((apiKey) => (
              <tr key={apiKey._id}>
                <td>{apiKey.key}</td>
                <td className="text-center flex-col">{apiKey.permissions.map(p => (
                  <span>{p}</span>
                ))}</td>
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
    </AppLayout >
  )
};