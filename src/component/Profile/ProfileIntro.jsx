import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdEmail, MdPerson, MdPhone, MdWc } from "react-icons/md";
import FollowersModal from './FollowersModal'

export default function ProfileIntro({ user }) {
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)

  return (
    <div className="rounded-xl shadow-lg bg-white p-4">
      <h3 className="text-lg font-bold mb-3">Intro</h3>
      <div className="flex gap-4 mb-4 pb-4 border-b border-gray-200">
        <div className="text-center flex-1 cursor-pointer hover:opacity-70" onClick={() => setShowFollowers(true)}>
          <p className="text-xl font-bold">{user?.followersCount ?? 0}</p>
          <p className="text-xs text-gray-500">Followers</p>
        </div>
        <div className="text-center flex-1 cursor-pointer hover:opacity-70" onClick={() => setShowFollowing(true)}>
          <p className="text-xl font-bold">{user?.followingCount ?? 0}</p>
          <p className="text-xs text-gray-500">Following</p>
        </div>
      </div>
      <FollowersModal isOpen={showFollowers} onClose={() => setShowFollowers(false)} title="Followers" users={user?.followers || []} />
      <FollowersModal isOpen={showFollowing} onClose={() => setShowFollowing(false)} title="Following" users={user?.following || []} />
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-xl"><MdEmail /></span>
          <span className="text-sm">{user?.email}</span>
        </div>
        {user?.username && (
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-xl"><MdPerson /></span>
            <span className="text-sm">{user.username}</span>
          </div>
        )}
        {user?.phone && (
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-xl"><MdPhone /></span>
            <span className="text-sm">{user.phone}</span>
          </div>
        )}
        {user?.gender && (
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-xl"><MdWc /></span>
            <span className="text-sm">{user.gender}</span>
          </div>
        )}
      </div>
    </div>
  )
}
