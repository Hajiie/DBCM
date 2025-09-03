import { LogoType, NavbarType } from "../src/shared/enums";
import { IAuthor, iNavSetup, iSEO } from "../src/shared/interfaces";
import {
    AiFillGithub,
    AiOutlineTwitter,
    AiFillLinkedin,
    AiFillInstagram,
    AiFillFacebook,
    AiFillSmile
} from "react-icons/ai";

/**
 * EXAMPLE AUTHOR
 * 
 export const AUTHOR_NAME: IAuthor = {
    name: "Full Name",
    designation: "Work Designation",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    profilePic: "",
     social: [
        {
            icon: <AiFillGithub />,
            link: 'https://github.com/'
        },
        {
            icon: <AiFillLinkedin />,
            link: 'https://www.linkedin.com/'
        },
    ]
}
 */

export const DBCM: IAuthor = {
    name: "DBCM",
    designation: "Data-based Construction Management Lab at Hongik University",
    bio: "",
    profilePic: "",
    social: [
        // {
        //     icon: <AiFillGithub />,
        //     link: 'https://github.com/nmayur'
        // },
        // {
        //     icon: <AiFillLinkedin />,
        //     link: 'https://www.linkedin.com/in/mayur-nalwala/'
        // },
    ]
}

export const SUNGHEE: IAuthor = {
    name: "Sunghee Lee",
    designation: "Undergraduate Student",
    bio: "Department of Civil and Environmental Engineering, Hongik University",
    profilePic: "",
    social: [
        {
            icon: <AiFillGithub />,
            link: 'https://github.com/Hajiie'
        },
    ]
}


// This can your company name / your name etc for SEO purposes
export const WEBSITE_NAME: string = 'DBCM Lab';
export const WEBSITE_URL: string = '/';

/**
 * This is the main navigation setup.
 * This includes the main navbar and the side drawer.
 */
export const PRIMARY_NAV: iNavSetup = {
    type: NavbarType.DEFAULT,
    // max logo image height 40px
    // you can add logo light version if using image
    // logo: {
    //     type: LogoType.IMAGE,
    //     logo: '/images/logo.png',
    //     logoLight: '/images/logo-light.png'
    // },
    logo: {
        type: LogoType.IMAGE,
        logo: '/public/images/DBCM_logo.png',
        logoLight: '/public/images/DBCM_logo.png',
    },
    // navLinks are the main navbar links that apper on top of every page
    navLinks: [
        {
            label: 'Home',
            path: '/'
        },
        {
            // for categories don't add path and add type: dropdown and pass path empty
            label: 'Blog',
            type: 'dropdown',
            path: ''
        },
        {
            label: 'About Us',
            path: '/about-us'
        },
        {
            label: 'Huggingface',
            path: 'https://huggingface.co/DBCMLAB',
            newTab: true
        },
        {
            label: 'Contact Us',
            path: '/contact-us'
        }
    ],
    // sideNavLinks are the links which appear when you open the side menu after clicking the burger menu icon.
    sideNavLinks: [
        {
            label: 'Home',
            path: '/'
        },
        {
            // for categories dont add path and add type: dropdown
            label: 'Blog',
            type: 'dropdown',
            path: ''
        },
        {
            label: 'About Us',
            path: '/about-us'
        },
        {
            label: 'Huggingface',
            path: 'https://huggingface.co/DBCMLAB',
            newTab: true
        },
        {
            label: 'Contact Us',
            path: '/contact-us'
        }
    ],
    socials: [
        {
            link: 'https://huggingface.co/DBCMLAB',
            icon: <AiFillSmile />
        },
        {
            link: 'https://www.instagram.com/',
            icon: <AiFillInstagram />
        },
        {
            link: 'https://twitter.com/',
            icon: <AiOutlineTwitter />
        },
    ]
}

export const DEFAULT_SEO: iSEO = {
    title: "DBCM Lab",
    description: "Data-based Construction Management Lab at Hongik University",
    keywords: "NLP, GraphDB, Hongik Univ., Data-based Construction Management Lab, Hongik University",
    url: WEBSITE_URL,
    author: `${DBCM.name}, ${SUNGHEE.name}`,
    twitterHandle: '',
    ogImage: '/images/DBCM_logo.jpg'
}