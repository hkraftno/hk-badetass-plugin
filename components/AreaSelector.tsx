import React, { useEffect } from 'react';
import { View } from 'native-base';
import { BadetassContext, useBadetass } from '../BadetassProvider';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';

export const AreaSelector = () => {
  const { authToken, areas, setAreas, setSelectedArea } = useBadetass();

  const fetchAreas = async () => {
    let token = authToken();
    if (!token) {
      return;
    }
    axios
      .get('https://prdl-apimgmt.lyse.no/apis/t/prod.altibox.lyse.no/temp/1.0/api/area/', {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: `application/json`,
        },
      })
      .then((e) => {
        let areasArray = e.data.map(function (item) {
          return { value: item.id, label: item.Name };
        });
        areasArray.unshift({ value: 9999, label: 'Vis alle'});
        setAreas(areasArray);
      })
      .catch((err) => {
        console.log('error fetching areas', err);
      });
  };

  useEffect(() => {
    if (!areas() || areas().length < 1) {
      fetchAreas();
    }
  }, [areas, authToken]);
  return (
    <BadetassContext.Consumer>
      {() => (
        <View>
          <View>
            <DropDownPicker
              items={areas()}
              dropDownMaxHeight={300}
              searchable={true}
              searchablePlaceholder="Søk ..."
              searchableError="Finner ikke kommunen"
              placeholder="Søk etter kommune ..."
              containerStyle={{ height: 40 }}
              onChangeItem={item => setSelectedArea(item)}
            ></DropDownPicker>
          </View>
        </View>
      )}
    </BadetassContext.Consumer>
  );
};

export default AreaSelector;
