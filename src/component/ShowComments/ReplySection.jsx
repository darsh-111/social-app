import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { IoSend } from "react-icons/io5"

export default function ReplySection({ postId, commentId }) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState("")
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (content) => axios.post(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies`, { content }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
    onSuccess: () => {
      setText("")
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: ["postcomment", postId] })
      queryClient.invalidateQueries({ queryKey: ["replies", postId, commentId] })
    }
  })

  function handleSend() {
    if (!text.trim()) return
    mutation.mutate(text)
  }

  return (
    <div className="ms-13 mt-2">
      <button onClick={() => setOpen(!open)} className="text-[11px] text-blue-600 hover:underline cursor-pointer">
        Reply
      </button>
      {open && (
        <div className="flex items-center gap-1 mt-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a reply..."
            rows={2}
            className="flex-1 bg-gray-100 p-2 rounded-lg text-xs outline-none resize-none"
          />
          <button onClick={handleSend} disabled={mutation.isPending} className="text-blue-600 cursor-pointer disabled:opacity-50">
            {mutation.isPending ? "..." : <IoSend size={14} />}
          </button>
        </div>
      )}
      {mutation.isError && <p className="text-red-500 text-xs mt-1">{mutation.error?.response?.data?.message}</p>}
    </div>
  )
}
