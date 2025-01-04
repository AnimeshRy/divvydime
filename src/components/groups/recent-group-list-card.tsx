'use client';

import { RecentGroup } from '@/lib/schema-utils';
import { useRouter } from 'next/navigation';
import { RecentGroupsState } from '../../app/groups/recent-group-list';
import { SetStateAction } from 'react';
import { toast } from 'react-hot-toast';
import { getArchivedGroups, getStarredGroups } from '@/lib/groups';
import {
  Card,
  CardHeader,
  Divider,
  CardBody,
  CardFooter,
  Button,
  Tooltip,
} from '@nextui-org/react';
import Link from 'next/link';

export function RecentGroupListCard({
  group,
  state,
  setState,
}: {
  group: RecentGroup;
  state: RecentGroupsState;
  setState: (state: SetStateAction<RecentGroupsState>) => void;
}) {
  const router = useRouter();

  const details =
    state.status === 'complete'
      ? state.groupsDetails.find((d) => d.id === group.id)
      : null;

  if (state.status === 'pending') return null;

  const refreshGroupsFromStorage = () =>
    setState({
      ...state,
      starredGroups: getStarredGroups(),
      archivedGroups: getArchivedGroups(),
    });

  const isStarred = state.starredGroups.includes(group.id);
  const isArchived = state.archivedGroups.includes(group.id);

  return (
    <li key={group.id}>
      <Card
        className="max-w-[400px] cursor-pointer"
        isHoverable
        onClick={() => router.push(`/groups/${group.id}`)}
      >
        <CardHeader className="flex justify-between items-center">
          <div>
            <p>{group.name}</p>
          </div>
          <div className="flex gap-2">
            <Tooltip content={isStarred ? 'Unstar' : 'Star'}>
              <Button
                color={isStarred ? 'warning' : 'default'}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isStarred) {
                    // Logic for unstar
                  } else {
                    // Logic for star
                  }
                  refreshGroupsFromStorage();
                }}
              >
                {isStarred ? '★' : '☆'}
              </Button>
            </Tooltip>
            <Tooltip content={isArchived ? 'Unarchive' : 'Archive'}>
              <Button
                color={isArchived ? 'secondary' : 'default'}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isArchived) {
                    // Logic for unarchive
                  } else {
                    // Logic for archive
                  }
                  refreshGroupsFromStorage();
                }}
              >
                {isArchived ? '📦' : '📥'}
              </Button>
            </Tooltip>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <p>
            {details
              ? `Created on: ${new Date(details.createdAt).toLocaleDateString()}`
              : 'Fetching details...'}
          </p>
          <p color="gray">
            {details
              ? `Participants: ${details._count.participants}`
              : 'Loading participants...'}
          </p>
        </CardBody>
        <CardFooter>
          <Link href={`/groups/${group.id}`} passHref>
            <Button color="primary">
              View Group
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </li>
  );
}

export default RecentGroupListCard;
