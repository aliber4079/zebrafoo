import {useState, useEffect} from 'react'
import QueryBox from '../components/querybox.jsx'
import SymptomsHolder from '../components/symptomsholder.jsx'
import Differential from '../components/differential.jsx'

export default function HomePage() {
  	const [queryStatus, setQueryStatus] = useState("OK")
  	const [searchResponse, setSearchResponse] = useState(false)
	const [proposedHolder,setProposedHolder]=useState([])
	const [selectedHolder,setSelectedHolder]=useState([])
	const [symptomsHolder,setSymptomsHolder]=useState([])
	function beginSearch(searchText) {
		setQueryStatus("Searching...")
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
			if (data.hits.hits.length==0) {
			 setQueryStatus("no results")
			 return
			}
			let searched_words=[...data.hits.hits.map(i=>i._source)]
			//searched words will always start in the proposed box
			searched_words=searched_words.map(i=>{
				return{...i, ...{"container":"proposed"} }
			})
			let searched_words_filtered=searched_words.filter(i=>!symptomsHolder.find(j=>i.id==j.id))
			setQueryStatus(searched_words_filtered.length + " result(s)")
			//clear out old proposed symptoms
			let tmpHolder=(symptomsHolder.filter(i=>i.container!=="proposed"))
			tmpHolder=[...searched_words_filtered,...tmpHolder]
			setSymptomsHolder(tmpHolder)

      		})
	}
	return(
		<>
		<QueryBox beginSearch={beginSearch} queryStatus={queryStatus}/>
	    	<SymptomsHolder title="results of symptom search" id="proposed" dragDrop={dragDrop} symptomsHolder={symptomsHolder} setSymptomsHolder={setSymptomsHolder} />
	    	<SymptomsHolder title="symptoms must not match" id="symptoms_must_not" dragDrop={dragDrop} symptomsHolder={symptomsHolder} setSymptomsHolder={setSymptomsHolder} />
	    	<SymptomsHolder title="symptoms should match" id="symptoms_should" dragDrop={dragDrop} symptomsHolder={symptomsHolder} setSymptomsHolder={setSymptomsHolder} />
	    	<SymptomsHolder title="symptoms must match" id="symptoms_must" dragDrop={dragDrop} symptomsHolder={symptomsHolder} setSymptomsHolder={setSymptomsHolder} />
		<Differential title="differential" symptomsHolder={symptomsHolder} />
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
		 //differential?
		}
	}
}
