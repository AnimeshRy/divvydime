import { Metadata } from 'next'
import RecentGroupList from './recent-group-list'

export const metadata: Metadata = {
  title: 'Recently Visited Groups',
}

export default async function GroupsPage() {
  return (
    <>
      <RecentGroupList />
    </>
  )
}
