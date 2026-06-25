import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import DarkModal from '../DarkModal/DarkModal'
import ShareButton from '../ShareButton/ShareButton'
import { AiOutlineLike, AiFillLike } from "react-icons/ai"
import { FaRegComment } from "react-icons/fa"
import { IoClose } from "react-icons/io5"

export default function ProfilePhotos() {
  const [showAll, setShowAll] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["myPhotos"],
    queryFn: () => axios.get("https://route-posts.routemisr.com/posts/feed?only=me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
    staleTime: 60000,
  })

  const posts = (data?.data?.data?.posts || []).filter(p => p.image)

  const displayed = showAll ? posts : posts.slice(0, 9)

  const [likedPosts, setLikedPosts] = useState(() => JSON.parse(localStorage.getItem("likedPosts") || "{}"))

  const likeMutation = useMutation({
    mutationFn: (postId) => axios.put(`https://route-posts.routemisr.com/posts/${postId}/like`, null, {
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
  })

  function toggleLike(postId, e) {
    e.stopPropagation()
    const newLiked = !likedPosts[postId]
    setLikedPosts(prev => {
      const updated = { ...prev, [postId]: newLiked }
      localStorage.setItem("likedPosts", JSON.stringify(updated))
      return updated
    })
    setSelectedPost(prev => prev && { ...prev, likesCount: Math.max(0, prev.likesCount + (newLiked ? 1 : -1)) })
    likeMutation.mutate(postId)
  }

  function handleClose() {
    setSelectedPost(null)
    queryClient.invalidateQueries({ queryKey: ["myPhotos"] })
  }

  if (!isLoading && posts.length === 0) return null

  return (
    <>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-lg font-bold mb-3">Photos ({posts.length})</h3>
        {isLoading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-1.5">
              {displayed.map((post, i) => (
                <img
                  key={post.id || i}
                  src={post.image}
                  alt=""
                  className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                  onClick={() => setSelectedPost(post)}
                />
              ))}
            </div>
            {!showAll && posts.length > 9 && (
              <button
                onClick={() => setShowAll(true)}
                className="mt-3 text-sm text-[#6f4ef2] hover:underline cursor-pointer"
              >
                Show more ({posts.length - 9} more)
              </button>
            )}
            {showAll && posts.length > 9 && (
              <button
                onClick={() => setShowAll(false)}
                className="mt-3 text-sm text-gray-500 hover:underline cursor-pointer"
              >
                Show less
              </button>
            )}
          </>
        )}
      </div>

      <DarkModal isOpen={!!selectedPost} onOpenChange={handleClose}>
        {(onClose) => selectedPost && (
          <>
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-10 bg-black/50 text-white rounded-full p-2 cursor-pointer hover:bg-black/70 transition"
              >
                <IoClose size={24} />
              </button>
              <img
                src={selectedPost.image}
                alt=""
                className="w-full max-h-[70vh] object-contain bg-black"
              />
            </div>
            <div className="px-6 py-4 border-t-[1px] border-[#292f46]">
              <p className="text-[#a8b0d3] mb-3">{selectedPost.body}</p>
              <div className="flex items-center gap-6 text-sm">
                <div onClick={(e) => toggleLike(selectedPost.id, e)} className="flex items-center gap-1 cursor-pointer active:scale-95 transition">
                  {likedPosts[selectedPost.id] ? <AiFillLike size={18} className="text-blue-600" /> : <AiOutlineLike size={18} className="text-[#a8b0d3]" />}
                  <span className="text-[#a8b0d3]">{selectedPost.likesCount ?? 0}</span>
                </div>
                <div className="flex items-center gap-1 cursor-pointer active:scale-95 transition" onClick={() => { onClose(); navigate(`/postdetails/${selectedPost.id}`) }}>
                  <FaRegComment size={16} className="text-[#a8b0d3]" />
                  <span className="text-[#a8b0d3]">{selectedPost.commentsCount ?? 0}</span>
                </div>
                <ShareButton postId={selectedPost.id} />
              </div>
            </div>
          </>
        )}
      </DarkModal>
    </>
  )
}
