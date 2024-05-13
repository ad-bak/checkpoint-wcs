import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import { Box, Paper, Typography } from "@mui/material";

const GET_COUNTRY_DETAIL = gql`
  query GetCountry($code: String!) {
    country(code: $code) {
      id
      name
      emoji
      code
      continent {
        id
        name
      }
    }
  }
`;

const CountryDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, loading, error } = useQuery(GET_COUNTRY_DETAIL, {
    variables: { code: id },
    skip: !id,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.country) return <p>No Country Found</p>;

  const { name, emoji, code, continent } = data.country;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", m: 6 }}>
      <Paper elevation={3} sx={{ padding: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography component="div" sx={{ fontSize: 64 }}>
          {emoji}
        </Typography>
        <Typography variant="h5" gutterBottom component="div">
          Name: {name} ({code})
        </Typography>
        <Typography variant="subtitle1">Continent: {continent.name}</Typography>
      </Paper>
    </Box>
  );
};

export default CountryDetail;
