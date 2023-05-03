import {useState, useEffect} from 'react'
import QueryBox from '../components/querybox.jsx'
import SymptomsHolder from '../components/symptomsholder.jsx'

export default function HomePage() {
  	const [isLoading, setLoading] = useState(false)
  	const [searchResponse, setSearchResponse] = useState(false)
	const [proposedHolder,setProposedHolder]=useState([])
	const [selectedHolder,setSelectedHolder]=useState([])
	const [symptomsHolder,setSymptomsHolder]=useState([])
	function beginSearch(searchText) {
		console.log("beginning search")
    		setLoading(true)
    		fetch('/api/elastic',{
	    		headers: {"Content-Type": "application/json"},
	    		method: "POST",
	    		body: JSON.stringify({
				"cmd":"_search",
				"q": {
					"query": {
						"combined_fields": {
							"query":searchText,
							"fields":["lbl","synonyms"],
							"operator":"and"
						}
					}
				}
	    		})
      		 })
      		 .then((res) => res.json())
      		 .then((data) => {
			//use splice to remove existing
			let data1=data.hits.hits.map(i=>i._source).filter(i=>!symptomsHolder.find(i=>i.id))
			setSymptomsHolder(data1.map(i=> { return { ...i, ...{"container":"proposed"} } }));
        		setLoading(false)
      		})
        	if (isLoading) return <p>Loading...</p>
        	if (!symptomsHolder) return <p>No data</p>
	}
	return(
		<>
		<QueryBox beginSearch={beginSearch}/>
	    	<SymptomsHolder id="proposed" dragDrop={dragDrop} holder={symptomsHolder}  />
	    	<div style={{height:'20px', clear:'both' }} />
	    	<SymptomsHolder id="selected" dragDrop={dragDrop} holder={symptomsHolder} />
		</>
	)
	function dragDrop(e) {
		var boxid=e.dataTransfer.getData("text/plain")
		let boxinfo=symptomsHolder.find( i => i.id===boxid)
		let src=boxinfo.container//document.getElementById(boxid).parentElement.id
		let target=e.currentTarget.id
		if (src!=target) {
		 e.preventDefault()
		 let holderclone = symptomsHolder.map (x => {
		  if(x.id==boxid) {
		   x.container=target
		  }
		  return x
		 }) //clone
		 setSymptomsHolder(holderclone)
	        }
	}
}
