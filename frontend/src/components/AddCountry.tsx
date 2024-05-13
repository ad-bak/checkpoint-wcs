import { useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import { TextField, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import { Country, GET_COUNTRIES } from "./CountryList";

interface GetCountriesResponse {
  countries: Country[];
}

interface Continent {
  id: string;
  name: string;
}

const GET_CONTINENTS = gql`
  query GetContinents {
    continents {
      id
      name
    }
  }
`;

const ADD_COUNTRY_MUTATION = gql`
  mutation AddCountry($addCountryData: NewCountryInput!) {
    addCountry(data: $addCountryData) {
      code
      name
      emoji
      id
      continent {
        id
        name
      }
    }
  }
`;

export default function AddCountryForm() {
  const [countryName, setCountryName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [countryEmoji, setCountryEmoji] = useState("");
  const [continentId, setContinentId] = useState("");

  const { data: continentsData } = useQuery(GET_CONTINENTS);
  const [addCountry, { data, loading, error }] = useMutation(ADD_COUNTRY_MUTATION, {
    update(cache, { data: { addCountry } }) {
      const existingCountries = cache.readQuery<GetCountriesResponse>({ query: GET_COUNTRIES });

      if (existingCountries) {
        cache.writeQuery({
          query: GET_COUNTRIES,
          data: {
            countries: [...existingCountries.countries, addCountry],
          },
        });
      }
    },
  });

  const handleAddCountry = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await addCountry({
        variables: {
          addCountryData: {
            name: countryName,
            code: countryCode,
            emoji: countryEmoji,
            continent: {
              id: continentId,
            },
          },
        },
      });

      setCountryName("");
      setCountryCode("");
      setCountryEmoji("");
      setContinentId("");
    } catch (err) {
      console.error("Error adding country:", err);
    }
  };

  return (
    <form onSubmit={handleAddCountry} className="border-2 border-gray-200 p-4 m-4 shadow-md">
      <div className="flex flex-col items-center bg-white p-3 rounded-lg gap-5 ">
        <TextField
          id="name"
          name="name"
          label="Name"
          variant="outlined"
          required
          value={countryName}
          onChange={(e) => setCountryName(e.target.value)}
          fullWidth
          sx={{ backgroundColor: "white", flex: 1, marginRight: 1 }}
        />
        <TextField
          id="emoji"
          name="emoji"
          label="Emoji"
          variant="outlined"
          required
          value={countryEmoji}
          onChange={(e) => setCountryEmoji(e.target.value)}
          fullWidth
          sx={{ backgroundColor: "white", flex: 1, marginRight: 1 }}
        />
        <TextField
          id="code"
          name="code"
          label="Code"
          variant="outlined"
          required
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          fullWidth
          sx={{ backgroundColor: "white", flex: 1, marginRight: 1 }}
        />
        <FormControl fullWidth>
          <InputLabel id="continent-select-label">Continent</InputLabel>
          <Select
            labelId="continent-select-label"
            id="continent-select"
            value={continentId}
            label="Continent"
            onChange={(e) => setContinentId(e.target.value)}
          >
            {continentsData &&
              continentsData.continents.map((continent: Continent) => (
                <MenuItem key={continent.id} value={continent.id}>
                  {continent.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <button type="submit" className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded">
          Add
        </button>
      </div>
    </form>
  );
}
