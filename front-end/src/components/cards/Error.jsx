import React from 'react'
import { Link } from 'react-router-dom'

const Error = ({error, button}) => {
return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen text-center">
            <img
            src="/public/dark-error.png"
            alt="dark error"
            width={270}
            height={200}
            className="hidden object-contain dark:block"
            />
        <img
            src="/public/light-error.png"
            alt="light error"
            width={270}
            height={200}
            className="block object-contain dark:hidden"
            />
            <h2 className="h2-bold mt-8">Something Went wrong!</h2>
            <p className="body-regular my-3.5 max-w-md text-center">
      {error}

        {button && (
        <Link to={button}>
            <Button className="w-40 min-h-[46px] rounded-2xl bg-[#ef8733] hover:bg-[#ef8733]/80">
            {button.text}
            </Button>
        </Link>
        )}
    </p>
    </div>
)
}

export default Error