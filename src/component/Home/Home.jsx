import { useRef, useState } from 'react'
import axios from 'axios'
import AllPosts from '../GetAllPosts/AllPosts';
import { InfinitySpin } from 'react-loader-spinner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Avatar, Button, useDisclosure } from '@heroui/react';
import DarkModal from '../DarkModal/DarkModal';
import { ImCancelCircle } from "react-icons/im";
import { IoMdPhotos } from "react-icons/io";
import { useNavigate } from 'react-router-dom';


export default function Home() {
  const [isloaded, setisloaded] = useState(false)
  const [postText, setPostText] = useState('')
  const [postFile, setPostFile] = useState(null)
  const [postError, setPostError] = useState(null)
  const imageUrlRef = useRef(null)
  const query = useQueryClient()
  const navigate = useNavigate()
  function GetPosts() {
    return axios.get("https://route-posts.routemisr.com/posts",
      {
        params: { sort: "-createdAt" },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("usertoken")}`
        }
      }
    )
  }
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { isPending, mutate } = useMutation({
    mutationFn: (formData) => axios.post("https://route-posts.routemisr.com/posts", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("usertoken")}`
      }
    }),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getPosts"] })
      handelremoveimage()
      setPostText('')
    },
    onError: (err) => {
      setPostError(err.response?.data?.message || "Post failed")
      if (err.response?.status === 401) {
        localStorage.removeItem("usertoken")
        navigate("/login")
      }
    }
  })

  const { isError, isLoading, data, error } = useQuery({
    queryKey: ["getPosts"],
    queryFn: GetPosts,

  })

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: () => axios.get("https://route-posts.routemisr.com/users/profile-data", {
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
  })
  const profile = profileData?.data?.data?.user

  function handelimage(e) {
    const file = e.target.files[0]
    if (!file) return
    setPostFile(file)
    if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current)
    }
    const path = URL.createObjectURL(file)
    imageUrlRef.current = path
    setisloaded(path)
  }

  function handelremoveimage() {
    if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current)
      imageUrlRef.current = null
    }
    setisloaded(false)
    setPostFile(null)
  }

  if (isLoading) {
    return <div className='flex min-h-screen items-center justify-center'><InfinitySpin
      width="200"
      color="#7c3aed"
    />
    </div>
  }
  if (isError) {
    return <div>
      {error.message}    </div>
  }
  return (<>

    <div className="flex gap-5 w-full">
      <div>      <Avatar isBordered color="primary" src={profile?.photo || "https://i.pravatar.cc/150?u=a04258a2462d826712d"} />
      </div>
      <div className='bg-slate-300 flex items-center w-full p-1 rounded-2xl'>
        <input type="text" readOnly placeholder='what do your think....!' onClick={onOpen} className='m-2 w-full ms-0 rounded-2xl p-3 border-0 focus:ring-2 focus:ring-yellow-400 placeholder-black' />
      </div>
      <DarkModal isOpen={isOpen} onOpenChange={onOpenChange}>
          {(onClose) => (
            <>
              <div className="border-b-[1px] border-[#292f46] px-6 py-4 text-lg font-semibold">Create Post</div>
              <div className="py-6 px-6">
                <div className='block gap-5'> <div className='bg-slate-300 flex items-center w-full p-1 rounded-2xl'>
                  <input type="text" placeholder='what do your think....!' value={postText} onChange={(e) => { setPostText(e.target.value); setPostError(null) }} className='m-2 w-full ms-0 rounded-2xl p-3 border-0 focus:ring-2 focus:ring-yellow-400 placeholder-gray-700' />
                </div>
                  {isloaded && <div className="py-5 relative w-fit">
                    <img src={isloaded} alt="tesst" />
                    <div className='absolute top-6 right-1 cursor-pointer text-black text-4xl'>
                      <ImCancelCircle onClick={() => handelremoveimage()} /> </div>
                  </div>}
                </div>
                  {postError && <p className="text-red-500 text-sm text-center mt-2">{postError}</p>}
              </div>
              <div className="border-t-[1px] border-[#292f46] px-6 py-4 flex items-center gap-2">
                <label className='cursor-pointer'>
                  <input type="file" hidden onChange={(e) => handelimage(e)} />
                  <IoMdPhotos size={30} />
                </label>
                <div className="flex-1" />
                <Button color="foreground" variant="light" onPress={onClose} className="hover:bg-danger cursor-pointer">
                  Close
                </Button>
                <button disabled={isPending} className="bg-[#6f4ef2] shadow-lg shadow-indigo-500/20 cursor-pointer px-5 rounded-2xl py-3 disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () {
                  const fd = new FormData()
                  if (postText) fd.append("body", postText)
                  if (postFile) fd.append("image", postFile)
                  mutate(fd)
                  onClose()
                }}>
                  {isPending ? "Posting..." : "Post"} </button>
              </div>
            </>
          )}
        </DarkModal>

    </div>
    {data?.data.data.posts?.map((post) => <div key={post.id} className='mb-7.5'>
      <AllPosts post={post} />
    </div>)}
  </>
  )
}
