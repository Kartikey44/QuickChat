import Logo from './Logo.png'
import { FaUserLarge } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import { FaLock } from "react-icons/fa";
import { IoPhonePortrait } from 'react-icons/io5';
export { Logo};
export const signupFields = [

  {
    label: "Mobile No.",
    name: "mobile",
    type: "tel",
    placeholder: "Enter mobile number",
    pattern: "[6-9]{1}[0-9]{9}",
    maxLength: "10",
    icon: IoPhonePortrait,
  },

    {
    label: "*Email",
    name: "email",
    type: "email",
    placeholder: "Enter your email",
    icon: IoMail,
  },
  
  {
    label: "*Full Name",
    name: "name",
    type: "text",
    placeholder: "Enter your full name",
    icon: FaUserLarge,
  },
  {
    label: "*Password",
    name: "password",
    type: "password",
    placeholder: "Enter your password",
    icon: FaLock,
  },
  {
    label: "*Confirm password",
    name: "confirmPassword",
    type: "password",
    placeholder: "Confirm your password",
    icon: FaLock,
  },
];
export const emailloginFields = [
 {
  label: "Email or Phone",
  name: "identifier",
  type: "text",
  placeholder: "Enter your email or phone number",
  pattern:
    "(^[6-9][0-9]{9}$)|(^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,}$)",
  icon: IoMail,
},

  {
    label: "Password",
    name: "password",
    type: "password",
    placeholder: "Enter your password",
    icon: FaLock,
  },
];
