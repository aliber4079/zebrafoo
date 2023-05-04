import styles from './symptomsholder.module.css';
import SymptomBox from './symptombox.jsx';

export default function SymptomsHolder ({dragDrop, id, symptomsHolder,setSymptomsHolder, title}) {
	let content=[]
	symptomsHolder=symptomsHolder.filter(i=>i.container==id)
	for (let i=0; i<symptomsHolder.length;i++){
	  content.push(<SymptomBox hits={symptomsHolder[i]} deleteMe={deleteMe} />)
	}
	return (
		<div style={{"float":"left"}}>
		<div>{title}</div>
	<div id={id} className={styles.symptomsholder} 
		 onDragOver={e=>{
		   if (e.target.parentElement.id!=e.currentTarget.id) {
		     e.preventDefault()
		   }
		}
	      } onDrop={e=>{dragDrop(e)}}>
		{content}
	</div>
		</div>
	)
	function deleteMe(id) {
		let tmpholder=[...symptomsHolder]
		tmpholder=tmpholder.filter(i=>i.id!=id)
		setSymptomsHolder(tmpholder)
		console.log("delete " + id, tmpholder)
	}
}
