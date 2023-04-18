import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import WaitlistForm from '@/components/complex/WaitlistForm';
import TextView from "@/components/base/TextView";

export default function Home() {
  return (
    <>
      <Head>
        <title>spendwiser</title>
        <meta name="description" content="Wise up your spending habits with Spendwiser" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          Spendwiser
        </div>

        {/* catchphrase - waitlist */}
        <div className={styles.catchphrase_waitlist}>
          {/* catchphrase */}
          <div className={styles.catchphrase}>

            <div>
              <div className={styles.catchphrase_line1_subline1}>
                Wise up&nbsp;
              </div>
              <div className={styles.catchphrase_line1_subline2}>
                your
              </div>
            </div>

            <div>
              <div className={styles.catchphrase_line2_subline1}>
                Spending Habits
              </div>
            </div>

            <div>
              <div className={styles.catchphrase_line3_subline1}>
                with&nbsp;
              </div>
              <div className={styles.catchphrase_line3_subline2}>
                SpendWiser
              </div>
            </div>

          </div>

          <div className={styles.catchphrase_waitlist_divider}></div>

          {/* waitlist */}
          <div className={styles.waitlist}>
            <TextView texts={[['Join the Waitlist!', { fontWeight: 900, fontSize: '24px', marginBottom: '4px' }]]} />
            <TextView texts={[['We expect to launch in a couple of weeks. We\'ll notify you.', { marginBottom: '32px' }]]} />
            <WaitlistForm />
          </div>

        </div>

      </div>
    </>
  )
}
