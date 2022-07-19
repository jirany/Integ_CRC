import * as React from "react";
import PAST from "./PAST";
import {useEffect, useState, useRef} from "react";
import {useQuery} from "react-query";
import {CircularProgress} from "@mui/material";
import * as enslaved_options_flat from "../util/enslaved_options.json"
import * as enslaver_options_flat from "../util/enslaver_options.json"
import { enslaver_var_list } from "./vars";
import { enslaved_var_list } from "./vars";
// import { columnOptions } from '../VoyagePage/Result/Table/tableVars';
// import * as options_flat from '../util/options.json'
const auth_token = process.env.REACT_APP_AUTHTOKEN
const base_url = process.env.REACT_APP_BASEURL;

export const PASTContext = React.createContext({});

export default function PASTApp(props) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);
  const [info, setInfo] = useState([]);
  const [typeForTable, setTypeForTable] = useState("slaves");
  const [queryData, setQueryData] = React.useState({
    slaves: [],
    type: "slaves",
    enslavers:[]
  })

  const windowRef = useRef(null);

  const [data, setData] = useState([]);

  const [endpoint, setEndpoint] = useState((() => {
    switch (typeForTable) {
      case "slaves": return "past/enslaved/"
      case "enslavers": return "past/enslavers/"
    }
  })())

  // const options_flat = () => {
  //   switch (typeForTable){
  //     case "slaves": return enslaved_options_flat
  //     case "enslavers": return enslaver_options_flat
  //   }
  // }
  const options_flat = typeForTable === "slaves" ? enslaved_options_flat : enslaver_options_flat;
  const nested_tree = typeForTable === "slaves" ? enslaved_var_list : enslaver_var_list;

  

  // const nested_tree = () => {
  //   switch (typeForTable) {
  //     case "slaves": return enslaved_var_list
  //     case "enslavers": return enslaver_var_list
  //   }
  // }
  // const {isLoading: isLoading_tree, error: error_tree, data: options_tree} = useQuery('past_option_tree',
  //   () => fetch(base_url + endpoint, {
  //     method: "OPTIONS",
  //     headers: {'Authorization': auth_token}
  //   }).then(res => res.json()), {refetchOnMount: "always"}
  // )
  // const {isLoading: isLoading_flat, error: error_flat, data: options_flat} = useQuery('past_options_flat',
  //   () => fetch(base_url + endpoint + "?hierarchical=false", {
  //     method: "OPTIONS",
  //     headers: {'Authorization': auth_token}
  //   }).then(res => res.json()), {refetchOnMount: "always"}
  // )

  useEffect(()=>{
    setEndpoint((() => {
      switch (typeForTable) {
        case "slaves": return "past/enslaved/"
        case "enslavers": return "past/enslavers/"
      }
    })())
    // console.log("queryData.type", typeForTable)
  }, [typeForTable])

  useEffect(() => {
    const endpoint = (() => {
      switch (queryData.type) {
        case "slaves": return "past/enslaved/"
        case "enslavers": return "past/enslavers/"
      }
    })()
    const targets = (() => {
      switch (queryData.type) {
        case "slaves": return queryData.slaves
        case "enslavers": return queryData.enslavers
      }
    })()
    const fetchData = async ()=> {
      const promises = targets.map(target => {
        let queryData = new FormData();
        queryData.append("id", target.toString());
        queryData.append("id", target.toString());
        return fetch(base_url + endpoint, {
          method: "POST",
          body: queryData,
          headers: {'Authorization': auth_token}
        }).then(res => res.json()).then(res => res[0])
      })
      const response = await Promise.all(promises)
      setData(response)
    }
    fetchData().catch(console.error);
  }, [queryData])

  // const menu_label = {
  //   "post_disembark_location": "Post Disembark Location",
  //   "voyage": "Voyage",
  //   "age": "Age",
  //   "captive_fate": "Captive Fate",
  //   "captive_status": "Captive Status",
  //   "documented_name": "name",
  //   "id": "Id",
  //   "transactions": "Transactions",
  //   "sources": "sources"
  // }


  const [search_object, set_search_object] = useState({
    'dataset':["1", "1"]
  })

  const [chipData, setChipData] = React.useState({});
  // if (error_flat) return 'An error has occurred on option flat: ' + error_flat.message
  // if (error_tree) return 'An error has occurred on option tree: ' + error_tree.message
  // if (isLoading_flat || isLoading_tree) return <CircularProgress/>
  return (
    <PASTContext.Provider value={{
      queryData, setQueryData, data,
      nested_tree, options_flat, search_object, set_search_object,
       endpoint, setEndpoint, windowRef, typeForTable, setTypeForTable,
      modal: false, id, setId, open, setOpen, info, setInfo, chipData, setChipData
    }}>
      <PAST/>
    </PASTContext.Provider>
  )
}