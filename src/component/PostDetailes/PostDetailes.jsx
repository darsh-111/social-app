import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { InfinitySpin } from 'react-loader-spinner';
import { useParams } from 'react-router-dom'
import AllPosts from '../GetAllPosts/AllPosts';

export default function PostDetailes() {
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
            color="#4fa94d"
        />
        </div>
    }
    if (isError) {
        return <div>
            {error.message}    </div>
    }
    return (
        <>
            {<AllPosts post={data?.data.data.post} ispostdetailes />}

        </>
    )
}
