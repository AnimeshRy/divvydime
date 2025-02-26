import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | DivyDime',
  description: 'Cookie Policy for DivyDime expense sharing application',
}

const CookiesPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-col items-start gap-2">
          <h1 className="text-3xl font-bold">Cookie Policy</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-6 text-sm md:text-base">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">1. What Are Cookies</h2>
            <p>
              Cookies are small text files that are stored on your computer or
              mobile device when you visit a website. They are widely used to
              make websites work more efficiently and provide information to the
              website owners.
            </p>
            <p>
              Cookies help us enhance your experience on our website by
              remembering your preferences, analyzing how our website is used,
              and personalizing content.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              2. Types of Cookies We Use
            </h2>
            <p>We use the following types of cookies on our website:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium">Essential Cookies:</span> These
                cookies are necessary for the website to function properly. They
                enable core functionality such as security, network management,
                and account access. You cannot opt out of these cookies.
              </li>
              <li>
                <span className="font-medium">Functionality Cookies:</span>{' '}
                These cookies allow us to remember choices you make and provide
                enhanced, personalized features. They may be set by us or by
                third-party providers whose services we have added to our pages.
              </li>
              <li>
                <span className="font-medium">
                  Performance/Analytics Cookies:
                </span>{' '}
                These cookies collect information about how visitors use our
                website, such as which pages visitors go to most often and if
                they receive error messages. They help us improve how our
                website works and measure the effectiveness of our advertising.
              </li>
              <li>
                <span className="font-medium">
                  Targeting/Advertising Cookies:
                </span>{' '}
                These cookies are used to deliver advertisements more relevant
                to you and your interests. They are also used to limit the
                number of times you see an advertisement and help measure the
                effectiveness of advertising campaigns.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">3. How We Use Cookies</h2>
            <p>We use cookies for various purposes, including to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Authenticate users and prevent fraudulent use of user accounts
              </li>
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our website</li>
              <li>Improve our website and services</li>
              <li>Provide personalized content and advertisements</li>
              <li>
                Analyze the performance of our website and marketing campaigns
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">4. Third-Party Cookies</h2>
            <p>
              In addition to our own cookies, we may also use various
              third-party cookies to report usage statistics, deliver
              advertisements, and so on. These cookies may be placed by:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Analytics providers (such as Google Analytics)</li>
              <li>Advertising networks</li>
              <li>Social media platforms</li>
              <li>External service providers</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">5. Managing Cookies</h2>
            <p>
              Most web browsers allow you to control cookies through their
              settings. You can usually find these settings in the
              &quot;Options&quot; or &quot;Preferences&quot; menu of your
              browser. You can:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Delete all cookies</li>
              <li>Block all cookies</li>
              <li>Allow all cookies</li>
              <li>Block third-party cookies</li>
              <li>Clear all cookies when you close the browser</li>
              <li>
                Open a &quot;private browsing&quot; / &quot;incognito&quot;
                session
              </li>
              <li>
                Install add-ons and plugins to extend browser functionality
              </li>
            </ul>
            <p>
              Please note that restricting cookies may impact the functionality
              of our website. For more information about cookies and how to
              manage them, visit{' '}
              <a
                href="https://www.allaboutcookies.org/"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.allaboutcookies.org
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">6. Cookie Consent</h2>
            <p>
              When you first visit our website, you will be shown a cookie
              banner requesting your consent to set cookies. You can choose to
              accept all cookies, only essential cookies, or customize your
              preferences.
            </p>
            <p>
              You can change your cookie preferences at any time by clicking on
              the &quot;Cookie Settings&quot; link in the footer of our website.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              7. Changes to This Cookie Policy
            </h2>
            <p>
              We may update our Cookie Policy from time to time. We will notify
              you of any changes by posting the new Cookie Policy on this page
              and updating the &quot;Last updated&quot; date.
            </p>
            <p>
              You are advised to review this Cookie Policy periodically for any
              changes. Changes to this Cookie Policy are effective when they are
              posted on this page.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">8. Contact Us</h2>
            <p>
              If you have any questions about our Cookie Policy, please contact
              us at cookies@divydime.com.
            </p>
          </section>
        </CardBody>
      </Card>
    </div>
  )
}

export default CookiesPage
