
import { useState } from 'react';
import { TextField, Box, FormControl, Select, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import CityInput from '../CityInput';

export default function FlightSearch() {
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState(null);
  const [passengers, setPassengers] = useState(1);
  const [flightClass, setFlightClass] = useState('economy');

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <CityInput label="From" />
      <CityInput label="To" value={destination} onChange={setDestination} />
      <DatePicker
        label="Departure Date"
        value={departureDate}
        onChange={setDepartureDate}
        renderInput={(params) => <TextField {...params} />}
      />
      <TextField
        type="number"
        label="Passengers"
        value={passengers}
        onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value)))}
        InputProps={{ inputProps: { min: 1 } }}
      />
      <FormControl>
        <Select
          value={flightClass}
          onChange={(e) => setFlightClass(e.target.value)}
          displayEmpty
        >
          <MenuItem value="economy">Economy</MenuItem>
          <MenuItem value="business">Business</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
