interface ButtonProps {
 children:React.ReactNode
  type?: "submit" | "reset" | "button";
  onclick:()=> void;
}
const Button:React.FC<ButtonProps> = ({children ,type = "button", onclick }) => {
    return ( <button type={type} onClick={onclick} className=" px-10 py-2 text-white rounded-md  h-full flex items-center justify-center">{children}</button> );
}
 
export default Button;