import { useQuery, gql } from "@apollo/client";
import { Button } from "@mui/material";
import { useRouter } from "next/router";

export const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      id
      name
      emoji
      code
    }
  }
`;

export interface Country {
  id: string;
  name: string;
  emoji: string;
  code: string;
}

function CountryList() {
  const { data, loading, error } = useQuery(GET_COUNTRIES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const router = useRouter();

  return (
    <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "10px" }}>
      {data.countries.map((country: Country) => (
        <Button
          key={country.id}
          variant="outlined"
          onClick={() => router.push(`/country/${country.code}`)}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "5px",
            borderColor: "lightgray",
            color: "black",
            "&:hover": {
              borderColor: "gray",
            },
            padding: 1,
          }}
        >
          <span>{country.emoji}</span>
          <span>{country.name}</span>
        </Button>
      ))}
    </div>
  );
}

export default CountryList;
