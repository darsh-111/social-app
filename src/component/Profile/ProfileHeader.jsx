import { Avatar } from "@heroui/react"
import ProfilePhotoUpload from './ProfilePhotoUpload'

export default function ProfileHeader({ user, showUpload = true }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white">
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-violet-500 to-purple-700">
          {user?.cover && (
            <img src={user.cover} alt="" className="w-full h-full object-cover" />
          )}
      </div>

      <div className="px-4 pb-4">
        <div className="relative flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 sm:-mt-20 mb-4">
          <div className="relative shrink-0">
            <Avatar
              isBordered
              color="secondary"
              src={user?.photo}
              name={user?.name}
              className="w-32 h-32 sm:w-40 sm:h-40 text-large ring-4 ring-white"
            />
            {showUpload && <ProfilePhotoUpload />}
          </div>
          <div className="sm:pb-1">
            <h2 className="text-2xl font-bold">{user?.name}</h2>
          </div>
        </div>
      </div>
    </div>
  )
}
