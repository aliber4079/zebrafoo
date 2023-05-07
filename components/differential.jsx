import {useState, useEffect} from 'react'
import styles from './differential.module.css'

export default function Differential({title, symptomsHolder}) {
	const [diffData,setDiffData] = useState([])
	useEffect(() => {
		 let subqueries={}
		 let classifications=["filter","must_not","should"]
		let keyon="HPODisorderSetStatus.Disorder.HPODisorderAssociationList.HPODisorderAssociation.HPO.HPOId"
		 for (let i in classifications) {
		  let qual=classifications[i]
		  let holderclone=symptomsHolder.map(x=>x)
		  if (holderclone.filter(x=>x.container=="symptoms_"+qual).length==0) {
			  continue
		  }
		  subqueries[qual]=holderclone.filter(k=>k.container=="symptoms_"+qual).map(y=>y.id.substring(y.id.indexOf("_")+1)).map(x=>{return {"match":{
			  [keyon]: x
		  }
		  }});
		 }
		 if(Object.keys(subqueries).length==0) {
			 setDiffData([])
			 return
		 }
		 let query={"query": {
			 "bool": subqueries
		 }}

		 console.log(JSON.stringify(query))
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
      		 .then((data) => { setDiffData(data) })
	},[symptomsHolder])
	let diffMarkup=null
	if (!diffData.hits) {
	diffMarkup=<li/>
	} else {
	diffMarkup=diffData.hits.hits.map(x=><li>{x._source.HPODisorderSetStatus[0][4].Disorder[0][3].Name}</li>)
	}
	return (<>
		 <div style={{"float":"left"}}>
		  <div>{title}</div>
		 <div id="differential" className={styles.differential} >
		 <ul>
		  {diffMarkup}
		 </ul>
		</div>
		</div>
		</>
	)
}
