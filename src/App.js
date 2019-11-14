import React, { useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';
import axios from 'axios'
import './App.scss'

const App = () => {
  const mapRef = useRef();
  const key = "f71397456f83bd9ef4afa2721a6cafb4b3e9d010"
  const baseUrl = "https://api.census.gov/data/2013/language?get=LANLABEL,LAN7,EST"

  useEffect(
    () => {
      // lazy load the required ArcGIS API for JavaScript modules and CSS
      loadModules(['esri/Map',
        'esri/views/MapView',
        "esri/layers/GeoJSONLayer",
        "esri/PopupTemplate",
        "esri/widgets/Popup",
        "esri/widgets/LayerList"],
        { css: true })
        .then(([Map, MapView, GeoJSONLayer, PopupTemplate, Popup,
          LayerList]) => {


          const statesTemplate = new PopupTemplate({
            title: "{NAME}",
            content: function (evt) {
              const state = evt.graphic.attributes.STATE
              return axios.get(`${baseUrl}&for=state:${state}&key=${key}`).then(res => {
                console.log(res.data)
                return `${res.data[2][0]}`
              })
            }
          })

          const usOutline = new GeoJSONLayer({
            title: "United States",
            url: './us_outline.json'
          })
          const usStates = new GeoJSONLayer({
            title: "States",
            url: './us_states.json',
            popupTemplate: statesTemplate
          })
          const usCongressional = new GeoJSONLayer({
            title: "United States Congressional",
            url: './us_congressional.json'
          })
          const usCounties = new GeoJSONLayer({
            title: "United States Counties",
            url: './us_counties.json'
          })

          const map = new Map({
            basemap: 'gray',
            layers: [usOutline, usStates]
          });

          // load the map view at the ref's DOM node
          const view = new MapView({
            container: mapRef.current,
            map: map,
            center: [-100.233554, 37.426343],
            zoom: 5,
          });

          const layerList = new LayerList({
            view: view
          })

          view.ui.add(layerList, {
            position: "top-right"
          })

          return () => {
            if (view) {
              // destroy the map view
              view.container = null;
            }
          };
        });
    }
  );

  return <div className="webmap" ref={mapRef} />;
}
export default App