
import { useState } from 'react';
import { TextField, Box, FormControl } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import CityInput from '../CityInput';

export default function HotelSearch() {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <CityInput />
      <DatePicker
        label="Check-in"
        value={checkIn}
        onChange={setCheckIn}
        renderInput={(params) => <TextField {...params} />}
      />
      <DatePicker
        label="Check-out"
        value={checkOut}
        onChange={setCheckOut}
        renderInput={(params) => <TextField {...params} />}
      />
      <TextField
        type="number"
        label="Number of Guests"
        value={guests}
        onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value)))}
        InputProps={{ inputProps: { min: 1 } }}
      />
    </Box>
  );
}
