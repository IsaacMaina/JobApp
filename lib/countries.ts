import { Country } from 'country-state-city';

export const countries = Country.getAllCountries().map(country => ({
  name: country.name,
  code: country.isoCode,
}));
