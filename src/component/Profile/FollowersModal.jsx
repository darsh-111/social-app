import { useNavigate } from 'react-router-dom'
import DarkModal from '../DarkModal/DarkModal'
import { FALLBACK_IMAGE } from '../../utils/constants'

export default function FollowersModal({ isOpen, onClose, title, users }) {
  const navigate = useNavigate()

  const items = (users || []).map((u) => {
    if (typeof u === "string") {
      return { _id: u, id: u, name: u.slice(-6), photo: FALLBACK_IMAGE }
    }
    return u
  })

  return (
    <DarkModal isOpen={isOpen} onOpenChange={onClose}>
      {(onModalClose) => (
        <>
          <div className="border-b-[1px] border-[#292f46] px-6 py-4 text-lg font-semibold">{title}</div>
          <div className="py-4 px-6 max-h-80 overflow-y-auto">
            {items.length === 0 && <p className="text-gray-400 text-center">No users</p>}
            {items.map((u) => (
              <div
                key={u._id || u.id}
                className="flex items-center gap-3 py-2 cursor-pointer hover:bg-white/5 rounded-lg px-2"
                onClick={() => { onModalClose(); onClose(); navigate(`/profile/${u._id || u.id}`) }}
              >
                <img
                  src={u.photo}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => { e.target.src = FALLBACK_IMAGE }}
                />
                <span className="font-medium">{u.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </DarkModal>
  )
}
