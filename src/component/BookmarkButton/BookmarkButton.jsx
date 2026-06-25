import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";

export default function BookmarkButton({ postId }) {
  const [isBookmarked, setIsBookmarked] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarkedPosts") || "{}")
    return saved[postId] || false
  })

  const bookmarkMutation = useMutation({
    mutationFn: () => axios.put(`https://route-posts.routemisr.com/posts/${postId}/bookmark`, null, {
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
  })

  function toggle() {
    const newVal = !isBookmarked
    setIsBookmarked(newVal)
    const saved = JSON.parse(localStorage.getItem("bookmarkedPosts") || "{}")
    saved[postId] = newVal
    localStorage.setItem("bookmarkedPosts", JSON.stringify(saved))
    bookmarkMutation.mutate()
  }

  return (
    <div onClick={toggle} className="cursor-pointer flex items-center gap-1 active:scale-95 transition">
      {isBookmarked ? <IoBookmark size={18} className="text-blue-600" /> : <IoBookmarkOutline size={18} />}
    </div>
  )
}
