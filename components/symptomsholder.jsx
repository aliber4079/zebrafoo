import styles from './symptomsholder.module.css';
import SymptomBox from './symptombox.jsx';

export default function SymptomsHolder ({dragDrop, id, holder, title}) {
	let content=[]
	holder=holder.filter(i=>i.container==id)
	for (let i=0; i<holder.length;i++){
	  content.push(<SymptomBox hits={holder[i]} />)
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
}
