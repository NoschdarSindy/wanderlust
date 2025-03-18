
import { useState } from 'react';
import { TextField, Box, FormControl, Select, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import CityInput from '../CityInput';

export default function CarSearch() {
  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [carType, setCarType] = useState('compact');

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <CityInput label="Pickup Location" />
      <DatePicker
        label="Pickup Date"
        value={pickupDate}
        onChange={setPickupDate}
        renderInput={(params) => <TextField {...params} />}
      />
      <DatePicker
        label="Return Date"
        value={returnDate}
        onChange={setReturnDate}
        renderInput={(params) => <TextField {...params} />}
      />
      <FormControl>
        <Select
          value={carType}
          onChange={(e) => setCarType(e.target.value)}
          displayEmpty
        >
          <MenuItem value="compact">Compact</MenuItem>
          <MenuItem value="midsize">Midsize</MenuItem>
          <MenuItem value="suv">SUV</MenuItem>
          <MenuItem value="luxury">Luxury</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
