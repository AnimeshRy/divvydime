import { Button, Card } from '@nextui-org/react'
import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center">
      <Card className="w-full max-w-lg p-8 flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold text-center">Oops! Page Not Found</h1>
        <p className="text-lg text-default-500 text-center">This group does not exist or might have been deleted.</p>

        <div className="relative w-64 h-64">
          <Image
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWk4Z2g2ZWxvNnBxbWxqcnJ0NmRyOGRyZnBqbGxhcmJyZXBxdmxsbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xTiN0L7EW5trfOvEk0/giphy.gif"
            alt="Lost Travolta GIF"
            fill
            className="rounded-lg object-cover"
          />
        </div>

        <Link href="/groups" className="w-full max-w-xs">
          <Button
            className="w-full text-base text-green-600"
            size="lg"
          >
            Recently Visited Groups
          </Button>
        </Link>
      </Card>
    </div>
  )
}
