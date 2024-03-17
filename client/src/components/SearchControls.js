import React, { useState } from 'react';
import { Input, Button, Typography, Checkbox } from "@material-tailwind/react";

const SearchControls = ({ onSearch, filters, onFilterChange }) => {
  const [postalCode, setPostalCode] = useState('');
  const [cityName, setCityName] = useState('');
  const [radius, setRadius] = useState(800);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === 'postal-code') setPostalCode(value);
    else if (id === 'city-name') setCityName(value);
    else if (id === 'radius') setRadius(value);
  };

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    onFilterChange({
      ...filters,
      [id]: checked,
    });
  };

  const handleSubmit = () => {
    onSearch({ postalCode, cityName, radius });
  };

  return (
    <div className="flex-1 p-4">
      <div className="mb-4">
        <Typography variant="paragraph">Postal Code:</Typography>
        <Input
          id="postal-code"
          size="sm"
          className=" !border-rich-black focus:!border-t-dark-moss-green"
          value={postalCode}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-4">
        <Typography variant="paragraph">City:</Typography>
        <Input
          id="city-name"
          size="sm"
          className=" !border-rich-black focus:!border-t-dark-moss-green"
          value={cityName}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-4">
        <Typography variant="paragraph">Radius:</Typography>
        <Input
          id="radius"
          size="sm"
          placeholder="800"
          value={radius}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-4">
        {Object.entries(filters).map(([key, value]) => (
          <div key={key} className="flex items-center mb-2">
            <Checkbox
              id={key}
              checked={value}
              onChange={handleCheckboxChange}
              color="green"
              defaultChecked={value}
              label={key.split('_').join(' ')}
              className="!border-rich-black focus:!border-t-dark-moss-green rounded"
            />
          </div>
        ))}
      </div>
      <Button size="md" variant="filled" rounded={true} block={false} onClick={handleSubmit}>
        Search
      </Button>
    </div>
  );
};

export default SearchControls;