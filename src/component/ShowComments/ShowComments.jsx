import React from 'react'
import { CardFooter } from '@heroui/react';
import { CardHeader } from '@heroui/react';

export default function ShowComments({ comment }) {
    const virsualImage = "https://petapixel.com/assets/uploads/2024/01/The-Star-of-System-Sol-Rectangle-640x800.jpg"
    const { commentCreator, content, createdAt, image } = comment
    const { _id, name, photo, } = commentCreator
    //console.log(comment);

    return (
        <>  <CardFooter>
            <CardHeader className="block">
                <div className="flex gap-3">
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
                </div >
                <div className='flex flex-col gap-y-3.5'>

                    {

                        content && <div className="flex"> <p className=" ms-13 mt-3 ">{content}</p></div>
                    }
                    {image && <div className="flex"> <img src={image} alt="xsdc" /></div>
                    }
                </div>
            </CardHeader>
        </CardFooter></>
    )
}

