import React, { useContext, useMemo, useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';
import axios from 'axios';

const BadetassContext = React.createContext({ });

interface Props {
  children?: any;
}

export interface Token {
  access_token?: string;
  scope?: string;
  token_type?: string;
  expires_in?: number;
}

export const BadetassProvider = (props: Props) => {
  const [token, setToken] = useState({} as Token);
  const [temperatureState, setTemperatureState] = useState([]);
  const [areasState, setAreasState] = useState([]);

  const getToken = async () => {

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', 'ID');
    params.append('client_secret', 'SECRET');

    return await axios
      .post(`https://prdl-apimgmt.lyse.no/apis/token`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((e) => {
        setToken(e.data);
        AsyncStorage.setItem('badetass-token', JSON.stringify(e.data));
        return e.data;
      })
      .catch((err) => console.log('error', err));
  };

  const temperatures = () => {
    return temperatureState;
  };

  const setTemperatures = (temps) => {
    const _storeData = async (c) => {
      try {
        await AsyncStorage.setItem('temperatureState', JSON.stringify(c));
      } catch (error) {
        console.log('save error', error);
      }
    };
    _storeData(temps);
    setTemperatureState(temps);
  };

  const areas = () => {
    return areasState;
  };

  const setAreas = (as) => {
    const _storeData = async (c) => {
      try {
        await AsyncStorage.setItem('areasState', JSON.stringify(c));
      } catch (error) {
        console.log('save error', error);
      }
    };
    _storeData(as);
    setAreasState(as);
  };

  const authToken = () => {
    return token.access_token;
  };

  useEffect(() => {
    getToken();
    const loadToken = async () => {
      console.log('loading token');
      const data = await AsyncStorage.getItem('badetass-token');
      if (!!data) {
        const t = JSON.parse(data) as Token;
        console.log('setting token');
        setToken(t);
      }
    };
    loadToken();

    const loadTemperatures = async () => {
      console.log('loading temperatures');
      const data = await AsyncStorage.getItem('temperatureState');
      if (!!data) {
        const t = JSON.parse(data);
        console.log('setting temperatures');
        setTemperatures(t);
      }
    };
    loadTemperatures();

    const loadAreas = async () => {
      console.log('loading areas');
      const data = await AsyncStorage.getItem('areasState');
      if (!!data) {
        const t = JSON.parse(data);
        console.log('setting areas');
        setAreas(t);
      }
    };
    loadAreas();
  }, []);

  const value = useMemo(() => {
    return {
      authToken,
      temperatures,
      setTemperatures,
      areas,
      setAreas,
    };
  }, [token, temperatureState, areasState]);

  return (
    <BadetassContext.Provider value={value}>
      {props.children}
    </BadetassContext.Provider>
  );
};

const useBadetass: any = () => useContext(BadetassContext);
export { BadetassContext, useBadetass };
export default BadetassProvider;
