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
        <Card className="w-full max-w-md mx-auto md:w-[40%] md:max-w-none">
            <CardHeader className="flex gap-3 p-4">
                <img
                    alt="user avatar"
                    height={40}
                    width={40}
                    radius="sm"
                    src={photo}
                    className="flex-shrink-0"
                    onError={(e) => {
                        e.target.src = virsualImage;
                    }}
                />
                <div className="flex flex-col">
                    <p className="text-base font-medium">{name}</p>
                    <p className="text-sm text-default-500">{createdAt}</p>
                </div>
            </CardHeader>

            <Divider />

            <CardBody className="p-4 space-y-3">
                {body && <p className="text-[15px] leading-relaxed">{body}</p>}
                {image && (
                    <img
                        src={image}
                        alt={body || "post image"}
                        className="w-full rounded-xl max-h-[380px] object-cover"
                    />
                )}
            </CardBody>

            <Divider />

            <CardFooter className="p-4">
                <div className="flex justify-around w-full text-sm font-medium">
                    <div className="cursor-pointer flex items-center gap-1 active:scale-95 transition">
                        👍 Like
                    </div>
                    <div className="cursor-pointer flex items-center gap-1 active:scale-95 transition">
                        <Link to={`/postdetailes/${id}`}>💬 Comments</Link>
                    </div>
                    <div className="cursor-pointer flex items-center gap-1 active:scale-95 transition">
                        🔗 Share
                    </div>
                </div>
            </CardFooter>

            <CreatComment post={post} />

            {!ispostdetailes && topComment && <ShowComments comment={topComment} />}

            {ispostdetailes &&
                data?.data?.data?.comments?.map((currentcomment) => (
                    <ShowComments key={currentcomment.id} comment={currentcomment} />
                ))}
        </Card>
    );
}
