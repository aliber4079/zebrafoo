import {useState, useEffect} from 'react'
import QueryBox from '../components/querybox.jsx'
import SymptomsHolder from '../components/symptomsholder.jsx'

export default function HomePage() {
  	const [isLoading, setLoading] = useState(false)
  	const [searchResponse, setSearchResponse] = useState(false)
	const [proposedHolder,setProposedHolder]=useState([])
	const [selectedHolder,setSelectedHolder]=useState([])
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
			setProposedHolder(data.hits.hits.map(i=>i._source))
        		setLoading(false)
      		 })
        	if (isLoading) return <p>Loading...</p>
        	if (!proposedHolder) return <p>No data</p>
	}
	return(
		<>
		<QueryBox beginSearch={beginSearch}/>
	    	<SymptomsHolder id="proposed" dragDrop={dragDrop} holder={proposedHolder}  />
	    	<div style={{height:'20px', clear:'both' }} />
	    	<SymptomsHolder id="selected" dragDrop={dragDrop} holder={selectedHolder} />
		</>
	)
	function dragDrop(e) {
		var boxid=e.dataTransfer.getData("text/plain")
		let src=document.getElementById(boxid).parentElement.id
		//(proposedHolder.find( i => i.id==boxid )!=null ? "proposed" : "selected" )
		let target=e.currentTarget.id
		if (src!=target) {
		 e.preventDefault()
		 let srcHolder=eval(src+"Holder")
		 let srcholderclone = srcHolder.map (x => x) //clone
		 let targetHolder=eval(target + "Holder")
		 let targetholderclone=targetHolder.map ( x => x ) //clone
		 let boxinfo=srcHolder.find( i => i.id===boxid)
		 targetholderclone.push(boxinfo)
		 let boxinfoindexinsrc=srcholderclone.findIndex(i=>i.id==boxid)
		 srcholderclone.splice(boxinfoindexinsrc,1) //remove from source
		 eval(`set${src[0].toUpperCase()+src.slice(1)}Holder(srcholderclone)`) //add
		 eval(`set${target[0].toUpperCase()+target.slice(1)}Holder(targetholderclone)`) 
	        }
	}
}
