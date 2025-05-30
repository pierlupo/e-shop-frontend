import React from "react";
import {useTranslation} from "react-i18next";

const HelpPage: React.FC = () => {

    const {t} = useTranslation();
    return (
        <div style={{ padding: "2rem" }} className="text-2xl font-bold mb-6 text-center dark:text-amber-50">
            <h1>{t('help_title')}</h1>
            <p>{t('assistance_msg')}</p>
        </div>
    );
};

export default HelpPage;