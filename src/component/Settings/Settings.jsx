import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ProfileIntro from '../Profile/ProfileIntro'
import ProfileHeader from '../Profile/ProfileHeader'
import { FiLock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'

export default function Settings() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [passwordData, setPasswordData] = useState({ password: "", newPassword: "" })
  const [pwError, setPwError] = useState(null)
  const [pwSuccess, setPwSuccess] = useState(null)
  const [pwLoading, setPwLoading] = useState(false)

  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: () => axios.get("https://route-posts.routemisr.com/users/profile-data", {
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
  })
  const user = data?.data?.data?.user

  async function handleChangePassword(e) {
    e.preventDefault()
    setPwError(null)
    setPwSuccess(null)
    if (!passwordData.password || !passwordData.newPassword) {
      setPwError("All fields are required")
      return
    }
    if (passwordData.newPassword.length < 8) {
      setPwError("New password must be at least 8 characters")
      return
    }
    setPwLoading(true)
    try {
      const res = await axios.patch(
        "https://route-posts.routemisr.com/users/change-password",
        { password: passwordData.password, newPassword: passwordData.newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` } }
      )
      const newToken = res.data.data.token
      localStorage.setItem("usertoken", newToken)
      queryClient.invalidateQueries({ queryKey: ["profile"] })
      setPwSuccess("Password changed successfully!")
      setPasswordData({ password: "", newPassword: "" })
    } catch (err) {
      setPwError(err.response?.data?.message || "Failed to change password")
    } finally {
      setPwLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <ProfileHeader user={user} />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-[35%] shrink-0 lg:sticky lg:top-4 lg:self-start space-y-4">
          <ProfileIntro user={user} />
        </div>

        <div className="flex-1 min-w-0 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FiLock /> Change Password
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordData.password}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none"
                />
              </div>
              {pwError && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <FiAlertCircle /> {pwError}
                </div>
              )}
              {pwSuccess && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <FiCheckCircle /> {pwSuccess}
                </div>
              )}
              <button
                type="submit"
                disabled={pwLoading}
                className="bg-[#6f4ef2] text-white px-6 py-2.5 rounded-lg hover:bg-[#5a3de0] disabled:opacity-50 cursor-pointer transition"
              >
                {pwLoading ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
