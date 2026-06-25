import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { InfinitySpin } from 'react-loader-spinner'
import AllPosts from '../GetAllPosts/AllPosts'

export default function Bookmarks() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => axios.get("https://route-posts.routemisr.com/users/bookmarks", {
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
  })

  if (isLoading) return <div className="flex justify-center mt-20"><InfinitySpin color="#7c3aed" /></div>
  if (isError) return <p className="text-red-500 text-center mt-20">{error?.response?.data?.message || "Failed to load bookmarks"}</p>

  const posts = data?.data?.data?.bookmarks || []

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Bookmarks ({posts.length})</h2>
      {posts.length === 0 && <p className="text-gray-400 text-center mt-10">No bookmarks yet</p>}
      <div className="space-y-4">
        {posts.map((post) => (
          <AllPosts key={post.id} post={post} fullWidth />
        ))}
      </div>
    </div>
  )
}
