import { protectedSsrRoute } from "@/auth/session";
import AppLayout from "@/components/common/AppLayout/AppLayout";
import { getDb } from "@/database/database";
import Bucket, { BucketDocument } from "@/database/models/bucket";
import { UserDocument, UserType } from "@/database/models/user";
import { GetServerSideProps } from "next";
import styles from './buckets.module.scss';
import Link from "next/link";
import mongoose from "mongoose";
import { simpleTimestamp } from "@/utils/datetime";
import { useModal } from "@/components/common/Modal/Modal";
import NewBucketForm from "@/components/common/Forms/NewBucketForm/NewBucketForm";
import { useRouter } from "next/router";
import Empty from "@/components/common/Empty/Empty";

export const getServerSideProps = protectedSsrRoute(async (ctx: GetServerSideProps, session: UserDocument) => {
  await getDb();
  const buckets = await Bucket.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(session._id) } },
    { $lookup: { from: 'keyvalues', localField: '_id', foreignField: 'bucketId', as: 'keys' } },
    { $addFields: { keyCount: { $size: '$keys' } } },
    {
      $project: {
        name: 1,
        createdAt: 1,
        keyCount: 1,
        _id: 1,
        userId: 1,
      }
    }
  ])
    .sort({ createdAt: 'desc' })
    .exec();
  return {
    props: {
      buckets: JSON.parse(JSON.stringify(buckets))
    }
  }
});

export default function Buckets({ buckets }: { buckets: BucketDocument[] }) {

  const { Modal, toggleModal } = useModal();
  const router = useRouter();

  const onBucketCreated = (bucket: BucketDocument) => {
    router.replace(router.asPath);
  };

  return (
    <AppLayout>
      <Modal title="Create Bucket" size="sm">
        <NewBucketForm
          onComplete={onBucketCreated}
        />
      </Modal>
      <div className={styles.page_header}>
        <h1>Buckets</h1>
        <button className="btn btn-primary" onClick={toggleModal}>Create Bucket</button>
      </div>
      <div className="divider"></div>
      <div className={styles.buckets_container}>
        {buckets.length === 0
          ? <Empty
            title="You don't have any buckets yet"
            subtitle={<>Create a new bucket using the button below, or view the <Link href="/docs">documentation</Link> to see how to create buckets programmatically.</>}
            iconClass="gg-folder gg-2x"
            buttonText="Create a bucket"
            onButtonClick={toggleModal}
          />
          : <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th className="text-center">Keys</th>
                <th className="text-right">Created at</th>
              </tr>
            </thead>
            <tbody>
              {buckets.map((bucket: BucketDocument) => (
                <tr key={bucket._id}>
                  <td><Link href={`/buckets/${bucket._id}`} className="btn btn-link">{bucket.name}</Link></td>
                  <td className="text-center">{bucket.keyCount}</td>
                  <td className="text-right">{simpleTimestamp(bucket.createdAt.toString())}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </AppLayout >
  )
};