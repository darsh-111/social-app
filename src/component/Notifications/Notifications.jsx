import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { InfinitySpin } from 'react-loader-spinner'
import axios from 'axios'
import { AiOutlineLike } from "react-icons/ai"
import { FaRegComment } from "react-icons/fa"
import { FiUserPlus, FiShare2 } from "react-icons/fi"
import { IoSend } from "react-icons/io5"
import { IoMdNotificationsOutline } from "react-icons/io"
import { FALLBACK_IMAGE } from '../../utils/constants'

function getIcon(type) {
  switch (type) {
    case "like_post": return <AiOutlineLike size={20} />
    case "create_comment": return <FaRegComment size={18} />
    case "create_reply": return <IoSend size={18} className="rotate-180" />
    case "follow_user": return <FiUserPlus size={18} />
    case "share_post": return <FiShare2 size={18} />
    default: return <IoMdNotificationsOutline size={20} />
  }
}

function getMessage(n) {
  const name = n?.actor?.name || "Someone"
  switch (n.type) {
    case "like_post": return `${name} liked your post`
    case "create_comment": return `${name} commented on your post`
    case "create_reply": return `${name} replied to your comment`
    case "follow_user": return `${name} started following you`
    case "share_post": return `${name} shared your post`
    default: return `${name} interacted with your post`
  }
}

function getLink(n) {
  if (n.type === "follow_user") return `/profile/${n.actor?._id}`
  const postId = n?.entity?._id || n.entityId
  if (n.entityType === "post" && postId) return `/postdetails/${postId}`
  return "#"
}

export default function Notifications() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => axios.get("https://route-posts.routemisr.com/notifications", {
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
  })

  const { data: unreadData } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: () => axios.get("https://route-posts.routemisr.com/notifications/unread-count", {
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
    refetchInterval: 30000
  })

  const markReadMutation = useMutation({
    mutationFn: (notifId) => axios.patch(`https://route-posts.routemisr.com/notifications/${notifId}/read`, null, {
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
  })

  const markAllMutation = useMutation({
    mutationFn: () => axios.patch("https://route-posts.routemisr.com/notifications/read-all", null, {
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] })
    }
  })

  const raw = data?.data?.data?.notifications || []
  const deleted = JSON.parse(localStorage.getItem("deletedEntities") || "[]")
  const notifications = raw.filter((n) => !deleted.includes(n.entityId))
  const unreadCount = unreadData?.data?.data?.unreadCount ?? 0

  function handleClick(n) {
    if (!n.isRead) {
      markReadMutation.mutate(n._id)
      queryClient.setQueryData(["notifications"], (old) => {
        if (!old) return old
        const updated = { ...old }
        const list = updated.data?.data?.notifications?.map((x) =>
          x._id === n._id ? { ...x, isRead: true } : x
        )
        if (list) updated.data.data.notifications = list
        return updated
      })
      queryClient.setQueryData(["unreadCount"], (old) => {
        if (!old) return old
        return { ...old, data: { ...old.data, data: { unreadCount: Math.max(0, (old.data?.data?.unreadCount || 0) - 1) } } }
      })
    }
    const link = getLink(n)
    if (link !== "#") navigate(link)
  }

  if (isLoading) return <div className="flex justify-center mt-20"><InfinitySpin color="#7c3aed" /></div>
  if (isError) return <p className="text-red-500 text-center mt-20">{error?.response?.data?.message || "Failed to load notifications"}</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Notifications</h2>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllMutation.mutate()}
            className="text-sm text-[#6f4ef2] hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>
      {notifications.length === 0 && <p className="text-gray-400 text-center mt-10">No notifications yet</p>}
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition ${n.isRead ? "bg-white" : "bg-[#f0eeff]"}`}
              onClick={() => handleClick(n)}
            >
              <img
                src={n?.actor?.photo}
                alt=""
                className="w-12 h-12 rounded-full object-cover shrink-0 cursor-pointer hover:opacity-80"
                onClick={(e) => { e.stopPropagation(); navigate(`/profile/${n.actor?._id}`) }}
                onError={(e) => { e.target.src = FALLBACK_IMAGE }}
              />
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${n.isRead ? "text-gray-600" : "font-semibold text-gray-900"}`}>
                  {getMessage(n)}
                </p>
                <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
              </div>
              <span className="shrink-0 text-[#6f4ef2]">{getIcon(n.type)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
