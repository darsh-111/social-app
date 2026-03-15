import { Card, CardHeader, CardBody, CardFooter, Divider, Image } from "@heroui/react";
import ShowComments from "../ShowComments/ShowComments";
import { Link } from 'react-router-dom';
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import CreatComment from './../Home/CreatComment/CreatComment';

export default function AllPosts({ post, ispostdetailes = false }) {
    const { id, image, createdAt, user, body, topComment } = post;
    const { name, photo } = user;
    const virsualImage = "https://petapixel.com/assets/uploads/2024/01/The-Star-of-System-Sol-Rectangle-640x800.jpg"
    if (!body && !image) return



    function GetPostsComment() {
        return axios.get(`https://route-posts.routemisr.com/posts/${id}/comments`,
            {

                headers: {
                    Authorization: `Bearer ${localStorage.getItem("usertoken")}`
                }
            }
        )
    }

    const { isError, isLoading, data, error } = useQuery({
        queryKey: ["postcomment", id],
        queryFn: GetPostsComment,
        enabled: ispostdetailes
    })
    // console.log(data?.data.data.comments);

    return (
        <Card className="w-[40%] m-auto">
            <CardHeader className="flex gap-3">
                <img
                    alt="heroui logo"
                    height={40}
                    radius="sm"
                    src={photo}
                    width={40}
                    onError={(e) => {
                        e.target.src = virsualImage
                    }}
                />
                <div className="flex flex-col">
                    <p className="text-md">{name}</p>
                    <p className="text-small text-default-500">{createdAt}</p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                {body && <p>{body}</p>}
                {image && <img src={image} alt={body || "test test"} />}
            </CardBody>
            <Divider />
            <CardFooter>
                <div className="flex justify-around  w-full ">
                    <div className="cursor-pointer">Like</div>
                    <div className="cursor-pointer" ><Link to={`/postdetailes/${id}`} > Comments</Link></div>
                    <div className="cursor-pointer">Share</div>
                </div>
            </CardFooter>
            <CreatComment post={post} />
            {!ispostdetailes && topComment && <ShowComments comment={topComment} />}

            {ispostdetailes && data?.data.data.comments.map((currentcomment) =>
                <ShowComments comment={currentcomment} />
            )}
        </Card>
    );
}
