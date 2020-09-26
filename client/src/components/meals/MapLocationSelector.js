import React from "react"
import { Component } from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import Geocode from "react-geocode";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import backArrowIcon from "../../resources/back_arrow.svg"
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import GoogleMaps from "../layout/AutoCompleteField"
import PlacesAutocomplete from "react-places-autocomplete";

import 'react-google-places-autocomplete/dist/index.min.css';

export const GOOGLE_MAPS_API_KEY = "AIzaSyBxcuGXRxmHIsiI6tDQDVWIgtGkU-CHZ-4";

Geocode.setApiKey(GOOGLE_MAPS_API_KEY);

class MapLocationSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultLocation: this.props.defaultLocation,
      location: this.props.defaultLocation
    };
  };
  componentDidMount() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {

        const p = { lng: position.coords.longitude, lat: position.coords.latitude };

        console.log(`geolocation is:  ${JSON.stringify(p)}`);
        //
        Geocode.fromLatLng(p.lat, p.lng).then(
          response => {
            console.log("fromLatLng.");
            const addr = response.results[0].formatted_address;
            console.log("onMarkerDragEnd, address: " + addr);
            this.props.handleLocationUpdate(
              { defaultLocation: p, address: addr, location: p });
          },
          error => {
            console.error(error);
          }
        )
        .catch(err => {
          console.error(`getCurrentPosition failed: ${err}`);
        });
      });
    }
    else {
      console.log("geolocation is not available.");
    }
  }
  onMarkerDragEnd = (event) => {
    let lat = event.latLng.lat(),
      lng = event.latLng.lng();
    Geocode.fromLatLng(lat, lng).then(
      response => {
        console.log("fromLatLng.");
        const addr = response.results[0].formatted_address;
        console.log("onMarkerDragEnd, address: " + addr);
        this.props.handleLocationUpdate({ address: addr, location: { lng, lat } });
        this.setState({ address: addr, location: { lng, lat } });
      },
      error => {
        console.error(error);
      }
    )
    .catch(err => {
      console.error(`fromLatLng failed: ${err}`);
    });
  };

  onAutoCompleteSelect = (event) => {
    const addr = event.description;
    console.log(addr);
    console.log("event: " + event);
    //setAddress(addr);
    this.setState({ address: addr });
    Geocode.fromAddress(addr)
      .then(response => {
        const { lat, lng } = response.results[0].geometry.location;
        this.props.handleLocationUpdate({ address: event.description, location: { lng, lat } });
        this.setState({ location: { lng, lat } });
        console.log("onAutoCompleteSelect:" + JSON.stringify(this.state.location));
        this.props.handleExit();
      },
        error => {
          console.error(`error in onAutoCompleteSelect ${JSON.stringify(error)}`);
        })
      .catch((error) => {
        console.error(`onAutoCompleteSelect failed: ${JSON.stringify(error)}`);
      }
      );
  }
  addressClickHandle = () => {
    this.props.handleExit();
  }

  render() {
    return (
      <span className="main">
        <span className="autocomplete-bar">
          <img onClick={this.props.handleExit}
            className="autocomplete-icon" src={backArrowIcon} alt="Close map" />
          <GooglePlacesAutocomplete className="autocomplete-span"
            onSelect={this.onAutoCompleteSelect}
            initialValue={this.state.address}
            query={{
              key: GOOGLE_MAPS_API_KEY,
              language: 'en',
            }}>
          </GooglePlacesAutocomplete>
        </span>
        {/* <GoogleMaps InitialValue="Ramat Gan" /> */}

        <MapWithMarker
          onDragEnd={this.onMarkerDragEnd}
          defaultLocation={{
            lng: this.state.defaultLocation.lng,
            lat: this.state.defaultLocation.lat
          }}
          location={{
            lng: this.state.location.lng,
            lat: this.state.location.lat
          }}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div className="map-with-marker-container" />}
          mapElement={<div style={{ height: `90vh`, top: `10vh` }} />}
          googleMapURL={`https://maps.googleapis.com/maps/api/js?libraries=places&key=${GOOGLE_MAPS_API_KEY}`}
        />
      </span>
    )
  };
}

const MyGoogleMap = (props) => <GoogleMap
  defaultZoom={8}
  defaultCenter={{ lat: props.defaultLocation.lat, lng: props.defaultLocation.lng }}
>
  <Marker
    draggable
    defaultPosition={{ lat: props.defaultLocation.lat, lng: props.defaultLocation.lng }}
    onDragEnd={props.onDragEnd}
  />
</GoogleMap>;

const MapWithMarker = withScriptjs(withGoogleMap(MyGoogleMap));


export default MapLocationSelector;