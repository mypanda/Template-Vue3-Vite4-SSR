export const fetchUserList = async () => {
  const result = await fetch('http://localhost:1234/userList.json')
  const userList = await result.json()
  return userList
}