

const Loading = ({text}:any) => {
    return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
     <img src="https://res.cloudinary.com/tiagobecker/image/upload/v1708292537/Loading_oe1xhc.gif" alt="Loading" />
     <p className="text-gray-300">{text}</p>
    </div>  );
}
 
export default Loading;