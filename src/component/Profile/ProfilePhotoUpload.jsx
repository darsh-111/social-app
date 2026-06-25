import React, { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { MdPhotoCamera } from "react-icons/md"

export default function ProfilePhotoUpload() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef(null)
  const [pendingFile, setPendingFile] = useState(null)
  const [pendingPreview, setPendingPreview] = useState(null)

  const uploadMutation = useMutation({
    mutationFn: (formData) => axios.put("https://route-posts.routemisr.com/users/upload-photo", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
        "Content-Type": "multipart/form-data"
      }
    }),
    onSuccess: () => {
      setPendingFile(null)
      setPendingPreview(null)
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    }
  })

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingFile(file)
    setPendingPreview(URL.createObjectURL(file))
  }

  function confirmUpload() {
    if (!pendingFile) return
    const fd = new FormData()
    fd.append("photo", pendingFile)
    uploadMutation.mutate(fd)
  }

  function cancelUpload() {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview)
    setPendingFile(null)
    setPendingPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="absolute bottom-2 right-2 bg-[#6f4ef2] text-white p-2 rounded-full shadow-md hover:bg-[#5a3de0] cursor-pointer"
      >
        <MdPhotoCamera size={16} />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoChange}
      />

      {uploadMutation.isPending && <p className="text-blue-500 text-sm">Uploading...</p>}
      {uploadMutation.isError && <p className="text-red-500 text-sm">{uploadMutation.error?.response?.data?.message || "Upload failed"}</p>}

      {pendingPreview && (
        <div className="flex items-center gap-4 mt-3 p-3 border rounded-xl bg-gray-50">
          <img src={pendingPreview} alt="new photo" className="w-16 h-16 rounded-full object-cover" />
          <p className="text-sm text-gray-600">Change profile photo?</p>
          <button onClick={confirmUpload} className="bg-[#6f4ef2] text-white px-4 py-1 rounded-lg text-sm cursor-pointer hover:bg-[#5a3de0]">Yes</button>
          <button onClick={cancelUpload} className="text-gray-500 px-3 py-1 rounded-lg text-sm cursor-pointer hover:bg-gray-200">Cancel</button>
        </div>
      )}
    </>
  )
}
