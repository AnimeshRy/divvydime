import { Button } from '@nextui-org/react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col gap-2">
      <p>This group does not exist.</p>
      <p>
        <Button>
          <Link href="/groups">Go to recently visited groups</Link>
        </Button>
      </p>
    </div>
  )
}
