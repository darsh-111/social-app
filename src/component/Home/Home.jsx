import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import AllPosts from '../GetAllPosts/AllPosts';
import { InfinitySpin } from 'react-loader-spinner';
import { Query, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Avatar } from '@heroui/react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { ImCancelCircle } from "react-icons/im";
import { IoMdPhotos } from "react-icons/io";


export default function Home() {
  const [isloaded, setisloaded] = useState(false)
  const inputimage = useRef(null)
  const inputtext = useRef(null)
  const query = useQueryClient()
  // const imageTest = "https://static.vecteezy.com/system/resources/thumbnails/050/393/628/small/cute-curious-gray-and-white-kitten-in-a-long-shot-photo.jpg";
  function GetPosts() {
    return axios.get("https://route-posts.routemisr.com/posts",
      {
        params: { sort: "createdAt" },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("usertoken")}`
        }
      }
    )
  }
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  function prepairdata() {

    const formatdta = new FormData()
    if (inputtext.current.value) {

      formatdta.append("body", inputtext.current.value)
    }
    if (inputimage.current.files[0]) {

      formatdta.append("image", inputimage.current.files[0])
    }
    return formatdta
  }

  function creatpost() {
    return axios.post("https://route-posts.routemisr.com/posts", prepairdata(), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("usertoken")}`
      }
    })

  }
  const { isPending, mutate } = useMutation({
    mutationFn: creatpost,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getPosts"] })
      handelremoveimage()
    }
  })

  const { isError, isLoading, data, error } = useQuery({
    queryKey: ["getPosts"],
    queryFn: GetPosts,

  })
  function handelimage(e) {
    // console.log(e.target.files[0]);
    const path = URL.createObjectURL(e.target.files[0])
    setisloaded(path)
  }
  function handelremoveimage() {
    setisloaded(false)
    inputimage.current.value = "";
    //inputtext.current.value = "";
  }

  if (isLoading) {
    return <div className='flex min-h-screen items-center justify-center'><InfinitySpin
      width="200"
      color="#4fa94d"
    />
    </div>
  }
  if (isError) {
    return <div>
      {error}    </div>
  }
  return (<>

    <div className="w-[40%] m-auto my-5 flex gap-5">
      <div>      <Avatar isBordered color="primary" src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
      </div>
      <div className='bg-slate-300 item-center w-full block p-1 rounded-2xl'>
        <input type="text" readOnly placeholder='what do your think....!' onClick={onOpen} className='items-center m-2 w-full ms-0 rounded-4xl text-danger' />
      </div>
      <div hidden>
        <Button color="secondary" >
          Open Modal
        </Button>
        <Modal
          backdrop="opaque"
          classNames={{
            body: "py-6",
            backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
            base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
            header: "border-b-[1px] border-[#292f46]",
            footer: "border-t-[1px] border-[#292f46]",
            closeButton: "hover:bg-white/5 active:bg-white/10",
          }}
          isOpen={isOpen}
          radius="lg"
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                <ModalBody>
                  <div className='block gap-5'> <div className='bg-slate-300 item-center w-full block p-1 rounded-2xl'>
                    <input type="text" placeholder='what do your think....!' ref={inputtext} onClick={onOpen} className='items-center m-2 w-full ms-0 rounded-4xl text-danger p-3 border-0' />

                  </div>
                    {isloaded && <div className="py-5 relative w-fit">
                      <img src={isloaded} alt="tesst" />
                      <div className='absolute top-6 right-1 cursor-pointer text-black text-4xl'>
                        <ImCancelCircle onClick={() => handelremoveimage()} /> </div>
                    </div>}
                  </div>               </ModalBody>
                <ModalFooter className='flex items-center'>
                  <label color="foreground" variant="light" className=' cursor-pointer ' >
                    <input type="file" ref={inputimage} hidden className=' size-7 cursor-pointer ' onChange={(e) => {
                      handelimage(e)
                    }} />
                    <IoMdPhotos size={30} />
                  </label>
                  <Button color="foreground" variant="light" onPress={onClose} className="hover:bg-danger cursor-pointer">
                    Close
                  </Button>
                  <button className="bg-[#6f4ef2] shadow-lg shadow-indigo-500/20 cursor-pointer px-5 rounded-2xl py-3" onClick={function () {
                    onClose()
                    mutate()
                  }}>
                    post                  </button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

      </div>
    </div>
    {data?.data.data.posts?.map((post) => <div key={post.id} className='mb-7.5  mx-auto'>
      <AllPosts post={post} />
    </div>)}
  </>
  )
}
