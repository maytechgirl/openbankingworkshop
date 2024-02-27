import React, { useState } from 'react';
import './DataSharingOptions.css';

interface Permission {
  name: string;
}

interface OptionsList {
  id: number;
  displayName: string;
  permissions: {
      id: number;
      name: string;
  }[];
};

interface DataSharingOptionsProps {
  optionsList: OptionsList[];
}

const DataSharingOptions: React.FC<DataSharingOptionsProps> = ({ optionsList }) => {
  const [showLists, setShowLists] = useState<boolean[]>(new Array(optionsList.length).fill(false));

  const showList = (index: number) => {
    const newShowLists = [...showLists];
    newShowLists[index] = !newShowLists[index];
    setShowLists(newShowLists);
  };

  return (
    <div>
      <label htmlFor="dataConsent" className="font-bold">
        Dados a serem compartilhados:
      </label>
      {optionsList.map((option, index) => (
        <div key={index}>
          <div className="flow-root">
            <h4 className="float-left pb-3">{option.displayName}</h4>
            <img
              alt="chevron"
              onClick={() => showList(index)}
              src="/chevron-right.svg"
              className={`cursor-pointer float-right ${showLists[index] ? '' : 'chevron-icon'}`}
            />
          </div>
          {showLists[index] && (
            <ul className="text-base">
              {option.permissions.map((permission, permissionIndex) => (
                <li key={permissionIndex + permission.name} className="px-5 pb-1">
                  {permission.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default DataSharingOptions;
