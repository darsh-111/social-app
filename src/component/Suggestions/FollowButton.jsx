import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

export default function FollowButton({ userId, initialFollowing = false }) {
  const [following, setFollowing] = useState(initialFollowing)

  const mutation = useMutation({
    mutationFn: () => axios.put(`https://route-posts.routemisr.com/users/${userId}/follow`, null, {
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
  })

  function toggle() {
    const newVal = !following
    setFollowing(newVal)
    mutation.mutate(undefined, {
      onError: () => setFollowing(!newVal)
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={mutation.isPending}
      className={`text-sm px-4 py-1.5 rounded-lg cursor-pointer transition disabled:opacity-50 ${
        following
          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
          : "bg-[#6f4ef2] text-white hover:bg-[#5a3de0]"
      }`}
    >
      {mutation.isPending ? "..." : following ? "Following" : "Follow"}
    </button>
  )
}
