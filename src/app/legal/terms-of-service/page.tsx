/* eslint-disable react/no-unescaped-entities */
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | DivyDime',
  description:
    'Terms of Service for using DivyDime expense sharing application',
}

const TermsOfServicePage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-col items-start gap-2">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-6 text-sm md:text-base">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p>
              Welcome to DivyDime. These Terms of Service govern your use of our
              website and application (collectively, the "Service") operated by
              DivyDime ("us", "we", or "our").
            </p>
            <p>
              By accessing or using the Service, you agree to be bound by these
              Terms. If you disagree with any part of the terms, you may not
              access the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">2. Accounts</h2>
            <p>
              When you create an account with us, you must provide information
              that is accurate, complete, and current at all times. Failure to
              do so constitutes a breach of the Terms, which may result in
              immediate termination of your account on our Service.
            </p>
            <p>
              You are responsible for safeguarding the password that you use to
              access the Service and for any activities or actions under your
              password.
            </p>
            <p>
              You agree not to disclose your password to any third party. You
              must notify us immediately upon becoming aware of any breach of
              security or unauthorized use of your account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">3. Use of Service</h2>
            <p>
              DivyDime provides a platform for tracking and splitting expenses
              among groups of users. You agree to use the Service only for
              lawful purposes and in accordance with these Terms.
            </p>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Use the Service in any way that violates any applicable national
                or international law or regulation.
              </li>
              <li>
                Use the Service for the purpose of exploiting, harming, or
                attempting to exploit or harm minors.
              </li>
              <li>
                Attempt to gain unauthorized access to any portion of the
                Service or any other systems or networks connected to the
                Service.
              </li>
              <li>
                Use the Service to transmit or upload any material that contains
                viruses, trojan horses, or other harmful code.
              </li>
              <li>
                Interfere with or disrupt the Service or servers or networks
                connected to the Service.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">4. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality
              are and will remain the exclusive property of DivyDime and its
              licensors. The Service is protected by copyright, trademark, and
              other laws of both the United States and foreign countries.
            </p>
            <p>
              Our trademarks and trade dress may not be used in connection with
              any product or service without the prior written consent of
              DivyDime.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">5. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason whatsoever, including
              without limitation if you breach the Terms.
            </p>
            <p>
              Upon termination, your right to use the Service will immediately
              cease. If you wish to terminate your account, you may simply
              discontinue using the Service or contact us to request account
              deletion.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              6. Limitation of Liability
            </h2>
            <p>
              In no event shall DivyDime, nor its directors, employees,
              partners, agents, suppliers, or affiliates, be liable for any
              indirect, incidental, special, consequential or punitive damages,
              including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Your access to or use of or inability to access or use the
                Service;
              </li>
              <li>Any conduct or content of any third party on the Service;</li>
              <li>Any content obtained from the Service; and</li>
              <li>
                Unauthorized access, use or alteration of your transmissions or
                content.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">7. Changes</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material we will try to
              provide at least 30 days' notice prior to any new terms taking
              effect.
            </p>
            <p>
              By continuing to access or use our Service after those revisions
              become effective, you agree to be bound by the revised terms. If
              you do not agree to the new terms, please stop using the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at
              support@divydime.com.
            </p>
          </section>
        </CardBody>
      </Card>
    </div>
  )
}

export default TermsOfServicePage
