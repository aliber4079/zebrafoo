
export default function QueryBox({beginSearch, queryStatus}) {
	var timerno=0
	function startTimer() {
	  return setTimeout(()=>{
		timerno=0
		var whatwastyped=document.getElementById('queryinput').value
		console.log('you typed ',whatwastyped)
		beginSearch(whatwastyped)
	  },3000)
	}
	function timerstuff(e) {
	 if (e.which==13) {
	  if (timerno!=0) {
	   clearTimeout(timerno)
	  }
	  var whatwastyped=document.getElementById('queryinput').value
	  console.log('you typed ',whatwastyped)
	  beginSearch(whatwastyped)
	  return
	 }
	 if (timerno==0) {
	  timerno=startTimer()
	 } else {
	  clearTimeout(timerno)
	  timerno=startTimer()
	 }
	}
	return (
		<>
		<label >
		<p>Click <a target="_blank" href="https://www.zebrafoo.com/zebra/exampleusage.html">here</a> to see a 15 second video showing a sample search</p>
		Enter symptoms one at a time, drag best matches to the appropriate box <p/>
		<input id="queryinput" type="text" onKeyPress={timerstuff} />
		</label>
		<p>status: {queryStatus}</p>
		</>
	)
}
