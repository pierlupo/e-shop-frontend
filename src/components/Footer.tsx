import React from "react";
import {useTranslation} from "react-i18next";
import { Link } from "react-router-dom";
import {
    HomeIcon,
    InformationCircleIcon,
    PhoneIcon,
    ShieldCheckIcon,
    QuestionMarkCircleIcon
} from "@heroicons/react/24/outline";

const Footer: React.FC = () => {

    const {t} = useTranslation();

    return (
        <footer className="bg-gray-100 shadow py-6 mt-auto dark:bg-gray-600">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <span className="font-bold text-lg text-gray-700 dark:text-amber-50">E-Shop</span><span className="text-gray-700 dark:text-amber-50"> © {new Date().getFullYear()} {t('all_rights_footer')}</span>
                </div>
                <div className="flex space-x-4">
                    <Link to="/home" className="flex items-center text-gray-700 hover:underline dark:text-amber-50">
                        <HomeIcon className="h-4 w-4 mr-1" /> {t('home_link_footer')}
                    </Link>
                    <Link to="/help" className="flex items-center text-gray-700 hover:underline dark:text-amber-50">
                        <InformationCircleIcon className="h-4 w-4 mr-1" /> {t('about_link_footer')}
                    </Link>
                    <Link to="/help" className="flex items-center text-gray-700 hover:underline dark:text-amber-50">
                        <PhoneIcon className="h-4 w-4 mr-1" /> {t('contact_link_footer')}
                    </Link>
                    <Link to="/help" className="flex items-center text-gray-700 hover:underline dark:text-amber-50">
                        <ShieldCheckIcon className="h-4 w-4 mr-1" /> {t('privacy_link_footer')}
                    </Link>
                    <Link to="/help" className="flex items-center text-gray-700 hover:underline dark:text-amber-50">
                        <QuestionMarkCircleIcon className="h-4 w-4 mr-1" /> {t('help_link_footer')}
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;