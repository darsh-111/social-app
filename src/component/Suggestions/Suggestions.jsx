import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { InfinitySpin } from 'react-loader-spinner'
import { FALLBACK_IMAGE } from '../../utils/constants'
import FollowButton from './FollowButton'

export default function Suggestions() {
  const navigate = useNavigate()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["suggestions"],
    queryFn: () => axios.get("https://route-posts.routemisr.com/users/suggestions", {
      params: { limit: 20 },
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
  })

  if (isLoading) return <div className="flex justify-center mt-20"><InfinitySpin color="#7c3aed" /></div>
  if (isError) return <p className="text-red-500 text-center mt-20">{error?.response?.data?.message || "Failed to load suggestions"}</p>

  const users = data?.data?.data?.suggestions || []

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Suggestions</h2>
      {users.length === 0 && <p className="text-gray-400 text-center mt-10">No suggestions</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div key={user._id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
            <img
              src={user.photo}
              alt=""
              className="w-12 h-12 rounded-full object-cover cursor-pointer"
              onError={(e) => { e.target.src = FALLBACK_IMAGE }}
              onClick={() => navigate(`/profile/${user._id}`)}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate cursor-pointer hover:underline"
                onClick={() => navigate(`/profile/${user._id}`)}>
                {user.name}
              </p>
              <p className="text-xs text-gray-400">{user.followersCount} followers</p>
            </div>
            <FollowButton userId={user._id} />
          </div>
        ))}
      </div>
    </div>
  )
}
