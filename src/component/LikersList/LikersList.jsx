import { useState } from 'react'
import { FALLBACK_IMAGE } from '../../utils/constants'
import DarkModal from '../DarkModal/DarkModal';
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export default function LikersList({ postId, count }) {
  const [open, setOpen] = useState(false)

  const { data } = useQuery({
    queryKey: ["postLikers", postId],
    queryFn: () => axios.get(`https://route-posts.routemisr.com/posts/${postId}/likes`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
    enabled: open
  })

  const likers = data?.data?.data?.likes || []

  return (
    <>
      <span onClick={() => { if (count > 0) setOpen(true) }} className="cursor-pointer hover:underline text-sm">{count}</span>
      <DarkModal isOpen={open} onOpenChange={setOpen}>
        {(onClose) => (
          <>
            <div className="border-b-[1px] border-[#292f46] px-6 py-4 text-lg font-semibold">Likes</div>
            <div className="py-4 px-6">
              {likers.length === 0 && <p className="text-gray-400 text-center">No likes yet</p>}
              {likers.map((user) => (
                <div key={user.id || user._id} className="flex items-center gap-3 py-2">
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => { e.target.src = FALLBACK_IMAGE }}
                  />
                  <span className="font-medium">{user.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </DarkModal>
    </>
  )
}
