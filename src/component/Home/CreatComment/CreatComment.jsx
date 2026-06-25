import { MdPhotoSizeSelectActual } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImSpinner } from 'react-icons/im';
export default function CreatComment({ post }) {
    const { id } = post;

    const form = useForm({
        defaultValues: {
            text: "",
            image: ""

        }
    })

    const { register, handleSubmit, reset } = form

    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: ({ formData }) => axios.post(
            `https://route-posts.routemisr.com/posts/${id}/comments`,
            formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("usertoken")}`
            }
        }
        ),
        onSuccess: () => {
            reset()
            queryClient.invalidateQueries({ queryKey: ["postcomment", id] })
            queryClient.invalidateQueries({ queryKey: ["getPosts"] })
        }
    })
    function eatcomment(val) {
        if (!val.text && !val.image[0]) return
        const formData = new FormData()
        if (val.text) {
            formData.append("content", val.text)
        }
        if (val.image[0]) {
            formData.append("image", val.image[0])
        }
        mutate({ formData });

    }
    return (
        <>

            <div >


                <form onSubmit={handleSubmit(eatcomment)} className="flex items-center gap-2 w-full bg-gray-100 p-2 rounded-xl" >
                    <input
                        {...register("text")}
                        type="text"
                        placeholder="Write a comment..."
                        className="flex-1 bg-white p-2 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    />


                    <label className="cursor-pointer text-2xl text-gray-600 hover:text-blue-500">
                        <MdPhotoSizeSelectActual />
                        <input type="file" hidden  {...register("image")} />
                    </label>

                    <button type='submit' className="text-2xl text-blue-600 hover:text-blue-800 cursor-pointer">
                        {isPending ? <ImSpinner className='animate-spin' /> : <IoSend />}
                    </button>
                </form>

            </div>
        </>
    )
}
