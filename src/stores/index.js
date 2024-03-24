import { createPinia as _createPinia } from 'pinia'
import { useUserListStore } from './userList'

export const createPinia = () => {
  const pinia = _createPinia()
  useUserListStore(pinia)
  return pinia
}