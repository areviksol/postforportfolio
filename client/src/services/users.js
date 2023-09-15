import { makeRequest } from "./makeRequest"

export function getUsers() {
  return makeRequest("/users")
}

export function getUserById(userId) {
  return makeRequest(`/users/${userId}`)
}

