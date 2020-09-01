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
  const [closestTemperatureState, setClosestTemperatureState] = useState([]);
  const [areasState, setAreasState] = useState([]);
  const [selectedAreaState, setSelectedAreaState] = useState([]);
  const [previousAreaState, setPreviousAreaState] = useState([]);
  const [partnerLogoState, setPartnerLogoState] = useState([]);

/*   const getToken = async () => {

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', '<secret>');
    params.append('client_secret', '<secret>');

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
  }; */

  // Temporary workaround until we get a better authentication service
  const getToken = async () => {
    const t = {
      'access_token': '3fb5e9e0-deae-3263-9efb-adcb4a9577c7',
      'scope': 'am_application_scope default',
      'token_type': 'Bearer',
      'expires_in': 9223372036854775,
    };
    setToken(t);
    return t;
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

  const previousArea = () => {
    return previousAreaState;
  };

  const setPreviousArea = (pa) => {
    const _storeData = async (c) => {
      try {
        let thePreviousArea = '[' + JSON.stringify(c) + ']';
        await AsyncStorage.setItem('previousAreaState', thePreviousArea);
      } catch (error) {
        console.log('save error', error);
      }
    };
    _storeData(pa);
    setPreviousAreaState(pa);
  };

  const selectedArea = () => {
    return selectedAreaState;
  };

  const setSelectedArea = (sa) => {
    const _storeData = async (c) => {
      try {
        let theArea = '[' + JSON.stringify(c) + ']';
        await AsyncStorage.setItem('selectedAreaState', theArea);
      } catch (error) {
        console.log('save error', error);
      }
    };
    _storeData(sa);
    setSelectedAreaState(sa);
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

  const closestTemperature = () => {
    return closestTemperatureState;
  };

  const setClosestTemperature = (ct) => {
    const _storeData = async (c) => {
      try {
        let theClosestTemperature = JSON.stringify(c);
        await AsyncStorage.setItem('closestTemperatureState', theClosestTemperature);
      } catch (error) {
        console.log('save error', error);
      }
    };
    _storeData(ct);
    setClosestTemperatureState(ct);
  };

  const partnerLogo = () => {
    return partnerLogoState;
  };

  const setPartnerLogo = (pl) => {
    const _storeData = async (c) => {
      try {
        let thePartnerLogo = c;
        await AsyncStorage.setItem('partnerLogoState', thePartnerLogo);
      } catch (error) {
        console.log('save error', error);
      }
    };
    _storeData(pl);
    setPartnerLogoState(pl);
  };

  const authToken = () => {
    return token.access_token;
  };

  useEffect(() => {
    getToken();
    const loadToken = async () => {
      const data = await AsyncStorage.getItem('badetass-token');
      if (!!data) {
        const tkn = JSON.parse(data) as Token;
        setToken(tkn);
      }
    };
    loadToken();

    const loadAreas = async () => {
      const data = await AsyncStorage.getItem('areasState');
      if (!!data) {
        const ars = JSON.parse(data);
        setAreas(ars);
      }
    };
    loadAreas();

    const loadPreviousArea = async () => {
      const data = await AsyncStorage.getItem('previousAreaState');
      if (!!data) {
        const pas = JSON.parse(data);
        setPreviousArea(pas);
      }
    };
    loadPreviousArea();

    const loadSelectedArea = async () => {
      const data = await AsyncStorage.getItem('selectedAreaState');
      if (!!data) {
        const sars = JSON.parse(data);
        setSelectedArea(sars);
      }
    };
    loadSelectedArea();

    const loadTemperatures = async () => {
      const data = await AsyncStorage.getItem('temperatureState');
      if (!!data) {
        const tmps = JSON.parse(data);
        setTemperatures(tmps);
      }
    };
    loadTemperatures();

    const loadClosestTemperature = async () => {
      const data = await AsyncStorage.getItem('closestTemperatureState');
      if (!!data) {
        const tmps = JSON.parse(data);
        setClosestTemperature(tmps);
      }
    };
    loadClosestTemperature();

    const loadPartnerLogo = async () => {
      const data = await AsyncStorage.getItem('partnerLogo');
      if (!!data) {
        const pl = JSON.parse(data);
        setPartnerLogo(pl);
      }
    };
    loadPartnerLogo();

  }, []);

  const value = useMemo(() => {
    return {
      authToken,
      temperatures,
      setTemperatures,
      closestTemperature,
      setClosestTemperature,
      areas,
      setAreas,
      previousArea,
      partnerLogo,
      setPreviousArea,
      selectedArea,
      setSelectedArea,
      setPartnerLogo,
    };
  }, [token, temperatureState, closestTemperatureState, areasState, previousAreaState, selectedAreaState, partnerLogoState]);

  return (
    <BadetassContext.Provider value={value}>
      {props.children}
    </BadetassContext.Provider>
  );
};

const useBadetass: any = () => useContext(BadetassContext);
export { BadetassContext, useBadetass };
export default BadetassProvider;
