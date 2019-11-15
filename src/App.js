import React, { useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';
import { statesRender, congressRender, usRender, countyRender } from "./Fill Colors/fillColors"
import { state, county } from "./Templates/template"
import './App.scss'

const App = () => {
  const mapRef = useRef();

  useEffect(
    () => {
      loadModules(['esri/Map',
        'esri/views/MapView',
        "esri/layers/GeoJSONLayer",
        "esri/PopupTemplate",
        "esri/widgets/LayerList"],
        { css: true })
        .then(([Map, MapView, GeoJSONLayer, PopupTemplate,
          LayerList]) => {

          const statesTemplate = new PopupTemplate(state)

          const countyTemplate = new PopupTemplate(county)

          const usOutline = new GeoJSONLayer({
            title: "United States",
            url: './us_outline.json',
            maxScale: 6000000,
            renderer: usRender
          })
          const usStates = new GeoJSONLayer({
            title: "States",
            url: './us_states.json',
            popupTemplate: statesTemplate,
            maxScale: 9999999,
            renderer: statesRender
          })
          const usCongressional = new GeoJSONLayer({
            title: "United States Congressional",
            url: './us_congressional.json',
            popupTemplate: statesTemplate,
            minScale: 10000000,
            maxScale: 6000001,
            renderer: congressRender

          })
          const usCounties = new GeoJSONLayer({
            title: "United States Counties",
            url: './us_counties.json',
            popupTemplate: countyTemplate,
            minScale: 6000000,
            renderer: countyRender
          })

          const map = new Map({
            basemap: 'gray',
            layers: [usOutline, usStates, usCongressional, usCounties]
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

  return <div>
    <div className="webmap" ref={mapRef} />
    <div className="contact-info">
      <div className="inner-box">
        <h3>Erik Sandoval</h3>
        <a href="https://github.com/erik-sandoval/arcgis-census-map" rel="noopener noreferrer" target="_blank"><i class="fab fa-github"></i>Github Repo</a>
      </div>
    </div>
  </div>;
}
export default App