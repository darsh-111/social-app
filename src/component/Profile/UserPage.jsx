import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { InfinitySpin } from 'react-loader-spinner'
import AllPosts from '../GetAllPosts/AllPosts'
import ProfileHeader from './ProfileHeader'
import ProfileIntro from './ProfileIntro'
import FollowButton from '../Suggestions/FollowButton'

export default function UserPage() {
  const { userId } = useParams()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => axios.get(`https://route-posts.routemisr.com/users/${userId}/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
    enabled: !!userId
  })
  const user = data?.data?.data?.user
  const isFollowing = data?.data?.data?.isFollowing

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () => axios.get(`https://route-posts.routemisr.com/users/${userId}/posts`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
    enabled: !!userId
  })
  const userPosts = postsData?.data?.data?.posts || []

  if (isLoading) return <div className="flex justify-center mt-20"><InfinitySpin color="#7c3aed" /></div>
  if (!user) return <p className="text-center mt-20 text-gray-500">User not found</p>

  return (
    <div className="space-y-6">
      <ProfileHeader user={user} showUpload={false} />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-[35%] shrink-0 lg:sticky lg:top-4 lg:self-start space-y-4">
          <ProfileIntro user={user} />
          {isFollowing !== undefined && (
            <FollowButton userId={userId} initialFollowing={isFollowing} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold mb-4">Posts ({userPosts.length})</h3>
          {postsLoading && <InfinitySpin color="#7c3aed" />}
          {!postsLoading && userPosts.length === 0 && <p className="text-gray-400">No posts yet</p>}
          <div className="space-y-4">
            {userPosts.map((p) => (
              <AllPosts key={p.id} post={p} fullWidth />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
