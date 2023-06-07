import {useState, useEffect} from 'react'
import styles from './differential.module.css'

export default function Differential({title, symptomsHolder}) {
	const [diffData,setDiffData] = useState([])
	const [diffStatus,setDiffStatus] = useState("")
	useEffect(() => {
		 let subqueries={}
		 let classifications=["filter","must_not","should"]
		let keyon="Disorder.HPODisorderAssociationList.HPODisorderAssociation.HPO.HPOId"
		 for (let i in classifications) {
		  let qual=classifications[i]
		  let holderclone=symptomsHolder.map(x=>x)
		  if (holderclone.filter(x=>x.container=="symptoms_"+qual).length==0) {
			  continue
		  }
		  subqueries[qual]=holderclone.filter(k=>k.container=="symptoms_"+qual).map(x=>{return {"match":{
			  [keyon]: x.id.replace("HP_","HP:")
		  }
		  }});
		 }
		 if(Object.keys(subqueries).length==0) {
			 setDiffData([])
			 return
		 }
		  let holderclone=symptomsHolder.map(x=>x)
		  let check_for_excluded=holderclone.filter(x=>{
				 return (x.container!=="proposed")
		 }).map(x=>{ return {"match":{
			"Disorder.freq_agg.28440": x.id.replace("HP_","HP:")
		 }
		 }})
		 
		 if (subqueries["must_not"]==null) {
		   subqueries["must_not"]=check_for_excluded
		 } else {
		   for(let i=0;i<check_for_excluded.length;i++) {
		    subqueries["must_not"].push(check_for_excluded[i])
		   }
		 }
		 let query={"query": {
			 "bool": subqueries
		 }}

		 console.log(JSON.stringify(query))
		 setDiffStatus("computing differential")
		 fetch('/api/elastic',{
	    		headers: {"Content-Type": "application/json"},
	    		method: "POST",
	    		body: JSON.stringify({
				"cmd":"diseases/_search",
				"q": query
				}
		 	)
	        })
      		 .then((res) => res.json())
      		 .then((data) => { 
			 setDiffData(data) 
			 if (!data.hits) {
				 setDiffStatus("no results")
			 } else {
				 setDiffStatus(data.hits.hits.length + " result(s)")
			 }

		 })
	},[symptomsHolder])
	let diffMarkup=null
	if (!diffData.hits) {
	diffMarkup=<li/>
	} else {
	diffMarkup=diffData.hits.hits.map(x=><li>{x._source.Disorder.Name} <a target="_blank" className={styles.external} href={x._source.Disorder.ExpertLink}/></li>)
	}
	return (<>
		 <div style={{"float":"left"}}>
		  <div>{title} {diffStatus}</div>
		 <div id="differential" className={styles.differential} >
		 <ul>
		  {diffMarkup}
		 </ul>
		</div>
		</div>
		</>
	)
}
