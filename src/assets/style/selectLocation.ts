import { StylesConfig } from 'react-select';

export const selectLocation: StylesConfig = {
    option: (provided) => ({
        ...provided,
        color: '#151513',
        padding: '10px', 
    }),    
    singleValue: (provided) => ({
        ...provided,
        color: '#151513',  
    }),
};
