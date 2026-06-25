import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { InfinitySpin } from 'react-loader-spinner';
import { useParams } from 'react-router-dom'
import AllPosts from '../GetAllPosts/AllPosts';

export default function PostDetails() {
    const { id } = useParams()

    function GetPosts() {
        return axios.get(`https://route-posts.routemisr.com/posts/${id}`,
            {

                headers: {
                    Authorization: `Bearer ${localStorage.getItem("usertoken")}`
                }
            }
        )
    }



    const { isError, isLoading, data, error } = useQuery({
        queryKey: ["postDetails", id],
        queryFn: GetPosts,


    })


    if (isLoading) {
        return <div className='flex min-h-screen items-center justify-center'><InfinitySpin
            width="200"
            color="#7c3aed"
        />
        </div>
    }
    if (isError) {
        try {
            const deleted = JSON.parse(localStorage.getItem("deletedEntities") || "[]")
            if (!deleted.includes(id)) {
                deleted.push(id)
                localStorage.setItem("deletedEntities", JSON.stringify(deleted))
            }
        } catch {}
        return <p className="text-center mt-20 text-gray-500">Post not found or has been deleted</p>
    }
    return (
        <>
            {<AllPosts post={data?.data.data.post} isPostDetails />}

        </>
    )
}
