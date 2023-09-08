import { protectedSsrRoute } from "@/auth/session";
import AppLayout from "@/components/common/AppLayout/AppLayout";
import { getDb } from "@/database/database";
import BillingRecord, { BillingRecordDocument, BillingRecordType } from "@/database/models/billingRecord";
import { UserDocument } from "@/database/models/user";
import { serialize } from "@/utils/api";
import { GetServerSideProps } from "next";
import styles from './usage.module.scss';
import Empty from "@/components/common/Empty/Empty";
import { useRouter } from "next/router";
import { simpleTimestamp } from "@/utils/datetime";
import { LinkButton } from "@/components/common/LinkButton";

export const getServerSideProps = protectedSsrRoute(async (ctx: GetServerSideProps, session: UserDocument) => {
  await getDb();
  const billingRecords = await BillingRecord.find({ userId: session._id }).sort({ periodStart: 'desc' }).exec();
  return {
    props: {
      billingRecords: serialize(billingRecords)
    }
  }
});

export default function Usage({ billingRecords }: { billingRecords: BillingRecordDocument[] }) {

  const router = useRouter();

  return (
    <AppLayout>
      <div className="page-header">
        <h1>Usage</h1>
        <LinkButton href="/api/billing/customer-portal?returnto=usage" className="btn btn-primary btn-lg">View Invoices</LinkButton>
      </div>
      <div className={styles.usage_container}>
        {billingRecords.length === 0
          ? <Empty
              title="No usage records"
              subtitle="Once you start using the API, you will see your usage here."
              iconClass="gg-file gg-2x"
              buttonText="View API Docs"
              onButtonClick={() => router.push('/docs')}
            />
          : <table className="table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Requests</th>
                </tr>
              </thead>
              <tbody>
                {billingRecords.map(record => (
                  <tr key={record._id}>
                    <td>{simpleTimestamp(record.periodStart)}</td>
                    <td>{record.requests}</td>
                  </tr>
                ))}
              </tbody>
          </table>
        }
      </div>
    </AppLayout>
  )
}