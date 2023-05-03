// Main handler function
export default async function handler(req,res) {
  // Run your query
	let cmd=req.body.cmd
	let q=req.body.q
	console.log(cmd,JSON.stringify(q));

  // Run clean up function
	console.log('http://localhost:9200/'+cmd)
  const response = await  fetch('http://localhost:9200/'+cmd,{
            headers: {"Content-Type": "application/json"},
            method: "POST",
            body: JSON.stringify(q)
    })
  const json = await response.json()
  res.status(200).json(json)
}

