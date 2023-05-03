import styles from './symptomsholder.module.css';
import SymptomBox from './symptombox.jsx';

export default function SymptomsHolder ({dragDrop, id, holder}) {
	let content=[]
	for (let i=0; i<holder.length;i++){
	  content.push(<SymptomBox hits={holder[i]} />)
	}
	return (
	<div id={id} className={styles.symptomsholder} 
		 onDragOver={e=>{
		   var boxid=e.dataTransfer.getData('text/plain')
		   if (1!=e.currentTarget.id) {
		     e.preventDefault()
		   }
		}
	      } onDrop={e=>{dragDrop(e)}}>
		{content}
	</div>
	)
}
