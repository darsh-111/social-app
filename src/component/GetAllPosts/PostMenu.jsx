import { useState } from 'react'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import DarkModal from '../DarkModal/DarkModal';
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImCancelCircle } from "react-icons/im";
import { IoMdPhotos } from "react-icons/io";

export default function PostMenu({ postId, body, image, onDone }) {
  const [editOpen, setEditOpen] = useState(false)
  const [editBody, setEditBody] = useState(body || "")
  const [editFile, setEditFile] = useState(null)
  const [editPreview, setEditPreview] = useState(null)
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: () => axios.delete(`https://route-posts.routemisr.com/posts/${postId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getPosts"] })
      queryClient.invalidateQueries({ queryKey: ["myPosts"] })
      try {
        const deleted = JSON.parse(localStorage.getItem("deletedEntities") || "[]")
        if (!deleted.includes(postId)) {
          deleted.push(postId)
          localStorage.setItem("deletedEntities", JSON.stringify(deleted))
        }
      } catch {}
      if (onDone) onDone()
    }
  })

  const editMutation = useMutation({
    mutationFn: (formData) => axios.put(`https://route-posts.routemisr.com/posts/${postId}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
        "Content-Type": "multipart/form-data"
      }
    }),
    onSuccess: () => {
      setEditOpen(false)
      queryClient.invalidateQueries({ queryKey: ["getPosts"] })
      queryClient.invalidateQueries({ queryKey: ["myPosts"] })
      if (onDone) onDone()
    }
  })

  function handleEdit() {
    const fd = new FormData()
    if (editBody) fd.append("body", editBody)
    if (editFile) fd.append("image", editFile)
    editMutation.mutate(fd)
  }

  return (
    <>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <button className="text-xl cursor-pointer px-2 hover:bg-default-100 rounded-full">⁝</button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem key="edit" onPress={() => { setEditBody(body || ""); setEditPreview(image || null); setEditFile(null); setEditOpen(true) }}>Edit</DropdownItem>
          <DropdownItem key="delete" className="text-danger" color="danger" onPress={() => { if (confirm("Delete this post?")) deleteMutation.mutate() }}>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <DarkModal isOpen={editOpen} onOpenChange={(open) => { if (!open) { setEditPreview(null); setEditFile(null) }; setEditOpen(open) }}>
        {(onClose) => (
          <>
            <div className="border-b-[1px] border-[#292f46] px-6 py-4 text-lg font-semibold">Edit Post</div>
            <div className="py-6 px-6">
              <div className='block gap-5'>
                <div className='bg-slate-300 item-center w-full block p-1 rounded-2xl'>
                  <input type="text" placeholder="what's on your mind...!" value={editBody} onChange={(e) => setEditBody(e.target.value)} className='items-center m-2 w-full ms-0 rounded-4xl text-danger p-3 border-0' />
                </div>
                {editPreview && (
                  <div className="py-5 relative w-fit">
                    <img src={editPreview} alt="preview" />
                    <div className='absolute top-6 right-1 cursor-pointer text-black text-4xl'>
                      <ImCancelCircle onClick={() => { setEditFile(null); setEditPreview(null) }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t-[1px] border-[#292f46] px-6 py-4 flex items-center gap-2">
              <label className='cursor-pointer'>
                <input type="file" hidden onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setEditFile(file)
                    setEditPreview(URL.createObjectURL(file))
                  }
                }} />
                <IoMdPhotos size={30} />
              </label>
              <div className="flex-1" />
              <Button color="foreground" variant="light" onPress={onClose} className="hover:bg-danger cursor-pointer">
                Close
              </Button>
              <button disabled={editMutation.isPending} className="bg-[#6f4ef2] shadow-lg shadow-indigo-500/20 cursor-pointer px-5 rounded-2xl py-3 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleEdit}>
                {editMutation.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </>
        )}
      </DarkModal>
    </>
  )
}
