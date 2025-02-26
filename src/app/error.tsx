'use client'

import { Button, Card } from '@nextui-org/react'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center">
      <Card className="w-full max-w-lg p-8 flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold text-center">
          Oops! Something Went Wrong
        </h1>
        <p className="text-lg text-default-500 text-center">
          We encountered an unexpected error. Our team has been notified.
        </p>

        <div className="relative w-64 h-64">
          <Image
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWJtZWJtZnRqcnRqZnRqZnRqZnRqZnRqZnRqZnRqZnRqZnRqZnRqZnRqZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT5LMzIK1AdZJ4cYW4/giphy.gif"
            alt="Computer Error GIF"
            fill
            className="rounded-lg object-cover"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
          <Button
            onClick={() => reset()}
            className="w-full text-base text-white bg-green-600"
            size="lg"
          >
            Try Again
          </Button>

          <Link href="/groups" className="w-full">
            <Button className="w-full text-base text-green-600" size="lg">
              Go to Groups
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
