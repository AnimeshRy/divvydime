const STORAGE_KEY = 'recentGroups'
const STARRED_GROUPS_STORAGE_KEY = 'starredGroups'
const ARCHIVED_GROUPS_STORAGE_KEY = 'archivedGroups'

export function getRecentGroups() {
    const groupsInStorageJson = localStorage.getItem(STORAGE_KEY)
    const groupsInStorageRaw = groups
}
