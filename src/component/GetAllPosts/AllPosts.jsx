import { useState } from 'react'
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@heroui/react";
import ShowComments from "../ShowComments/ShowComments";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CreatComment from './../Home/CreatComment/CreatComment';
import PostMenu from './PostMenu';
import LikersList from '../LikersList/LikersList';
import ShareButton from '../ShareButton/ShareButton';
import BookmarkButton from '../BookmarkButton/BookmarkButton';
import FollowButton from '../Suggestions/FollowButton';
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { FALLBACK_IMAGE } from '../../utils/constants'

export default function AllPosts({ post, isPostDetails = false, fullWidth = false }) {
  const [lightbox, setLightbox] = useState(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [isLiked, setIsLiked] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("likedPosts") || "{}")
    return saved[post.id] || false
  })

  const { data: myProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => axios.get("https://route-posts.routemisr.com/users/profile-data", {
      headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
    }),
  })
  const myId = myProfile?.data?.data?.user?.id || myProfile?.data?.data?.user?._id
  const following = myProfile?.data?.data?.user?.following || []
    const { id, image, createdAt, user, body, topComment, commentsCount, isShare, sharedPost } = post;
    const { name, photo } = user;
    const userId = user?.id || user?._id;

    const goToUserProfile = (targetUserId) => {
      if (targetUserId === myId) navigate("/profile")
      else navigate(`/profile/${targetUserId}`)
    }

    const likeMutation = useMutation({
      mutationFn: () => axios.put(`https://route-posts.routemisr.com/posts/${id}/like`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` }
      }),
      onMutate: () => {
        const newLiked = !isLiked
        const newCount = Math.max(0, post.likesCount + (newLiked ? 1 : -1))
        queryClient.setQueryData(["getPosts"], (old) => {
          if (!old) return old
          return {
            ...old,
            data: {
              ...old.data,
              data: {
                ...old.data?.data,
                posts: old.data?.data?.posts?.map((p) => p.id === id ? { ...p, isLiked: newLiked, likesCount: newCount } : p)
              }
            }
          }
        })
        queryClient.setQueryData(["myPosts"], (old) => {
          if (!old) return old
          return {
            ...old,
            data: {
              ...old.data,
              data: {
                ...old.data?.data,
                posts: old.data?.data?.posts?.map((p) => p.id === id ? { ...p, isLiked: newLiked, likesCount: newCount } : p)
              }
            }
          }
        })
      },
      onError: () => {
        queryClient.invalidateQueries({ queryKey: ["getPosts"] })
        queryClient.invalidateQueries({ queryKey: ["myPosts"] })
      }
    })

    function toggleLike() {
      const newVal = !isLiked
      setIsLiked(newVal)
      const saved = JSON.parse(localStorage.getItem("likedPosts") || "{}")
      saved[post.id] = newVal
      localStorage.setItem("likedPosts", JSON.stringify(saved))
      likeMutation.mutate()
    }

    if (!body && !image && !isShare) return



    function GetPostsComment() {
        return axios.get(`https://route-posts.routemisr.com/posts/${id}/comments`,
            {

                headers: {
                    Authorization: `Bearer ${localStorage.getItem("usertoken")}`
                }
            }
        )
    }

    const { data } = useQuery({
        queryKey: ["postcomment", id],
        queryFn: GetPostsComment,
        enabled: isPostDetails
    })

    return (
        <>
        <Card className={fullWidth ? "w-full" : "w-full"}>
            <CardHeader className="flex gap-3 p-4 justify-between">
                <div className="flex gap-3 items-center">
                <img
                    alt="user avatar"
                    height={40}
                    width={40}
                    radius="sm"
                    src={photo}
                    className="shrink-0 cursor-pointer"
                    onClick={() => goToUserProfile(userId)}
                    onError={(e) => {
                        e.target.src = FALLBACK_IMAGE;
                    }}
                />
                <div className="flex flex-col">
                    <p className="text-base font-medium cursor-pointer" onClick={() => goToUserProfile(userId)}>{name}</p>
                    <p className="text-sm text-default-500">{createdAt}</p>
                </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                {myId !== userId && <FollowButton userId={userId} initialFollowing={following.includes(userId)} />}
                {myId === userId && <PostMenu postId={id} body={body} image={image} />}
                </div>
            </CardHeader>

            <Divider />

            <CardBody className="p-4 space-y-3">
                {body && <p className="text-[15px] leading-relaxed">{body}</p>}
                {image && (
                    <img
                        src={image}
                        alt={body || "post image"}
                        className="w-full rounded-xl max-h-95 object-contain cursor-pointer"
                        onClick={() => setLightbox(image)}
                    />
                )}
                {isShare && sharedPost && (
                  <div className="border border-gray-300 rounded-xl p-3 bg-gray-50">
                    <div className="flex items-center gap-2 mb-2 cursor-pointer" onClick={() => {
                      const ownerId = sharedPost.user?.id || sharedPost.user?._id
                      goToUserProfile(ownerId)
                    }}>
                      <img src={sharedPost.user?.photo} alt="" className="w-6 h-6 rounded-full" onError={(e) => e.target.src = FALLBACK_IMAGE} />
                      <span className="text-sm font-medium hover:underline">{sharedPost.user?.name}</span>
                    </div>
                    {sharedPost.body && <p className="text-sm">{sharedPost.body}</p>}
                    {sharedPost.image && <img src={sharedPost.image} alt="" className="mt-2 rounded-lg max-h-60 object-cover" />}
                  </div>
                )}
            </CardBody>

            <Divider />

            <CardFooter className="p-4">
                <div className="flex justify-around w-full text-sm font-medium">
                    <div className="flex items-center gap-1 active:scale-95 transition">
                        <div onClick={toggleLike} className="cursor-pointer flex items-center gap-1">
                          {isLiked ? <AiFillLike size={18} className="text-blue-600" /> : <AiOutlineLike size={18} />}
                        </div>
                        <LikersList postId={id} count={post.likesCount ?? 0} />
                    </div>
                    <div className="cursor-pointer flex items-center gap-1 active:scale-95 transition">
                        <Link to={`/postdetails/${id}`} className="flex items-center gap-1"><FaRegComment size={16} /> {commentsCount ?? 0}</Link>
                    </div>
                    <ShareButton postId={id} />
                    <BookmarkButton postId={id} />
                </div>
            </CardFooter>

            <CreatComment post={post} />

            {!isPostDetails && topComment && <ShowComments comment={topComment} postId={id} myId={myId} />}

            {isPostDetails &&
                data?.data?.data?.comments?.map((currentcomment) => (
                    <ShowComments key={currentcomment.id} comment={currentcomment} postId={id} myId={myId} />
                ))}
        </Card>

        {lightbox && (
            <div
                className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center cursor-pointer"
                onClick={() => setLightbox(null)}
            >
                <img
                    src={lightbox}
                    alt="full screen"
                    className="max-w-[95vw] max-h-[95vh] object-contain"
                />
            </div>
        )}
    </>
    );
}
