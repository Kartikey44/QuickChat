import {
  FaUserAlt,
  FaPhoneAlt,
} from "react-icons/fa";

import { IoMail } from "react-icons/io5";

import { BsFillInfoCircleFill } from "react-icons/bs";

import { MdPhotoCamera } from "react-icons/md";

export const profileFields = [
  {
    key: "name",
    label: "Full Name",
    icon: FaUserAlt,
    editable: true,
    type: "text",
  },

  {
    key: "bio",
    label: "Bio",
    icon: BsFillInfoCircleFill,
    editable: true,
    type: "textarea",
  },

  {
    key: "email",
    label: "Email",
    icon: IoMail,
    editable: true,
    type: "email",
  },

  {
    key: "mobile",
    label: "Mobile Number",
    icon: FaPhoneAlt,
    editable: true,
    type: "tel",
  },
];