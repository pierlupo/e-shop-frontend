import React from 'react';
import { useTranslation } from 'react-i18next';
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/react';
import { GlobeAltIcon, CheckIcon } from '@heroicons/react/24/outline';

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

export const LanguageDropdown: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLanguage = languages.find((lang) => lang.code === i18n.language) ?? languages[0];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('i18nextLng', code);
  };

  return (
      <Menu as="div" className="relative inline-block text-left">
        <MenuButton
            className="flex items-center justify-center rounded-full bg-gray-100 p-2 hover:bg-gray-200 transition"
            title={`Language: ${currentLanguage.label}`}
        >
          <GlobeAltIcon className="h-6 w-6 text-gray-600" />
        </MenuButton>

        <MenuItems
            className="absolute right-0 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
        >
          {languages.map((lang) => (
              <MenuItem key={lang.code}>
                {({ active }) => (
                    <button
                        onClick={() => changeLanguage(lang.code)}
                        className={`${
                            active ? 'bg-blue-500 text-white' : 'text-gray-900'
                        } group flex justify-between w-full items-center px-4 py-2 text-sm`}
                    >
                <span className="flex items-center">
                  <span className="mr-2">{lang.flag}</span>
                  {lang.label}
                </span>
                      {i18n.language === lang.code && (
                          <CheckIcon className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                )}
              </MenuItem>
          ))}
        </MenuItems>
      </Menu>
  );
};