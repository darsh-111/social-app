import { useState } from 'react'
import CommentMenu from './CommentMenu'
import ReplySection from './ReplySection'
import ReplyItem from './ReplyItem'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FALLBACK_IMAGE } from '../../utils/constants'

export default function ShowComments({ comment, postId, myId }) {
    const { id, _id, commentCreator, content, createdAt, image } = comment
    const commentId = _id || id
    const { name, photo } = commentCreator
    const commentOwnerId = commentCreator?.id || commentCreator?._id

    const [isLiked, setIsLiked] = useState(() => {
      const saved = JSON.parse(localStorage.getItem("likedComments") || "{}")
      return saved[commentId] || false
    })
    const [likesCount, setLikesCount] = useState(() => {
      const saved = JSON.parse(localStorage.getItem("likedCommentsCount") || "{}")
      return saved[commentId] ?? comment.likesCount ?? 0
    })

    const likeMutation = useMutation({
      mutationFn: () => axios.put(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/like`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
      }),
    })

    function toggleLike() {
      const newLiked = !isLiked
      setIsLiked(newLiked)
      const newCount = Math.max(0, likesCount + (newLiked ? 1 : -1))
      setLikesCount(newCount)

      const savedLiked = JSON.parse(localStorage.getItem("likedComments") || "{}")
      savedLiked[commentId] = newLiked
      localStorage.setItem("likedComments", JSON.stringify(savedLiked))

      const savedCount = JSON.parse(localStorage.getItem("likedCommentsCount") || "{}")
      savedCount[commentId] = newCount
      localStorage.setItem("likedCommentsCount", JSON.stringify(savedCount))

      likeMutation.mutate()
    }

    const { data: repliesData } = useQuery({
      queryKey: ["replies", postId, commentId],
      queryFn: () => axios.get(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
      }),
      enabled: !!postId && !!commentId
    })
    const replies = repliesData?.data?.data?.replies || []

    return (
        <div className="p-4 border-t border-gray-200">
            <div className="block">
                <div className="flex gap-3 justify-between items-start">
                    <div className="flex gap-3">
                    <img
                        alt="user avatar"
                        height={40}
                        src={photo}
                        width={40}
                        className="rounded-lg flex-shrink-0"
                        onError={(e) => {
                            e.target.src = FALLBACK_IMAGE
                        }}
                    />
                    <div className="flex flex-col">
                        <p className="text-md">{name}</p>
                        <p className="text-small text-default-500">{createdAt}</p>
                    </div>
                    </div>
                    {postId && myId === commentOwnerId && (
                      <CommentMenu postId={postId} commentId={commentId} content={content} image={image} />
                    )}
                </div>
                <div className='flex flex-col gap-y-3.5'>
                    {
                        content && <div className="flex"><p className="ms-13 mt-3">{content}</p></div>
                    }
                    {image && <div className="flex"><img src={image} alt="comment image" /></div>}
                </div>
                <div className="ms-13 mt-2 flex items-center gap-4 text-sm">
                  <div onClick={toggleLike} className="cursor-pointer flex items-center gap-1 active:scale-95 transition">
                    {isLiked ? <AiFillLike size={14} className="text-blue-600" /> : <AiOutlineLike size={14} />} {likesCount}
                  </div>
                </div>
                {postId && <ReplySection postId={postId} commentId={commentId} />}
                {replies.map((reply) => (
                  <ReplyItem key={reply.id || reply._id} reply={reply} postId={postId} commentId={commentId} myId={myId} />
                ))}
            </div>
        </div>
    )
}
