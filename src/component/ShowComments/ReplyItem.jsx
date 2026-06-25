import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import DarkModal from '../DarkModal/DarkModal';
import axios from 'axios'
import { ImCancelCircle } from "react-icons/im";
import { IoMdPhotos } from "react-icons/io";
import { FALLBACK_IMAGE } from '../../utils/constants'

export default function ReplyItem({ reply, postId, commentId, myId }) {
  const [editOpen, setEditOpen] = useState(false)
  const [editContent, setEditContent] = useState(reply.content || "")
  const [editFile, setEditFile] = useState(null)
  const [editPreview, setEditPreview] = useState(null)
  const queryClient = useQueryClient()
  const replyId = reply.id || reply._id
  const isOwner = (reply.commentCreator?.id || reply.commentCreator?._id) === myId

  const deleteMutation = useMutation({
    mutationFn: () => axios.delete(`https://route-posts.routemisr.com/posts/${postId}/comments/${replyId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replies", postId, commentId] })
      queryClient.invalidateQueries({ queryKey: ["postcomment", postId] })
    }
  })

  const editMutation = useMutation({
    mutationFn: (formData) => axios.put(`https://route-posts.routemisr.com/posts/${postId}/comments/${replyId}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
        "Content-Type": "multipart/form-data"
      }
    }),
    onSuccess: () => {
      setEditOpen(false)
      queryClient.invalidateQueries({ queryKey: ["replies", postId, commentId] })
      queryClient.invalidateQueries({ queryKey: ["postcomment", postId] })
    }
  })

  function handleEdit() {
    const fd = new FormData()
    if (editContent) fd.append("content", editContent)
    if (editFile) fd.append("image", editFile)
    editMutation.mutate(fd)
  }

  return (
    <>
    <div className="ms-13 mt-2 p-2 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <img src={reply.commentCreator?.photo} alt="" className="w-6 h-6 rounded-full" onError={(e) => e.target.src = FALLBACK_IMAGE} />
          <span className="text-sm font-medium">{reply.commentCreator?.name}</span>
          <span className="text-[10px] text-gray-400">{reply.createdAt}</span>
        </div>
        {isOwner && (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <button className="text-gray-400 hover:text-gray-600 px-1 cursor-pointer text-lg font-bold leading-none">⁝</button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Reply actions">
              <DropdownItem key="edit" onPress={() => { setEditContent(reply.content || ""); setEditPreview(reply.image || null); setEditFile(null); setEditOpen(true) }}>
                Edit
              </DropdownItem>
              <DropdownItem key="delete" className="text-danger" color="danger" onPress={() => { if (confirm("Delete this reply?")) deleteMutation.mutate() }}>
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </div>
      {reply.content && <p className="text-xs mt-1">{reply.content}</p>}
      {reply.image && <img src={reply.image} alt="" className="mt-1 rounded-lg max-h-40 object-cover" />}
    </div>

    <DarkModal isOpen={editOpen} onOpenChange={(open) => { if (!open) { setEditPreview(null); setEditFile(null) }; setEditOpen(open) }}>
      {(onClose) => (
        <>
          <div className="border-b-[1px] border-[#292f46] px-6 py-4 text-lg font-semibold">Edit Reply</div>
          <div className="py-6 px-6">
            <div className='block gap-5'>
              <div className='bg-slate-300 item-center w-full block p-1 rounded-2xl'>
                <input type="text" placeholder="write something..." value={editContent} onChange={(e) => setEditContent(e.target.value)} className='items-center m-2 w-full ms-0 rounded-4xl text-danger p-3 border-0' />
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
