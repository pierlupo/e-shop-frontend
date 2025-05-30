import React from "react";
import {useTranslation} from "react-i18next";

const Dashboard: React.FC = () => {

    const{t} = useTranslation();
    return (
        <div style={{ padding: 20 }} className="text-2xl font-bold mb-6 text-center dark:text-amber-50">
            <h1>{t('dash_title')}</h1>
            <p>{t('welcome_dash_msg')}</p>
        </div>
    );
};

export default Dashboard;