import { BackToLoginLink } from "@/components/dashboard/BackToLoginLink";

export const metadata = {
  title: "Privacy Policy | Postleaf Admin Dashboard",
  description: "Postleaf Customer Admin Dashboard Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-3xl mx-auto px-4 py-8 pb-12">
        <BackToLoginLink />
        <article className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
          <div className="px-6 sm:px-10 py-8 sm:py-10 bg-gradient-to-br from-card to-card/95">
            <div className="border-b border-border pb-6 mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                Privacy Policy – Postleaf Customer Admin Dashboard
              </h1>
              <p className="mt-2 text-sm text-muted-foreground font-medium">
                Last updated February 2026
              </p>
            </div>
            <div className="legal-prose prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
              <p>This Privacy Notice for Postleaf (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), describes how and why we might access, collect, store, use, and/or share (&quot;process&quot;) your personal information when you use our Customer Admin Dashboard Services.</p>

              <h2 id="company-details" className="text-xl font-semibold mt-10 mb-4 text-foreground scroll-mt-28">Company Details</h2>
              <p>Legal Name: POSTLEAF<br />Address: #109, 4th main, 4th cross, Vasantappa block, Ganganagar, Bangalore 560032, India.</p>

              <h2 id="information-we-collect" className="text-xl font-semibold mt-10 mb-4 text-foreground scroll-mt-28">Information We Collect</h2>
              <p>We collect account data, campaign details, creatives, targeting filters, analytics data, billing information, usage logs, and communication records through the dashboard.</p>

              <h2 id="third-party" className="text-xl font-semibold mt-10 mb-4 text-foreground scroll-mt-28">Third-Party Integrations</h2>
              <p>We use third-party infrastructure and service providers such as Amazon Web Services (AWS) for cloud hosting, storage, and processing. These providers process data on our behalf strictly for delivering our services.</p>

              <h2 id="international-transfers" className="text-xl font-semibold mt-10 mb-4 text-foreground scroll-mt-28">International Data Transfers</h2>
              <p>Your data may be stored and processed on secure cloud infrastructure such as AWS data centers, which may be located outside India. We ensure that appropriate safeguards are implemented to protect your data.</p>

              <h2 id="client-responsibility" className="text-xl font-semibold mt-10 mb-4 text-foreground scroll-mt-28">Client / Advertiser Responsibility</h2>
              <p>Clients are solely responsible for the content, creatives, and materials they upload to the dashboard and must ensure they have all required rights, permissions, and legal compliance for such content.</p>

              <h2 id="data-breach" className="text-xl font-semibold mt-10 mb-4 text-foreground scroll-mt-28">Data Breach Notification</h2>
              <p>In the event of a data breach affecting personal data, we will notify affected users and relevant authorities as required under applicable laws.</p>

              <h2 id="childrens-data" className="text-xl font-semibold mt-10 mb-4 text-foreground scroll-mt-28">Children&apos;s Data</h2>
              <p>Our services are not intended for individuals under the age of 18. We do not knowingly collect personal data from minors.</p>

              <h2 id="account-termination" className="text-xl font-semibold mt-10 mb-4 text-foreground scroll-mt-28">Account Termination and Data Deletion</h2>
              <p>Once a Postleaf account is deleted, all associated data, campaign information, creatives, and records are permanently deleted from our systems and cannot be recovered. This action is irreversible.</p>

              <h2 id="data-security" className="text-xl font-semibold mt-10 mb-4 text-foreground scroll-mt-28">Data Security</h2>
              <p>We implement administrative, technical, and physical safeguards including encryption, restricted access, and monitoring to protect your data.</p>

              <h2 id="compliance" className="text-xl font-semibold mt-10 mb-4 text-foreground scroll-mt-28">Compliance with Indian Laws (2026)</h2>
              <p>We comply with applicable Indian laws including the Information Technology Act, 2000, IT Rules 2011, and the Digital Personal Data Protection Act, 2023.</p>

              <h2 id="user-rights" className="text-xl font-semibold mt-10 mb-4 text-foreground scroll-mt-28">User Rights</h2>
              <p>You may request access, correction, or deletion of your personal data at any time by contacting support.</p>

              <h2 id="grievance-officer" className="text-xl font-semibold mt-10 mb-4 text-foreground scroll-mt-28">Grievance Officer</h2>
              <p>For any complaints or data concerns, contact support@postleaf.live or write to the registered address above.</p>

              <h2 id="policy-updates" className="text-xl font-semibold mt-10 mb-4 text-foreground scroll-mt-28">Policy Updates</h2>
              <p>We may update this policy from time to time. Continued use of the dashboard indicates acceptance of updates.</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
