import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { FiShare2 } from "react-icons/fi";

export default function ShareButton({ postId }) {
  const [shareMsg, setShareMsg] = useState("")
  const queryClient = useQueryClient()

  const shareMutation = useMutation({
    mutationFn: () => axios.post(`https://route-posts.routemisr.com/posts/${postId}/share`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
    onSuccess: (res) => {
      setShareMsg("Shared!")
      const newPost = res?.data?.data?.post
      if (newPost) {
        queryClient.setQueryData(["getPosts"], (old) => {
          if (!old) return old
          return { ...old, data: { ...old.data, data: { ...old.data?.data, posts: [newPost, ...(old.data?.data?.posts || [])] } } }
        })
        queryClient.setQueryData(["myPosts"], (old) => {
          if (!old) return old
          return { ...old, data: { ...old.data, data: { ...old.data?.data, posts: [newPost, ...(old.data?.data?.posts || [])] } } }
        })
      }
      setTimeout(() => setShareMsg(""), 2000)
    },
    onError: (err) => {
      setShareMsg(err.response?.data?.errors || err.response?.data?.message || "Share failed")
      setTimeout(() => setShareMsg(""), 2000)
    }
  })

  return (
    <div className="relative">
      <div onClick={() => shareMutation.mutate()} className="cursor-pointer flex items-center gap-1 active:scale-95 transition">
        <FiShare2 size={18} /> Share
      </div>
      {shareMsg && <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-white bg-black/70 px-2 py-0.5 rounded whitespace-nowrap">{shareMsg}</span>}
    </div>
  )
}
