import Logo from './Logo.png'
import { FaUserLarge } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import { FaLock } from "react-icons/fa";
export { Logo};
export const signupFields = [
  {
    label: "Full Name",
    name: "name",
    type: "text",
    placeholder: "Enter your full name",
    icon: FaUserLarge,
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "Enter your email",
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
export const loginFields = [
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "Enter your email",
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