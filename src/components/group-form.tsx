'use client'
import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import {
  Card,
  Select,
  Link,
  Button,
  Input,
  Spacer,
  CardHeader,
  CardBody,
  CardFooter,
  Tooltip,
  SelectItem,
} from '@nextui-org/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { getGroup } from '@/lib/api'
import { GroupFormValues, groupFormSchema } from '@/lib/schema'
import { subtitle, title } from './primitives'
import { RxTrash } from 'react-icons/rx'

export type Props = {
  group?: NonNullable<Awaited<ReturnType<typeof getGroup>>>
  onSubmit: any
  protectedParticipantIds?: string[]
}

export const GroupForm: React.FC<Props> = ({
  group,
  onSubmit,
  protectedParticipantIds = [''],
}: Props) => {
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: group
      ? {
          name: group.name,
          currency: group.currency,
          participants: group.participants,
        }
      : {
          name: '',
          currency: '',
          participants: [
            { name: 'Kakarot' },
            { name: 'Vegeta' },
            { name: 'Piccolo' },
          ],
        },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'participants',
    keyName: 'key',
  })

  const [activeUser, setActiveUser] = useState<string | null>(null)
  useEffect(() => {
    if (activeUser === null) {
      const currentActiveUser =
        fields.find(
          (f) => f.id === localStorage.getItem(`${group?.id}-activeUser`)
        )?.name || 'None'
      setActiveUser(currentActiveUser)
    }
  }, [activeUser, fields, group?.id])

  const updateActiveUser = () => {
    if (!activeUser) return
    if (group?.id) {
      const participant = group.participants.find((p) => p.name === activeUser)
      if (participant?.id) {
        localStorage.setItem(`${group.id}-activeUser`, participant.id)
      } else {
        localStorage.setItem(`${group.id}-activeUser`, activeUser)
      }
    } else {
      localStorage.setItem('newGroup-activeUser', activeUser)
    }
  }

  const {
    formState: { errors, isSubmitting },
  } = form

  return (
    <form
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values)
      })}
    >
      <Card className="mb-4 mt-5">
        <CardHeader className="flex flex-1 justify-center">
          <h2 className={title({ color: 'green', size: 'sm' })}>
            {group ? 'Edit Group Details' : 'Create Group'}
          </h2>
        </CardHeader>
        <h3 className={(subtitle(), 'ml-4')}>Group Information</h3>
        <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            {...form.register('name')}
            label="Group name"
            placeholder="Summer vacations"
            description="Enter a name for your group."
            className="text-base"
            value={form.watch('name')}
            errorMessage={errors.name?.message}
          />

          <Input
            {...form.register('currency')}
            label="Currency symbol"
            placeholder="$, €, £…"
            description="We'll use it to display amounts."
            className="text-base"
            value={form.watch('currency')}
            errorMessage={errors.currency?.message}
          />
        </CardBody>
      </Card>
      <Card className="mb-4">
        <div className="mt-2">
          <h3 className={(subtitle(), 'ml-4')}>Participants</h3>
          <p className={(subtitle(), 'ml-4 text-gray-400 text-sm')}>
            Enter the name for each participant
          </p>
        </div>

        <CardBody>
          <ul className="flex flex-col gap-2">
            {fields.map((item, index) => (
              <li key={item.key}>
                <div className="flex items-center gap-2">
                  <Input
                    {...form.register(`participants.${index}.name` as const)}
                    label={`Participant #${index + 1}`}
                    className="text-base"
                    value={form.watch(`participants.${index}.name`)}
                    errorMessage={errors.participants?.[index]?.name?.message}
                  />
                  {item.id && protectedParticipantIds.includes(item.id) ? (
                    <Tooltip content="This participant is part of expenses, and can not be removed.">
                      <RxTrash className="size-7 text-destructive text-red-500 hover:text-red-400" />
                    </Tooltip>
                  ) : (
                    <RxTrash
                      onClick={() => remove(index)}
                      className="size-7 text-destructive text-red-500 hover:text-red-400"
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
          <CardFooter className="flex">
            <Button
              className="text-base"
              onClick={() => {
                append({ name: 'Trunks?' })
              }}
            >
              Add Participant
            </Button>
          </CardFooter>
        </CardBody>
      </Card>
      <Card>
        <div className="mt-2">
          <h3 className={(subtitle(), 'ml-4')}>Local Settings</h3>
          <p className={(subtitle(), 'ml-4 text-gray-400 text-sm')}>
            These settings are set per-device.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {activeUser !== null && (
            <Select
              label="Active user"
              placeholder="Select a participant"
              className="max-w-xs p-4"
              selectedKeys={[activeUser]}
              onChange={(e) => setActiveUser(e.target.value)}
            >
              {[{ name: 'None' }, ...form.watch('participants')]
                .filter((item) => item.name.length > 0)
                .map(({ name }) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
            </Select>
          )}
        </div>
      </Card>

      <Button
        type="submit"
        variant="faded"
        isLoading={isSubmitting}
        onClick={updateActiveUser}
        className="text-base mt-4 text-green-600"
      >
        {group ? <>Save</> : <> Create</>}
      </Button>
      {!group && (
        <Button variant="faded" className="ml-3">
          <Link href="/groups" className="text-red-500">
            Cancel
          </Link>
        </Button>
      )}
    </form>
  )
}
