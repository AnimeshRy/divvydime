/* eslint-disable react/no-unescaped-entities */

import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | DivyDime',
  description: 'Privacy Policy for DivyDime expense sharing application',
}

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-col items-start gap-2">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-6 text-sm md:text-base">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p>
              At DivyDime, we respect your privacy and are committed to
              protecting your personal data. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              use our expense sharing application.
            </p>
            <p>
              Please read this Privacy Policy carefully. If you do not agree
              with the terms of this Privacy Policy, please do not access the
              application.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">2. Information We Collect</h2>
            <p>
              We collect several types of information from and about users of
              our application, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium">Personal Data:</span> Name, email
                address, profile picture, and other contact information you
                provide when creating an account.
              </li>
              <li>
                <span className="font-medium">Financial Information:</span>{' '}
                Information about expenses, payments, and transactions you
                record in the application. We do not store complete credit card
                numbers or bank account details.
              </li>
              <li>
                <span className="font-medium">Usage Data:</span> Information
                about how you use our application, including features you
                access, time spent on the application, and other diagnostic
                data.
              </li>
              <li>
                <span className="font-medium">Device Information:</span>{' '}
                Information about your device, including IP address, device
                type, operating system, and browser type.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              3. How We Use Your Information
            </h2>
            <p>
              We use the information we collect about you for various purposes,
              including to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our application</li>
              <li>Process and manage your expense sharing activities</li>
              <li>
                Communicate with you about updates, security alerts, and support
                messages
              </li>
              <li>Prevent fraudulent activities and enhance security</li>
              <li>Analyze usage patterns and optimize user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              4. Sharing Your Information
            </h2>
            <p>
              We may share your personal information in the following
              situations:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium">With Other Users:</span> When you
                create or join a group, certain information (such as your name,
                profile picture, and expense details) will be visible to other
                members of that group.
              </li>
              <li>
                <span className="font-medium">With Service Providers:</span> We
                may share your information with third-party vendors who provide
                services on our behalf, such as hosting, data analysis, payment
                processing, and customer service.
              </li>
              <li>
                <span className="font-medium">For Legal Reasons:</span> We may
                disclose your information if required to do so by law or in
                response to valid requests by public authorities.
              </li>
              <li>
                <span className="font-medium">Business Transfers:</span> In
                connection with any merger, sale of company assets, financing,
                or acquisition of all or a portion of our business by another
                company.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect the security of your personal information. However, please
              be aware that no method of transmission over the internet or
              electronic storage is 100% secure, and we cannot guarantee
              absolute security.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              6. Your Data Protection Rights
            </h2>
            <p>
              Depending on your location, you may have the following rights
              regarding your personal data:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                The right to access the personal information we hold about you
              </li>
              <li>
                The right to request correction of inaccurate personal
                information
              </li>
              <li>
                The right to request deletion of your personal information
              </li>
              <li>
                The right to restrict or object to processing of your personal
                information
              </li>
              <li>The right to data portability</li>
              <li>
                The right to withdraw consent at any time, where processing is
                based on consent
              </li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at
              privacy@divydime.com.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">7. Children's Privacy</h2>
            <p>
              Our application is not intended for children under 13 years of
              age. We do not knowingly collect personal information from
              children under 13. If you are a parent or guardian and believe
              your child has provided us with personal information, please
              contact us.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              8. Changes to This Privacy Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the "Last updated" date.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any
              changes. Changes to this Privacy Policy are effective when they
              are posted on this page.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at privacy@divydime.com.
            </p>
          </section>
        </CardBody>
      </Card>
    </div>
  )
}

export default PrivacyPolicyPage
