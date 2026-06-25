import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { InfinitySpin } from 'react-loader-spinner'
import { Link } from 'react-router-dom'
import { BsBookmark } from 'react-icons/bs'
import ProfileHeader from './ProfileHeader'
import ProfileIntro from './ProfileIntro'
import MyPosts from './MyPosts'
import ProfilePhotos from './ProfilePhotos'

function getMyId() {
  const token = localStorage.getItem("usertoken")
  if (!token) return null
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
    return JSON.parse(atob(base64)).user
  } catch { return null }
}

export default function Profile() {
  const myId = getMyId()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["myProfile", myId],
    queryFn: () => axios.get(`https://route-posts.routemisr.com/users/${myId}/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
    enabled: !!myId
  })

  const { data: bookmarksData } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => axios.get("https://route-posts.routemisr.com/users/bookmarks", {
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
  })
  const bookmarksCount = bookmarksData?.data?.data?.bookmarks?.length || 0

  if (isLoading) return <div className="flex justify-center mt-20"><InfinitySpin color="#7c3aed" /></div>
  if (isError) return <p className="text-red-500 text-center mt-20">{error?.response?.data?.message || "Failed to load profile"}</p>

  const user = data?.data?.data?.user

  return (
    <div className="space-y-6">
      <ProfileHeader user={user} />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-[35%] shrink-0 lg:sticky lg:top-4 lg:self-start space-y-4">
          <ProfileIntro user={user} />
          <ProfilePhotos />
          <Link to="/bookmarks" className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3 hover:shadow-md transition">
            <BsBookmark className="text-[#6f4ef2]" size={20} />
            <span className="font-medium">Saved ({bookmarksCount})</span>
          </Link>
        </div>
        <div className="flex-1 min-w-0">
          <MyPosts />
        </div>
      </div>
    </div>
  )
}
