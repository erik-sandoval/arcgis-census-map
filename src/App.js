import React, { useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';
import './App.scss'

const App = () => {
  const mapRef = useRef();

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
        .then(([ArcGISMap, MapView, GeoJSONLayer, PopupTemplate, Popup,
          LayerList]) => {


          const statesTemplate = new PopupTemplate({
            content: "hello"
          })
          const usOutline = new GeoJSONLayer({
            title: "United States",
            url: './us_outline.json'
          })
          const usStates = new GeoJSONLayer({
            title: "States",
            url: './us_states.json',
            PopupTemplate: statesTemplate
          })
          const usCongressional = new GeoJSONLayer({
            title: "United States Congressional",
            url: './us_congressional.json'
          })
          const usCounties = new GeoJSONLayer({
            title: "United States Counties",
            url: './us_counties.json'
          })

          const map = new ArcGISMap({
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

          view.popup.on('click', function (evt) {
            console.log(evt)
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