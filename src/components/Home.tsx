import React from "react";
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {

    const { t } = useTranslation();


    return (
        <div className="text-2xl font-bold mb-6 text-center dark:text-amber-50">
            <h2>{t('welcome_message')}</h2>
            <p>{t('log_success_message')}</p>
        </div>
    );
};

export default Home;