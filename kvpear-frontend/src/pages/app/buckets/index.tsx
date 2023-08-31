import { protectedSsrRoute } from "@/auth/session";
import AppLayout from "@/components/common/AppLayout/AppLayout";
import { getDb } from "@/database/database";
import Bucket, { BucketDocument } from "@/database/models/bucket";
import { UserDocument, UserType } from "@/database/models/user";
import { GetServerSideProps } from "next";
import styles from './buckets.module.scss';
import Link from "next/link";

export const getServerSideProps = protectedSsrRoute(async (ctx: GetServerSideProps, session: UserDocument) => {
  await getDb();
  const buckets = await Bucket.find({ userId: session._id }) || [];
  return {
    props: {
      buckets: JSON.parse(JSON.stringify(buckets))
    }
  }
});

export default function Buckets({ buckets }: { buckets: BucketDocument[] }) {
  return (
    <AppLayout>
      <h1>Buckets</h1>
      <div className="divider"></div>
      <div className={styles.buckets_container}>
        <table className="table table-striped">
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
                <td className="text-center">15</td>
                <td className="text-right">{bucket.createdAt.toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout >
  )
};