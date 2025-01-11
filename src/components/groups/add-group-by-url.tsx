import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
  Button,
} from '@nextui-org/react'
import { Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import { saveRecentGroup } from '@/lib/groups'
import { getGroupInfoAction } from './add-group-by-url-buton-action'

type Props = {
  reload: () => void
}

export function AddGroupByUrlButton({ reload }: Props) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState(false)
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  return (
    <Popover isOpen={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button>
          <>Add by URL</>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="[&_p]:text-sm flex flex-col gap-3">
        <h3 className="font-bold">Add Group by URL</h3>
        <form
          className="flex gap-2"
          onSubmit={async (event) => {
            event.preventDefault()
            const [, groupId] =
              url.match(
                new RegExp(`${window.location.origin}/groups/([^/]+)`)
              ) ?? []
            setPending(true)
            const group = groupId ? await getGroupInfoAction(groupId) : null
            setPending(false)
            if (!group) {
              setError(true)
            } else {
              saveRecentGroup({ id: group.id, name: group.name })
              reload()
              setUrl('')
              setOpen(false)
            }
          }}
        >
          <Input
            type="url"
            required
            placeholder="https://dvdime.vercel.app/..."
            className="flex-1 text-base"
            value={url}
            disabled={pending}
            onChange={(event) => {
              setUrl(event.target.value)
              setError(false)
            }}
          />
          <Button size="lg" type="submit" disabled={pending}>
            {pending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus size={16} />
            )}
          </Button>
        </form>
        {error && (
          <p className="text-destructive">
            Oops, seems like the URL is invalid 😅
          </p>
        )}
      </PopoverContent>
    </Popover>
  )
}
