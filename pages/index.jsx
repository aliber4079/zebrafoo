import {useState, useEffect} from 'react'
import QueryBox from '../components/querybox.jsx'

export default function HomePage() {
  	const [isLoading, setLoading] = useState(false)
  	const [searchResponse, setSearchResponse] = useState(false)
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
			let synonyms=data.hits.hits[0]._source?.synonyms
			setSearchResponse(synonyms)
        		setLoading(false)
      		 })
        	if (isLoading) return <p>Loading...</p>
        	if (!searchResponse) return <p>No data</p>
	}
	return(
		<>
		<QueryBox beginSearch={beginSearch}/>
		</>
	)
}
