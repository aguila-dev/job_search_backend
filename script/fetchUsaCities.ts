const axios = require('axios');
const fs = require('fs');
const path = require('path');
interface UsaData {
  [key: string]: { state: string; cities: string[] };
}

interface StateData {
  name: string;
  state_code: string;
}
async function fetchUSStates(): Promise<StateData[] | undefined> {
  try {
    const response = await axios.post(
      'https://countriesnow.space/api/v0.1/countries/states',
      {
        country: 'United States',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('States:', response.data.data.states);
    return response.data.data.states;
  } catch (error: any) {
    console.error(
      'Error fetching states:',
      error.response ? error.response.data : error.message
    );
  }
}

fetchUSStates();

async function fetchCitiesForState(
  state: string
): Promise<string[] | undefined> {
  try {
    const response = await axios.post(
      'https://countriesnow.space/api/v0.1/countries/state/cities',
      {
        country: 'United States',
        state,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error(
      `Error fetching cities for state ${state}:`,
      error.response ? error.response.data : error.message
    );
  }
}

async function fetchAndStoreUSCities() {
  const states = await fetchUSStates();

  if (!states) {
    console.error('No states found.');
    return;
  }

  const usaData: UsaData = {};

  for (const state of states) {
    const cities = await fetchCitiesForState(state.name);

    if (cities) {
      usaData[state.state_code] = { state: state.name, cities };
    }
  }

  const filePath = path.join('utils', 'usaData.ts');
  const fileContent = `export const usaData = ${JSON.stringify(
    usaData,
    null,
    2
  )};`;

  fs.writeFileSync(filePath, fileContent, 'utf8');

  console.log('File written successfully to', filePath);
}

fetchAndStoreUSCities();
