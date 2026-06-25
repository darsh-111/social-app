import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { InfinitySpin } from 'react-loader-spinner'
import AllPosts from "../GetAllPosts/AllPosts"

export default function MyPosts() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["myPosts"],
    queryFn: () => axios.get("https://route-posts.routemisr.com/posts/feed?only=me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
  })

  if (isLoading) return <InfinitySpin color="#7c3aed" />
  if (isError) return <p className="text-red-500">{error?.response?.data?.message}</p>

  const posts = data?.data?.data?.posts || []

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">My Posts ({posts.length})</h3>
      {posts.length === 0 && <p className="text-gray-400">No posts yet</p>}
      <div className="space-y-4">
        {posts.map((post) => (
          <AllPosts key={post.id} post={post} fullWidth />
        ))}
      </div>
    </div>
  )
}
